import React from 'react';
import { User, Mail, Calendar, LogOut } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export const ProfileView = ({ user }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-zinc-100 mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          My Profile
        </h2>
        
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-3xl">
            {user?.email?.[0].toUpperCase()}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-zinc-100">{user?.displayName || 'User'}</h3>
            <p className="text-zinc-400 flex items-center gap-2 mt-1">
              <Mail className="w-4 h-4" />
              {user?.email}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/30 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-zinc-400" />
              <div>
                <p className="text-sm font-medium text-zinc-200">Account Created</p>
                <p className="text-xs text-zinc-500">{new Date(user?.metadata?.creationTime).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-800/50 flex justify-end">
          <button
            onClick={() => signOut(auth)}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors font-medium text-sm"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
