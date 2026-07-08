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
          "relative group cursor-pointer rounded-2xl border border-zinc-200 transition-all duration-500 flex flex-col items-center justify-center p-12 min-h-[380px] overflow-hidden bg-white shadow-sm",
          isDragging
            ? "border-primary bg-primary/5 shadow-md shadow-primary/5"
            : "hover:border-primary/40 hover:bg-slate-50/50 hover:shadow-md"
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

        <div className="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 group-hover:scale-105 transition-transform duration-500 shadow-sm border border-zinc-200 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
          <Upload className={cn("w-8 h-8 transition-colors", isDragging ? "text-primary" : "text-zinc-400 group-hover:text-primary")} />
        </div>

        <h3 className="text-2xl font-bold text-zinc-800 mb-2 tracking-tight">Upload your resume</h3>
        <p className="text-zinc-500 text-center max-w-xs mb-10 leading-relaxed font-medium">
          Drag and drop your PDF here, or <span className="text-primary font-bold hover:underline">browse files</span>
        </p>

        <div className="flex items-center gap-6 px-6 py-3 bg-slate-50 rounded-2xl border border-zinc-200 text-[10px] font-bold text-zinc-550 uppercase tracking-[0.15em] shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-full bg-primary/15 flex items-center justify-center border border-primary/30">
               <CheckCircle2 className="w-2.5 h-2.5 text-primary" />
            </div>
            PDF FORMAT ONLY
          </div>
          <div className="w-1 h-1 rounded-full bg-zinc-300" />
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
              className="absolute bottom-6 flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-550 text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
              <button
                onClick={(e) => { e.stopPropagation(); setError(null); }}
                className="ml-2 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-12 flex items-center justify-between px-6 opacity-80">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Wait time: ~10 seconds</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">99.9% Accuracy</span>
        </div>
      </div>
    </div>
  );
};
