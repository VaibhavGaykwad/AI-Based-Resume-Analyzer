import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Search, FileText, Cpu, Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '../utils/cn';

const DEFAULT_STEPS = [
  { id: 1, label: 'Reading PDF content...', icon: FileText },
  { id: 2, label: 'Extracting semantic structure...', icon: Search },
  { id: 3, label: 'Identifying technical skills...', icon: Cpu },
  { id: 4, label: 'Comparing with industry benchmarks...', icon: Sparkles },
  { id: 5, label: 'Generating performance score...', icon: CheckCircle2 },
];


export const ScanningProgress = ({ onComplete, steps: customSteps, totalDuration: customDuration }) => {
  const steps = customSteps || DEFAULT_STEPS;
  const totalDuration = customDuration || 8000;
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
        <div className="absolute inset-0 -m-4 rounded-full border border-primary/20 animate-ping" />
        <div className="absolute inset-0 -m-8 rounded-full border border-primary/10 animate-[ping_3s_linear_infinite]" />
        
        <div className="w-24 h-24 rounded-3xl bg-white border border-zinc-200 flex items-center justify-center relative z-10 shadow-md overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          
          {/* Scanning Line Effect */}
          <motion.div 
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-0.5 bg-primary shadow-[0_0_15px_rgba(139,92,246,0.8)] z-20"
          />
        </div>
      </div>

      <div className="w-full space-y-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-zinc-850 mb-2 tracking-tight uppercase italic underline decoration-primary/30 underline-offset-8 decoration-4">Analyzing Resume</h3>
          <p className="text-zinc-500">Our AI is processing your document to extract insights</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-4">
          <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden border border-zinc-100 shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-primary-dark via-primary to-primary-light shadow-[0_0_15px_rgba(139,92,246,0.3)]"
            />
          </div>
          <div className="flex justify-between text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">
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
                    ? "bg-primary/5 border-primary/30 shadow-sm translate-x-1 text-zinc-800" 
                    : isCompleted 
                      ? "bg-slate-50 border-zinc-150 text-zinc-500" 
                      : "bg-transparent border-transparent text-zinc-400"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                  isActive ? "bg-primary text-white shadow-[0_4px_12px_rgba(139,92,246,0.35)]" : "bg-slate-100 text-zinc-500"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-semibold text-sm tracking-tight">{step.label}</span>
                {isCompleted && <CheckCircle2 className="ml-auto w-5 h-5 text-primary" />}
                {isActive && <Loader2 className="ml-auto w-4 h-4 text-primary animate-spin" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
