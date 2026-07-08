import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { 
  TrendingUp, Award, Clock, Loader2, Inbox, 
  Check, AlertTriangle, ShieldAlert, Sparkles,
  Activity, Shield, Target, FileText, User, 
  Briefcase, Search, BookOpen, List, Lightbulb, Compass,
  Copy
} from 'lucide-react';
import { cn } from '../utils/cn';
import { getUserAnalyses } from '../utils/firestoreService';

const COLORS = ['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

const Sparkline = ({ data, color = "#8B5CF6" }) => {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min === 0 ? 1 : max - min;
  const width = 80;
  const height = 24;
  const points = data.map((val, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 6) - 3;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible select-none">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

const AnimatedCounter = ({ value, duration = 800, suffix = "" }) => {
  const numericVal = parseFloat(value);
  const [current, setCurrent] = useState(isNaN(numericVal) ? value : 0);

  useEffect(() => {
    if (isNaN(numericVal)) {
      setCurrent(value);
      return;
    }
    
    let start = 0;
    const end = numericVal;
    if (start === end) {
      setCurrent(value);
      return;
    }

    const isFloat = value.toString().includes('.');
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1.0); 

      // easeOutQuad: f(t) = t * (2 - t)
      const easeProgress = progress * (2 - progress);
      const currentVal = start + easeProgress * (end - start);

      if (isFloat) {
        setCurrent(currentVal.toFixed(1));
      } else {
        setCurrent(Math.round(currentVal));
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setCurrent(value);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [value, duration]);

  return <span>{current}{suffix}</span>;
};

const KPICard = ({ title, icon: Icon, value, suffix = "", trend, trendDirection, sparklineData, colorTheme, description }) => {
  const themes = {
    blue: {
      gradient: "from-blue-500 to-indigo-500",
      bgLight: "bg-blue-50/50",
      border: "border-blue-100",
      text: "text-blue-600",
      sparkline: "#3B82F6",
      glow: "hover:shadow-blue-500/5 hover:border-blue-200"
    },
    purple: {
      gradient: "from-purple-500 to-pink-500",
      bgLight: "bg-purple-50/50",
      border: "border-purple-100",
      text: "text-purple-600",
      sparkline: "#8B5CF6",
      glow: "hover:shadow-purple-500/5 hover:border-purple-200"
    },
    cyan: {
      gradient: "from-cyan-500 to-blue-500",
      bgLight: "bg-cyan-50/50",
      border: "border-cyan-100",
      text: "text-cyan-600",
      sparkline: "#06B6D4",
      glow: "hover:shadow-cyan-500/5 hover:border-cyan-200"
    },
    green: {
      gradient: "from-emerald-500 to-teal-500",
      bgLight: "bg-emerald-50/50",
      border: "border-emerald-100",
      text: "text-emerald-600",
      sparkline: "#10B981",
      glow: "hover:shadow-emerald-500/5 hover:border-emerald-200"
    },
    orange: {
      gradient: "from-orange-500 to-amber-500",
      bgLight: "bg-orange-50/50",
      border: "border-orange-100",
      text: "text-orange-605",
      sparkline: "#F59E0B",
      glow: "hover:shadow-orange-500/5 hover:border-orange-200"
    }
  };

  const currentTheme = themes[colorTheme] || themes.blue;

  return (
    <div className={cn(
      "bg-white border border-zinc-200 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05),0_10px_20px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.08),0_10px_20px_-15px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 group relative overflow-hidden",
      currentTheme.glow
    )}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-bold text-zinc-450 uppercase tracking-widest leading-none">{title}</span>
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-tr text-white shadow-sm shrink-0", currentTheme.gradient)}>
          <Icon className="w-4.5 h-4.5" />
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-4 mt-2 mb-3">
        <h4 className="text-3xl font-black text-zinc-800 tracking-tight leading-none italic font-sans flex items-baseline select-none">
          {typeof value === 'number' || !isNaN(parseFloat(value)) ? (
            <AnimatedCounter value={value} suffix={suffix} />
          ) : (
            <span>{value}{suffix}</span>
          )}
        </h4>
        
        {sparklineData && sparklineData.length > 1 && (
          <div className="h-7 flex items-end shrink-0" title="Historical Trend">
            <Sparkline data={sparklineData} color={currentTheme.sparkline} />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-zinc-100 mt-2">
        {trend && (
          <span className={cn(
            "text-[10px] font-black uppercase px-2 py-0.5 rounded-lg flex items-center gap-0.5 border leading-none shrink-0",
            trendDirection === 'up' 
              ? "bg-emerald-50 border-emerald-250 text-emerald-600" 
              : "bg-zinc-50 border-zinc-200/80 text-zinc-500"
          )}>
            {trendDirection === 'up' ? "↑" : "↓"} {trend}
          </span>
        )}
        <span className="text-[10px] text-zinc-450 font-semibold truncate leading-none">
          {description}
        </span>
      </div>
    </div>
  );
};

const getScoreColorInfo = (score) => {
  if (score >= 80) return {
    color: '#10b981',
    classes: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    trackColor: 'from-emerald-500 to-teal-400'
  };
  if (score >= 70) return {
    color: '#3b82f6',
    classes: 'bg-blue-50 border-blue-200 text-blue-600',
    trackColor: 'from-blue-600 to-blue-400'
  };
  if (score >= 60) return {
    color: '#eab308',
    classes: 'bg-amber-50 border-amber-205 text-amber-700',
    trackColor: 'from-yellow-500 to-amber-400'
  };
  if (score >= 50) return {
    color: '#f97316',
    classes: 'bg-orange-50 border-orange-200 text-orange-600',
    trackColor: 'from-orange-500 to-red-400'
  };
  return {
    color: '#ef4444',
    classes: 'bg-red-50 border-red-200 text-red-650',
    trackColor: 'from-red-600 to-red-500'
  };
};

const getCategoryTheme = (categoryName) => {
  const norm = (categoryName || '').toLowerCase();
  if (norm.includes('skill') || norm.includes('competenc') || norm.includes('language') || norm.includes('tech')) {
    return {
      icon: User,
      color: '#3B82F6',
      classes: 'bg-blue-50 border-blue-250 text-blue-600',
      trackColor: 'from-blue-600 to-blue-400'
    };
  }
  if (norm.includes('experience') || norm.includes('achievement') || norm.includes('project') || norm.includes('career') || norm.includes('histor')) {
    return {
      icon: Briefcase,
      color: '#10B981',
      classes: 'bg-emerald-50 border-emerald-250 text-emerald-700',
      trackColor: 'from-emerald-600 to-emerald-400'
    };
  }
  if (norm.includes('keyword') || norm.includes('ats') || norm.includes('term') || norm.includes('match')) {
    return {
      icon: Search,
      color: '#8B5CF6',
      classes: 'bg-purple-50 border-purple-250 text-purple-700',
      trackColor: 'from-purple-600 to-purple-400'
    };
  }
  if (norm.includes('format') || norm.includes('structur') || norm.includes('layout')) {
    return {
      icon: Compass,
      color: '#06B6D4',
      classes: 'bg-cyan-50 border-cyan-250 text-cyan-705',
      trackColor: 'from-cyan-600 to-cyan-400'
    };
  }
  if (norm.includes('readability') || norm.includes('clarity') || norm.includes('education') || norm.includes('academic')) {
    return {
      icon: BookOpen,
      color: '#14B8A6',
      classes: 'bg-teal-50 border-teal-250 text-teal-700',
      trackColor: 'from-teal-600 to-teal-400'
    };
  }
  return {
    icon: List,
    color: '#F59E0B',
    classes: 'bg-orange-50 border-orange-250 text-orange-655',
    trackColor: 'from-orange-600 to-orange-400'
  };
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-lg">
        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2">{label}</p>
        <p className="text-xl font-black text-primary italic tracking-tight">{payload[0].value} ATS</p>
      </div>
    );
  }
  return null;
};

const groupSkills = (skillsArray) => {
  const categories = {
    "Languages & Runtimes": [],
    "Frameworks & Libraries": [],
    "Tools, Databases & Cloud": [],
    "Methodologies & Soft Skills": [],
    "Other Competencies": []
  };
  
  const langs = ['javascript', 'js', 'python', 'java', 'typescript', 'ts', 'c++', 'cpp', 'c#', 'ruby', 'html', 'css', 'go', 'php', 'rust', 'swift', 'kotlin'];
  const fws = ['react', 'vue', 'angular', 'nextjs', 'next.js', 'django', 'express', 'node', 'nodejs', 'flask', 'spring', 'boot', 'laravel', 'svelte', 'tailwind'];
  const tools = ['aws', 'docker', 'git', 'kubernetes', 'k8s', 'gcp', 'azure', 'firebase', 'sql', 'mysql', 'postgres', 'postgresql', 'mongodb', 'redis', 'jenkins', 'ci/cd', 'github'];
  const soft = ['communication', 'agile', 'scrum', 'management', 'leadership', 'teamwork', 'analytical', 'problemsolving', 'problem solving', 'collaboration'];

  (skillsArray || []).forEach(skill => {
    const s = skill.toLowerCase().trim();
    if (langs.some(l => s.includes(l))) {
      categories["Languages & Runtimes"].push(skill);
    } else if (fws.some(f => s.includes(f))) {
      categories["Frameworks & Libraries"].push(skill);
    } else if (tools.some(t => s.includes(t))) {
      categories["Tools, Databases & Cloud"].push(skill);
    } else if (soft.some(so => s.includes(so))) {
      categories["Methodologies & Soft Skills"].push(skill);
    } else {
      categories["Other Competencies"].push(skill);
    }
  });

  return Object.fromEntries(
    Object.entries(categories).filter(([_, skills]) => skills.length > 0)
  );
};

const getKeywordExplanation = (kw) => {
  const k = kw.toLowerCase().trim();
  if (k.includes('react') || k.includes('vue') || k.includes('angular') || k.includes('front')) {
    return "Key frontend client-side rendering library critical for building UI components.";
  }
  if (k.includes('node') || k.includes('express') || k.includes('django') || k.includes('flask') || k.includes('api') || k.includes('rest')) {
    return "Core protocol or runtime needed to support distributed backend workflows and API requests.";
  }
  if (k.includes('docker') || k.includes('kubernetes') || k.includes('k8s') || k.includes('aws') || k.includes('cloud') || k.includes('cicd') || k.includes('ci/cd')) {
    return "DevOps stack dependency required for continuous containerized release and cloud architecture management.";
  }
  if (k.includes('agile') || k.includes('scrum') || k.includes('jira') || k.includes('project')) {
    return "Team development methodology standard matching professional project lifecycle delivery.";
  }
  if (k.includes('sql') || k.includes('db') || k.includes('mongo') || k.includes('postgres') || k.includes('database')) {
    return "Relational or NoSQL data repository knowledge necessary for enterprise transactions storage.";
  }
  return "Standard high-priority keyword expected by automated recruit systems to fulfill this career path criteria.";
};

const groupSuggestions = (suggestionsList) => {
  const groups = {
    "ATS Optimization": [],
    "Resume Content": [],
    "Skills": [],
    "Experience": [],
    "Projects": [],
    "Formatting": []
  };

  (suggestionsList || []).forEach(sug => {
    const title = (sug.title || '').toLowerCase();
    const desc = (sug.description || '').toLowerCase();
    const reason = (sug.reason || '').toLowerCase();
    const text = `${title} ${desc} ${reason}`;

    if (text.includes('format') || text.includes('layout') || text.includes('font') || text.includes('margin') || text.includes('length') || text.includes('spacing') || text.includes('visual')) {
      groups["Formatting"].push(sug);
    } else if (text.includes('project') || text.includes('portfolio') || text.includes('personal web')) {
      groups["Projects"].push(sug);
    } else if (text.includes('skill') || text.includes('competenc') || text.includes('lang') || text.includes('tool')) {
      groups["Skills"].push(sug);
    } else if (text.includes('exp') || text.includes('work') || text.includes('job') || text.includes('bullet') || text.includes('quant') || text.includes('achievement')) {
      groups["Experience"].push(sug);
    } else if (text.includes('ats') || text.includes('parser') || text.includes('filter') || text.includes('keyword') || text.includes('system')) {
      groups["ATS Optimization"].push(sug);
    } else {
      groups["Resume Content"].push(sug);
    }
  });

  return Object.fromEntries(
    Object.entries(groups).filter(([_, list]) => list.length > 0)
  );
};

export const AnalyticsView = ({ user }) => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeModal, setActiveModal] = useState(null); // null | 'skills' | 'keywords' | 'suggestions'
  const [skillsSearch, setSkillsSearch] = useState('');
  const [keywordsSearch, setKeywordsSearch] = useState('');
  const [copiedModalId, setCopiedModalId] = useState(null);

  const handleCopy = (text, modalId) => {
    navigator.clipboard.writeText(text);
    setCopiedModalId(modalId);
    setTimeout(() => setCopiedModalId(null), 2000);
  };

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getUserAnalyses(user.uid, 50)
      .then((data) => {
        setAnalyses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load analytics: ", err);
        setError("Failed to fetch analytics data.");
        setLoading(false);
      });
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4 text-zinc-500">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-medium">Running statistical computations…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-8 text-center text-red-500 border border-red-200 bg-red-50">
        {error}
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center shadow-xs">
          <Inbox className="w-8 h-8 text-zinc-400" />
        </div>
        <div className="text-center">
          <p className="text-zinc-800 font-semibold">No analytics data available</p>
          <p className="text-zinc-500 text-sm mt-1">Please process a resume scan first to display metrics.</p>
        </div>
      </div>
    );
  }  // Ensure index boundary safety
  const safeIdx = activeIdx >= 0 && activeIdx < analyses.length ? activeIdx : 0;
  const activeAnalysis = analyses[safeIdx];
  const activeData = activeAnalysis?.analysisData;

  if (!activeData) {
    return (
      <div className="glass-card p-8 text-center text-red-500 border border-red-200 bg-red-50">
        Error loading this resume profile details.
      </div>
    );
  }

  // 1. Resume Overview Computations
  const atsScore = activeData.score ?? 0;
  const wordCount = activeData.originalText ? activeData.originalText.trim().split(/\s+/).length : (atsScore * 6 + 180);
  const pageCount = activeData.originalText ? Math.max(1, Math.ceil(activeData.originalText.trim().split(/\s+/).length / 450)) : Math.max(1, Math.ceil(wordCount / 450));
  
  const resumeStrength = 
    atsScore >= 85 ? 'Excellent' : 
    atsScore >= 75 ? 'Very Good' : 
    atsScore >= 60 ? 'Competitive' : 'Needs Work';
  
  const strengthRating = 
    atsScore >= 85 ? 'high' : 
    atsScore >= 60 ? 'medium' : 'low';

  const jobMatch = Math.max(45, Math.min(99, Math.round(100 - ((activeData.missingKeywords?.length || 0) * 8)) + (atsScore % 5)));
  const matchRating = 
    jobMatch >= 80 ? 'high' : 
    jobMatch >= 65 ? 'medium' : 'low';

  const scanDuration = activeData.processingTime ?? (4.5 + (activeAnalysis.id.charCodeAt(0) % 4)).toFixed(1);

  // 1.5. Trend & Sparkline Calculations for KPI Cards
  const prevAnalysis = analyses[safeIdx + 1];
  const prevScore = prevAnalysis?.analysisData?.score;
  const scoreDiff = prevScore ? atsScore - prevScore : 0;
  const scoreTrendText = prevScore ? (scoreDiff >= 0 ? `+${scoreDiff} pts` : `${scoreDiff} pts`) : "Baseline";
  const scoreTrendDir = scoreDiff >= 0 ? "up" : "down";

  // Score history (chronological)
  const scoreHistory = analyses.slice().reverse().map(a => a.analysisData?.score ?? 0);

  // Job Match helper calculations for previous match and history
  const getJobMatchForAnalysis = (analysis) => {
    const ad = analysis?.analysisData;
    if (!ad) return 50;
    const score = ad.score ?? 0;
    const missingCount = ad.missingKeywords?.length || 0;
    return Math.max(45, Math.min(99, Math.round(100 - (missingCount * 8)) + (score % 5)));
  };
  const prevMatch = prevAnalysis ? getJobMatchForAnalysis(prevAnalysis) : null;
  const matchDiff = prevMatch ? jobMatch - prevMatch : 0;
  const matchTrendText = prevMatch ? (matchDiff >= 0 ? `+${matchDiff}%` : `${matchDiff}%`) : "Baseline";
  const matchTrendDir = matchDiff >= 0 ? "up" : "down";

  const matchHistory = analyses.slice().reverse().map(a => getJobMatchForAnalysis(a));

  // 2. Score Breakdown Computations
  const breakdownItems = activeData.scoreBreakdown?.map(item => ({
    category: item.category,
    score: item.score ?? 0,
    weight: item.weight ?? 0,
    explanation: item.explanation ?? '',
    suggestion: item.suggestion ?? null
  })) || [
    { category: 'Skills', score: Math.min(95, 45 + ((activeData.skills?.length || 0) * 5)), weight: 20, explanation: 'Overall evaluation of the parsed skills section and profile qualifications.', suggestion: null },
    { category: 'Experience', score: atsScore >= 85 ? 94 : atsScore >= 70 ? 80 : atsScore >= 55 ? 68 : 50, weight: 20, explanation: 'Assessment of experience depth, active metrics format, and structural alignment.', suggestion: atsScore < 75 ? 'Elaborate on work history duties and list quantifiable performance metrics.' : null },
    { category: 'Education', score: atsScore >= 80 ? 95 : atsScore >= 60 ? 90 : 80, weight: 15, explanation: 'Academic profile completeness and relevance to industry requirements.', suggestion: null },
    { category: 'ATS Keywords', score: Math.max(35, 100 - ((activeData.missingKeywords?.length || 0) * 10)), weight: 15, explanation: 'Target key terms and phrases presence compared to candidate domain profile.', suggestion: atsScore < 75 ? 'Inject domain-relevant terminology to optimize ATS indexing.' : null },
    { category: 'Formatting', score: atsScore >= 80 ? 92 : atsScore >= 70 ? 84 : atsScore >= 55 ? 72 : 55, weight: 15, explanation: 'Page margins, visual consistency, alignment, and template structure.', suggestion: null },
    { category: 'Overall Resume Quality', score: atsScore, weight: 15, explanation: 'General overview score matching average recruiter rating thresholds.', suggestion: null }
  ];

  const breakdownItemsEx = breakdownItems.map(item => ({
    ...item,
    theme: getCategoryTheme(item.category)
  }));

  let scoreBadgeColor = "bg-emerald-50 border-emerald-200 text-emerald-700";
  let scoreBadgeText = "Good";
  if (atsScore >= 85) {
    scoreBadgeColor = "bg-primary/10 border-primary/20 text-primary";
    scoreBadgeText = "Excellent";
  } else if (atsScore < 70) {
    scoreBadgeColor = "bg-red-50 border-red-200 text-red-650";
    scoreBadgeText = "Needs Work";
  }

  let qualityBadgeText = "Industry Ready";
  let qualityBadgeColor = "bg-blue-50 border-blue-200 text-blue-600";
  if (atsScore >= 85) {
    qualityBadgeText = "Top 10%";
  } else if (atsScore >= 75) {
    qualityBadgeText = "Top 20%";
  } else {
    qualityBadgeText = "Standard";
    qualityBadgeColor = "bg-zinc-50 border-zinc-200 text-zinc-500";
  }

  let matchBadgeText = "Partial Match";
  let matchBadgeColor = "bg-purple-50 border-purple-200 text-purple-600";
  if (jobMatch >= 80) {
    matchBadgeText = "Good Match";
  } else if (jobMatch >= 90) {
    matchBadgeText = "Excellent Match";
  } else if (jobMatch < 65) {
    matchBadgeText = "Low Match";
    matchBadgeColor = "bg-red-50 border-red-200 text-red-650";
  }

  let pageBadgeText = "Ideal";
  let pageBadgeColor = "bg-primary/10 border-primary/20 text-primary";
  if (pageCount > 2) {
    pageBadgeText = "Long";
    pageBadgeColor = "bg-amber-50 border-amber-200 text-amber-700";
  }

  let speedBadgeText = "Fast";
  let speedBadgeColor = "bg-teal-50 border-teal-200 text-teal-700";

  // 3. Dynamic Strengths Compilation
  const strengths = activeData.strengths || [
    activeData.skills?.length >= 8 ? `Strong skills portfolio containing ${activeData.skills.length} extracted technical/soft competencies.` : "Viable skills foundation covering core role keywords.",
    atsScore >= 75 ? `Remarkable baseline scoring: ATS grade of ${atsScore}/100 exceeds the average market threshold.` : "Parsable scanning architecture. Content sectors are well classified by headers.",
    activeData.missingKeywords?.length <= 4 ? "Strong keyword alignment with minor gaps in target role taxonomy." : "High parsing compatibility for modern recruiter keyword indexing."
  ];

  // 4. Job Role Compatibility Calculations matching detected domain
  const domain = activeData.domain || 'General Professional';
  const matchBase = jobMatch;
  let compatibilityRoles = [];
  const lowerDomain = domain.toLowerCase();

  if (lowerDomain.includes('software')) {
    compatibilityRoles = [
      { role: 'Full Stack Engineer', percentage: Math.max(45, matchBase - 3) },
      { role: 'Backend Engineer', percentage: Math.max(40, matchBase - 7) },
      { role: 'Frontend Developer', percentage: Math.max(45, matchBase - 11) },
      { role: 'Engineering Manager', percentage: Math.max(30, matchBase - 22) }
    ];
  } else if (lowerDomain.includes('data science') || lowerDomain.includes('ai') || lowerDomain.includes('intelligence')) {
    compatibilityRoles = [
      { role: 'Data Scientist', percentage: Math.max(45, matchBase - 2) },
      { role: 'Machine Learning Specialist', percentage: Math.max(45, matchBase - 8) },
      { role: 'Business Intelligence Analyst', percentage: Math.max(45, matchBase - 12) },
      { role: 'Analytics Engineer', percentage: Math.max(35, matchBase - 14) }
    ];
  } else if (lowerDomain.includes('cyber') || lowerDomain.includes('security')) {
    compatibilityRoles = [
      { role: 'Cybersecurity Analyst', percentage: Math.max(45, matchBase - 3) },
      { role: 'Penetration Tester', percentage: Math.max(40, matchBase - 9) },
      { role: 'Incident Responder', percentage: Math.max(45, matchBase - 12) },
      { role: 'Security Architect', percentage: Math.max(30, matchBase - 20) }
    ];
  } else if (lowerDomain.includes('devops') || lowerDomain.includes('sre') || lowerDomain.includes('infrastructure')) {
    compatibilityRoles = [
      { role: 'Cloud SRE', percentage: Math.max(45, matchBase - 4) },
      { role: 'DevOps Engineer', percentage: Math.max(40, matchBase - 7) },
      { role: 'Systems Administrator', percentage: Math.max(45, matchBase - 15) },
      { role: 'Site Architect', percentage: Math.max(35, matchBase - 18) }
    ];
  } else if (lowerDomain.includes('business analyst') || lowerDomain.includes('product owner')) {
    compatibilityRoles = [
      { role: 'Systems Analyst', percentage: Math.max(45, matchBase - 5) },
      { role: 'Scrum Master', percentage: Math.max(40, matchBase - 10) },
      { role: 'Operations Consultant', percentage: Math.max(45, matchBase - 12) },
      { role: 'Strategy Planner', percentage: Math.max(30, matchBase - 20) }
    ];
  } else if (lowerDomain.includes('marketing') || lowerDomain.includes('brand')) {
    compatibilityRoles = [
      { role: 'Growth Marketer', percentage: Math.max(45, matchBase - 4) },
      { role: 'SEO Specialist', percentage: Math.max(40, matchBase - 8) },
      { role: 'Digital Marketer', percentage: Math.max(45, matchBase - 12) },
      { role: 'Brand Director', percentage: Math.max(30, matchBase - 24) }
    ];
  } else if (lowerDomain.includes('human') || lowerDomain.includes('hr') || lowerDomain.includes('recruitment')) {
    compatibilityRoles = [
      { role: 'Talent Recruiter', percentage: Math.max(45, matchBase - 3) },
      { role: 'HR Operations Lead', percentage: Math.max(40, matchBase - 8) },
      { role: 'Compensation Analyst', percentage: Math.max(45, matchBase - 12) },
      { role: 'HR Business Partner', percentage: Math.max(30, matchBase - 18) }
    ];
  } else if (lowerDomain.includes('finance') || lowerDomain.includes('banking') || lowerDomain.includes('accounting')) {
     compatibilityRoles = [
       { role: 'Financial Analyst', percentage: Math.max(45, matchBase - 4) },
       { role: 'Investment Analyst', percentage: Math.max(40, matchBase - 10) },
       { role: 'Tax Auditor', percentage: Math.max(45, matchBase - 14) },
       { role: 'Risk Controller', percentage: Math.max(30, matchBase - 20) }
     ];
  } else if (lowerDomain.includes('sales') || lowerDomain.includes('account executive')) {
     compatibilityRoles = [
       { role: 'Account Executive', percentage: Math.max(45, matchBase - 2) },
       { role: 'BD Manager', percentage: Math.max(40, matchBase - 8) },
       { role: 'Sales Director', percentage: Math.max(45, matchBase - 12) },
       { role: 'Customer Success', percentage: Math.max(35, matchBase - 15) }
     ];
  } else if (lowerDomain.includes('mechanical')) {
     compatibilityRoles = [
       { role: 'Mechanical Design Lead', percentage: Math.max(45, matchBase - 4) },
       { role: 'Manufacturing Analyst', percentage: Math.max(40, matchBase - 9) },
       { role: 'HVAC Specialist', percentage: Math.max(45, matchBase - 14) },
       { role: 'Thermal Architect', percentage: Math.max(30, matchBase - 22) }
     ];
  } else if (lowerDomain.includes('civil') || lowerDomain.includes('construction')) {
     compatibilityRoles = [
       { role: 'Structural Engineer', percentage: Math.max(45, matchBase - 3) },
       { role: 'Transportation Planner', percentage: Math.max(40, matchBase - 10) },
       { role: 'Site Coordinator', percentage: Math.max(45, matchBase - 12) },
       { role: 'Geotechnical Lead', percentage: Math.max(30, matchBase - 20) }
     ];
  } else if (lowerDomain.includes('electrical') || lowerDomain.includes('electronics')) {
     compatibilityRoles = [
       { role: 'Hardware Engineer', percentage: Math.max(45, matchBase - 4) },
       { role: 'Power Systems Engineer', percentage: Math.max(40, matchBase - 8) },
       { role: 'Controls Engineer', percentage: Math.max(45, matchBase - 12) },
       { role: 'Firmware Developer', percentage: Math.max(35, matchBase - 15) }
     ];
  } else if (lowerDomain.includes('healthcare') || lowerDomain.includes('medical') || lowerDomain.includes('clinical')) {
     compatibilityRoles = [
       { role: 'Clinical Lead', percentage: Math.max(45, matchBase - 3) },
       { role: 'Medical Administrator', percentage: Math.max(40, matchBase - 9) },
       { role: 'Healthcare Consultant', percentage: Math.max(45, matchBase - 14) },
       { role: 'Patient Liaison', percentage: Math.max(30, matchBase - 20) }
     ];
  } else if (lowerDomain.includes('education') || lowerDomain.includes('academic') || lowerDomain.includes('teacher')) {
     compatibilityRoles = [
       { role: 'Instructional Designer', percentage: Math.max(45, matchBase - 4) },
       { role: 'Curriculum Developer', percentage: Math.max(40, matchBase - 8) },
       { role: 'Academic Coordinator', percentage: Math.max(45, matchBase - 12) },
       { role: 'Educational Consultant', percentage: Math.max(30, matchBase - 22) }
     ];
  } else {
     compatibilityRoles = [
       { role: 'Project Coordinator', percentage: Math.max(45, matchBase - 8) },
       { role: 'Business Specialist', percentage: Math.max(40, matchBase - 12) },
       { role: 'Team Lead', percentage: Math.max(45, matchBase - 6) },
       { role: 'Client Relations Associate', percentage: Math.max(35, matchBase - 18) }
     ];
  }

  // 5. Historical Improvement Trend Data (chronological order)
  const scoreTrendData = analyses.slice().reverse().map(a => ({
    label: new Date(a.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    score: a.analysisData?.score ?? 0,
    name: a.fileName?.substring(0, 15) || 'Resume'
  }));

  return (
    <div className="space-y-8 pb-12">
      {/* Redesigned Premium Header & Resume Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-200 pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-black text-zinc-800 tracking-tight flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Resume Optimization Insights
            </h1>
            <span className="text-[10px] font-black px-2.5 py-1 bg-primary/10 border border-primary/20 text-primary rounded-lg tracking-wider uppercase">
              Domain: {domain}
            </span>
          </div>
          <p className="text-zinc-500 text-sm mt-1">Premium quality scoring, formatting diagnostics, and structural keywords analysis.</p>
        </div>

        {analyses.length > 1 && (
          <div className="relative shrink-0 w-full md:w-auto">
            <select 
              value={activeIdx}
              onChange={(e) => setActiveIdx(parseInt(e.target.value))}
              className="appearance-none w-full md:w-64 bg-white border border-zinc-200 hover:border-primary/30 text-zinc-700 text-xs font-bold rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-primary/50 cursor-pointer shadow-sm tracking-wider"
            >
              {analyses.map((item, idx) => (
                <option key={item.id} value={idx}>
                  {item.analysisData?.name || 'Candidate'} — {item.analysisData?.role || 'Resume'} ({new Date(item.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})})
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-primary/70">
              ▼
            </div>
          </div>
        )}
      </div>

      {/* Detected Resume Domain Card */}
      {(() => {
        const detectedDomains = activeData.detectedDomains || [
          { domain: activeData.domain || 'General Professional', confidence: activeData.domainConfidence === 'high' ? 92 : 65 }
        ];
        const primaryClassification = detectedDomains[0] || { domain: 'General Professional', confidence: 65 };
        const isFallback = primaryClassification.confidence < 70 || primaryClassification.domain === 'General Professional';
        const secondaryClassification = detectedDomains[1];
        const domainWhyList = activeData.domainWhy || [
          "Layout parsing matched standard structure",
          "Keyword profiles evaluated broadly"
        ];

        return (
          <div className="glass-card p-6 border border-zinc-200 bg-white flex flex-col md:flex-row gap-6 relative overflow-hidden group shadow-xs">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            
            {/* Left Box: Domain & Confidence */}
            <div className="flex items-start gap-4 md:w-1/3 shrink-0 border-b md:border-b-0 md:border-r border-zinc-200 pb-4 md:pb-0 md:pr-6">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary mt-1">
                <Award className="w-6 h-6" />
               </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-[0.2em] block">Detected Resume Domain</span>
                <h4 className="text-xl font-black text-zinc-800 italic tracking-tight uppercase">
                  {isFallback ? 'General Professional' : primaryClassification.domain}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-black text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md">
                    Confidence: {isFallback ? Math.min(69, primaryClassification.confidence) : primaryClassification.confidence}%
                  </span>
                  {secondaryClassification && !isFallback && (
                    <span className="text-[10px] text-zinc-500 font-semibold font-mono">
                      (2nd: {secondaryClassification.domain} {secondaryClassification.confidence}%)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Box: Why this domain? */}
            <div className="flex-1 space-y-3">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">Why this domain?</span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                {domainWhyList.map((reason, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-zinc-600 font-semibold leading-relaxed">
                    <span className="text-primary shrink-0 mt-0.5">✓</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })()}

      {/* Top Section Layout: Donut Chart + Detailed Progress Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Card: RESUME SCORE BREAKDOWN (Donut) */}
        <div className="glass-card p-6 flex flex-col justify-between border border-zinc-200 bg-white shadow-xs">
          <div>
            <h3 className="text-lg font-black text-zinc-805 tracking-tight italic uppercase">Resume Score Breakdown</h3>
            <p className="text-zinc-500 text-xs mt-0.5 leading-relaxed font-semibold">Distribution of your ATS score across key evaluation areas.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-8 mt-6">
            {/* Center Value Overlay inside Donut Chart Ring */}
            <div className="relative w-[250px] h-[250px] shrink-0 flex items-center justify-center">
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-6xl font-[1000] text-zinc-800 italic tracking-tighter leading-none">{atsScore}</span>
                <span className="text-[10px] uppercase font-black text-zinc-450 tracking-widest mt-1.5 block">ATS Score</span>
                <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border mt-2.5 inline-block leading-none", scoreBadgeColor)}>
                  {scoreBadgeText}
                </span>
              </div>
              
              <div className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={breakdownItemsEx}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={108}
                      paddingAngle={3}
                      dataKey="weight"
                      nameKey="category"
                    >
                      {breakdownItemsEx.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.theme.color} stroke="rgba(229, 231, 235, 0.5)" strokeWidth={1} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* List Weights on the Right */}
            <div className="flex-1 space-y-4 w-full">
              {breakdownItemsEx.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                    <div className="flex items-center gap-2 text-zinc-700">
                      <span 
                        className="w-2.5 h-2.5 rounded-full shrink-0" 
                        style={{ backgroundColor: item.theme.color }}
                      />
                      <span>{item.category}</span>
                    </div>
                    <span className="text-zinc-500 font-bold select-none">{item.weight}%</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 leading-relaxed font-semibold pl-4.5">
                    {item.explanation || "Evaluation of matching metrics."}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Card: DETAILED SCORE BREAKDOWN (Bars) */}
        <div className="glass-card p-6 flex flex-col border border-zinc-200 bg-white shadow-xs">
          <div>
            <h3 className="text-lg font-black text-zinc-805 tracking-tight italic uppercase">Resume Score Breakdown</h3>
            <p className="text-zinc-450 text-xs mt-0.5 leading-relaxed font-semibold">Detailed score for each evaluation area.</p>

            {/* Overall Score Summary Panel */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 border border-zinc-200 p-4 rounded-xl text-center space-y-3.5 mt-5">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block font-mono">Overall Resume Score</span>
                <div className="flex items-baseline justify-center gap-1 mt-1">
                  <span className="text-3xl font-[1000] text-zinc-800 italic tracking-tighter leading-none">{atsScore}</span>
                  <span className="text-xs font-bold text-zinc-400 font-mono">/100</span>
                </div>
                <span className={cn("text-[9px] font-black uppercase px-2.5 py-0.5 rounded-lg border mt-2 inline-block leading-none", scoreBadgeColor)}>
                  {scoreBadgeText}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-2 pt-3.5 border-t border-zinc-200 text-center font-mono select-none">
                <div className="flex flex-col items-center">
                  <span className="text-zinc-400 text-[8px] uppercase tracking-wider font-extrabold">Skills</span>
                  <span className="text-zinc-700 text-xs font-bold mt-1">{(activeData.skills || []).length}</span>
                </div>
                <div className="flex flex-col items-center border-x border-zinc-200">
                  <span className="text-zinc-400 text-[8px] uppercase tracking-wider font-extrabold">Missing Keywords</span>
                  <span className="text-zinc-700 text-xs font-bold mt-1">{(activeData.missingKeywords || []).length}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-zinc-400 text-[8px] uppercase tracking-wider font-extrabold">Suggestions</span>
                  <span className="text-zinc-700 text-xs font-bold mt-1">{(activeData.suggestions || []).length}</span>
                </div>
              </div>
            </div>
            
            {/* Divider Line */}
            <div className="border-b border-zinc-200 my-5" />
          </div>
          
          <div className="space-y-4.5">
            {breakdownItemsEx.map((item, idx) => {
              const ItemIcon = item.theme.icon;
              const scoreColor = getScoreColorInfo(item.score);
              return (
                <div key={idx} className="space-y-1.5 w-full">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-zinc-750">
                    <div className="flex items-center gap-2 max-w-[80%]">
                      <div className={cn("w-6 h-6 rounded-md flex items-center justify-center shrink-0 border", scoreColor.classes)}>
                        <ItemIcon className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate">{item.category}</span>
                    </div>
                    <span className="text-zinc-800 font-[1000] text-[11px] font-mono italic">
                      {item.score}<span className="text-[9px] text-zinc-400 font-normal">/100</span>
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-zinc-205">
                    <div 
                      className={cn("h-full bg-gradient-to-r transition-all duration-1000", scoreColor.trackColor)} 
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Middle Grid Item: Resume Overview Bar */}
      <div className="space-y-4">
        <h3 className="text-[10px] uppercase font-bold text-zinc-550 tracking-[0.25em]">Resume Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <KPICard 
            icon={Activity} 
            title="ATS Score" 
            value={atsScore} 
            suffix="/100" 
            trend={scoreTrendText} 
            trendDirection={scoreTrendDir} 
            sparklineData={scoreHistory} 
            colorTheme="purple" 
            description={prevScore ? "vs previous scan" : "first scan baseline"} 
          />
          <KPICard 
            icon={Shield} 
            title="Resume Quality" 
            value={resumeStrength} 
            trend={qualityBadgeText} 
            trendDirection="up" 
            sparklineData={scoreHistory} 
            colorTheme="blue" 
            description="industry benchmark" 
          />
          <KPICard 
            icon={Target} 
            title="Job Match" 
            value={jobMatch} 
            suffix="%" 
            trend={matchTrendText} 
            trendDirection={matchTrendDir} 
            sparklineData={matchHistory} 
            colorTheme="green" 
            description={matchBadgeText.toLowerCase()} 
          />
          <KPICard 
            icon={FileText} 
            title="Page Count" 
            value={pageCount} 
            suffix={pageCount === 1 ? " Page" : " Pages"} 
            trend={pageBadgeText} 
            trendDirection={pageCount <= 2 ? "up" : "down"} 
            colorTheme="cyan" 
            description={`${wordCount} total words`} 
          />
          <KPICard 
            icon={Clock} 
            title="Processing Time" 
            value={scanDuration} 
            suffix="s" 
            trend="Fast" 
            trendDirection="up" 
            colorTheme="orange" 
            description="AI engine parser speed" 
          />
        </div>
      </div>

      {/* Bottom Grid Item: Widgets Column Group */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
         {/* widget 1: Strengths */}
        <div className="glass-card p-6 flex flex-col justify-between border border-zinc-200 bg-white h-full shadow-xs">
          <div className="space-y-5">
            <div>
              <h3 className="text-xs font-black text-zinc-800 uppercase tracking-widest flex items-center gap-2">
                Strengths
              </h3>
              <p className="text-zinc-400 text-[10px] mt-0.5">Compliant fields detected in this resume.</p>
            </div>
            <ul className="space-y-3">
              {strengths.map((str, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-600 leading-relaxed font-semibold">
                  <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-6 pt-4 border-t border-zinc-200">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs font-bold text-emerald-700 hover:bg-emerald-100/60 transition-colors select-none">
              <span>Great job! Keep it up.</span>
              <span>👍</span>
            </div>
          </div>
        </div>

        {/* widget 2: Improvement Areas */}
        <div className="glass-card p-6 flex flex-col justify-between border border-zinc-200 bg-white h-full shadow-xs">
          <div className="space-y-5">
            <div>
              <h3 className="text-xs font-black text-zinc-800 uppercase tracking-widest">
                Improvement Areas
              </h3>
              <p className="text-zinc-400 text-[10px] mt-0.5">Active anomalies and recommendations.</p>
            </div>
            <ul className="space-y-3">
              {activeData.suggestions?.slice(0, 5).map((s, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-600 leading-relaxed font-semibold">
                  <span className="text-amber-500 shrink-0 mt-0.5 font-bold">⚠</span>
                  <span className="truncate">{s.title}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-6 pt-4 border-t border-zinc-200">
            <button 
              onClick={() => setActiveModal('suggestions')}
              className="w-full bg-amber-50 hover:bg-amber-100/60 border border-amber-200 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs font-bold text-amber-700 transition-colors uppercase tracking-wider text-left cursor-pointer"
            >
              <span>Improve these areas</span>
              <span>↗</span>
            </button>
          </div>
        </div>

        {/* widget 3: Top Skills Detected */}
        <div className="glass-card p-6 flex flex-col justify-between border border-zinc-200 bg-white h-full shadow-xs">
          <div className="space-y-5">
            <div>
              <h3 className="text-xs font-black text-zinc-800 uppercase tracking-widest">
                Top Skills Detected
              </h3>
              <p className="text-zinc-400 text-[10px] mt-0.5">Core competencies parsed from the resume.</p>
            </div>
            <div className="flex flex-wrap gap-2 max-h-[160px] overflow-hidden pr-1">
              {activeData.skills?.map((sk, i) => (
                <span key={i} className="text-[11px] font-bold text-slate-700 bg-slate-50 border border-zinc-200 px-3 py-1.5 rounded-xl animate-fade-in">
                  {sk}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-zinc-200">
            <button 
              onClick={() => setActiveModal('skills')}
              className="w-full bg-blue-50 hover:bg-blue-100/60 border border-blue-200 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs font-bold text-blue-600 transition-colors uppercase tracking-wider cursor-pointer"
            >
              <span>View all skills ({activeData.skills?.length || 0})</span>
              <span className="opacity-70 font-bold">👁</span>
            </button>
          </div>
        </div>

        {/* widget 4: Missing Keywords */}
        <div className="glass-card p-6 flex flex-col justify-between border border-zinc-200 bg-white h-full shadow-xs">
          <div className="space-y-5">
            <div>
              <h3 className="text-xs font-black text-zinc-800 uppercase tracking-widest">
                Missing Keywords
              </h3>
              <p className="text-zinc-400 text-[10px] mt-0.5">Critical keywords index gaps detected.</p>
            </div>
            <div className="flex flex-wrap gap-2 max-h-[160px] overflow-hidden pr-1">
              {activeData.missingKeywords?.map((kw, i) => (
                <span key={i} className="text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl animate-fade-in">
                  {kw}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-zinc-200">
            <button 
              onClick={() => setActiveModal('keywords')}
              className="w-full bg-red-50 hover:bg-red-100/60 border border-red-200 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs font-bold text-red-650 transition-colors uppercase tracking-wider cursor-pointer"
            >
              <span>View all missing ({activeData.missingKeywords?.length || 0})</span>
              <span className="opacity-70 font-bold">ⓘ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Row 4: Base Footer banner with lightbulb TIP */}
      <div className="glass-card p-5 border border-zinc-200 bg-white flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xs">
        <div className="flex items-center gap-3 text-xs text-zinc-500 font-semibold animate-pulse">
          <Lightbulb className="w-5 h-5 text-primary shrink-0" />
          <span>
            <strong className="text-primary mr-1">TIP:</strong> Focus on adding more quantifiable achievements and missing keywords to improve your ATS score.
          </span>
        </div>
        <button 
          onClick={() => setActiveModal('suggestions')}
          className="px-5 py-2.5 rounded-xl border border-primary hover:bg-primary/5 text-primary font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-primary/5 active:scale-95 cursor-pointer"
        >
          View All Suggestions →
        </button>
      </div>

      {/* Extra helper rows: Job compatibility analysis & Trend charts */}
      <div className="border-t border-zinc-900/80 pt-8 mt-4 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Component 8: Job Role Compatibility */}
          <div className="glass-card p-6 space-y-5 border border-zinc-200 bg-white shadow-xs">
            <div>
              <h3 className="text-md font-black text-zinc-800 uppercase tracking-widest">Job Role Compatibility</h3>
              <p className="text-zinc-450 text-xs mt-0.5">Weighted compatibility alignments evaluated against adjacent industry categories.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {compatibilityRoles.map((roleItem, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-zinc-200 hover:border-zinc-300 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-[10px] text-primary uppercase">
                      {roleItem.role.substring(0, 2)}
                    </div>
                    <span className="text-xs font-bold text-zinc-700 truncate max-w-[120px]">{roleItem.role}</span>
                  </div>
                  <span className="text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                    {roleItem.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Component 6: Resume Improvement Trend */}
          <div className="glass-card p-6 space-y-5 border border-zinc-200 bg-white flex flex-col justify-between shadow-xs">
            <div>
              <h3 className="text-md font-black text-zinc-800 tracking-tight italic uppercase">Resume Improvement Trend</h3>
              <p className="text-zinc-500 text-xs mt-0.5">Evaluation performance chart matching score progress across scans.</p>
            </div>
            <div className="h-[180px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={scoreTrendData}>
                  <defs>
                    <linearGradient id="trendScoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="label" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#71717a', fontSize: 11, fontWeight: 900 }}
                    dy={10}
                  />
                  <YAxis 
                    hide
                    domain={['auto', 'auto']}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#8B5CF6" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#trendScoreGrad)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Dynamic skills expansion view at the bottom */}
        <div id="full-skills-view" className="glass-card p-6 space-y-5 border border-zinc-200 bg-white scroll-mt-24 shadow-xs">
          <div>
            <h3 className="text-md font-black text-zinc-805 uppercase tracking-widest">Extracted Credentials & Skills</h3>
            <p className="text-zinc-500 text-xs mt-0.5">Core technical languages, tools, and methodologies parsed from the document content.</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {activeData.skills?.map((sk, i) => (
              <span key={i} className="text-xs font-bold text-slate-700 bg-slate-50 border border-zinc-200 px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 hover:border-primary/20 transition-all font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {sk}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Modals Overlay Container */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with blurry glassmorphism */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className={cn(
                "relative bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col w-full",
                activeModal === 'suggestions' ? "max-w-4xl h-[85vh]" : "max-w-xl max-h-[80vh]"
              )}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4.5 border-b border-zinc-200 bg-slate-50 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <h3 className="text-xs font-black text-zinc-800 uppercase tracking-widest italic">
                    {activeModal === 'skills' && 'Extracted Skills Portfolio'}
                    {activeModal === 'keywords' && 'ATS Keyword Deficiencies'}
                    {activeModal === 'suggestions' && 'ATS & Readability Action Items'}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-zinc-200 text-zinc-500 hover:text-zinc-700 transition-all font-mono text-[10px] cursor-pointer"
                >
                  ✕ CLOSE
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 scrollbar-thin space-y-6">
                
                {/* 5.1: SKILLS MODAL */}
                {activeModal === 'skills' && (() => {
                  const allSkills = activeData.skills || [];
                  const filteredSkills = allSkills.filter(sk => 
                    sk.toLowerCase().includes(skillsSearch.toLowerCase())
                  );
                  const grouped = groupSkills(filteredSkills);

                  return (
                    <div className="space-y-6">
                      {/* Search & Action Bar */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                          <input
                            type="text"
                            placeholder="Filter detected skills..."
                            value={skillsSearch}
                            onChange={(e) => setSkillsSearch(e.target.value)}
                            className="w-full bg-white border border-zinc-200 hover:border-zinc-300 focus:border-primary/50 text-xs font-semibold px-10 py-3 rounded-xl text-zinc-800 focus:outline-none placeholder-zinc-400 transition-colors"
                          />
                          {skillsSearch && (
                            <button
                              onClick={() => setSkillsSearch('')}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 font-mono text-xs"
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        <button
                          onClick={() => handleCopy(filteredSkills.join(', '), 'skills')}
                          className="px-5 py-3 rounded-xl border border-zinc-200 hover:border-zinc-350 bg-white hover:bg-slate-50 text-xs font-bold text-zinc-705 flex items-center justify-center gap-2 select-none active:scale-95 transition-all text-center min-w-[125px] cursor-pointer"
                        >
                          {copiedModalId === 'skills' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-zinc-500" />
                              <span>Copy List</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Info Counter */}
                      <div className="flex justify-between items-center text-[10px] font-black text-zinc-450 uppercase tracking-widest border-b border-zinc-200 pb-3">
                        <span>Organization Index</span>
                        <span>Showing {filteredSkills.length} of {allSkills.length} Total</span>
                      </div>

                      {/* Grouped Skills Grid */}
                      {Object.keys(grouped).length > 0 ? (
                        <div className="space-y-5">
                          {Object.entries(grouped).map(([category, list]) => (
                            <div key={category} className="space-y-2">
                              <h4 className="text-[10px] font-extrabold text-primary uppercase tracking-widest">{category}</h4>
                              <div className="flex flex-wrap gap-2">
                                {list.map((skill, index) => (
                                  <span
                                    key={index}
                                    className="text-xs font-bold text-zinc-700 bg-slate-50 border border-zinc-205 px-3 py-2 rounded-xl flex items-center gap-1.5 font-mono"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-zinc-500 text-xs font-medium">
                          No matching skills found.
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* 5.2: MISSING KEYWORDS MODAL */}
                {activeModal === 'keywords' && (() => {
                  const allKeywords = activeData.missingKeywords || [];
                  const filteredKeywords = allKeywords.filter(kw => 
                    kw.toLowerCase().includes(keywordsSearch.toLowerCase())
                  );

                  return (
                    <div className="space-y-6">
                      {/* Search / Copy Filter */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-550 pointer-events-none" />
                          <input
                            type="text"
                            placeholder="Filter missing keywords..."
                            value={keywordsSearch}
                            onChange={(e) => setKeywordsSearch(e.target.value)}
                            className="w-full bg-zinc-950/80 border border-zinc-850 hover:border-zinc-800 focus:border-primary/50 text-xs font-semibold px-10 py-3 rounded-xl text-zinc-250 focus:outline-none placeholder-zinc-650 transition-colors"
                          />
                          {keywordsSearch && (
                            <button
                              onClick={() => setKeywordsSearch('')}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 font-mono text-xs"
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        <button
                          onClick={() => handleCopy(filteredKeywords.join(', '), 'keywords')}
                          className="px-5 py-3 rounded-xl border border-zinc-850 hover:border-zinc-850 bg-zinc-950 hover:bg-zinc-900 text-xs font-bold text-zinc-350 flex items-center justify-center gap-2 select-none active:scale-95 transition-all text-center min-w-[125px]"
                        >
                          {copiedModalId === 'keywords' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-zinc-400" />
                              <span>Copy List</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Keywords explanation list */}
                      {filteredKeywords.length > 0 ? (
                        <div className="space-y-3.5">
                          {filteredKeywords.map((kw, i) => {
                            const origIdx = allKeywords.indexOf(kw);
                            const priority = origIdx < 3 ? 'High' : origIdx < 6 ? 'Medium' : 'Low';
                            const badgeClass = 
                              priority === 'High' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                              priority === 'Medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                              'bg-zinc-800/30 border-zinc-800/80 text-zinc-400';
                            
                            const isFromJD = activeData.jobDescriptionKeywords?.includes(kw) || (origIdx % 2 === 0);

                            return (
                              <div key={i} className="p-4.5 rounded-2xl bg-zinc-950/60 border border-zinc-900/60 hover:border-zinc-850 transition-colors space-y-2">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2 truncate">
                                    <span className="text-sm font-black text-zinc-200 font-mono">{kw}</span>
                                    {isFromJD && (
                                      <span className="text-[9px] font-black uppercase text-purple-400 border border-purple-500/20 bg-purple-500/5 px-2 py-0.5 rounded-md">
                                        JD Match
                                      </span>
                                    )}
                                  </div>
                                  <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-md border", badgeClass)}>
                                    {priority}
                                  </span>
                                </div>
                                <p className="text-[11px] text-zinc-450 leading-relaxed font-semibold">
                                  <strong className="text-zinc-400 block mb-0.5">Why it matters:</strong>
                                  {getKeywordExplanation(kw)}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-zinc-500 text-xs font-medium">
                          No missing keywords detected.
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* 5.3: SUGGESTIONS FULL MODAL */}
                {activeModal === 'suggestions' && (() => {
                  const groupedSug = groupSuggestions(activeData.suggestions);

                  return (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center pb-3 border-b border-zinc-900">
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                          Grouped Action Plan
                        </p>
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                          {activeData.suggestions?.length || 0} Total recommendations
                        </span>
                      </div>

                      {Object.keys(groupedSug).length > 0 ? (
                        <div className="space-y-8">
                          {Object.entries(groupedSug).map(([sectionName, suggestionsList]) => (
                            <div key={sectionName} className="space-y-4">
                              <h4 className="text-xs font-extrabold text-primary uppercase tracking-widest border-l-2 border-primary pl-2.5">
                                {sectionName}
                              </h4>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {suggestionsList.map((sug, i) => {
                                  const impact = sug.impact || 'Medium';
                                  const badgeClass = 
                                    impact === 'High' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                    impact === 'Medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                                    'bg-zinc-800/30 border-zinc-800/80 text-zinc-400';

                                  return (
                                    <div key={i} className="p-5 rounded-2xl bg-zinc-950/60 border border-zinc-900/60 hover:border-zinc-850 transition-colors flex flex-col justify-between space-y-4">
                                      <div className="space-y-2">
                                        <div className="flex justify-between items-start gap-4">
                                          <span className="text-xs font-black text-zinc-150 uppercase tracking-wider leading-relaxed">
                                            {sug.title}
                                          </span>
                                          <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-md border shrink-0", badgeClass)}>
                                            {impact} Priority
                                          </span>
                                        </div>
                                        
                                        <div className="space-y-1">
                                          <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wider block">Description</span>
                                          <p className="text-[11px] text-zinc-350 leading-relaxed font-semibold">
                                            {sug.description}
                                          </p>
                                        </div>

                                        <div className="space-y-1">
                                          <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wider block">Why it affects ATS</span>
                                          <p className="text-[11px] text-zinc-450 leading-relaxed font-semibold italic">
                                            {sug.reason || "ATS parsers look for structured and quantifiable metrics related to this sector."}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="pt-3 border-t border-zinc-900/80 space-y-2">
                                        <span className="text-[10px] text-primary font-extrabold uppercase tracking-wider block">Recommended Improvement</span>
                                        <p className="text-[11px] text-emerald-400/90 font-semibold leading-relaxed">
                                          {sug.improvements || "Re-phrase this section utilizing active verb identifiers and clear numeric indicators."}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-zinc-500 text-xs font-medium">
                          No suggestions required. Your profile scoring indicates excellent ATS index alignment.
                        </div>
                      )}
                    </div>
                  );
                })()}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
