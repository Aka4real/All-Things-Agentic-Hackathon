'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  Search, 
  Plus, 
  Clock, 
  ShieldCheck, 
  X 
} from 'lucide-react';
import { MemoryBankService } from '@/lib/memory-bank';
import { MemoryBankItem } from '@/lib/types';

export default function MemoryBankPage() {
  const [memories, setMemories] = useState<MemoryBankItem[]>(MemoryBankService.getAllMemories());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newEntityName, setNewEntityName] = useState('');
  const [newEntityId, setNewEntityId] = useState('');
  const [newEntityType, setNewEntityType] = useState<MemoryBankItem['entity_type']>('vendor');
  const [newMemoryKey, setNewMemoryKey] = useState('');
  const [newContent, setNewContent] = useState('');

  const types = ['All', 'vendor', 'contract', 'audit_finding', 'esg_report'];

  const filteredMemories = memories.filter((mem) => {
    const matchesSearch =
      mem.entity_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mem.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mem.memory_key.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || mem.entity_type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntityName || !newContent) return;

    MemoryBankService.addMemory({
      entity_name: newEntityName,
      entity_id: newEntityId || `VEND-${Date.now().toString().slice(-4)}`,
      entity_type: newEntityType,
      memory_key: newMemoryKey || 'general_observation',
      content: newContent,
      confidence_score: 0.96,
      metadata: { source: 'Manual ingest', ingested_by: 'Elena Vance' }
    });

    setMemories(MemoryBankService.getAllMemories());
    setShowAddModal(false);
    setNewEntityName('');
    setNewEntityId('');
    setNewContent('');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 surface p-5 sm:p-6">
        <div>
          <h1 className="text-xl font-semibold text-fg tracking-tight">Memory Bank</h1>
          <p className="text-[13px] text-fg-3 mt-1">
            Cross-session persistent memory with vector embeddings for compliance records.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add memory
        </button>
      </div>

      {/* Search & filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-fg-4 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search memories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface border border-edge/[0.08] focus:border-accent/50 focus:outline-none text-[13px] text-fg placeholder:text-fg-4 transition-colors"
          />
        </div>

        <div className="flex items-center gap-0.5 overflow-x-auto">
          {types.map((t) => {
            const isSelected = selectedType === t;
            return (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`relative px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors whitespace-nowrap capitalize ${
                  isSelected ? 'text-fg' : 'text-fg-3 hover:text-fg'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="memory-type"
                    className="absolute inset-0 rounded-lg bg-raised"
                    transition={{ type: "spring", bounce: 0, duration: 0.35 }}
                  />
                )}
                <span className="relative z-10">{t.replace('_', ' ')}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Memories grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <AnimatePresence>
          {filteredMemories.map((mem) => (
            <motion.div
              layout
              key={mem.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", bounce: 0, duration: 0.35 }}
              className="surface p-4 sm:p-5 space-y-3 hover:border-edge/[0.18] transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] text-fg-4 font-medium capitalize">{mem.entity_type.replace('_', ' ')}</span>
                  <h3 className="text-[14px] font-medium text-fg mt-0.5">{mem.entity_name}</h3>
                  <span className="text-[12px] text-fg-3 font-mono">{mem.memory_key} · {mem.entity_id}</span>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-fg-4 block">Confidence</span>
                  <span className="text-[13px] font-medium text-emerald-600 dark:text-emerald-400">
                    {(mem.confidence_score * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <p className="text-[13px] text-fg-2 leading-relaxed p-3 rounded-lg bg-raised/50 border border-edge/[0.08]">
                {mem.content}
              </p>

              <div className="pt-2 border-t border-edge/[0.08] flex items-center justify-between text-[11px] text-fg-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {mem.created_at.split('T')[0]}
                </span>
                <span className="font-mono">768-dim embedding</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Add modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-overlay/50 backdrop-blur-sm"
            />

            <motion.form
              onSubmit={handleAddMemory}
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ type: "spring", bounce: 0, duration: 0.35 }}
              className="surface w-full max-w-md p-6 space-y-4 relative z-10 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-fg flex items-center gap-2">
                  <Database className="w-5 h-5 text-accent" />
                  Add memory record
                </h2>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="text-fg-4 hover:text-fg p-1 rounded-lg hover:bg-raised transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[12px] text-fg-3 block mb-1">Entity name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cobalt Supply Logistics Corp"
                    value={newEntityName}
                    onChange={(e) => setNewEntityName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-edge/[0.12] text-fg text-[13px] focus:border-accent/50 focus:outline-none placeholder:text-fg-4"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[12px] text-fg-3 block mb-1">Entity type</label>
                    <select
                      value={newEntityType}
                      onChange={(e) => setNewEntityType(e.target.value as MemoryBankItem['entity_type'])}
                      className="w-full px-3 py-2 rounded-lg bg-surface border border-edge/[0.12] text-fg text-[13px] focus:border-accent/50 focus:outline-none"
                    >
                      <option value="vendor">Vendor</option>
                      <option value="contract">Contract</option>
                      <option value="audit_finding">Audit finding</option>
                      <option value="esg_report">ESG report</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[12px] text-fg-3 block mb-1">Memory key</label>
                    <input
                      type="text"
                      placeholder="e.g. late_shipment_penalty"
                      value={newMemoryKey}
                      onChange={(e) => setNewMemoryKey(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-surface border border-edge/[0.12] text-fg text-[13px] font-mono focus:border-accent/50 focus:outline-none placeholder:text-fg-4"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[12px] text-fg-3 block mb-1">Content</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Enter context, findings, or contract terms..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full p-3 rounded-lg bg-surface border border-edge/[0.12] text-fg text-[13px] leading-relaxed focus:border-accent/50 focus:outline-none placeholder:text-fg-4"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-raised text-fg text-[13px] font-medium hover:bg-raised/80 border border-edge/[0.06] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-medium transition-colors shadow-sm"
                >
                  Save record
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
