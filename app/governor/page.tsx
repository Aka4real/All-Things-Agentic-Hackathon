'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, 
  Sparkles, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  Layers, 
  Lock, 
  Terminal, 
  Cpu, 
  Zap, 
  ArrowRight, 
  Database,
  ExternalLink,
  ChevronRight,
  Fingerprint
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  GovernorProblemInput, 
  GovernorAnalysisResult, 
  GovernorOrchestrationRun, 
  AgentTrace 
} from '@/lib/types';
import { GovernorEngine, GOVERNOR_ENTERPRISE_PRESETS } from '@/lib/governor';
import { DynamicAgentStore } from '@/lib/agent-store';
import TraceTimeline from '@/components/trace-timeline';
import ApprovalModal from '@/components/approval-modal';

export default function GovernorStudioPage() {
  // Input form state
  const presets = GOVERNOR_ENTERPRISE_PRESETS;
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  
  const [title, setTitle] = useState(presets[0].title);
  const [department, setDepartment] = useState(presets[0].department);
  const [priority, setPriority] = useState<'standard' | 'elevated' | 'critical'>(presets[0].priority);
  const [vendorContext, setVendorContext] = useState(presets[0].vendor_context || '');
  const [poAmount, setPoAmount] = useState<number>(presets[0].estimated_amount_usd || 84000);
  const [problemDescription, setProblemDescription] = useState(presets[0].problem_description);

  // Governor engine state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<GovernorAnalysisResult | null>(null);
  const [orchestrationRun, setOrchestrationRun] = useState<GovernorOrchestrationRun | null>(null);
  const [liveTraces, setLiveTraces] = useState<AgentTrace[]>([]);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [hasApproved, setHasApproved] = useState(false);
  const [customAgentDeployed, setCustomAgentDeployed] = useState(false);
  const [fleetCount, setFleetCount] = useState<number>(6);

  useEffect(() => {
    setFleetCount(DynamicAgentStore.getAllAgents().length);
  }, [customAgentDeployed]);

  const loadPreset = (index: number) => {
    const p = presets[index];
    setSelectedPresetIndex(index);
    setTitle(p.title);
    setDepartment(p.department);
    setPriority(p.priority);
    setVendorContext(p.vendor_context || '');
    setPoAmount(p.estimated_amount_usd || 50000);
    setProblemDescription(p.problem_description);
    // Reset output states
    setAnalysisResult(null);
    setOrchestrationRun(null);
    setLiveTraces([]);
    setActiveStepIndex(0);
    setCustomAgentDeployed(false);
    setHasApproved(false);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setOrchestrationRun(null);
    setLiveTraces([]);
    setActiveStepIndex(1);
    setCustomAgentDeployed(false);

    const input: GovernorProblemInput = {
      title,
      department,
      priority,
      vendor_context: vendorContext,
      estimated_amount_usd: poAmount,
      problem_description: problemDescription
    };

    try {
      const response = await fetch('/api/governor/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });
      if (!response.ok) {
        throw new Error(`Governor API error: ${response.statusText}`);
      }
      const result: GovernorAnalysisResult = await response.json();
      setAnalysisResult(result);
      setActiveStepIndex(2);
    } catch (err) {
      console.error('Governor analysis failed, using fallback:', err);
      const fallback = await GovernorEngine.analyzeProblem(input);
      setAnalysisResult(fallback);
      setActiveStepIndex(2);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExecuteFleet = async () => {
    if (!analysisResult) return;
    setIsExecuting(true);
    setLiveTraces([]);
    setActiveStepIndex(3);
    setHasApproved(false);

    try {
      const input: GovernorProblemInput = {
        title,
        department,
        priority,
        vendor_context: vendorContext,
        estimated_amount_usd: poAmount,
        problem_description: problemDescription
      };

      // Realtime trace callback
      const accumulatedTraces: AgentTrace[] = [];
      const run = await GovernorEngine.orchestrateFleetExecution({
        input,
        analysis: analysisResult,
        onTrace: (trace) => {
          accumulatedTraces.push(trace);
          setLiveTraces([...accumulatedTraces]);
        }
      });

      setOrchestrationRun(run);
      setCustomAgentDeployed(true);
      setActiveStepIndex(4);

      // Check if policy gate requires approval
      if (run.policy_evaluation?.requires_human_approval && !hasApproved) {
        setShowApprovalModal(true);
      } else if (run.composite_risk_score < 70) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error('Fleet orchestration failed:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleApprovePolicy = () => {
    setHasApproved(true);
    setShowApprovalModal(false);
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.6 }
    });
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setOrchestrationRun(null);
    setLiveTraces([]);
    setActiveStepIndex(0);
    setCustomAgentDeployed(false);
    setHasApproved(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Supreme Governor Header */}
      <div className="surface p-5 sm:p-6 relative overflow-hidden border border-edge/[0.15]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[11px] font-semibold tracking-wide uppercase">
                <Crown className="w-3.5 h-3.5" />
                Apex Orchestrator
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-medium">
                <Sparkles className="w-3 h-3" />
                Gemini 3.8 Flash Synthesizer
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight">
              The Governor Studio
            </h1>
            <p className="text-[13px] text-fg-3 mt-1 max-w-2xl leading-relaxed">
              When an enterprise challenge falls outside static institutional agents, The Governor 
              detects the capability gap, autonomously models and names a custom agent with Zero-Trust scopes, 
              and supervises multi-agent execution.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/registry"
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-raised hover:bg-raised/80 text-fg text-[13px] font-medium border border-edge/[0.08] transition-colors"
            >
              <Layers className="w-4 h-4 text-fg-3" />
              <span>Fleet Registry</span>
            </Link>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-raised hover:bg-raised/80 text-fg-3 hover:text-fg text-[13px] font-medium border border-edge/[0.08] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Status bar */}
        <div className="mt-5 pt-4 border-t border-edge/[0.08] flex flex-wrap items-center justify-between gap-3 text-[12px] text-fg-3">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-emerald-500 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Zero-Trust Scope Gate Active
            </span>
            <span className="flex items-center gap-1.5 text-fg-2">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Model Armor Inline Guardrail
            </span>
            <span className="flex items-center gap-1.5 text-fg-3">
              <Cpu className="w-3.5 h-3.5" />
              Gemini 3.8 Flash Hybrid Engine
            </span>
          </div>

          <div className="text-fg-4 font-mono text-[11px]">
            GEAP-GOVERNOR-V2.5 // AUTONOMOUS SYNTHESIS
          </div>
        </div>
      </div>

      {/* Preset Challenge Switcher */}
      <div className="surface p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[12px] font-semibold text-fg uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Try Enterprise Hackathon Scenarios
          </span>
          <span className="text-[11px] text-fg-4">Click to autofill challenge</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {presets.map((p, idx) => {
            const isSelected = selectedPresetIndex === idx;
            return (
              <button
                key={p.title}
                onClick={() => loadPreset(idx)}
                className={`text-left p-3 rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-blue-500/10 border-blue-500/40 text-fg'
                    : 'bg-raised/40 border-edge/[0.08] text-fg-3 hover:border-edge/[0.2] hover:text-fg'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[11px] font-medium text-accent">
                    Preset #{idx + 1} • {p.department}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase ${
                    p.priority === 'critical' 
                      ? 'bg-rose-500/20 text-rose-400' 
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {p.priority}
                  </span>
                </div>
                <h4 className="text-[13px] font-medium text-fg line-clamp-1">{p.title}</h4>
                <p className="text-[11px] text-fg-4 line-clamp-2 mt-1">{p.problem_description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Briefing Terminal Form & Dynamic Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Unstructured Problem Terminal */}
        <div className="lg:col-span-2 surface p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-blue-400" />
              <h2 className="text-[15px] font-semibold text-fg">Enterprise Challenge Terminal</h2>
            </div>
            <span className="text-[11px] text-fg-4 font-mono">Unstructured Natural Language</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-fg-3 block mb-1">Challenge Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-raised/50 border border-edge/[0.08] focus:border-blue-500 focus:outline-none text-[13px] text-fg transition-colors"
                placeholder="e.g. EU Battery Directive Compliance..."
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-fg-3 block mb-1">Enterprise Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-raised/50 border border-edge/[0.08] focus:border-blue-500 focus:outline-none text-[13px] text-fg transition-colors"
                placeholder="e.g. ESG & Clean Tech..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-medium text-fg-3 block mb-1">Vendor / Entity Context</label>
              <input
                type="text"
                value={vendorContext}
                onChange={(e) => setVendorContext(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-raised/50 border border-edge/[0.08] focus:border-blue-500 focus:outline-none text-[13px] text-fg transition-colors"
                placeholder="e.g. Nexus Materials Ltd..."
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-fg-3 block mb-1">Estimated PO Amount ($)</label>
              <input
                type="number"
                value={poAmount}
                onChange={(e) => setPoAmount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-raised/50 border border-edge/[0.08] focus:border-blue-500 focus:outline-none text-[13px] text-fg font-mono transition-colors"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-fg-3 block mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-raised/50 border border-edge/[0.08] focus:border-blue-500 focus:outline-none text-[13px] text-fg transition-colors"
              >
                <option value="standard">Standard</option>
                <option value="elevated">Elevated</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium text-fg-3 block mb-1">
              Detailed Problem Description (The Governor will parse capabilities from this)
            </label>
            <textarea
              rows={4}
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-raised/50 border border-edge/[0.08] focus:border-blue-500 focus:outline-none text-[13px] text-fg leading-relaxed transition-colors resize-y font-mono"
              placeholder="Describe the enterprise problem, regulations, or supply chain ambiguity..."
            />
          </div>

          {/* Action Trigger */}
          <div className="pt-2 flex items-center justify-between">
            <div className="text-[12px] text-fg-4">
              Step 1: The Governor inspects fleet & identifies missing capabilities.
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || isExecuting || !problemDescription.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[13px] font-semibold transition-all shadow-md disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>Diffing Fleet Capabilities...</span>
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4 text-amber-300" />
                  <span>Analyze Need & Synthesize Agent</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right 1 Col: Fleet Status & Zero-Trust Scope Matrix */}
        <div className="surface p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-[14px] font-semibold text-fg flex items-center gap-2 mb-2">
              <Fingerprint className="w-4 h-4 text-blue-400" />
              Dynamic Governance Policy
            </h3>
            <p className="text-[12px] text-fg-3 leading-relaxed mb-4">
              All dynamically synthesized agents operate under strict Zero-Trust boundaries:
            </p>

            <div className="space-y-2.5 text-[12px]">
              <div className="p-2.5 rounded-lg bg-raised/50 border border-edge/[0.08]">
                <div className="flex items-center justify-between text-fg mb-1">
                  <span className="font-medium">Model Armor Sanitizer</span>
                  <span className="text-[11px] text-emerald-500 font-semibold">Gemma 4 Inline</span>
                </div>
                <p className="text-[11px] text-fg-4">Blocks injection attempts before passing to subagents.</p>
              </div>

              <div className="p-2.5 rounded-lg bg-raised/50 border border-edge/[0.08]">
                <div className="flex items-center justify-between text-fg mb-1">
                  <span className="font-medium">Spend Authorization Gate</span>
                  <span className="text-[11px] text-amber-400 font-semibold">$50,000 USD</span>
                </div>
                <p className="text-[11px] text-fg-4">Halts automated execution for POs &gt; $50k or risk score &gt; 70.</p>
              </div>

              <div className="p-2.5 rounded-lg bg-raised/50 border border-edge/[0.08]">
                <div className="flex items-center justify-between text-fg mb-1">
                  <span className="font-medium">Ephemeral Token TTL</span>
                  <span className="text-[11px] text-blue-400 font-semibold">300 Seconds</span>
                </div>
                <p className="text-[11px] text-fg-4">Single-session cryptographic token scoped per subtask.</p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-edge/[0.08] flex items-center justify-between text-[11px] text-fg-4">
            <span>Dynamic Fleet Count:</span>
            <span className="font-mono text-fg font-semibold" suppressHydrationWarning>
              {fleetCount} active
            </span>
          </div>
        </div>
      </div>

      {/* Analysis & Agent Reveal Section */}
      <AnimatePresence>
        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.45 }}
            className="space-y-4"
          >
            {/* Capability Gap Summary Banner */}
            <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              analysisResult.capability_gap_detected
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
            }`}>
              <div className="flex items-start sm:items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  analysisResult.capability_gap_detected ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {analysisResult.capability_gap_detected ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-fg">
                    {analysisResult.capability_gap_detected 
                      ? 'Capability Gap Detected — Custom Agent Synthesized' 
                      : 'Existing Fleet Covers 100% of Requirements'}
                  </h3>
                  <p className="text-[12px] text-fg-3 mt-0.5">
                    {analysisResult.gap_analysis_summary}
                  </p>
                </div>
              </div>

              {analysisResult.custom_agent_spec && (
                <button
                  onClick={handleExecuteFleet}
                  disabled={isExecuting}
                  className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-semibold transition-colors shadow-sm disabled:opacity-50"
                >
                  {isExecuting ? (
                    <>
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Supervising Fleet...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Deploy Agent & Run Fleet Audit</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Forensic Intelligence & Regulatory Exposure Matrix */}
            {analysisResult.forensic_assessment && (
              <div className="surface p-5 rounded-xl border border-edge/[0.12] space-y-4 bg-raised/20">
                <div className="flex items-center justify-between border-b border-edge/[0.08] pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">⚖️</span>
                    <h3 className="text-[13px] font-semibold text-fg uppercase tracking-wider">
                      Forensic Intelligence & Regulatory Exposure Matrix
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    Live Gemini Legal Reasoning
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Regulatory Exposures */}
                  <div className="p-3 rounded-lg bg-black/20 border border-rose-500/20 space-y-2">
                    <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider block flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                      Statutory Violations & Regulatory Directives
                    </span>
                    <ul className="space-y-1.5">
                      {analysisResult.forensic_assessment.regulatory_exposure.map((item, idx) => (
                        <li key={idx} className="text-[12px] text-fg-2 flex items-start gap-2 leading-relaxed">
                          <span className="text-rose-400 shrink-0 mt-1 text-[10px]">■</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technical Failure Modes */}
                  <div className="p-3 rounded-lg bg-black/20 border border-amber-500/20 space-y-2">
                    <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      Technical & Forensic Failure Modes
                    </span>
                    <ul className="space-y-1.5">
                      {analysisResult.forensic_assessment.technical_failure_modes.map((item, idx) => (
                        <li key={idx} className="text-[12px] text-fg-2 flex items-start gap-2 leading-relaxed">
                          <span className="text-amber-400 shrink-0 mt-1 text-[10px]">■</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {analysisResult.forensic_assessment.strategic_rationale && (
                  <div className="pt-2 text-[12px] text-fg-3 leading-relaxed border-t border-edge/[0.08]">
                    <strong className="text-fg font-medium">Supreme Governor Strategic Directive: </strong>
                    {analysisResult.forensic_assessment.strategic_rationale}
                  </div>
                )}
              </div>
            )}

            {/* Synthesized Custom Agent Card & Delegation Plan */}
            {analysisResult.custom_agent_spec && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Custom Agent Spec Card */}
                <div className="lg:col-span-7 surface p-5 sm:p-6 border-2 border-blue-500/30 relative overflow-hidden">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          Synthesized by The Governor
                        </span>
                        <span className="text-[11px] text-fg-4 font-mono">v{analysisResult.custom_agent_spec.version}</span>
                      </div>
                      <h2 className="text-xl font-semibold text-fg mt-1.5 flex items-center gap-2">
                        {analysisResult.custom_agent_spec.name}
                      </h2>
                      <span className="text-[12px] font-mono text-accent">
                        @{analysisResult.custom_agent_spec.agent_slug}
                      </span>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <Sparkles className="w-5 h-5" />
                    </div>
                  </div>

                  <p className="text-[13px] text-fg-2 leading-relaxed mb-4">
                    {analysisResult.custom_agent_spec.description}
                  </p>

                  <div className="space-y-3 pt-3 border-t border-edge/[0.08]">
                    {/* Capabilities */}
                    <div>
                      <span className="text-[11px] font-semibold text-fg-4 block uppercase tracking-wider mb-1.5">
                        Synthesized Capabilities
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {analysisResult.custom_agent_spec.capabilities.map((cap) => (
                          <span 
                            key={cap}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-raised text-fg-2 border border-edge/[0.08]"
                          >
                            {cap}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Scopes */}
                    <div>
                      <span className="text-[11px] font-semibold text-fg-4 block uppercase tracking-wider mb-1.5">
                        Provisioned Zero-Trust Permission Scopes
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {analysisResult.custom_agent_spec.required_scopes.map((scope) => (
                          <span 
                            key={scope}
                            className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1"
                          >
                            <Lock className="w-2.5 h-2.5" />
                            {scope}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* System Prompt preview */}
                    <div>
                      <span className="text-[11px] font-semibold text-fg-4 block uppercase tracking-wider mb-1">
                        Cognitive System Instruction
                      </span>
                      <div className="p-3 rounded-lg bg-black/40 border border-edge/[0.08] text-[11px] text-fg-3 font-mono leading-relaxed">
                        {analysisResult.custom_agent_spec.system_instruction}
                      </div>
                    </div>
                  </div>

                  {customAgentDeployed && (
                    <div className="mt-4 pt-3 border-t border-edge/[0.08] flex items-center justify-between text-[12px] text-emerald-400">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        Live in Enterprise Registry
                      </span>
                      <Link 
                        href="/registry"
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium underline"
                      >
                        Inspect in Catalog <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>

                {/* Multi-Agent Delegation Plan */}
                <div className="lg:col-span-5 surface p-5 sm:p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[14px] font-semibold text-fg flex items-center gap-2">
                      <Layers className="w-4 h-4 text-blue-400" />
                      Governor Delegation Board
                    </h3>
                    <span className="text-[11px] text-fg-4">
                      {analysisResult.delegation_plan.length} subtasks
                    </span>
                  </div>

                  <p className="text-[12px] text-fg-3 leading-relaxed">
                    The Governor decomposed the enterprise problem and assigned roles across standard and synthesized agents:
                  </p>

                  <div className="space-y-2 pt-1">
                    {analysisResult.delegation_plan.map((task, i) => (
                      <div 
                        key={task.task_id}
                        className={`p-3 rounded-lg border transition-all ${
                          task.is_custom 
                            ? 'bg-blue-500/10 border-blue-500/30' 
                            : 'bg-raised/40 border-edge/[0.08]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[12px] font-medium text-fg flex items-center gap-1.5">
                            {task.is_custom ? (
                              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            ) : (
                              <Cpu className="w-3.5 h-3.5 text-fg-4" />
                            )}
                            {task.agent_name}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase ${
                            task.is_custom 
                              ? 'bg-blue-500/20 text-blue-300' 
                              : 'bg-raised text-fg-3'
                          }`}>
                            {task.is_custom ? 'Custom Synthesized' : 'Standard Fleet'}
                          </span>
                        </div>
                        <p className="text-[11px] text-fg-3 leading-snug">{task.subtask_description}</p>
                        <div className="mt-2 flex items-center gap-2 text-[10px] text-fg-4 font-mono">
                          <Lock className="w-2.5 h-2.5 text-emerald-400" />
                          <span>Scope: {task.zero_trust_scope}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleExecuteFleet}
                      disabled={isExecuting}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-semibold transition-colors shadow-sm disabled:opacity-50"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Start Supervised Multi-Agent Run</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Governor Execution Board & OpenTelemetry Timeline */}
      <AnimatePresence>
        {liveTraces.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Header / Outcome */}
            <div className="surface p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/15 text-blue-400">
                      OpenTelemetry Span Stream
                    </span>
                    <span className="text-[12px] font-mono text-fg-4">
                      {liveTraces.length} spans captured
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-fg">
                    Governor Command-and-Control Trace
                  </h3>
                </div>

                {orchestrationRun && (
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[11px] text-fg-4 block">Composite Risk Score</span>
                      <span className={`text-xl font-bold ${
                        orchestrationRun.composite_risk_score >= 70 
                          ? 'text-rose-500' 
                          : 'text-emerald-500'
                      }`}>
                        {orchestrationRun.composite_risk_score}/100
                      </span>
                    </div>

                    {orchestrationRun.policy_evaluation?.requires_human_approval && (
                      <button
                        onClick={() => setShowApprovalModal(true)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
                          hasApproved 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-amber-600 hover:bg-amber-500 text-white shadow-sm'
                        }`}
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        {hasApproved ? 'Officer Sign-Off Granted' : 'Review Policy Gate'}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Final Verdict Banner */}
              {orchestrationRun && (
                <div className={`mt-4 p-3.5 rounded-lg border text-[13px] leading-relaxed flex items-start gap-2.5 ${
                  orchestrationRun.composite_risk_score >= 70
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                }`}>
                  <div className="shrink-0 mt-0.5">
                    {orchestrationRun.composite_risk_score >= 70 ? (
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <div>
                    <span className="font-semibold text-fg">Executive Governor Verdict: </span>
                    <span>{orchestrationRun.executive_verdict}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Trace Timeline Component */}
            <TraceTimeline traces={liveTraces} isLive={isExecuting} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Human-in-the-Loop Policy Gate Approval Modal */}
      {orchestrationRun && (
        <ApprovalModal
          isOpen={showApprovalModal}
          poAmount={poAmount}
          vendorName={vendorContext || title}
          policyReason={orchestrationRun.policy_evaluation?.reason || 'Composite risk exceeds automated limit.'}
          riskScore={orchestrationRun.composite_risk_score}
          onApprove={handleApprovePolicy}
          onReject={() => setShowApprovalModal(false)}
        />
      )}
    </div>
  );
}
