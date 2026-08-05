/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Calendar, LogOut, MapPin, Briefcase, Plus, Trash2, 
  Award, ShieldAlert, Star, ShieldCheck, ExternalLink, Edit3, Check, X, Camera, FileText 
} from 'lucide-react';
import { auth } from '../firebase';
import { signOut, updateProfile } from 'firebase/auth';
import { motion } from 'framer-motion';

export const ProfileView = ({ user }) => {
  const uid = user?.uid || 'default';
  
  // Editable profile states
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || localStorage.getItem(`profile_name_${uid}`) || 'User');
  const [role, setRole] = useState(localStorage.getItem(`profile_role_${uid}`) || 'Senior Full-Stack Engineer');
  const [location, setLocation] = useState(localStorage.getItem(`profile_location_${uid}`) || 'San Francisco, CA');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Skills state
  const [skills, setSkills] = useState(() => {
    const saved = localStorage.getItem(`profile_skills_${uid}`);
    return saved ? JSON.parse(saved) : ['React', 'Node.js', 'System Design', 'Python', 'Tailwind CSS', 'TypeScript', 'ATS Strategy'];
  });
  const [newSkill, setNewSkill] = useState('');

  // Save details to Firebase profile and localStorage
  const handleSaveProfile = async () => {
    setIsEditing(false);
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName });
      }
      localStorage.setItem(`profile_name_${uid}`, displayName);
      localStorage.setItem(`profile_role_${uid}`, role);
      localStorage.setItem(`profile_location_${uid}`, location);
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setDisplayName(user?.displayName || localStorage.getItem(`profile_name_${uid}`) || 'User');
    setRole(localStorage.getItem(`profile_role_${uid}`) || 'Senior Full-Stack Engineer');
    setLocation(localStorage.getItem(`profile_location_${uid}`) || 'San Francisco, CA');
  };

  // Skill controllers
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updated = [...skills, newSkill.trim()];
      setSkills(updated);
      localStorage.setItem(`profile_skills_${uid}`, JSON.stringify(updated));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updated = skills.filter(s => s !== skillToRemove);
    setSkills(updated);
    localStorage.setItem(`profile_skills_${uid}`, JSON.stringify(updated));
  };

  const userInitial = displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      
      {/* Save Success Alert Banner */}
      {saveSuccess && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 right-8 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-emerald-500 border border-emerald-400 text-white font-semibold text-sm shadow-lg max-w-sm"
        >
          <Check className="w-5 h-5 shrink-0" />
          <span>Profile changes saved successfully!</span>
        </motion.div>
      )}

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Cover, Avatar, Profile Card & Skills */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card no-padding overflow-hidden relative">
            {/* Cover Banner */}
            <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-black/15 to-transparent pointer-events-none" />
            </div>

            {/* Profile Header Details Layout */}
            <div className="px-6 pb-6 relative">
              {/* Rounded Avatar overlapping banner */}
              <div className="relative -mt-16 mb-4 flex items-end justify-between">
                <div className="relative group">
                  <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-blue-500 to-purple-500 p-[3px] shadow-md relative bg-card-base">
                    <div className="w-full h-full rounded-2xl bg-bg-base border border-border-base flex items-center justify-center text-text-primary font-black text-4xl select-none">
                      {userInitial}
                    </div>
                  </div>
                  <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-card-base rounded-full shadow-sm animate-pulse" title="Active now" />
                </div>

                {/* Edit details button */}
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 px-4 py-2 border border-border-base text-text-secondary hover:text-text-primary hover:bg-bg-base rounded-xl transition-all font-bold text-xs uppercase tracking-wider shadow-sm active:scale-95 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button 
                      onClick={cancelEditing}
                      className="p-2 border border-red-500/20 hover:bg-red-500/10 text-red-500 rounded-xl transition-all cursor-pointer shadow-sm"
                      title="Cancel Changes"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={handleSaveProfile}
                      className="flex items-center gap-1 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-primary/10 active:scale-95 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Save
                    </button>
                  </div>
                )}
              </div>

              {/* User Editable Fields */}
              <div className="space-y-4">
                {!isEditing ? (
                  <div>
                    <h2 className="text-2xl font-black text-text-primary tracking-tight">{displayName}</h2>
                    <p className="font-bold text-sm text-primary mt-1 flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-primary/80" />
                      {role}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 pt-3 border-t border-border-base">
                      <p className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-text-secondary/70" />
                        {location}
                      </p>
                      <p className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-text-secondary/70" />
                        {user?.email}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 bg-bg-base/40 p-4 border border-border-base rounded-2xl">
                    <div>
                      <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest block mb-1">Full Name</label>
                      <input 
                        type="text" 
                        value={displayName}
                        onChange={e => setDisplayName(e.target.value)}
                        className="w-full bg-card-base border border-border-base rounded-xl px-3 py-1.5 text-sm font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest block mb-1">Professional Role</label>
                      <input 
                        type="text" 
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        className="w-full bg-card-base border border-border-base rounded-xl px-3 py-1.5 text-sm font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest block mb-1">Location</label>
                      <input 
                        type="text" 
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        className="w-full bg-card-base border border-border-base rounded-xl px-3 py-1.5 text-sm font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Skill Cards Card Block */}
          <div className="glass-card space-y-4">
            <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-widest">Skill Inventory</p>
              <h3 className="text-lg font-black text-text-primary tracking-tight mt-0.5">Core Competencies</h3>
            </div>

            {/* List of Skills chips */}
            <div className="flex flex-wrap gap-2 py-1">
              {skills.map((skill) => (
                <div 
                  key={skill}
                  className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border-base bg-bg-base/40 hover:bg-bg-base text-xs font-bold text-text-secondary hover:text-text-primary transition-all select-none"
                >
                  <span>{skill}</span>
                  <button 
                    onClick={() => handleRemoveSkill(skill)}
                    className="p-0.5 hover:bg-red-500/10 hover:text-red-500 rounded-md transition-colors cursor-pointer"
                    title={`Delete ${skill}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {skills.length === 0 && (
                <p className="text-xs font-semibold text-text-secondary py-2">No skills registered yet. Add some below!</p>
              )}
            </div>

            {/* Add Skill form */}
            <form onSubmit={handleAddSkill} className="flex gap-2 pt-2 border-t border-border-base/40">
              <input 
                type="text" 
                placeholder="Add new skill (e.g. AWS)"
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                className="flex-1 bg-bg-base border border-border-base rounded-xl pl-3 pr-2 py-2 text-xs font-semibold text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button 
                type="submit"
                className="p-2 bg-primary hover:bg-primary-dark text-white rounded-xl transition-all shadow-md shadow-primary/20 active:scale-95 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Account Tier Box */}
          <div className="glass-card flex justify-between items-center text-xs font-semibold text-text-secondary bg-bg-base/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-555/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-[10px] font-black text-text-secondary uppercase tracking-wider">Current Account Tier</p>
                <p className="text-[13px] font-semibold text-text-primary mt-0.5">Pro Enterprise Elite</p>
              </div>
            </div>
            <a href="#billing" className="text-[10px] font-extrabold uppercase text-primary hover:underline tracking-wider">Manage</a>
          </div>
        </div>

        {/* Right Column: Achievements, Certificates, Timeline */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Achievements Block */}
          <div className="glass-card space-y-5">
            <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-widest">Platform Badges</p>
              <h3 className="text-xl font-black text-text-primary tracking-tight mt-0.5">Achievements</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition-all text-center flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-550 mb-3 shadow-xs">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <h4 className="font-extrabold text-xs text-amber-600 dark:text-amber-450 uppercase tracking-wide">ATS Master</h4>
                <p className="text-[10px] font-bold text-text-secondary mt-1">Scored &gt; 85% in resume analyses</p>
              </div>

              <div className="p-4 rounded-2xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 transition-all text-center flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 mb-3 shadow-xs">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-xs text-purple-600 dark:text-purple-400 uppercase tracking-wide">High Authority</h4>
                <p className="text-[10px] font-bold text-text-secondary mt-1">First shared resume link created</p>
              </div>

              <div className="p-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 transition-all text-center flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500 mb-3 shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-xs text-cyan-600 dark:text-cyan-400 uppercase tracking-wide">Profile Verified</h4>
                <p className="text-[10px] font-bold text-text-secondary mt-1">Successfully synced with Google Auth</p>
              </div>

            </div>
          </div>

          {/* Certificates Block */}
          <div className="glass-card space-y-4">
            <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-widest">Verify Credentials</p>
              <h3 className="text-xl font-black text-text-primary tracking-tight mt-0.5">Certificates</h3>
            </div>

            <div className="space-y-3">
              
              <div className="p-4 border border-border-base hover:border-primary/20 bg-bg-base/30 rounded-2xl transition-all flex flex-col sm:flex-row items-stretch sm:items-start gap-4 justify-between">
                <div className="flex gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-extrabold text-sm text-text-primary text-zinc-850 dark:text-zinc-200 break-words">AWS Certified Solutions Architect</h4>
                    <p className="text-[10px] font-bold text-text-secondary mt-0.5">Amazon Web Services • Issued Jul 2025</p>
                    <p className="text-[9px] font-mono text-text-secondary/70 mt-1">Cred ID: AWS-ASA-78921</p>
                  </div>
                </div>
                <button className="flex items-center justify-center sm:justify-start gap-1 p-2 sm:p-0 rounded-xl sm:rounded-none bg-bg-base sm:bg-transparent border sm:border-0 border-border-base text-[10px] font-extrabold text-text-secondary hover:text-text-primary uppercase tracking-wider transition-colors cursor-pointer select-none shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                  Verify <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="p-4 border border-border-base hover:border-primary/20 bg-bg-base/30 rounded-2xl transition-all flex flex-col sm:flex-row items-stretch sm:items-start gap-4 justify-between">
                <div className="flex gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-extrabold text-sm text-text-primary text-zinc-850 dark:text-zinc-200 break-words">System Design Fundamentals</h4>
                    <p className="text-[10px] font-bold text-text-secondary mt-0.5">ByteByteGo Certification Academy • Issued Mar 2026</p>
                    <p className="text-[9px] font-mono text-text-secondary/70 mt-1">Cred ID: BBG-SYSD-5321A</p>
                  </div>
                </div>
                <button className="flex items-center justify-center sm:justify-start gap-1 p-2 sm:p-0 rounded-xl sm:rounded-none bg-bg-base sm:bg-transparent border sm:border-0 border-border-base text-[10px] font-extrabold text-text-secondary hover:text-text-primary uppercase tracking-wider transition-colors cursor-pointer select-none shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                  Verify <ExternalLink className="w-3 h-3" />
                </button>
              </div>

            </div>
          </div>

          {/* Timeline Block */}
          <div className="glass-card space-y-5">
            <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-widest">Platform Logs</p>
              <h3 className="text-xl font-black text-text-primary tracking-tight mt-0.5">Timeline Experience</h3>
            </div>

            <div className="relative pl-6 border-l border-border-base space-y-6 ml-3 py-1">
              
              {/* Timeline Item 1 */}
              <div className="relative">
                <span className="absolute -left-[30px] top-1 w-4 h-4 bg-primary rounded-full border-[3px] border-card-base flex items-center justify-center ring-2 ring-primary/10" />
                <div>
                  <span className="px-2 py-0.5 text-[9px] font-extrabold text-primary bg-primary/10 rounded-md uppercase tracking-wider">Current Status</span>
                  <h4 className="font-extrabold text-sm text-text-primary tracking-tight mt-1.5">Profile Upgraded to Pro Elite Tier</h4>
                  <p className="text-xs font-semibold text-text-secondary mt-1">Access unlimited AI prompts, enhanced score gauges, strict parsing options, and analytics views.</p>
                  <p className="text-[9px] font-bold text-text-secondary mt-1.5 flex items-center gap-1"><Calendar className="w-3 h-3" /> July 2026</p>
                </div>
              </div>

              {/* Timeline Item 2 */}
              <div className="relative">
                <span className="absolute -left-[30px] top-1 w-4 h-4 bg-purple-500 rounded-full border-[3px] border-card-base flex items-center justify-center ring-2 ring-purple-500/10" />
                <div>
                  <h4 className="font-extrabold text-sm text-text-primary tracking-tight">Achieved Gold Resume Match (87 ATS Score)</h4>
                  <p className="text-xs font-semibold text-text-secondary mt-1">Successfully analyzed resume for Senior Software Architect role matching 94% of keywords.</p>
                  <p className="text-[9px] font-bold text-text-secondary mt-1.5 flex items-center gap-1"><Calendar className="w-3 h-3" /> July 2026</p>
                </div>
              </div>

              {/* Timeline Item 3 */}
              <div className="relative">
                <span className="absolute -left-[30px] top-1 w-4 h-4 bg-blue-500 rounded-full border-[3px] border-card-base flex items-center justify-center ring-2 ring-blue-500/10" />
                <div>
                  <h4 className="font-extrabold text-sm text-text-primary tracking-tight">Joined ResuAI platform</h4>
                  <p className="text-xs font-semibold text-text-secondary mt-1">Authenticated via Google Auth services and established secure user workspace.</p>
                  <p className="text-[9px] font-bold text-text-secondary mt-1.5 flex items-center gap-1"><Calendar className="w-3 h-3" /> June 2026</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

