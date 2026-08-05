import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const ScoreGauge = ({ score }) => {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const [rotation, setRotation] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let animId;
    const animate = () => {
      setRotation(prev => (prev + 0.6) % 360);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  useEffect(() => {
    let start = 0;
    const end = parseInt(score, 10) || 0;
    if (start === end) {
      const handle = setTimeout(() => setDisplayScore(end), 0);
      return () => clearTimeout(handle);
    }

    const duration = 1000; // 1 second
    const startTime = performance.now();

    const animateCounter = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out quadratic
      const easeProgress = progress * (2 - progress);
      const current = Math.floor(easeProgress * end);
      
      setDisplayScore(current);

      if (progress < 1) {
        requestAnimationFrame(animateCounter);
      } else {
        setDisplayScore(end);
      }
    };

    requestAnimationFrame(animateCounter);
  }, [score]);

  return (
    <div className="relative flex items-center justify-center w-48 h-48 select-none">
      {/* Background Circle */}
      <svg className="w-full h-full -rotate-90 overflow-visible">
        <defs>
          <linearGradient 
            id="scoreGradient" 
            x1="0%" 
            y1="0%" 
            x2="100%" 
            y2="100%"
            gradientTransform={`rotate(${rotation}, 0.5, 0.5)`}
          >
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        
        <circle
          cx="96"
          cy="96"
          r={radius}
          className="stroke-border-base fill-none"
          strokeWidth="10"
        />
        {/* Progress Circle */}
        <motion.circle
          cx="96"
          cy="96"
          r={radius}
          className="fill-none"
          stroke="url(#scoreGradient)"
          strokeWidth="10"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      
      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl font-[900] tracking-tighter italic bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent"
        >
          {displayScore}
        </motion.span>
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-text-secondary mt-1">ATS Score</span>
      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-full blur-3xl opacity-10 -z-10 bg-gradient-to-r from-blue-500 via-purple-600 to-cyan-500" />
    </div>
  );
};

