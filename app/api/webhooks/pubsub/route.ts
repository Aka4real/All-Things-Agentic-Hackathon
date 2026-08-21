import { NextRequest, NextResponse } from 'next/server';
import { ModelArmor } from '@/lib/model-armor';
import { MemoryBankService } from '@/lib/memory-bank';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Google Cloud Pub/Sub message envelope format
    const message = body.message;
    if (!message || !message.data) {
      return NextResponse.json({ error: 'Invalid Pub/Sub envelope format' }, { status: 400 });
    }

    const decodedData = Buffer.from(message.data, 'base64').toString('utf-8');
    let parsedPayload: Record<string, unknown>;
    try {
      parsedPayload = JSON.parse(decodedData);
    } catch {
      parsedPayload = { raw: decodedData };
    }

    // Pass through Model Armor inspection
    const armorScan = ModelArmor.scan(JSON.stringify(parsedPayload));

    if (!armorScan.is_clean) {
      return NextResponse.json({
        status: 'blocked_by_model_armor',
        threats: armorScan.threats_detected,
        event_id: armorScan.security_event?.id
      }, { status: 403 });
    }

    // Ingest into Memory Bank if payload contains event context
    if (parsedPayload.vendor_id && parsedPayload.event_type) {
      MemoryBankService.addMemory({
        entity_name: String(parsedPayload.vendor_name || 'PubSub Ingested Vendor'),
        entity_id: String(parsedPayload.vendor_id),
        entity_type: 'audit_finding',
        memory_key: String(parsedPayload.event_type),
        content: `Asynchronous Pub/Sub Telemetry Event: ${JSON.stringify(parsedPayload)}`,
        confidence_score: 0.98,
        metadata: { source: 'Google Cloud Pub/Sub Webhook', message_id: message.messageId }
      });
    }

    return NextResponse.json({
      status: 'acknowledged',
      message_id: message.messageId,
      model_armor_status: 'CLEAN',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Pub/Sub webhook processing failed:', error);
    return NextResponse.json({ error: 'Internal processing error' }, { status: 500 });
  }
}
