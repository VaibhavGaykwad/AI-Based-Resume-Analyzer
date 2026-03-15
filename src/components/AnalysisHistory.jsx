import React, { useEffect, useState } from 'react';
import { getUserAnalyses } from '../utils/firestoreService';
import { motion, AnimatePresence } from 'framer-motion';
import { History, FileText, ChevronRight, Loader2, Inbox, Calendar, Briefcase } from 'lucide-react';
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
    score >= 50 ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                  'text-red-400 bg-red-500/10 border-red-500/20';
  return (
    <span className={cn('text-[10px] uppercase font-black px-2 py-0.5 rounded-md border', color)}>
      {score} ATS
    </span>
  );
}

export const AnalysisHistory = ({ user, onSelectAnalysis }) => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getUserAnalyses(user.uid, 5)
      .then((data) => { setAnalyses(data); setLoading(false); })
      .catch((err) => { console.error(err); setError('Failed to load history.'); setLoading(false); });
  }, [user]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="glass-card p-6 flex items-center gap-4 border-t-2 border-t-primary/30">
        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <History className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-zinc-100 tracking-tight">Previous Analyses</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Your last 5 resume scans — click any to reload the results.</p>
        </div>
      </div>

      {/* Content */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-zinc-500">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Loading your history…</p>
        </div>
      )}

      {error && !loading && (
        <div className="glass-card p-6 text-center text-red-400 border border-red-500/20">
          {error}
        </div>
      )}

      {!loading && !error && analyses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <Inbox className="w-8 h-8 text-zinc-600" />
          </div>
          <div className="text-center">
            <p className="text-zinc-300 font-semibold">No analyses yet</p>
            <p className="text-zinc-600 text-sm mt-1">Upload your first resume to get started.</p>
          </div>
        </div>
      )}

      {!loading && !error && analyses.length > 0 && (
        <div className="space-y-3">
          <AnimatePresence>
            {analyses.map((analysis, idx) => {
              const { analysisData, fileName, createdAt, id } = analysis;
              return (
                <motion.button
                  key={id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  onClick={() => onSelectAnalysis(analysisData)}
                  className="w-full text-left glass-card p-5 border border-zinc-800/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4">
                    {/* File icon */}
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 group-hover:border-primary/30 transition-colors">
                      <FileText className="w-5 h-5 text-zinc-500 group-hover:text-primary transition-colors" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-zinc-100 truncate">{analysisData?.name || 'Unknown Candidate'}</p>
                        <ScorePill score={analysisData?.score ?? 0} />
                      </div>
                      <div className="flex items-center gap-3 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          {analysisData?.role || 'Unknown Role'}
                        </span>
                        <span className="text-zinc-700">•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(createdAt)}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-600 truncate mt-1">{fileName}</p>
                    </div>

                    {/* Arrow */}
                    <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
