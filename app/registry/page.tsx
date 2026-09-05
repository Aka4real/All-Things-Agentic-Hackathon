'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, 
  Search, 
  Lock, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  X 
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
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 surface p-5 sm:p-6">
        <div>
          <h1 className="text-xl font-semibold text-fg tracking-tight">Agent Registry</h1>
          <p className="text-[13px] text-fg-3 mt-1">
            Discover, version, and govern approved institutional subagents.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[13px] text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span className="font-medium">{INITIAL_AGENTS.length} governed agents</span>
        </div>
      </div>

      {/* Search & filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-fg-4 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search agents..."
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
              className="surface p-4 flex flex-col justify-between hover:border-edge/[0.18] transition-colors group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div>
                    <span className="text-[11px] text-fg-4 font-medium">{agent.department}</span>
                    <h3 className="text-[14px] font-medium text-fg mt-0.5 group-hover:text-accent transition-colors">{agent.name}</h3>
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

              {/* Footer */}
              <div className="pt-3 border-t border-edge/[0.08] flex items-center justify-between text-[12px]">
                <div>
                  <span className="text-fg-4 block text-[11px]">Model</span>
                  <span className="text-fg-2 font-medium">{agent.model_id}</span>
                </div>

                <button
                  onClick={() => setSelectedAgent(agent)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-raised hover:bg-raised/80 text-fg text-[12px] font-medium transition-colors border border-edge/[0.06]"
                >
                  Inspect
                  <ExternalLink className="w-3 h-3 text-fg-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Inspect modal */}
      <AnimatePresence>
        {selectedAgent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAgent(null)}
              className="fixed inset-0 bg-overlay/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ type: "spring", bounce: 0, duration: 0.35 }}
              className="surface w-full max-w-lg p-6 relative z-10 space-y-4 shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] text-fg-4 font-medium">{selectedAgent.department}</span>
                  <h2 className="text-lg font-semibold text-fg tracking-tight">{selectedAgent.name}</h2>
                  <span className="text-[12px] font-mono text-fg-3">@{selectedAgent.agent_slug} · v{selectedAgent.version}</span>
                </div>

                <button
                  onClick={() => setSelectedAgent(null)}
                  className="text-fg-4 hover:text-fg p-1 rounded-lg hover:bg-raised transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[13px] text-fg-2 leading-relaxed p-3 rounded-lg bg-raised/50 border border-edge/[0.08]">
                {selectedAgent.description}
              </p>

              <div className="grid grid-cols-2 gap-3 text-[13px]">
                <div className="p-3 rounded-lg bg-raised/50 border border-edge/[0.08]">
                  <span className="text-fg-4 block text-[11px]">Uptime SLA</span>
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
                  href="/runs/demo-elena-vance"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-medium transition-colors shadow-sm"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Test in audit
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
