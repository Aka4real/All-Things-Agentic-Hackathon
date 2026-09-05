import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'fortress-fleet-runtime',
    platform: 'Google Cloud Run (Scale-to-Zero)',
    model_backbone: 'Google Gemini 3.8 Flash',
    guardrails: 'Model Armor + Gemma 4 Heuristics',
    telemetry: 'OpenTelemetry v1.28 Active',
    timestamp: new Date().toISOString()
  });
}
