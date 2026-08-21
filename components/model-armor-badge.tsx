'use client';

import React from 'react';
import { ShieldCheck, ShieldAlert, Lock, Eye, EyeOff } from 'lucide-react';
import { SecurityEvent } from '@/lib/types';

interface ModelArmorBadgeProps {
  event?: SecurityEvent;
  totalThreatsBlocked?: number;
}

export default function ModelArmorBadge({ event, totalThreatsBlocked = 48 }: ModelArmorBadgeProps) {
  const [showRaw, setShowRaw] = React.useState(false);

  if (!event) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Model Armor: Armed & Scanning</span>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/50 shadow-lg shadow-rose-950/20 text-xs">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-rose-300 uppercase tracking-wide font-mono text-[11px]">
              THREAT INTERCEPTED: {event.threat_type.replace('_', ' ')}
            </span>
            <span className="text-[10px] font-mono text-rose-400/80 block">
              Engine: {event.shield_engine}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40">
            {event.severity} SEVERITY
          </span>
          <button
            onClick={() => setShowRaw(!showRaw)}
            className="p-1 rounded bg-black/40 border border-slate-800 text-slate-400 hover:text-white flex items-center gap-1 text-[10px] font-mono"
            title="Toggle Raw Payload vs Sanitized Diff"
          >
            {showRaw ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3 text-cyan-400" />}
            {showRaw ? 'Mask' : 'View Diff'}
          </button>
        </div>
      </div>

      <div className="mt-2 space-y-1.5 font-mono text-[11px]">
        {showRaw ? (
          <div>
            <span className="text-slate-500 text-[10px] block">RAW ADVERSARIAL PAYLOAD (BLOCKED):</span>
            <div className="p-2 rounded bg-black/70 border border-rose-500/30 text-rose-300 break-words">
              {event.raw_payload}
            </div>
          </div>
        ) : (
          <div>
            <span className="text-slate-500 text-[10px] block">SANITIZED INLINE OUTPUT (PASSED TO AGENT):</span>
            <div className="p-2 rounded bg-black/70 border border-emerald-500/30 text-emerald-300 break-words">
              {event.sanitized_payload}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
