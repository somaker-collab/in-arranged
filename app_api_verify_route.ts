import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Record from '@/models/Record';
import VerificationHistory from '@/models/VerificationHistory';
import { NepalMedicalCouncilAdapter } from '@/lib/registry/nepal-medical-council';
// import other adapters...

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { name, record_type, jurisdiction, registration_number } = body;

    // Factory logic
    let adapter;
    if (jurisdiction === 'Nepal' && record_type === 'medical_licence') {
      adapter = new NepalMedicalCouncilAdapter();
    } else {
      return NextResponse.json({ error: 'Unsupported jurisdiction or record type' }, { status: 400 });
    }

    // 1. Run TinyFish Agent
    const result = await adapter.verify({ name, record_type, jurisdiction, registration_number });

    if (result.matches.length === 0) {
      return NextResponse.json({ success: true, outcome: 'not_found', matches: [] });
    }

    if (result.matches.length > 1) {
      // Multiple matches ambiguity handling
      return NextResponse.json({ success: true, outcome: 'multiple_matches', matches: result.matches });
    }

    const match = result.matches[0];

    // Single clear match. Save to database.
    const record = await Record.create({
      name: match.name,
      record_type,
      jurisdiction,
      registry: adapter.registryName,
      registration_number: match.registration_number || 'Not published',
      status: match.status,
      original_status: match.original_status,
      source_url: match.source_url,
      disciplinary_actions: match.disciplinary_actions || [],
      match_confidence: 'confirmed',
      verification_outcome: 'verified',
    });

    await VerificationHistory.create({
      record_id: record._id,
      new_status: record.status,
      source_url: record.source_url,
      change_summary: 'Initial verification',
    });

    return NextResponse.json({ success: true, outcome: 'verified', verification: record });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}