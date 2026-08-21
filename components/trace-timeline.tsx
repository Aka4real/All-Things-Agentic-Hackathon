'use client';

import React, { useState } from 'react';
import { AgentTrace } from '@/lib/types';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  ChevronDown, 
  ChevronRight, 
  BrainCircuit, 
  Wrench, 
  Database, 
  KeyRound, 
  FileCheck2,
  Terminal
} from 'lucide-react';

interface TraceTimelineProps {
  traces: AgentTrace[];
  isLive?: boolean;
}

export default function TraceTimeline({ traces, isLive = false }: TraceTimelineProps) {
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>(null);

  const getStepIcon = (type: AgentTrace['step_type']) => {
    switch (type) {
      case 'thought':
        return BrainCircuit;
      case 'model_armor_scan':
        return ShieldAlert;
      case 'memory_lookup':
        return Database;
      case 'zero_trust_auth':
        return KeyRound;
      case 'tool_call':
      case 'tool_response':
        return Wrench;
      case 'policy_gate':
        return FileCheck2;
      default:
        return Terminal;
    }
  };

  const getStatusBadge = (status: AgentTrace['status']) => {
    switch (status) {
      case 'success':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            PASS
          </span>
        );
      case 'intercepted':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30 animate-pulse">
            <ShieldAlert className="w-3 h-3" />
            ARMOR INTERCEPTED
          </span>
        );
      case 'warning':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            <AlertTriangle className="w-3 h-3" />
            FLAGGED
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-mono text-slate-400 bg-slate-800/40 px-2 py-0.5 rounded border border-slate-700">
            PENDING
          </span>
        );
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedTraceId(expandedTraceId === id ? null : id);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-card-border/80">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-card-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white tracking-wide">OpenTelemetry Reasoning Chain</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary-500/15 text-primary-400 border border-primary-500/30">
              OTel Spec v1.28
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">End-to-end execution span timeline and deterministic security events</p>
        </div>

        {isLive && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            STREAMING ACTIVE
          </div>
        )}
      </div>

      {traces.length === 0 ? (
        <div className="p-8 text-center text-slate-400 text-sm font-mono">
          No execution traces recorded yet. Trigger a workflow to start streaming.
        </div>
      ) : (
        <div className="space-y-3 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-[1px] before:bg-slate-800">
          {traces.map((trace) => {
            const Icon = getStepIcon(trace.step_type);
            const isExpanded = expandedTraceId === trace.id;

            return (
              <div 
                key={trace.id}
                className="relative pl-12 group transition-all"
              >
                {/* Timeline Node Dot */}
                <div className={`absolute left-3 top-3 w-5 h-5 -translate-x-1/2 rounded-full flex items-center justify-center border z-10 ${
                  trace.status === 'intercepted'
                    ? 'bg-rose-950 border-rose-500 text-rose-400'
                    : trace.status === 'warning'
                    ? 'bg-amber-950 border-amber-500 text-amber-400'
                    : 'bg-card border-card-border text-cyan-400 group-hover:border-cyan-500/60'
                }`}>
                  <Icon className="w-3 h-3" />
                </div>

                {/* Card Container */}
                <div 
                  onClick={() => toggleExpand(trace.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    trace.status === 'intercepted'
                      ? 'bg-rose-950/20 border-rose-500/40 hover:bg-rose-950/30'
                      : isExpanded
                      ? 'bg-[#0f172a]/90 border-cyan-500/40 shadow-lg shadow-cyan-950/20'
                      : 'bg-[#0a0f1d]/70 border-card-border/60 hover:border-slate-700 hover:bg-[#0d1322]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-mono font-bold text-slate-300">
                        STEP {trace.step_number}
                      </span>
                      <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-cyan-300 border border-white/10">
                        {trace.step_type.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        @{trace.agent_slug}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                        <Clock className="w-3 h-3" />
                        {trace.duration_ms}ms
                      </span>
                      {getStatusBadge(trace.status)}
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Summary line */}
                  <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                    {trace.reasoning}
                  </p>

                  {/* Expanded Telemetry & Spans */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono bg-black/40 p-2.5 rounded-lg border border-slate-800">
                        <div>
                          <span className="text-slate-500 block">TRACE_ID</span>
                          <span className="text-slate-300 truncate block">{trace.trace_id}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">SPAN_ID</span>
                          <span className="text-cyan-400 truncate block">{trace.span_id}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">TIMESTAMP</span>
                          <span className="text-slate-300 truncate block">{trace.created_at.split('T')[1]?.slice(0, 8)}</span>
                        </div>
                      </div>

                      {trace.attributes && (
                        <div className="mt-2">
                          <span className="text-[10px] font-mono text-slate-400 block mb-1">ATTRIBUTES (JSON)</span>
                          <pre className="p-2.5 rounded-lg bg-black/60 border border-slate-800/80 text-[11px] font-mono text-emerald-400 overflow-x-auto">
                            {JSON.stringify(trace.attributes, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
