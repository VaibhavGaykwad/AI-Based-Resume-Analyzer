import React from 'react';
import { User, Mail, Calendar, LogOut } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export const ProfileView = ({ user }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="glass-card p-8 border border-zinc-200 bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow">
        <h2 className="text-xl font-extrabold text-zinc-800 mb-6 flex items-center gap-2 border-b border-zinc-100 pb-4 uppercase tracking-wider">
          <User className="w-5 h-5 text-primary" />
          My Profile
        </h2>
        
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-3xl shadow-xs">
            {user?.email?.[0].toUpperCase()}
          </div>
          <div>
            <h3 className="text-2xl font-black text-zinc-800">{user?.displayName || 'User'}</h3>
            <p className="text-zinc-500 font-semibold flex items-center gap-2 mt-1.5 text-sm">
              <Mail className="w-4 h-4 text-zinc-400" />
              {user?.email}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4.5 rounded-2xl bg-slate-50 border border-zinc-200/80 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-zinc-450" />
              <div>
                <p className="text-sm font-bold text-zinc-700">Account Created</p>
                <p className="text-xs font-semibold text-zinc-500 mt-0.5">{new Date(user?.metadata?.creationTime).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-100 flex justify-end">
          <button
            onClick={() => signOut(auth)}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 rounded-xl transition-all font-bold text-xs uppercase tracking-wider shadow-sm active:scale-95 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
