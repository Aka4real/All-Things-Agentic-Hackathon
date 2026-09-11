import { NextRequest, NextResponse } from 'next/server';
import { EnterpriseMCPGateway } from '@/lib/mcp-gateway';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { endpoint_url, auth_header } = body;

    if (!endpoint_url) {
      return NextResponse.json(
        { success: false, error: 'Field "endpoint_url" is required for MCP schema discovery.' },
        { status: 400 }
      );
    }

    const discovery = await EnterpriseMCPGateway.discoverToolsFromEndpoint(endpoint_url, auth_header);

    return NextResponse.json({
      success: discovery.success,
      endpoint_url,
      tools_count: discovery.tools.length,
      tools: discovery.tools,
      latency_ms: discovery.latency_ms,
      error: discovery.error,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Discovery failed' },
      { status: 500 }
    );
  }
}
