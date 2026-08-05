import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from './components/Layout';
import { UploadView } from './views/UploadView';
import { ResultsView } from './views/ResultsView';
import { AnalyticsView } from './views/AnalyticsView';
import { AuthView } from './views/AuthView';
import { ProfileView } from './views/ProfileView';
import { SettingsView } from './views/SettingsView';
import { FeedbackView } from './views/FeedbackView';
import { AnalysisHistory } from './components/AnalysisHistory';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Loader2, Sparkles } from 'lucide-react';

function App() {
  const [activeView, setActiveView] = useState('upload'); // upload | results | analytics | history
  const [analysisResult, setAnalysisResult] = useState(null);
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const persistedTheme = localStorage.getItem('app_theme');
    const savedTheme = persistedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', savedTheme);

    const savedAccent = localStorage.getItem('app_accent') || 'purple';
    const accentsList = {
      purple: { primary: '#8b5cf6', dark: '#7c3aed', light: '#c084fc' },
      blue: { primary: '#3b82f6', dark: '#2563eb', light: '#60a5fa' },
      rose: { primary: '#f43f5e', dark: '#e11d48', light: '#fda4af' },
      emerald: { primary: '#10b981', dark: '#059669', light: '#34d399' },
      amber: { primary: '#f59e0b', dark: '#d97706', light: '#fbbf24' },
      cyan: { primary: '#06b6d4', dark: '#0891b2', light: '#22d3ee' }
    };
    const colors = accentsList[savedAccent] || accentsList.purple;
    document.documentElement.style.setProperty('--primary-accent', colors.primary);
    document.documentElement.style.setProperty('--primary-accent-dark', colors.dark);
    document.documentElement.style.setProperty('--primary-accent-light', colors.light);
  }, []);

  // Called when a brand-new analysis finishes
  const handleAnalysisComplete = ({ id, data }) => {
    setAnalysisResult({ id, data });
    setActiveView('results');
  };

  // Called when a history item is clicked
  const handleSelectHistoricalAnalysis = ({ id, data }) => {
    setAnalysisResult({ id, data });
    setActiveView('results');
  };

  // Called when an analysis is deleted in History
  const handleDeleteAnalysis = (deletedId) => {
    if (analysisResult && analysisResult.id === deletedId) {
      setAnalysisResult(null);
      if (activeView === 'results' || activeView === 'analytics') {
        setActiveView('history');
      }
    }
  };

  if (initializing) {
    return (
      <div className="min-h-screen bg-[#0d0d0f] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative flex flex-col items-center gap-8">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl border-2 border-primary/20 flex items-center justify-center animate-pulse">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <div className="absolute inset-0 rounded-3xl border-2 border-primary animate-ping opacity-20" />
          </div>
          
          <div className="text-center space-y-2">
            <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] ml-[0.4em] animate-pulse">Securing Session</h2>
            <div className="flex gap-1 justify-center">
              {[0, 1, 2].map(i => (
                <motion.div 
                  key={i}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                  className="w-1.5 h-1.5 rounded-full bg-primary"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthView />;
  }

  return (
    <Layout activeView={activeView} onViewChange={setActiveView} user={user}>
      <motion.div
        key={activeView}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="w-full"
      >
        {activeView === 'upload' && (
          <UploadView onAnalysisComplete={handleAnalysisComplete} user={user} />
        )}
        {activeView === 'results' && (
          <ResultsView data={analysisResult?.data} user={user} />
        )}
        {activeView === 'analytics' && (
          <AnalyticsView user={user} />
        )}
        {activeView === 'history' && (
          <AnalysisHistory 
            user={user} 
            onSelectAnalysis={handleSelectHistoricalAnalysis} 
            onDeleteAnalysis={handleDeleteAnalysis}
            onNavigateToUpload={() => setActiveView('upload')}
          />
        )}
        {activeView === 'profile' && (
          <ProfileView user={user} />
        )}
        {activeView === 'feedback' && (
          <FeedbackView user={user} onViewChange={setActiveView} />
        )}
        {activeView === 'settings' && (
          <SettingsView />
        )}
      </motion.div>
    </Layout>
  );
}

export default App;
