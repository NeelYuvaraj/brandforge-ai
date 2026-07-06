import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Monitor, Smartphone, Sparkles, RefreshCw, ChevronRight, Check,
  HelpCircle, Star, Mail, Download, ArrowLeft,
  X, Layers, Award, Zap, Sliders, Brain, Wand2,
  TrendingUp, ExternalLink, CheckCircle2, Target, Lightbulb,
  Code2, PenTool, Database, GitBranch, Cloud, Terminal as TerminalIcon,
  Boxes, ShieldCheck
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

// Per-theme content density — controls internal spacing of the new
// bio/skills/footer renderers only. Does NOT touch themeClass.section
// padding (avoids fighting existing utility classes).
const DENSITY = {
  compact: { stack: 'mt-6', gap: 'gap-3' },
  normal: { stack: 'mt-8', gap: 'gap-4' },
  spacious: { stack: 'mt-10', gap: 'gap-6' }
};
const getDensity = (themeClass) => DENSITY[themeClass.density] || DENSITY.normal;

// Lightweight skill → icon + category lookup, purely for display polish.
// Matching is heuristic and local — does not touch answers.skills data.
const SKILL_ICON_RULES = [
  { test: /figma|design|ui|ux|prototyp/i, icon: PenTool, category: 'Design' },
  { test: /sql|mongo|database|redis|postgres/i, icon: Database, category: 'Data' },
  { test: /node|express|api|server|graphql/i, icon: Cloud, category: 'Backend' },
  { test: /git\b/i, icon: GitBranch, category: 'Tooling' },
  { test: /docker|aws|azure|cloud|kubernetes/i, icon: Cloud, category: 'Infrastructure' },
  { test: /css|tailwind|sass|style/i, icon: Boxes, category: 'Styling' },
  { test: /react|vue|angular|next|framer/i, icon: Code2, category: 'Frontend' },
  { test: /python|java(?!script)|c\+\+|go\b/i, icon: TerminalIcon, category: 'Languages' }
];
function getSkillMeta(skill) {
  const match = SKILL_ICON_RULES.find(rule => rule.test.test(skill));
  return match ? { icon: match.icon, category: match.category } : { icon: Code2, category: 'Core' };
}
function groupSkills(skills) {
  const groups = {};
  skills.forEach(skill => {
    const { category } = getSkillMeta(skill);
    if (!groups[category]) groups[category] = [];
    groups[category].push(skill);
  });
  return groups;
}

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

