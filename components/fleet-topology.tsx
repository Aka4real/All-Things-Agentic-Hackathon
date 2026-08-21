'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Layers, 
  Database, 
  Lock, 
  Cpu, 
  Server, 
  GitBranch, 
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function FleetTopology() {
  const [activeNode, setActiveNode] = useState<string | null>('runtime');

  const nodes = [
    {
      id: 'registry',
      name: 'Agent Registry',
      badge: 'GEAP Discovery',
      icon: Layers,
      color: 'text-indigo-400',
      border: 'border-indigo-500/40',
      bg: 'bg-indigo-950/40',
      description: 'Central corporate catalog with semantic capability discovery, SLA validation, and version control.'
    },
    {
      id: 'gateway',
      name: 'Agent Gateway & Policy',
      badge: 'Policy & Rate Limits',
      icon: GitBranch,
      color: 'text-cyan-400',
      border: 'border-cyan-500/40',
      bg: 'bg-cyan-950/40',
      description: 'Zero-trust message router enforcing spend caps ($50k gate), anti-loop recursion (max 2 retries), and data boundaries.'
    },
    {
      id: 'armor',
      name: 'Model Armor',
      badge: 'Gemma 2 Guardrails',
      icon: Lock,
      color: 'text-rose-400',
      border: 'border-rose-500/40',
      bg: 'bg-rose-950/40',
      description: 'Real-time deterministic & neural filter intercepting adversarial prompt injections, redacting PII, and sanitizing tool payloads.'
    },
    {
      id: 'runtime',
      name: 'Agent Runtime',
      badge: 'Google Cloud Run',
      icon: Cpu,
      color: 'text-emerald-400',
      border: 'border-emerald-500/50',
      bg: 'bg-emerald-950/40',
      description: 'Scale-to-zero containerized asynchronous execution engine handling multi-tier supply chain audits and Pub/Sub events.'
    },
    {
      id: 'memory',
      name: 'Memory Bank',
      badge: 'pgvector Persistent',
      icon: Database,
      color: 'text-amber-400',
      border: 'border-amber-500/40',
      bg: 'bg-amber-950/40',
      description: 'Dual-layer cross-session memory with vector similarity matching for vendor dispute logs and ESG historical commitments.'
    },
    {
      id: 'erp',
      name: 'Zero-Trust ERP Connector',
      badge: 'SAP / Oracle Mesh',
      icon: Server,
      color: 'text-purple-400',
      border: 'border-purple-500/40',
      bg: 'bg-purple-950/40',
      description: 'Ephemeral token-scoped gateway querying live production warehouse inventory without exposing raw credentials.'
    }
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-card-border/80 relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white tracking-wide">Autonomous Fleet Architecture & Security Mesh</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Live Topology
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Click any node in the institutional mesh to inspect its active policy contract</p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-black/40 px-3 py-1.5 rounded-lg border border-slate-800">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Zero-Trust Enforced</span>
        </div>
      </div>

      {/* Grid of Nodes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {nodes.map((node) => {
          const Icon = node.icon;
          const isSelected = activeNode === node.id;
          return (
            <button
              key={node.id}
              onClick={() => setActiveNode(node.id)}
              className={`text-left p-4 rounded-xl transition-all relative overflow-hidden border ${
                isSelected
                  ? `${node.border} ${node.bg} ring-2 ring-cyan-500/30 scale-[1.01] shadow-lg shadow-black/60`
                  : 'border-card-border/50 bg-[#0a0f1d]/60 hover:border-slate-700 hover:bg-[#0e1529]/80'
              }`}
            >
              <div className="flex items-start justify-between mb-2.5">
                <div className={`p-2 rounded-lg bg-black/50 border border-white/5 ${node.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                  {node.badge}
                </span>
              </div>

              <h4 className="text-sm font-semibold text-white mb-1">{node.name}</h4>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{node.description}</p>

              {isSelected && (
                <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-cyan-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                    Node Active & Monitored
                  </span>
                  <span className="text-slate-400">LATENCY: 12ms</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
