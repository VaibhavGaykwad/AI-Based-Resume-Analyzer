import React, { useEffect, useState } from 'react';
import { getUserAnalyses, deleteAnalysis } from '../utils/firestoreService';
import { motion, AnimatePresence } from 'framer-motion';
import { History, FileText, ChevronRight, Loader2, Calendar, Briefcase, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
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

function ScorePill({ score }) {
  const color =
    score >= 75 ? 'text-primary bg-primary/10 border-primary/20' :
    score >= 50 ? 'text-amber-700 bg-amber-50 border-amber-200' :
                  'text-red-650 bg-red-50 border-red-200';
  return (
    <span className={cn('text-[10px] uppercase font-bold px-2 py-0.5 rounded-md border', color)}>
      {score} ATS
    </span>
  );
}

export const AnalysisHistory = ({ user, onSelectAnalysis, onDeleteAnalysis, onNavigateToUpload }) => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null); // ID of record pending deletion
  const [isDeleting, setIsDeleting] = useState(false); // spinner state
  const [toast, setToast] = useState(null); // { message, type }

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

  return (
    <div className="space-y-6 pb-12 relative">
      {/* Header */}
      <div className="glass-card p-6 flex items-center gap-4 border border-zinc-200 bg-white">
        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <History className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-zinc-800 tracking-tight">Previous Analyses</h1>
          <p className="text-zinc-550 text-sm mt-0.5 font-semibold">Your previous resume scans — click any to reload reports or delete entries.</p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-zinc-500">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm font-semibold">Loading your history…</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="glass-card p-6 text-center text-red-500 border border-red-200 bg-red-50">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && analyses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center text-2xl select-none shadow-xs">
            🗂️
          </div>
          <div className="text-center space-y-1.5">
            <p className="text-zinc-805 font-bold">No analysis history yet</p>
            <p className="text-zinc-500 text-sm max-w-sm font-semibold leading-relaxed">
              Upload your first resume to start tracking your resume analyses.
            </p>
          </div>
          {onNavigateToUpload && (
            <button
              onClick={onNavigateToUpload}
              className="px-5 py-2.5 rounded-xl bg-primary hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-primary/25 cursor-pointer"
            >
              Analyze Resume
            </button>
          )}
        </div>
      )}

      {/* List */}
      {!loading && !error && analyses.length > 0 && (
        <div className="space-y-3">
          <AnimatePresence>
            {analyses.map((analysis, idx) => {
              const { analysisData, fileName, createdAt, id } = analysis;
              const isThisDeleting = isDeleting && deletingId === id;
              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, scale: 0.96 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div
                    onClick={() => onSelectAnalysis({ id, data: analysisData })}
                    className="w-full text-left glass-card p-5 border border-zinc-200 bg-white hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 group cursor-pointer flex items-center gap-4 shadow-xs hover:shadow-sm"
                  >
                    {/* File icon */}
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-zinc-200 flex items-center justify-center shrink-0 group-hover:border-primary/30 transition-colors">
                      <FileText className="w-5 h-5 text-zinc-450 group-hover:text-primary transition-colors" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-zinc-800 truncate">{analysisData?.name || 'Unknown Candidate'}</p>
                        <ScorePill score={analysisData?.score ?? 0} />
                      </div>
                      <div className="flex items-center gap-3 text-xs text-zinc-550">
                        <span className="flex items-center gap-1 font-semibold">
                          <Briefcase className="w-3 h-3 text-zinc-400" />
                          {analysisData?.role || 'Unknown Role'}
                        </span>
                        <span className="text-zinc-300">•</span>
                        <span className="flex items-center gap-1 font-semibold">
                          <Calendar className="w-3 h-3 text-zinc-400" />
                          {formatDate(createdAt)}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate mt-1.5 font-mono">{fileName}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0 ml-auto bg-transparent">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingId(id);
                        }}
                        disabled={isThisDeleting}
                        className="p-2 rounded-lg text-zinc-400 hover:text-red-650 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all z-10 disabled:opacity-40 cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4 cursor-pointer" />
                      </button>
                      <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 4 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-sm p-6 rounded-2xl border border-zinc-200 bg-white shadow-2xl"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h3 className="text-base font-black text-zinc-800 tracking-tight leading-tight">Delete this analysis?</h3>
                  <p className="text-zinc-500 text-xs mt-1 font-semibold leading-relaxed">This action cannot be undone.</p>
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
                  className="flex items-center justify-center gap-2 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all border border-red-700/40 shadow-lg cursor-pointer disabled:pointer-events-none disabled:opacity-60 select-none min-w-[88px]"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Deleting…
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
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
                ? 'bg-emerald-50 border-emerald-250 text-emerald-700'
                : 'bg-red-50 border-red-250 text-red-650'
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
