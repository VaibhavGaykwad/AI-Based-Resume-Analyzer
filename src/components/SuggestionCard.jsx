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
    High: "text-red-700 bg-gradient-to-r from-red-50 to-orange-50 border-red-200",
    Medium: "text-amber-850 bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-250/70",
    Low: "text-purple-700 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200/80"
  };

  return (
    <div className={cn(
      "glass-card border border-zinc-205 bg-white hover:bg-slate-50/30 transition-all duration-350 shadow-sm",
      isExpanded ? "border-purple-200 bg-slate-50/20 shadow-md translate-x-px z-10" : ""
    )}>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 text-left transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div className={cn("p-2.5 rounded-xl border shrink-0 shadow-3xs", impactColors[suggestion.impact])}>
            {icons[suggestion.impact]}
          </div>
          <div>
            <h4 className="font-extrabold text-zinc-800 tracking-tight text-sm leading-tight">{suggestion.title}</h4>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={cn("text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border leading-none", impactColors[suggestion.impact])}>
                {suggestion.impact} Impact
              </span>
              {isApplied && (
                <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded text-green-600 bg-green-50 border border-green-200 animate-pulse leading-none">
                  Applying
                </span>
              )}
            </div>
          </div>
        </div>
        <div className={cn("w-8 h-8 rounded-full border border-zinc-150 flex items-center justify-center transition-colors shrink-0", isExpanded ? "bg-purple-100 text-purple-600 border-purple-200" : "text-zinc-400 bg-white")}>
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
            <div className="px-6 pb-6 pt-5 border-t border-zinc-100 space-y-6">
              {/* Description */}
              <div className="space-y-1.5">
                <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider">Tweak Description</span>
                <p className="text-zinc-700 text-[13px] leading-relaxed font-semibold">
                  {suggestion.description}
                </p>
              </div>
              
              {/* Reason */}
              {suggestion.reason && (
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider">Why It Matters</span>
                  <p className="text-zinc-600 text-[12px] leading-relaxed font-medium">
                    {suggestion.reason}
                  </p>
                </div>
              )}

              {/* Improvements */}
              {suggestion.improvements && (
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider">Action Plan</span>
                  <p className="text-zinc-600 text-[12px] leading-relaxed font-semibold bg-zinc-50 border border-zinc-200 p-4 rounded-xl shadow-3xs">
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
                      <div className="p-3.5 rounded-xl border border-red-100 bg-red-50/20 text-red-650 font-mono text-[11px] whitespace-pre-wrap leading-relaxed shadow-3xs min-h-[60px] border-l-4 border-l-red-400">
                        {suggestion.originalSection}
                      </div>
                    </div>
                  )}

                  {suggestion.improvedSection && (
                    <div className="space-y-1.5">
                      <span className="text-[9px] uppercase font-bold text-emerald-600 tracking-wider">Proposed Tweak</span>
                      <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/15 text-emerald-650 font-mono text-[11px] whitespace-pre-wrap leading-relaxed shadow-3xs min-h-[60px] border-l-4 border-l-emerald-400">
                        {suggestion.improvedSection}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] hover:text-zinc-600 transition-colors flex items-center gap-2.5 cursor-pointer">
                  View Docs
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleApply();
                  }}
                  className={cn(
                    "text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-lg transition-all cursor-pointer",
                    isApplied 
                      ? "bg-zinc-100 text-zinc-550 border border-zinc-200 hover:bg-zinc-200" 
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
    </div>
  );
};
