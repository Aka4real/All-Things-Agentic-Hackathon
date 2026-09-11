import { NextRequest, NextResponse } from 'next/server';
import { EnterpriseMCPGateway } from '@/lib/mcp-gateway';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const server = await EnterpriseMCPGateway.getServerById(id);

    if (!server) {
      return NextResponse.json(
        { success: false, error: `Enterprise MCP Server with ID '${id}' not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      server,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve MCP server' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await EnterpriseMCPGateway.deleteServer(id);

    return NextResponse.json({
      success: deleted,
      message: `Enterprise MCP Server '${id}' disconnected and removed from registry.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete MCP server' },
      { status: 500 }
    );
  }
}
