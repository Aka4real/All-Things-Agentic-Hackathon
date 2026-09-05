'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  Filter,
  LockKeyhole,
  MoreHorizontal,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  X,
} from 'lucide-react';
import { INITIAL_AGENTS, INITIAL_SECURITY_EVENTS } from '@/lib/mock-data';

const policies = [
  { id: 'zero-trust', label: 'Zero-trust tool access', detail: 'Scoped tokens required for every external action.', owner: 'Security', enabled: true },
  { id: 'human-gates', label: 'Human approval gates', detail: 'Orders above $50k require a designated reviewer.', owner: 'Finance', enabled: true },
  { id: 'pii-redaction', label: 'PII redaction', detail: 'Mask tax IDs and payment data before model context.', owner: 'Privacy', enabled: true },
  { id: 'memory-write', label: 'Governed memory writes', detail: 'New institutional memory requires confidence scoring.', owner: 'Knowledge', enabled: false },
];

const approvals = [
  { id: 'APR-2048', title: 'Purchase order exception', subject: 'Aurora Bio-Polymer · $82,400', requester: 'Lead Supply Chain Auditor', time: '12 min ago', tone: 'amber' },
  { id: 'APR-2047', title: 'New production connector', subject: 'SAP S/4HANA · Finance workspace', requester: 'Corporate Enterprise Systems', time: '48 min ago', tone: 'blue' },
  { id: 'APR-2046', title: 'Policy scope expansion', subject: 'Sanctions Auditor · legal:audit', requester: 'Office of General Counsel', time: '2 hrs ago', tone: 'slate' },
];

const auditEvents = [
  { label: 'Policy updated', description: 'PII redaction policy enabled for all production agents.', actor: 'Maya Chen', time: 'Today, 09:42', icon: FileCheck2 },
  { label: 'Approval completed', description: 'ERP connector access renewed for the Finance workspace.', actor: 'Daniel Okafor', time: 'Today, 08:17', icon: CheckCircle2 },
  { label: 'Threat intercepted', description: 'Prompt injection blocked in vendor onboarding workflow.', actor: 'Model Armor Sentinel', time: 'Yesterday, 18:36', icon: ShieldCheck },
  { label: 'Agent registered', description: 'Global Freight & Customs Route Agent added to the fleet.', actor: 'Priya Nair', time: 'Yesterday, 16:04', icon: Users },
];

