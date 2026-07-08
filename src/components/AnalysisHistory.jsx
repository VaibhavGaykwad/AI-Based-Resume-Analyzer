import React, { useEffect, useState, useMemo } from 'react';
import { getUserAnalyses, deleteAnalysis } from '../utils/firestoreService';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History, FileText, ChevronRight, Loader2, Calendar, Briefcase,
  Trash2, AlertCircle, CheckCircle2, Search, SlidersHorizontal,
  ChevronUp, ChevronDown, ArrowUpDown, X, UploadCloud
} from 'lucide-react';
import { cn } from '../utils/cn';

function formatDate(date) {
  if (!date) return '';
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function getScoreTier(score) {
  if (score >= 85) return { label: 'Excellent', classes: 'bg-purple-50 border-purple-200 text-purple-700', dot: 'bg-purple-500' };
  if (score >= 70) return { label: 'Strong Match', classes: 'bg-blue-50 border-blue-200 text-blue-700', dot: 'bg-blue-500' };
  if (score >= 55) return { label: 'Competitive', classes: 'bg-cyan-50 border-cyan-200 text-cyan-700', dot: 'bg-cyan-500' };
  if (score >= 40) return { label: 'Developing', classes: 'bg-amber-50 border-amber-200 text-amber-700', dot: 'bg-amber-400' };
  return { label: 'Needs Work', classes: 'bg-red-50 border-red-200 text-red-700', dot: 'bg-red-400' };
}

function ScoreBadge({ score }) {
  const tier = getScoreTier(score);
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide', tier.classes)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', tier.dot)} />
      {tier.label}
    </span>
  );
}

function ATSPill({ score }) {
  const color =
    score >= 75 ? 'text-purple-700 bg-purple-50 border-purple-200' :
    score >= 55 ? 'text-blue-700 bg-blue-50 border-blue-200' :
                  'text-red-600 bg-red-50 border-red-200';
  return (
    <span className={cn('text-sm font-black px-2 py-0.5 rounded-lg border tabular-nums', color)}>
      {score}
    </span>
  );
}

const SortButton = ({ label, field, sortField, sortDir, onSort }) => {
  const active = sortField === field;
  return (
    <button
      onClick={() => onSort(field)}
      className={cn(
        'flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-colors select-none cursor-pointer',
        active ? 'text-indigo-600' : 'text-zinc-400 hover:text-zinc-600'
      )}
    >
      {label}
      {active
        ? sortDir === 'asc'
          ? <ChevronUp className="w-3 h-3" />
          : <ChevronDown className="w-3 h-3" />
        : <ArrowUpDown className="w-3 h-3 opacity-50" />
      }
    </button>
  );
};

