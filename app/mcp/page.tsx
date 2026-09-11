'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Plus, 
  Search, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  RefreshCw, 
  ShieldCheck, 
  Layers, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  Play, 
  X, 
  Globe, 
  Key, 
  Code2, 
  Database,
  ExternalLink,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { EnterpriseMCPServer, MCPToolSchema } from '@/lib/types';
import { EnterpriseMCPGateway } from '@/lib/mcp-gateway';

export default function MCPHubPage() {
  const [servers, setServers] = useState<EnterpriseMCPServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
  const [expandedToolNames, setExpandedToolNames] = useState<Set<string>>(new Set());

  // Connect Modal state
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [serverName, setServerName] = useState('');
  const [endpointUrl, setEndpointUrl] = useState('');
  const [transport, setTransport] = useState<'sse' | 'http'>('sse');
  const [authHeader, setAuthHeader] = useState('');
  const [description, setDescription] = useState('');
  const [allowedAgents, setAllowedAgents] = useState('supply-chain-lead, erp-sap-connector');
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoveredTools, setDiscoveredTools] = useState<MCPToolSchema[]>([]);
  const [discoveryError, setDiscoveryError] = useState<string | null>(null);

  // Execution Sandbox state
  const [testToolModalOpen, setTestToolModalOpen] = useState(false);
  const [activeTestServer, setActiveTestServer] = useState<EnterpriseMCPServer | null>(null);
  const [activeTestTool, setActiveTestTool] = useState<MCPToolSchema | null>(null);
  const [testArgumentsJson, setTestArgumentsJson] = useState('{}');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<any | null>(null);

  const loadServers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/mcp/servers');
      if (res.ok) {
        const data = await res.json();
        setServers(data.servers || []);
        if (data.servers?.length > 0 && !selectedServerId) {
          setSelectedServerId(data.servers[0].id);
        }
      } else {
        const local = await EnterpriseMCPGateway.getAllServers();
        setServers(local);
        if (local.length > 0 && !selectedServerId) setSelectedServerId(local[0].id);
      }
    } catch {
      const local = await EnterpriseMCPGateway.getAllServers();
      setServers(local);
      if (local.length > 0 && !selectedServerId) setSelectedServerId(local[0].id);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServers();
  }, []);

  const handleDiscoverTools = async () => {
    if (!endpointUrl) return;
    setIsDiscovering(true);
    setDiscoveryError(null);
    try {
      const res = await fetch('/api/mcp/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint_url: endpointUrl, auth_header: authHeader }),
      });
      const data = await res.json();
      if (data.success && data.tools) {
        setDiscoveredTools(data.tools);
      } else {
        setDiscoveryError(data.error || 'Failed to read tools from endpoint.');
      }
    } catch (err: any) {
      setDiscoveryError(err.message || 'Discovery connection error.');
    } finally {
      setIsDiscovering(false);
    }
  };

  const handleConnectServer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serverName || !endpointUrl) return;

    try {
      const res = await fetch('/api/mcp/servers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: serverName,
          endpoint_url: endpointUrl,
          transport,
          auth_type: authHeader ? 'bearer' : 'none',
          auth_header: authHeader || undefined,
          description,
          allowed_agent_slugs: allowedAgents.split(',').map((s) => s.trim()).filter(Boolean),
        }),
      });

      if (res.ok) {
        setShowConnectModal(false);
        setServerName('');
        setEndpointUrl('');
        setAuthHeader('');
        setDescription('');
        setDiscoveredTools([]);
        await loadServers();
      }
    } catch (err) {
      console.error('Failed to register MCP server:', err);
    }
  };

  const handleDeleteServer = async (id: string) => {
    if (!confirm('Are you sure you want to disconnect this enterprise MCP server?')) return;
    try {
      await fetch(`/api/mcp/servers/${id}`, { method: 'DELETE' });
      await loadServers();
      if (selectedServerId === id) setSelectedServerId(null);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleOpenTestModal = (server: EnterpriseMCPServer, tool: MCPToolSchema) => {
    setActiveTestServer(server);
    setActiveTestTool(tool);
    // Generate sample arguments from properties
    const sample: Record<string, any> = {};
    if (tool.inputSchema?.properties) {
      for (const [key, prop] of Object.entries(tool.inputSchema.properties)) {
        sample[key] = prop.type === 'number' ? 50000 : prop.type === 'boolean' ? true : `sample_${key}`;
      }
    }
    setTestArgumentsJson(JSON.stringify(sample, null, 2));
    setExecutionResult(null);
    setTestToolModalOpen(true);
  };

  const handleExecuteTest = async () => {
    if (!activeTestServer || !activeTestTool) return;
    setIsExecuting(true);
    setExecutionResult(null);

    let parsedArgs = {};
    try {
      parsedArgs = JSON.parse(testArgumentsJson);
    } catch {
      alert('Invalid JSON in arguments field.');
      setIsExecuting(false);
      return;
    }

    try {
      const res = await fetch('/api/mcp/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          server_id: activeTestServer.id,
          tool_name: activeTestTool.name,
          arguments: parsedArgs,
          caller_agent_slug: 'supply-chain-lead',
        }),
      });
      const data = await res.json();
      setExecutionResult(data.execution || data);
    } catch (err: any) {
      setExecutionResult({ success: false, error: err.message });
    } finally {
      setIsExecuting(false);
    }
  };

  const toggleToolExpand = (name: string) => {
    setExpandedToolNames((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const selectedServer = servers.find((s) => s.id === selectedServerId) || servers[0];

  const filteredServers = servers.filter((s) => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.tools.some((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="surface p-5 sm:p-6 border-blue-500/20 bg-gradient-to-br from-blue-500/[0.03] to-indigo-500/[0.02]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[12px] font-semibold text-blue-500 tracking-wide uppercase flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                Enterprise Extensibility
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-raised text-fg-3 font-mono border border-edge/[0.08]">
                Model Context Protocol (MCP)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-fg tracking-tight">
              Enterprise MCP Hub
            </h1>
            <p className="text-[13px] text-fg-3 mt-1 max-w-2xl leading-relaxed">
              Plug custom enterprise backends, SAP ERP gateways, CRM systems, and internal tool servers directly into the GEAP fleet. Autonomous agents read schemas, execute actions with Zero-Trust credentials, and pass all I/O through Model Armor guardrails.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={loadServers}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-raised hover:bg-raised/80 text-fg text-[13px] font-medium border border-edge/[0.08] transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            <button
              onClick={() => setShowConnectModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-medium transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Plug MCP server
            </button>
          </div>
        </div>

        {/* Quick stat badges */}
        <div className="mt-5 pt-4 border-t border-edge/[0.08] flex items-center gap-4 sm:gap-6 flex-wrap text-[12px] text-fg-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-fg font-medium">{servers.length}</span> Connected Servers
          </div>
          <div className="flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-fg font-medium">
              {servers.reduce((acc, s) => acc + s.tools.length, 0)}
            </span> Available Tools
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Zero-Trust Scoped
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            Model Armor Sanitized
          </div>
        </div>
      </div>

      {/* Main Grid: Left Server List, Right Tool Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Connected Servers List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-fg">Connected servers</h3>
            <span className="text-[11px] text-fg-4 font-mono">{filteredServers.length} active</span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-fg-4 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search servers or tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-surface border border-edge/[0.08] text-[12px] text-fg focus:outline-none focus:border-accent/50 placeholder:text-fg-4"
            />
          </div>

          <div className="space-y-2">
            {filteredServers.map((s) => {
              const isSelected = selectedServer?.id === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedServerId(s.id)}
                  className={`surface p-3.5 rounded-xl cursor-pointer transition-all border ${
                    isSelected 
                      ? 'border-blue-500/40 bg-blue-500/[0.04] shadow-sm' 
                      : 'hover:border-edge/[0.18]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-[10px] uppercase font-mono tracking-wide text-fg-4 font-semibold">
                          {s.transport}
                        </span>
                        <span className="text-[10px] text-fg-4 font-mono">· {s.latency_ms}ms</span>
                      </div>
                      <h4 className="text-[13px] font-semibold text-fg tracking-tight">{s.name}</h4>
                    </div>

                    <span className="text-[11px] px-2 py-0.5 rounded bg-raised text-fg-3 font-medium border border-edge/[0.08]">
                      {s.tools.length} {s.tools.length === 1 ? 'tool' : 'tools'}
                    </span>
                  </div>

                  <p className="text-[12px] text-fg-3 mt-1.5 line-clamp-2 leading-relaxed">
                    {s.description}
                  </p>

                  <div className="mt-3 pt-2 border-t border-edge/[0.06] flex items-center justify-between text-[11px] text-fg-4">
                    <span className="truncate max-w-[180px] font-mono">{s.endpoint_url}</span>
                    <ArrowRight className="w-3 h-3 text-fg-4" />
                  </div>
                </div>
              );
            })}

            {filteredServers.length === 0 && (
              <div className="p-8 text-center surface border-dashed border-edge/[0.15] rounded-xl text-fg-4 text-[13px]">
                No MCP servers match your search query.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Selected Server Deep-Dive & Tool Reader */}
        <div className="lg:col-span-8">
          {selectedServer ? (
            <div className="surface p-5 sm:p-6 space-y-5">
              {/* Server Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-edge/[0.08]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Status: {selectedServer.status.toUpperCase()}
                    </span>
                    <span className="text-[11px] font-mono text-fg-4 px-2 py-0.5 rounded bg-raised border border-edge/[0.08]">
                      ID: {selectedServer.id}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-fg tracking-tight">{selectedServer.name}</h2>
                  <p className="text-[13px] text-fg-3 mt-1 leading-relaxed">{selectedServer.description}</p>
                </div>

                <button
                  onClick={() => handleDeleteServer(selectedServer.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 transition-colors self-start"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Disconnect
                </button>
              </div>

              {/* Endpoint & Security Attestation Meta */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[12px]">
                <div className="p-3 rounded-lg bg-raised/50 border border-edge/[0.08]">
                  <span className="text-fg-4 block text-[11px]">Endpoint URL</span>
                  <span className="font-mono text-fg truncate block mt-0.5">{selectedServer.endpoint_url}</span>
                </div>
                <div className="p-3 rounded-lg bg-raised/50 border border-edge/[0.08]">
                  <span className="text-fg-4 block text-[11px]">Authentication</span>
                  <span className="font-mono text-fg block mt-0.5 uppercase">{selectedServer.auth_type} token</span>
                </div>
                <div className="p-3 rounded-lg bg-raised/50 border border-edge/[0.08]">
                  <span className="text-fg-4 block text-[11px]">Authorized Subagents</span>
                  <span className="text-fg truncate block mt-0.5">
                    {selectedServer.allowed_agent_slugs.join(', ') || 'All agents permitted'}
                  </span>
                </div>
              </div>

              {/* Discovered Tools List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-[14px] font-semibold text-fg flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-blue-500" />
                    Exposed Tools ({selectedServer.tools.length})
                  </h3>
                  <span className="text-[12px] text-fg-4">Available for autonomous invocation</span>
                </div>

                <div className="space-y-2.5">
                  {selectedServer.tools.map((tool) => {
                    const isExpanded = expandedToolNames.has(tool.name);
                    const propCount = Object.keys(tool.inputSchema?.properties || {}).length;

                    return (
                      <div
                        key={tool.name}
                        className="rounded-xl border border-edge/[0.12] bg-raised/30 overflow-hidden transition-colors hover:border-edge/[0.25]"
                      >
                        <div className="p-4 flex items-start justify-between gap-3">
                          <div className="flex-1 cursor-pointer" onClick={() => toggleToolExpand(tool.name)}>
                            <div className="flex items-center gap-2">
                              <span className="text-fg-4">
                                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                              </span>
                              <h4 className="text-[13px] font-semibold font-mono text-fg">
                                {tool.name}
                              </h4>
                              <span className="text-[11px] px-2 py-0.5 rounded bg-raised text-fg-3 border border-edge/[0.08]">
                                {propCount} {propCount === 1 ? 'param' : 'params'}
                              </span>
                            </div>
                            <p className="text-[12px] text-fg-3 mt-1.5 pl-6 leading-relaxed">
                              {tool.description}
                            </p>
                          </div>

                          <button
                            onClick={() => handleOpenTestModal(selectedServer, tool)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[12px] font-medium transition-colors shadow-sm whitespace-nowrap"
                          >
                            <Play className="w-3 h-3 fill-white" />
                            Test tool
                          </button>
                        </div>

                        {/* Expandable JSON Schema details */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="px-4 pb-4 pt-2 border-t border-edge/[0.08] bg-raised/60 space-y-3"
                            >
                              <div className="text-[11px] font-medium text-fg-4 uppercase tracking-wider">
                                Parameter Schema (JSON-RPC 2.0)
                              </div>

                              <div className="space-y-2 text-[12px]">
                                {Object.entries(tool.inputSchema?.properties || {}).map(([key, prop]) => {
                                  const isRequired = tool.inputSchema?.required?.includes(key);
                                  return (
                                    <div
                                      key={key}
                                      className="p-2.5 rounded-lg bg-surface border border-edge/[0.08] flex items-start justify-between gap-3"
                                    >
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <span className="font-mono text-fg font-semibold">{key}</span>
                                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-raised text-accent border border-edge/[0.08]">
                                            {prop.type}
                                          </span>
                                          {isRequired && (
                                            <span className="text-[10px] text-rose-500 font-semibold uppercase">
                                              required
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-[11px] text-fg-3 mt-1">{prop.description}</p>
                                      </div>
                                    </div>
                                  );
                                })}

                                {propCount === 0 && (
                                  <div className="text-[12px] text-fg-4 italic">No parameters required.</div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Data Resources (if any) */}
              {selectedServer.resources && selectedServer.resources.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-[14px] font-semibold text-fg flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-500" />
                    Exposed Data Resources
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
                    {selectedServer.resources.map((res) => (
                      <div key={res.uri} className="p-3 rounded-lg bg-raised/40 border border-edge/[0.08]">
                        <span className="font-semibold text-fg block">{res.name}</span>
                        <span className="font-mono text-fg-4 text-[11px] block mt-0.5 truncate">{res.uri}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="surface p-12 text-center rounded-xl border border-edge/[0.12] space-y-3">
              <Cpu className="w-10 h-10 mx-auto text-fg-4 opacity-50" />
              <h3 className="text-[15px] font-medium text-fg">No MCP server selected</h3>
              <p className="text-[13px] text-fg-3 max-w-sm mx-auto">
                Select a connected server from the left to inspect exposed tools, or plug a new enterprise server.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Connect New MCP Server Modal */}
      <AnimatePresence>
        {showConnectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConnectModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.form
              onSubmit={handleConnectServer}
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              className="relative w-full max-w-lg surface p-6 space-y-4 shadow-xl border border-edge/[0.12] z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-edge/[0.08]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-500">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-fg">Plug Enterprise MCP Server</h3>
                    <p className="text-[11px] text-fg-4">Model Context Protocol Gateway</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowConnectModal(false)}
                  className="p-1 rounded-lg text-fg-4 hover:text-fg hover:bg-raised transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 1-Click Enterprise Presets */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-fg-4 uppercase tracking-wider">Quick Presets</label>
                <div className="flex items-center gap-2 flex-wrap text-[11px]">
                  {[
                    { n: 'SAP S/4HANA', url: 'https://sap-gateway.corp.internal/mcp/v1/sse', proto: 'sse', desc: 'ERP Material Management & Ledger' },
                    { n: 'Salesforce CRM', url: 'https://salesforce-bridge.corp.internal/mcp/rpc', proto: 'http', desc: 'Supplier Relationship & Service Cloud' },
                    { n: 'Snowflake Data', url: 'https://snowflake-mcp.internal.corp/query', proto: 'http', desc: 'Enterprise Analytics & Data Warehouse' },
                  ].map((p) => (
                    <button
                      key={p.n}
                      type="button"
                      onClick={() => {
                        setServerName(p.n);
                        setEndpointUrl(p.url);
                        setTransport(p.proto as any);
                        setDescription(p.desc);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-raised hover:bg-raised/80 text-fg-3 hover:text-fg font-medium border border-edge/[0.08] transition-colors"
                    >
                      {p.n}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 text-[13px]">
                <div>
                  <label className="text-[12px] text-fg-3 block mb-1">Server name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SAP S/4HANA OData Core"
                    value={serverName}
                    onChange={(e) => setServerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-edge/[0.12] text-fg focus:outline-none focus:border-accent/50"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="text-[12px] text-fg-3 block mb-1">Endpoint URL</label>
                    <input
                      type="url"
                      required
                      placeholder="https://mcp.internal.corp/sse"
                      value={endpointUrl}
                      onChange={(e) => setEndpointUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-surface border border-edge/[0.12] text-fg font-mono text-[12px] focus:outline-none focus:border-accent/50"
                    />
                  </div>

                  <div>
                    <label className="text-[12px] text-fg-3 block mb-1">Transport</label>
                    <select
                      value={transport}
                      onChange={(e) => setTransport(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg bg-surface border border-edge/[0.12] text-fg text-[13px] focus:outline-none"
                    >
                      <option value="sse">HTTP SSE</option>
                      <option value="http">HTTP POST</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[12px] text-fg-3 block mb-1">Authorization Header (Optional)</label>
                  <input
                    type="password"
                    placeholder="Bearer sec_token_..."
                    value={authHeader}
                    onChange={(e) => setAuthHeader(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-edge/[0.12] text-fg font-mono text-[12px] focus:outline-none focus:border-accent/50"
                  />
                </div>

                <div>
                  <label className="text-[12px] text-fg-3 block mb-1">Authorized Subagents (Comma-separated)</label>
                  <input
                    type="text"
                    value={allowedAgents}
                    onChange={(e) => setAllowedAgents(e.target.value)}
                    placeholder="supply-chain-lead, erp-sap-connector"
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-edge/[0.12] text-fg text-[12px] font-mono focus:outline-none"
                  />
                </div>

                {/* Real-time Discovery Trigger */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleDiscoverTools}
                    disabled={!endpointUrl || isDiscovering}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-raised hover:bg-raised/80 text-fg text-[12px] font-medium border border-edge/[0.12] transition-colors disabled:opacity-50"
                  >
                    {isDiscovering ? (
                      <>
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-fg border-t-transparent animate-spin" />
                        Pinging endpoint and reading tools/list...
                      </>
                    ) : (
                      <>
                        <Search className="w-3.5 h-3.5" />
                        Test Connection & Discover Tools
                      </>
                    )}
                  </button>

                  {discoveryError && (
                    <div className="mt-2 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[11px]">
                      {discoveryError}
                    </div>
                  )}

                  {discoveredTools.length > 0 && (
                    <div className="mt-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] space-y-1">
                      <div className="font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Successfully discovered {discoveredTools.length} tools:
                      </div>
                      <div className="font-mono text-[10px] pl-5">
                        {discoveredTools.map((t) => t.name).join(', ')}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-edge/[0.08]">
                <button
                  type="button"
                  onClick={() => setShowConnectModal(false)}
                  className="px-3.5 py-2 rounded-lg text-fg-3 hover:text-fg text-[13px] font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-medium transition-colors shadow-sm"
                >
                  Save & Register Server
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {/* Test Tool Execution Sandbox Modal */}
      <AnimatePresence>
        {testToolModalOpen && activeTestServer && activeTestTool && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTestToolModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <div className="relative w-full max-w-xl surface p-6 space-y-4 shadow-xl border border-edge/[0.12] z-10 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-edge/[0.08]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-raised text-accent border border-edge/[0.08]">
                      {activeTestServer.name}
                    </span>
                    <span className="text-[11px] text-emerald-500 font-medium">Model Armor Guardrail Active</span>
                  </div>
                  <h3 className="text-base font-semibold font-mono text-fg mt-1">
                    {activeTestTool.name}
                  </h3>
                </div>
                <button
                  onClick={() => setTestToolModalOpen(false)}
                  className="p-1 rounded-lg text-fg-4 hover:text-fg hover:bg-raised transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[13px] text-fg-3 leading-relaxed">
                {activeTestTool.description}
              </p>

              {/* JSON Arguments Editor */}
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-fg-3 block">
                  Tool Arguments (JSON Payload)
                </label>
                <textarea
                  rows={5}
                  value={testArgumentsJson}
                  onChange={(e) => setTestArgumentsJson(e.target.value)}
                  className="w-full p-3 rounded-lg bg-surface border border-edge/[0.12] font-mono text-[12px] text-fg focus:outline-none focus:border-accent/50 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-fg-4 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Payload will be scanned for injections & PII before execution
                </span>

                <button
                  onClick={handleExecuteTest}
                  disabled={isExecuting}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-medium transition-colors shadow-sm disabled:opacity-50"
                >
                  {isExecuting ? (
                    <>
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Executing...
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-white" />
                      Run Tool
                    </>
                  )}
                </button>
              </div>

              {/* Execution Result Output */}
              {executionResult && (
                <div className="mt-3 p-4 rounded-xl bg-raised/50 border border-edge/[0.1] space-y-2">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="font-semibold text-fg flex items-center gap-1.5">
                      {executionResult.success ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-rose-500" />
                      )}
                      Execution {executionResult.success ? 'Successful' : 'Blocked / Failed'}
                    </span>
                    <span className="font-mono text-fg-4 text-[11px]">
                      {executionResult.duration_ms}ms
                    </span>
                  </div>

                  {executionResult.model_armor_sanitized && (
                    <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[11px]">
                      Model Armor sanitized payload. Neutralized: {executionResult.threats_neutralized?.join('; ')}
                    </div>
                  )}

                  {executionResult.error && (
                    <p className="text-[12px] text-rose-500 font-mono">{executionResult.error}</p>
                  )}

                  {executionResult.result && (
                    <pre className="p-3 rounded-lg bg-surface border border-edge/[0.08] text-[11px] font-mono text-fg overflow-x-auto max-h-48">
                      {JSON.stringify(executionResult.result, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
