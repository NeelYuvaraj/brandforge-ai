import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Monitor, Smartphone, Sparkles, RefreshCw, ChevronRight, Check, 
  HelpCircle, Star, Mail, Phone, Download, ArrowLeft,
  X, Layers, Trash2, Award, Zap, Sliders, Play, Brain, Wand2
} from 'lucide-react';

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
import { useBrandData } from '../context/BrandContext';
import { THEME_STYLES, MOTION_PRESETS } from '../styles/themes';

const easeOut = [0.16, 1, 0.3, 1];

// Short rotating captions shown while a section "regenerates".
// Purely presentational — the actual regenerate logic/timing is unchanged.
const THINKING_STEPS = [
  "Reading your answers...",
  "Weighing skill emphasis...",
  "Refining phrasing..."
];

/**
 * Wraps occurrences of the person's own role/skills/name inside AI-generated
 * text with a subtle highlight, so the output visibly traces back to their
 * own answers instead of reading as generic boilerplate.
 * Pure presentation — does not alter the underlying string content.
 */
function highlightPersonalTerms(text, terms = []) {
  const cleanTerms = [...new Set(terms.filter(Boolean).map(t => t.trim()).filter(t => t.length > 1))];
  if (!text || cleanTerms.length === 0) return text;

  const escaped = cleanTerms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = text.split(pattern);

  return parts.map((part, i) =>
    cleanTerms.some(t => t.toLowerCase() === part.toLowerCase()) ? (
      <span key={i} className="text-indigo-400 font-semibold">{part}</span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

export default function PortfolioGenerator() {
  const { 
    answers, updateAnswer, aiOptions, applyScoreFix, resetBrandForm 
  } = useBrandData();

  const [previewMode, setPreviewMode] = useState('desktop'); // desktop, mobile — unchanged
  const [showScoreDetail, setShowScoreDetail] = useState(false); // unchanged
  const [regeneratingSection, setRegeneratingSection] = useState(null); // unchanged
  const [thinkingStepIndex, setThinkingStepIndex] = useState(0); // new: purely visual caption cycling

  const themeClass = THEME_STYLES[answers.theme] || THEME_STYLES.apple;
  const motionClass = MOTION_PRESETS[answers.animation] || MOTION_PRESETS.fancy;

  // Terms used to prove personalization by highlighting them inside AI text
  const personalTerms = useMemo(
    () => [answers.role, answers.name, ...(answers.skills || []).slice(0, 6)],
    [answers.role, answers.name, answers.skills]
  );

  // Handle section regenerations (simulate refreshing contents)
  // Same total duration and same underlying data mutation as before —
  // only the mid-flight captions are new, cycling every ~350ms.
  const triggerRegenerate = (section) => {
    setRegeneratingSection(section);
    setThinkingStepIndex(0);
    const captionInterval = setInterval(() => {
      setThinkingStepIndex(i => (i + 1) % THINKING_STEPS.length);
    }, 350);

    setTimeout(() => {
      clearInterval(captionInterval);
      setRegeneratingSection(null);
      if (section === 'headline') {
        const nextHeadline = aiOptions.headlines[(aiOptions.headlines.indexOf(answers.selectedHeadline) + 1) % aiOptions.headlines.length];
        updateAnswer('selectedHeadline', nextHeadline);
      } else if (section === 'projects') {
        // Toggle custom or default configurations
        const currentProjects = [...answers.projects];
        if (currentProjects.length > 0) {
          const shuffled = [...currentProjects].reverse();
          updateAnswer('projects', shuffled);
        }
      }
    }, 1200); // unchanged timing — kept within the "fast" 1-2s budget
  };

  const handleDownloadSimulate = () => {
    alert("Simulating PDF download: Generating resume parsing certificate and exporting portfolio package...");
  };

  // One-line rationale for a given headline, built entirely from data
  // already in `answers` — no new AI call, just narrating existing data.
  const getHeadlineRationale = (headline, index) => {
    const topSkill = (answers.skills || [])[0];
    if (index === 0) return `Leads with your role${answers.role ? ` (${answers.role})` : ''} for immediate clarity.`;
    if (topSkill && headline.toLowerCase().includes(topSkill.toLowerCase())) {
      return `Highlights ${topSkill}, your first listed skill.`;
    }
    return "Alternate framing based on your interview answers.";
  };

  const bioReasoning = `Based on your role${answers.role ? ` (${answers.role})` : ''}${
    answers.skills?.length ? ` and ${answers.skills.length} listed skills` : ''
  }, tuned for a ${answers.bioType || 'professional'} tone.`;

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-100 flex flex-col font-sans select-none">

      {/* Editor Main Navbar Controls */}
      <nav className="bg-[#0A0A0B] border-b border-white/10 py-3 px-6 flex flex-col sm:flex-row items-center justify-between gap-4 z-20 relative">
        <div className="flex items-center gap-3">
          <button 
            onClick={resetBrandForm}
            className="p-2 border border-white/10 bg-white/[0.02] rounded-xl hover:border-red-400/40 hover:text-red-400 transition-colors duration-200"
            title="Start Over"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm font-medium text-white leading-none">Studio Editor</h1>
            <span className="text-[10px] text-white/30 font-mono">Workspace ID: brand_forge_mvp</span>
          </div>
        </div>

        {/* Viewport Toggles */}
        <div className="flex items-center gap-1.5 p-1 bg-white/[0.02] border border-white/10 rounded-xl">
          <button 
            onClick={() => setPreviewMode('desktop')}
            className={`p-2 rounded-lg transition-colors duration-200 ${previewMode === 'desktop' ? 'bg-indigo-500 text-white' : 'text-white/40 hover:text-white'}`}
            title="Desktop View"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setPreviewMode('mobile')}
            className={`p-2 rounded-lg transition-colors duration-200 ${previewMode === 'mobile' ? 'bg-indigo-500 text-white' : 'text-white/40 hover:text-white'}`}
            title="Mobile Portrait"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Floating AI Score Tracker */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowScoreDetail(prev => !prev)}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-white/[0.04] hover:bg-white/[0.07] rounded-xl border border-white/10 transition-colors duration-200 text-xs font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50"
          >
            <Award className="w-3.5 h-3.5 text-indigo-400" />
            AI Score: <span className="text-white font-semibold">{aiOptions.score.average}%</span>
          </button>
        </div>
      </nav>

      {/* Editor Body */}
      <div className="flex-grow flex flex-col lg:flex-row overflow-hidden relative">

        {/* Left Control Panel / Sidebar: AI Dashboard */}
        <aside className="w-full lg:w-[400px] bg-[#0A0A0B] border-b lg:border-b-0 lg:border-r border-white/10 p-6 flex flex-col gap-6 overflow-y-auto shrink-0 relative z-10">

          {/* Section 1: AI Copywriter Panel */}
          <div className="bg-white/[0.02] border border-white/10 p-5 rounded-2xl flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-medium text-white/50 uppercase tracking-widest flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5 text-indigo-400" /> AI Copywriter
              </h3>
              {regeneratingSection === 'bio' && (
                <span className="text-[10px] font-mono text-indigo-300 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" /> thinking
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {['professional', 'creative', 'technical'].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setRegeneratingSection('bio');
                    setTimeout(() => setRegeneratingSection(null), 500); // brief, fast feedback only
                    updateAnswer('bioType', type);
                    updateAnswer('selectedBio', aiOptions.bios[type]);
                  }}
                  className={`text-[10px] py-1.5 capitalize font-medium rounded-lg border transition-colors duration-200 ${
                    answers.bioType === type 
                      ? 'bg-indigo-500 border-indigo-500 text-white' 
                      : 'bg-transparent border-white/10 text-white/40 hover:text-white hover:border-white/25'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* AI reasoning line — built from existing answers, not a new AI call */}
            <p className="text-[10px] text-white/30 font-mono leading-relaxed flex items-start gap-1.5">
              <Brain className="w-3 h-3 text-indigo-400 shrink-0 mt-0.5" />
              {bioReasoning}
            </p>

            <AnimatePresence mode="wait">
              <motion.div
                key={answers.selectedBio}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: easeOut }}
                className="text-[12px] bg-black/30 border border-white/10 p-3 rounded-xl text-white/70 max-h-28 overflow-y-auto leading-relaxed"
              >
                "{highlightPersonalTerms(answers.selectedBio, personalTerms)}"
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Section 2: AI Headlines Panel */}
          <div className="bg-white/[0.02] border border-white/10 p-5 rounded-2xl flex flex-col gap-3.5">
            <h3 className="text-xs font-medium text-white/50 uppercase tracking-widest flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" /> AI Headlines
              <span className="text-white/25 font-mono normal-case">({aiOptions.headlines.length})</span>
            </h3>
            <div className="flex flex-col gap-1.5 max-h-44 overflow-y-auto pr-1">
              {aiOptions.headlines.map((headline, index) => {
                const selected = answers.selectedHeadline === headline;
                return (
                  <button
                    key={index}
                    onClick={() => updateAnswer('selectedHeadline', headline)}
                    className={`text-left p-2.5 rounded-xl border transition-colors duration-200 ${
                      selected 
                        ? 'border-indigo-400/50 bg-indigo-500/[0.08]' 
                        : 'border-white/10 bg-transparent hover:border-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[11px] text-white/80 leading-snug">{headline}</span>
                      {selected && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />}
                    </div>
                    <span className="text-[9px] text-white/25 font-mono mt-1 block">
                      {getHeadlineRationale(headline, index)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Theme Customization Panel */}
          <div className="bg-white/[0.02] border border-white/10 p-5 rounded-2xl flex flex-col gap-4">
            <h3 className="text-xs font-medium text-white/50 uppercase tracking-widest flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" /> Design System
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {Object.entries(THEME_STYLES).map(([id, theme]) => {
                const selected = answers.theme === id;
                return (
                  <button
                    key={id}
                    onClick={() => updateAnswer('theme', id)}
                    className={`text-left p-2.5 rounded-xl border transition-all duration-200 flex flex-col gap-1 ${
                      selected ? 'border-indigo-400/60 bg-indigo-500/[0.08]' : 'border-white/10 hover:border-white/25'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: theme.accentColor }}
                      />
                      {selected && <Check className="w-3 h-3 text-indigo-400" />}
                    </div>
                    <span className="text-[11px] font-medium text-white capitalize">{id}</span>
                    <span className="text-[9px] text-white/30 leading-snug">{theme.voice}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-2 pt-1 border-t border-white/10">
              <label className="text-[10px] text-white/30 font-mono uppercase tracking-widest">Animation intensity</label>
              <div className="grid grid-cols-3 gap-1.5">
                {['normal', 'fancy', 'crazy'].map((level) => (
                  <button
                    key={level}
                    onClick={() => updateAnswer('animation', level)}
                    className={`text-[10px] py-1.5 font-medium rounded-lg border capitalize transition-colors duration-200 ${
                      answers.animation === level 
                        ? 'bg-indigo-500 border-indigo-500 text-white' 
                        : 'bg-transparent border-white/10 text-white/40 hover:text-white'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: AI Recommendations Panel */}
          {aiOptions.score.suggestions.length > 0 && (
            <div className="bg-white/[0.02] border border-white/10 p-5 rounded-2xl flex flex-col gap-3">
              <h3 className="text-xs font-medium text-white/50 uppercase tracking-widest flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-indigo-400" /> AI Recommendations</span>
                <span className="bg-white/[0.05] text-white/40 text-[9px] px-1.5 py-0.5 rounded-full font-mono">
                  {aiOptions.score.suggestions.filter(s => s.fix).length} pending
                </span>
              </h3>
              <div className="flex flex-col gap-2.5">
                {aiOptions.score.suggestions.map((sug, i) => (
                  <div key={i} className="text-[11px] text-white/50 flex flex-col gap-1.5 border-b border-white/5 pb-2.5 last:border-0 last:pb-0">
                    <span className="leading-snug">{sug.text}</span>
                    {sug.fix && (
                      <button
                        onClick={() => applyScoreFix(sug)}
                        className="bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 font-medium border border-indigo-400/20 rounded-lg py-1 px-2.5 text-[9px] w-fit self-end active:scale-95 transition-all duration-150"
                      >
                        Auto-resolve
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Live Preview Central Container */}
        <main className="flex-grow flex items-center justify-center p-6 bg-black/40 overflow-y-auto relative z-0">

          <AnimatePresence>
            {showScoreDetail && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3, ease: easeOut }}
                  className="w-full max-w-md bg-[#0F0F10] border border-white/10 rounded-3xl p-7 relative"
                >
                  <button 
                    onClick={() => setShowScoreDetail(false)}
                    className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <h3 className="text-lg font-semibold text-white mb-1.5 flex items-center gap-2">
                    <Star className="w-4 h-4 text-indigo-400" /> AI Scorecard
                  </h3>
                  <p className="text-xs text-white/40 mb-6 leading-relaxed">Calculated from your resume data, social links, biography length, and styling choices.</p>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {Object.entries(aiOptions.score.categories).map(([key, val]) => (
                      <div key={key} className="bg-white/[0.03] p-4 rounded-2xl border border-white/10 flex flex-col gap-1.5">
                        <span className="text-[10px] text-white/30 uppercase font-mono tracking-widest">{key}</span>
                        <span className="text-2xl font-semibold text-white">{val}%</span>
                        <div className="w-full bg-white/[0.06] h-1 rounded-full overflow-hidden mt-1">
                          <motion.div
                            className="h-full bg-indigo-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${val}%` }}
                            transition={{ duration: 0.5, ease: easeOut }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowScoreDetail(false)}
                    className="w-full bg-white text-black hover:bg-white/90 font-medium py-2.5 rounded-xl text-sm transition-colors duration-200"
                  >
                    Got it
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interactive Preview Canvas Frame */}
          <div className="w-full h-full flex items-center justify-center">
            <div className={`transition-all duration-350 bg-slate-900 ${
              previewMode === 'mobile' 
                ? 'w-[375px] h-[720px] rounded-[48px] border-[12px] border-slate-800 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-y-auto relative style-scroll scrollbar-none'
                : 'w-full h-full rounded-2xl border border-white/10 shadow-2xl overflow-y-auto relative style-scroll flex flex-col justify-start'
            }`}>

              {/* Cross-fades whenever the theme changes, so a design-system swap
                  reads as the AI "re-rendering" the portfolio rather than a hard cut */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={answers.theme}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: easeOut }}
                  className={`w-full overflow-x-hidden ${themeClass.container}`}
                >
                  {renderNav(themeClass, answers)}
                  {renderHero(themeClass, motionClass, answers, regeneratingSection, thinkingStepIndex, triggerRegenerate, personalTerms)}

                  {/* About Section */}
                  <section id="about" className={themeClass.section}>
                    <h3 className={themeClass.title}>Biography</h3>
                    <p className={themeClass.subtitle}>Polished by AI Copywriter · {answers.bioType || 'professional'} tone</p>
                    <div className="mt-8 flex flex-col md:flex-row gap-8 items-start">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={answers.selectedBio}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35, ease: easeOut }}
                          className={`${themeClass.card} flex-grow leading-relaxed text-sm`}
                        >
                          {answers.selectedBio
                            ? highlightPersonalTerms(answers.selectedBio, personalTerms)
                            : "No bio statement written yet. Answer biographical chat questions to sync."}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </section>

                  {/* Skills Section */}
                  <section id="skills" className={themeClass.section}>
                    <h3 className={themeClass.title}>Technical Expertise</h3>
                    <p className={themeClass.subtitle}>Tools, languages, and frameworks from your interview answers.</p>
                    <div className="mt-8 flex flex-wrap gap-2.5 justify-start">
                      {answers.skills && answers.skills.length > 0 ? (
                        answers.skills.map((skill, index) => (
                          <motion.span key={index} whileHover={motionClass.hover} className={themeClass.badge}>
                            {skill}
                          </motion.span>
                        ))
                      ) : (
                        ['HTML5', 'CSS3', 'JavaScript', 'React'].map((skill, index) => (
                          <span key={index} className={themeClass.badge}>{skill}</span>
                        ))
                      )}
                    </div>
                  </section>

                  {/* Projects Section */}
                  {renderProjects(themeClass, motionClass, answers, regeneratingSection, thinkingStepIndex, triggerRegenerate)}

                  {/* Timeline (Experience & Education) */}
                  {answers.timeline && answers.timeline.length > 0 && (
                    <section className={themeClass.section}>
                      <h3 className={themeClass.title}>Professional Journey</h3>
                      <p className={themeClass.subtitle}>Imported from your resume upload.</p>
                      <div className="mt-10 flex flex-col gap-6 relative before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                        {answers.timeline.map((item, idx) => (
                          <div key={idx} className="flex gap-6 relative items-start group pl-8">
                            <div className="absolute left-[8px] top-1.5 -translate-x-1/2 w-[10px] h-[10px] bg-black border-2 border-indigo-400 rounded-full group-hover:scale-125 transition-transform duration-200" />
                            <div className="flex flex-col gap-1 text-left">
                              <span className="text-[10px] text-indigo-400 font-mono font-bold tracking-widest uppercase">{item.period}</span>
                              <h4 className="font-bold text-sm">{item.title || item.degree}</h4>
                              <span className="text-xs opacity-60 font-semibold">{item.company || item.school}</span>
                              {item.desc && <p className="text-xs opacity-50 mt-1 max-w-xl leading-relaxed">{item.desc}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Contact Info */}
                  <section id="contact" className={themeClass.section}>
                    <h3 className={themeClass.title}>Get In Touch</h3>
                    <p className={themeClass.subtitle}>Submit message details or inspect direct channels below.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                      <div className="flex flex-col gap-4 text-left">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-white/5 rounded-xl">
                            <Mail className="w-4 h-4 text-indigo-400" />
                          </div>
                          <div className="text-xs">
                            <span className="block opacity-50 font-medium">Email</span>
                            <span className="font-bold">contact@brandforge.ai</span>
                          </div>
                        </div>
                        {answers.socialUrl && (
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white/5 rounded-xl">
                              <GithubIcon className="w-4 h-4 text-indigo-400" />
                            </div>
                            <div className="text-xs">
                              <span className="block opacity-50 font-medium">Link</span>
                              <a href={answers.socialUrl} target="_blank" rel="noreferrer" className="font-bold text-indigo-400 hover:underline break-all">
                                {answers.socialUrl}
                              </a>
                            </div>
                          </div>
                        )}
                        {answers.resumeFileName && (
                          <button onClick={handleDownloadSimulate} className={`${themeClass.buttonSecondary} flex items-center gap-2 mt-4 w-fit`}>
                            <Download className="w-4 h-4" /> Download Resume
                          </button>
                        )}
                      </div>
                      <form onSubmit={(e) => { e.preventDefault(); alert("Simulating Form Submission: Message logged inside dynamic portfolio context!"); }} className="flex flex-col gap-3 text-left">
                        <input type="text" placeholder="Your Name" required className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-400/50" />
                        <input type="email" placeholder="Your Email" required className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-400/50" />
                        <textarea placeholder="Message" required rows="3" className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-indigo-400/50 resize-none" />
                        <button type="submit" className={`${themeClass.buttonPrimary} w-full text-center text-xs py-2`}>Send Message</button>
                      </form>
                    </div>
                  </section>

                  <footer className={themeClass.footer}>
                    <p>© {new Date().getFullYear()} {answers.name || "Jane Dev"}. All rights reserved.</p>
                    <p className="text-[10px] opacity-40 mt-1 uppercase tracking-widest">Designed and compiled dynamically by BrandForge AI</p>
                  </footer>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Theme-aware structural renderers.
// Each theme now drives real layout differences (nav shape, hero composition,
// project presentation) via themeClass.navStyle / heroLayout / projectLayout —
// not just color. All read the exact same `answers` data as before.
// ---------------------------------------------------------------------------

function renderNav(themeClass, answers) {
  const name = answers.name || "Jane Dev";

  if (themeClass.navStyle === 'wordmark') {
    return (
      <header className={`${themeClass.nav} justify-center flex-col gap-1`}>
        <span className="text-sm tracking-[0.3em] uppercase font-medium">{name}</span>
        <nav className="flex items-center gap-6 text-[10px] uppercase tracking-widest opacity-60">
          <a href="#about" className="hover:opacity-100 transition-opacity">About</a>
          <a href="#skills" className="hover:opacity-100 transition-opacity">Skills</a>
          <a href="#projects" className="hover:opacity-100 transition-opacity">Work</a>
        </nav>
      </header>
    );
  }

  if (themeClass.navStyle === 'breadcrumb') {
    return (
      <header className={themeClass.nav}>
        <div className="font-mono text-xs opacity-80">
          ~/{name.toLowerCase().replace(/\s+/g, '-')}/portfolio.tsx
        </div>
        <nav className="flex items-center gap-4 text-[10px] font-mono opacity-60">
          <a href="#about" className="hover:opacity-100 transition-opacity">#about</a>
          <a href="#skills" className="hover:opacity-100 transition-opacity">#skills</a>
          <a href="#projects" className="hover:opacity-100 transition-opacity">#projects</a>
        </nav>
      </header>
    );
  }

  // default: topbar
  return (
    <header className={themeClass.nav}>
      <div className="font-extrabold text-sm tracking-tight hover:opacity-80 transition-opacity cursor-pointer">
        {name}.portfolio
      </div>
      <nav className="flex items-center gap-4 text-xs font-semibold">
        <a href="#about" className="hover:opacity-80 transition-opacity">About</a>
        <a href="#skills" className="hover:opacity-80 transition-opacity">Skills</a>
        <a href="#projects" className="hover:opacity-80 transition-opacity">Projects</a>
      </nav>
    </header>
  );
}

function renderHero(themeClass, motionClass, answers, regeneratingSection, thinkingStepIndex, triggerRegenerate, personalTerms) {
  const name = answers.name || "Jane Dev";
  const role = answers.role || "Full-Stack Specialist";
  const headline = answers.selectedHeadline || "Designing and building optimized applications";
  const isThinking = regeneratingSection === 'headline';

  const RegenerateBadge = ({ className }) => (
    <button
      onClick={() => triggerRegenerate('headline')}
      className={`${className} flex items-center gap-1 font-mono hover:opacity-100 transition-opacity`}
      title="AI headline rotation"
    >
      <RefreshCw className={`w-2.5 h-2.5 ${isThinking ? 'animate-spin' : ''}`} />
      {isThinking ? THINKING_STEPS[thinkingStepIndex] : 'Regenerate'}
    </button>
  );

  if (themeClass.heroLayout === 'terminal') {
    return (
      <section className={`${themeClass.section} min-h-[420px] flex flex-col justify-center`}>
        <div className="border border-lime-950 rounded-lg bg-zinc-950/60 p-6 max-w-2xl">
          <div className="flex gap-1.5 mb-4 pb-3 border-b border-lime-950/50">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-lime-500/70" />
          </div>
          <p className="text-xs opacity-50 mb-2">$ whoami</p>
          <p className="text-sm mb-4">{name} — <span className="text-lime-500">{role}</span></p>
          <p className="text-xs opacity-50 mb-2">$ cat headline.txt</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={headline}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-xl font-bold mb-4"
            >
              {highlightPersonalTerms(headline, personalTerms)}
            </motion.p>
          </AnimatePresence>
          <RegenerateBadge className="text-[10px] opacity-60" />
        </div>
      </section>
    );
  }

  if (themeClass.heroLayout === 'editorial') {
    return (
      <section className={`${themeClass.section} min-h-[420px] flex flex-col justify-center items-start text-left`}>
        <span className="text-xs uppercase tracking-[0.3em] opacity-50 mb-6">{role}</span>
        <AnimatePresence mode="wait">
          <motion.h2
            key={headline}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: easeOut }}
            className={`text-4xl md:text-6xl max-w-3xl leading-[1.1] relative ${themeClass.title.replace('text-3xl md:text-4xl', '')}`}
          >
            {highlightPersonalTerms(headline, personalTerms)}
          </motion.h2>
        </AnimatePresence>
        <RegenerateBadge className="text-[10px] opacity-50 mt-4" />
        <p className="text-sm opacity-60 mt-6 max-w-lg leading-relaxed">
          {name} · {role}
        </p>
        <div className="flex gap-3 mt-8">
          <a href="#contact" className={themeClass.buttonPrimary}>Let's Connect</a>
          <a href="#about" className={themeClass.buttonSecondary}>View Bio</a>
        </div>
      </section>
    );
  }

  if (themeClass.heroLayout === 'neon') {
    return (
      <motion.section variants={motionClass.container} initial="initial" animate="animate" className={`${themeClass.section} min-h-[450px] flex flex-col md:flex-row items-center gap-10 text-left`}>
        <motion.div variants={motionClass.item} className="w-24 h-24 shrink-0 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-cyan-400 flex items-center justify-center shadow-[0_0_30px_rgba(232,121,249,0.4)]">
          <span className="text-3xl font-extrabold text-black">{name.charAt(0).toUpperCase()}</span>
        </motion.div>
        <div>
          <AnimatePresence mode="wait">
            <motion.h2 key={headline} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }} className={`${themeClass.title} text-4xl relative`}>
              {highlightPersonalTerms(headline, personalTerms)}
            </motion.h2>
          </AnimatePresence>
          <RegenerateBadge className="text-[10px] opacity-70 mt-2" />
          <p className="text-sm opacity-70 mt-4 max-w-lg">{name} // {role}</p>
          <div className="flex gap-3 mt-6">
            <a href="#contact" className={themeClass.buttonPrimary}>Let's Connect</a>
            <a href="#about" className={themeClass.buttonSecondary}>View Bio</a>
          </div>
        </div>
      </motion.section>
    );
  }

  if (themeClass.heroLayout === 'glass') {
    return (
      <motion.section variants={motionClass.container} initial="initial" animate="animate" className={`${themeClass.section} min-h-[450px] flex flex-col items-center justify-center text-center`}>
        <motion.div variants={motionClass.item} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 max-w-2xl">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
            <span className="text-xl font-bold">{name.charAt(0).toUpperCase()}</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.h2 key={headline} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className={`${themeClass.title} relative`}>
              {highlightPersonalTerms(headline, personalTerms)}
            </motion.h2>
          </AnimatePresence>
          <RegenerateBadge className="text-[10px] opacity-60 mt-3 justify-center" />
          <p className="text-sm opacity-70 mt-4">{name} · {role}</p>
          <div className="flex gap-3 mt-8 justify-center">
            <a href="#contact" className={themeClass.buttonPrimary}>Let's Connect</a>
            <a href="#about" className={themeClass.buttonSecondary}>View Bio</a>
          </div>
        </motion.div>
      </motion.section>
    );
  }

  // default: centered (apple, dark)
  return (
    <motion.section variants={motionClass.container} initial="initial" animate="animate" className={`${themeClass.section} min-h-[450px] flex flex-col justify-center items-center text-center relative`}>
      <motion.div variants={motionClass.item} className="w-20 h-20 rounded-full mb-6 bg-gradient-to-tr from-indigo-500 via-indigo-400 to-cyan-400 flex items-center justify-center shadow-lg relative">
        <span className="text-2xl font-extrabold text-white">{name.charAt(0).toUpperCase()}</span>
        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full" title="Available for Work" />
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.h2 key={headline} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className={`${themeClass.title} text-4xl md:text-5xl max-w-2xl leading-tight relative`}>
          {highlightPersonalTerms(headline, personalTerms)}
        </motion.h2>
      </AnimatePresence>
      <RegenerateBadge className="text-[9px] opacity-50 mt-3" />
      <motion.p variants={motionClass.item} className="text-sm opacity-60 mt-4 max-w-lg leading-relaxed">
        Hi there, I am <span className="font-bold">{name}</span>, working as a <span className="font-semibold text-indigo-400">{role}</span>.
      </motion.p>
      <motion.div variants={motionClass.item} className="flex gap-3 mt-8">
        <a href="#contact" className={themeClass.buttonPrimary}>Let's Connect</a>
        <a href="#about" className={themeClass.buttonSecondary}>View Bio</a>
      </motion.div>
    </motion.section>
  );
}

function renderProjects(themeClass, motionClass, answers, regeneratingSection, thinkingStepIndex, triggerRegenerate) {
  const isThinking = regeneratingSection === 'projects';
  const projects = answers.projects || [];

  const RegenerateButton = () => (
    <button
      onClick={() => triggerRegenerate('projects')}
      className="p-1.5 border border-white/10 bg-white/[0.03] rounded-lg text-[10px] flex items-center gap-1.5 font-mono opacity-60 hover:opacity-100 transition-opacity"
      title="AI project improver"
    >
      <RefreshCw className={`w-3 h-3 ${isThinking ? 'animate-spin' : ''}`} />
      {isThinking ? THINKING_STEPS[thinkingStepIndex] : 'Optimize'}
    </button>
  );

  if (themeClass.projectLayout === 'log') {
    return (
      <section id="projects" className={themeClass.section}>
        <div className="flex items-center justify-between mb-2">
          <h3 className={themeClass.title}>Selected Projects</h3>
          <RegenerateButton />
        </div>
        <p className={themeClass.subtitle}>Log-formatted project entries, enhanced with metrics.</p>
        <div className="mt-8 flex flex-col gap-3 font-mono text-xs">
          {projects.length > 0 ? projects.map((proj, idx) => (
            <motion.div key={proj.id || idx} whileHover={motionClass.hover} className={`${themeClass.card} !rounded-lg`}>
              <div className="flex justify-between items-start gap-4">
                <span className="opacity-40">[{String(idx + 1).padStart(2, '0')}]</span>
                <div className="flex-grow">
                  <p className="font-bold">{proj.title}</p>
                  <p className="opacity-60 mt-1 leading-relaxed">{proj.description}</p>
                  <p className="mt-2 opacity-40">tech: {proj.tech?.join(', ')}</p>
                </div>
                <span className={themeClass.accentText}>{proj.metrics}</span>
              </div>
            </motion.div>
          )) : (
            <p className="opacity-40 italic">// no custom projects loaded — upload a resume to populate</p>
          )}
        </div>
      </section>
    );
  }

  if (themeClass.projectLayout === 'list') {
    return (
      <section id="projects" className={themeClass.section}>
        <div className="flex items-center justify-between mb-2">
          <h3 className={themeClass.title}>Selected Work</h3>
          <RegenerateButton />
        </div>
        <p className={themeClass.subtitle}>Curated projects with measurable impact.</p>
        <div className="mt-10 flex flex-col divide-y divide-white/10">
          {projects.length > 0 ? projects.map((proj, idx) => (
            <motion.div key={proj.id || idx} whileHover={{ x: 4 }} className="py-6 flex flex-col md:flex-row md:items-baseline justify-between gap-2">
              <div>
                <h4 className="font-semibold">{proj.title}</h4>
                <p className="text-xs opacity-60 mt-1.5 max-w-xl leading-relaxed">{proj.description}</p>
              </div>
              <span className={`${themeClass.accentText} shrink-0`}>{proj.metrics}</span>
            </motion.div>
          )) : (
            <p className="text-xs opacity-40 italic py-6">No custom projects loaded. Upload a resume to populate.</p>
          )}
        </div>
      </section>
    );
  }

  // default: grid
  return (
    <section id="projects" className={themeClass.section}>
      <div className="flex items-center justify-between mb-2">
        <h3 className={themeClass.title}>Selected Projects</h3>
        <RegenerateButton />
      </div>
      <p className={themeClass.subtitle}>High impact project specifications enhanced with metrics.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        {projects.length > 0 ? projects.map((proj, idx) => (
          <motion.div key={proj.id || idx} whileHover={motionClass.hover} className={themeClass.card}>
            <span className={themeClass.accentText}>{proj.metrics || "Performance Optimized"}</span>
            <h4 className="font-bold text-lg mt-2 mb-2">{proj.title}</h4>
            <p className="text-xs opacity-60 leading-relaxed mb-4">{proj.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {proj.tech && proj.tech.map((t, idx2) => (
                <span key={idx2} className="text-[10px] bg-white/5 px-2 py-0.5 rounded font-mono opacity-60">{t}</span>
              ))}
            </div>
          </motion.div>
        )) : (
          <p className="text-xs opacity-40 italic">No custom projects loaded. Upload a resume to populate custom cards.</p>
        )}
      </div>
    </section>
  );
}