export const AnalysisHistory = ({ user, onSelectAnalysis, onDeleteAnalysis, onNavigateToUpload }) => {
  const [analyses, setAnalyses]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast]           = useState(null);

  // Search / Filter / Sort state
  const [query, setQuery]         = useState('');
  const [tierFilter, setTierFilter] = useState('all'); // all | excellent | strong | competitive | developing | needswork
  const [sortField, setSortField]  = useState('date');
  const [sortDir, setSortDir]      = useState('desc');

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getUserAnalyses(user.uid, 100)
      .then((data) => { setAnalyses(data); setLoading(false); })
      .catch((err) => { console.error(err); setError('Failed to load history.'); setLoading(false); });
  }, [user]);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await deleteAnalysis(deletingId);
      setAnalyses(prev => prev.filter(item => item.id !== deletingId));
      if (onDeleteAnalysis) onDeleteAnalysis(deletingId);
      setDeletingId(null);
      showToast('Analysis deleted successfully.', 'success');
    } catch (err) {
      console.error('Delete failed:', err);
      showToast('Failed to delete analysis. Please try again.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const tierMap = {
    excellent:    s => s >= 85,
    strong:       s => s >= 70 && s < 85,
    competitive:  s => s >= 55 && s < 70,
    developing:   s => s >= 40 && s < 55,
    needswork:    s => s < 40,
  };

  const filtered = useMemo(() => {
    let list = [...analyses];

    // Search filter
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(a =>
        (a.analysisData?.name || '').toLowerCase().includes(q) ||
        (a.analysisData?.role || '').toLowerCase().includes(q) ||
        (a.fileName || '').toLowerCase().includes(q)
      );
    }

    // Tier filter
    if (tierFilter !== 'all' && tierMap[tierFilter]) {
      list = list.filter(a => tierMap[tierFilter](a.analysisData?.score ?? 0));
    }

    // Sort
    list.sort((a, b) => {
      if (sortField === 'date') {
        const tA = a.createdAt?.getTime?.() ?? 0;
        const tB = b.createdAt?.getTime?.() ?? 0;
        return sortDir === 'asc' ? tA - tB : tB - tA;
      }
      if (sortField === 'score') {
        const sA = a.analysisData?.score ?? 0;
        const sB = b.analysisData?.score ?? 0;
        return sortDir === 'asc' ? sA - sB : sB - sA;
      }
      if (sortField === 'name') {
        const nA = (a.analysisData?.name || '').toLowerCase();
        const nB = (b.analysisData?.name || '').toLowerCase();
        return sortDir === 'asc'
          ? nA.localeCompare(nB)
          : nB.localeCompare(nA);
      }
      return 0;
    });

    return list;
  }, [analyses, query, tierFilter, sortField, sortDir]);

  const hasFilters = query.trim() !== '' || tierFilter !== 'all';

  return (
    <div className="space-y-6 pb-12 relative">

      {/* ─── Header ─────────────────────────────────────────────────────────── */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shrink-0">
              <History className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-zinc-800 tracking-tight">Scan History</h1>
              <p className="text-zinc-500 text-sm mt-0.5 font-medium">Browse, search, and manage your previous resume analyses.</p>
            </div>
          </div>
          {!loading && analyses.length > 0 && (
            <div className="shrink-0 flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{analyses.length} scans</span>
            </div>
          )}
        </div>

        {/* Search + Filter row */}
        {!loading && analyses.length > 0 && (
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by name, role, or filename…"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-zinc-700 placeholder:text-zinc-350 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter by tier */}
            <div className="relative shrink-0">
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              <select
                value={tierFilter}
                onChange={e => setTierFilter(e.target.value)}
                className="appearance-none bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-8 py-2.5 text-sm font-semibold text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all cursor-pointer"
              >
                <option value="all">All Tiers</option>
                <option value="excellent">Excellent (≥85)</option>
                <option value="strong">Strong Match (70–84)</option>
                <option value="competitive">Competitive (55–69)</option>
                <option value="developing">Developing (40–54)</option>
                <option value="needswork">Needs Work (&lt;40)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* ─── Loading ─────────────────────────────────────────────────────────── */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-zinc-500">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <p className="text-sm font-semibold">Loading your scan history…</p>
        </div>
      )}

      {/* ─── Error ───────────────────────────────────────────────────────────── */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-600 font-semibold text-sm">
          {error}
        </div>
      )}

      {/* ─── Empty State ─────────────────────────────────────────────────────── */}
      {!loading && !error && analyses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 flex items-center justify-center shadow-sm">
            <UploadCloud className="w-7 h-7 text-indigo-400" />
          </div>
          <div className="text-center space-y-1.5">
            <p className="text-zinc-800 font-bold">No scan history yet</p>
            <p className="text-zinc-500 text-sm max-w-sm font-medium leading-relaxed">
              Upload your first resume to start tracking your ATS analyses.
            </p>
          </div>
          {onNavigateToUpload && (
            <button
              onClick={onNavigateToUpload}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-indigo-500/25 cursor-pointer"
            >
              Analyze Resume
            </button>
          )}
        </div>
      )}

      {/* ─── Table ───────────────────────────────────────────────────────────── */}
      {!loading && !error && analyses.length > 0 && (
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] overflow-hidden">

          {/* Table Header */}
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-4 px-5 py-3 border-b border-zinc-100 bg-zinc-50/60">
            <div className="w-8" /> {/* icon col */}
            <SortButton label="Candidate / File" field="name" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
            <SortButton label="ATS Score" field="score" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 hidden md:block">Status</span>
            <SortButton label="Scanned" field="date" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
            <div className="w-8" /> {/* actions col */}
          </div>

          {/* No results from filter */}
          {filtered.length === 0 && (
            <div className="py-16 text-center space-y-2">
              <p className="text-zinc-700 font-semibold">No results found</p>
              <p className="text-zinc-400 text-sm">Try adjusting your search or filter settings.</p>
              <button
                onClick={() => { setQuery(''); setTierFilter('all'); }}
                className="mt-2 text-indigo-500 hover:text-indigo-600 text-xs font-bold uppercase tracking-widest cursor-pointer"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Rows */}
          <AnimatePresence>
            {filtered.map((analysis, idx) => {
              const { analysisData, fileName, createdAt, id } = analysis;
              const score = analysisData?.score ?? 0;
              const isThisDeleting = isDeleting && deletingId === id;

              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, scale: 0.97 }}
                  transition={{ delay: idx * 0.03, duration: 0.2 }}
                >
                  <div
                    onClick={() => onSelectAnalysis({ id, data: analysisData })}
                    className={cn(
                      "grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-4 px-5 py-4 group cursor-pointer transition-all duration-150 hover:bg-indigo-50/40 border-b border-zinc-100/80 last:border-b-0",
                      isThisDeleting && "opacity-40 pointer-events-none"
                    )}
                  >
                    {/* Icon */}
                    <div className="w-9 h-9 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center shrink-0 group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-colors">
                      <FileText className="w-4 h-4 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
                    </div>

                    {/* Name + Role + File */}
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-zinc-800 truncate group-hover:text-indigo-700 transition-colors">
                        {analysisData?.name || 'Unknown Candidate'}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Briefcase className="w-3 h-3 text-zinc-350 shrink-0" />
                        <span className="text-xs text-zinc-500 font-medium truncate">{analysisData?.role || 'Unknown Role'}</span>
                      </div>
                      <p className="text-[10px] text-zinc-350 font-mono truncate mt-0.5 max-w-[200px]">{fileName}</p>
                    </div>

                    {/* ATS Score */}
                    <ATSPill score={score} />

                    {/* Status badge */}
                    <div className="hidden md:flex">
                      <ScoreBadge score={score} />
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium shrink-0">
                      <Calendar className="w-3 h-3 shrink-0" />
                      <span className="hidden sm:inline">{formatDate(createdAt)}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => setDeletingId(id)}
                        disabled={isThisDeleting}
                        className="p-1.5 rounded-lg text-zinc-350 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all disabled:opacity-40 cursor-pointer opacity-0 group-hover:opacity-100"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Footer count */}
          {filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-zinc-100 bg-zinc-50/40 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">
              Showing {filtered.length} of {analyses.length} records
              {hasFilters && (
                <button
                  onClick={() => { setQuery(''); setTierFilter('all'); }}
                  className="ml-3 text-indigo-400 hover:text-indigo-600 cursor-pointer normal-case tracking-normal"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ─── Delete Confirmation Dialog ──────────────────────────────────────── */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 4 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-sm p-6 rounded-2xl border border-zinc-200 bg-white shadow-2xl"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h3 className="text-base font-black text-zinc-800 tracking-tight leading-tight">Delete this analysis?</h3>
                  <p className="text-zinc-500 text-xs mt-1 font-medium leading-relaxed">This action cannot be undone.</p>
                </div>
              </div>
              <div className="flex justify-end gap-2.5 mt-6">
                <button
                  type="button"
                  onClick={() => { if (!isDeleting) setDeletingId(null); }}
                  disabled={isDeleting}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-700 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-xl transition-all disabled:opacity-40 cursor-pointer select-none"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="flex items-center justify-center gap-2 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-sm cursor-pointer disabled:pointer-events-none disabled:opacity-60 select-none min-w-[88px]"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Deleting…
                    </>
                  ) : 'Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Toast ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-xl text-xs font-semibold backdrop-blur-md select-none max-w-xs',
              toast.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-red-50 border-red-200 text-red-650'
            )}
          >
            {toast.type === 'success'
              ? <CheckCircle2 className="w-4 h-4 shrink-0" />
              : <AlertCircle className="w-4 h-4 shrink-0" />
            }
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
