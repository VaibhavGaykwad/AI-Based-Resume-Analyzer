/* eslint-disable no-unused-vars */
import React from 'react';
import { LayoutDashboard, BarChart3, Upload, User, Settings, LogOut, History, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const NavItem = ({ icon: Icon, label, active, onClick, isCollapsed }) => (
  <button
    onClick={onClick}
    title={isCollapsed ? label : undefined}
    className={cn(
      "flex items-center w-full gap-3 px-3.5 py-3 rounded-xl transition-all duration-200 group border text-left cursor-pointer relative overflow-hidden",
      active 
        ? "border-transparent text-white shadow-sm shadow-blue-500/10" 
        : "border-transparent text-text-secondary hover:text-text-primary hover:bg-card-base/40 hover:border-border-base/50"
    )}
  >
    {active && (
      <motion.div
        layoutId="sidebar-active-pill"
        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 z-0"
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
      />
    )}
    
    <span className="relative z-10 flex items-center w-full gap-3">
      <Icon className={cn("w-5 h-5 transition-transform duration-200 shrink-0", active ? "scale-105 text-white" : "group-hover:scale-105 text-text-secondary/60 group-hover:text-text-primary")} />
      
      <AnimatePresence mode="wait">
        {!isCollapsed && (
          <motion.span 
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.15 }}
            className="font-bold text-sm select-none whitespace-nowrap overflow-hidden"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
      
      {!isCollapsed && active && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
      )}
    </span>
  </button>
);

export const Sidebar = ({ activeView, onViewChange, user, isCollapsed, onToggleCollapse }) => {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 76 : 256 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className="h-screen sticky top-0 border-r border-border-base bg-bg-base hidden md:flex flex-col p-4 shrink-0 overflow-visible z-40 select-none"
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className="absolute top-6 -right-3 w-6 h-6 rounded-full bg-card-base border border-border-base flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-border-base shadow-sm cursor-pointer z-50 transition-all hover:scale-105 active:scale-95"
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Brand Profile Logo */}
      <div className={cn("flex items-center gap-3 px-2 mb-10 shrink-0", isCollapsed ? "justify-center" : "")}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-sm shrink-0">
          R
        </div>
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -5 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col gap-0.5 overflow-hidden"
            >
              <h1 className="font-extrabold text-base tracking-tight text-text-primary uppercase leading-none">ResuAI</h1>
              <p className="text-[8px] text-text-secondary font-extrabold uppercase tracking-widest">Intelligence Layer</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Options */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto overflow-x-hidden py-1">
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-[9px] font-black text-text-secondary uppercase tracking-widest px-4 mb-3"
          >
            Main Navigation
          </motion.div>
        )}
        <NavItem 
          icon={Upload} 
          label="Analyze Resume" 
          active={activeView === 'upload'} 
          onClick={() => onViewChange('upload')} 
          isCollapsed={isCollapsed}
        />
        <NavItem 
          icon={LayoutDashboard} 
          label="Results" 
          active={activeView === 'results'} 
          onClick={() => onViewChange('results')} 
          isCollapsed={isCollapsed}
        />
        <NavItem 
          icon={BarChart3} 
          label="Analytics" 
          active={activeView === 'analytics'} 
          onClick={() => onViewChange('analytics')} 
          isCollapsed={isCollapsed}
        />
        <NavItem 
          icon={History} 
          label="History" 
          active={activeView === 'history'} 
          onClick={() => onViewChange('history')} 
          isCollapsed={isCollapsed}
        />
        <NavItem 
          icon={MessageSquare} 
          label="Feedback" 
          active={activeView === 'feedback'} 
          onClick={() => onViewChange('feedback')} 
          isCollapsed={isCollapsed}
        />
      </nav>

      <div className="mt-auto pt-4 border-t border-border-base/80 space-y-1 shrink-0">
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-3 px-3 py-3 mb-2 rounded-2xl bg-card-base border border-border-base shadow-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0 select-none">
                {user?.email?.[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0 text-[10px]">
                <p className="text-text-secondary font-extrabold uppercase tracking-wider leading-none mb-1 select-none">Signed in</p>
                <p className="text-text-primary font-bold truncate text-[11px]">{user?.email}</p>
              </div>
            </motion.div>
          ) : (
            <div className="flex justify-center mb-2">
              <div 
                className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs select-none hover:scale-105 transition-transform" 
                title={user?.email}
              >
                {user?.email?.[0].toUpperCase()}
              </div>
            </div>
          )}
        </AnimatePresence>

        <NavItem icon={User} label="Profile" active={activeView === 'profile'} onClick={() => onViewChange('profile')} isCollapsed={isCollapsed} />
        <NavItem icon={Settings} label="Settings" active={activeView === 'settings'} onClick={() => onViewChange('settings')} isCollapsed={isCollapsed} />
        
        <button 
          onClick={handleSignOut}
          title={isCollapsed ? "Sign Out" : undefined}
          className={cn(
            "flex items-center w-full gap-3 px-3.5 py-3 text-text-secondary hover:text-red-500 transition-colors mt-2 group text-left cursor-pointer rounded-xl hover:bg-red-500/10",
            isCollapsed ? "justify-center" : ""
          )}
        >
          <LogOut className="w-5 h-5 group-hover:translate-x-0.5 transition-transform text-text-secondary/60 group-hover:text-red-550 shrink-0" />
          {!isCollapsed && <span className="font-bold text-sm select-none">Sign Out</span>}
        </button>
      </div>
    </motion.aside>
  );
};
