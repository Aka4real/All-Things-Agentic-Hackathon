'use client';

import React from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { 
  Layers, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Terminal, 
  Lock, 
  Zap, 
  ShieldAlert 
} from 'lucide-react';
import FleetTopology from '@/components/fleet-topology';
import { INITIAL_AGENTS, INITIAL_SECURITY_EVENTS } from '@/lib/mock-data';

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

export default function MissionControlPage() {
  const recentEvents = INITIAL_SECURITY_EVENTS.slice(0, 3);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Hero */}
      <motion.div 
        variants={itemVariants}
        className="surface p-6 sm:p-8"
      >
        <div className="max-w-2xl">
          <p className="text-[13px] font-medium text-accent mb-3">
            Enterprise Agent Platform
          </p>

          <h1 className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight leading-tight mb-3">
            Autonomous fleet governance <br className="hidden sm:block" />
            with Gemini & GEAP
          </h1>

          <p className="text-[15px] text-fg-3 leading-relaxed mb-6 max-w-xl">
            Discover, orchestrate, and govern institutional agents with verified identity, persistent memory, and real-time threat interception.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/runs/demo-elena-vance"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors shadow-sm"
            >
              <Zap className="w-4 h-4" />
              <span>Launch flagship audit</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-200" />
            </Link>

            <Link
              href="/registry"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-raised hover:bg-raised/80 text-fg text-sm font-medium border border-edge/[0.08] transition-colors"
            >
              <Layers className="w-4 h-4 text-fg-3" />
              <span>Browse agents ({INITIAL_AGENTS.length})</span>
            </Link>
          </div>
        </div>

        {/* Persona context */}
        <div className="mt-6 pt-5 border-t border-edge/[0.08] flex flex-wrap items-center justify-between gap-3 text-[13px] text-fg-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-fg-2 font-medium">Featured scenario:</span>
            <span className="text-fg font-medium">Elena Vance</span>
            <span className="text-fg-4">—</span>
            <span className="text-fg-3">ESG & Supply Chain Risk Auditor</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Zero-trust active
            </span>
            <span className="flex items-center gap-1.5 text-fg-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              Model Armor on
            </span>
          </div>
        </div>
      </motion.div>

      {/* Key metrics */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {[
          { label: 'Registered agents', value: String(INITIAL_AGENTS.length), sub: 'All operational', icon: Layers, color: 'text-accent' },
          { label: 'Reasoning spans', value: '68,490', sub: 'OpenTelemetry v1.28', icon: Terminal, color: 'text-fg-3' },
          { label: 'Threats blocked', value: '49', sub: '0 leaks passed', icon: ShieldAlert, color: 'text-rose-600 dark:text-rose-400' },
          { label: 'Scoped tokens', value: '12,450', sub: '5m TTL enforced', icon: Lock, color: 'text-emerald-600 dark:text-emerald-400' },
        ].map((m) => (
          <div key={m.label} className="surface p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] text-fg-3">{m.label}</span>
              <m.icon className={`w-4 h-4 ${m.color}`} />
            </div>
            <div className="text-xl font-semibold text-fg tracking-tight">{m.value}</div>
            <div className="text-[12px] text-fg-4 mt-0.5">{m.sub}</div>
          </div>
        ))}
      </motion.div>

      {/* Fleet Topology */}
      <motion.div variants={itemVariants}>
        <FleetTopology />
      </motion.div>

      {/* Bottom row */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        {/* Walkthrough */}
        <div className="surface p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-semibold text-fg">Flagship scenario</h3>
            <span className="text-[12px] text-accent font-medium">Recommended</span>
          </div>

          <div className="space-y-3 text-[13px] text-fg-3 leading-relaxed">
            {[
              { n: '1', t: 'Adversarial ingestion', d: 'Vendor sends RFQ with hidden prompt injection and raw PII.' },
              { n: '2', t: 'Model Armor shield', d: 'Guardrails catch and neutralize the injection, redacting PII.' },
              { n: '3', t: 'Memory recall', d: 'Fleet pulls historical carbon and quality audit findings.' },
              { n: '4', t: 'Zero-trust gate', d: 'SAP stock checked with scoped tokens; $82k order pauses for sign-off.' },
            ].map((step) => (
              <div key={step.n} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-md bg-raised text-fg-2 flex items-center justify-center flex-shrink-0 text-[12px] font-medium border border-edge/[0.06]">{step.n}</span>
                <p><span className="text-fg font-medium">{step.t}:</span> {step.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <Link
              href="/runs/demo-elena-vance"
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-raised hover:bg-raised/80 border border-edge/[0.08] text-fg text-[13px] font-medium transition-colors"
            >
              Run live simulation
              <ArrowRight className="w-3.5 h-3.5 text-fg-3" />
            </Link>
          </div>
        </div>

        {/* Threat log */}
        <div className="surface p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-semibold text-fg">Recent interceptions</h3>
            <Link href="/security" className="text-[12px] text-accent hover:underline transition-colors">
              View all →
            </Link>
          </div>

          <div className="space-y-2.5">
            {recentEvents.map((evt) => (
              <div key={evt.id} className="p-3 rounded-lg bg-raised/40 border border-edge/[0.06] text-[13px] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-rose-600 dark:text-rose-400 font-medium capitalize">
                    {evt.threat_type.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-medium">
                    {evt.action_taken}
                  </span>
                </div>
                <p className="text-fg-3 text-[12px] truncate font-mono">{evt.raw_payload}</p>
                <div className="flex items-center justify-between text-[11px] text-fg-4 pt-1 border-t border-edge/[0.06]">
                  <span>{evt.shield_engine}</span>
                  <span>{evt.created_at.split('T')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
