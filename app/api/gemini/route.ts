import { NextResponse } from 'next/server';
import { GeminiAgentService } from '@/lib/gemini';

export async function GET() {
  const startTime = Date.now();
  try {
    const result = await GeminiAgentService.generateAgentStep({
      modelId: 'gemini-3.7-flash',
      systemInstruction: 'You are the Gemini health probe.',
      prompt: 'Respond with exactly: "Google Gemini API is healthy and connected."'
    });

    const duration = Date.now() - startTime;

    return NextResponse.json({
      status: result.is_live_api ? 'operational' : 'simulation_fallback',
      is_live_api: result.is_live_api,
      model_used: result.model_used,
      response: result.response,
      latency_ms: duration,
      timestamp: new Date().toISOString()
    }, { status: result.is_live_api ? 200 : 206 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      status: 'error',
      error: message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
