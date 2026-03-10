import React, { useState } from 'react';
import { UploadZone } from '../components/UploadZone';
import { ScanningProgress } from '../components/ScanningProgress';
import { motion, AnimatePresence } from 'framer-motion';
import { extractTextFromPDF, analyzeResume } from '../utils/resumeAnalyzer';
import { AlertCircle } from 'lucide-react';

export const UploadView = ({ onAnalysisComplete }) => {
  const [status, setStatus] = useState('idle'); // idle | scanning | error
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState(null);

  const handleUploadStart = (file) => {
    setUploadedFile(file);
    setStatus('scanning');
    setError(null);
  };

  const handleAnalysisComplete = async () => {
    try {
      const text = await extractTextFromPDF(uploadedFile);
      const results = await analyzeResume(text);
      onAnalysisComplete(results);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError(err.message || 'Failed to analyze resume. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
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
            <div className="text-center mb-12">
              <h1 className="text-4xl font-extrabold text-zinc-100 mb-4 tracking-tight">
                Unlock your <span className="text-emerald-500">Career Potential</span>
              </h1>
              <p className="text-zinc-500 text-lg max-w-xl mx-auto">
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
            <ScanningProgress onComplete={handleAnalysisComplete} />
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
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-zinc-100 mb-2">Analysis Failed</h3>
              <p className="text-zinc-500 max-w-sm">{error}</p>
            </div>
            <button
              onClick={() => { setStatus('idle'); setError(null); setUploadedFile(null); }}
              className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-medium transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
