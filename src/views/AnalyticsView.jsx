import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, Cell
} from 'recharts';
import { Users, TrendingUp, Award, Clock } from 'lucide-react';
import { cn } from '../utils/cn';

const skillData = [
  { name: 'React', count: 145, color: '#c5a059' },
  { name: 'Node.js', count: 112, color: '#a25b2a' },
  { name: 'TypeScript', count: 98, color: '#c5a059' },
  { name: 'Python', count: 86, color: '#a25b2a' },
  { name: 'AWS', count: 74, color: '#c5a059' },
  { name: 'Docker', count: 52, color: '#a25b2a' },
];

const scoreTrendData = [
  { month: 'Jan', score: 68 },
  { month: 'Feb', score: 72 },
  { month: 'Mar', score: 70 },
  { month: 'Apr', score: 78 },
  { month: 'May', score: 82 },
  { month: 'Jun', score: 85 },
];

const StatCard = ({ icon: Icon, label, value, trend, color }) => (
  <div className="glass-card p-6 flex items-center justify-between border border-zinc-800/50 hover:border-primary/30 transition-colors group">
    <div>
      <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-[0.2em] mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <h4 className="text-3xl font-black text-zinc-100 italic tracking-tighter">{value}</h4>
        {trend && <span className="text-[10px] font-black text-primary uppercase tracking-widest">{trend}</span>}
      </div>
    </div>
    <div className={cn("p-4 rounded-2xl bg-[#0d0d0f] border border-zinc-800 shadow-xl group-hover:border-primary/30 transition-all", color)}>
      <Icon className="w-6 h-6" />
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0d0d0f] border border-primary/20 p-4 rounded-xl shadow-2xl backdrop-blur-md">
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">{label}</p>
        <p className="text-xl font-black text-primary italic tracking-tight">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export const AnalyticsView = () => {
  return (
    <div className="space-y-8 pb-12">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Users} 
          label="Total Analyzed" 
          value="1,284" 
          trend="+12%" 
          color="text-primary"
        />
        <StatCard 
          icon={TrendingUp} 
          label="Avg. Score" 
          value="76.4" 
          trend="+5.2" 
          color="text-primary-light"
        />
        <StatCard 
          icon={Award} 
          label="Top percentile" 
          value="82nd" 
          color="text-primary"
        />
        <StatCard 
          icon={Clock} 
          label="Avg. Time" 
          value="8.2s" 
          color="text-zinc-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Common Skills Chart */}
        <div className="glass-card p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-zinc-100 tracking-tight italic uppercase">Market Skill Demand</h3>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Global Trends</span>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillData} layout="vertical" margin={{ left: -20 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}
                  width={100}
                />
                <Tooltip cursor={{ fill: 'rgba(197, 160, 89, 0.05)' }} content={<CustomTooltip />} />
                <Bar 
                  dataKey="count" 
                  radius={[0, 10, 10, 0]} 
                  barSize={16}
                >
                  {skillData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#c5a059' : '#1e1e21'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Score Trend Chart */}
        <div className="glass-card p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-zinc-100 tracking-tight italic uppercase">Growth Trajectory</h3>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Last 6 Months</span>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scoreTrendData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c5a059" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#c5a059" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#18181b" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 11, fontWeight: 900 }}
                  dy={10}
                />
                <YAxis 
                  hide
                  domain={[60, 90]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#c5a059" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="p-10 rounded-3xl bg-gradient-to-tr from-primary-dark to-primary shadow-2xl flex items-center justify-between group overflow-hidden relative">
        <div className="absolute inset-0 bg-black/10 transition-transform duration-700 group-hover:scale-110" />
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-[#0d0d0f] italic uppercase tracking-tighter mb-2">Ready to surpass the benchmark?</h2>
          <p className="text-[#0d0d0f]/70 text-sm max-w-md font-bold italic">
            Based on your aggregate history, you are in the top 18% of candidates. Targeted improvements could land you in the top 5%.
          </p>
        </div>
        <button className="relative z-10 bg-[#0d0d0f] text-white font-[1000] px-8 py-4 rounded-xl uppercase tracking-[0.2em] text-[10px] shadow-2xl transition-all hover:scale-105 active:scale-95">
          Get Career Roadmap
        </button>
      </div>
    </div>
  );
};
