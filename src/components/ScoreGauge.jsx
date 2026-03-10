import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

export const ScoreGauge = ({ score }) => {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (score) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-red-500';
  };

  const getBorderColor = (score) => {
    if (score >= 80) return 'stroke-emerald-500';
    if (score >= 50) return 'stroke-amber-500';
    return 'stroke-red-500';
  };

  return (
    <div className="relative flex items-center justify-center w-48 h-48">
      {/* Background Circle */}
      <svg className="w-full h-full -rotate-90">
        <circle
          cx="96"
          cy="96"
          r={radius}
          className="stroke-zinc-800 fill-none"
          strokeWidth="12"
        />
        {/* Progress Circle */}
        <motion.circle
          cx="96"
          cy="96"
          r={radius}
          className={cn("fill-none transition-all duration-1000 ease-out", getBorderColor(score))}
          strokeWidth="12"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          strokeLinecap="round"
        />
      </svg>
      
      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className={cn("text-5xl font-black tracking-tighter", getColor(score))}
        >
          {score}
        </motion.span>
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 mt-1">Overall Score</span>
      </div>

      {/* Glow Effect */}
      <div className={cn(
        "absolute inset-0 rounded-full blur-3xl opacity-20 -z-10",
        score >= 80 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-red-500"
      )} />
    </div>
  );
};

