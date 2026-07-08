import React, { useState } from 'react';
import { Settings, Bell, Lock, Eye, Check } from 'lucide-react';

export const SettingsView = () => {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="glass-card p-8 border border-zinc-200 bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow">
        <h2 className="text-xl font-extrabold text-zinc-800 mb-6 flex items-center gap-2 border-b border-zinc-100 pb-4 uppercase tracking-wider">
          <Settings className="w-5 h-5 text-primary animate-spin-slow" />
          Preferences
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4.5 rounded-2xl bg-slate-50 border border-zinc-200/80 hover:border-zinc-300 transition-colors">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-zinc-400" />
              <div>
                <p className="font-bold text-zinc-700 text-sm">Email Notifications</p>
                <p className="text-xs text-zinc-500 mt-0.5">Receive analysis completion alerts</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4.5 rounded-2xl bg-slate-50 border border-zinc-200/80 hover:border-zinc-300 transition-colors">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-zinc-400" />
              <div>
                <p className="font-bold text-zinc-700 text-sm">Anonymous Analytics</p>
                <p className="text-xs text-zinc-500 mt-0.5">Help us improve the product safely</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4.5 rounded-2xl bg-slate-50 border border-zinc-200/80 hover:border-zinc-300 transition-colors">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-zinc-400" />
              <div>
                <p className="font-bold text-zinc-700 text-sm">Strict Parsing Mode</p>
                <p className="text-xs text-zinc-500 mt-0.5">Aggressively parse complex layouts</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-100 flex justify-end">
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-primary/20 active:scale-95 cursor-pointer"
          >
            {saved ? <><Check className="w-4 h-4" /> Saved</> : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};
