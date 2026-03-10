import React from 'react';
import { Bell, Search, User } from 'lucide-react';

export const Header = ({ title, user }) => {
  const userInitials = user?.email ? user.email[0].toUpperCase() : 'U';
  const userName = user?.displayName || user?.email?.split('@')[0] || 'User';

  return (
    <header className="h-16 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">{title}</h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 transition-colors group-hover:text-zinc-300" />
          <input 
            type="text" 
            placeholder="Search analysis..." 
            className="bg-zinc-900/50 border border-zinc-800 rounded-full py-1.5 pl-10 pr-4 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all w-64"
          />
        </div>
        
        <button className="relative text-zinc-400 hover:text-zinc-100 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border-2 border-zinc-950" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-zinc-800">
          <div className="text-right flex flex-col justify-center">
            <span className="text-xs font-semibold text-zinc-200 leading-none capitalize">{userName}</span>
            <span className="text-[10px] text-zinc-500 mt-0.5 leading-none font-medium truncate max-w-[100px]">{user?.email}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-bold text-emerald-400 shadow-lg shadow-emerald-500/5">
            {userInitials}
          </div>
        </div>
      </div>
    </header>
  );
};
