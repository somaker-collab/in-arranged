import Monitor from '@/models/Monitor';
import Record from '@/models/Record';
import WebhookEvent from '@/models/WebhookEvent';
import VerificationHistory from '@/models/VerificationHistory';
import Alert from '@/models/Alert';
import { TinyFishClient } from '../tinyfish/client';

export async function setupMonitor(recordId: string) {
  const record = await Record.findById(recordId);
  if (!record) throw new Error('Record not found');

  const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/tinyfish`;
  const tfMonitor = await TinyFishClient.createMonitor(record.source_url, webhookUrl, 'daily');

  const monitor = await Monitor.create({
    record_id: record._id,
    tinyfish_monitor_id: tfMonitor.id,
    source_url: record.source_url,
    schedule: 'daily',
  });
  return monitor;
}

export async function processWebhook(payload: any, eventId: string) {
  // Idempotency check
  const existingEvent = await WebhookEvent.findOne({ event_id: eventId });
  if (existingEvent) return;

  await WebhookEvent.create({ event_id: eventId, monitor_id: payload.monitor_id, event_payload: payload });

  const monitor = await Monitor.findOne({ tinyfish_monitor_id: payload.monitor_id });
  if (!monitor) return;

  const record = await Record.findById(monitor.record_id);
  
  // Here we use TinyFish Fetch to get the current state and compare
  // For the sake of the webhook, assume payload.extracted_data contains the new state
  const newData = payload.extracted_data; 
  
  if (newData.status !== record.status || newData.registration_number !== record.registration_number) {
    // Meaningful change detected
    const changeSummary = `Status changed from ${record.status} to ${newData.status}`;
    
    await VerificationHistory.create({
      record_id: record._id,
      previous_status: record.status,
      new_status: newData.status,
      previous_data: record.toObject(),
      new_data: newData,
      source_url: monitor.source_url,
      change_summary: changeSummary
    });

    await Alert.create({
      record_id: record._id,
      alert_type: 'STATUS_CHANGE',
      previous_value: record.status,
      new_value: newData.status,
      message: changeSummary,
      source_url: monitor.source_url
    });

    // Update Record
    record.status = newData.status;
    record.original_status = newData.original_status;
    record.checked_at = new Date();
    await record.save();
  }

  monitor.last_checked_at = new Date();
  await monitor.save();
}