/** Scroll-reveal wrapper for generated-site sections. Purely presentational. */
function Reveal({ children, className }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

/** Deterministic display-only "confidence" score for a headline — a
 * presentational formula derived from existing data, not a new AI call. */
function getHeadlineConfidence(headline, index, topSkill) {
  let score = Math.max(68, 96 - index * 8);
  if (topSkill && headline.toLowerCase().includes(topSkill.toLowerCase())) {
    score = Math.min(98, score + 6);
  }
  return score;
}

// Guesses which platform a URL belongs to, purely for choosing an icon —
// does not validate or modify the URL itself.
function detectSocialPlatform(url = '') {
  if (/github/i.test(url)) return 'github';
  if (/linkedin/i.test(url)) return 'linkedin';
  return 'link';
}

// ---------------------------------------------------------------------------
// Save & Share — encodes the current `answers` object into a URL-safe string
// so the whole portfolio can be reconstructed from the link alone, with no
// backend or database involved. Anyone opening the link gets a read-only
// render of the exact same portfolio (see the `isSharedView` branch below).
// ---------------------------------------------------------------------------
function encodeShareData(answers) {
  const json = JSON.stringify(answers);
  // unescape/encodeURIComponent round-trip keeps btoa happy with unicode text
  const base64 = btoa(unescape(encodeURIComponent(json)));
  // make it URL-safe
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeShareData(encoded) {
  try {
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const json = decodeURIComponent(escape(atob(padded)));
    return JSON.parse(json);
  } catch (err) {
    console.error('Could not decode shared portfolio link', err);
    return null;
  }
}

function buildShareUrl(answers) {
  const encoded = encodeShareData(answers);
  const url = new URL(window.location.href);
  url.search = '';
  url.hash = '';
  url.searchParams.set('view', encoded);
  return url.toString();
}

export default function PortfolioGenerator() {
  const {
    answers, updateAnswer, aiOptions, applyScoreFix, resetBrandForm
  } = useBrandData();

  const [previewMode, setPreviewMode] = useState('desktop'); // desktop, mobile — unchanged
  const [showScoreDetail, setShowScoreDetail] = useState(false); // unchanged
  const [regeneratingSection, setRegeneratingSection] = useState(null); // unchanged
  const [thinkingStepIndex, setThinkingStepIndex] = useState(0); // purely visual caption cycling

  // Save & Share — read-only visitors: if the URL carries an encoded `view`
  // payload, this render is someone opening a shared link. We hydrate the
  // existing BrandContext state from it and skip the editor chrome entirely,
  // so the recipient just sees the finished portfolio, full-screen.
  const [isSharedView, setIsSharedView] = useState(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).has('view');
  });
  const [shareUrl, setShareUrl] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [copyStatus, setCopyStatus] = useState('idle'); // idle | copied | manual

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const encoded = new URLSearchParams(window.location.search).get('view');
    if (!encoded) return;
    const decoded = decodeShareData(encoded);
    if (decoded) {
      Object.entries(decoded).forEach(([key, value]) => updateAnswer(key, value));
      setIsSharedView(true);
    } else {
      setIsSharedView(false);
    }
    // Only ever run once, on mount — this is purely a one-time hydration
    // from the URL, not an ongoing sync.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveAndShare = () => {
    const url = buildShareUrl(answers);
    setShareUrl(url);
    setShowShareModal(true);
    setCopyStatus('idle');
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url)
        .then(() => setCopyStatus('copied'))
        .catch(() => setCopyStatus('manual'));
    } else {
      setCopyStatus('manual');
    }
  };

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

  const topSkill = (answers.skills || [])[0];

  // Read-only shared view: recipients of a "Save & Share" link land here.
  // No editor chrome, sidebar, or preview-frame constraints — just the
  // finished portfolio, rendered full-width and mobile-friendly.
  if (isSharedView) {
    return (
      <div className={`w-full min-h-screen overflow-x-hidden ${themeClass.container}`}>
        {renderNav(themeClass, answers)}
        {renderHero(themeClass, motionClass, answers, null, 0, () => {}, personalTerms)}
        {renderBio(themeClass, answers, personalTerms)}
        {renderSkills(themeClass, motionClass, answers)}
        {renderProjects(themeClass, motionClass, answers, null, 0, () => {})}
        {renderTimeline(themeClass, answers)}
        {renderContact(themeClass, answers, handleDownloadSimulate)}
        {renderFooter(themeClass, answers)}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-100 flex flex-col font-sans select-none">

      {/* Editor Main Navbar Controls — unchanged functionality, refined spacing */}
      <nav className="bg-[#0A0A0B] border-b border-white/10 py-3 px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 z-20 relative">
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={resetBrandForm}
            className="p-2 border border-white/10 bg-white/[0.02] rounded-xl hover:border-red-400/40 hover:text-red-400 transition-colors duration-200 shrink-0"
            title="Start Over"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <h1 className="text-sm font-medium text-white leading-none flex items-center gap-1.5">
              Studio Editor
              <span className="w-1 h-1 rounded-full bg-emerald-400" />
            </h1>
            <span className="text-[10px] text-white/30 font-mono truncate block">Workspace ID: brand_forge_mvp</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-white/[0.02] border border-white/10 rounded-xl shrink-0">
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

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-start flex-wrap">
          <button
            onClick={() => setShowScoreDetail(prev => !prev)}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-white/[0.04] hover:bg-white/[0.07] rounded-xl border border-white/10 transition-colors duration-200 text-xs font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50"
          >
            <Award className="w-3.5 h-3.5 text-indigo-400" />
            AI Score: <span className="text-white font-semibold">{aiOptions.score.average}%</span>
          </button>
          <button
            onClick={handleSaveAndShare}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-indigo-500 hover:bg-indigo-400 rounded-xl transition-colors duration-200 text-xs font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50"
            title="Save this portfolio and get a shareable link"
          >
            <Zap className="w-3.5 h-3.5" />
            Save &amp; Share
          </button>
        </div>
      </nav>

      <div className="flex-grow flex flex-col lg:flex-row overflow-hidden relative">

        {/* Left Control Panel / Sidebar: AI Studio — polished spacing/hierarchy only */}
        <aside className="w-full lg:w-[400px] bg-[#0A0A0B] border-b lg:border-b-0 lg:border-r border-white/10 p-4 sm:p-6 flex flex-col gap-6 sm:gap-7 overflow-y-auto shrink-0 relative z-10 max-h-[60vh] lg:max-h-none">

          {/* AI Analysis strip — shows what the AI used, purely narrated from existing data */}
          <div className="bg-gradient-to-br from-indigo-500/[0.08] to-transparent border border-indigo-400/20 p-4 rounded-2xl flex flex-col gap-2.5">
            <h3 className="text-[11px] font-semibold text-indigo-300 uppercase tracking-widest flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5" /> AI Analyzed
            </h3>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] text-white/60">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" /> Role</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className={`w-3 h-3 shrink-0 ${answers.skills?.length ? 'text-emerald-400' : 'text-white/20'}`} />
                Skills ({answers.skills?.length || 0})
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className={`w-3 h-3 shrink-0 ${answers.timeline?.length ? 'text-emerald-400' : 'text-white/20'}`} />
                Experience
              </span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" /> Portfolio goals</span>
            </div>
          </div>

          {/* Section 1: AI Copywriter Panel — now a real "workspace" with detected context */}
          <div className="bg-white/[0.02] border border-white/10 p-5 rounded-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-medium text-white/50 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                  <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
                </span>
                AI Copywriter
              </h3>
              {regeneratingSection === 'bio' && (
                <span className="text-[10px] font-mono text-indigo-300 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" /> thinking
                </span>
              )}
            </div>

            {/* Detected context row */}
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="bg-black/20 border border-white/5 rounded-lg px-2.5 py-2">
                <span className="block text-white/30 uppercase tracking-wider mb-0.5">Detected role</span>
                <span className="text-white/80 font-medium truncate block">{answers.role || 'Not set'}</span>
              </div>
              <div className="bg-black/20 border border-white/5 rounded-lg px-2.5 py-2">
                <span className="block text-white/30 uppercase tracking-wider mb-0.5">Top skill</span>
                <span className="text-white/80 font-medium truncate block">{topSkill || 'Not set'}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {['professional', 'creative', 'technical'].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setRegeneratingSection('bio');
                    setTimeout(() => setRegeneratingSection(null), 500);
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

            <p className="text-[10px] text-white/30 font-mono leading-relaxed flex items-start gap-1.5">
              <Lightbulb className="w-3 h-3 text-indigo-400 shrink-0 mt-0.5" />
              {bioReasoning}
            </p>

            <AnimatePresence mode="wait">
              <motion.div
                key={answers.selectedBio}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: easeOut }}
                className="text-[12px] bg-black/30 border border-white/10 p-3.5 rounded-xl text-white/70 max-h-28 overflow-y-auto leading-relaxed"
              >
                "{highlightPersonalTerms(answers.selectedBio, personalTerms)}"
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Section 2: AI Headlines Panel — ranked, with confidence + rationale */}
          <div className="bg-white/[0.02] border border-white/10 p-5 rounded-2xl flex flex-col gap-3.5">
            <h3 className="text-xs font-medium text-white/50 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
              </span>
              AI Headlines
              <span className="text-white/25 font-mono normal-case">({aiOptions.headlines.length})</span>
            </h3>
            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
              {aiOptions.headlines.map((headline, index) => {
                const selected = answers.selectedHeadline === headline;
                const confidence = getHeadlineConfidence(headline, index, topSkill);
                return (
                  <motion.button
                    key={index}
                    layout
                    onClick={() => updateAnswer('selectedHeadline', headline)}
                    whileTap={{ scale: 0.98 }}
                    className={`text-left p-3 rounded-xl border transition-colors duration-200 ${
                      selected
                        ? 'border-indigo-400/50 bg-indigo-500/[0.08]'
                        : 'border-white/10 bg-transparent hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-[9px] font-mono text-indigo-400 font-bold shrink-0">#{index + 1}</span>
                      {selected && (
                        <motion.span
                          initial={{ scale: 0.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex items-center gap-1 text-[9px] text-indigo-300 font-medium"
                        >
                          <Check className="w-3 h-3" /> Selected
                        </motion.span>
                      )}
                    </div>
                    <span className="text-[11px] text-white/80 leading-snug block">{headline}</span>
                    <div className="flex items-center justify-between mt-2 gap-2">
                      <span className="text-[9px] text-white/25 font-mono flex-1 truncate">
                        {getHeadlineRationale(headline, index)}
                      </span>
                      <span className="text-[9px] font-mono text-emerald-400 shrink-0">{confidence}%</span>
                    </div>
                    <div className="w-full bg-white/[0.06] h-[3px] rounded-full overflow-hidden mt-1.5">
                      <motion.div
                        className="h-full bg-emerald-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${confidence}%` }}
                        transition={{ duration: 0.5, ease: easeOut }}
                      />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Theme Customization Panel */}
          <div className="bg-white/[0.02] border border-white/10 p-5 rounded-2xl flex flex-col gap-4">
            <h3 className="text-xs font-medium text-white/50 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              </span>
              Design System
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {Object.entries(THEME_STYLES).map(([id, theme]) => {
                const selected = answers.theme === id;
                return (
                  <motion.button
                    key={id}
                    whileTap={{ scale: 0.97 }}
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
                  </motion.button>
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
                <span className="flex items-center gap-1.5">
                  <span className="w-6 h-6 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                    <Star className="w-3.5 h-3.5 text-indigo-400" />
                  </span>
                  AI Recommendations
                </span>
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

          <AnimatePresence>
            {showShareModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3, ease: easeOut }}
                  className="w-full max-w-md bg-[#0F0F10] border border-white/10 rounded-3xl p-6 sm:p-7 relative"
                >
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <h3 className="text-lg font-semibold text-white mb-1.5 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-indigo-400" /> Portfolio Saved
                  </h3>
                  <p className="text-xs text-white/40 mb-5 leading-relaxed">
                    {copyStatus === 'copied'
                      ? 'Link copied to your clipboard. Anyone who opens it sees a read-only, mobile-friendly version of this exact portfolio.'
                      : 'Copy the link below to share this exact portfolio. Anyone who opens it sees a read-only, mobile-friendly version — no login required.'}
                  </p>
                  <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-xl p-2 mb-4">
                    <input
                      readOnly
                      value={shareUrl}
                      onFocus={(e) => e.target.select()}
                      className="flex-1 bg-transparent text-[11px] text-white/70 font-mono px-2 py-1.5 focus:outline-none min-w-0"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(shareUrl)
                          .then(() => setCopyStatus('copied'))
                          .catch(() => setCopyStatus('manual'));
                      }}
                      className="shrink-0 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold rounded-lg px-3 py-1.5 transition-colors duration-200"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-[10px] text-white/25 leading-relaxed mb-5">
                    The full portfolio is encoded directly in the link, so it works even without a server — very long bios or many projects may make the link long, but it will still work in any modern browser.
                  </p>
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="w-full bg-white text-black hover:bg-white/90 font-medium py-2.5 rounded-xl text-sm transition-colors duration-200"
                  >
                    Done
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="w-full h-full flex items-center justify-center">
            <div className={`transition-all duration-350 bg-slate-900 ${
              previewMode === 'mobile'
                ? 'w-full max-w-[375px] h-[75vh] sm:h-[720px] rounded-[32px] sm:rounded-[48px] border-[8px] sm:border-[12px] border-slate-800 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-y-auto relative style-scroll scrollbar-none'
                : 'w-full h-full rounded-2xl border border-white/10 shadow-2xl overflow-y-auto relative style-scroll flex flex-col justify-start'
            }`}>

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
                  {renderBio(themeClass, answers, personalTerms)}
                  {renderSkills(themeClass, motionClass, answers)}
                  {renderProjects(themeClass, motionClass, answers, regeneratingSection, thinkingStepIndex, triggerRegenerate)}
                  {renderTimeline(themeClass, answers)}
                  {renderContact(themeClass, answers, handleDownloadSimulate)}
                  {renderFooter(themeClass, answers)}
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

function HeroExtras({ themeClass, answers, dark = true }) {
  const socials = answers.socialUrl ? [answers.socialUrl] : [];
  const topSkills = (answers.skills || []).slice(0, 4);
  const linkClass = dark
    ? "w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20 transition-colors duration-200"
    : "w-8 h-8 rounded-full bg-black/5 border border-black/10 flex items-center justify-center hover:bg-black/10 transition-colors duration-200";

  return (
    <>
      {topSkills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 justify-center mt-4">
          {topSkills.map((skill, i) => (
            <span key={i} className={themeClass.badge}>{skill}</span>
          ))}
        </div>
      )}
      {socials.length > 0 && (
        <div className="flex items-center gap-2 justify-center mt-5">
          {socials.map((url, i) => {
            const platform = detectSocialPlatform(url);
            const Icon = platform === 'linkedin' ? LinkedinIcon : GithubIcon;
            return (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer" className={linkClass} title={url}>
                <Icon className="w-4 h-4" />
              </a>
            );
          })}
        </div>
      )}
    </>
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

  const AIGeneratedBadge = ({ className = '' }) => (
    <span className={`${className} inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-widest opacity-50`}>
      <Sparkles className="w-2.5 h-2.5" /> AI Generated
    </span>
  );

  if (themeClass.heroLayout === 'terminal') {
    return (
      <section className={`${themeClass.section} min-h-[440px] flex flex-col justify-center relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, #fff 0px, transparent 1px, transparent 2px)' }} />
        <div className="border border-lime-950 rounded-lg bg-zinc-950/60 p-6 max-w-2xl relative">
          <div className="flex gap-1.5 mb-4 pb-3 border-b border-lime-950/50 items-center justify-between">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-lime-500/70" />
            </div>
            <AIGeneratedBadge />
          </div>
          <p className="text-xs opacity-50 mb-2">$ whoami</p>
          <p className="text-sm mb-4">{name} — <span className="text-lime-500">{role}</span></p>
          <p className="text-xs opacity-50 mb-2">$ cat headline.txt</p>
          <AnimatePresence mode="wait">
            <motion.p key={headline} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="text-xl font-bold mb-4">
              {highlightPersonalTerms(headline, personalTerms)}
            </motion.p>
          </AnimatePresence>
          <RegenerateBadge className="text-[10px] opacity-60" />
          <div className="mt-4 pt-4 border-t border-lime-950/40 flex flex-wrap gap-1.5">
            {(answers.skills || []).slice(0, 5).map((s, i) => (
              <span key={i} className="text-[10px] border border-lime-950 rounded px-2 py-0.5 opacity-70">{s}</span>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (themeClass.heroLayout === 'editorial') {
    return (
      <section className={`${themeClass.section} min-h-[440px] flex flex-col justify-center items-start text-left relative`}>
        {themeClass.bioLayout === 'magazine' && <div className="w-12 h-[2px] bg-amber-600 mb-6" />}
        <div className="flex items-center gap-3 mb-1">
          <span className={themeClass.eyebrow}>{role}</span>
          <AIGeneratedBadge />
        </div>
        <AnimatePresence mode="wait">
          <motion.h2
            key={headline}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: easeOut }}
            className={`text-4xl md:text-6xl max-w-3xl leading-[1.1] relative mt-3 ${themeClass.title.replace('text-3xl md:text-4xl', '').replace('text-2xl md:text-3xl', '')}`}
          >
            {highlightPersonalTerms(headline, personalTerms)}
          </motion.h2>
        </AnimatePresence>
        <RegenerateBadge className="text-[10px] opacity-50 mt-4" />
        <p className="text-sm opacity-60 mt-6 max-w-lg leading-relaxed">{name} · {role}</p>
        {(answers.skills || []).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-5">
            {answers.skills.slice(0, 4).map((s, i) => (
              <span key={i} className={themeClass.badge}>{s}</span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-4 mt-8">
          <a href="#contact" className={themeClass.buttonPrimary}>Let's Connect</a>
          <a href="#about" className={themeClass.buttonSecondary}>View Bio</a>
          {answers.socialUrl && (
            <a href={answers.socialUrl} target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100 transition-opacity">
              <GithubIcon className="w-5 h-5" />
            </a>
          )}
        </div>
      </section>
    );
  }

  if (themeClass.heroLayout === 'neon') {
    return (
      <motion.section variants={motionClass.container} initial="initial" animate="animate" className={`${themeClass.section} min-h-[500px] flex flex-col relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#22D3EE 1px, transparent 1px), linear-gradient(90deg, #22D3EE 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        {/* Terminal-style chrome bar — reinforces the "dashboard" framing */}
        <div className="relative flex items-center justify-between mb-8 pb-3 border-b border-cyan-400/20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
            <span className="text-[10px] font-mono opacity-40 ml-3">root@portfolio:~$ status --live</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> ONLINE
          </span>
        </div>

        <div className="relative flex flex-col md:flex-row items-center gap-10 text-left">
          <motion.div variants={motionClass.item} className="w-24 h-24 shrink-0 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-cyan-400 flex items-center justify-center shadow-[0_0_35px_rgba(232,121,249,0.5)] relative [clip-path:polygon(0_16px,16px_0,100%_0,100%_calc(100%-16px),calc(100%-16px)_100%,0_100%)]">
            <span className="text-3xl font-extrabold text-black">{name.charAt(0).toUpperCase()}</span>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-black shadow-[0_0_10px_rgba(52,211,153,0.9)]" title="Available for work" />
          </motion.div>
          <div className="relative flex-1">
            <div className="flex items-center gap-3 mb-1">
              <span className={themeClass.eyebrow}>[ {role} ]</span>
              <AIGeneratedBadge />
            </div>
            <AnimatePresence mode="wait">
              <motion.h2 key={headline} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }} className={`${themeClass.title} text-4xl md:text-5xl relative mt-2`}>
                {highlightPersonalTerms(headline, personalTerms)}
              </motion.h2>
            </AnimatePresence>
            <div className="h-[2px] w-24 mt-3 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-transparent shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            <RegenerateBadge className="text-[10px] opacity-70 mt-3" />
            <p className="text-sm opacity-70 mt-4 max-w-lg font-mono">{name} // {role}</p>
            {(answers.skills || []).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {answers.skills.slice(0, 4).map((s, i) => (
                  <span key={i} className={themeClass.badge}>{s}</span>
                ))}
              </div>
            )}
            <div className="flex gap-3 mt-6">
              <a href="#contact" className={themeClass.buttonPrimary}>Let's Connect</a>
              <a href="#about" className={themeClass.buttonSecondary}>View Bio</a>
            </div>
          </div>
        </div>
      </motion.section>
    );
  }

  if (themeClass.heroLayout === 'glass') {
    return (
      <motion.section variants={motionClass.container} initial="initial" animate="animate" className={`${themeClass.section} min-h-[600px] flex flex-col items-center justify-center text-center relative overflow-visible py-20`}>
        {/* Small floating "pill" panel above the main hero — reinforces the
            layered, floating-glass-panel language before the eye reaches the
            big card. */}
        <motion.div variants={motionClass.item} className="mb-6 inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-xl rounded-full px-4 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span className="text-[10px] uppercase tracking-widest opacity-70">Available for work</span>
        </motion.div>

        <motion.div variants={motionClass.item} className={`${themeClass.card} p-10 md:p-16 max-w-3xl w-full relative`}>
          {/* glossy top highlight ring behind avatar for extra depth */}
          <div className="w-20 h-20 mx-auto mb-7 rounded-full bg-gradient-to-b from-white/25 to-white/5 border border-white/25 flex items-center justify-center relative shadow-[0_8px_30px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.5)]">
            <span className="text-2xl font-bold">{name.charAt(0).toUpperCase()}</span>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 border-[3px] border-white/20 rounded-full" />
          </div>
          <span className={`${themeClass.eyebrow} block mb-3`}>{role}</span>
          <AnimatePresence mode="wait">
            <motion.h2 key={headline} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className={`${themeClass.title} relative leading-[1.05] max-w-2xl mx-auto`}>
              {highlightPersonalTerms(headline, personalTerms)}
            </motion.h2>
          </AnimatePresence>
          <RegenerateBadge className="text-[10px] opacity-60 mt-4 justify-center" />
          <p className="text-base opacity-70 mt-5 font-light">{name} · {role}</p>
          <HeroExtras themeClass={themeClass} answers={answers} dark />
          <div className="flex gap-4 mt-10 justify-center">
            <a href="#contact" className={themeClass.buttonPrimary}>Let's Connect</a>
            <a href="#about" className={themeClass.buttonSecondary}>View Bio</a>
          </div>
          <AIGeneratedBadge className="mt-6 justify-center flex" />
        </motion.div>
      </motion.section>
    );
  }

  // default: centered (apple, dark)
  const isDark = themeClass.footerLayout === 'saas';
  return (
    <motion.section variants={motionClass.container} initial="initial" animate="animate" className={`${themeClass.section} min-h-[460px] flex flex-col justify-center items-center text-center relative overflow-hidden`}>
      {isDark && (
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#3B82F6 1px, transparent 1px), linear-gradient(90deg, #3B82F6 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      )}
      <motion.div variants={motionClass.item} className="flex items-center gap-2 mb-4 relative">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[10px] uppercase tracking-widest opacity-50">Available for work</span>
      </motion.div>
      <motion.div variants={motionClass.item} className="w-20 h-20 rounded-full mb-6 bg-gradient-to-tr from-indigo-500 via-indigo-400 to-cyan-400 flex items-center justify-center shadow-lg relative">
        <span className="text-2xl font-extrabold text-white">{name.charAt(0).toUpperCase()}</span>
        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full" title="Available for Work" />
      </motion.div>
      <span className={`${themeClass.eyebrow} relative`}>{role}</span>
      <AnimatePresence mode="wait">
        <motion.h2 key={headline} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className={`${themeClass.title} text-4xl md:text-5xl max-w-2xl leading-tight relative mt-2`}>
          {highlightPersonalTerms(headline, personalTerms)}
        </motion.h2>
      </AnimatePresence>
      <RegenerateBadge className="text-[9px] opacity-50 mt-3" />
      <motion.p variants={motionClass.item} className="text-sm opacity-60 mt-4 max-w-lg leading-relaxed relative">
        Hi there, I am <span className="font-bold">{name}</span>, working as a <span className="font-semibold text-indigo-400">{role}</span>.
      </motion.p>
      <HeroExtras themeClass={themeClass} answers={answers} dark />
      <motion.div variants={motionClass.item} className="flex gap-3 mt-8 relative">
        <a href="#contact" className={themeClass.buttonPrimary}>Let's Connect</a>
        <a href="#about" className={themeClass.buttonSecondary}>View Bio</a>
      </motion.div>
      <AIGeneratedBadge className="mt-5 flex" />
    </motion.section>
  );
}

function renderBio(themeClass, answers, personalTerms) {
  const density = getDensity(themeClass);
  const bioText = answers.selectedBio;
  const fallback = "No bio statement written yet. Answer biographical chat questions to sync.";
  const strengths = (answers.skills || []).slice(0, 3);

  const KeyStrengths = () => strengths.length > 0 ? (
    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 ${density.stack}`}>
      {strengths.map((skill, i) => {
        const { icon: Icon } = getSkillMeta(skill);
        return (
          <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl border border-white/10 bg-white/[0.02]">
            <Icon className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-semibold block">{skill}</span>
              <span className="text-[10px] opacity-50">Core strength</span>
            </div>
          </div>
        );
      })}
    </div>
  ) : null;

  const sectionHeader = (
    <>
      <div className="flex items-center gap-3">
        <span className={themeClass.eyebrow}>Biography</span>
        <span className="inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-widest opacity-40">
          <Sparkles className="w-2.5 h-2.5" /> AI Generated
        </span>
      </div>
      <h3 className={`${themeClass.title} mt-2`}>About</h3>
      <p className={themeClass.subtitle}>Polished by AI Copywriter · {answers.bioType || 'professional'} tone</p>
    </>
  );

  if (themeClass.bioLayout === 'terminal') {
    return (
      <Reveal>
        <section id="about" className={themeClass.section}>
          {sectionHeader}
          <div className={`border border-lime-950 rounded-lg bg-zinc-950/60 p-5 ${density.stack} font-mono text-xs leading-relaxed`}>
            <p className="opacity-50 mb-2">$ cat bio.txt</p>
            <p>{bioText ? highlightPersonalTerms(bioText, personalTerms) : fallback}</p>
          </div>
          {strengths.length > 0 && (
            <div className={`${density.stack} font-mono text-xs`}>
              <p className="opacity-50 mb-2">$ ls strengths/</p>
              <div className="flex flex-wrap gap-2">
                {strengths.map((s, i) => <span key={i} className="border border-lime-950 rounded px-2 py-1">{s}</span>)}
              </div>
            </div>
          )}
        </section>
      </Reveal>
    );
  }

  if (themeClass.bioLayout === 'magazine') {
    return (
      <Reveal>
        <section id="about" className={themeClass.section}>
          {sectionHeader}
          <div className={`grid grid-cols-1 md:grid-cols-3 ${density.gap} ${density.stack} items-start`}>
            <div className="md:col-span-2 columns-1 md:columns-2 gap-6 text-sm leading-relaxed [column-rule:1px_solid_rgba(217,119,6,0.15)]">
              {bioText ? highlightPersonalTerms(bioText, personalTerms) : fallback}
            </div>
            <div className="border-l border-amber-900/30 pl-5">
              <span className="block text-4xl font-light text-amber-500">{(answers.skills || []).length}</span>
              <span className="text-[10px] uppercase tracking-widest opacity-50">Core skills applied</span>
            </div>
          </div>
          <KeyStrengths />
        </section>
      </Reveal>
    );
  }

  if (themeClass.bioLayout === 'hud') {
    return (
      <Reveal>
        <section id="about" className={themeClass.section}>
          <span className={themeClass.eyebrow}>[ ABOUT ]</span>
          <h3 className={`${themeClass.title} mt-2`}>Profile</h3>
          <div className={`${themeClass.card} ${density.stack} text-sm leading-relaxed`}>
            {bioText ? highlightPersonalTerms(bioText, personalTerms) : fallback}
          </div>
          <KeyStrengths />
        </section>
      </Reveal>
    );
  }

  if (themeClass.bioLayout === 'glass') {
    return (
      <Reveal>
        <section id="about" className={themeClass.section}>
          {sectionHeader}
          <div className={`${themeClass.card} ${density.stack} text-sm leading-relaxed`}>
            {bioText ? highlightPersonalTerms(bioText, personalTerms) : fallback}
          </div>
          <KeyStrengths />
        </section>
      </Reveal>
    );
  }

  if (themeClass.bioLayout === 'plain') {
    return (
      <Reveal>
        <section id="about" className={themeClass.section}>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-5 h-5 rounded bg-stone-900 text-white text-[10px] flex items-center justify-center font-bold">i</span>
            <h3 className={themeClass.title}>About</h3>
          </div>
          <p className={themeClass.subtitle}>{answers.bioType || 'professional'} tone · AI generated</p>
          <p className={`${density.stack} text-sm leading-loose max-w-2xl`}>
            {bioText ? highlightPersonalTerms(bioText, personalTerms) : fallback}
          </p>
          <KeyStrengths />
        </section>
      </Reveal>
    );
  }

  if (themeClass.bioLayout === 'lede') {
    const sentences = (bioText || fallback).split(/(?<=[.!?])\s+/);
    const lede = sentences[0];
    const rest = sentences.slice(1).join(' ');
    return (
      <Reveal>
        <section id="about" className={themeClass.section}>
          {sectionHeader}
          <div className={`${density.stack} max-w-2xl`}>
            <p className="text-xl font-light leading-snug text-slate-900">
              {highlightPersonalTerms(lede, personalTerms)}
            </p>
            {rest && (
              <p className="text-sm leading-relaxed opacity-60 mt-4">
                {highlightPersonalTerms(rest, personalTerms)}
              </p>
            )}
          </div>
          <KeyStrengths />
        </section>
      </Reveal>
    );
  }

  // default: card (dark theme)
  return (
    <Reveal>
      <section id="about" className={themeClass.section}>
        {sectionHeader}
        <div className={`flex flex-col md:flex-row ${density.gap} items-start ${density.stack}`}>
          <div className={`${themeClass.card} flex-grow leading-relaxed text-sm`}>
            {bioText ? highlightPersonalTerms(bioText, personalTerms) : fallback}
          </div>
        </div>
        <KeyStrengths />
      </section>
    </Reveal>
  );
}

function renderSkills(themeClass, motionClass, answers) {
  const density = getDensity(themeClass);
  const skills = answers.skills && answers.skills.length > 0 ? answers.skills : ['HTML5', 'CSS3', 'JavaScript', 'React'];
  const grouped = groupSkills(skills);
  const useGroups = Object.keys(grouped).length > 1;

  const sectionHeader = (
    <>
      <span className={themeClass.eyebrow}>Skills</span>
      <h3 className={`${themeClass.title} mt-2`}>Technical Expertise</h3>
      <p className={themeClass.subtitle}>Tools, languages, and frameworks from your interview answers.</p>
    </>
  );

  if (themeClass.skillsLayout === 'array') {
    return (
      <Reveal>
        <section id="skills" className={themeClass.section}>
          {sectionHeader}
          <div className={`${density.stack} font-mono text-xs bg-zinc-950 border border-lime-950 rounded-lg p-5 leading-relaxed`}>
            <span className="opacity-60">const skills = [</span>
            <div className="pl-4">
              {skills.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-white">"{s}"</span>
                  {i < skills.length - 1 && <span className="opacity-40">,</span>}
                </div>
              ))}
            </div>
            <span className="opacity-60">];</span>
          </div>
        </section>
      </Reveal>
    );
  }

  if (themeClass.skillsLayout === 'neon') {
    return (
      <Reveal>
        <section id="skills" className={themeClass.section}>
          <span className={themeClass.eyebrow}>[ SKILLS ]</span>
          <h3 className={`${themeClass.title} mt-2`}>Technical Expertise</h3>
          <div className={`${density.stack} flex flex-wrap gap-2.5`}>
            {skills.map((skill, index) => {
              const { icon: Icon } = getSkillMeta(skill);
              return (
                <motion.span
                  key={index}
                  whileHover={{ scale: 1.06 }}
                  className="bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 px-3 py-1.5 text-xs uppercase tracking-wider hover:border-fuchsia-400/60 hover:shadow-[0_0_15px_rgba(232,121,249,0.4)] transition-all duration-200 flex items-center gap-1.5 [clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)]"
                >
                  <Icon className="w-3 h-3" /> {skill}
                </motion.span>
              );
            })}
          </div>
        </section>
      </Reveal>
    );
  }

  if (themeClass.skillsLayout === 'glass') {
    return (
      <Reveal>
        <section id="skills" className={themeClass.section}>
          {sectionHeader}
          <div className={`${density.stack} flex flex-wrap ${density.gap}`}>
            {skills.map((skill, index) => {
              const { icon: Icon } = getSkillMeta(skill);
              return (
                <motion.span
                  key={index}
                  whileHover={{ scale: 1.06, y: -2 }}
                  className="backdrop-blur-xl backdrop-saturate-150 bg-white/12 border border-white/25 rounded-full px-4 py-2 text-xs flex items-center gap-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_4px_14px_rgba(0,0,0,0.15)] transition-shadow duration-300 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_6px_20px_rgba(236,72,153,0.25)]"
                >
                  <Icon className="w-3.5 h-3.5 opacity-80" /> {skill}
                </motion.span>
              );
            })}
          </div>
        </section>
      </Reveal>
    );
  }

  if (themeClass.skillsLayout === 'tags') {
    return (
      <Reveal>
        <section id="skills" className={themeClass.section}>
          {sectionHeader}
          <div className={`${density.stack} flex flex-wrap gap-x-6 gap-y-3`}>
            {skills.map((skill, index) => (
              <span key={index} className="text-xs uppercase tracking-widest opacity-70 border-b border-amber-800/40 pb-1">
                {skill}
              </span>
            ))}
          </div>
        </section>
      </Reveal>
    );
  }

  if (themeClass.skillsLayout === 'checklist') {
    return (
      <Reveal>
        <section id="skills" className={themeClass.section}>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-5 h-5 rounded bg-stone-900 text-white text-[10px] flex items-center justify-center font-bold">✓</span>
            <h3 className={themeClass.title}>Skills</h3>
          </div>
          <div className={`${density.stack} flex flex-col ${density.gap}`}>
            {skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <span className="w-1 h-1 rounded-full bg-stone-400" />
                {skill}
              </div>
            ))}
          </div>
        </section>
      </Reveal>
    );
  }

  if (themeClass.skillsLayout === 'bento') {
    return (
      <Reveal>
        <section id="skills" className={themeClass.section}>
          {sectionHeader}
          <div className={`${density.stack} grid grid-cols-2 md:grid-cols-4 ${density.gap}`}>
            {skills.map((skill, index) => {
              const { icon: Icon } = getSkillMeta(skill);
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -3 }}
                  className="bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 rounded-xl p-3.5 text-center transition-colors duration-200 flex flex-col items-center gap-2"
                >
                  <Icon className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-medium">{skill}</span>
                </motion.div>
              );
            })}
          </div>
        </section>
      </Reveal>
    );
  }

  // default: pills, grouped by category (apple)
  return (
    <Reveal>
      <section id="skills" className={themeClass.section}>
        {sectionHeader}
        <div className={`${density.stack} flex flex-col ${density.gap}`}>
          {useGroups ? Object.entries(grouped).map(([category, groupSkillsList]) => (
            <div key={category}>
              <span className="text-[10px] uppercase tracking-widest opacity-40 font-medium block mb-2">{category}</span>
              <div className="flex flex-wrap gap-2.5">
                {groupSkillsList.map((skill, index) => (
                  <motion.span key={index} whileHover={motionClass.hover} className={themeClass.badge}>{skill}</motion.span>
                ))}
              </div>
            </div>
          )) : (
            <div className="flex flex-wrap gap-2.5">
              {skills.map((skill, index) => (
                <motion.span key={index} whileHover={motionClass.hover} className={themeClass.badge}>{skill}</motion.span>
              ))}
            </div>
          )}
        </div>
      </section>
    </Reveal>
  );
}

function ProjectLinks({ themeClass, answers, variant = 'default' }) {
  const hasGithub = !!answers.socialUrl;
  const baseClass = variant === 'terminal'
    ? "text-[10px] font-mono opacity-60 hover:opacity-100 transition-opacity flex items-center gap-1"
    : "text-[10px] font-medium px-2.5 py-1.5 rounded-lg border border-white/10 hover:border-white/25 transition-colors duration-200 flex items-center gap-1.5";

  return (
    <div className="flex items-center gap-2 mt-3">
      {hasGithub && (
        <a href={answers.socialUrl} target="_blank" rel="noopener noreferrer" className={baseClass}>
          <GithubIcon className="w-3 h-3" /> {variant === 'terminal' ? '$ open github' : 'GitHub'}
        </a>
      )}
      <a href="#" target="_blank" rel="noopener noreferrer" className={baseClass}>
        <ExternalLink className="w-3 h-3" /> {variant === 'terminal' ? '$ open demo' : 'Live Demo'}
      </a>
    </div>
  );
}

function renderProjects(themeClass, motionClass, answers, regeneratingSection, thinkingStepIndex, triggerRegenerate) {
  const isThinking = regeneratingSection === 'projects';
  const projects = answers.projects || [];
  const density = getDensity(themeClass);

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

  const AIEnhancedBadge = ({ className = '' }) => (
    <span className={`${className} inline-flex items-center gap-1 text-[9px] font-medium uppercase tracking-wider text-indigo-400`}>
      <Sparkles className="w-2.5 h-2.5" /> AI Enhanced
    </span>
  );

  if (themeClass.projectLayout === 'log') {
    return (
      <Reveal>
        <section id="projects" className={themeClass.section}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className={themeClass.eyebrow}>Projects</span>
              <h3 className={`${themeClass.title} mt-1`}>Selected Projects</h3>
            </div>
            <RegenerateButton />
          </div>
          <p className={themeClass.subtitle}>Log-formatted project entries, enhanced with metrics.</p>
          <div className={`${density.stack} flex flex-col gap-3 font-mono text-xs`}>
            {projects.length > 0 ? projects.map((proj, idx) => (
              <motion.div key={proj.id || idx} whileHover={motionClass.hover} className={`${themeClass.card} !rounded-lg relative`}>
                <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                <div className="flex justify-between items-start gap-4">
                  <span className="opacity-40">[{String(idx + 1).padStart(2, '0')}]</span>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2">
                      <p className="font-bold">{proj.title}</p>
                      <AIEnhancedBadge />
                    </div>
                    <p className="opacity-60 mt-1 leading-relaxed">{proj.description}</p>
                    <p className="mt-2 opacity-40">tech: {proj.tech?.join(', ')}</p>
                    <ProjectLinks themeClass={themeClass} answers={answers} variant="terminal" />
                  </div>
                  <span className={themeClass.accentText}>{proj.metrics}</span>
                </div>
              </motion.div>
            )) : (
              <p className="opacity-40 italic">No projects added yet.</p>
            )}
          </div>
        </section>
      </Reveal>
    );
  }

  if (themeClass.projectLayout === 'list') {
    const isLuxury = themeClass.bioLayout === 'magazine';
    return (
      <Reveal>
        <section id="projects" className={themeClass.section}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className={themeClass.eyebrow}>Work</span>
              <h3 className={`${themeClass.title} mt-1`}>Selected Work</h3>
            </div>
            <RegenerateButton />
          </div>
          <p className={themeClass.subtitle}>Curated projects with measurable impact.</p>
          <div className={`${density.stack} flex flex-col divide-y ${isLuxury ? 'divide-amber-900/20' : 'divide-white/10'}`}>
            {projects.length > 0 ? projects.map((proj, idx) => (
              <motion.div key={proj.id || idx} whileHover={{ x: 4 }} className="py-6 flex flex-col md:flex-row md:items-baseline justify-between gap-2">
                <div className="flex gap-4">
                  {isLuxury && <span className="text-xs opacity-40 tracking-widest">{String(idx + 1).padStart(2, '0')} —</span>}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{proj.title}</h4>
                      <AIEnhancedBadge />
                    </div>
                    <p className="text-xs opacity-60 mt-1.5 max-w-xl leading-relaxed">{proj.description}</p>
                    <ProjectLinks themeClass={themeClass} answers={answers} />
                  </div>
                </div>
                <span className={`${themeClass.accentText} shrink-0`}>{proj.metrics}</span>
              </motion.div>
            )) : (
              <p className="text-xs opacity-40 italic py-6">No projects added yet.</p>
            )}
          </div>
        </section>
      </Reveal>
    );
  }

  if (themeClass.projectLayout === 'glassGrid') {
    return (
      <Reveal>
        <section id="projects" className={themeClass.section}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className={themeClass.eyebrow}>Projects</span>
              <h3 className={`${themeClass.title} mt-1`}>Selected Projects</h3>
            </div>
            <RegenerateButton />
          </div>
          <p className={themeClass.subtitle}>High impact project specifications enhanced with metrics.</p>
          <div className={`grid grid-cols-1 md:grid-cols-2 ${density.gap} ${density.stack}`}>
            {projects.length > 0 ? projects.map((proj, idx) => (
              <motion.div
                key={proj.id || idx}
                whileHover={{ y: -6 }}
                className={`${themeClass.card} ${idx === 0 ? 'md:col-span-2' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className={themeClass.accentText}>{proj.metrics || "Performance Optimized"}</span>
                  <AIEnhancedBadge />
                </div>
                <h4 className="font-semibold text-xl mt-3 mb-2">{proj.title}</h4>
                <p className="text-sm opacity-70 leading-relaxed mb-4 font-light">{proj.description}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {proj.tech && proj.tech.map((t, idx2) => (
                    <span key={idx2} className="text-[10px] bg-white/10 border border-white/15 backdrop-blur-md px-2.5 py-1 rounded-full opacity-80">{t}</span>
                  ))}
                </div>
                <ProjectLinks themeClass={themeClass} answers={answers} />
              </motion.div>
            )) : (
              <p className="text-xs opacity-40 italic">No projects added yet.</p>
            )}
          </div>
        </section>
      </Reveal>
    );
  }

  // default: grid — asymmetric "bento" pairing for apple, uniform for others
  const isApple = themeClass.bioLayout === 'lede';
  return (
    <Reveal>
      <section id="projects" className={themeClass.section}>
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className={themeClass.eyebrow}>Projects</span>
            <h3 className={`${themeClass.title} mt-1`}>Selected Projects</h3>
          </div>
          <RegenerateButton />
        </div>
        <p className={themeClass.subtitle}>High impact project specifications enhanced with metrics.</p>
        <div className={`grid grid-cols-1 md:grid-cols-2 ${density.gap} ${density.stack}`}>
          {projects.length > 0 ? projects.map((proj, idx) => (
            <motion.div
              key={proj.id || idx}
              whileHover={motionClass.hover}
              className={`${themeClass.card} ${isApple && idx === 0 ? 'md:col-span-2' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span className={themeClass.accentText}>{proj.metrics || "Performance Optimized"}</span>
                <AIEnhancedBadge />
              </div>
              <h4 className="font-bold text-lg mt-2 mb-2">{proj.title}</h4>
              <p className="text-xs opacity-60 leading-relaxed mb-3">{proj.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-1">
                {proj.tech && proj.tech.map((t, idx2) => (
                  <span key={idx2} className="text-[10px] bg-white/5 px-2 py-0.5 rounded font-mono opacity-60">{t}</span>
                ))}
              </div>
              <ProjectLinks themeClass={themeClass} answers={answers} />
            </motion.div>
          )) : (
            <p className="text-xs opacity-40 italic">No projects added yet.</p>
          )}
        </div>
      </section>
    </Reveal>
  );
}

function renderTimeline(themeClass, answers) {
  if (!answers.timeline || answers.timeline.length === 0) return null;
  return (
    <Reveal>
      <section className={themeClass.section}>
        <span className={themeClass.eyebrow}>Journey</span>
        <h3 className={`${themeClass.title} mt-2`}>Professional Journey</h3>
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
    </Reveal>
  );
}

function renderContact(themeClass, answers, handleDownloadSimulate) {
  const isCyber = themeClass.bioLayout === 'hud';
  const isGlass = themeClass.bioLayout === 'glass';

  const iconWrapClass = isGlass
    ? "p-3 bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
    : isCyber
      ? "p-2.5 bg-cyan-500/10 border border-cyan-400/40 [clip-path:polygon(4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%,0_4px)]"
      : "p-2.5 bg-white/5 rounded-xl";

  const accentIconClass = isCyber ? "text-cyan-300" : "text-indigo-400";

  const inputClass = isGlass
    ? "bg-white/10 border border-white/20 backdrop-blur-xl px-4 py-3 rounded-2xl text-xs placeholder:text-white/40 focus:outline-none focus:border-white/50 focus:bg-white/[0.16] transition-all duration-300"
    : isCyber
      ? "bg-black/60 border border-cyan-400/30 px-3.5 py-2.5 text-xs font-mono placeholder:text-cyan-500/40 text-cyan-100 focus:outline-none focus:border-fuchsia-400/60 focus:shadow-[0_0_12px_rgba(232,121,249,0.25)] transition-all duration-200 [clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)]"
      : "bg-white/5 border border-white/10 px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:border-indigo-400/50 transition-colors duration-200";

  const panelClass = isCyber
    ? `${themeClass.card} !p-0 overflow-hidden`
    : isGlass
      ? themeClass.card
      : "";

  const usesPanel = isCyber || isGlass;
  const Body = (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${usesPanel ? (isCyber ? 'p-7' : 'p-8') : 'mt-10'}`}>
      <div className="flex flex-col gap-4 text-left">
        <div className="flex items-center gap-3">
          <div className={iconWrapClass}>
            <Mail className={`w-4 h-4 ${accentIconClass}`} />
          </div>
          <div className="text-xs">
            <span className={`block opacity-50 font-medium ${isCyber ? 'uppercase tracking-widest font-mono text-[10px]' : ''}`}>
              {isCyber ? 'Channel' : 'Email'}
            </span>
            <span className={`font-bold ${isCyber ? 'font-mono text-cyan-200' : ''}`}>contact@brandforge.ai</span>
          </div>
        </div>
        {answers.socialUrl && (
          <div className="flex items-center gap-3">
            <div className={iconWrapClass}>
              {detectSocialPlatform(answers.socialUrl) === 'linkedin'
                ? <LinkedinIcon className={`w-4 h-4 ${accentIconClass}`} />
                : <GithubIcon className={`w-4 h-4 ${accentIconClass}`} />}
            </div>
            <div className="text-xs">
              <span className={`block opacity-50 font-medium ${isCyber ? 'uppercase tracking-widest font-mono text-[10px]' : ''}`}>Link</span>
              <a href={answers.socialUrl} target="_blank" rel="noopener noreferrer" className={`font-bold hover:underline break-all ${isCyber ? 'text-cyan-300 font-mono' : 'text-indigo-400'}`}>
                {answers.socialUrl}
              </a>
            </div>
          </div>
        )}
        {answers.resumeFileName && (
          <button onClick={handleDownloadSimulate} className={`${themeClass.buttonSecondary} flex items-center gap-2 mt-4 w-fit`}>
            <Download className="w-4 h-4" /> {isCyber ? 'Pull Resume' : 'Download Resume'}
          </button>
        )}
        <div className="flex items-center gap-2 mt-2">
          {answers.socialUrl && (
            <a href={answers.socialUrl} target="_blank" rel="noopener noreferrer" className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${isGlass ? 'bg-white/10 border border-white/20 backdrop-blur-xl hover:bg-white/20' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}>
              {detectSocialPlatform(answers.socialUrl) === 'linkedin'
                ? <LinkedinIcon className="w-3.5 h-3.5" />
                : <GithubIcon className="w-3.5 h-3.5" />}
            </a>
          )}
        </div>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); alert("Simulating Form Submission: Message logged inside dynamic portfolio context!"); }} className="flex flex-col gap-3 text-left">
        {isCyber && <p className="text-[10px] font-mono text-cyan-500/60 mb-1">$ compose --new-transmission</p>}
        <input type="text" placeholder={isCyber ? 'IDENTIFIER' : 'Your Name'} required className={inputClass} />
        <input type="email" placeholder={isCyber ? 'RETURN CHANNEL' : 'Your Email'} required className={inputClass} />
        <textarea placeholder={isCyber ? 'MESSAGE PAYLOAD' : 'Message'} required rows="3" className={`${inputClass} resize-none`} />
        <button type="submit" className={`${themeClass.buttonPrimary} w-full text-center text-xs py-3`}>
          {isCyber ? 'Transmit Message' : 'Send Message'}
        </button>
      </form>
    </div>
  );

  return (
    <Reveal>
      <section id="contact" className={themeClass.section}>
        <span className={themeClass.eyebrow}>{isCyber ? '[ CONTACT ]' : 'Contact'}</span>
        <h3 className={`${themeClass.title} mt-2`}>{isCyber ? 'Open Channel' : 'Get In Touch'}</h3>
        <p className={themeClass.subtitle}>
          {isCyber ? 'Encrypted uplink — auto-populated from your interview data.' : 'Auto-filled from your interview answers — reach out below.'}
        </p>
        {panelClass ? <div className={`${panelClass} mt-2`}>{Body}</div> : Body}
      </section>
    </Reveal>
  );
}

