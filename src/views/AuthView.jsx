import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { Mail, Lock, Chrome, ArrowRight, Loader2, AlertCircle, Sparkles, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

export const AuthView = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, text: '', color: 'bg-zinc-200', textClass: 'text-zinc-500' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    
    if (score <= 2) return { score, text: 'Weak', color: 'bg-red-500', textClass: 'text-red-500' };
    if (score <= 4) return { score, text: 'Medium Strength', color: 'bg-amber-500', textClass: 'text-amber-600' };
    return { score, text: 'Strong Security Key', color: 'bg-emerald-500', textClass: 'text-emerald-600' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      console.error(err);
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setError('');
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-slate-50 overflow-hidden font-sans">
      
      {/* LEFT COLUMN: Beautiful AI Illustration & Floating Graphics */}
      <div className="hidden lg:flex lg:col-span-5 xl:col-span-6 bg-slate-950 relative flex-col justify-between p-12 overflow-hidden select-none">
        {/* Deep, glowing radial backdrops */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,rgba(59,130,246,0.1),transparent_50%)]" />
        {/* Subtle grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />

        {/* Branding header in the illustration column */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 relative animate-pulse">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white italic tracking-tighter uppercase leading-none">ResuAI</h2>
            <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest block mt-0.5">Intelligence Layer</span>
          </div>
        </div>

        {/* Outer container of the illustration workspace */}
        <div className="relative z-10 flex-1 flex flex-col justify-center items-center py-10 w-full max-w-lg mx-auto">
          {/* Animated Glowing Ring Backdrop */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
            className="absolute w-[360px] h-[360px] border border-dashed border-indigo-500/15 rounded-full flex items-center justify-center animate-pulse"
          >
            <div className="w-[300px] h-[300px] border border-dashed border-purple-500/10 rounded-full" />
          </motion.div>

          {/* Core interactive resume graphic mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-2xl w-[320px] z-10 hover:border-slate-700/60 transition-colors"
          >
            {/* Header info */}
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-550/20 flex items-center justify-center text-xs font-black text-indigo-400 font-mono select-none">
                JD
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="h-2.5 w-24 bg-slate-850 rounded-sm" />
                <div className="h-1.5 w-16 bg-slate-850/60 rounded-sm" />
              </div>
            </div>

            {/* Layout body mimicking page lines */}
            <div className="mt-4 space-y-3">
              <div className="h-2.5 w-full bg-slate-850/40 rounded-sm" />
              <div className="flex gap-2">
                <div className="h-2.5 w-1/3 bg-slate-850/40 rounded-sm" />
                <div className="h-2.5 w-2/3 bg-slate-850/40 rounded-sm" />
              </div>
              <div className="h-2.5 w-5/6 bg-slate-850/40 rounded-sm" />
              <div className="h-2.5 w-2/3 bg-slate-850/40 rounded-sm" />
            </div>

            {/* Grid stats mock inside resume layout */}
            <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-2 gap-3">
              <div className="bg-slate-950/40 border border-slate-850/50 p-2.5 rounded-lg">
                <div className="text-[7px] text-zinc-550 font-extrabold uppercase tracking-wider block">Scan Confidence</div>
                <div className="text-xs font-black text-slate-200 mt-0.5 tracking-tight uppercase">96.8% Valid</div>
              </div>
              <div className="bg-slate-950/40 border border-slate-850/50 p-2.5 rounded-lg">
                <div className="text-[7px] text-zinc-550 font-extrabold uppercase tracking-wider block">Keywords Score</div>
                <div className="text-xs font-black text-slate-200 mt-0.5 tracking-tight uppercase">Competitive</div>
              </div>
            </div>
          </motion.div>

          {/* Floating Element 1: Score badge widget */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute top-[18%] right-[5%] z-20 bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/30 rounded-xl p-3 shadow-lg flex items-center gap-2.5 select-none"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[7px] text-slate-400 font-bold uppercase tracking-widest leading-none">Overall ATS Score</span>
              <span className="text-[10px] font-extrabold text-emerald-400 mt-0.5 leading-none">89/100 (Strong)</span>
            </div>
          </motion.div>

          {/* Floating Element 2: AI Enhancer Status bar */}
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-[20%] left-[2%] z-20 bg-purple-500/10 backdrop-blur-xl border border-purple-500/30 rounded-xl p-3 shadow-lg flex items-center gap-2.5 select-none"
          >
            <div className="w-5 h-5 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center font-bold text-[9px] text-purple-400">
              AI
            </div>
            <div className="flex flex-col">
              <span className="text-[7px] text-slate-400 font-bold uppercase tracking-widest leading-none">Optimization Engine</span>
              <span className="text-[10px] font-extrabold text-purple-400 mt-0.5 leading-none animate-pulse">Running diagnostics...</span>
            </div>
          </motion.div>

          {/* Floating Element 3: ATS keywords added count */}
          <motion.div 
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[44%] right-[0%] z-20 bg-blue-500/10 backdrop-blur-xl border border-blue-500/30 rounded-xl p-3 shadow-lg flex items-center gap-2.5 select-none"
          >
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <div className="flex flex-col">
              <span className="text-[7px] text-slate-400 font-bold uppercase tracking-widest leading-none">ATS Keyword Density</span>
              <span className="text-[10px] font-extrabold text-blue-400 mt-0.5 leading-none">+15 Keywords Added</span>
            </div>
          </motion.div>
        </div>

        {/* Bottom tagline */}
        <div className="relative z-10">
          <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
            Leverage advanced AI diagnostics to align your resume with high-performing industry benchmarks and unlock matching opportunities.
          </p>
          <span className="text-[9px] text-slate-600 font-bold tracking-widest uppercase block mt-3 font-mono">
            © 2026 ResuAI Inc. All Rights Reserved.
          </span>
        </div>
      </div>

      {/* RIGHT COLUMN: Glassmorphic auth card, password strength, inputs */}
      <div className="col-span-1 lg:col-span-7 xl:col-span-6 flex items-center justify-center p-6 sm:p-12 md:p-16 relative overflow-hidden bg-slate-50/50">
        
        {/* Soft flowing background spots */}
        <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-20%] w-[60%] h-[60%] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Header Row for Mobile: logo + tagline */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-800 italic tracking-tighter uppercase leading-none">ResuAI</h2>
              <span className="text-[7px] font-black text-indigo-550 tracking-widest block mt-0.5">Intelligence Layer</span>
            </div>
          </div>

          {/* Form wrapper with Glassmorphism */}
          <div className="backdrop-blur-md bg-white/70 border border-slate-200/50 rounded-2xl shadow-xl shadow-slate-100/55 p-6 sm:p-12 w-full relative overflow-hidden">
            <h2 className="text-2xl font-black text-slate-800 mb-2 italic tracking-tight uppercase">
              {isLogin ? 'Personal Access' : 'Create Account'}
            </h2>
            <p className="text-zinc-500 text-xs font-semibold mb-8">
              {isLogin ? 'Authenticate to access your optimization workspace.' : 'Initialize profile setup for ATS score optimization.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Universal Identifier Input */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-zinc-400 tracking-[0.2em] ml-1">Universal Identifier</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-white/80 border border-slate-200 focus:border-indigo-500/50 rounded-xl py-3.5 pl-12 pr-4 text-slate-800 placeholder:text-zinc-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all font-semibold text-sm"
                    required
                  />
                </div>
              </div>

              {/* Password Key Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[10px] uppercase font-black text-zinc-400 tracking-[0.2em]">Security Key</label>
                  {isLogin && (
                    <button 
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                      Recover
                    </button>
                  )}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/80 border border-slate-200 focus:border-indigo-500/50 rounded-xl py-3.5 pl-12 pr-12 text-slate-800 placeholder:text-zinc-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all font-semibold text-sm"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-650 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Indicator (For signup mode only) */}
                <AnimatePresence>
                  {!isLogin && password.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-1.5 pt-1 overflow-hidden"
                    >
                      <div className="flex justify-between items-center text-[9px] font-extrabold uppercase tracking-wide">
                        <span className="text-zinc-400">Key Quality</span>
                        <span className={strength.textClass}>{strength.text}</span>
                      </div>
                      
                      {/* Bar Indicators */}
                      <div className="flex gap-1 h-1 w-full">
                        <div className={cn("h-full flex-1 rounded-full transition-all duration-300", password.length >= 1 ? strength.color : "bg-slate-100")} />
                        <div className={cn("h-full flex-1 rounded-full transition-all duration-300", strength.score >= 3 ? strength.color : "bg-slate-100")} />
                        <div className={cn("h-full flex-1 rounded-full transition-all duration-300", strength.score >= 5 ? strength.color : "bg-slate-100")} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Status Alert Panels */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 flex items-start gap-3"
                  >
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-red-500 font-bold leading-relaxed">{error}</p>
                  </motion.div>
                )}
                {resetSent && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-start gap-3"
                  >
                    <CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-indigo-750 font-bold leading-relaxed italic uppercase">Reset protocol initialized. Check email inbox.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit connection button */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-550 via-purple-600 to-indigo-550 hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold uppercase tracking-[0.2em] text-[11px] py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <>
                    {isLogin ? 'Establish connection' : 'Initialize profile'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="my-8 flex items-center gap-4 opacity-50">
              <div className="h-px flex-1 bg-slate-200"></div>
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em]">Alternate</span>
              <div className="h-px flex-1 bg-slate-200"></div>
            </div>

            {/* Google Authentication */}
            <button 
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white border border-slate-200 hover:border-slate-350 text-slate-650 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] text-[11px] uppercase tracking-widest shadow-xs cursor-pointer group"
            >
              <Chrome className="w-5 h-5 text-zinc-400 group-hover:text-indigo-550 transition-colors" />
              Continue with Google
            </button>

            {/* Mode Switch Button */}
            <div className="mt-8 text-center">
              <span className="text-zinc-500 text-[11px] font-bold uppercase tracking-tight">
                {isLogin ? "Unauthorized user?" : "Existing profile found?"}
                <button 
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                  }}
                  className="text-indigo-500 font-[1000] hover:text-indigo-600 transition-colors ml-1.5 cursor-pointer underline underline-offset-8 decoration-indigo-500/30"
                >
                  {isLogin ? 'Register now' : 'Authorize now'}
                </button>
              </span>
            </div>

          </div>

          {/* Footer baseline terms */}
          <p className="text-center mt-8 text-zinc-400 text-[10px] uppercase font-bold tracking-widest leading-relaxed">
            By continuing, you agree to ResumeAI's <span className="text-slate-550 underline cursor-pointer">Terms of Service</span> and <span className="text-slate-550 underline cursor-pointer">Privacy Policy</span>.
          </p>

        </motion.div>
      </div>

    </div>
  );
};
