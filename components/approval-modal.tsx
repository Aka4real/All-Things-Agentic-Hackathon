'use client';

import React from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  DollarSign, 
  FileText, 
  Lock,
  UserCheck
} from 'lucide-react';

interface ApprovalModalProps {
  isOpen: boolean;
  poAmount: number;
  vendorName: string;
  policyReason: string;
  riskScore: number;
  onApprove: () => void;
  onReject: () => void;
}

export default function ApprovalModal({
  isOpen,
  poAmount,
  vendorName,
  policyReason,
  riskScore,
  onApprove,
  onReject
}: ApprovalModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-xl p-6 rounded-2xl border border-amber-500/50 shadow-2xl shadow-amber-950/40 relative">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-wide">Human Policy Gate Triggered</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Action Required
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              The Agent Gateway paused automated execution. High-value transaction policy exceeded.
            </p>
          </div>
        </div>

        {/* Transaction Summary Card */}
        <div className="bg-[#090e1a]/90 rounded-xl p-4 border border-card-border/80 space-y-3 mb-6">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              Target Vendor:
            </span>
            <span className="text-white font-semibold">{vendorName}</span>
          </div>

          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              Purchase Order Amount:
            </span>
            <span className="text-emerald-400 font-bold text-sm">
              ${poAmount.toLocaleString()} USD
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              Supplier Composite Risk:
            </span>
            <span className="text-rose-400 font-bold">
              {riskScore}/100 (ELEVATED)
            </span>
          </div>

          <div className="pt-2 border-t border-slate-800 text-xs">
            <span className="text-slate-500 font-mono text-[10px] block mb-1">GATEWAY TRIGGER REASON:</span>
            <p className="text-amber-200/90 font-mono text-[11px] bg-amber-950/20 p-2 rounded border border-amber-500/20 leading-relaxed">
              {policyReason}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onReject}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/60 hover:text-rose-300 text-slate-300 text-xs font-semibold border border-slate-700 hover:border-rose-500/40 transition-all"
          >
            <XCircle className="w-4 h-4 text-rose-400" />
            Reject Transaction
          </button>

          <button
            onClick={onApprove}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 transition-all hover:scale-[1.02]"
          >
            <UserCheck className="w-4 h-4 text-white" />
            Authorize Executive Sign-Off
          </button>
        </div>
      </div>
    </div>
  );
}
