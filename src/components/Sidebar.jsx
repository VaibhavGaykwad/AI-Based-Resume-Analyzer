import React from 'react';
import { LayoutDashboard, BarChart3, Upload, User, Settings, LogOut, FileText } from 'lucide-react';
import { cn } from '../utils/cn';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const NavItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center w-full gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
      active 
        ? "bg-emerald-500/10 text-emerald-500" 
        : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
    )}
  >
    <Icon className={cn("w-5 h-5 transition-transform duration-200", active ? "scale-110" : "group-hover:scale-110")} />
    <span className="font-medium">{label}</span>
    {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />}
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
    <aside className="w-64 h-screen sticky top-0 border-r border-zinc-800/50 bg-zinc-950 flex flex-col p-4">
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-900/20">
          <FileText className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight text-zinc-100 leading-none">ResuAI</h1>
          <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mt-1">Intelligence Layer</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.2em] px-4 mb-4">Main Navigation</div>
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
      </nav>

      <div className="mt-auto pt-4 border-t border-zinc-900 space-y-1">
        <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold text-xs">
            {user?.email?.[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider leading-none mb-1">Signed in as</p>
            <p className="text-xs text-zinc-200 font-medium truncate">{user?.email}</p>
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
