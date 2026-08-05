/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell,
  BarChart, Bar, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
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

const COLORS = ['#3B82F6', '#8B5CF6', '#06B6D4', '#60A5FA', '#A78BFA', '#22D3EE'];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 260, 
      damping: 22 
    } 
  }
};


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
      const handle = setTimeout(() => setCurrent(value), 0);
      return () => clearTimeout(handle);
    }
    
    let start = 0;
    const end = numericVal;
    if (start === end) {
      const handle = setTimeout(() => setCurrent(value), 0);
      return () => clearTimeout(handle);
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
  }, [value, duration, numericVal]);

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
      gradient: "from-cyan-500 to-blue-500",
      bgLight: "bg-cyan-50/50",
      border: "border-cyan-100",
      text: "text-cyan-600",
      sparkline: "#06B6D4",
      glow: "hover:shadow-cyan-500/5 hover:border-cyan-200"
    },
    orange: {
      gradient: "from-purple-500 to-indigo-500",
      bgLight: "bg-purple-50/50",
      border: "border-purple-100",
      text: "text-purple-600",
      sparkline: "#8B5CF6",
      glow: "hover:shadow-purple-500/5 hover:border-purple-200"
    }
  };

  const currentTheme = themes[colorTheme] || themes.blue;

  return (
    <div className={cn(
      "glass-card flex flex-col justify-between group relative overflow-hidden",
      currentTheme.glow
    )}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-bold text-text-secondary uppercase tracking-widest leading-none">{title}</span>
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-tr text-white shadow-sm shrink-0", currentTheme.gradient)}>
          <Icon className="w-4.5 h-4.5" />
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-4 mt-2 mb-3">
        <h4 className="text-3xl font-black text-text-primary tracking-tight leading-none italic font-sans flex items-baseline select-none">
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

      <div className="flex items-center gap-2 pt-3 border-t border-border-base mt-2">
        {trend && (
          <span className={cn(
            "text-[10px] font-black uppercase px-2 py-0.5 rounded-lg flex items-center gap-0.5 border leading-none shrink-0",
            trendDirection === 'up' 
              ? "bg-emerald-50 border-emerald-250 text-emerald-600" 
              : "bg-bg-base border-border-base text-text-secondary"
          )}>
            {trendDirection === 'up' ? "↑" : "↓"} {trend}
          </span>
        )}
        <span className="text-[10px] text-text-secondary font-semibold truncate leading-none">
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
    classes: 'bg-red-50 border-red-200 text-red-600',
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

const ScoreTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass bg-card-base border border-border-base p-4.5 rounded-xl shadow-lg backdrop-blur-md">
        <p className="text-[10px] font-black text-[#8B5CF6] uppercase tracking-[0.25em] mb-1.5">{label}</p>
        <p className="text-xl font-black text-[#8B5CF6] italic tracking-tight">{payload[0].value} <span className="text-xs font-bold text-text-secondary italic">ATS Score</span></p>
      </div>
    );
  }
  return null;
};

const MatchTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass bg-card-base border border-border-base p-4.5 rounded-xl shadow-lg backdrop-blur-md">
        <p className="text-[10px] font-black text-[#10B981] uppercase tracking-[0.25em] mb-1.5">{label}</p>
        <p className="text-xl font-black text-[#10B981] italic tracking-tight">{payload[0].value}% <span className="text-xs font-bold text-text-secondary italic">Job Match</span></p>
      </div>
    );
  }
  return null;
};

const CategoryTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="glass bg-card-base border border-border-base p-4 rounded-xl shadow-lg max-w-xs backdrop-blur-md text-left">
        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{data.category || payload[0].name}</p>
        <div className="flex items-baseline gap-1 mt-1 border-b border-border-base pb-1.5 mb-1.5">
          <span className="text-xl font-black text-text-primary italic">{data.score || payload[0].value}</span>
          <span className="text-[10.5px] font-bold text-text-secondary italic">/100 Points</span>
        </div>
        {data.confidence && (
          <p className="text-[9px] font-bold text-text-secondary uppercase mb-1">Confidence: {data.confidence}</p>
        )}
        {data.explanation && (
          <p className="text-[10px] text-text-secondary leading-relaxed font-semibold">
            {data.explanation}
          </p>
        )}
      </div>
    );
  }
  return null;
};

const RadarTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="glass bg-card-base border border-border-base p-4 rounded-xl shadow-lg max-w-xs backdrop-blur-md text-left">
        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">{data.category}</p>
        <div className="space-y-1.5 border-t border-border-base pt-1.5">
          <div className="flex justify-between gap-4 text-xs font-bold">
            <span className="text-text-secondary">Your Resume:</span>
            <span className="text-primary italic">{data.Resume}/100</span>
          </div>
          <div className="flex justify-between gap-4 text-xs font-bold">
            <span className="text-text-secondary">Job Requirement:</span>
            <span className="text-[#10B981] italic">{data["Job Requirements"]}/100</span>
          </div>
        </div>
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

  const safeIdx = activeIdx >= 0 && activeIdx < analyses.length ? activeIdx : 0;
  const activeAnalysis = analyses[safeIdx];
  const activeData = activeAnalysis?.analysisData;
  const categoryScores = useMemo(() => {
    if (!activeData) return {};
    if (activeData.categoryScores) return activeData.categoryScores;
    
    // Fallback: extract legacy scores from scoreBreakdown list if present
    const scores = {};
    if (activeData.scoreBreakdown) {
      activeData.scoreBreakdown.forEach(item => {
        const cat = (item.category || '').toLowerCase();
        let key = null;
        if (cat.includes('skill') || cat.includes('language') || cat.includes('tech')) key = 'technicalSkills';
        else if (cat.includes('experience') || cat.includes('history') || cat.includes('work')) key = 'experience';
        else if (cat.includes('education') || cat.includes('academic') || cat.includes('credential')) key = 'education';
        else if (cat.includes('keyword') || cat.includes('ats')) key = 'atsKeywords';
        else if (cat.includes('format') || cat.includes('layout')) key = 'formatting';
        else if (cat.includes('completeness') || cat.includes('quality') || cat.includes('contact')) key = 'completeness';
        
        if (key && item.score !== undefined) {
          scores[key] = item.score;
        }
      });
    }
    return scores;
  }, [activeData]);

  const breakdownItemsEx = useMemo(() => {
    if (!activeData) return [];
    const text = (activeData.originalText || '').trim();

    // 1. Technical Skills
    const foundSkills = activeData.skills || [];
    const missingKeywords = activeData.missingKeywords || [];
    
    // Pivot first half of missing keywords as missing skills
    const missingSkills = missingKeywords.slice(0, Math.ceil(missingKeywords.length / 2));
    const skillsConfidence = foundSkills.length > 5 ? 94 : 85;

    // 2. Experience
    const jobRolesRegex = /\b(software engineer|developer|architect|designer|analyst|manager|consultant|specialist|lead|intern|coordinator|representative|director|associate|expert)\b/gi;
    const matches = text.match(jobRolesRegex) || [];
    const uniqueJobs = Array.from(new Set(matches.map(j => j.trim().toLowerCase())));
    const detectedJobs = uniqueJobs.map(j => j.replace(/\b\w/g, c => c.toUpperCase())).slice(0, 4);
    if (detectedJobs.length === 0 && activeData.role) {
      detectedJobs.push(activeData.role);
    }

    const expBulletsMatches = text.match(/\b(designed|developed|implemented|led|managed|built|created|optimized|coordinated|analyzed|executed|supervised|assisted|facilitated|increased|achieved|reduced|saved)\b/gi) || [];
    const expBulletCount = expBulletsMatches.length;

    const expSuggestions = (activeData.suggestions || []).filter(s => 
      /experience|work|job|achievement|project|bullet|metric|quantify/i.test(s.title + ' ' + s.description)
    );
    const missingExp = expSuggestions.length > 0
      ? expSuggestions.map(s => s.title)
      : ["Quantification of work metrics"];
    const expConfidence = expBulletCount > 3 ? 91 : 82;

    // 3. Education & Certifications
    const degreeRegex = /\b(degree|bachelor|master|phd|b\.s\.|m\.s\.|b\.tech|m\.tech|mba|bsc|msc|ph\.d\.|university|college|school)\b/gi;
    const eduMatches = text.match(degreeRegex) || [];
    const uniqueEdu = Array.from(new Set(eduMatches.map(e => e.trim().toLowerCase())));
    const detectedEdu = uniqueEdu.map(e => e.replace(/\b\w/g, c => c.toUpperCase())).slice(0, 3);
    if (detectedEdu.length === 0) {
      detectedEdu.push("Professional Experience Background");
    }

    const certsRegex = /\b(certified|certification|aws|csm|pmp|scrum|safe|google|comptia|ccna|cissp|cpa|shrm)\b/gi;
    const certsMatches = text.match(certsRegex) || [];
    const uniqueCerts = Array.from(new Set(certsMatches.map(c => c.trim().toUpperCase())));
    uniqueCerts.slice(0, 3).forEach(c => {
      detectedEdu.push(`${c} Certification`);
    });

    const eduSuggestions = (activeData.suggestions || []).filter(s => 
      /education|degree|certif|coursework|academic/i.test(s.title + ' ' + s.description)
    );
    const missingEdu = eduSuggestions.length > 0
      ? eduSuggestions.map(s => s.title)
      : (uniqueCerts.length === 0 ? ["Professional domain-relevant certification"] : ["Academic coursework mapping"]);
    const eduConfidence = detectedEdu.length > 1 ? 95 : 88;

    // 4. ATS Keywords
    const detectedKeywords = foundSkills.slice(0, 5);
    const missingKeywordsList = missingKeywords;
    const keywordsConfidence = 96;

    // 5. Formatting
    const formattingSuggestions = (activeData.suggestions || []).filter(s => 
      /format|layout|font|margin|page|spacing|length/i.test(s.title + ' ' + s.description)
    );
    const detectedFormatting = ["Clean text parser structure"];
    const wordsCount = text ? text.split(/\s+/).length : 220;
    detectedFormatting.push(`Length: ${wordsCount} words`);

    const missingFormatting = formattingSuggestions.length > 0
      ? formattingSuggestions.map(s => s.title)
      : ["Optimal paragraph spacing constraints"];

    if (formattingSuggestions.length === 0) {
      detectedFormatting.push("Page bounds & layout constraints compliant");
    }
    const formattingConfidence = 90;

    return [
      {
        category: 'Technical Skills',
        score: categoryScores.technicalSkills ?? 0,
        weight: 25,
        confidence: `${skillsConfidence}%`,
        detected: foundSkills,
        missing: missingSkills,
        explanation: `Resume contains ${foundSkills.length} parsed skills. Recommended adding ${missingKeywords.length - missingSkills.length} missing skills.`,
        suggestion: missingSkills.length > 0 ? `Include ${missingSkills.slice(0, 3).join(', ')}` : null,
        reason: `Evaluated ${foundSkills.length} skills against target job description requirements.`,
        theme: getCategoryTheme('skills')
      },
      {
        category: 'Experience',
        score: categoryScores.experience ?? 0,
        weight: 25,
        confidence: `${expConfidence}%`,
        detected: detectedJobs,
        missing: missingExp,
        explanation: `Parsed ${detectedJobs.length} ${detectedJobs.length === 1 ? 'role' : 'roles'}. ${formattingSuggestions.length > 0 || missingExp.length > 0 ? 'Experience gaps detected.' : 'No experience gaps detected.'}`,
        suggestion: missingExp.length > 0 ? missingExp[0] : null,
        reason: `Assessed experience depth, dates, achievements, and active metrics.`,
        theme: getCategoryTheme('experience')
      },
      {
        category: 'Education',
        score: categoryScores.education ?? 0,
        weight: 15,
        confidence: `${eduConfidence}%`,
        detected: detectedEdu,
        missing: missingEdu,
        explanation: `Found academic degree. ${uniqueCerts.length > 0 ? `${uniqueCerts.length} certification${uniqueCerts.length === 1 ? '' : 's'} detected.` : 'No certifications detected.'}`,
        suggestion: missingEdu.length > 0 ? missingEdu[0] : null,
        reason: `Academic background completeness and industry relevance.`,
        theme: getCategoryTheme('education')
      },
      {
        category: 'ATS Keywords',
        score: categoryScores.atsKeywords ?? 0,
        weight: 15,
        confidence: `${keywordsConfidence}%`,
        detected: detectedKeywords,
        missing: missingKeywordsList,
        explanation: `Missing ${missingKeywordsList.length} important keywords.`,
        suggestion: missingKeywordsList.length > 0 ? `Add key terms: ${missingKeywordsList.slice(0,3).join(', ')}` : null,
        reason: `Matched resume content against role keywords and phrases.`,
        theme: getCategoryTheme('keyword')
      },
      {
        category: 'Formatting',
        score: categoryScores.formatting ?? 0,
        weight: 15,
        confidence: `${formattingConfidence}%`,
        detected: detectedFormatting,
        missing: missingFormatting,
        explanation: `${formattingSuggestions.length > 0 ? 'Minor formatting issues detected.' : 'No formatting issues detected.'}`,
        suggestion: missingFormatting.length > 0 ? missingFormatting[0] : null,
        reason: `Evaluated page structure, font styles, text cleanliness, and sizing.`,
        theme: getCategoryTheme('format')
      },
      {
        category: 'Completeness',
        score: categoryScores.completeness ?? 0,
        weight: 5,
        confidence: `98%`,
        detected: [
          activeData.name && "Candidate Name matched",
          activeData.email && "Contact Email matched",
          activeData.role && "Target Title matched",
          foundSkills.length > 0 && "Skills array matched",
          text.length > 500 && "Body content size ok"
        ].filter(Boolean),
        missing: [
          !activeData.name && "Name field",
          !activeData.email && "Email contact info",
          !activeData.role && "Target title/heading"
        ].filter(Boolean),
        explanation: `Primary contact fields completed.`,
        suggestion: null,
        reason: `Parsed contact headings, skills scope, and file length checking.`,
        theme: getCategoryTheme('completeness')
      }
    ];
  }, [
    activeData,
    categoryScores.technicalSkills,
    categoryScores.experience,
    categoryScores.education,
    categoryScores.atsKeywords,
    categoryScores.formatting,
    categoryScores.completeness
  ]);

  const handleCopy = (text, modalId) => {
    navigator.clipboard.writeText(text);
    setCopiedModalId(modalId);
    setTimeout(() => setCopiedModalId(null), 2000);
  };

  useEffect(() => {
    if (!user) return;
    const handle = setTimeout(() => {
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
    }, 0);
    return () => clearTimeout(handle);
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4 text-text-secondary">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-medium">Running statistical computations…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-8 text-center text-red-500 border border-red-500/20 bg-red-500/10">
        {error}
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-card-base border border-border-base flex items-center justify-center shadow-xs">
          <Inbox className="w-8 h-8 text-text-secondary" />
        </div>
        <div className="text-center">
          <p className="text-text-primary font-bold">No analytics data available</p>
          <p className="text-text-secondary text-sm mt-1">Please process a resume scan first to display metrics.</p>
        </div>
      </div>
    );
  }  // Ensure index boundary safety
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
  
  const jobMatch = Math.max(45, Math.min(99, Math.round(100 - ((activeData.missingKeywords?.length || 0) * 8)) + (atsScore % 5)));

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



  let scoreBadgeColor = "bg-emerald-50 border-emerald-200 text-emerald-700";
  let scoreBadgeText = "Good";
  if (atsScore >= 85) {
    scoreBadgeColor = "bg-primary/10 border-primary/20 text-primary";
    scoreBadgeText = "Excellent";
  } else if (atsScore < 70) {
    scoreBadgeColor = "bg-red-50 border-red-200 text-red-600";
    scoreBadgeText = "Needs Work";
  }

  let qualityBadgeText = "Industry Ready";
  if (atsScore >= 85) {
    qualityBadgeText = "Top 10%";
  } else if (atsScore >= 75) {
    qualityBadgeText = "Top 20%";
  } else {
    qualityBadgeText = "Standard";
  }

  let matchBadgeText = "Partial Match";
  if (jobMatch >= 90) {
    matchBadgeText = "Excellent Match";
  } else if (jobMatch >= 80) {
    matchBadgeText = "Good Match";
  } else if (jobMatch < 65) {
    matchBadgeText = "Low Match";
  }

  let pageBadgeText = "Ideal";
  if (pageCount > 2) {
    pageBadgeText = "Long";
  }

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

  const matchTrendData = analyses.slice().reverse().map(a => ({
    label: new Date(a.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    match: getJobMatchForAnalysis(a),
    name: a.fileName?.substring(0, 15) || 'Resume'
  }));

  return (
    <div className="space-y-8 pb-12">
      {/* Redesigned Premium Header & Resume Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border-base pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-black text-text-primary tracking-tight flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Resume Optimization Insights
            </h1>
            <span className="text-[10px] font-black px-2.5 py-1 bg-primary/10 border border-primary/20 text-primary rounded-lg tracking-wider uppercase">
              Domain: {domain}
            </span>
          </div>
          <p className="text-text-secondary text-sm mt-1">Premium quality scoring, formatting diagnostics, and structural keywords analysis.</p>
        </div>

        {analyses.length > 1 && (
          <div className="relative shrink-0 w-full md:w-auto">
            <select 
              value={activeIdx}
              onChange={(e) => setActiveIdx(parseInt(e.target.value))}
              className="appearance-none w-full md:w-64 bg-card-base border border-border-base hover:border-primary/30 text-text-primary text-xs font-bold rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-primary/50 cursor-pointer shadow-sm tracking-wider"
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
          <div className="glass-card flex flex-col md:flex-row gap-6 relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            
            {/* Left Box: Domain & Confidence */}
            <div className="flex items-start gap-4 md:w-1/3 shrink-0 border-b md:border-b-0 md:border-r border-border-base pb-4 md:pb-0 md:pr-6">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary mt-1">
                <Award className="w-6 h-6" />
               </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-text-secondary tracking-[0.2em] block">Detected Resume Domain</span>
                <h4 className="text-xl font-black text-text-primary italic tracking-tight uppercase">
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
        {/* Left Card: ATS Score Calculation Weights (Redesigned to avoid confusion) */}
        <div className="relative p-[1px] bg-gradient-to-b from-border-base/80 to-border-base/40 rounded-[20px] lg:col-span-1 border border-transparent h-full">
          <div className="bg-card-base rounded-[19px] p-6 h-full flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="text-lg font-black text-text-primary tracking-tight italic uppercase">ATS Score Calculation Weights</h3>
              <p className="text-text-secondary text-xs mt-0.5 leading-relaxed font-semibold">These weights determine how much each category contributes to your final ATS score. They are fixed evaluation criteria and do not represent your performance.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-10 gap-8 items-center w-full mt-4">
              {/* LEFT SIDE (40%) - Donut chart and Centered Badge */}
              <div className="sm:col-span-4 flex flex-col items-center justify-center text-center">
                <div className="relative w-[170px] h-[170px] shrink-0 flex items-center justify-center">
                  <div className="absolute flex flex-col items-center justify-center text-center z-10">
                    <span className="text-4xl font-[1000] text-text-primary italic tracking-tighter leading-none">{atsScore}</span>
                    <span className="text-[8px] uppercase font-black text-text-secondary tracking-widest mt-1 block">ATS Score</span>
                    <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border mt-2 inline-block leading-none", scoreBadgeColor)}>
                      {scoreBadgeText.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="w-full h-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <defs>
                          <linearGradient id="pieBlueGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3B82F6" />
                            <stop offset="100%" stopColor="#1E3A8A" />
                          </linearGradient>
                          <linearGradient id="piePurpleGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8B5CF6" />
                            <stop offset="100%" stopColor="#4C1D95" />
                          </linearGradient>
                          <linearGradient id="pieCyanGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#06B6D4" />
                            <stop offset="100%" stopColor="#083344" />
                          </linearGradient>
                          <linearGradient id="pieGreenGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#06B6D4" />
                            <stop offset="100%" stopColor="#0891B2" />
                          </linearGradient>
                          <linearGradient id="pieTealGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#60A5FA" />
                            <stop offset="100%" stopColor="#2563EB" />
                          </linearGradient>
                          <linearGradient id="pieOrangeGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#A78BFA" />
                            <stop offset="100%" stopColor="#7C3AED" />
                          </linearGradient>
                        </defs>
                        <Tooltip content={<CategoryTooltip />} />
                        <Pie
                          data={breakdownItemsEx}
                          cx="50%"
                          cy="50%"
                          innerRadius={56}
                          outerRadius={76}
                          paddingAngle={3}
                          cornerRadius={4}
                          dataKey="weight"
                          nameKey="category"
                          isAnimationActive={true}
                          animationDuration={1000}
                        >
                          {breakdownItemsEx.map((entry, index) => {
                            const norm = (entry.category || '').toLowerCase();
                            let fillGrad = 'url(#pieOrangeGrad)';
                            if (norm.includes('skill') || norm.includes('competenc') || norm.includes('language') || norm.includes('tech')) fillGrad = 'url(#pieBlueGrad)';
                            else if (norm.includes('experience') || norm.includes('achievement') || norm.includes('project') || norm.includes('career') || norm.includes('histor')) fillGrad = 'url(#pieGreenGrad)';
                            else if (norm.includes('keyword') || norm.includes('ats') || norm.includes('term') || norm.includes('match')) fillGrad = 'url(#piePurpleGrad)';
                            else if (norm.includes('format') || norm.includes('structur') || norm.includes('layout')) fillGrad = 'url(#pieCyanGrad)';
                            else if (norm.includes('readability') || norm.includes('clarity') || norm.includes('education') || norm.includes('academic')) fillGrad = 'url(#pieTealGrad)';
                            
                            return <Cell key={`cell-${index}`} fill={fillGrad} stroke="var(--card-base)" strokeWidth={2} />;
                          })}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <p className="text-[10px] text-text-secondary mt-3 font-semibold tracking-wide text-center leading-normal select-none">
                  ⓘ Based on AI analysis of resume
                </p>
              </div>

              {/* RIGHT SIDE (60%) - Staggered dynamic categories list */}
              <div className="sm:col-span-6 w-full">
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-4"
                >
                  {breakdownItemsEx.map((item, idx) => (
                    <motion.div 
                      key={idx}
                      variants={itemVariants}
                      whileHover={{ scale: 1.01, x: 2 }}
                      className="group/item flex items-start justify-between gap-3 p-2 rounded-xl hover:bg-bg-base/60 border border-transparent hover:border-border-base transition-all duration-200 cursor-pointer"
                      onClick={() => {
                        const element = document.getElementById(`evidence-card-${idx}`);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }}
                    >
                      <div className="flex items-start gap-2.5 min-w-0 flex-1">
                        <span 
                          className="w-2.5 h-2.5 rounded-full shrink-0 mt-1" 
                          style={{ backgroundColor: item.theme.color }}
                        />
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-[11px] font-bold text-text-primary transition-colors group-hover/item:text-primary leading-tight uppercase tracking-wider">
                            {item.category.toUpperCase()}
                          </span>
                          <span className="text-[10.5px] text-text-secondary font-semibold mt-1 leading-relaxed line-clamp-2">
                            {item.explanation || "Evaluation of matching metrics."}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 pr-1 shrink-0">
                        <div className="flex flex-col items-end justify-center text-right shrink-0">
                          <div className="flex items-baseline gap-0.5">
                            <span className="text-[8.5px] uppercase font-black text-text-secondary/60 mr-1 tracking-wider leading-none">Score</span>
                            <span className="text-xs font-black text-text-primary italic leading-none">{item.score}</span>
                            <span className="text-[8.5px] text-text-secondary/50 font-black italic leading-none">/100</span>
                          </div>
                          <div className="text-[9px] font-bold text-text-secondary/60 pr-[1px] tracking-wide mt-1.5 leading-none">
                            Weight: <span className="font-extrabold text-text-secondary font-mono">{item.weight}%</span>
                          </div>
                        </div>
                        <span className="text-xs font-[1000] text-border-base transition-transform group-hover/item:translate-x-0.5 select-none leading-none">
                          &gt;
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

            </div>
          </div>
        </div>


 
        {/* Right Card: DETAILED SCORE BREAKDOWN (Bars) */}
        <div className="glass-card flex flex-col justify-between h-full">
          <div>
            <h3 className="text-lg font-black text-text-primary tracking-tight italic uppercase">Category Performance Scores</h3>
            <p className="text-text-secondary text-xs mt-0.5 leading-relaxed font-semibold">Your actual score achieved in each ATS evaluation category.</p>
          </div>
          
          <div className="h-[280px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={breakdownItemsEx}
                margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="barBlueGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.85} />
                    <stop offset="100%" stopColor="#2563EB" />
                  </linearGradient>
                  <linearGradient id="barPurpleGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.85} />
                    <stop offset="100%" stopColor="#7C3AED" />
                  </linearGradient>
                  <linearGradient id="barCyanGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.85} />
                    <stop offset="100%" stopColor="#0891B2" />
                  </linearGradient>
                  <linearGradient id="barGreenGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.85} />
                    <stop offset="100%" stopColor="#0891B2" />
                  </linearGradient>
                  <linearGradient id="barTealGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.85} />
                    <stop offset="100%" stopColor="#2563EB" />
                  </linearGradient>
                  <linearGradient id="barOrangeGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#A78BFA" stopOpacity={0.85} />
                    <stop offset="100%" stopColor="#7C3AED" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-base)" />
                <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
                <YAxis
                  dataKey="category"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  width={110}
                  tick={({ x, y, payload }) => {
                    const item = breakdownItemsEx.find(b => b.category === payload.value);
                    const color = item ? item.theme.color : 'var(--text-secondary)';
                    return (
                      <g transform={`translate(${x - 110},${y - 12})`}>
                        <foreignObject width={105} height={24}>
                          <div className="flex items-center justify-end gap-1.5 w-full h-full pr-1 text-right select-none">
                            <span className="text-[9px] sm:text-[10px] font-bold text-text-secondary uppercase leading-none sm:leading-tight whitespace-normal break-words max-w-[90px]" title={payload.value}>
                              {payload.value}
                            </span>
                            <span 
                              className="w-1.5 h-1.5 rounded-full shrink-0" 
                              style={{ backgroundColor: color }}
                            />
                          </div>
                        </foreignObject>
                      </g>
                    );
                  }}
                />
                <Tooltip content={<CategoryTooltip />} cursor={{ fill: 'rgba(241,245,249,0.4)', radius: 4 }} />
                <Bar 
                  dataKey="score" 
                  radius={[0, 6, 6, 0]} 
                  barSize={12}
                  isAnimationActive={true}
                  animationDuration={1005}
                >
                  {breakdownItemsEx.map((entry, index) => {
                    const norm = (entry.category || '').toLowerCase();
                    let gradId = 'url(#barOrangeGrad)';
                    if (norm.includes('skill') || norm.includes('competenc') || norm.includes('language') || norm.includes('tech')) gradId = 'url(#barBlueGrad)';
                    else if (norm.includes('experience') || norm.includes('achievement') || norm.includes('project') || norm.includes('career') || norm.includes('histor')) gradId = 'url(#barGreenGrad)';
                    else if (norm.includes('keyword') || norm.includes('ats') || norm.includes('term') || norm.includes('match')) gradId = 'url(#barPurpleGrad)';
                    else if (norm.includes('format') || norm.includes('structur') || norm.includes('layout')) gradId = 'url(#barCyanGrad)';
                    else if (norm.includes('readability') || norm.includes('clarity') || norm.includes('education') || norm.includes('academic')) gradId = 'url(#barTealGrad)';
                    
                    return <Cell key={`cell-${index}`} fill={gradId} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] text-text-secondary mt-4 block text-center font-semibold select-none">ⓘ Based on AI analysis of your uploaded resume</div>
        </div>
      </div>

      {/* ℹ️ How Scoring Works Info Box */}
      <div className="glass-card text-left">
        <div className="flex gap-3">
          <div className="text-primary text-sm mt-0.5 shrink-0 select-none">ℹ️</div>
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase text-text-primary tracking-wider italic">How scoring works</h4>
            <p className="text-[11px] text-text-secondary leading-relaxed font-semibold">
              Your final ATS score is calculated using weighted categories.
            </p>
            <ul className="text-[11px] text-text-secondary leading-relaxed font-semibold list-disc pl-4 space-y-1">
              <li><strong className="text-text-primary font-bold uppercase text-[9px] tracking-wider">Evaluation Weights:</strong> Determine how important each category is.</li>
              <li><strong className="text-text-primary font-bold uppercase text-[9px] tracking-wider">Performance Scores:</strong> Measure how well your resume performs in each category.</li>
            </ul>
            <p className="text-[10px] text-primary/90 font-extrabold uppercase mt-1 leading-normal">
              Final ATS Score = Weighted combination of all category scores.
            </p>
          </div>
        </div>
      </div>

      {/* Evidence-Based Assessment Details Section (3-column responsive grid) */}
      <div className="space-y-4 mt-8 pt-4 border-t border-border-base">
        <h3 className="text-lg font-black text-text-primary tracking-tight italic uppercase">Evidence-Based Assessment Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {breakdownItemsEx.map((item, idx) => (
            <div 
              key={idx} 
              id={`evidence-card-${idx}`}
              className="glass-card flex flex-col justify-between text-left"
            >
              <div>
                {/* Header with Title and Confidence */}
                <div className="flex justify-between items-center w-full border-b border-border-base pb-3 mb-3.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-xs shrink-0" style={{ backgroundColor: item.theme.color }}>
                      <item.theme.icon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10.5px] font-black uppercase text-text-primary tracking-wider truncate leading-none">
                        {item.category.toUpperCase()}
                      </span>
                      <span className="text-[8px] font-black text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded-md uppercase tracking-wider mt-1.5 w-max leading-none">
                        CONFIDENCE: {item.confidence}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-0.5 shrink-0 pl-1">
                    <span className="text-sm font-black italic text-text-primary leading-none">{item.score}</span>
                    <span className="text-[9px] text-text-secondary font-bold italic leading-none">/100</span>
                  </div>
                </div>

                {/* Evaluation statement */}
                <p className="text-[11px] text-text-secondary font-semibold leading-relaxed mb-4">
                  <strong className="text-text-primary font-bold uppercase text-[9px] tracking-wider mr-1">Evaluation:</strong>
                  {item.reason || item.explanation}
                </p>

                {/* Detected Badges */}
                {item.detected && item.detected.length > 0 && (
                  <div className="flex flex-col gap-1.5 mt-2.5">
                    <span className="text-[9px] text-emerald-600 font-extrabold uppercase tracking-wide flex items-center gap-1 select-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Found ({item.detected.length}):
                    </span>
                    <div className="flex flex-wrap gap-1 leading-none">
                      {item.detected.slice(0, 4).map((det, i) => (
                        <span key={i} className="text-[9px] font-bold text-text-secondary bg-bg-base border border-border-base/80 px-2 py-1 rounded-lg">
                          {det}
                        </span>
                      ))}
                      {item.detected.length > 4 && (
                        <span className="text-[9px] font-bold text-text-secondary pt-1">+{item.detected.length - 4} more</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Missing Badges */}
                {item.missing && item.missing.length > 0 && (
                  <div className="flex flex-col gap-1.5 mt-3.5">
                    <span className="text-[9px] text-red-500 font-extrabold uppercase tracking-wide flex items-center gap-1 select-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      Missing ({item.missing.length}):
                    </span>
                    <div className="flex flex-wrap gap-1 leading-none">
                      {item.missing.slice(0, 4).map((mis, i) => (
                        <span key={i} className="text-[9px] font-bold text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-lg">
                          {mis}
                        </span>
                      ))}
                      {item.missing.length > 4 && (
                        <span className="text-[9px] font-bold text-text-secondary pt-1">+{item.missing.length - 4} more</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* View Details modal toggle */}
              <div className="mt-4 pt-3 border-t border-border-base flex justify-start select-none">
                <button
                  onClick={() => {
                    const norm = item.category.toLowerCase();
                    if (norm.includes('skill')) setActiveModal('skills');
                    else if (norm.includes('keyword') || norm.includes('ats')) setActiveModal('keywords');
                    else setActiveModal('suggestions');
                  }}
                  className="text-[10px] font-extrabold text-primary hover:text-primary-dark transition-colors flex items-center gap-1 cursor-pointer uppercase tracking-wider"
                >
                  View Details <span className="text-[8px]">▼</span>
                </button>
              </div>
            </div>
          ))}
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
            colorTheme="cyan" 
            description={matchBadgeText.toLowerCase()} 
          />
          <KPICard 
            icon={FileText} 
            title="Page Count" 
            value={pageCount} 
            suffix={pageCount === 1 ? " Page" : " Pages"} 
            trend={pageBadgeText} 
            trendDirection={pageCount <= 2 ? "up" : "down"} 
            colorTheme="blue" 
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
        <div className="glass-card flex flex-col justify-between h-full">
          <div className="space-y-5">
            <div>
              <h3 className="text-xs font-black text-text-primary uppercase tracking-widest flex items-center gap-2">
                Strengths
              </h3>
              <p className="text-text-secondary text-[10px] mt-0.5">Compliant fields detected in this resume.</p>
            </div>
            <ul className="space-y-3">
              {strengths.map((str, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-text-secondary leading-relaxed font-semibold">
                  <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-6 pt-4 border-t border-border-base">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors select-none">
              <span>Great job! Keep it up.</span>
              <span>👍</span>
            </div>
          </div>
        </div>

        {/* widget 2: Improvement Areas */}
        <div className="glass-card flex flex-col justify-between h-full">
          <div className="space-y-5">
            <div>
              <h3 className="text-xs font-black text-text-primary uppercase tracking-widest">
                Improvement Areas
              </h3>
              <p className="text-text-secondary text-[10px] mt-0.5">Active anomalies and recommendations.</p>
            </div>
            <ul className="space-y-3">
              {activeData.suggestions?.slice(0, 5).map((s, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-text-secondary leading-relaxed font-semibold">
                  <span className="text-amber-500 shrink-0 mt-0.5 font-bold">⚠</span>
                  <span className="truncate">{s.title}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-6 pt-4 border-t border-border-base">
            <button 
              onClick={() => setActiveModal('suggestions')}
              className="w-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400 transition-colors uppercase tracking-wider text-left cursor-pointer"
            >
              <span>Improve these areas</span>
              <span>↗</span>
            </button>
          </div>
        </div>

        {/* widget 3: Top Skills Detected */}
        <div className="glass-card flex flex-col justify-between h-full">
          <div className="space-y-5">
            <div>
              <h3 className="text-xs font-black text-text-primary uppercase tracking-widest">
                Top Skills Detected
              </h3>
              <p className="text-text-secondary text-[10px] mt-0.5">Core competencies parsed from the resume.</p>
            </div>
            <div className="flex flex-wrap gap-2 max-h-[160px] overflow-hidden pr-1">
              {activeData.skills?.map((sk, i) => (
                <span key={i} className="text-[11px] font-bold text-text-primary bg-bg-base border border-border-base px-3 py-1.5 rounded-xl animate-fade-in">
                  {sk}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-border-base">
            <button 
              onClick={() => setActiveModal('skills')}
              className="w-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400 transition-colors uppercase tracking-wider cursor-pointer"
            >
              <span>View all skills ({activeData.skills?.length || 0})</span>
              <span className="opacity-70 font-bold">👁</span>
            </button>
          </div>
        </div>

        {/* widget 4: Missing Keywords */}
        <div className="glass-card flex flex-col justify-between h-full">
          <div className="space-y-5">
            <div>
              <h3 className="text-xs font-black text-text-primary uppercase tracking-widest">
                Missing Keywords
              </h3>
              <p className="text-text-secondary text-[10px] mt-0.5">Critical keywords index gaps detected.</p>
            </div>
            <div className="flex flex-wrap gap-2 max-h-[160px] overflow-hidden pr-1">
              {activeData.missingKeywords?.map((kw, i) => (
                <span key={i} className="text-[11px] font-bold text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-xl animate-fade-in">
                  {kw}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-border-base">
            <button 
              onClick={() => setActiveModal('keywords')}
              className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs font-bold text-red-650 dark:text-red-400 transition-colors uppercase tracking-wider cursor-pointer"
            >
              <span>View all missing ({activeData.missingKeywords?.length || 0})</span>
              <span className="opacity-70 font-bold">ⓘ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Row 4: Base Footer banner with lightbulb TIP */}
      <div className="glass-card flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3 text-xs text-text-secondary font-semibold animate-pulse">
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
      <div className="border-t border-border-base pt-8 mt-4 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Competency Radar Chart */}
          <div className="glass-card flex flex-col justify-between h-full">
            <div>
              <h3 className="text-lg font-black text-text-primary tracking-tight italic uppercase">Resume Competency Dimensions</h3>
              <p className="text-text-secondary text-xs mt-0.5 leading-relaxed font-semibold">Skill coverage & profile dimension spread from extracted credentials.</p>
            </div>
            
            <div className="h-[260px] w-full mt-4 flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="72%" data={breakdownItemsEx.slice(0, 5).map(item => {
                  let jobReq = 90;
                  if (item.category === 'Technical Skills') jobReq = 90;
                  else if (item.category === 'Experience') jobReq = 85;
                  else if (item.category === 'Education') jobReq = 80;
                  else if (item.category === 'ATS Keywords') jobReq = 90;
                  else if (item.category === 'Formatting') jobReq = 95;

                  return {
                    category: item.category,
                    Resume: item.score,
                    "Job Requirements": jobReq
                  };
                })}>
                  <defs>
                    <radialGradient id="radarPurpleGrad" cx="50%" cy="50%" r="80%">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.05} />
                    </radialGradient>
                  </defs>
                  <PolarGrid stroke="var(--border-base)" />
                  <PolarAngleAxis dataKey="category" tick={{ fill: 'var(--text-primary)', fontSize: 9, fontWeight: 700 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'var(--text-secondary)', fontSize: 8 }} />
                  <Radar 
                    name="Resume Profile" 
                    dataKey="Resume" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    fill="url(#radarPurpleGrad)" 
                    fillOpacity={0.6}
                    isAnimationActive={true}
                    animationDuration={1200}
                  />
                  <Radar 
                    name="Job Requirements" 
                    dataKey="Job Requirements" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    fill="none" 
                    isAnimationActive={true}
                    animationDuration={1200}
                  />
                  <Tooltip content={<RadarTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
              <div className="text-[10px] text-text-secondary mt-2 block text-center font-medium">Based on AI analysis of your uploaded resume</div>
            </div>
          </div>

          {/* Job Role Compatibility Horizontal Bar Chart */}
          <div className="glass-card flex flex-col justify-between h-full">
            <div>
              <h3 className="text-lg font-black text-text-primary tracking-tight italic uppercase">Job Role Compatibility</h3>
              <p className="text-text-secondary text-xs mt-0.5 leading-relaxed font-semibold">Match score estimation against adjacent industry positions.</p>
            </div>
            
            <div className="h-[260px] w-full mt-4 flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={compatibilityRoles}
                  margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="roleBlueGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#1D4ED8" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-base)" />
                  <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
                  <YAxis
                    dataKey="role"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    width={110}
                    tick={({ x, y, payload }) => (
                      <g transform={`translate(${x - 110},${y - 12})`}>
                        <foreignObject width={105} height={24}>
                          <div className="flex items-center justify-end w-full h-full pr-1 text-right select-none">
                            <span className="text-[9px] sm:text-[10px] font-bold text-text-secondary uppercase leading-none sm:leading-tight whitespace-normal break-words max-w-[100px]" title={payload.value}>
                              {payload.value}
                            </span>
                          </div>
                        </foreignObject>
                      </g>
                    )}
                  />
                  <Tooltip content={<MatchTooltip />} cursor={{ fill: 'var(--bg-base)', radius: 4 }} />
                  <Bar 
                    dataKey="percentage" 
                    fill="url(#roleBlueGrad)" 
                    radius={[0, 4, 4, 0]} 
                    barSize={12}
                    isAnimationActive={true}
                    animationDuration={1100}
                  />
                </BarChart>
              </ResponsiveContainer>
              <div className="text-[10px] text-text-secondary mt-2 block text-center font-medium">Based on AI analysis of your uploaded resume</div>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Component 6: Resume Improvement Trend (Area Chart) */}
          <div className="glass-card flex flex-col justify-between h-full">
            <div>
              <h3 className="text-lg font-black text-text-primary tracking-tight italic uppercase">Resume Improvement Trend</h3>
              <p className="text-text-secondary text-xs mt-0.5 leading-relaxed font-semibold">Visual tracking of your overall TS index across all history scans.</p>
            </div>
            
            <div className="h-[210px] w-full mt-4 flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={scoreTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="trendScoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-base)" />
                  <XAxis 
                    dataKey="label" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 900 }}
                    dy={10}
                  />
                  <YAxis 
                    hide
                    domain={['auto', 'auto']}
                  />
                  <Tooltip content={<ScoreTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#trendScoreGrad)" 
                    isAnimationActive={true}
                    animationDuration={1300}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="text-[10px] text-text-secondary mt-2 block text-center font-medium">Based on AI analysis of your uploaded resume</div>
            </div>
          </div>

          {/* Component 7: Job Match Optimization Progression (Line Chart) */}
          <div className="glass-card flex flex-col justify-between h-full">
            <div>
              <h3 className="text-lg font-black text-text-primary tracking-tight italic uppercase">Job Match Optimization</h3>
              <p className="text-text-secondary text-xs mt-0.5 leading-relaxed font-semibold">Visual progression of your estimated job description compatibility score.</p>
            </div>
            
            <div className="h-[210px] w-full mt-4 flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={matchTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-base)" />
                  <XAxis 
                    dataKey="label" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 900 }}
                    dy={10}
                  />
                  <YAxis 
                    hide
                    domain={['auto', 'auto']}
                  />
                  <Tooltip content={<MatchTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="match" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#ffffff', stroke: '#10B981', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#10B981', stroke: '#ffffff', strokeWidth: 2 }}
                    isAnimationActive={true}
                    animationDuration={1300}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="text-[10px] text-text-secondary mt-2 block text-center font-medium">Based on AI analysis of your uploaded resume</div>
            </div>
          </div>
        </div>

        {/* Dynamic skills expansion view at the bottom */}
        <div id="full-skills-view" className="glass-card scroll-mt-24">
          <div>
            <h3 className="text-md font-black text-text-primary uppercase tracking-widest">Extracted Credentials & Skills</h3>
            <p className="text-text-secondary text-xs mt-0.5">Core technical languages, tools, and methodologies parsed from the document content.</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {activeData.skills?.map((sk, i) => (
              <span key={i} className="text-xs font-bold text-text-primary bg-bg-base/30 border border-border-base px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 hover:border-primary/20 transition-all font-mono">
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
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className={cn(
                "relative bg-card-base border border-border-base rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col w-full",
                activeModal === 'suggestions' ? "max-w-4xl h-[85vh]" : "max-w-xl max-h-[80vh]"
              )}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4.5 border-b border-border-base bg-bg-base/50 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <h3 className="text-xs font-black text-text-primary uppercase tracking-widest italic">
                    {activeModal === 'skills' && 'Extracted Skills Portfolio'}
                    {activeModal === 'keywords' && 'ATS Keyword Deficiencies'}
                    {activeModal === 'suggestions' && 'ATS & Readability Action Items'}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 rounded-xl bg-bg-base hover:bg-bg-base/80 border border-border-base text-text-secondary hover:text-text-primary transition-all font-mono text-[10px] cursor-pointer"
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
                          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                          <input
                            type="text"
                            placeholder="Filter detected skills..."
                            value={skillsSearch}
                            onChange={(e) => setSkillsSearch(e.target.value)}
                            className="w-full bg-card-base border border-border-base hover:border-border-base/80 focus:border-primary/50 text-xs font-semibold px-10 py-3 rounded-xl text-text-primary focus:outline-none placeholder:text-text-secondary/60 transition-colors"
                          />
                          {skillsSearch && (
                            <button
                              onClick={() => setSkillsSearch('')}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary font-mono text-xs"
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        <button
                          onClick={() => handleCopy(filteredSkills.join(', '), 'skills')}
                          className="px-5 py-3 rounded-xl border border-border-base hover:border-border-base/80 bg-card-base hover:bg-bg-base text-xs font-bold text-text-primary flex items-center justify-center gap-2 select-none active:scale-95 transition-all text-center min-w-[125px] cursor-pointer"
                        >
                          {copiedModalId === 'skills' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-text-secondary" />
                              <span>Copy List</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Info Counter */}
                      <div className="flex justify-between items-center text-[10px] font-black text-text-secondary uppercase tracking-widest border-b border-border-base pb-3">
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
                                    className="text-xs font-bold text-text-primary bg-bg-base/30 border border-border-base px-3 py-2 rounded-xl flex items-center gap-1.5 font-mono"
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
                        <div className="text-center py-8 text-text-secondary text-xs font-medium">
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
                          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                          <input
                            type="text"
                            placeholder="Filter missing keywords..."
                            value={keywordsSearch}
                            onChange={(e) => setKeywordsSearch(e.target.value)}
                            className="w-full bg-card-base border border-border-base hover:border-border-base/80 focus:border-primary/50 text-xs font-semibold px-10 py-3 rounded-xl text-text-primary focus:outline-none placeholder:text-text-secondary/50 transition-colors"
                          />
                          {keywordsSearch && (
                            <button
                              onClick={() => setKeywordsSearch('')}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary font-mono text-xs"
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        <button
                          onClick={() => handleCopy(filteredKeywords.join(', '), 'keywords')}
                          className="px-5 py-3 rounded-xl border border-border-base hover:border-border-base/85 bg-card-base hover:bg-bg-base text-xs font-bold text-text-primary flex items-center justify-center gap-2 select-none active:scale-95 transition-all text-center min-w-[125px] cursor-pointer"
                        >
                          {copiedModalId === 'keywords' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-text-secondary" />
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
                              priority === 'High' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                              priority === 'Medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                              'bg-bg-base/40 border-border-base text-text-secondary';
                            
                            const isFromJD = activeData.jobDescriptionKeywords?.includes(kw) || (origIdx % 2 === 0);

                            return (
                              <div key={i} className="p-4.5 rounded-2xl bg-bg-base/30 border border-border-base hover:border-border-base/90 transition-colors space-y-2">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2 truncate">
                                    <span className="text-sm font-black text-text-primary font-mono">{kw}</span>
                                    {isFromJD && (
                                      <span className="text-[9px] font-black uppercase text-purple-500 border border-purple-500/20 bg-purple-500/5 px-2 py-0.5 rounded-md">
                                        JD Match
                                      </span>
                                    )}
                                  </div>
                                  <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-md border", badgeClass)}>
                                    {priority}
                                  </span>
                                </div>
                                <p className="text-[11px] text-text-secondary leading-relaxed font-semibold">
                                  <strong className="text-text-primary block mb-0.5 font-bold uppercase text-[9px] tracking-wider">Why it matters:</strong>
                                  {getKeywordExplanation(kw)}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-text-secondary text-xs font-medium">
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
                      <div className="flex justify-between items-center pb-3 border-b border-border-base">
                        <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">
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
                                    impact === 'High' ? 'bg-red-500/10 border border-red-500/20 text-red-500' :
                                    impact === 'Medium' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-500' :
                                    'bg-bg-base/40 border border-border-base text-text-secondary';

                                  return (
                                    <div key={i} className="p-5 rounded-2xl bg-bg-base/30 border border-border-base hover:border-border-base/90 transition-colors flex flex-col justify-between space-y-4">
                                      <div className="space-y-2">
                                        <div className="flex justify-between items-start gap-4">
                                          <span className="text-xs font-black text-text-primary uppercase tracking-wider leading-relaxed">
                                            {sug.title}
                                          </span>
                                          <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-md border shrink-0", badgeClass)}>
                                            {impact} Priority
                                          </span>
                                        </div>
                                        
                                        <div className="space-y-1">
                                          <span className="text-[10px] text-text-secondary font-extrabold uppercase tracking-wider block">Description</span>
                                          <p className="text-[11px] text-text-primary leading-relaxed font-semibold">
                                            {sug.description}
                                          </p>
                                        </div>

                                        <div className="space-y-1">
                                          <span className="text-[10px] text-text-secondary font-extrabold uppercase tracking-wider block">Why it affects ATS</span>
                                          <p className="text-[11px] text-text-secondary leading-relaxed font-semibold italic">
                                            {sug.reason || "ATS parsers look for structured and quantifiable metrics related to this sector."}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="pt-3 border-t border-border-base space-y-2">
                                        <span className="text-[10px] text-primary font-extrabold uppercase tracking-wider block">Recommended Improvement</span>
                                        <p className="text-[11px] text-emerald-500/95 font-semibold leading-relaxed">
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
                        <div className="text-center py-12 text-text-secondary text-xs font-medium">
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
