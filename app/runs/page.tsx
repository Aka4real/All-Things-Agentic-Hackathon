'use client';

import React from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { 
  Terminal, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  FileText,
  Zap,
  Lock
} from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", bounce: 0, duration: 0.5 },
  },
};

export default function WorkflowRunsPage() {
  const previousRuns = [
    {
      id: 'demo-elena-vance',
      name: 'Elena Vance: Nexus Materials Fast-Track & ESG Fraud Audit',
      hero_persona: 'Elena Vance (ESG & Supply Chain Risk Auditor)',
      status: 'ready_for_execution',
      vendor: 'Nexus Materials Ltd (Shenzhen)',
      po_amount: 82000,
      risk_score: 78,
      spans_count: 8,
      date: 'Live flagship scenario'
    },
    {
      id: 'run-prev-099',
      name: 'Aurora Bio-Polymer GMBH Q1 Expedited Procurement',
      hero_persona: 'Elena Vance (ESG Auditor)',
      status: 'completed',
      vendor: 'Aurora Bio-Polymer GMBH',
      po_amount: 45000,
      risk_score: 12,
      spans_count: 6,
      date: '2026-02-20 18:30 UTC'
    },
    {
      id: 'run-prev-098',
      name: 'Zenith Solar Solutions Tier-3 Labor Watchlist Audit',
      hero_persona: 'Sanctions & AML Auditor',
      status: 'blocked_by_armor',
      vendor: 'Zenith Solar Solutions',
      po_amount: 110000,
      risk_score: 92,
      spans_count: 5,
      date: '2026-02-19 11:15 UTC'
    }
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-5"
    >
      {/* Header */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 surface p-5 sm:p-6"
      >
        <div>
          <h1 className="text-xl font-semibold text-fg tracking-tight">Workflow Runs</h1>
          <p className="text-[13px] text-fg-3 mt-1">
            Execution telemetry, reasoning traces, and audit logs.
          </p>
        </div>

        <Link
          href="/runs/demo-elena-vance"
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-medium transition-colors shadow-sm"
        >
          <Zap className="w-3.5 h-3.5" />
          Launch flagship audit
        </Link>
      </motion.div>

      {/* Runs */}
      <div className="space-y-3">
        {previousRuns.map((run) => (
          <motion.div
            key={run.id}
            variants={itemVariants}
            className={`surface p-5 sm:p-6 transition-colors ${
              run.id === 'demo-elena-vance'
                ? 'border-accent/30 bg-accent/[0.03]'
                : 'hover:border-edge/[0.18]'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[12px] font-mono text-fg-3">
                    {run.id === 'demo-elena-vance' ? 'Flagship' : run.id}
                  </span>
                  <span className="text-edge/[0.2]">·</span>
                  <span className="text-[12px] text-fg-4 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {run.date}
                  </span>
                  {run.status === 'completed' && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium">
                      Completed
                    </span>
                  )}
                  {run.status === 'blocked_by_armor' && (
                    <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[11px] font-medium">
                      Intercepted
                    </span>
                  )}
                  {run.status === 'ready_for_execution' && (
                    <span className="px-1.5 py-0.5 rounded bg-accent/10 text-accent text-[11px] font-medium">
                      Ready
                    </span>
                  )}
                </div>

                <h3 className="text-[15px] font-medium text-fg">{run.name}</h3>

                <div className="flex items-center gap-4 text-[13px] text-fg-3 flex-wrap">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-fg-4" />
                    {run.vendor}
                  </span>
                  <span className="flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-fg-4" />
                    Risk: <span className={run.risk_score > 50 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}>{run.risk_score}/100</span>
                  </span>
                  <span>
                    ${run.po_amount.toLocaleString()}
                  </span>
                </div>
              </div>

              <Link
                href={`/runs/${run.id}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                  run.id === 'demo-elena-vance'
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
                    : 'bg-raised hover:bg-raised/80 text-fg border border-edge/[0.06]'
                }`}
              >
                {run.id === 'demo-elena-vance' ? 'Run live stream' : 'Inspect traces'}
                <ArrowRight className="w-3.5 h-3.5 text-fg-4" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
