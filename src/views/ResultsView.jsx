import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { refineResume } from '../utils/resumeAnalyzer';
import { ScoreGauge } from '../components/ScoreGauge';
import { BadgeList } from '../components/BadgeList';
import { SuggestionCard } from '../components/SuggestionCard';
import { Mail, Briefcase, User, Download, Share2, ExternalLink, CheckCircle, Sparkles, Loader2, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export const ResultsView = ({ data }) => {
  if (!data) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-4 bg-white border border-zinc-200 rounded-3xl shadow-sm">
        <div className="w-16 h-16 bg-slate-50 border border-zinc-200 rounded-2xl flex items-center justify-center mx-auto text-zinc-400 shadow-xs animate-pulse-slow">
          <Target className="w-8 h-8 text-primary" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-zinc-800 uppercase tracking-wider">No Optimization Selected</p>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto px-4 leading-relaxed font-semibold">
            Please navigate to the History tab and retrieve a prior analysis card to view detailed results.
          </p>
        </div>
      </div>
    );
  }

  const [appliedSuggestions, setAppliedSuggestions] = useState([]);
  const [showRefineModal, setShowRefineModal] = useState(false);
  const [refinedResumeText, setRefinedResumeText] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [refineError, setRefineError] = useState(null);

  const handleDownload = () => {
    const doc = new jsPDF();
    
    // Page Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(20, 20, 20);
    doc.text("RESUAI Analysis Report", 20, 25);
    
    // Divider
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 30, 190, 30);
    
    // Candidate Profile Info
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Candidate Name:", 20, 42);
    doc.setFont("helvetica", "normal");
    doc.text(data.name || 'N/A', 60, 42);
    
    doc.setFont("helvetica", "bold");
    doc.text("Target Role:", 20, 50);
    doc.setFont("helvetica", "normal");
    doc.text(data.role || 'N/A', 60, 50);
    
    doc.setFont("helvetica", "bold");
    doc.text("Email Address:", 20, 58);
    doc.setFont("helvetica", "normal");
    doc.text(data.email || 'N/A', 60, 58);
    
    doc.setFont("helvetica", "bold");
    doc.text("ATS Score:", 20, 66);
    doc.setFont("helvetica", "bold");
    // green for high score, amber/red for lower
    if (data.score >= 70) {
        doc.setTextColor(34, 139, 34);
    } else {
        doc.setTextColor(190, 53, 34);
    }
    doc.text(`${data.score}/100`, 60, 66);
    
    doc.setTextColor(20, 20, 20);
    doc.line(20, 72, 190, 72);
    
    // Sections - Skills list
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Identified Skills", 20, 82);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const skillsText = data.skills && data.skills.length > 0 ? data.skills.join(', ') : "None identified";
    const splitSkills = doc.splitTextToSize(skillsText, 170);
    doc.text(splitSkills, 20, 88);
    
    let yOffset = 88 + (splitSkills.length * 5) + 6;
    doc.line(20, yOffset - 3, 190, yOffset - 3);
    
    // Sections - Missing Keywords List
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Keyword Gaps (Missing Keywords)", 20, yOffset);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const missingText = data.missingKeywords && data.missingKeywords.length > 0 ? data.missingKeywords.join(', ') : "None missing";
    const splitMissing = doc.splitTextToSize(missingText, 170);
    doc.text(splitMissing, 20, yOffset + 6);
    
    yOffset = yOffset + 6 + (splitMissing.length * 5) + 6;
    doc.line(20, yOffset - 3, 190, yOffset - 3);
    
    // Sections - Actionable Suggestions list
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Actionable Suggestions", 20, yOffset);
    doc.setFontSize(10);
    
    if (data.suggestions && data.suggestions.length > 0) {
      data.suggestions.forEach((suggest, index) => {
        const itemY = yOffset + 8 + (index * 18);
        if (itemY > 280) {
          doc.addPage();
          yOffset = 20; // reset
        }
        
        doc.setFont("helvetica", "bold");
        doc.text(`${index + 1}. ${suggest.title} [Impact: ${suggest.impact}]`, 20, yOffset + 8 + (index * 18));
        doc.setFont("helvetica", "normal");
        const splitDesc = doc.splitTextToSize(suggest.description, 170);
        doc.text(splitDesc, 20, yOffset + 13 + (index * 18));
      });
    } else {
      doc.setFont("helvetica", "normal");
      doc.text("No suggestions found.", 20, yOffset + 6);
    }
    
    const filename = `${(data.name || 'Resume').replace(/\s+/g, '_')}_Resume_Analysis.pdf`;
    doc.save(filename);
  };

  const handleShare = async () => {
    const textSummary = `Resume Analysis Results for ${data.name || 'Candidate'}:
Role: ${data.role || 'Unknown'}
ATS Score: ${data.score}/100
Skills Identified: ${data.skills ? data.skills.join(', ') : 'None'}
Missing Keywords: ${data.missingKeywords ? data.missingKeywords.join(', ') : 'None'}
Top Suggestion: ${data.suggestions && data.suggestions.length > 0 ? `${data.suggestions[0].title} (${data.suggestions[0].impact} Impact)` : 'None'}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Resume Analysis for ${data.name || 'Candidate'}`,
          text: textSummary,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing page:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(textSummary);
        alert('Insights summary copied to clipboard!');
      } catch (err) {
        console.error('Clipboard copy failed:', err);
        alert('Failed to copy share summary.');
      }
    }
  };

  const handleRefineProfile = async () => {
    setShowRefineModal(true);
    setIsRefining(true);
    setRefineError(null);

    const originalText = data.originalText || `Name: ${data.name}\nRole: ${data.role}\nEmail: ${data.email}\nSkills: ${data.skills?.join(', ') || 'None'}`;
    
    try {
      const refined = await refineResume(originalText, appliedSuggestions);
      setRefinedResumeText(refined);
    } catch (err) {
      console.error("Refinement failed:", err);
      setRefineError(err.message || "Failed to refine resume. Please try again.");
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Header Profile Section */}
      <div className="glass-card p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-zinc-200 bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-primary/20 uppercase">
            {data.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h1 className="text-3xl font-black text-zinc-850 tracking-tight">{data.name}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-zinc-500">
              <div className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide">
                <Briefcase className="w-4 h-4 text-primary" />
                {data.role}
              </div>
              <div className="flex items-center gap-1.5 text-sm font-medium border-l border-zinc-200 pl-4">
                <Mail className="w-4 h-4 text-primary" />
                <span className="opacity-70">{data.email}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDownload}
            className="px-5 py-3 rounded-xl border border-zinc-200 bg-white text-zinc-650 font-bold tracking-widest text-[10px] uppercase hover:bg-slate-50 transition-all flex items-center gap-2.5 cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4" />
            Download report
          </button>
          <button 
            onClick={handleShare}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark hover:opacity-95 text-white font-extrabold tracking-widest text-[10px] uppercase transition-all shadow-md shadow-primary/20 flex items-center gap-2.5 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            Share insights
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Score & Skills Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Detected Resume Domain Card */}
          {(() => {
            const detectedDomains = data.detectedDomains || [
              { domain: data.domain || 'General Professional', confidence: data.domainConfidence === 'high' ? 92 : 65 }
            ];
            const primaryClassification = detectedDomains[0] || { domain: 'General Professional', confidence: 65 };
            const isFallback = primaryClassification.confidence < 70 || primaryClassification.domain === 'General Professional';
            const secondaryClassification = detectedDomains[1];

            return (
              <div className="glass-card p-8 border border-zinc-200 bg-white flex flex-col gap-6 relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-tr from-blue-50 to-indigo-50 border border-indigo-100 text-indigo-500 shadow-sm shrink-0">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-440 tracking-[0.2em] block leading-none mb-1.5">Detected Resume Domain</span>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                      <h4 className="text-xl font-extrabold text-zinc-800 tracking-tight uppercase leading-none">
                        {isFallback ? 'General Professional' : primaryClassification.domain}
                      </h4>
                      <span className="text-[10px] font-bold text-indigo-650 bg-gradient-to-r from-blue-50/60 via-purple-50/60 to-cyan-50/60 border border-purple-100 px-2.5 py-1 rounded-lg shadow-xs select-none">
                        Confidence: {isFallback ? Math.min(69, primaryClassification.confidence) : primaryClassification.confidence}%
                      </span>
                    </div>
                  </div>
                </div>

                {secondaryClassification && !isFallback && (
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-550 pl-1 border-t border-zinc-100 pt-4">
                    <span className="text-zinc-400 uppercase text-[9px] tracking-wider leading-none">Secondary Domain:</span>
                    <span className="text-zinc-700 leading-none">{secondaryClassification.domain}</span>
                    <span className="text-[10px] font-bold text-indigo-650 bg-gradient-to-r from-indigo-50/60 to-purple-50/60 px-2 py-0.5 rounded-md border border-indigo-100 select-none">({secondaryClassification.confidence}%)</span>
                  </div>
                )}

                <p className="text-[12px] text-zinc-500 leading-relaxed font-medium">
                  {isFallback ? (
                    "This resume's career category could not be classified with high confidence, or spans highly diverse disciplines. Recommendations have fallen back to general ATS layout, spelling grammar, structure, and formatting metrics."
                  ) : (
                    `This resume has been identified as a ${primaryClassification.domain} resume based on the candidate's skills, experience, projects, education, certifications, and industry-specific keywords. All analytics and recommendations below are tailored to this domain.`
                  )}
                </p>
              </div>
            );
          })()}

          {/* Hero Score Card */}
          <div className="glass-card p-8 flex flex-col md:flex-row items-center gap-10 bg-white border border-zinc-200 shadow-sm">
            <ScoreGauge score={data.score} />
            <div className="flex-1 space-y-5">
              {(() => {
                const getScoreDetails = (score, role) => {
                  if (score >= 90) {
                    return {
                      rank: 'Strong Match',
                      evaluation: 'Recommended',
                      color: 'text-purple-600',
                      feedback: (
                        <>Your resume performs exceptionally well for the <span className="text-purple-600 font-bold italic underline decoration-purple-300 underline-offset-4">{role || 'target'}</span> position. You've demonstrated flawless expertise with perfect ATS compatibility!</>
                      )
                    };
                  } else if (score >= 80) {
                    return {
                      rank: 'Excellent',
                      evaluation: 'Above Average',
                      color: 'text-indigo-600',
                      feedback: (
                        <>Your resume is highly competitive for the <span className="text-indigo-600 font-bold italic underline decoration-indigo-300 underline-offset-4">{role || 'target'}</span> position. You have strong keyword alignment, though there is minor room to optimize your keyword density.</>
                      )
                    };
                  } else if (score >= 65) {
                    return {
                      rank: 'Above Average',
                      evaluation: 'Strong Match',
                      color: 'text-blue-600',
                      feedback: (
                        <>Your resume has a solid foundation for the <span className="text-blue-600 font-bold italic underline decoration-blue-300 underline-offset-4">{role || 'target'}</span> position but requires more keyword optimization and structural refinement to consistently pass strict ATS filters.</>
                      )
                    };
                  } else if (score >= 50) {
                    return {
                      rank: 'Competitive',
                      evaluation: 'Above Average',
                      color: 'text-orange-500',
                      feedback: (
                        <>Your resume needs significant improvement for the <span className="text-orange-500 font-bold italic underline decoration-orange-300 underline-offset-4">{role || 'target'}</span> position. It is likely missing critical keywords or formatting needed to clear ATS screens. Please review the missing gaps below.</>
                      )
                    };
                  } else {
                    return {
                      rank: 'Needs Review',
                      evaluation: 'Competitive',
                      color: 'text-red-500',
                      feedback: (
                        <>Your resume currently struggles against basic ATS requirements for the <span className="text-red-500 font-bold italic underline decoration-red-350 override-decoration underline-offset-4">{role || 'target'}</span> position. We highly recommend rebuilding based on our targeted suggestions.</>
                      )
                    };
                  }
                };

                const scoreDetails = getScoreDetails(data.score, data.role);
                return (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
                      <h3 className="text-2xl font-extrabold text-zinc-800 uppercase tracking-tighter">Analysis Summary</h3>
                    </div>
                    <p className="text-zinc-650 leading-relaxed font-medium text-sm">
                      {scoreDetails.feedback}
                    </p>
                    <div className="flex items-center gap-6 pt-3 border-t border-zinc-100">
                      <div className="flex flex-col">
                        <span className="text-2xl font-black text-zinc-800 tracking-tight">{scoreDetails.rank}</span>
                        <span className="text-[9px] uppercase font-bold text-zinc-440 tracking-[0.2em] mt-1.5">Candidate Rank</span>
                      </div>
                      <div className="w-px h-10 bg-zinc-200" />
                      <div className="flex flex-col">
                        <span className={`text-2xl font-black tracking-tight ${scoreDetails.color}`}>{scoreDetails.evaluation}</span>
                        <span className="text-[9px] uppercase font-bold text-zinc-440 tracking-[0.2em] mt-1.5">ATS Evaluation</span>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Skills Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-8 space-y-5 border border-zinc-200 shadow-sm bg-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-black text-zinc-800 uppercase tracking-tighter italic">Identified Skills</h3>
                <span className="text-[9px] font-black text-primary bg-primary/10 px-2.5 py-1 rounded-lg uppercase tracking-widest border border-primary/20">Found {data.skills.length}</span>
              </div>
              <BadgeList items={data.skills} type="success" />
            </div>

            <div className="glass-card p-8 space-y-5 border border-zinc-200 shadow-sm bg-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-black text-zinc-800 uppercase tracking-tighter italic">Keyword Gaps</h3>
                <span className="text-[9px] font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg uppercase tracking-widest border border-amber-200">Missing {data.missingKeywords.length}</span>
              </div>
              <BadgeList items={data.missingKeywords} type="neutral" />
            </div>
          </div>
        </div>

        {/* Suggestions Column */}
        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-extrabold text-zinc-800 tracking-tighter uppercase">Quick Tweaks</h3>
            <ExternalLink className="w-4 h-4 text-zinc-405" />
          </div>
          <div className="space-y-5">
            {data.suggestions.map((suggestion, idx) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
              >
                <SuggestionCard 
                  suggestion={suggestion} 
                  isApplied={appliedSuggestions.some(s => s.id === suggestion.id)}
                  onToggleApply={() => {
                    setAppliedSuggestions(prev => {
                      if (prev.some(s => s.id === suggestion.id)) {
                        return prev.filter(s => s.id !== suggestion.id);
                      } else {
                        return [...prev, suggestion];
                      }
                    });
                  }}
                />
              </motion.div>
            ))}
          </div>
          
          <div className="p-8 rounded-[2rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 border-0 shadow-xl shadow-primary/10 relative overflow-hidden group transition-all duration-300 hover:shadow-2xl">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-30 transition-all group-hover:scale-110">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <h4 className="font-extrabold text-white mb-2 relative z-10 uppercase tracking-tighter text-lg">Pro Strategy</h4>
            <p className="text-[13px] text-white/80 leading-relaxed mb-6 relative z-10 transition-colors font-medium">
              Integrating certifications like 'AWS Certified Developer' could boost your ATS score by up to 12 points for this role.
            </p>
            <button 
              onClick={handleRefineProfile}
              className="w-full text-[10px] font-extrabold text-indigo-600 bg-white hover:bg-slate-50 transition-all px-6 py-3 rounded-xl relative z-10 uppercase tracking-[0.2em] shadow-lg shadow-white/5 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Refine profile
            </button>
          </div>
        </div>
      </div>

      {/* Refine Profile Comparison Modal */}
      {showRefineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 md:p-8">
          <div className="glass-card w-full max-w-5xl max-h-[90vh] flex flex-col p-6 md:p-8 border border-zinc-200 bg-white relative overflow-hidden shadow-2xl">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 pb-4 mb-4">
              <div>
                <h3 className="text-2xl font-black text-zinc-800 uppercase tracking-tight italic flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                  Profile Refinement Summary
                </h3>
                <p className="text-zinc-500 text-xs mt-1">
                  Comparing original details against the suggestions applied ({appliedSuggestions.length} applied).
                </p>
              </div>
              <button 
                onClick={() => {
                  setShowRefineModal(false);
                  setRefinedResumeText('');
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center border border-zinc-200 text-zinc-400 hover:text-zinc-700 hover:bg-slate-50 transition-colors font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body: Side by Side Comparison */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[300px] py-2 pr-1">
              
              {/* Original Left Column */}
              <div className="flex flex-col h-full min-h-[250px] border border-zinc-200 p-5 rounded-2xl bg-slate-50/50">
                <span className="text-[10px] font-black tracking-widest uppercase text-zinc-400 mb-3 block">
                  Original Resume Segment
                </span>
                <div className="flex-1 overflow-y-auto text-zinc-650 border border-zinc-200 rounded-xl bg-white shadow-xs text-xs leading-relaxed font-mono whitespace-pre-wrap max-h-[350px] p-3">
                  {data.originalText || "No original copy of resume text available."}
                </div>
              </div>

              {/* Improved Right Column */}
              <div className="flex flex-col h-full min-h-[250px] border border-zinc-200 p-5 rounded-2xl bg-slate-50/50 relative">
                <span className="text-[10px] font-black tracking-widest uppercase text-primary mb-3 block">
                  Refined Target Output (AI Generated)
                </span>
                
                {isRefining ? (
                  <div className="flex-1 flex flex-col items-center justify-center gap-3 py-16">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest animate-pulse">Running AI Refinement...</span>
                  </div>
                ) : refineError ? (
                  <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center border border-red-500/20 rounded-xl bg-red-500/5 p-4 py-8">
                    <span className="text-red-500 text-xs font-bold font-mono">Error: {refineError}</span>
                    <button 
                      onClick={handleRefineProfile}
                      className="px-4 py-2 mt-2 bg-zinc-100 hover:bg-zinc-200 text-[10px] font-black uppercase tracking-wider rounded-lg text-zinc-600 border border-zinc-200 transition-colors cursor-pointer"
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto text-zinc-700 border border-zinc-200 rounded-xl bg-white shadow-xs text-xs leading-relaxed font-mono whitespace-pre-wrap max-h-[350px] p-3">
                    {refinedResumeText || "Select tweaks and start refine sequence."}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 border-t border-zinc-200 pt-4 mt-4">
              <button 
                onClick={() => {
                  setShowRefineModal(false);
                  setRefinedResumeText('');
                }}
                className="px-5 py-3 rounded-xl border border-zinc-200 text-zinc-550 font-bold uppercase tracking-widest text-[9px] hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Close View
              </button>
              <button 
                onClick={() => {
                  if (!refinedResumeText) return;
                  const doc = new jsPDF();
                  doc.setFont("helvetica", "bold");
                  doc.setFontSize(22);
                  doc.text("RESUAI Refined Resume", 20, 25);
                  doc.setDrawColor(200, 200, 200);
                  doc.line(20, 30, 190, 30);
                  
                  doc.setFont("helvetica", "normal");
                  doc.setFontSize(10);
                  const splitLines = doc.splitTextToSize(refinedResumeText, 170);
                  
                  let currentY = 40;
                  splitLines.forEach(line => {
                    if (currentY > 275) {
                      doc.addPage();
                      currentY = 20;
                    }
                    doc.text(line, 20, currentY);
                    currentY += 5;
                  });
                  
                  const filename = `${(data.name || 'Refined').replace(/\s+/g, '_')}_Refined_Resume.pdf`;
                  doc.save(filename);
                }}
                disabled={!refinedResumeText}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark hover:opacity-95 disabled:opacity-40 disabled:hover:from-primary disabled:hover:to-primary-dark font-extrabold uppercase text-white tracking-widest text-[9px] transition-all shadow-md shadow-primary/20 cursor-pointer"
              >
                Download Refined Resume (.pdf)
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
