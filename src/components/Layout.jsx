import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { motion, AnimatePresence } from 'framer-motion';

export const Layout = ({ children, activeView, onViewChange, user }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const viewTitles = {
    upload: 'Resume Analysis',
    results: 'Analysis Results',
    analytics: 'Analytics Overview',
    history: 'Analysis History',
    profile: 'My Profile',
    settings: 'Settings'
  };

  return (
    <div className="flex bg-[#F7F9FC] min-h-screen">
      <Sidebar 
        activeView={activeView} 
        onViewChange={onViewChange} 
        user={user} 
        isCollapsed={isCollapsed} 
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)} 
      />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header title={viewTitles[activeView]} user={user} onViewChange={onViewChange} />
        
        <main className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.08),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.08),transparent_50%)]">
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
