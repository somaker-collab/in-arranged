import { tinyfishRequest } from './client';

export async function createTinyFishMonitor(url: string, webhookUrl: string, frequency: string = 'daily') {
  return tinyfishRequest('/monitors', {
    method: 'POST',
    body: JSON.stringify({ url, webhook_url: webhookUrl, frequency }),
  });
}

export async function deleteTinyFishMonitor(monitorId: string) {
  return tinyfishRequest(`/monitors/${monitorId}`, { method: 'DELETE' });
}