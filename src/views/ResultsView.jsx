import React from 'react';
import { ScoreGauge } from '../components/ScoreGauge';
import { BadgeList } from '../components/BadgeList';
import { SuggestionCard } from '../components/SuggestionCard';
import { Mail, Briefcase, User, Download, Share2, ExternalLink, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const ResultsView = ({ data }) => {
  if (!data) return null;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Profile Section */}
      <div className="glass-card p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-zinc-800/50">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-3xl font-black text-[#0d0d0f] shadow-xl shadow-primary/20 uppercase">
            {data.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h1 className="text-3xl font-black text-zinc-100 tracking-tight">{data.name}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-zinc-400">
              <div className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide">
                <Briefcase className="w-4 h-4 text-primary" />
                {data.role}
              </div>
              <div className="flex items-center gap-1.5 text-sm font-medium border-l border-zinc-800/50 pl-4">
                <Mail className="w-4 h-4 text-primary" />
                <span className="opacity-70">{data.email}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-5 py-3 rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-300 font-bold tracking-widest text-[10px] uppercase hover:bg-zinc-800 transition-all flex items-center gap-2.5">
            <Download className="w-4 h-4" />
            Download report
          </button>
          <button className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-light text-[#0d0d0f] font-black tracking-widest text-[10px] uppercase transition-all shadow-xl shadow-primary/25 flex items-center gap-2.5">
            <Share2 className="w-4 h-4" />
            Share insights
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Score & Skills Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Hero Score Card */}
          <div className="glass-card p-8 flex flex-col md:flex-row items-center gap-10 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.08),transparent_60%)]">
            <ScoreGauge score={data.score} />
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-6 bg-primary rounded-full" />
                <h3 className="text-2xl font-black text-zinc-100 uppercase tracking-tighter italic">Analysis Summary</h3>
              </div>
              <p className="text-zinc-400 leading-relaxed font-medium">
                Your resume performs exceptionally well for the <span className="text-primary font-bold italic underline decoration-primary/30 underline-offset-4">{data.role}</span> position. You've demonstrated strong expertise in core technical areas, though there's room to optimize your keyword density for ATS systems.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex flex-col">
                  <span className="text-3xl font-[1000] text-zinc-100 italic tracking-tighter">Top 12%</span>
                  <span className="text-[9px] uppercase font-black text-zinc-600 tracking-[0.2em]">Candidate Rank</span>
                </div>
                <div className="w-px h-12 bg-zinc-800/50" />
                <div className="flex flex-col">
                  <span className="text-3xl font-[1000] text-primary italic tracking-tighter">Gold Standard</span>
                  <span className="text-[9px] uppercase font-black text-zinc-600 tracking-[0.2em]">ATS Evaluation</span>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-8 space-y-5 border-t-2 border-t-primary/20">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-black text-zinc-100 uppercase tracking-tighter italic">Identified Skills</h3>
                <span className="text-[9px] font-black text-primary bg-primary/10 px-2.5 py-1 rounded-lg uppercase tracking-widest border border-primary/20 shadow-inner">Found {data.skills.length}</span>
              </div>
              <BadgeList items={data.skills} type="success" />
            </div>

            <div className="glass-card p-8 space-y-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-black text-zinc-100 uppercase tracking-tighter italic">Keyword Gaps</h3>
                <span className="text-[9px] font-black text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-lg uppercase tracking-widest border border-amber-500/20">Missing {data.missingKeywords.length}</span>
              </div>
              <BadgeList items={data.missingKeywords} type="neutral" />
            </div>
          </div>
        </div>

        {/* Suggestions Column */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-[1000] text-zinc-100 tracking-tighter italic uppercase">Quick Tweaks</h3>
            <ExternalLink className="w-4 h-4 text-zinc-600" />
          </div>
          <div className="space-y-4">
            {data.suggestions.map((suggestion, idx) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
              >
                <SuggestionCard suggestion={suggestion} />
              </motion.div>
            ))}
          </div>
          
          <div className="p-8 rounded-[2rem] bg-gradient-to-br from-[#0d0d0f] to-black border border-zinc-800/50 shadow-2xl relative overflow-hidden group transition-all duration-300 hover:border-primary/30">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-30 transition-all group-hover:scale-110">
              <Sparkles className="w-12 h-12 text-primary" />
            </div>
            <h4 className="font-black text-zinc-100 mb-2 relative z-10 uppercase tracking-tighter italic text-lg">Pro Strategy</h4>
            <p className="text-[13px] text-zinc-500 leading-relaxed mb-6 relative z-10 transition-colors group-hover:text-zinc-400 font-medium">
              Integrating certifications like 'AWS Certified Developer' could boost your ATS score by up to 12 points for this role.
            </p>
            <button className="w-full text-[10px] font-[1000] text-[#0d0d0f] bg-primary hover:bg-primary-light transition-all px-6 py-3 rounded-xl relative z-10 uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]">
              Refine profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
