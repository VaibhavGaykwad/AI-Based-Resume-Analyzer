import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Search, FileText, Cpu, Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '../utils/cn';

const steps = [
  { id: 1, label: 'Reading PDF content...', icon: FileText },
  { id: 2, label: 'Extracting semantic structure...', icon: Search },
  { id: 3, label: 'Identifying technical skills...', icon: Cpu },
  { id: 4, label: 'Comparing with industry benchmarks...', icon: Sparkles },
  { id: 5, label: 'Generating performance score...', icon: CheckCircle2 },
];

export const ScanningProgress = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalDuration = 8000; // 8 seconds
    const intervalTime = 100;
    const progressStep = 100 / (totalDuration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + progressStep;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 1000);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    // Update current step based on progress
    const stepInterval = totalDuration / steps.length;
    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, stepInterval);

    return () => {
      clearInterval(timer);
      clearInterval(stepTimer);
    };
  }, [onComplete]);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center py-12">
      <div className="relative mb-16">
        {/* Animated Scanning Ring */}
        <div className="absolute inset-0 -m-4 rounded-full border border-emerald-500/20 animate-ping" />
        <div className="absolute inset-0 -m-8 rounded-full border border-emerald-500/10 animate-[ping_3s_linear_infinite]" />
        
        <div className="w-24 h-24 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center relative z-10 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent" />
          <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
          
          {/* Scanning Line Effect */}
          <motion.div 
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-0.5 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] z-20"
          />
        </div>
      </div>

      <div className="w-full space-y-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-zinc-100 mb-2">Analyzing Resume</h3>
          <p className="text-zinc-500">Our AI is processing your document to extract insights</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-4">
          <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
            />
          </div>
          <div className="flex justify-between text-xs font-bold text-zinc-500 uppercase tracking-widest">
            <span>{Math.round(progress)}% Processed</span>
            <span>Est. 2s remaining</span>
          </div>
        </div>

        {/* Step List */}
        <div className="grid grid-cols-1 gap-3">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = idx === currentStep;
            const isCompleted = idx < currentStep;

            return (
              <div 
                key={step.id}
                className={cn(
                  "flex items-center gap-4 px-5 py-4 rounded-xl border transition-all duration-300",
                  isActive 
                    ? "bg-emerald-500/5 border-emerald-500/30 shadow-lg translate-x-1" 
                    : isCompleted 
                      ? "bg-zinc-900/40 border-zinc-800 text-zinc-400" 
                      : "bg-transparent border-transparent text-zinc-600"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                  isActive ? "bg-emerald-500 text-white shadow-lg" : "bg-zinc-800 text-zinc-400"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-medium">{step.label}</span>
                {isCompleted && <CheckCircle2 className="ml-auto w-5 h-5 text-emerald-500" />}
                {isActive && <Loader2 className="ml-auto w-4 h-4 text-emerald-500 animate-spin" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
