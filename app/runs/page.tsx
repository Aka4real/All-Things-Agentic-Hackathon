'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Terminal, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  FileText,
  Zap,
  Lock
} from 'lucide-react';

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
      date: 'Live Flagship Scenario'
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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-card-border/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Institutional Workflow Runs</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Agent Runtime
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time execution telemetry, OpenTelemetry reasoning traces, and audit logs across long-running operations.
          </p>
        </div>

        <Link
          href="/runs/demo-elena-vance"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-600 to-cyan-600 hover:from-primary-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-primary-600/30 transition-all"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>Launch Flagship Audit</span>
        </Link>
      </div>

      {/* Runs Table / Cards */}
      <div className="space-y-4">
        {previousRuns.map((run) => (
          <div
            key={run.id}
            className={`glass-panel p-6 rounded-2xl border transition-all ${
              run.id === 'demo-elena-vance'
                ? 'border-cyan-500/50 bg-gradient-to-r from-[#0d1322] via-[#091124] to-[#0d1322] shadow-xl shadow-cyan-950/20'
                : 'border-card-border/70 hover:border-slate-700'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-xs font-mono text-cyan-400 font-bold">
                    {run.id === 'demo-elena-vance' ? '★ FLAGSHIP SHOWCASE' : 'RUN-ID: ' + run.id}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {run.date}
                  </span>
                  {run.status === 'completed' && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                      COMPLETED
                    </span>
                  )}
                  {run.status === 'blocked_by_armor' && (
                    <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-mono">
                      INTERCEPTED BY ARMOR
                    </span>
                  )}
                  {run.status === 'ready_for_execution' && (
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-mono animate-pulse">
                      INTERACTIVE READY
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white">{run.name}</h3>

                <div className="flex items-center gap-4 text-xs font-mono text-slate-300 flex-wrap">
                  <span className="flex items-center gap-1 text-slate-400">
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    Vendor: <strong className="text-white ml-1">{run.vendor}</strong>
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    Risk Score: <strong className={`ml-1 ${run.risk_score > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>{run.risk_score}/100</strong>
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    Amount: <strong className="text-emerald-400 ml-1">${run.po_amount.toLocaleString()} USD</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={`/runs/${run.id}`}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    run.id === 'demo-elena-vance'
                      ? 'bg-gradient-to-r from-primary-600 to-cyan-600 text-white shadow-lg shadow-primary-600/30 hover:scale-105'
                      : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{run.id === 'demo-elena-vance' ? 'Run Live Stream' : 'Inspect Traces'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
