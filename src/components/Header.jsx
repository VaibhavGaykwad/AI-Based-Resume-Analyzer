import React, { useState } from 'react';
import { Bell, Search, User, X, Settings, LogOut, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export const Header = ({ title, user, onViewChange }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const userInitials = user?.email ? user.email[0].toUpperCase() : 'U';
  const userName = user?.displayName || user?.email?.split('@')[0] || 'User';

  const [notifications, setNotifications] = useState([
    { id: 1, text: "Your resume analysis is complete.", time: "2m ago", unread: true },
    { id: 2, text: "Welcome to ResuAI!", time: "1d ago", unread: false }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  return (
    <header className="h-16 border-b border-zinc-200/80 bg-white/80 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-40 select-none">
      <div className="flex items-center gap-4">
        <h2 className="text-xs font-black text-zinc-500 uppercase tracking-widest leading-none">{title}</h2>
      </div>

      <div className="flex items-center gap-6">
        {/* Quick Action Button */}
        <button 
          onClick={() => onViewChange?.('upload')}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-xs hover:scale-[1.02] active:scale-95 cursor-pointer select-none shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Scan</span>
        </button>

        {/* Search Bar */}
        <div className="relative group hidden md:block">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors group-hover:text-zinc-600 pointer-events-none" />
          <input 
            type="text" 
            placeholder="Search analysis..." 
            className="bg-zinc-50 border border-zinc-200 rounded-full py-1.5 pl-10 pr-4 text-xs font-semibold text-zinc-800 placeholder:text-zinc-450 focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary/30 focus:border-primary/30 transition-all w-52 shadow-2xs"
          />
        </div>
        
        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer flex items-center justify-center p-1 rounded-lg hover:bg-slate-100"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border border-white text-white text-[7px] font-black flex items-center justify-center shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>
          
          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 w-80 bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden z-50"
              >
                <div className="flex items-center justify-between p-4 border-b border-zinc-200 bg-slate-50/50">
                  <h3 className="font-extrabold text-xs text-zinc-850 uppercase tracking-wider">Notifications</h3>
                  <button onClick={() => setShowNotifications(false)} className="text-zinc-400 hover:text-zinc-650 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map(note => (
                    <div key={note.id} className={`p-4 border-b border-zinc-100 hover:bg-slate-50/50 transition-colors ${note.unread ? 'bg-primary/5' : ''}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${note.unread ? 'bg-primary shadow-[0_0_8px_rgba(139,92,246,0.5)]' : 'bg-transparent'}`} />
                        <div>
                          <p className="text-xs font-semibold text-zinc-700 leading-snug">{note.text}</p>
                          <p className="text-[10px] text-zinc-400 font-semibold mt-1">{note.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-slate-50/50 text-center border-t border-zinc-200">
                  <button onClick={markAllAsRead} className="text-xs text-primary font-bold hover:text-primary-dark transition-colors cursor-pointer">
                    Mark all as read
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Avatar Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 p-1 rounded-xl transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-105 to-purple-105 bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-xs uppercase select-none">
              {userInitials}
            </div>
          </button>
          
          <AnimatePresence>
            {showProfileMenu && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 w-48 bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden z-50 py-1.5"
              >
                <div className="px-4 py-2 border-b border-zinc-100 mb-1">
                  <span className="text-xs font-extrabold text-zinc-800 leading-none capitalize block truncate">{userName}</span>
                  <span className="text-[10px] text-zinc-400 font-semibold mt-1 block truncate">{user?.email}</span>
                </div>
                
                <button 
                  onClick={() => { setShowProfileMenu(false); onViewChange?.('profile'); }}
                  className="w-full text-left px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-slate-50 hover:text-zinc-800 transition-colors flex items-center gap-2.5 cursor-pointer"
                >
                  <User className="w-4 h-4 text-zinc-400 animate-pulse-slow" /> Profile
                </button>
                <button 
                  onClick={() => { setShowProfileMenu(false); onViewChange?.('settings'); }}
                  className="w-full text-left px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-slate-50 hover:text-zinc-800 transition-colors flex items-center gap-2.5 cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-zinc-400" /> Settings
                </button>
                <div className="h-px bg-zinc-100 my-1" />
                <button 
                  onClick={() => { setShowProfileMenu(false); signOut(auth); }}
                  className="w-full text-left px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-2.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-400" /> Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
