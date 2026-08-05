import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Send, CheckCircle2, 
  Loader2, UploadCloud, X 
} from 'lucide-react';
import { saveFeedback } from '../utils/firestoreService';
import { uploadScreenshot } from '../utils/firebaseStorage';

export const FeedbackForm = ({ user, onClose, isModal = false, onViewChange, preselectedSubject }) => {
  const [subject, setSubject] = useState(preselectedSubject || '');
  const [category, setCategory] = useState(preselectedSubject || 'General Feedback');
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

  // Toast notifications state
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (preselectedSubject) {
      const handle = setTimeout(() => {
        setSubject(preselectedSubject);
        setCategory(preselectedSubject);
      }, 0);
      return () => clearTimeout(handle);
    }
  }, [preselectedSubject]);

  const triggerToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  const handleMessageChange = (e) => {
    const val = e.target.value;
    if (val.length <= 1000) {
      setMessage(val);
      // Auto-resize textarea height dynamically
      e.target.style.height = 'auto';
      e.target.style.height = `${e.target.scrollHeight}px`;
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Enforce 5MB limit
      if (file.size > 5 * 1024 * 1024) {
        triggerToast("File is too large. Choose an image under 5MB.", "error");
        return;
      }
      setScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeScreenshot = () => {
    setScreenshot(null);
    setScreenshotPreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Input Validation
    if (!subject.trim()) {
      triggerToast("Subject is required.", "error");
      return;
    }
    if (!message.trim()) {
      triggerToast("Feedback message is required.", "error");
      return;
    }
    if (message.length > 1000) {
      triggerToast("Message cannot exceed 1000 characters.", "error");
      return;
    }

    setStatus('submitting');
    let screenshotUrl = '';

    // Handle Upload
    if (screenshot) {
      try {
        screenshotUrl = await uploadScreenshot(screenshot, user?.uid || 'anonymous');
      } catch (uploadError) {
        console.error("Screenshot upload failed:", uploadError);
        // Gracefully notify and continue without media rather than blocking submit
        triggerToast("Screenshot upload failed. Submitting feedback text...", "error");
      }
    }

    // Store in Firestore
    try {
      await saveFeedback({
        userId: user?.uid || 'anonymous',
        rating,
        category,
        subject,
        message,
        screenshotUrl: screenshotUrl || null,
        email: email || null
      });

      setStatus('success');
      triggerToast("Feedback submitted successfully!", "success");

      // Reset form variables
      setSubject('');
      setMessage('');
      setEmail('');
      setScreenshot(null);
      setScreenshotPreview('');
      setRating(5);
    } catch (saveError) {
      console.error("Failed to store feedback in Firestore:", saveError);
      setStatus('error');
      triggerToast("Failed to submit feedback. Please try again.", "error");
    }
  };

  return (
    <div className={`w-full relative ${isModal ? 'p-6 sm:p-8 overflow-y-auto max-h-[82vh]' : 'p-6 md:p-8'}`}>
      
      {/* Local Toast Alert */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 left-6 z-55 flex items-center gap-2.5 px-4.5 py-3 ${
              toastType === 'error' ? 'bg-red-500' : 'bg-emerald-500'
            } text-white font-bold text-xs rounded-xl shadow-xl`}
          >
            {toastType === 'error' ? <X className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Close Button */}
      {isModal && onClose && (
        <button 
          onClick={onClose}
          type="button"
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-bg-base/30 border border-border-base text-text-secondary hover:text-text-primary transition-all flex items-center justify-center cursor-pointer active:scale-95 z-20"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {isModal && (
        <div className="space-y-1 mb-6 pr-8">
          <h3 className="text-lg font-black text-text-primary tracking-tight">Send Feedback</h3>
          <p className="text-xs font-semibold text-text-secondary">
            Your feedback directly shapes the development of RESUAI.
          </p>
        </div>
      )}

      <AnimatePresence mode="wait">
        {status !== 'success' ? (
          <motion.form 
            key="feedback-form-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit} 
            className="space-y-5"
          >
            
            {/* Category Select Input */}
            <div className="space-y-2">
              <label htmlFor="feedback-category" className="text-[10px] font-black text-text-secondary uppercase tracking-widest">
                Category
              </label>
              <select
                id="feedback-category"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-bg-base/40 border border-border-base hover:border-primary/30 focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none text-text-primary text-xs font-semibold px-4.5 py-3 rounded-2xl transition-all cursor-pointer"
              >
                <option value="General Feedback" className="bg-card-base text-text-primary">General Feedback</option>
                <option value="Resume Analysis" className="bg-card-base text-text-primary">Resume Analysis</option>
                <option value="Bug Report" className="bg-card-base text-text-primary">Bug Report</option>
                <option value="Feature Request" className="bg-card-base text-text-primary">Feature Request</option>
                <option value="Other" className="bg-card-base text-text-primary">Other</option>
              </select>
            </div>

            {/* Rating Stars Select */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest block">
                Rating
              </label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="text-2xl transition-all active:scale-90 focus:outline-none cursor-pointer"
                  >
                    <span className={(hoveredRating || rating) >= star ? 'text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.35)]' : 'text-text-secondary/20'}>
                      ★
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Input */}
            <div className="space-y-2">
              <label htmlFor="feedback-subject" className="text-[10px] font-black text-text-secondary uppercase tracking-widest">
                Subject
              </label>
              <input
                id="feedback-subject"
                type="text"
                required
                placeholder="What is this feedback about?"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-bg-base/40 border border-border-base hover:border-primary/30 focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none text-text-primary placeholder:text-text-secondary/40 text-xs font-semibold px-4.5 py-3 rounded-2xl transition-all"
              />
            </div>

            {/* Message Comments Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="feedback-comments" className="text-[10px] font-black text-text-secondary uppercase tracking-widest">
                  Feedback Message
                </label>
                <span className={`text-[10px] font-bold ${message.length >= 900 ? 'text-red-500' : 'text-text-secondary/60'}`}>
                  {message.length} / 1000
                </span>
              </div>
              <textarea
                id="feedback-comments"
                required
                placeholder="Tell us what happened or how we can improve RESUAI..."
                value={message}
                onChange={handleMessageChange}
                className="w-full bg-bg-base/40 border border-border-base hover:border-primary/30 focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none text-text-primary placeholder:text-text-secondary/40 text-xs font-semibold px-4.5 py-3 rounded-2xl transition-all overflow-hidden resize-none min-h-[110px]"
              />
            </div>

            {/* Optional Email input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="feedback-email" className="text-[10px] font-black text-text-secondary uppercase tracking-widest">
                  Email Address
                </label>
                <span className="text-[9px] font-bold text-text-secondary/50 uppercase select-none">Optional</span>
              </div>
              <input
                id="feedback-email"
                type="email"
                placeholder="you@example.com (so we can follow up with you)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-bg-base/40 border border-border-base hover:border-primary/30 focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none text-text-primary placeholder:text-text-secondary/40 text-xs font-semibold px-4.5 py-3 rounded-2xl transition-all"
              />
            </div>

            {/* Screenshot Upload component */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">
                  Screenshot Upload
                </label>
                <span className="text-[9px] font-bold text-text-secondary/50 uppercase select-none">Optional</span>
              </div>
              
              {!screenshotPreview ? (
                <label className="flex flex-col items-center justify-center border border-dashed border-border-base hover:border-primary/45 rounded-2xl py-6 px-4 bg-bg-base/20 select-none cursor-pointer transition-all hover:bg-bg-base/40 group">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="hidden" 
                  />
                  <UploadCloud className="w-6 h-6 text-text-secondary/60 group-hover:text-primary transition-colors mb-2" />
                  <span className="text-xs font-bold text-text-primary">Click to upload screenshot</span>
                  <span className="text-[10px] font-semibold text-text-secondary/60 mt-1">PNG, JPG up to 5MB</span>
                </label>
              ) : (
                <div className="relative border border-border-base rounded-2xl p-2 bg-bg-base/20 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={screenshotPreview} 
                      alt="Screenshot Preview" 
                      className="w-12 h-12 object-cover rounded-lg border border-border-base bg-white"
                    />
                    <div className="max-w-[180px] sm:max-w-[300px]">
                      <p className="text-xs font-bold text-text-primary truncate">
                        {screenshot?.name || 'uploaded_image.png'}
                      </p>
                      <p className="text-[10px] font-semibold text-text-secondary/60 mt-0.5">
                        {(screenshot?.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={removeScreenshot}
                    className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center cursor-pointer active:scale-95"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-border-base/50">
              <button
                type="submit"
                disabled={status === 'submitting' || !subject || !message}
                className="w-full h-11 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 cursor-pointer selection:bg-transparent"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Submit Feedback
                  </>
                )}
              </button>
            </div>

          </motion.form>
        ) : (
          <motion.div 
            key="feedback-success-content"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-10 space-y-6"
          >
            <motion.div 
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
              className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mx-auto shadow-[0_0_25px_rgba(16,185,129,0.25)]"
            >
              <CheckCircle2 className="w-10 h-10" />
            </motion.div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-text-primary tracking-tight">Thank You!</h3>
              <p className="text-xs text-text-secondary font-semibold max-w-xs mx-auto leading-relaxed">
                Your feedback helps us improve RESUAI for everyone.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (isModal && onClose) {
                  onClose();
                } else {
                  onViewChange?.('upload');
                }
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 cursor-pointer inline-flex items-center gap-2"
            >
              {isModal ? 'Close Modal' : 'Back to Dashboard'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FeedbackView = ({ user, onViewChange }) => {
  return (
    <div className="max-w-xl mx-auto space-y-6 pb-20 px-4">
      
      {/* Header Description */}
      <div className="text-center space-y-2 max-w-sm mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto shadow-[0_0_15px_rgba(139,92,246,0.15)] mb-3">
          <MessageSquare className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-black text-text-primary tracking-tight">Send Feedback</h2>
        <p className="text-xs font-semibold text-text-secondary leading-relaxed">
          Tell us about your experience or report issues. Your feedback directly shapes the development of RESUAI.
        </p>
      </div>

      {/* Main glass card */}
      <div className="glass-card relative overflow-hidden">
        <FeedbackForm user={user} onViewChange={onViewChange} />
      </div>
    </div>
  );
};
