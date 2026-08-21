'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Layers, 
  Search, 
  CheckCircle2, 
  Lock, 
  Cpu, 
  Sparkles, 
  Filter, 
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Zap
} from 'lucide-react';
import { INITIAL_AGENTS } from '@/lib/mock-data';
import { AgentRegistryItem } from '@/lib/types';

export default function AgentRegistryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedAgent, setSelectedAgent] = useState<AgentRegistryItem | null>(null);

  const departments = ['All', 'Supply Chain', 'ESG Compliance', 'Finance', 'Logistics', 'SecOps'];

  const filteredAgents = INITIAL_AGENTS.filter((agent) => {
    const matchesSearch = 
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.capabilities.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
      agent.agent_slug.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDept === 'All' || agent.department === selectedDept;

    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-card-border/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Institutional Agent Registry</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              GEAP Core
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise repository for discovering, versioning, and governing approved institutional subagents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 border border-slate-800 text-xs font-mono text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{INITIAL_AGENTS.length} Governed Agents</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search agents, capabilities, or scopes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#090e1a] border border-card-border focus:border-cyan-500/60 focus:outline-none text-xs text-white placeholder:text-slate-500 font-mono"
          />
        </div>

        {/* Department Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                selectedDept === dept
                  ? 'bg-primary-600/30 text-cyan-300 border border-primary-500/40 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-transparent hover:border-slate-800'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAgents.map((agent) => (
          <div
            key={agent.id}
            className="glass-panel p-5 rounded-2xl border border-card-border/80 flex flex-col justify-between hover:border-primary-500/40 transition-all hover:shadow-xl hover:shadow-black/50 group"
          >
            <div>
              {/* Top row */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-cyan-400 border border-white/10">
                    {agent.department}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1.5 group-hover:text-cyan-300 transition-colors">
                    {agent.name}
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">@{agent.agent_slug}</span>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  v{agent.version}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
                {agent.description}
              </p>

              {/* Capabilities */}
              <div className="space-y-1.5 mb-4">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Capabilities</span>
                <div className="flex flex-wrap gap-1">
                  {agent.capabilities.map((cap) => (
                    <span key={cap} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              {/* Zero-Trust Scopes */}
              <div className="space-y-1.5 mb-4">
                <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  Required Zero-Trust Scopes
                </span>
                <div className="flex flex-wrap gap-1">
                  {agent.required_scopes.map((scope) => (
                    <span key={scope} className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/30 border border-emerald-500/20 text-emerald-300">
                      {scope}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Meta & Provision Button */}
            <div className="pt-3 border-t border-card-border/60 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block">MODEL BACKBONE</span>
                <span className="text-cyan-400 text-xs">{agent.model_id}</span>
              </div>

              <button
                onClick={() => setSelectedAgent(agent)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-600/20 hover:bg-primary-600/30 text-cyan-300 border border-primary-500/30 text-xs font-semibold transition-all"
              >
                <span>Inspect Agent</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Inspect Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel w-full max-w-xl p-6 rounded-2xl border border-card-border/90 shadow-2xl relative space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-cyan-400">{selectedAgent.department}</span>
                <h2 className="text-xl font-bold text-white">{selectedAgent.name}</h2>
                <span className="text-xs font-mono text-slate-400">@{selectedAgent.agent_slug} • Version {selectedAgent.version}</span>
              </div>

              <button
                onClick={() => setSelectedAgent(null)}
                className="text-slate-400 hover:text-white text-sm font-mono p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans bg-black/40 p-3 rounded-xl border border-slate-800">
              {selectedAgent.description}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-black/40 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">UPTIME SLA</span>
                <span className="text-emerald-400 font-bold text-sm">{selectedAgent.uptime_pct}%</span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">HISTORICAL RUNS</span>
                <span className="text-cyan-400 font-bold text-sm">{selectedAgent.total_runs.toLocaleString()} Executions</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-mono text-slate-400 block mb-1">GOVERNANCE & AUTHORSHIP</span>
              <p className="text-xs text-slate-300 font-mono bg-[#0a0f1d] p-2.5 rounded-lg border border-slate-800">
                Authorized By: <strong className="text-white">{selectedAgent.author}</strong> (Institutional Governance Passed)
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedAgent(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Close Inspector
              </button>

              <Link
                href="/runs/demo-elena-vance"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-600 to-cyan-600 text-white text-xs font-bold shadow-lg shadow-primary-600/30"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>Test in Elena Vance Audit</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
