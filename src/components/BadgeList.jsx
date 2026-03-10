import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

export const BadgeList = ({ items, type = 'success' }) => {
  const themes = {
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    danger: "bg-red-500/10 text-red-400 border-red-500/20",
    neutral: "bg-zinc-800/50 text-zinc-400 border-zinc-700/50"
  };

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, idx) => (
        <motion.span
          key={item}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 * idx, duration: 0.3 }}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 hover:scale-105 select-none",
            themes[type]
          )}
        >
          {item}
        </motion.span>
      ))}
    </div>
  );
};
