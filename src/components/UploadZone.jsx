import React, { useState, useRef } from 'react';
import { Upload, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

export const UploadZone = ({ onUploadStart }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateFile = (file) => {
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file.');
      return false;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB
      setError('File size exceeds 10MB limit.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      startAnalysis(droppedFile);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && validateFile(selectedFile)) {
      startAnalysis(selectedFile);
    }
  };

  const startAnalysis = (selectedFile) => {
    onUploadStart(selectedFile);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "glass-card no-padding relative group cursor-pointer transition-all duration-500 flex flex-col items-center justify-center p-6 sm:p-12 min-h-[290px] sm:min-h-[380px]",
          isDragging
            ? "border-primary bg-primary/5 shadow-md shadow-primary/5"
            : "hover:border-primary/40 hover:bg-bg-base/50 hover:shadow-md"
        )}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf"
          className="hidden"
        />

        {/* Subtle radial glow matching image */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.03),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-bg-base flex items-center justify-center mb-6 sm:mb-8 group-hover:scale-105 transition-transform duration-500 shadow-sm border border-border-base relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
          <Upload className={cn("w-6 h-6 sm:w-8 sm:h-8 transition-colors", isDragging ? "text-primary" : "text-text-secondary group-hover:text-primary")} />
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-2 tracking-tight">Upload your resume</h3>
        <p className="text-text-secondary text-sm mb-6 sm:mb-10 max-w-xs text-center leading-relaxed font-medium">
          Drag and drop your PDF here, or <span className="text-primary font-bold hover:underline">browse files</span>
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 px-4 py-3 sm:px-6 bg-bg-base rounded-2xl border border-border-base text-[10px] font-bold text-text-primary uppercase tracking-[0.15em] shadow-sm w-full sm:w-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-full bg-primary/15 flex items-center justify-center border border-primary/30">
               <CheckCircle2 className="w-2.5 h-2.5 text-primary" />
            </div>
            PDF FORMAT ONLY
          </div>
          <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-border-base" />
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-full bg-primary/15 flex items-center justify-center border border-primary/30 text-primary">
               <CheckCircle2 className="w-2.5 h-2.5" />
            </div>
            MAX SIZE: 10MB
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute bottom-6 flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm animate-pulse"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
              <button
                onClick={(e) => { e.stopPropagation(); setError(null); }}
                className="ml-2 hover:text-red-650"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 sm:mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 px-6 opacity-80 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
          <span className="text-[11px] font-bold text-text-secondary uppercase tracking-widest">Wait time: ~10 seconds</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
          <span className="text-[11px] font-bold text-text-secondary uppercase tracking-widest">99.9% Accuracy</span>
        </div>
      </div>
    </div>
  );
};
