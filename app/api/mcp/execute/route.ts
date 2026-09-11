import { NextRequest, NextResponse } from 'next/server';
import { EnterpriseMCPGateway } from '@/lib/mcp-gateway';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { server_id, tool_name, arguments: args, caller_agent_slug } = body;

    if (!server_id || !tool_name) {
      return NextResponse.json(
        { success: false, error: 'Both "server_id" and "tool_name" are required.' },
        { status: 400 }
      );
    }

    const execution = await EnterpriseMCPGateway.executeTool({
      server_id,
      tool_name,
      arguments: args || {},
      caller_agent_slug: caller_agent_slug || 'supply-chain-lead',
    });

    return NextResponse.json({
      success: execution.success,
      execution,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Tool execution failed' },
      { status: 500 }
    );
  }
}
