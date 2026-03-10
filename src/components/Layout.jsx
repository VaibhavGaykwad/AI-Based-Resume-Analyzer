import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { motion, AnimatePresence } from 'framer-motion';

export const Layout = ({ children, activeView, onViewChange, user }) => {
  const viewTitles = {
    upload: 'Resume Analysis',
    results: 'Analysis Results',
    analytics: 'Analytics Overview'
  };

  return (
    <div className="flex bg-zinc-950 min-h-screen">
      <Sidebar activeView={activeView} onViewChange={onViewChange} user={user} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header title={viewTitles[activeView]} user={user} />
        
        <main className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.03),transparent_40%)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="p-8 max-w-7xl mx-auto w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
