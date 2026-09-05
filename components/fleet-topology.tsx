'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, 
  Database, 
  Lock, 
  Cpu, 
  Server, 
  GitBranch, 
  CheckCircle2
} from 'lucide-react';

export default function FleetTopology() {
  const [activeNode, setActiveNode] = useState<string>('runtime');

  const nodes = [
    {
      id: 'registry',
      name: 'Agent Registry',
      badge: 'Discovery',
      icon: Layers,
      metrics: { latency: '8ms', status: 'Synced', throughput: '1.4k ops/s' },
      policy: 'Enforces semantic capability lookup, semver contract verification, and active institutional leases.',
      description: 'Central catalog with semantic capability discovery and version control.'
    },
    {
      id: 'gateway',
      name: 'Agent Gateway',
      badge: 'Policy',
      icon: GitBranch,
      metrics: { latency: '4ms', status: 'Routing', throughput: '4.8k ops/s' },
      policy: 'Zero-trust message router enforcing spend caps ($50k gate), anti-loop recursion (max 2 retries).',
      description: 'Zero-trust message router with spend caps and anti-loop recursion.'
    },
    {
      id: 'armor',
      name: 'Model Armor',
      badge: 'Guardrails',
      icon: Lock,
      metrics: { latency: '14ms', status: 'Zero leaks', throughput: '100% inline' },
      policy: 'Deterministic regex + neural Gemma 2 classifier intercepting prompt injection and PII.',
      description: 'Real-time filter intercepting adversarial prompts and redacting PII.'
    },
    {
      id: 'runtime',
      name: 'Agent Runtime',
      badge: 'Cloud Run',
      icon: Cpu,
      metrics: { latency: '12ms', status: 'Scale-to-zero', throughput: 'Auto-elastic' },
      policy: 'Stateless container runtime hosting multi-agent Pub/Sub loops.',
      description: 'Scale-to-zero containerized execution engine for supply chain audits.'
    },
    {
      id: 'memory',
      name: 'Memory Bank',
      badge: 'pgvector',
      icon: Database,
      metrics: { latency: '19ms', status: 'Ready', throughput: 'Cosine 0.88' },
      policy: 'Cross-session episodic recall with semantic embeddings for vendor history.',
      description: 'Dual-layer cross-session memory with vector similarity matching.'
    },
    {
      id: 'erp',
      name: 'ERP Connector',
      badge: 'SAP/Oracle',
      icon: Server,
      metrics: { latency: '22ms', status: '5m TTL', throughput: 'Gated R/W' },
      policy: 'Ephemeral token-scoped gateway querying production inventory without permanent credentials.',
      description: 'Ephemeral token-scoped gateway for live warehouse queries.'
    }
  ];

  const selectedNodeData = nodes.find(n => n.id === activeNode) || nodes[3];

  return (
    <div className="surface p-5 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-semibold text-fg tracking-tight">Fleet topology</h3>
          <p className="text-[13px] text-fg-3 mt-0.5">
            Inter-agent message graph with inline security and token-gated connectivity
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[12px] text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span className="font-medium">Zero-trust enforced</span>
        </div>
      </div>

      {/* Topology grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {nodes.map((node) => {
          const Icon = node.icon;
          const isSelected = activeNode === node.id;
          return (
            <button
              key={node.id}
              onClick={() => setActiveNode(node.id)}
              className={`text-left p-3.5 rounded-lg transition-all border ${
                isSelected
                  ? 'border-accent/40 bg-accent/5 ring-1 ring-accent/20'
                  : 'border-edge/[0.08] bg-raised/40 hover:border-edge/[0.18] hover:bg-raised/70'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-accent/10 text-accent' : 'bg-raised text-fg-3'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] text-fg-4 font-medium">{node.badge}</span>
              </div>

              <h4 className="text-[13px] font-medium text-fg mb-0.5">{node.name}</h4>
              <p className="text-[12px] text-fg-3 line-clamp-2 leading-relaxed">{node.description}</p>
            </button>
          );
        })}
      </div>

      {/* Inspector */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedNodeData.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ type: "spring", bounce: 0, duration: 0.3 }}
          className="p-4 rounded-lg bg-raised/50 border border-edge/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-accent font-medium">Policy & telemetry</span>
              <span className="text-edge/[0.2]">·</span>
              <span className="text-[13px] font-medium text-fg">{selectedNodeData.name}</span>
            </div>
            <p className="text-[13px] text-fg-2 leading-relaxed">{selectedNodeData.policy}</p>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-[12px] border-t md:border-t-0 md:border-l border-edge/[0.08] pt-3 md:pt-0 md:pl-5">
            {[
              { label: 'Latency', value: selectedNodeData.metrics.latency, color: 'text-fg' },
              { label: 'Status', value: selectedNodeData.metrics.status, color: 'text-emerald-600 dark:text-emerald-400' },
              { label: 'Throughput', value: selectedNodeData.metrics.throughput, color: 'text-fg' },
            ].map((m) => (
              <div key={m.label}>
                <span className="text-fg-4 block text-[11px]">{m.label}</span>
                <span className={`font-medium ${m.color}`}>{m.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
