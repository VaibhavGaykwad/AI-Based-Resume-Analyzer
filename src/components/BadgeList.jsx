import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

export const BadgeList = ({ items, type = 'success' }) => {
  const themes = {
    success: "bg-primary/10 text-primary border-primary/20",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-red-50 text-red-650 border-red-200",
    neutral: "bg-slate-50 text-zinc-500 border-zinc-200"
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