function renderFooter(themeClass, answers) {
  const name = answers.name || "Jane Dev";
  const year = new Date().getFullYear();

  if (themeClass.footerLayout === 'terminal') {
    return (
      <footer className={themeClass.footer}>
        <p>$ echo "© {year} {name}. All rights reserved."<span className="inline-block w-1.5 h-3 bg-lime-500 ml-1 animate-pulse align-middle" /></p>
        <p className="text-[10px] opacity-50 mt-1">Built by BrandForge AI</p>
      </footer>
    );
  }

  if (themeClass.footerLayout === 'colophon') {
    return (
      <footer className={themeClass.footer}>
        <div className="w-8 h-[1px] bg-amber-700 mx-auto mb-4" />
        <p className="text-[10px] tracking-[0.3em]">{name.toUpperCase()} · EST. {year}</p>
        <p className="text-[9px] opacity-50 mt-2 tracking-widest">Designed with BrandForge AI</p>
      </footer>
    );
  }

  if (themeClass.footerLayout === 'hud') {
    return (
      <footer className={themeClass.footer}>
        <p className="font-mono">[ SYSTEM ] © {year} {name} — ALL RIGHTS RESERVED</p>
        <p className="text-[10px] opacity-50 mt-1 font-mono">// compiled by BrandForge AI</p>
      </footer>
    );
  }

  if (themeClass.footerLayout === 'glass') {
    return (
      <footer className="backdrop-blur-md bg-white/5 border-t border-white/10 text-slate-400 py-8 px-6 text-center text-sm relative">
        <p>© {year} {name}. All rights reserved.</p>
        <p className="text-[10px] opacity-50 mt-1 uppercase tracking-widest">Designed with BrandForge AI</p>
      </footer>
    );
  }

  if (themeClass.footerLayout === 'notion') {
    return (
      <footer className={`${themeClass.footer} text-left`}>
        <p>© {year} {name}</p>
      </footer>
    );
  }

  if (themeClass.footerLayout === 'saas') {
    return (
      <footer className={`${themeClass.footer} !text-left`}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between gap-6">
          <div>
            <p className="font-bold text-white text-sm">{name}</p>
            <p className="text-xs opacity-50 mt-1">© {year} All rights reserved.</p>
          </div>
          <div className="flex gap-6 text-xs opacity-60">
            <a href="#about" className="hover:opacity-100 transition-opacity">About</a>
            <a href="#skills" className="hover:opacity-100 transition-opacity">Skills</a>
            <a href="#projects" className="hover:opacity-100 transition-opacity">Projects</a>
            <a href="#contact" className="hover:opacity-100 transition-opacity">Contact</a>
          </div>
        </div>
        <p className="text-[10px] opacity-30 mt-6 max-w-5xl mx-auto uppercase tracking-widest">Designed and compiled dynamically by BrandForge AI</p>
      </footer>
    );
  }

  // default: minimal (apple)
  return (
    <footer className={themeClass.footer}>
      <p>© {year} {name}. All rights reserved.</p>
      <p className="text-[10px] opacity-40 mt-1 uppercase tracking-widest">Designed and compiled dynamically by BrandForge AI</p>
    </footer>
  );
}