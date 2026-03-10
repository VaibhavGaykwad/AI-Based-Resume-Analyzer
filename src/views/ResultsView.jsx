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
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-emerald-900/20 uppercase">
            {data.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h1 className="text-3xl font-black text-zinc-100 tracking-tight">{data.name}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-zinc-400">
              <div className="flex items-center gap-1.5 text-sm font-medium">
                <Briefcase className="w-4 h-4 text-emerald-500" />
                {data.role}
              </div>
              <div className="flex items-center gap-1.5 text-sm font-medium border-l border-zinc-800 pl-4">
                <Mail className="w-4 h-4 text-emerald-500" />
                {data.email}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-300 font-bold tracking-widest text-[11px] uppercase hover:bg-zinc-800 transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
          <button className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold tracking-widest text-[11px] uppercase transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Share Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Score & Skills Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Hero Score Card */}
          <div className="glass-card p-8 flex flex-col md:flex-row items-center gap-10 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.05),transparent_60%)]">
            <ScoreGauge score={data.score} />
            <div className="flex-1 space-y-4">
              <h3 className="text-2xl font-bold text-zinc-100">Analysis Summary</h3>
              <p className="text-zinc-400 leading-relaxed">
                Your resume performs exceptionally well for the <span className="text-emerald-400 font-semibold">{data.role}</span> position. You've demonstrated strong expertise in core technical areas, though there's room to optimize your keyword density for ATS systems.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-zinc-100 italic">Top 15%</span>
                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Candidate Rank</span>
                </div>
                <div className="w-px h-10 bg-zinc-800" />
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-emerald-500 italic">A+</span>
                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">ATS Grade</span>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-zinc-100">Identified Skills</h3>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest border border-emerald-500/20">Found {data.skills.length}</span>
              </div>
              <BadgeList items={data.skills} type="success" />
            </div>

            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-zinc-100">Recommended Keywords</h3>
                <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest border border-amber-500/20">Missing {data.missingKeywords.length}</span>
              </div>
              <BadgeList items={data.missingKeywords} type="neutral" />
            </div>
          </div>
        </div>

        {/* Suggestions Column */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black text-zinc-100 tracking-tight italic uppercase">Top Improvements</h3>
            <ExternalLink className="w-4 h-4 text-zinc-500" />
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
          
          <div className="p-6 rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 shadow-xl relative overflow-hidden group transition-all duration-300 hover:border-emerald-500/30">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <CheckCircle className="w-12 h-12 text-emerald-500" />
            </div>
            <h4 className="font-bold text-zinc-100 mb-2 relative z-10 uppercase tracking-tighter italic">Pro Tip</h4>
            <p className="text-sm text-zinc-400 leading-relaxed mb-4 relative z-10 transition-colors group-hover:text-zinc-300">
              Integrating certifications like 'AWS Certified Developer' could boost your ATS score by up to 12 points for this role.
            </p>
            <button className="text-xs font-black text-zinc-100 bg-emerald-600 hover:bg-emerald-500 transition-colors px-4 py-2 rounded-lg relative z-10 uppercase tracking-widest shadow-lg shadow-emerald-900/40">
              Upgrade Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
