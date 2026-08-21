'use client';

import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  Plus, 
  Sparkles, 
  Tag, 
  Clock, 
  ShieldCheck, 
  CheckCircle2,
  FileCode
} from 'lucide-react';
import { MemoryBankService } from '@/lib/memory-bank';
import { MemoryBankItem } from '@/lib/types';

export default function MemoryBankPage() {
  const [memories, setMemories] = useState<MemoryBankItem[]>(MemoryBankService.getAllMemories());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
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

    const created = MemoryBankService.addMemory({
      entity_name: newEntityName,
      entity_id: newEntityId || `VEND-${Date.now().toString().slice(-4)}`,
      entity_type: newEntityType,
      memory_key: newMemoryKey || 'general_observation',
      content: newContent,
      confidence_score: 0.96,
      metadata: { source: 'Institutional Auditor Manual Ingest', ingested_by: 'Elena Vance' }
    });

    setMemories(MemoryBankService.getAllMemories());
    setShowAddModal(false);
    setNewEntityName('');
    setNewEntityId('');
    setNewContent('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-card-border/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">GEAP Memory Bank</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
              Cross-Session Persistent
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Long-term institutional memory with vector embeddings for multi-week supply chain negotiations and compliance records.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-primary-600 hover:from-amber-500 hover:to-primary-500 text-white text-xs font-bold shadow-lg shadow-amber-950/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Ingest Memory Record</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search vector embeddings & memories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#090e1a] border border-card-border focus:border-amber-500/60 focus:outline-none text-xs text-white placeholder:text-slate-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all uppercase font-mono ${
                selectedType === t
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-transparent hover:border-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Memories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMemories.map((mem) => (
          <div
            key={mem.id}
            className="glass-panel p-5 rounded-2xl border border-card-border/80 space-y-3 hover:border-amber-500/40 transition-all group"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-amber-300 border border-white/10">
                  {mem.entity_type.replace('_', ' ')}
                </span>
                <h3 className="text-base font-bold text-white mt-1 group-hover:text-amber-300 transition-colors">
                  {mem.entity_name}
                </h3>
                <span className="text-xs text-slate-500 font-mono">KEY: {mem.memory_key} • ID: {mem.entity_id}</span>
              </div>

              <div className="text-right font-mono">
                <span className="text-[10px] text-slate-500 block">CONFIDENCE</span>
                <span className="text-xs font-bold text-emerald-400">
                  {(mem.confidence_score * 100).toFixed(0)}% Match
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-mono bg-[#090e1a]/80 p-3 rounded-xl border border-slate-800/80">
              {mem.content}
            </p>

            <div className="pt-2 border-t border-card-border/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                {mem.created_at.split('T')[0]}
              </span>
              <span className="text-amber-400/80">768-dim text-embedding-004</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Memory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <form onSubmit={handleAddMemory} className="glass-panel w-full max-w-lg p-6 rounded-2xl border border-amber-500/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-400" />
                Ingest Institutional Memory
              </h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 text-[10px] block mb-1">ENTITY NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cobalt Supply Logistics Corp"
                  value={newEntityName}
                  onChange={(e) => setNewEntityName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/50 border border-card-border text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-[10px] block mb-1">ENTITY TYPE</label>
                  <select
                    value={newEntityType}
                    onChange={(e) => setNewEntityType(e.target.value as MemoryBankItem['entity_type'])}
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-card-border text-white text-xs"
                  >
                    <option value="vendor">Vendor</option>
                    <option value="contract">Contract</option>
                    <option value="audit_finding">Audit Finding</option>
                    <option value="esg_report">ESG Report</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-[10px] block mb-1">MEMORY KEY</label>
                  <input
                    type="text"
                    placeholder="e.g. late_shipment_penalty"
                    value={newMemoryKey}
                    onChange={(e) => setNewMemoryKey(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-card-border text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-[10px] block mb-1">CROSS-SESSION CONTENT (PARSED CONTEXT)</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter context, findings, or contract terms to be stored across sessions..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-black/60 border border-card-border text-slate-300 text-xs font-mono"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-primary-600 text-white text-xs font-bold shadow-lg shadow-amber-950/40"
              >
                Save to Memory Bank
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
