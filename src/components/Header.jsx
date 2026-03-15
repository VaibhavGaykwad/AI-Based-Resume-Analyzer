import React, { useState } from 'react';
import { Bell, Search, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Header = ({ title, user }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  
  const userInitials = user?.email ? user.email[0].toUpperCase() : 'U';
  const userName = user?.displayName || user?.email?.split('@')[0] || 'User';

  const notifications = [
    { id: 1, text: "Your resume analysis is complete.", time: "2m ago", unread: true },
    { id: 2, text: "Welcome to ResuAI!", time: "1d ago", unread: false }
  ];

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
            className="bg-zinc-900/50 border border-zinc-800 rounded-full py-1.5 pl-10 pr-4 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all w-64"
          />
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full border-2 border-zinc-950 shadow-[0_0_8px_rgba(197,160,89,0.5)]" />
          </button>
          
          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-4 w-80 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50"
              >
                <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950/50">
                  <h3 className="font-semibold text-zinc-100">Notifications</h3>
                  <button onClick={() => setShowNotifications(false)} className="text-zinc-500 hover:text-zinc-300">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map(note => (
                    <div key={note.id} className={`p-4 border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors ${note.unread ? 'bg-zinc-800/10' : ''}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${note.unread ? 'bg-primary shadow-[0_0_8px_rgba(197,160,89,0.5)]' : 'bg-transparent'}`} />
                        <div>
                          <p className="text-sm text-zinc-200">{note.text}</p>
                          <p className="text-xs text-zinc-500 mt-1">{note.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-zinc-950/50 text-center border-t border-zinc-800">
                  <button className="text-xs text-primary font-medium hover:text-primary/80 transition-colors">
                    Mark all as read
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-3 pl-4 border-l border-zinc-800">
          <div className="text-right flex flex-col justify-center">
            <span className="text-xs font-semibold text-zinc-200 leading-none capitalize">{userName}</span>
            <span className="text-[10px] text-zinc-500 mt-0.5 leading-none font-medium truncate max-w-[100px]">{user?.email}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-bold text-primary shadow-lg shadow-primary/5">
            {userInitials}
          </div>
        </div>
      </div>
    </header>
  );
};
