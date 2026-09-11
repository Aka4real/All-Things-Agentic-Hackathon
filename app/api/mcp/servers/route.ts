import { NextRequest, NextResponse } from 'next/server';
import { EnterpriseMCPGateway } from '@/lib/mcp-gateway';

export async function GET() {
  try {
    const servers = await EnterpriseMCPGateway.getAllServers();
    return NextResponse.json({
      success: true,
      count: servers.length,
      servers,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch MCP servers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, endpoint_url, transport, auth_type, auth_header, allowed_agent_slugs, description } = body;

    if (!name || !endpoint_url) {
      return NextResponse.json(
        { success: false, error: 'Both "name" and "endpoint_url" are required.' },
        { status: 400 }
      );
    }

    // Ping and discover tools from the provided enterprise endpoint
    const discovery = await EnterpriseMCPGateway.discoverToolsFromEndpoint(endpoint_url, auth_header);

    const newServer = await EnterpriseMCPGateway.registerServer({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      description: description || `Enterprise MCP connector to ${name}.`,
      endpoint_url,
      transport: transport || 'http',
      auth_type: auth_type || 'bearer',
      auth_header,
      status: discovery.success ? 'online' : 'degraded',
      latency_ms: discovery.latency_ms,
      last_health_check: new Date().toISOString(),
      allowed_agent_slugs: allowed_agent_slugs || ['supply-chain-lead'],
      capabilities: {
        tools: true,
        resources: true,
        prompts: false,
      },
      tools: discovery.tools,
    });

    return NextResponse.json({
      success: true,
      server: newServer,
      tools_discovered: discovery.tools.length,
      message: `Enterprise MCP Server "${name}" successfully registered and ${discovery.tools.length} tools discovered.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to register enterprise MCP server' },
      { status: 500 }
    );
  }
}
