'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  XCircle, 
  DollarSign, 
  FileText, 
  Lock, 
  UserCheck, 
  CornerDownLeft 
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
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onReject();
      } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey || !e.shiftKey)) {
        onApprove();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onApprove, onReject]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onReject}
            className="fixed inset-0 bg-overlay/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", bounce: 0, duration: 0.35 }}
            className="surface w-full max-w-lg p-6 relative z-10 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-start gap-3 mb-5">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-fg tracking-tight">Policy gate triggered</h3>
                <p className="text-[13px] text-fg-3 mt-0.5">
                  High-value transaction exceeds $50,000 threshold. Human approval required.
                </p>
              </div>
            </div>

            {/* Transaction summary */}
            <div className="bg-raised/50 rounded-lg p-4 border border-edge/[0.08] space-y-2.5 mb-5 text-[13px]">
              <div className="flex items-center justify-between">
                <span className="text-fg-3 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  Vendor
                </span>
                <span className="text-fg font-medium">{vendorName}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-fg-3 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5" />
                  Purchase order
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  ${poAmount.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-fg-3 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  Risk score
                </span>
                <span className="text-rose-600 dark:text-rose-400 font-medium">
                  {riskScore}/100 (elevated)
                </span>
              </div>

              <div className="pt-2 border-t border-edge/[0.08]">
                <span className="text-[11px] text-fg-4 block mb-1">Trigger reason</span>
                <p className="text-[13px] text-amber-700 dark:text-amber-300/90 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20 leading-relaxed">
                  {policyReason}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2">
              <button
                onClick={onReject}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-raised hover:bg-raised/80 text-fg text-[13px] font-medium border border-edge/[0.08] transition-colors"
              >
                <XCircle className="w-4 h-4 text-rose-500" />
                Reject (Esc)
              </button>

              <button
                onClick={onApprove}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[13px] font-medium transition-colors shadow-sm"
              >
                <UserCheck className="w-4 h-4" />
                Authorize sign-off
                <CornerDownLeft className="w-3 h-3 text-emerald-200 ml-0.5" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
