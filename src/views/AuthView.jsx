import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { Mail, Lock, Chrome, ArrowRight, Loader2, AlertCircle, Sparkles, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

export const AuthView = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);

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
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-dark/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md px-6 relative z-10"
      >
        {/* Branding */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center mb-6 shadow-2xl shadow-primary/30 relative">
            <div className="absolute inset-0 bg-white/10 rounded-inherit" />
            <Sparkles className="w-8 h-8 text-[#0d0d0f]" />
          </div>
          <h1 className="text-4xl font-black text-primary italic tracking-tighter uppercase mb-2">ResumeAI</h1>
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.25em]">Intelligence Layer</p>
        </div>

        {/* Auth Card */}
        <div className="glass-card p-10 border border-zinc-800/50 relative overflow-hidden bg-[#0d0d0f]/80">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          
          <h2 className="text-2xl font-black text-zinc-100 mb-8 italic tracking-tight uppercase">
            {isLogin ? 'Personal Access' : 'Create Intelligence Account'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-zinc-600 tracking-[0.2em] ml-1">Universal Identifier</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-zinc-950/50 border border-zinc-800/80 rounded-xl py-3.5 pl-12 pr-4 text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all font-medium text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] uppercase font-black text-zinc-600 tracking-[0.2em]">Security Key</label>
                {isLogin && (
                  <button 
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[10px] font-black text-primary uppercase tracking-widest hover:text-primary-light transition-colors"
                  >
                    Recover
                  </button>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-950/50 border border-zinc-800/80 rounded-xl py-3.5 pl-12 pr-4 text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all font-medium text-sm"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 flex items-start gap-3"
                >
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-red-400 font-bold leading-relaxed">{error}</p>
                </motion.div>
              )}
              {resetSent && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3"
                >
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-[11px] text-primary font-bold leading-relaxed italic uppercase">Reset protocol initialized. Check email.</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed text-[#0d0d0f] font-[1000] uppercase tracking-[0.2em] text-[11px] py-4 rounded-xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <>
                  {isLogin ? 'Establish connection' : 'Initialize profile'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="my-10 flex items-center gap-4 opacity-40">
            <div className="h-px flex-1 bg-zinc-800"></div>
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">Alternate</span>
            <div className="h-px flex-1 bg-zinc-800"></div>
          </div>

          <button 
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-400 font-black py-4 rounded-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] text-[11px] uppercase tracking-widest shadow-inner group"
          >
            <Chrome className="w-5 h-5 group-hover:text-primary transition-colors" />
            Continue with Google
          </button>

          <div className="mt-10 text-center">
            <p className="text-zinc-600 text-[11px] font-bold uppercase tracking-tight">
              {isLogin ? "Unauthorized user?" : "Existing profile found?"}{' '}
              <button 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-primary font-[1000] hover:text-primary-light transition-colors ml-1 underline underline-offset-8 decoration-primary/30"
              >
                {isLogin ? 'Register now' : 'Authorize now'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center mt-8 text-zinc-600 text-[10px] uppercase font-bold tracking-widest">
          By continuing, you agree to ResumeAI's <span className="text-zinc-500">Terms of Service</span> and <span className="text-zinc-500">Privacy Policy</span>.
        </p>
      </motion.div>
    </div>
  );
};
