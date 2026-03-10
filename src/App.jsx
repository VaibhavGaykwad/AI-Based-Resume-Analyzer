import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { UploadView } from './views/UploadView';
import { ResultsView } from './views/ResultsView';
import { AnalyticsView } from './views/AnalyticsView';
import { AuthView } from './views/AuthView';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Loader2 } from 'lucide-react';

function App() {
  const [activeView, setActiveView] = useState('upload'); // upload, results, analytics
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

  const handleAnalysisComplete = (data) => {
    setAnalysisResult(data);
    setActiveView('results');
  };

  if (initializing) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthView />;
  }

  return (
    <Layout activeView={activeView} onViewChange={setActiveView} user={user}>
      {activeView === 'upload' && (
        <UploadView onAnalysisComplete={handleAnalysisComplete} />
      )}
      {activeView === 'results' && (
        <ResultsView data={analysisResult} />
      )}
      {activeView === 'analytics' && (
        <AnalyticsView />
      )}
    </Layout>
  );
}

export default App;
