import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';
import { Footer } from './Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { FeedbackForm } from '../views/FeedbackView';

export const Layout = ({ children, activeView, onViewChange, user }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [preselectedSubject, setPreselectedSubject] = useState('');
  const mainRef = React.useRef(null);

  React.useEffect(() => {
    const handleOpenModal = (e) => {
      setPreselectedSubject(e.detail?.subject || '');
      setIsFeedbackModalOpen(true);
    };
    window.addEventListener('open-feedback-modal', handleOpenModal);
    return () => window.removeEventListener('open-feedback-modal', handleOpenModal);
  }, []);

  React.useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [activeView]);

  const viewTitles = {
    upload: 'Resume Analysis',
    results: 'Analysis Results',
    analytics: 'Analytics Overview',
    history: 'Analysis History',
    feedback: 'Send Feedback',
    profile: 'My Profile',
    settings: 'Settings'
  };

  return (
    <div className="flex bg-bg-base min-h-screen">
      <Sidebar 
        activeView={activeView} 
        onViewChange={onViewChange} 
        user={user} 
        isCollapsed={isCollapsed} 
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)} 
      />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header title={viewTitles[activeView]} user={user} onViewChange={onViewChange} />
        
        <main ref={mainRef} className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.08),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.08),transparent_50%)]">
          <div className="p-4 sm:p-6 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto w-full relative">
            {children}
            <Footer onViewChange={onViewChange} />
          </div>
        </main>
      </div>

      {/* Floating Pill feedback button - hidden on mobile (hidden sm:flex) */}
      <button
        onClick={() => setIsFeedbackModalOpen(true)}
        type="button"
        aria-label="Open Feedback Modal"
        className="hidden sm:flex items-center gap-2 px-4.5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-black text-[11px] uppercase tracking-wider rounded-full shadow-lg hover:shadow-xl hover:shadow-primary/20 active:scale-95 transition-all fixed bottom-6 right-6 z-40 cursor-pointer select-none"
      >
        <MessageSquare className="w-4 h-4 shadow-sm" /> <span>Feedback</span>
      </button>

      {/* Reusable Feedback Modal */}
      <AnimatePresence>
        {isFeedbackModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFeedbackModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            />
            
            {/* Modal Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
              className="relative bg-card-base border border-border-base rounded-[20px] w-full max-w-lg overflow-hidden shadow-2xl z-10"
            >
              <FeedbackForm 
                user={user} 
                isModal={true} 
                preselectedSubject={preselectedSubject}
                onClose={() => {
                  setIsFeedbackModalOpen(false);
                  setPreselectedSubject('');
                }} 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <BottomNavigation activeView={activeView} onViewChange={onViewChange} />
    </div>
  );
};
