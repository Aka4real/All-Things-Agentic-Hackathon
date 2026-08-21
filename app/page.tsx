'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Layers, 
  Database, 
  Lock, 
  Cpu, 
  Sparkles, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2,
  Terminal,
  Server,
  Zap,
  Globe
} from 'lucide-react';
import FleetTopology from '@/components/fleet-topology';
import { INITIAL_AGENTS, INITIAL_SECURITY_EVENTS } from '@/lib/mock-data';

export default function MissionControlPage() {
  const recentEvents = INITIAL_SECURITY_EVENTS.slice(0, 3);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Section / Unlikely Hero Showcase */}
      <div className="relative glass-panel rounded-3xl p-8 border border-card-border/80 overflow-hidden shadow-2xl">
        {/* Background glow effects */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/30 text-cyan-300 text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>THE FORTIFIED ENTERPRISE FLEET • HACKATHON SHOWCASE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
            Autonomous Institutional Fleet Governance with <span className="bg-gradient-to-r from-cyan-400 via-primary-400 to-emerald-400 bg-clip-text text-transparent">Gemini & GEAP</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
            Scale institutional agents across your enterprise with verified discovery, long-running state persistence, zero-trust cryptographic access, and real-time Model Armor threat guardrails.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/runs/demo-elena-vance"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary-600 via-indigo-600 to-cyan-600 hover:from-primary-500 hover:to-cyan-500 text-white text-sm font-bold shadow-lg shadow-primary-600/30 transition-all hover:scale-[1.02]"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Launch Elena Vance Flagship Audit</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/registry"
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-sm font-semibold border border-card-border hover:border-slate-600 transition-all"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Browse Agent Registry ({INITIAL_AGENTS.length})</span>
            </Link>
          </div>
        </div>

        {/* Persona Spotlight Badge */}
        <div className="mt-8 pt-6 border-t border-card-border/60 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">FEATURED UNLIKELY HERO:</span>
            <span className="text-white font-semibold">Elena Vance</span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-cyan-300">
              Corporate ESG & Supply Chain Risk Auditor
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Zero-Trust SAP Mesh
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Gemma 2 Armor Active
            </span>
          </div>
        </div>
      </div>

      {/* 4 Key Performance Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="glass-panel p-5 rounded-2xl border border-card-border/80 relative overflow-hidden group hover:border-primary-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400">AGENT REGISTRY</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mb-1">{INITIAL_AGENTS.length} Institutional</div>
          <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            100% SLA Operational
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel p-5 rounded-2xl border border-card-border/80 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400">OTEL REASONING SPANS</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Terminal className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mb-1">68,490 Spans</div>
          <div className="text-[11px] font-mono text-cyan-400">
            OpenTelemetry v1.28 Spec
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel p-5 rounded-2xl border border-card-border/80 relative overflow-hidden group hover:border-rose-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400">MODEL ARMOR BLOCKS</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mb-1">49 Intercepted</div>
          <div className="text-[11px] font-mono text-rose-400">
            0 Leaks / 0 Injections Passed
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel p-5 rounded-2xl border border-card-border/80 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400">ZERO-TRUST TOKENS</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mb-1">12,450 Scoped</div>
          <div className="text-[11px] font-mono text-emerald-400">
            Ephemeral 5m TTL Enforced
          </div>
        </div>
      </div>

      {/* Interactive Fleet Topology Map */}
      <FleetTopology />

      {/* Bottom Row: Recent Security Threats & Flagship Scenario Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card: Flagship Walkthrough Guide */}
        <div className="glass-panel p-6 rounded-2xl border border-card-border/80 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-card-border/60">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">The Flagship Scenario Walkthrough</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary-500/10 text-primary-400 border border-primary-500/20">
              Judge Recommended
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-mono">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-primary-600/30 text-cyan-300 flex items-center justify-center flex-shrink-0 text-[11px] font-bold">1</span>
              <p><strong className="text-white">Adversarial Ingestion:</strong> Vendor sends an RFQ containing a hidden prompt injection and raw PII bank coordinates.</p>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-primary-600/30 text-cyan-300 flex items-center justify-center flex-shrink-0 text-[11px] font-bold">2</span>
              <p><strong className="text-white">Model Armor Shield:</strong> Inline guardrails catch and neutralize the prompt injection, redacting the PII in real-time.</p>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-primary-600/30 text-cyan-300 flex items-center justify-center flex-shrink-0 text-[11px] font-bold">3</span>
              <p><strong className="text-white">Memory Bank Recall:</strong> Fleet pulls historical records showing previous carbon and quality audit findings.</p>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-primary-600/30 text-cyan-300 flex items-center justify-center flex-shrink-0 text-[11px] font-bold">4</span>
              <p><strong className="text-white">Zero-Trust ERP & Policy Gate:</strong> SAP stock checked with scoped tokens; $82k order pauses for executive sign-off.</p>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/runs/demo-elena-vance"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all"
            >
              <span>Run Live Simulation Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Card: Model Armor Real-time Threat Radar */}
        <div className="glass-panel p-6 rounded-2xl border border-card-border/80 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-card-border/60">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">Model Armor Interceptions Log</h3>
            </div>
            <Link href="/security" className="text-[11px] font-mono text-cyan-400 hover:underline">
              View All Threat Logs →
            </Link>
          </div>

          <div className="space-y-3">
            {recentEvents.map((evt) => (
              <div key={evt.id} className="p-3 rounded-xl bg-[#0a0f1d] border border-card-border/60 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-rose-300 font-bold uppercase text-[11px]">
                    {evt.threat_type.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    {evt.action_taken.toUpperCase()}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] truncate font-mono">{evt.raw_payload}</p>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800">
                  <span>{evt.shield_engine}</span>
                  <span>{evt.created_at.split('T')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
