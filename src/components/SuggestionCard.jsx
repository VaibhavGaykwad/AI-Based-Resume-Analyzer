import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

export const SuggestionCard = ({ suggestion, isApplied, onToggleApply }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const icons = {
    High: <AlertTriangle className="w-5 h-5 text-red-500" />,
    Medium: <Info className="w-5 h-5 text-amber-500" />,
    Low: <CheckCircle className="w-5 h-5 text-primary" />
  };

  const impactColors = {
    High: "text-red-700 dark:text-red-400 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/10 border-red-200 dark:border-red-900/30",
    Medium: "text-amber-800 dark:text-amber-400 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/10 border-border-base dark:border-amber-900/30",
    Low: "text-purple-700 dark:text-purple-400 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/10 border-purple-200/80 dark:border-purple-800/30"
  };

  return (
    <motion.div 
      whileHover={{ y: -3, transition: { type: "spring", stiffness: 450, damping: 25 } }}
      className={cn(
        "glass-card border border-border-base bg-card-base hover:bg-bg-base/30 transition-all duration-350 shadow-sm",
        isExpanded ? "border-primary/30 bg-bg-base/20 shadow-md z-10" : ""
      )}
    >
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 text-left transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className={cn("p-2.5 rounded-xl border shrink-0 shadow-sm", impactColors[suggestion.impact])}>
            {icons[suggestion.impact]}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-extrabold text-text-primary tracking-tight text-sm leading-tight break-words">{suggestion.title}</h4>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span className={cn("text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border leading-none shrink-0", impactColors[suggestion.impact])}>
                {suggestion.impact} Impact
              </span>
              {isApplied && (
                <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/30 animate-pulse leading-none">
                  Applying
                </span>
              )}
            </div>
          </div>
        </div>
        <div className={cn("w-8 h-8 rounded-full border border-border-base flex items-center justify-center transition-colors shrink-0", isExpanded ? "bg-primary/10 text-primary border-primary/25" : "text-text-secondary bg-card-base")}>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-5 border-t border-border-base space-y-6">
              {/* Description */}
              <div className="space-y-1.5">
                <span className="text-[9px] uppercase font-bold text-text-secondary tracking-wider">Tweak Description</span>
                <p className="text-text-primary text-[13px] leading-relaxed font-semibold">
                  {suggestion.description}
                </p>
              </div>
              
              {/* Reason */}
              {suggestion.reason && (
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase font-bold text-text-secondary tracking-wider">Why It Matters</span>
                  <p className="text-text-secondary text-[12px] leading-relaxed font-medium">
                    {suggestion.reason}
                  </p>
                </div>
              )}

              {/* Improvements */}
              {suggestion.improvements && (
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase font-bold text-text-secondary tracking-wider">Action Plan</span>
                  <p className="text-text-secondary text-[12px] leading-relaxed font-semibold bg-bg-base border border-border-base p-4 rounded-xl shadow-sm">
                    {suggestion.improvements}
                  </p>
                </div>
              )}

              {/* Code/Text Diff Section */}
              {(suggestion.originalSection || suggestion.improvedSection) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  {suggestion.originalSection && (
                    <div className="space-y-1.5">
                      <span className="text-[9px] uppercase font-bold text-red-500 tracking-wider">Before</span>
                      <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-550/5 text-red-600 dark:text-red-400 font-mono text-[11px] whitespace-pre-wrap leading-relaxed shadow-sm min-h-[60px] border-l-4 border-l-red-400">
                        {suggestion.originalSection}
                      </div>
                    </div>
                  )}

                  {suggestion.improvedSection && (
                    <div className="space-y-1.5">
                      <span className="text-[9px] uppercase font-bold text-emerald-600 tracking-wider">Proposed Tweak</span>
                      <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] whitespace-pre-wrap leading-relaxed shadow-sm min-h-[60px] border-l-4 border-l-emerald-400">
                        {suggestion.improvedSection}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] hover:text-text-primary transition-colors flex items-center gap-2.5 cursor-pointer">
                  View Docs
                  <div className="w-1.5 h-1.5 rounded-full bg-text-secondary/50" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleApply();
                  }}
                  className={cn(
                    "text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-lg transition-all cursor-pointer",
                    isApplied 
                      ? "bg-bg-base text-text-secondary border border-border-base hover:bg-bg-base/70" 
                      : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-95 shadow-md shadow-primary/20"
                  )}
                >
                  {isApplied ? "✓ Applied" : "Apply Tweak"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
