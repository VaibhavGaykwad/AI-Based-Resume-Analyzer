import React, { useState, useEffect } from 'react';
import { 
  Settings, Bell, Lock, Eye, Check, Palette, Moon, Sun, Monitor, 
  Mail, ShieldAlert, Cpu, Heart, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const accentsList = {
  purple: { name: 'Royal Purple', primary: '#8b5cf6', dark: '#7c3aed', light: '#c084fc', bgClass: 'bg-purple-500' },
  blue: { name: 'Deep Ocean Blue', primary: '#3b82f6', dark: '#2563eb', light: '#60a5fa', bgClass: 'bg-blue-500' },
  rose: { name: 'Rose Red', primary: '#f43f5e', dark: '#e11d48', light: '#fda4af', bgClass: 'bg-rose-500' },
  emerald: { name: 'Emerald Green', primary: '#10b981', dark: '#059669', light: '#34d399', bgClass: 'bg-emerald-500' },
  amber: { name: 'Amber Orange', primary: '#f59e0b', dark: '#d97706', light: '#fbbf24', bgClass: 'bg-amber-500' },
  cyan: { name: 'Cyber Cyan', primary: '#06b6d4', dark: '#0891b2', light: '#22d3ee', bgClass: 'bg-cyan-500' }
};

export const SettingsView = () => {
  const [activeTab, setActiveTab] = useState('appearance');
  const [saveToast, setSaveToast] = useState(false);

  // Appearance state loading
  const [themeMode, setThemeMode] = useState(() => {
    return document.documentElement.getAttribute('data-theme') || localStorage.getItem('app_theme') || 'light';
  });
  const [accentColor, setAccentColor] = useState(() => localStorage.getItem('app_accent') || 'purple');

  // Notifications state loading
  const [emailAlerts, setEmailAlerts] = useState(() => localStorage.getItem('s_email_alerts') !== 'false');
  const [perfDigest, setPerfDigest] = useState(() => localStorage.getItem('s_perf_digest') !== 'false');
  const [pushNotif, setPushNotif] = useState(() => localStorage.getItem('s_push_notif') === 'true');

  // Security state loading
  const [strictMode, setStrictMode] = useState(() => localStorage.getItem('s_strict_mode') === 'true');
  const [securityMfa, setSecurityMfa] = useState(() => localStorage.getItem('s_security_mfa') === 'true');
  const [sessionDuration, setSessionDuration] = useState(() => localStorage.getItem('s_session_dur') || '1h');

  // Privacy state loading
  const [telemetry, setTelemetry] = useState(() => localStorage.getItem('s_telemetry') !== 'false');
  const [publicProfile, setPublicProfile] = useState(() => localStorage.getItem('s_public_profile') === 'true');

  useEffect(() => {
    const handleThemeChange = () => {
      const storedTheme = localStorage.getItem('app_theme') || 'light';
      if (storedTheme !== themeMode) {
        setThemeMode(storedTheme);
      }
    };
    window.addEventListener('theme-change', handleThemeChange);
    return () => window.removeEventListener('theme-change', handleThemeChange);
  }, [themeMode]);

  // Apply Changes Automatically
  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme !== themeMode) {
      document.documentElement.setAttribute('data-theme', themeMode);
      localStorage.setItem('app_theme', themeMode);
      window.dispatchEvent(new Event('theme-change'));
    }
  }, [themeMode]);

  useEffect(() => {
    // Accent Color Palette
    const colors = accentsList[accentColor] || accentsList.purple;
    document.documentElement.style.setProperty('--primary-accent', colors.primary);
    document.documentElement.style.setProperty('--primary-accent-dark', colors.dark);
    document.documentElement.style.setProperty('--primary-accent-light', colors.light);
    localStorage.setItem('app_accent', accentColor);
  }, [accentColor]);

  // Persists other settings
  const handleSaveConfigs = () => {
    localStorage.setItem('s_email_alerts', emailAlerts);
    localStorage.setItem('s_perf_digest', perfDigest);
    localStorage.setItem('s_push_notif', pushNotif);
    localStorage.setItem('s_strict_mode', strictMode);
    localStorage.setItem('s_security_mfa', securityMfa);
    localStorage.setItem('s_session_dur', sessionDuration);
    localStorage.setItem('s_telemetry', telemetry);
    localStorage.setItem('s_public_profile', publicProfile);

    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const menuItems = [
    { id: 'appearance', label: 'Appearance', icon: Palette, desc: 'Themes & Accents' },
    { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Alert Preferences' },
    { id: 'security', label: 'Security & Auth', icon: Lock, desc: 'Access Control' },
    { id: 'privacy', label: 'Privacy Control', icon: Eye, desc: 'Telemetry & Safety' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      
      {/* Toast Confirmation box */}
      <AnimatePresence>
        {saveToast && (
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed bottom-8 right-8 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-primary text-white font-semibold text-xs shadow-lg"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Settings saved successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Settings Navigation Column */}
        <div className="glass-card md:col-span-4 space-y-2.5">
          <div className="mb-4 px-2">
            <h3 className="text-sm font-black text-text-secondary uppercase tracking-widest leading-none">Console</h3>
            <h2 className="text-xl font-black text-text-primary tracking-tight mt-1">Preferences</h2>
          </div>

          <div className="space-y-1">
            {menuItems.map((item) => {
              const active = item.id === activeTab;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center w-full gap-3.5 px-4 py-3 border rounded-2xl text-left cursor-pointer transition-all duration-200 group relative ${
                    active 
                      ? 'bg-primary/5 text-primary border-primary/20' 
                      : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-bg-base'
                  }`}
                >
                  <div className={`p-1.5 rounded-xl transition-colors ${active ? 'bg-primary/10 text-primary' : 'bg-bg-base/85 group-hover:bg-bg-base text-text-secondary/70 group-hover:text-text-primary'}`}>
                    <Icon className="w-4 h-4 shrink-0" />
                  </div>
                  <div>
                    <p className={`font-bold text-xs uppercase tracking-wider ${active ? 'text-primary' : 'text-text-primary'}`}>{item.label}</p>
                    <p className="text-[10px] font-semibold text-text-secondary mt-0.5">{item.desc}</p>
                  </div>
                  {active && (
                    <ChevronRight className="ml-auto w-4 h-4 text-primary animate-bounce-horizontal" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Settings Action Content Card */}
        <div className="md:col-span-8 space-y-6">
          <div className="glass-card space-y-6 min-h-[460px] flex flex-col justify-between">
            
            <div className="space-y-6">
              
              {/* APPEARANCE SECTION */}
              {activeTab === 'appearance' && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-text-primary tracking-tight">Appearance Customization</h3>
                    <p className="text-xs font-semibold text-text-secondary mt-1 leading-relaxed">Personalize your console dashboard theme selection and brand colors.</p>
                  </div>

                  {/* Mode Selectors */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Interface Mode</label>
                    <div className="grid grid-cols-2 gap-3.5">
                      <button 
                        onClick={() => setThemeMode('light')}
                        className={`flex items-center justify-center gap-2.5 p-3.5 border rounded-2xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                          themeMode === 'light' 
                            ? 'bg-card-base border-primary text-text-primary ring-2 ring-primary/10 shadow-sm' 
                            : 'bg-bg-base/50 hover:bg-bg-base border-border-base text-text-secondary'
                        }`}
                      >
                        <Sun className="w-4 h-4" /> Light
                      </button>
                      <button 
                        onClick={() => setThemeMode('dark')}
                        className={`flex items-center justify-center gap-2.5 p-3.5 border rounded-2xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                          themeMode === 'dark' 
                            ? 'bg-card-base border-primary text-text-primary ring-2 ring-primary/10 shadow-sm' 
                            : 'bg-bg-base/50 hover:bg-bg-base border-border-base text-text-secondary'
                        }`}
                      >
                        <Moon className="w-4 h-4" /> Dark
                      </button>
                    </div>
                  </div>

                  {/* Brand Accent Selector */}
                  <div className="space-y-3.5 pt-4.5 border-t border-border-base">
                    <div>
                      <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Primary Accent Palette</label>
                      <p className="text-[10px] font-semibold text-text-secondary mt-0.5">Select a brand color to apply dynamically across all UI tags, charts, and actions.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {Object.entries(accentsList).map(([key, value]) => {
                        const isSelected = accentColor === key;
                        return (
                          <button
                            key={key}
                            onClick={() => setAccentColor(key)}
                            className={`flex items-center gap-3 p-3 text-xs font-bold rounded-2xl border transition-all cursor-pointer ${
                              isSelected 
                                ? 'bg-bg-base/50 border-primary text-text-primary ring-2 ring-primary/10 font-extrabold shadow-sm' 
                                : 'bg-transparent border-border-base text-text-secondary hover:bg-bg-base'
                            }`}
                          >
                            <span className={`w-3.5 h-3.5 rounded-full shrink-0 ${value.bgClass} shadow-xs ring-offset-2 ring-offset-card-base ${isSelected ? 'ring-2 ring-primary' : ''}`} />
                            <span className="truncate">{value.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* NOTIFICATIONS SECTION */}
              {activeTab === 'notifications' && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                  <div>
                    <h3 className="text-xl font-black text-text-primary tracking-tight">Notification Alerts</h3>
                    <p className="text-xs font-semibold text-text-secondary mt-1 leading-relaxed">Determine how and when ResuAI delivers parsed documents alerts and scores updates.</p>
                  </div>

                  <div className="space-y-3">
                    <Toggle 
                      checked={emailAlerts} 
                      onChange={setEmailAlerts} 
                      label="Email Notifications" 
                      description="Receive automatic evaluations results details directly to your inbox upon scan completion." 
                      icon={Mail} 
                    />
                    <Toggle 
                      checked={perfDigest} 
                      onChange={setPerfDigest} 
                      label="Weekly Match Digest" 
                      description="Get a summarized report tracking key ATS parameters, ranking shifts, and target benchmarks." 
                      icon={Palette} 
                    />
                    <Toggle 
                      checked={pushNotif} 
                      onChange={setPushNotif} 
                      label="Push Alerts" 
                      description="Allow browser real-time alerts notifications for instant score changes." 
                      icon={Bell} 
                    />
                  </div>
                </motion.div>
              )}

              {/* SECURITY & AUTH SECTION */}
              {activeTab === 'security' && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                  <div>
                    <h3 className="text-xl font-black text-text-primary tracking-tight">Access Control & Security</h3>
                    <p className="text-xs font-semibold text-text-secondary mt-1 leading-relaxed">Manage security settings, strict parser filters, and local authentication sessions.</p>
                  </div>

                  <div className="space-y-3">
                    <Toggle 
                      checked={strictMode} 
                      onChange={setStrictMode} 
                      label="Strict ATS Parser Mode" 
                      description="Apply aggressive layout analysis rules to complex PDFs (might increase scan wait time)." 
                      icon={Cpu} 
                    />
                    <Toggle 
                      checked={securityMfa} 
                      onChange={setSecurityMfa} 
                      label="Enhanced Session Locking" 
                      description="Enforce strict JWT check and Google OAuth validation tokens on dashboard re-entry." 
                      icon={ShieldAlert} 
                    />
                    <CustomSelect 
                      value={sessionDuration} 
                      onChange={setSessionDuration} 
                      label="Inactivity Timeout" 
                      description="Automatically sign out workspace sessions after a specific period of inactivity." 
                      icon={Lock}
                      options={[
                        { value: '15m', label: '15 Minutes' },
                        { value: '1h', label: '1 Hour' },
                        { value: '4h', label: '4 Hours' },
                        { value: 'never', label: 'Never' }
                      ]}
                    />
                  </div>
                </motion.div>
              )}

              {/* PRIVACY SECTION */}
              {activeTab === 'privacy' && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                  <div>
                    <h3 className="text-xl font-black text-text-primary tracking-tight">Privacy Options</h3>
                    <p className="text-xs font-semibold text-text-secondary mt-1 leading-relaxed">Set data share limits, anonymous telemetry status, and document accessibility.</p>
                  </div>

                  <div className="space-y-3">
                    <Toggle 
                      checked={telemetry} 
                      onChange={setTelemetry} 
                      label="Anonymous Diagnostic Loggings" 
                      description="Help build better intelligence models by sharing sanitized execution trace tags." 
                      icon={Cpu} 
                    />
                    <Toggle 
                      checked={publicProfile} 
                      onChange={setPublicProfile} 
                      label="Recruiter Visibility" 
                      description="Allow verified external partners searches to find your index page with matching skills." 
                      icon={Eye} 
                    />
                  </div>
                </motion.div>
              )}

            </div>

            {/* Bottom Actions footer */}
            <div className="pt-5 border-t border-border-base flex flex-col sm:flex-row gap-4 justify-between items-center bg-transparent">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-1.5 order-2 sm:order-1 select-none">
                <Cpu className="w-3.5 h-3.5 text-text-secondary" /> Fully Encrypted AES-256
              </span>
              <button 
                onClick={handleSaveConfigs}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-primary/20 hover:shadow-primary/30 active:scale-95 cursor-pointer selection:bg-transparent order-1 sm:order-2"
              >
                Save Changes
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

// Internal Toggle wrapper
const Toggle = ({ checked, onChange, label, description, icon: Icon }) => (
  <div className="flex items-center justify-between p-4.5 rounded-2xl bg-bg-base/40 border border-border-base hover:border-primary/20 transition-colors">
    <div className="flex items-start gap-4 pr-4">
      {Icon && <Icon className="w-5 h-5 text-text-secondary mt-0.5 shrink-0" />}
      <div>
        <p className="font-bold text-text-primary text-sm">{label}</p>
        <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{description}</p>
      </div>
    </div>
    <label className="relative inline-flex items-center cursor-pointer shrink-0">
      <input type="checkbox" className="sr-only peer" checked={checked} onChange={e => onChange(e.target.checked)} />
      <div className="w-11 h-6 bg-border-base peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border-base after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary transition-colors" />
    </label>
  </div>
);

// Internal dropdown select wrapper
const CustomSelect = ({ value, onChange, options, label, description, icon: Icon }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4.5 rounded-2xl bg-bg-base/40 border border-border-base hover:border-primary/20 transition-colors">
    <div className="flex items-start gap-4 pr-2">
      {Icon && <Icon className="w-5 h-5 text-text-secondary mt-0.5 shrink-0" />}
      <div>
        <p className="font-bold text-text-primary text-sm">{label}</p>
        <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{description}</p>
      </div>
    </div>
    <select 
      value={value} 
      onChange={e => onChange(e.target.value)}
      className="appearance-none bg-card-base border border-border-base rounded-xl px-4 py-2.5 text-xs font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer min-w-40 sm:min-w-48 text-center"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

