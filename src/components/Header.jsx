import React, { useState, useEffect } from 'react';
import { Bell, Search, User, X, Settings, LogOut, Plus, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export const Header = ({ title, user, onViewChange }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [theme, setTheme] = useState(() => {
    return document.documentElement.getAttribute('data-theme') || 'light';
  });

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem('app_theme') || 'light');
    };
    window.addEventListener('theme-change', handleThemeChange);
    return () => window.removeEventListener('theme-change', handleThemeChange);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('app_theme', newTheme);
    window.dispatchEvent(new Event('theme-change'));
  };
  
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
    <header className="h-16 border-b border-border-base bg-card-base/80 backdrop-blur-xl flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40 select-none">
      <div className="flex items-center gap-4 min-w-0">
        <h2 className="text-[10px] sm:text-xs font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest leading-none truncate" title={title}>{title}</h2>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
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
            className="bg-bg-base border border-border-base rounded-full py-1.5 pl-10 pr-4 text-xs font-semibold text-text-primary placeholder:text-zinc-450 focus:outline-none focus:bg-card-base focus:ring-1 focus:ring-primary/30 focus:border-primary/30 transition-all w-52 shadow-sm"
          />
        </div>
        
        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative text-zinc-500 hover:text-text-primary transition-colors cursor-pointer flex items-center justify-center p-1 rounded-lg hover:bg-bg-base"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border border-card-base text-white text-[7px] font-black flex items-center justify-center shadow-xs">
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
                className="absolute right-0 mt-3 w-80 bg-card-base border border-border-base rounded-2xl shadow-xl overflow-hidden z-50"
              >
                <div className="flex items-center justify-between p-4 border-b border-border-base bg-bg-base/30">
                  <h3 className="font-extrabold text-xs text-text-primary uppercase tracking-wider">Notifications</h3>
                  <button onClick={() => setShowNotifications(false)} className="text-zinc-400 hover:text-zinc-600 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map(note => (
                    <div key={note.id} className={`p-4 border-b border-border-base hover:bg-bg-base/40 transition-colors ${note.unread ? 'bg-primary/5' : ''}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${note.unread ? 'bg-primary shadow-[0_0_8px_rgba(139,92,246,0.5)]' : 'bg-transparent'}`} />
                        <div>
                          <p className="text-xs font-semibold text-text-primary leading-snug">{note.text}</p>
                          <p className="text-[10px] text-zinc-400 font-semibold mt-1">{note.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-bg-base/30 text-center border-t border-border-base">
                  <button onClick={markAllAsRead} className="text-xs text-primary font-bold hover:text-primary-dark transition-colors cursor-pointer">
                    Mark all as read
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Theme Toggle */}
        <motion.button
          type="button"
          onClick={toggleTheme}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          className="relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border border-border-base bg-[#f4f4f5]/80 dark:bg-bg-base/40 transition-colors duration-205 ease-in-out hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-[0_0_10px_rgba(245,158,11,0.18)] dark:hover:shadow-[0_0_10px_rgba(139,92,246,0.18)] outline-none select-none items-center px-1"
          aria-label="Toggle Theme"
        >
          <div className="absolute inset-0 flex justify-between px-2 items-center text-text-secondary/45 pointer-events-none select-none">
            <Sun className={`w-3.5 h-3.5 transition-opacity duration-200 ${theme === 'light' ? 'opacity-100 text-amber-500' : 'opacity-20'}`} />
            <Moon className={`w-3.5 h-3.5 transition-opacity duration-200 ${theme === 'dark' ? 'opacity-100 text-primary' : 'opacity-20'}`} />
          </div>
          
          <motion.div
            animate={{ x: theme === 'dark' ? 24 : 0 }}
            transition={{ type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.22 }}
            className="w-6 h-6 rounded-full bg-card-base border border-border-base flex items-center justify-center shadow-sm z-10 relative overflow-hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={theme}
                initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute flex items-center justify-center"
              >
                {theme === 'light' ? (
                  <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-500/10" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-primary fill-primary/10" />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.button>

        {/* Profile Avatar Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 cursor-pointer hover:bg-bg-base p-1 rounded-xl transition-colors text-left"
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
                className="absolute right-0 mt-3 w-48 bg-card-base border border-border-base rounded-2xl shadow-xl overflow-hidden z-50 py-1.5"
              >
                <div className="px-4 py-2 border-b border-border-base mb-1">
                  <span className="text-xs font-extrabold text-text-primary leading-none capitalize block truncate">{userName}</span>
                  <span className="text-[10px] text-zinc-400 font-semibold mt-1 block truncate">{user?.email}</span>
                </div>
                
                <button 
                  onClick={() => { setShowProfileMenu(false); onViewChange?.('profile'); }}
                  className="w-full text-left px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-bg-base hover:text-text-primary transition-colors flex items-center gap-2.5 cursor-pointer dark:text-zinc-350"
                >
                  <User className="w-4 h-4 text-zinc-400 animate-pulse-slow" /> Profile
                </button>
                <button 
                  onClick={() => { setShowProfileMenu(false); onViewChange?.('settings'); }}
                  className="w-full text-left px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-bg-base hover:text-text-primary transition-colors flex items-center gap-2.5 cursor-pointer dark:text-zinc-350"
                >
                  <Settings className="w-4 h-4 text-zinc-400" /> Settings
                </button>
                <div className="h-px bg-border-base my-1" />
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
