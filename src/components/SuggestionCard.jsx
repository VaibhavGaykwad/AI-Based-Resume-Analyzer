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
    High: "text-red-600 bg-red-50 border-red-200",
    Medium: "text-amber-700 bg-amber-50 border-amber-200",
    Low: "text-primary bg-primary/10 border-primary/20"
  };

  return (
    <div className={cn(
      "glass-card border border-zinc-200 bg-white hover:bg-slate-50/50 transition-all duration-300 shadow-sm",
      isExpanded ? "ring-2 ring-primary/20 bg-white shadow-md" : ""
    )}>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 text-left transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div className={cn("p-2 rounded-xl border", impactColors[suggestion.impact])}>
            {icons[suggestion.impact]}
          </div>
          <div>
            <h4 className="font-bold text-zinc-805 tracking-tight">{suggestion.title}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn("text-[9px] uppercase font-black tracking-[0.15em] px-2 py-0.5 rounded border", impactColors[suggestion.impact])}>
                {suggestion.impact} Impact
              </span>
              {isApplied && (
                <span className="text-[9px] uppercase font-black tracking-[0.15em] px-2 py-0.5 rounded text-green-600 bg-green-50 border border-green-200 animate-pulse">
                  Applying
                </span>
              )}
            </div>
          </div>
        </div>
        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-colors", isExpanded ? "bg-primary/10 text-primary" : "text-zinc-400")}>
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
            <div className="px-6 pb-6 pt-4 border-t border-zinc-100 space-y-4">
              <p className="text-zinc-650 text-[13px] leading-relaxed font-semibold">
                <strong className="text-zinc-800">Description:</strong> {suggestion.description}
              </p>
              
              {suggestion.reason && (
                <p className="text-zinc-550 text-[12px] leading-relaxed">
                  <strong className="text-zinc-700">Why Detected:</strong> {suggestion.reason}
                </p>
              )}

              {suggestion.improvements && (
                <div className="text-zinc-500 text-[12px] leading-relaxed">
                  <strong className="text-zinc-700">Improvement Steps:</strong>
                  <p className="mt-1 text-zinc-600">{suggestion.improvements}</p>
                </div>
              )}

              {suggestion.originalSection && (
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-black tracking-wider text-red-500 opacity-80">Original Section</span>
                  <div className="p-3 rounded-lg border border-red-100 bg-red-50/50 text-red-650 font-mono text-[11px] whitespace-pre-wrap leading-normal">
                    {suggestion.originalSection}
                  </div>
                </div>
              )}

              {suggestion.improvedSection && (
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-black tracking-wider text-green-600 opacity-80">Improved Section</span>
                  <div className="p-3 rounded-lg border border-green-100 bg-green-50/50 text-green-650 font-mono text-[11px] whitespace-pre-wrap leading-normal">
                    {suggestion.improvedSection}
                  </div>
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
                      ? "bg-zinc-100 text-zinc-500 border border-zinc-200 hover:bg-zinc-200" 
                      : "bg-primary text-white hover:opacity-95 shadow-md shadow-primary/20"
                  )}
                >
                  {isApplied ? "✓ Applied" : "Apply Suggestion"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
