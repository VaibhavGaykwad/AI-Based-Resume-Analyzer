import React from 'react';
import { Upload, LayoutDashboard, BarChart3, History, User, Settings, MessageSquare } from 'lucide-react';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';

export const BottomNavigation = ({ activeView, onViewChange }) => {
  const navItems = [
    { id: 'upload', label: 'Analyze', icon: Upload },
    { id: 'results', label: 'Results', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'history', label: 'History', icon: History },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-card-base/95 backdrop-blur-xl border-t border-border-base z-50 flex items-center justify-between px-1 select-none shadow-[0_-4px_25px_-5px_rgba(0,0,0,0.1)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className="flex-1 min-w-[44px] h-full flex flex-col items-center justify-center py-2 relative cursor-pointer active:scale-95 transition-transform group"
          >
            {/* Active Top Bar Indicator */}
            {isActive && (
              <motion.div 
                layoutId="bottomTabIndicator"
                className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            
            <div className="flex flex-col items-center justify-center gap-1 w-full px-1">
              <Icon 
                className={cn(
                  "w-5 h-5 transition-all duration-300 shrink-0", 
                  isActive 
                    ? "text-primary scale-110" 
                    : "text-text-secondary/60 group-hover:text-text-primary"
                )} 
              />
              
              <span 
                className={cn(
                  "w-full text-center text-[10px] min-[400px]:text-[11px] font-bold tracking-wider uppercase transition-all duration-300 block whitespace-nowrap overflow-hidden text-ellipsis px-0.5",
                  isActive 
                    ? "text-primary font-black scale-100" 
                    : "text-text-secondary/70",
                  // Hide label on screens below 400px width (icon-only mode)
                  "max-[399px]:hidden"
                )}
              >
                {item.label}
              </span>
            </div>
          </button>
        );
      })}
    </nav>
  );
};
