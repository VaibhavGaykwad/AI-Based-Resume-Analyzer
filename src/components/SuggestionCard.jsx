import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

export const SuggestionCard = ({ suggestion }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const icons = {
    High: <AlertTriangle className="w-5 h-5 text-red-400" />,
    Medium: <Info className="w-5 h-5 text-amber-400" />,
    Low: <CheckCircle className="w-5 h-5 text-emerald-400" />
  };

  const impactColors = {
    High: "text-red-400 bg-red-400/10 border-red-400/20",
    Medium: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    Low: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
  };

  return (
    <div className={cn(
      "glass-card border border-zinc-800/50 bg-zinc-900/20 hover:bg-zinc-900/40 transition-all duration-300",
      isExpanded ? "ring-1 ring-emerald-500/30" : ""
    )}>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-5 text-left transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={cn("p-2 rounded-lg border", impactColors[suggestion.impact])}>
            {icons[suggestion.impact]}
          </div>
          <div>
            <h4 className="font-semibold text-zinc-100">{suggestion.title}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn("text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded", impactColors[suggestion.impact])}>
                {suggestion.impact} Impact
              </span>
            </div>
          </div>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-zinc-500" /> : <ChevronDown className="w-5 h-5 text-zinc-500" />}
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
            <div className="px-5 pb-6 pt-2 border-t border-zinc-800/50">
              <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                {suggestion.description}
              </p>
              <div className="flex items-center justify-end">
                <button className="text-[11px] font-bold text-emerald-500 uppercase tracking-widest hover:text-emerald-400 transition-colors flex items-center gap-2">
                  Learn more about this rule
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
