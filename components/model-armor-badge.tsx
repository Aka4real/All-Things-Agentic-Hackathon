'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { SecurityEvent } from '@/lib/types';

interface ModelArmorBadgeProps {
  event?: SecurityEvent;
  totalThreatsBlocked?: number;
}

export default function ModelArmorBadge({ event, totalThreatsBlocked = 49 }: ModelArmorBadgeProps) {
  const [showRaw, setShowRaw] = useState(false);

  if (!event) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[13px]">
        <ShieldCheck className="w-4 h-4" />
        <span className="font-medium">Model Armor armed</span>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", bounce: 0, duration: 0.35 }}
      className="surface p-4 border-rose-500/20 space-y-2.5"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          <div>
            <span className="text-[13px] font-medium text-rose-600 dark:text-rose-300 block capitalize">
              Intercepted: {event.threat_type.replace('_', ' ')}
            </span>
            <span className="text-[11px] text-fg-4 block">
              {event.shield_engine}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[11px] font-medium">
            {event.severity}
          </span>
          <button
            onClick={() => setShowRaw(!showRaw)}
            className="p-1.5 rounded-lg bg-raised hover:bg-raised/80 border border-edge/[0.08] text-fg-3 hover:text-fg flex items-center gap-1 text-[11px] transition-colors"
          >
            {showRaw ? <EyeOff className="w-3 h-3 text-rose-500" /> : <Eye className="w-3 h-3 text-accent" />}
            <span>{showRaw ? 'Hide' : 'Diff'}</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={showRaw ? 'raw' : 'sanitized'}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
        >
          {showRaw ? (
            <div>
              <span className="text-[11px] text-fg-4 block mb-1">Raw payload (blocked)</span>
              <div className="p-2.5 rounded-lg bg-raised/50 border border-rose-500/20 text-rose-600 dark:text-rose-300/90 break-words text-[12px] font-mono">
                {event.raw_payload}
              </div>
            </div>
          ) : (
            <div>
              <span className="text-[11px] text-fg-4 block mb-1">Sanitized output</span>
              <div className="p-2.5 rounded-lg bg-raised/50 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400/90 break-words text-[12px] font-mono">
                {event.sanitized_payload}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
