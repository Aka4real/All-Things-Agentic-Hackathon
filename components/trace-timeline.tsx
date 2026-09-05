'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Terminal,
  Sparkles 
} from 'lucide-react';

interface TraceTimelineProps {
  traces: AgentTrace[];
  isLive?: boolean;
}

export default function TraceTimeline({ traces, isLive = false }: TraceTimelineProps) {
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>(null);

  const getStepIcon = (type: AgentTrace['step_type']) => {
    switch (type) {
      case 'thought': return BrainCircuit;
      case 'model_armor_scan': return ShieldAlert;
      case 'memory_lookup': return Database;
      case 'zero_trust_auth': return KeyRound;
      case 'tool_call':
      case 'tool_response': return Wrench;
      case 'policy_gate': return FileCheck2;
      default: return Terminal;
    }
  };

  const getStatusBadge = (status: AgentTrace['status']) => {
    switch (status) {
      case 'success':
        return (
          <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="w-3 h-3" />
            Pass
          </span>
        );
      case 'intercepted':
        return (
          <span className="flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400 font-medium">
            <ShieldAlert className="w-3 h-3" />
            Intercepted
          </span>
        );
      case 'warning':
        return (
          <span className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            <AlertTriangle className="w-3 h-3" />
            Flagged
          </span>
        );
      default:
        return (
          <span className="text-[11px] text-fg-4">Pending</span>
        );
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedTraceId(expandedTraceId === id ? null : id);
  };

  return (
    <div className="surface p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-edge/[0.08]">
        <div>
          <h3 className="text-[15px] font-semibold text-fg tracking-tight">Reasoning chain</h3>
          <p className="text-[12px] text-fg-3 mt-0.5">OpenTelemetry execution spans</p>
        </div>

        {isLive && (
          <div className="flex items-center gap-1.5 text-[12px] text-accent font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Streaming
          </div>
        )}
      </div>

      {traces.length === 0 ? (
        <div className="p-10 text-center text-fg-4 text-[13px] bg-raised/30 rounded-lg border border-dashed border-edge/[0.12]">
          No traces yet. Launch the simulation to begin.
        </div>
      ) : (
        <div className="space-y-2 relative before:absolute before:left-[11px] before:top-3 before:bottom-3 before:w-px before:bg-edge/[0.12]">
          {traces.map((trace, index) => {
            const Icon = getStepIcon(trace.step_type);
            const isExpanded = expandedTraceId === trace.id;

            return (
              <motion.div 
                key={trace.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", bounce: 0, duration: 0.35, delay: index * 0.02 }}
                className="relative pl-9 group"
              >
                {/* Timeline dot */}
                <div className={`absolute left-0 top-3 w-[22px] h-[22px] rounded-full flex items-center justify-center border z-10 ${
                  trace.status === 'intercepted'
                    ? 'bg-rose-500/10 border-rose-500/40 text-rose-600 dark:text-rose-400'
                    : trace.status === 'warning'
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400'
                    : 'bg-surface border-edge/[0.15] text-fg-3 group-hover:border-edge/[0.3]'
                }`}>
                  <Icon className="w-3 h-3" />
                </div>

                {/* Card */}
                <div 
                  onClick={() => toggleExpand(trace.id)}
                  className={`p-3.5 rounded-lg border transition-colors cursor-pointer select-none ${
                    trace.status === 'intercepted'
                      ? 'bg-rose-500/[0.04] border-rose-500/20 hover:bg-rose-500/[0.08]'
                      : isExpanded
                      ? 'bg-raised/70 border-edge/[0.2]'
                      : 'bg-surface hover:bg-raised/40 border-edge/[0.08]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[12px] font-medium text-fg-2">
                        Step {trace.step_number}
                      </span>
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-raised text-fg-3 capitalize border border-edge/[0.06]">
                        {trace.step_type.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[12px] text-fg-4 font-mono">
                        @{trace.agent_slug}
                      </span>
                      {Boolean(trace.attributes?.is_live_api) && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-medium flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-blue-500" />
                          Live Gemini API
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-[11px] text-fg-4">
                        <Clock className="w-3 h-3" />
                        {trace.duration_ms}ms
                      </span>
                      {getStatusBadge(trace.status)}
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-fg-4" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-fg-4" />
                      )}
                    </div>
                  </div>

                  <p className="text-[13px] text-fg-2 line-clamp-2 leading-relaxed">
                    {trace.reasoning}
                  </p>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                        className="mt-3 pt-3 border-t border-edge/[0.08] space-y-2 overflow-hidden"
                      >
                        <div className="grid grid-cols-3 gap-2 text-[11px] p-3 rounded-lg bg-raised/50 border border-edge/[0.08]">
                          <div>
                            <span className="text-fg-4 block text-[10px]">Trace ID</span>
                            <span className="text-fg truncate block font-mono">{trace.trace_id}</span>
                          </div>
                          <div>
                            <span className="text-fg-4 block text-[10px]">Span ID</span>
                            <span className="text-fg truncate block font-mono">{trace.span_id}</span>
                          </div>
                          <div>
                            <span className="text-fg-4 block text-[10px]">Timestamp</span>
                            <span className="text-fg truncate block font-mono">{trace.created_at.split('T')[1]?.slice(0, 8)}</span>
                          </div>
                        </div>

                        {trace.attributes && (
                          <div>
                            <span className="text-[11px] text-fg-4 block mb-1">Attributes</span>
                            <pre className="p-3 rounded-lg bg-code-surface border border-edge/[0.08] text-[11px] font-mono text-emerald-600 dark:text-emerald-400/90 overflow-x-auto">
                              {JSON.stringify(trace.attributes, null, 2)}
                            </pre>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
