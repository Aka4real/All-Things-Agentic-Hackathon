'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, 
  Search, 
  Lock, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  X,
  Crown,
  Sparkles,
  Fingerprint
} from 'lucide-react';
import { INITIAL_AGENTS } from '@/lib/mock-data';
import { DynamicAgentStore } from '@/lib/agent-store';
import { AgentRegistryItem } from '@/lib/types';

export default function AgentRegistryPage() {
  const [agents, setAgents] = useState<AgentRegistryItem[]>(INITIAL_AGENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedAgent, setSelectedAgent] = useState<AgentRegistryItem | null>(null);

  useEffect(() => {
    setAgents(DynamicAgentStore.getAllAgents());
  }, []);

  const departments = ['All', 'Custom Synthesized', 'Supply Chain', 'ESG Compliance', 'Finance', 'Logistics', 'SecOps'];

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch = 
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.capabilities.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
      agent.agent_slug.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesDept = true;
    if (selectedDept === 'Custom Synthesized') {
      matchesDept = !!agent.is_custom;
    } else if (selectedDept !== 'All') {
      matchesDept = agent.department.toLowerCase().includes(selectedDept.toLowerCase());
    }

    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 surface p-5 sm:p-6">
        <div>
          <h1 className="text-xl font-semibold text-fg tracking-tight">Agent Registry</h1>
          <p className="text-[13px] text-fg-3 mt-1">
            Discover, version, and govern standard and Governor-synthesized institutional subagents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/governor"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[12px] font-medium transition-colors shadow-sm"
          >
            <Crown className="w-3.5 h-3.5 text-amber-300" />
            <span>The Governor Studio</span>
          </Link>
          <div className="flex items-center gap-2 text-[13px] text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-medium">{agents.length} active agents</span>
          </div>
        </div>
      </div>

      {/* Governor Custom Synthesis Banner */}
      <div className="surface p-4 rounded-xl border border-blue-500/25 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600/15 border border-blue-500/25 flex items-center justify-center text-blue-400 shrink-0">
            <Crown className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-[13px] font-semibold text-fg flex items-center gap-2">
              <span>Need a specialized agent not in this catalog?</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-bold uppercase">
                New
              </span>
            </h3>
            <p className="text-[12px] text-fg-3">
              Describe your enterprise problem to <strong>The Governor</strong>. It will detect capability gaps, model a custom agent with Zero-Trust scopes, and register it here.
            </p>
          </div>
        </div>

        <Link
          href="/governor"
          className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-raised hover:bg-raised/80 text-fg text-[12px] font-medium border border-edge/[0.08] transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Synthesize with Governor</span>
        </Link>
      </div>

      {/* Search & filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-fg-4 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search agents, capabilities, or scopes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface border border-edge/[0.08] focus:border-accent/50 focus:outline-none text-[13px] text-fg placeholder:text-fg-4 transition-colors"
          />
        </div>

        <div className="flex items-center gap-0.5 overflow-x-auto">
          {departments.map((dept) => {
            const isSelected = selectedDept === dept;
            return (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`relative px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors whitespace-nowrap ${
                  isSelected ? 'text-fg' : 'text-fg-3 hover:text-fg'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="registry-dept"
                    className="absolute inset-0 rounded-lg bg-raised"
                    transition={{ type: "spring", bounce: 0, duration: 0.35 }}
                  />
                )}
                <span className="relative z-10">{dept}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Agent grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <AnimatePresence>
          {filteredAgents.map((agent) => (
            <motion.div
              layout
              key={agent.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", bounce: 0, duration: 0.35 }}
              className={`surface p-4 flex flex-col justify-between hover:border-edge/[0.18] transition-colors group ${
                agent.is_custom ? 'border-blue-500/30 bg-blue-500/[0.02]' : ''
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[11px] text-fg-4 font-medium">{agent.department}</span>
                      {agent.is_custom && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-wider">
                          Custom
                        </span>
                      )}
                    </div>
                    <h3 className="text-[14px] font-medium text-fg mt-0.5 group-hover:text-accent transition-colors flex items-center gap-1.5">
                      {agent.name}
                      {agent.is_custom && <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                    </h3>
                    <span className="text-[12px] text-fg-3 font-mono">@{agent.agent_slug}</span>
                  </div>
                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-raised text-fg-3 font-medium border border-edge/[0.06]">
                    v{agent.version}
                  </span>
                </div>

                <p className="text-[13px] text-fg-3 leading-relaxed mb-3 line-clamp-2">{agent.description}</p>

                {/* Capabilities */}
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {agent.capabilities.map((cap) => (
                      <span key={cap} className="text-[11px] px-1.5 py-0.5 rounded bg-raised text-fg-3 border border-edge/[0.06]">
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Scopes */}
                <div className="mb-3">
                  <div className="flex items-center gap-1 mb-1">
                    <Lock className="w-3 h-3 text-fg-4" />
                    <span className="text-[11px] text-fg-4">Required scopes</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {agent.required_scopes.map((scope) => (
                      <span key={scope} className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-edge/[0.06] flex items-center justify-between text-[11px] text-fg-4">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="capitalize">{agent.sla_status}</span>
                  <span>•</span>
                  <span>{agent.uptime_pct}% SLA</span>
                </div>

                <button
                  onClick={() => setSelectedAgent(agent)}
                  className="flex items-center gap-1 text-fg-3 hover:text-fg font-medium transition-colors"
                >
                  <span>Inspect</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty Search State */}
      {filteredAgents.length === 0 && (
        <div className="surface p-12 text-center rounded-xl border border-dashed border-edge/[0.15] space-y-3">
          <div className="w-10 h-10 mx-auto rounded-full bg-raised flex items-center justify-center text-fg-4">
            <Search className="w-5 h-5" />
          </div>
          <h4 className="text-[14px] font-semibold text-fg">No agents match your criteria</h4>
          <p className="text-[13px] text-fg-3 max-w-sm mx-auto">
            No active subagents match &ldquo;{searchQuery || selectedDept}&rdquo;. Clear your filters or synthesize a custom agent with The Governor.
          </p>
          <div className="pt-2 flex items-center justify-center gap-2">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDept('All');
              }}
              className="px-3 py-1.5 rounded-lg bg-raised hover:bg-raised/80 text-fg text-[12px] font-medium border border-edge/[0.08] transition-colors"
            >
              Reset filters
            </button>
            <Link
              href="/governor"
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[12px] font-medium transition-colors"
            >
              Synthesize with Governor
            </Link>
          </div>
        </div>
      )}

      {/* Agent Detail Modal */}
      <AnimatePresence>
        {selectedAgent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAgent(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              className="relative w-full max-w-lg surface p-6 space-y-4 shadow-xl border border-edge/[0.12] z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] text-fg-4 font-medium">{selectedAgent.department}</span>
                    {selectedAgent.is_custom && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
                        Custom Synthesized
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-semibold text-fg">{selectedAgent.name}</h2>
                  <span className="text-[12px] text-fg-3 font-mono">@{selectedAgent.agent_slug}</span>
                </div>

                <button
                  onClick={() => setSelectedAgent(null)}
                  className="p-1 rounded-lg hover:bg-raised text-fg-3 hover:text-fg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[13px] text-fg-2 leading-relaxed">{selectedAgent.description}</p>

              {selectedAgent.custom_rationale && (
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/25 text-[12px] text-blue-300">
                  <strong className="block text-fg font-medium mb-1">Governor Synthesis Rationale:</strong>
                  {selectedAgent.custom_rationale}
                </div>
              )}

              <div>
                <span className="text-[11px] text-fg-4 block mb-1">Model identity</span>
                <span className="text-[13px] font-mono text-fg px-2 py-1 rounded bg-raised/50 border border-edge/[0.08] inline-block">
                  {selectedAgent.model_id}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-fg-4 block mb-1.5">Capabilities</span>
                <div className="flex flex-wrap gap-1">
                  {selectedAgent.capabilities.map((c) => (
                    <span key={c} className="text-[12px] px-2 py-0.5 rounded bg-raised text-fg-2 border border-edge/[0.08]">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] text-fg-4 block mb-1.5">Zero-Trust Scopes</span>
                <div className="flex flex-wrap gap-1">
                  {selectedAgent.required_scopes.map((s) => (
                    <span key={s} className="text-[12px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-raised/50 border border-edge/[0.08]">
                  <span className="text-fg-4 block text-[11px]">SLA Availability</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{selectedAgent.uptime_pct}%</span>
                </div>
                <div className="p-3 rounded-lg bg-raised/50 border border-edge/[0.08]">
                  <span className="text-fg-4 block text-[11px]">Total runs</span>
                  <span className="text-fg font-semibold">{selectedAgent.total_runs.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] text-fg-4 block mb-1">Governance</span>
                <p className="text-[13px] text-fg-3 p-3 rounded-lg bg-raised/50 border border-edge/[0.08]">
                  Authorized by <strong className="text-fg">{selectedAgent.author}</strong>
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="px-3 py-1.5 rounded-lg bg-raised text-fg text-[13px] font-medium hover:bg-raised/80 border border-edge/[0.06] transition-colors"
                >
                  Close
                </button>

                <Link
                  href={selectedAgent.is_custom ? "/governor" : "/runs/demo-elena-vance"}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-medium transition-colors shadow-sm"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{selectedAgent.is_custom ? "Open in Governor" : "Test in audit"}</span>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