const tabs = ['Overview', 'Policies', 'Approvals', 'Audit log'];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [enabledPolicies, setEnabledPolicies] = useState<Record<string, boolean>>(
    Object.fromEntries(policies.map((policy) => [policy.id, policy.enabled])),
  );
  const [resolvedApprovals, setResolvedApprovals] = useState<string[]>([]);
  const [query, setQuery] = useState('');

  const visibleEvents = useMemo(
    () => auditEvents.filter((event) => `${event.label} ${event.description} ${event.actor}`.toLowerCase().includes(query.toLowerCase())),
    [query],
  );
  const openApprovals = approvals.filter((approval) => !resolvedApprovals.includes(approval.id));
  const healthyAgents = INITIAL_AGENTS.filter((agent) => agent.sla_status === 'healthy').length;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="flex flex-col gap-6">
      <section className="surface overflow-hidden">
        <div className="flex flex-col gap-6 p-5 sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm"><LockKeyhole className="size-5" /></div>
              <div>
                <div className="mb-1 flex flex-wrap items-center gap-2 text-[12px] text-fg-3"><span>Enterprise admin</span><span className="text-fg-4">/</span><span>Northstar Industries</span><span className="rounded-full bg-emerald-500/10 px-2 py-0.5 font-medium text-emerald-600 dark:text-emerald-400">Production</span></div>
                <h1 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">Governance center</h1>
                <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-fg-3">Control the policies, people, and permissions that keep your autonomous fleet accountable.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-fg-3"><span className="flex items-center gap-1.5 rounded-full border border-edge/[0.08] bg-raised/50 px-2.5 py-1.5"><Activity className="size-3.5 text-emerald-500" /> All systems operational</span><button aria-label="More admin actions" className="rounded-lg p-2 text-fg-3 hover:bg-raised hover:text-fg"><MoreHorizontal className="size-4" /></button></div>
          </div>
          <div className="flex gap-1 overflow-x-auto border-b border-edge/[0.08] pb-px">
            {tabs.map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap rounded-t-lg px-3 py-2 text-[13px] font-medium transition-colors ${activeTab === tab ? 'border-b-2 border-blue-500 text-fg' : 'text-fg-3 hover:text-fg'}`}>{tab}{tab === 'Approvals' && openApprovals.length > 0 ? <span className="ml-2 rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[11px] text-amber-600 dark:text-amber-400">{openApprovals.length}</span> : null}</button>)}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Fleet posture', value: `${healthyAgents}/${INITIAL_AGENTS.length}`, sub: 'agents healthy', icon: ShieldCheck, color: 'text-emerald-500' },
          { label: 'Policy coverage', value: '98.4%', sub: '+2.1% this month', icon: ClipboardCheck, color: 'text-blue-500' },
          { label: 'Pending approvals', value: String(openApprovals.length), sub: 'need attention', icon: Clock3, color: 'text-amber-500' },
          { label: 'Audit activity', value: '1,284', sub: `${INITIAL_SECURITY_EVENTS.length} interceptions today`, icon: Activity, color: 'text-fg-3' },
        ].map((metric) => <div key={metric.label} className="surface p-4"><div className="mb-3 flex items-center justify-between"><span className="text-[12px] text-fg-3">{metric.label}</span><metric.icon className={`size-4 ${metric.color}`} /></div><div className="text-xl font-semibold tracking-tight text-fg">{metric.value}</div><div className="mt-1 text-[11px] text-fg-4">{metric.sub}</div></div>)}
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="surface p-5 sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-3"><div><div className="flex items-center gap-2"><SlidersHorizontal className="size-4 text-blue-500" /><h2 className="text-[15px] font-semibold text-fg">Policy controls</h2></div><p className="mt-1 text-[12px] text-fg-3">Global guardrails applied across your agent fleet.</p></div><button className="flex items-center gap-1 text-[12px] font-medium text-blue-500 hover:text-blue-400">Manage policies <ArrowUpRight className="size-3.5" /></button></div>
          <div className="flex flex-col gap-2">{policies.map((policy) => <div key={policy.id} className="flex items-center justify-between gap-4 rounded-xl border border-edge/[0.07] bg-raised/30 p-3.5"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="text-[13px] font-medium text-fg">{policy.label}</span><span className="rounded bg-raised px-1.5 py-0.5 text-[10px] text-fg-4">{policy.owner}</span></div><p className="mt-1 text-[11px] leading-relaxed text-fg-3">{policy.detail}</p></div><button role="switch" aria-checked={enabledPolicies[policy.id]} aria-label={`Toggle ${policy.label}`} onClick={() => setEnabledPolicies((current) => ({ ...current, [policy.id]: !current[policy.id] }))} className={`relative h-6 w-10 shrink-0 rounded-full transition-colors ${enabledPolicies[policy.id] ? 'bg-blue-600' : 'bg-raised'}`}><span className={`absolute top-1 size-4 rounded-full bg-white shadow-sm transition-transform ${enabledPolicies[policy.id] ? 'left-5' : 'left-1'}`} /></button></div>)}</div>
        </section>

        <section className="surface p-5 sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-3"><div><div className="flex items-center gap-2"><AlertTriangle className="size-4 text-amber-500" /><h2 className="text-[15px] font-semibold text-fg">Approval queue</h2></div><p className="mt-1 text-[12px] text-fg-3">Human-in-the-loop actions waiting for review.</p></div><span className="rounded-full bg-amber-500/10 px-2 py-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">{openApprovals.length} open</span></div>
          <div className="flex flex-col gap-2">{openApprovals.length === 0 ? <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-edge/[0.12] p-8 text-center"><CheckCircle2 className="size-6 text-emerald-500" /><p className="text-[13px] font-medium text-fg">Queue is clear</p><p className="text-[12px] text-fg-3">All requests have been reviewed.</p></div> : openApprovals.map((approval) => <div key={approval.id} className="rounded-xl border border-edge/[0.07] bg-raised/30 p-3.5"><div className="flex items-start justify-between gap-3"><div><p className="text-[13px] font-medium text-fg">{approval.title}</p><p className="mt-1 text-[11px] text-fg-3">{approval.subject}</p></div><span className="font-mono text-[10px] text-fg-4">{approval.id}</span></div><div className="mt-3 flex items-center justify-between gap-3"><span className="text-[11px] text-fg-4">{approval.requester} · {approval.time}</span><div className="flex gap-1.5"><button aria-label={`Reject ${approval.title}`} onClick={() => setResolvedApprovals((current) => [...current, approval.id])} className="rounded-md border border-edge/[0.08] p-1.5 text-fg-3 hover:bg-raised hover:text-rose-500"><X className="size-3.5" /></button><button onClick={() => setResolvedApprovals((current) => [...current, approval.id])} className="flex items-center gap-1 rounded-md bg-blue-600 px-2 py-1.5 text-[11px] font-medium text-white hover:bg-blue-500"><Check className="size-3" /> Review</button></div></div></div>)}</div>
        </section>
      </div>

      <section className="surface p-5 sm:p-6"><div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex items-center gap-2"><FileCheck2 className="size-4 text-fg-3" /><h2 className="text-[15px] font-semibold text-fg">Recent audit activity</h2></div><p className="mt-1 text-[12px] text-fg-3">A tamper-evident record of governance events across the workspace.</p></div><label className="flex items-center gap-2 rounded-lg border border-edge/[0.08] bg-raised/30 px-2.5 py-1.5 text-[12px] text-fg-3"><Search className="size-3.5" /><span className="sr-only">Search audit activity</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search events" className="w-32 bg-transparent text-fg outline-none placeholder:text-fg-4" /></label></div><div className="flex flex-col">{visibleEvents.map((event) => <div key={`${event.label}-${event.time}`} className="flex items-start gap-3 border-t border-edge/[0.07] py-3.5"><div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-raised text-fg-3"><event.icon className="size-3.5" /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-x-2 gap-y-1"><p className="text-[13px] font-medium text-fg">{event.label}</p><span className="text-[11px] text-fg-4">{event.time}</span></div><p className="mt-1 text-[12px] text-fg-3">{event.description}</p><p className="mt-1 text-[11px] text-fg-4">Performed by {event.actor}</p></div><ChevronRight className="mt-1 size-4 shrink-0 text-fg-4" /></div>)}{visibleEvents.length === 0 && <div className="border-t border-edge/[0.07] py-8 text-center text-[13px] text-fg-3">No matching audit events.</div>}</div><button className="mt-2 flex items-center gap-1 text-[12px] font-medium text-blue-500 hover:text-blue-400">View full audit log <ArrowUpRight className="size-3.5" /></button></section>
    </motion.div>
  );
}
