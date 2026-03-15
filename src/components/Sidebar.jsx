import React from 'react';
import { LayoutDashboard, BarChart3, Upload, User, Settings, LogOut, FileText, History } from 'lucide-react';

import { cn } from '../utils/cn';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const NavItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all duration-200 group border",
      active 
        ? "bg-primary/5 border-primary/20 text-primary" 
        : "border-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
    )}
  >
    <Icon className={cn("w-5 h-5 transition-transform duration-200", active ? "scale-110" : "group-hover:scale-110")} />
    <span className="font-medium">{label}</span>
    {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(197,160,89,0.6)]" />}
  </button>
);

export const Sidebar = ({ activeView, onViewChange, user }) => {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <aside className="w-64 h-screen sticky top-0 border-r border-zinc-800/50 bg-[#09090b] flex flex-col p-4">
      <div className="flex flex-col gap-1 px-2 mb-10">
        <h1 className="font-black text-2xl tracking-tighter text-primary leading-none uppercase italic">ResuAI</h1>
        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Intelligence Layer</p>
      </div>

      <nav className="flex-1 space-y-1.5">
        <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] px-4 mb-3">Main Navigation</div>
        <NavItem 
          icon={Upload} 
          label="Analyze Resume" 
          active={activeView === 'upload'} 
          onClick={() => onViewChange('upload')} 
        />
        <NavItem 
          icon={LayoutDashboard} 
          label="Results" 
          active={activeView === 'results'} 
          onClick={() => onViewChange('results')} 
        />
        <NavItem 
          icon={BarChart3} 
          label="Analytics" 
          active={activeView === 'analytics'} 
          onClick={() => onViewChange('analytics')} 
        />
        <NavItem 
          icon={History} 
          label="History" 
          active={activeView === 'history'} 
          onClick={() => onViewChange('history')} 
        />
      </nav>

      <div className="mt-auto pt-4 border-t border-zinc-900/50 space-y-1">
        <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-zinc-900/30 border border-zinc-800/30">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
            {user?.email?.[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0 text-[11px]">
            <p className="text-zinc-500 font-bold uppercase tracking-wider leading-none mb-1">Signed in as</p>
            <p className="text-zinc-200 font-medium truncate">{user?.email}</p>
          </div>
        </div>
        <NavItem icon={User} label="Profile" active={false} onClick={() => {}} />
        <NavItem icon={Settings} label="Settings" active={false} onClick={() => {}} />
        <button 
          onClick={handleSignOut}
          className="flex items-center w-full gap-3 px-4 py-3 text-zinc-500 hover:text-red-400 transition-colors mt-2 group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
