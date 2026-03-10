import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, Cell
} from 'recharts';
import { Users, TrendingUp, Award, Clock } from 'lucide-react';
import { cn } from '../utils/cn';

const skillData = [
  { name: 'React', count: 145, color: '#10b981' },
  { name: 'Node.js', count: 112, color: '#10b981' },
  { name: 'TypeScript', count: 98, color: '#10b981' },
  { name: 'Python', count: 86, color: '#10b981' },
  { name: 'AWS', count: 74, color: '#10b981' },
  { name: 'Docker', count: 52, color: '#10b981' },
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
  <div className="glass-card p-6 flex items-center justify-between border border-zinc-800/50">
    <div>
      <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <h4 className="text-3xl font-black text-zinc-100 italic tracking-tighter">{value}</h4>
        {trend && <span className="text-xs font-bold text-emerald-500">{trend}</span>}
      </div>
    </div>
    <div className={cn("p-4 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl", color)}>
      <Icon className="w-6 h-6" />
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg shadow-2xl backdrop-blur-md">
        <p className="text-xs font-bold text-zinc-300 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-lg font-black text-emerald-500 italic">{payload[0].value}</p>
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
          color="text-emerald-500"
        />
        <StatCard 
          icon={TrendingUp} 
          label="Avg. Score" 
          value="76.4" 
          trend="+5.2" 
          color="text-emerald-400"
        />
        <StatCard 
          icon={Award} 
          label="Top percentile" 
          value="82nd" 
          color="text-amber-500"
        />
        <StatCard 
          icon={Clock} 
          label="Avg. Time" 
          value="8.2s" 
          color="text-zinc-400"
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
                  tick={{ fill: '#71717a', fontSize: 12, fontWeight: 700 }}
                  width={100}
                />
                <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />
                <Bar 
                  dataKey="count" 
                  radius={[0, 10, 10, 0]} 
                  barSize={20}
                >
                  {skillData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#27272a'} />
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
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 12, fontWeight: 700 }}
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
                  stroke="#10b981" 
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

      <div className="p-8 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 shadow-2xl flex items-center justify-between group overflow-hidden relative">
        <div className="absolute inset-0 bg-black/10 transition-transform duration-700 group-hover:scale-110" />
        <div className="relative z-10">
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">Ready to surpass the benchmark?</h2>
          <p className="text-emerald-50 text-sm max-w-md font-medium opacity-90">
            Based on your aggregate history, you are in the top 18% of developers. Targeted improvements could land you in the top 5%.
          </p>
        </div>
        <button className="relative z-10 bg-white text-emerald-600 font-black px-8 py-3 rounded-xl uppercase tracking-widest text-xs shadow-xl transition-all hover:scale-105 active:scale-95">
          Get Career Roadmap
        </button>
      </div>
    </div>
  );
};
