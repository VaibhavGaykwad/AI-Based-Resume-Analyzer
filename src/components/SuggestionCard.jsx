import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

export const SuggestionCard = ({ suggestion }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const icons = {
    High: <AlertTriangle className="w-5 h-5 text-red-500" />,
    Medium: <Info className="w-5 h-5 text-amber-500" />,
    Low: <CheckCircle className="w-5 h-5 text-primary" />
  };

  const impactColors = {
    High: "text-red-500 bg-red-500/10 border-red-500/20",
    Medium: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    Low: "text-primary bg-primary/10 border-primary/20"
  };

  return (
    <div className={cn(
      "glass-card border border-zinc-800/50 bg-[#0d0d0f]/20 hover:bg-zinc-900/40 transition-all duration-300",
      isExpanded ? "ring-2 ring-primary/20 bg-[#0d0d0f]/40" : ""
    )}>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 text-left transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={cn("p-2 rounded-xl border", impactColors[suggestion.impact])}>
            {icons[suggestion.impact]}
          </div>
          <div>
            <h4 className="font-bold text-zinc-100 tracking-tight">{suggestion.title}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn("text-[9px] uppercase font-black tracking-[0.15em] px-2 py-0.5 rounded", impactColors[suggestion.impact])}>
                {suggestion.impact} Impact
              </span>
            </div>
          </div>
        </div>
        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-colors", isExpanded ? "bg-primary/10 text-primary" : "text-zinc-600")}>
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
            <div className="px-6 pb-6 pt-2 border-t border-zinc-800/30">
              <p className="text-zinc-500 text-[13px] leading-relaxed mb-6 font-medium">
                {suggestion.description}
              </p>
              <div className="flex items-center justify-end">
                <button className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:text-primary-light transition-colors flex items-center gap-2.5">
                  View full documentation
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(197,160,89,0.5)]" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
