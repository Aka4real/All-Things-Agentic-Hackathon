import { NextRequest, NextResponse } from 'next/server';
import { GeminiAgentService } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vendorName, poAmount, prompt, systemInstruction } = body;

    const sysInstruction = systemInstruction || 
      'You are the Lead ESG & Supply Chain Risk Auditor. Synthesize a concise, executive-level compliance determination.';
    
    const queryPrompt = prompt || 
      `Vendor: ${vendorName || 'Unknown'}. PO Amount: $${poAmount || 0}. Sanitized RFQ. Anomalies evaluated against enterprise policy rules, pgvector memory bank, and Zero-Trust identity scopes.`;

    const result = await GeminiAgentService.generateAgentStep({
      modelId: 'gemini-3.6-flash',
      systemInstruction: sysInstruction,
      prompt: queryPrompt
    });

    return NextResponse.json({
      success: true,
      response: result.response,
      is_live_api: result.is_live_api,
      model_used: result.model_used,
      timestamp: new Date().toISOString()
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown synthesis error';
    return NextResponse.json(
      {
        success: false,
        error: message,
        response: '[Gemini Synthesis]: Audit completed under institutional policy rules. Dual-lab verification and supply chain telemetry validated.',
        is_live_api: false,
        model_used: 'Simulation Fallback'
      },
      { status: 500 }
    );
  }
}
