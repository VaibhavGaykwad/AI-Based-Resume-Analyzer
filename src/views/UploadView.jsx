/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { UploadZone } from '../components/UploadZone';
import { ScanningProgress } from '../components/ScanningProgress';
import { motion, AnimatePresence } from 'framer-motion';
import { extractTextFromPDF, analyzeResume } from '../utils/resumeAnalyzer';
import { uploadPDF } from '../utils/firebaseStorage';
import { saveAnalysis } from '../utils/firestoreService';
import { AlertCircle, FileText, Search, Cpu, Sparkles, CheckCircle2, Database } from 'lucide-react';

const ANALYSIS_STEPS = [
  { id: 1, label: 'Reading PDF content...', icon: FileText },
  { id: 2, label: 'Extracting semantic structure...', icon: Search },
  { id: 3, label: 'Identifying technical skills...', icon: Cpu },
  { id: 4, label: 'Comparing with industry benchmarks...', icon: Sparkles },
  { id: 5, label: 'Generating performance score...', icon: CheckCircle2 },
  { id: 6, label: 'Saving to database...', icon: Database },
];

export const UploadView = ({ onAnalysisComplete, user }) => {
  const [status, setStatus] = useState('idle'); // idle | scanning | error
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState(null);
  const [saveWarning, setSaveWarning] = useState(null);

  const handleUploadStart = (file) => {
    setUploadedFile(file);
    setStatus('scanning');
    setError(null);
    setSaveWarning(null);
  };

  const handleAnalysisComplete = async () => {
    try {
      const startTime = Date.now();
      // Step 1-5: Extract text and run Gemini analysis
      const text = await extractTextFromPDF(uploadedFile);
      const results = await analyzeResume(text);

      if (results && results.success === false) {
        throw new Error(results.error || 'OpenRouter free-tier limit reached. Please try again later.');
      }

      const processingTime = parseFloat(((Date.now() - startTime) / 1000).toFixed(1));

      const resultsWithContext = { ...results, originalText: text, processingTime };

      let docId = null;
      // Step 6: Save to Firestore (non-fatal)
      try {
        if (user) {
          // Note: Skipping PDF Storage upload to keep the app on the Firebase free tier
          docId = await saveAnalysis(user.uid, uploadedFile.name, '', resultsWithContext);
        }
      } catch (saveErr) {
        console.warn('Could not save to database:', saveErr);
        setSaveWarning('Analysis complete, but we couldn\'t save it to your history. Check your connection or Firestore setup.');
      }

      onAnalysisComplete({ id: docId, data: resultsWithContext, fileName: uploadedFile.name });
    } catch (err) {
      console.error('Analysis failed:', err);
      setError(err.message || 'Failed to analyze resume. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      {/* Non-blocking save warning banner */}
      <AnimatePresence>
        {saveWarning && (
          <motion.div
            key="save-warning"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="w-full max-w-xl mb-4 flex items-start gap-3 px-4 py-3 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400 text-sm font-semibold"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" />
            <span>{saveWarning}</span>
            <button
              onClick={() => setSaveWarning(null)}
              className="ml-auto text-amber-550 hover:text-amber-600 dark:text-amber-405 dark:hover:text-amber-300 font-bold text-xs shrink-0 cursor-pointer"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            <div className="text-center mb-6 sm:mb-12 px-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary mb-3 sm:mb-4 tracking-tight">
                Unlock your <span className="text-primary font-black italic">Career Potential</span>
              </h1>
              <p className="text-text-secondary text-sm sm:text-base md:text-lg max-w-xl mx-auto font-medium">
                Upload your resume and let our advanced AI analyze it against industry standards in seconds.
              </p>
            </div>
            <UploadZone onUploadStart={handleUploadStart} />
          </motion.div>
        )}

        {status === 'scanning' && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <ScanningProgress
              onComplete={handleAnalysisComplete}
              steps={ANALYSIS_STEPS}
              totalDuration={9200}
            />
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-text-primary mb-2">Analysis Failed</h3>
              <p className="text-text-secondary max-w-sm">{error}</p>
            </div>
            <button
              onClick={() => { setStatus('idle'); setError(null); setUploadedFile(null); }}
              className="px-6 py-2.5 rounded-xl bg-card-base hover:bg-bg-base border border-border-base text-text-primary font-bold transition-colors cursor-pointer text-sm shadow-xs"
            >
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
