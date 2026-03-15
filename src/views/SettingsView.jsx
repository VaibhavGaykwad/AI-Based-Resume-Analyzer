import React, { useState } from 'react';
import { Settings, Bell, Lock, Eye, Check } from 'lucide-react';

export const SettingsView = () => {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-zinc-100 mb-6 flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          Preferences
        </h2>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/30">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-zinc-400" />
              <div>
                <p className="font-medium text-zinc-200">Email Notifications</p>
                <p className="text-xs text-zinc-500">Receive analysis completion alerts</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/30">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-zinc-400" />
              <div>
                <p className="font-medium text-zinc-200">Anonymous Analytics</p>
                <p className="text-xs text-zinc-500">Help us improve the product safely</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/30">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-zinc-400" />
              <div>
                <p className="font-medium text-zinc-200">Strict Parsing Mode</p>
                <p className="text-xs text-zinc-500">Aggressively parse complex layouts</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-800/50 flex justify-end">
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-black font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            {saved ? <><Check className="w-4 h-4" /> Saved</> : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};
