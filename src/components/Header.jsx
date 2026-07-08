import React, { useState } from 'react';
import { Bell, Search, User, X, Settings, LogOut } from 'lucide-react';
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
    <header className="h-16 border-b border-zinc-200 bg-white/80 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-semibold text-zinc-550 uppercase tracking-widest">{title}</h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 transition-colors group-hover:text-zinc-600" />
          <input 
            type="text" 
            placeholder="Search analysis..." 
            className="bg-white border border-zinc-200 rounded-full py-1.5 pl-10 pr-4 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all w-64 shadow-xs"
          />
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full border border-white text-white text-[8px] font-bold flex items-center justify-center shadow-sm">
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
                className="absolute right-0 mt-4 w-80 bg-white border border-zinc-200 rounded-xl shadow-xl overflow-hidden z-50"
              >
                <div className="flex items-center justify-between p-4 border-b border-zinc-200 bg-slate-50/50">
                  <h3 className="font-semibold text-zinc-800">Notifications</h3>
                  <button onClick={() => setShowNotifications(false)} className="text-zinc-400 hover:text-zinc-650">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map(note => (
                    <div key={note.id} className={`p-4 border-b border-zinc-100 hover:bg-slate-50/50 transition-colors ${note.unread ? 'bg-primary/5' : ''}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${note.unread ? 'bg-primary shadow-[0_0_8px_rgba(139,92,246,0.5)]' : 'bg-transparent'}`} />
                        <div>
                          <p className="text-sm text-zinc-800 leading-snug">{note.text}</p>
                          <p className="text-xs text-zinc-400 mt-1">{note.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-slate-50/50 text-center border-t border-zinc-200">
                  <button onClick={markAllAsRead} className="text-xs text-primary font-semibold hover:text-primary-dark transition-colors">
                    Mark all as read
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 pl-4 border-l border-zinc-200 cursor-pointer hover:bg-slate-100/50 p-1.5 rounded-xl transition-colors text-left"
          >
            <div className="flex flex-col justify-center hidden sm:flex">
              <span className="text-xs font-bold text-zinc-700 leading-none capitalize">{userName}</span>
              <span className="text-[10px] text-zinc-400 mt-0.5 leading-none font-medium truncate max-w-[100px]">{user?.email}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary shadow-sm uppercase">
              {userInitials}
            </div>
          </button>
          
          <AnimatePresence>
            {showProfileMenu && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-48 bg-white border border-zinc-200 rounded-xl shadow-xl overflow-hidden z-50 py-1"
              >
                <button 
                  onClick={() => { setShowProfileMenu(false); onViewChange?.('profile'); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-zinc-600 hover:bg-slate-50 hover:text-zinc-800 transition-colors flex items-center gap-3 cursor-pointer"
                >
                  <User className="w-4 h-4 text-zinc-450" /> Profile
                </button>
                <button 
                  onClick={() => { setShowProfileMenu(false); onViewChange?.('settings'); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-zinc-600 hover:bg-slate-50 hover:text-zinc-800 transition-colors flex items-center gap-3 cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-zinc-450" /> Settings
                </button>
                <div className="h-px bg-zinc-100 my-1" />
                <button 
                  onClick={() => { setShowProfileMenu(false); signOut(auth); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 hover:text-red-655 transition-colors flex items-center gap-3 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
