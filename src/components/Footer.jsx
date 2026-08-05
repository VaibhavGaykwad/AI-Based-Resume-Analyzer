import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  MessageSquare, 
  Linkedin, 
  Twitter, 
  Youtube, 
  Mail, 
  Shield, 
  Zap, 
  Target, 
  Star,
  FileText,
  CheckSquare,
  Clock,
  User,
  BookOpen,
  Edit,
  Users,
  HelpCircle,
  Headphones,
  Info
} from 'lucide-react';

export const Footer = ({ onViewChange }) => {
  const [theme, setTheme] = useState(() => {
    return document.documentElement.getAttribute('data-theme') || 'light';
  });

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(document.documentElement.getAttribute('data-theme') || 'light');
    };
    window.addEventListener('theme-change', handleThemeChange);
    return () => window.removeEventListener('theme-change', handleThemeChange);
  }, []);

  const handleProductClick = (view) => {
    if (onViewChange) {
      onViewChange(view);
      const main = document.querySelector('main');
      if (main) main.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isLight = theme === 'light';

  return (
    <footer className={`w-full mt-10 pt-6 pb-9 border-t ${isLight ? 'border-zinc-200' : 'border-border-base/15'}`}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 w-full">
        
        {/* ========================= SECTION 1 – TOP INFORMATION CARD ========================= */}
        <div className={`relative p-[1px] rounded-[24px] overflow-hidden glass-card shadow-lg ${
          isLight ? 'bg-gradient-to-r from-primary/45 via-zinc-400/90 to-primary/30' : 'bg-gradient-to-r from-primary/30 via-border-base/70 to-primary/10'
        }`}>
          <div className={`relative backdrop-blur-md p-5 sm:p-7 rounded-[23px] grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-0 divide-y md:divide-y-0 md:divide-x ${
            isLight ? 'bg-zinc-100/95 divide-zinc-300' : 'bg-card-base/40 divide-border-base/30'
          }`}>
            
            {/* LEFT Column */}
            <div className="flex flex-col justify-between items-start gap-3 md:pr-6 text-left pb-5 md:pb-0">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[0_0_12px_rgba(139,92,246,0.12)] shrink-0">
                  <BarChart3 className="w-4.5 h-4.5 text-primary" />
                </div>
                <div className="space-y-1">
                  <h4 className={`text-xs font-black uppercase tracking-wider italic ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                    Understand Your ATS Score Better
                  </h4>
                  <p className={`text-[10.5px] leading-relaxed font-semibold ${isLight ? 'text-zinc-600' : 'text-text-secondary'}`}>
                    Your resume is evaluated using AI across six key categories including skills, experience, education, ATS keywords, formatting, and completeness.
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => handleProductClick('analytics')}
                className="text-[9.5px] font-black text-primary hover:text-primary-dark transition-all duration-200 inline-flex items-center gap-1.5 uppercase tracking-widest mt-0.5 ml-13 group select-none cursor-pointer"
              >
                LEARN HOW SCORING WORKS <span className="transform group-hover:translate-x-1 duration-200">→</span>
              </button>
            </div>

            {/* RIGHT Column */}
            <div className="flex flex-col justify-between items-start gap-3 md:pl-6 text-left pt-5 md:pt-0">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[0_0_12px_rgba(139,92,246,0.12)] shrink-0">
                  <MessageSquare className="w-4.5 h-4.5 text-primary" />
                </div>
                <div className="space-y-1">
                  <h4 className={`text-xs font-black uppercase tracking-wider italic ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                    Help Us Improve RESUAI
                  </h4>
                  <p className={`text-[10.5px] leading-relaxed font-semibold ${isLight ? 'text-zinc-600' : 'text-text-secondary'}`}>
                    Your feedback helps us improve RESUAI and deliver a better experience for everyone. Share suggestions, report bugs, or request new features.
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => handleProductClick('feedback')}
                className="text-[9.5px] font-black text-primary hover:text-primary-dark transition-all duration-200 inline-flex items-center gap-1.5 uppercase tracking-widest mt-0.5 ml-13 group select-none cursor-pointer"
              >
                SEND FEEDBACK <span className="transform group-hover:translate-x-1 duration-200">→</span>
              </button>
            </div>

          </div>
        </div>

        {/* ========================= SECTION 2 – MAIN FOOTER ========================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[26fr_18.5fr_18.5fr_18.5fr_18.5fr] gap-6 items-start mt-10 pt-4 pb-2">
          
          {/* Column 1 (Brand) - 26% Width */}
          <div className="space-y-4 flex flex-col justify-start">
            <div className="flex items-center gap-2 select-none">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 via-purple-600 to-indigo-600 flex items-center justify-center text-white text-xl font-[1000] shadow-[0_0_18px_rgba(139,92,246,0.25)] shrink-0 select-none">
                R<span className="text-[12px] font-extrabold translate-y-[-3px] ml-0.5">+</span>
              </div>
              <div className="flex flex-col">
                <h3 className={`text-xl font-black tracking-tight uppercase italic leading-none ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                  RESU<span className="text-primary bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">AI</span>
                </h3>
                <span className={`text-[8.5px] uppercase font-black tracking-widest leading-none mt-1 ${isLight ? 'text-zinc-600' : 'text-text-secondary/70'}`}>
                  AI Resume Intelligence Layer
                </span>
              </div>
            </div>
            
            <p className={`text-[11.5px] font-semibold leading-relaxed max-w-[280px] ${isLight ? 'text-zinc-650' : 'text-text-secondary'}`}>
              Helping job seekers build stronger ATS-friendly resumes with AI-powered analysis and personalized insights.
            </p>
            
            {/* Social Icons row (40x40px size) */}
            <div className="flex gap-3 pt-1">
              {[
                { icon: <Linkedin className="w-4.5 h-4.5" />, url: 'https://linkedin.com' },
                { icon: <Twitter className="w-4.5 h-4.5" />, url: 'https://twitter.com' },
                { icon: <Youtube className="w-4.5 h-4.5" />, url: 'https://youtube.com' },
                { icon: <Mail className="w-4.5 h-4.5" />, url: 'mailto:contact@resuai.com' }
              ].map((soc, idx) => (
                <a 
                  key={idx}
                  href={soc.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`w-10 h-10 rounded-xl border backdrop-blur-md flex items-center justify-center hover:text-primary hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 hover:shadow-[0_0_12px_rgba(139,92,246,0.25)] shadow-xs ${
                    isLight
                      ? 'border-zinc-200 bg-white text-zinc-900'
                      : 'border-white/10 bg-white/5 text-text-secondary'
                  }`}
                >
                  {soc.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 (Product) - 18.5% Width */}
          <div className="space-y-4 flex flex-col justify-start">
            <h4 className={`text-[9.5px] font-black uppercase tracking-widest relative pb-1.5 select-none ${isLight ? 'text-zinc-900' : 'text-white'}`}>
              PRODUCT
              <span className="absolute bottom-0 left-0 w-6 h-[2px] bg-gradient-to-r from-primary to-primary-light" />
            </h4>
            <ul className="space-y-2.5 mt-1">
              {[
                { label: 'Analyze Resume', view: 'upload', icon: <FileText className="w-3.5 h-3.5" /> },
                { label: 'Results', view: 'results', icon: <CheckSquare className="w-3.5 h-3.5" /> },
                { label: 'Analytics', view: 'analytics', icon: <BarChart3 className="w-3.5 h-3.5" /> },
                { label: 'History', view: 'history', icon: <Clock className="w-3.5 h-3.5" /> },
                { label: 'Profile', view: 'profile', icon: <User className="w-3.5 h-3.5" /> }
              ].map((p, idx) => (
                <li key={idx} className="flex items-center">
                  <button 
                    onClick={() => handleProductClick(p.view)}
                    className={`group flex items-center gap-2.5 text-[11.5px] font-semibold transition-colors duration-200 select-none text-left w-full cursor-pointer ${
                      isLight ? 'text-zinc-600 hover:text-zinc-950' : 'text-text-secondary hover:text-white'
                    }`}
                  >
                    <span className={`transition-colors duration-200 ${isLight ? 'text-zinc-500 group-hover:text-primary' : 'text-text-secondary/60 group-hover:text-primary'}`}>
                      {p.icon}
                    </span>
                    <span>{p.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 (Resources) - 18.5% Width */}
          <div className="space-y-4 flex flex-col justify-start">
            <h4 className={`text-[9.5px] font-black uppercase tracking-widest relative pb-1.5 select-none ${isLight ? 'text-zinc-900' : 'text-white'}`}>
              RESOURCES
              <span className="absolute bottom-0 left-0 w-6 h-[2px] bg-gradient-to-r from-primary to-primary-light" />
            </h4>
            <ul className="space-y-2.5 mt-1">
              {[
                { label: 'ATS Guide', icon: <BookOpen className="w-3.5 h-3.5" /> },
                { label: 'Resume Tips', icon: <Edit className="w-3.5 h-3.5" /> },
                { label: 'Interview Tips', icon: <Users className="w-3.5 h-3.5" /> },
                { label: 'FAQ', icon: <HelpCircle className="w-3.5 h-3.5" /> },
                { label: 'Support Center', icon: <Headphones className="w-3.5 h-3.5" /> }
              ].map((r, idx) => (
                <li key={idx} className="flex items-center">
                  <span className={`group flex items-center gap-2.5 text-[11.5px] font-semibold transition-colors duration-200 select-none text-left cursor-pointer w-full ${
                    isLight ? 'text-zinc-600 hover:text-zinc-950' : 'text-text-secondary hover:text-white'
                  }`}>
                    <span className={`transition-colors duration-200 ${isLight ? 'text-zinc-500 group-hover:text-primary' : 'text-text-secondary/60 group-hover:text-primary'}`}>
                      {r.icon}
                    </span>
                    <span>{r.label}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 (Company) - 18.5% Width */}
          <div className="space-y-4 flex flex-col justify-start">
            <h4 className={`text-[9.5px] font-black uppercase tracking-widest relative pb-1.5 select-none ${isLight ? 'text-zinc-900' : 'text-white'}`}>
              COMPANY
              <span className="absolute bottom-0 left-0 w-6 h-[2px] bg-gradient-to-r from-primary to-primary-light" />
            </h4>
            <ul className="space-y-2.5 mt-1">
              {[
                { label: 'About', icon: <Info className="w-3.5 h-3.5" /> },
                { label: 'Our Mission', icon: <Target className="w-3.5 h-3.5" /> },
                { label: 'Contact Us', icon: <Mail className="w-3.5 h-3.5" /> },
                { label: 'Privacy Policy', icon: <Shield className="w-3.5 h-3.5" /> },
                { label: 'Terms of Service', icon: <FileText className="w-3.5 h-3.5" /> }
              ].map((c, idx) => (
                <li key={idx} className="flex items-center">
                  <span className={`group flex items-center gap-2.5 text-[11.5px] font-semibold transition-colors duration-200 select-none text-left cursor-pointer w-full ${
                    isLight ? 'text-zinc-600 hover:text-zinc-950' : 'text-text-secondary hover:text-white'
                  }`}>
                    <span className={`transition-colors duration-200 ${isLight ? 'text-zinc-500 group-hover:text-primary' : 'text-text-secondary/60 group-hover:text-primary'}`}>
                      {c.icon}
                    </span>
                    <span>{c.label}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5 (Connect) - 18.5% Width */}
          <div className="space-y-4 flex flex-col justify-start">
            <h4 className={`text-[9.5px] font-black uppercase tracking-widest relative pb-1.5 select-none ${isLight ? 'text-zinc-900' : 'text-white'}`}>
              CONNECT
              <span className="absolute bottom-0 left-0 w-6 h-[2px] bg-gradient-to-r from-primary to-primary-light" />
            </h4>
            <ul className="space-y-2.5 mt-1">
              {[
                { label: 'LinkedIn', icon: <Linkedin className="w-3.5 h-3.5" />, url: 'https://linkedin.com' },
                { label: 'Twitter / X', icon: <Twitter className="w-3.5 h-3.5" />, url: 'https://twitter.com' },
                { label: 'YouTube', icon: <Youtube className="w-3.5 h-3.5" />, url: 'https://youtube.com' },
                { label: 'Email Us', icon: <Mail className="w-3.5 h-3.5" />, url: 'mailto:contact@resuai.com' }
              ].map((con, idx) => (
                <li key={idx} className="flex items-center">
                  <a 
                    href={con.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`group flex items-center gap-2.5 text-[11.5px] font-semibold transition-colors duration-200 select-none text-left w-full ${
                      isLight ? 'text-zinc-600 hover:text-zinc-950' : 'text-text-secondary hover:text-white'
                    }`}
                  >
                    <span className={`transition-colors duration-200 ${isLight ? 'text-zinc-500 group-hover:text-primary' : 'text-text-secondary/60 group-hover:text-primary'}`}>
                      {con.icon}
                    </span>
                    <span>{con.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* ========================= SECTION 3 – FEATURE HIGHLIGHTS ========================= */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-5 pb-5 border-t border-b items-center ${isLight ? 'border-zinc-200' : 'border-border-base/15'}`}>
          
          {/* Feature 1 */}
          <div className={`flex items-center gap-3.5 h-full w-full justify-start md:justify-center lg:justify-start transition-all duration-200 ${
            isLight
              ? 'bg-white border border-zinc-200/80 rounded-2xl p-3.5 shadow-sm'
              : 'lg:border-r border-border-base/15 lg:pr-4'
          }`}>
            <div className="w-[50px] h-[50px] rounded-full bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.12)] shrink-0">
              <Shield className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="space-y-0.5">
              <h5 className={`text-[14px] font-bold tracking-tight select-none ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                Secure
              </h5>
              <p className={`text-[11.5px] leading-relaxed font-semibold max-w-[170px] line-clamp-1 ${isLight ? 'text-zinc-600' : 'text-text-secondary'}`}>
                Your data is safely protected.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className={`flex items-center gap-3.5 h-full w-full justify-start md:justify-center lg:justify-start transition-all duration-200 ${
            isLight
              ? 'bg-white border border-zinc-200/80 rounded-2xl p-3.5 shadow-sm'
              : 'lg:border-r border-border-base/15 lg:pr-4'
          }`}>
            <div className="w-[50px] h-[50px] rounded-full bg-blue-500/10 border border-blue-500/15 flex items-center justify-center shadow-[0_0_12px_rgba(59,130,246,0.12)] shrink-0">
              <Zap className="w-5 h-5 text-blue-500" />
            </div>
            <div className="space-y-0.5">
              <h5 className={`text-[14px] font-bold tracking-tight select-none ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                Fast & Accurate
              </h5>
              <p className={`text-[11.5px] leading-relaxed font-semibold max-w-[170px] line-clamp-1 ${isLight ? 'text-zinc-600' : 'text-text-secondary'}`}>
                Receive analysis in seconds.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className={`flex items-center gap-3.5 h-full w-full justify-start md:justify-center lg:justify-start transition-all duration-200 ${
            isLight
              ? 'bg-white border border-zinc-200/80 rounded-2xl p-3.5 shadow-sm'
              : 'lg:border-r border-border-base/15 lg:pr-4'
          }`}>
            <div className="w-[50px] h-[50px] rounded-full bg-purple-500/10 border border-purple-500/15 flex items-center justify-center shadow-[0_0_12px_rgba(139,92,246,0.12)] shrink-0">
              <Target className="w-5 h-5 text-purple-500" />
            </div>
            <div className="space-y-0.5">
              <h5 className={`text-[14px] font-bold tracking-tight select-none ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                ATS Optimized
              </h5>
              <p className={`text-[11.5px] leading-relaxed font-semibold max-w-[170px] line-clamp-1 ${isLight ? 'text-zinc-600' : 'text-text-secondary'}`}>
                Improve ATS compatibility.
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className={`flex items-center gap-3.5 h-full w-full justify-start md:justify-center lg:justify-start transition-all duration-200 ${
            isLight
              ? 'bg-white border border-zinc-200/80 rounded-2xl p-3.5 shadow-sm'
              : ''
          }`}>
            <div className="w-[50px] h-[50px] rounded-full bg-amber-500/10 border border-amber-500/15 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.12)] shrink-0">
              <Star className="w-5 h-5 text-amber-500" />
            </div>
            <div className="space-y-0.5">
              <h5 className={`text-[14px] font-bold tracking-tight select-none ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                Smart Insights
              </h5>
              <p className={`text-[11.5px] leading-relaxed font-semibold max-w-[170px] line-clamp-1 ${isLight ? 'text-zinc-600' : 'text-text-secondary'}`}>
                Personalized recommendations.
              </p>
            </div>
          </div>

        </div>

        {/* ========================= SECTION 4 – BOTTOM BAR ========================= */}
        <div className={`flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left text-[9.5px] font-bold tracking-wider uppercase px-2 py-1 select-none mt-5 ${
          isLight ? 'text-zinc-700' : 'text-text-secondary/70'
        }`}>
          <span>© 2026 RESUAI. All rights reserved.</span>
          <span className={`flex items-center gap-1.5 font-semibold ${isLight ? 'text-zinc-600' : 'text-text-secondary/60'}`}>
            <span className="text-red-500 text-xs">❤️</span> Empowering careers with AI-driven insights.
          </span>
          <div className={`flex flex-row items-center gap-3 ${isLight ? 'text-zinc-700' : 'text-text-secondary/70'}`}>
            <span>Made for Students • Professionals • Recruiters</span>
            <span className={`${isLight ? 'text-zinc-300' : 'text-border-base'}`}>•</span>
            <div className="inline-block font-mono bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full text-[9px] lowercase tracking-wide text-primary">
              v1.0.0
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
