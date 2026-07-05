import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Sparkles, Upload, Check, AlertCircle, RefreshCw, 
  ArrowLeft, ArrowRight, Palette, Layers, Terminal 
} from 'lucide-react';
import { useBrandData } from '../context/BrandContext';

const PRESET_ROLES = [
  "Full-Stack Engineer",
  "UI/UX Product Designer",
  "Frontend Developer",
  "Backend engineer",
  "Product Manager",
  "Data Scientist"
];

const PRESET_SKILLS = [
  "React", "JavaScript", "TypeScript", "NodeJS", "Figma", 
  "TailwindCSS", "Next.js", "Python", "PostgreSQL", "Framer Motion",
  "Git", "Docker", "UI Design", "User Research", "REST APIs"
];

const THEMES = [
  { id: 'apple', name: 'Apple', desc: 'White background, frosted glass, smooth subtle micro-animations.', color: 'from-gray-100 to-gray-200 border-gray-300 text-gray-800' },
  { id: 'cyberpunk', name: 'Cyberpunk', desc: 'Neon violet/cyan glow, monospace fonts, grid layouts.', color: 'from-fuchsia-950 to-cyan-950 border-purple-500 text-purple-300' },
  { id: 'glassmorphism', name: 'Glassmorphism', desc: 'Frosted floating tiles, colorful gradient backdrops.', color: 'from-indigo-900/40 to-pink-900/40 border-pink-400/50 text-white' },
  { id: 'luxury', name: 'Luxury', desc: 'Elegant charcoal, gold-lined trimmings, serif headers.', color: 'from-stone-900 to-amber-950 border-yellow-600 text-yellow-100' },
  { id: 'minimal', name: 'Minimal', desc: 'Clean whitespace, stark high-contrast text, single accent tone.', color: 'from-white to-slate-50 border-slate-200 text-slate-900' },
  { id: 'dark', name: 'Dark Theme', desc: 'Deep charcoal background, sharp electric blue highlights.', color: 'from-slate-900 via-slate-950 to-slate-900 border-blue-500 text-blue-200' },
  { id: 'developer', name: 'Developer', desc: 'Terminal aesthetics, monospace outputs, syntax hues.', color: 'from-zinc-900 to-black border-lime-500 text-lime-400' }
];

const easeOut = [0.16, 1, 0.3, 1];

// Shared input/button styling tokens so every step reads as one system
const fieldClass =
  "flex-grow bg-white/[0.03] border border-white/10 text-white rounded-xl px-4 py-3 " +
  "placeholder-white/25 text-sm transition-all duration-200 " +
  "focus:outline-none focus:border-indigo-400/40 focus:ring-2 focus:ring-indigo-400/20";

const primaryBtnClass =
  "bg-white text-black font-medium rounded-xl transition-all duration-200 " +
  "hover:bg-white/90 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0B]";

const cardClass = "bg-white/[0.02] border border-white/10 rounded-2xl p-5";

export default function ChatFlow() {
  const { 
    screen, setScreen, answers, updateAnswer, updateBulkAnswers,
    runAISimulations, handleResumeUpload, isParsingResume, resumeParsedData
  } = useBrandData();

  const [step, setStep] = useState(0); // 0 to 7 — unchanged
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "👋 Hi there! I'm BrandForge AI. Let's create a beautiful portfolio for you in under a minute." }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [customSkill, setCustomSkill] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    // scroll to bottom — unchanged
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, step, isParsingResume]);

  // Set the prompt message for the current step — unchanged
  useEffect(() => {
    const askQuestion = () => {
      let promptText = "";
      switch (step) {
        case 0:
          promptText = "First, what is your full name?";
          break;
        case 1:
          promptText = `Nice to meet you, ${answers.name || 'friend'}! What role or title best describes your work? You can choose a preset or type your own.`;
          break;
        case 2:
          promptText = "Select your top 4-6 skills. Click presets to add, or type custom skills below.";
          break;
        case 3:
          promptText = "Briefly describe yourself/your passion in one single sentence (e.g., 'Building intuitive, high-performance web products').";
          break;
        case 4:
          promptText = "Have a resume? Drag & drop or upload it to automatically import your projects, timeline, and education history (optional, click 'Skip' to continue).";
          break;
        case 5:
          promptText = "Paste your LinkedIn or GitHub URL, or leave blank to continue.";
          break;
        case 6:
          promptText = "Choose a visual style archetype for your website design:";
          break;
        case 7:
          promptText = "Finally, choose the animation energy intensity:";
          break;
        default:
          break;
      }
      setMessages(prev => [...prev, { sender: 'bot', text: promptText }]);
    };

    // Delay prompt slightly to look natural — unchanged
    const timer = setTimeout(askQuestion, 300);
    return () => clearTimeout(timer);
  }, [step]);

  const handleSend = (textToSend = null) => {
    const textVal = textToSend !== null ? textToSend : inputValue;
    if (step === 0 && !textVal.trim()) return;
    if (step === 3 && !textVal.trim()) return;

    if (textVal) {
      setMessages(prev => [...prev, { sender: 'user', text: textVal }]);
    }
    setInputValue('');

    // Save field responses — unchanged
    if (step === 0) {
      updateAnswer('name', textVal);
      setStep(1);
    } else if (step === 1) {
      updateAnswer('role', textVal);
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      updateAnswer('bio', textVal);
      setStep(4);
    } else if (step === 4) {
      setStep(5);
    } else if (step === 5) {
      updateAnswer('socialUrl', textVal);
      setStep(6);
    } else if (step === 6) {
      setStep(7);
    } else if (step === 7) {
      setScreen('generating');
      runAISimulations();
    }
  };

  const handleSelectRole = (role) => {
    updateAnswer('role', role);
    handleSend(role);
  };

  const handleToggleSkill = (skill) => {
    let currentSkills = [...(answers.skills || [])];
    if (currentSkills.includes(skill)) {
      currentSkills = currentSkills.filter(s => s !== skill);
    } else {
      currentSkills.push(skill);
    }
    updateAnswer('skills', currentSkills);
  };

  const handleAddCustomSkill = () => {
    const skill = customSkill.trim();
    if (skill && !answers.skills.includes(skill)) {
      updateAnswer('skills', [...answers.skills, skill]);
      setCustomSkill('');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleResumeUpload(file.name);
    }
  };

  const renderInputArea = () => {
    switch (step) {
      case 0:
        return (
          <div className="flex gap-2 w-full max-w-lg">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g. Jane Dev"
              className={fieldClass}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              autoFocus
            />
            <button 
              onClick={() => handleSend()}
              aria-label="Send"
              className={`${primaryBtnClass} p-3 shrink-0`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        );

      case 1:
        return (
          <div className="flex flex-col gap-4 w-full max-w-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_ROLES.map((role) => (
                <motion.button
                  key={role}
                  onClick={() => handleSelectRole(role)}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-indigo-400/30 text-sm text-white/80 hover:text-white rounded-xl px-4 py-2.5 text-left transition-colors duration-200 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50"
                >
                  {role}
                </motion.button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Or type a custom role"
                className={fieldClass}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={() => handleSend()}
                className={`${primaryBtnClass} px-5 text-sm shrink-0`}
              >
                Send
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className={`flex flex-col gap-4 w-full max-w-lg ${cardClass}`}>
            <p className="text-xs font-medium text-white/40 uppercase tracking-widest font-mono">Select skills</p>
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
              {PRESET_SKILLS.map((skill) => {
                const selected = answers.skills.includes(skill);
                return (
                  <motion.button
                    key={skill}
                    layout
                    onClick={() => handleToggleSkill(skill)}
                    whileTap={{ scale: 0.96 }}
                    className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 ${
                      selected 
                        ? 'bg-indigo-500 border-indigo-500 text-white' 
                        : 'bg-white/[0.02] border-white/10 hover:border-white/25 text-white/60 hover:text-white/90'
                    }`}
                  >
                    {skill}
                  </motion.button>
                );
              })}
            </div>
            <div className="flex gap-2 border-t border-white/10 pt-4">
              <input
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                placeholder="Add custom skill..."
                className="flex-grow bg-white/[0.02] border border-white/10 text-white rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-400/40 focus:ring-2 focus:ring-indigo-400/20 placeholder-white/20 text-xs transition-all duration-200"
                onKeyDown={(e) => e.key === 'Enter' && handleAddCustomSkill()}
              />
              <button
                onClick={handleAddCustomSkill}
                className="bg-white/[0.05] hover:bg-white/[0.1] text-xs text-white px-3 py-2 rounded-xl transition-colors duration-200 border border-white/10"
              >
                Add
              </button>
            </div>
            <button 
              onClick={() => handleSend(`${answers.skills.length} skills selected`)}
              disabled={answers.skills.length === 0}
              className={`${primaryBtnClass} mt-1 py-2.5 text-sm flex items-center justify-center gap-1.5`}
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        );

      case 3:
        return (
          <div className="flex gap-2 w-full max-w-lg">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g. Building scalable react products that prioritize pixel-perfection."
              className={`${fieldClass} h-20 resize-none`}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            />
            <button 
              onClick={() => handleSend()}
              aria-label="Send"
              className={`${primaryBtnClass} p-3 self-end shrink-0`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        );

      case 4:
        return (
          <div className="flex flex-col gap-3 w-full max-w-lg">
            <label className="border border-dashed border-white/15 hover:border-indigo-400/40 bg-white/[0.02] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors duration-300 group">
              <input 
                type="file" 
                accept=".pdf,.txt,.docx"
                className="hidden" 
                onChange={handleFileUpload}
                disabled={isParsingResume}
              />
              <Upload className="w-7 h-7 text-white/30 group-hover:text-indigo-400 transition-colors duration-200 mb-3" />
              <p className="text-sm font-medium text-white/70">
                {answers.resumeFileName ? answers.resumeFileName : "Upload your resume (PDF/TXT)"}
              </p>
              <p className="text-xs text-white/30 mt-1">Supports drag & drop or file explorer click</p>
            </label>

            <AnimatePresence>
              {isParsingResume && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: easeOut }}
                  className={`${cardClass} flex flex-col gap-2 overflow-hidden`}
                >
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span className="flex items-center gap-1.5 font-mono">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" /> AI resume engine parsing...
                    </span>
                    <span className="font-mono text-white/40">45%</span>
                  </div>
                  <div className="w-full bg-white/[0.05] h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      className="bg-indigo-400 h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "80%" }}
                      transition={{ duration: 2.2, ease: "easeInOut" }}
                    />
                  </div>
                  <p className="text-[10px] text-white/30 font-mono leading-normal">
                    - Parsing structures... <br/>
                    - Mapping name & role fields... <br/>
                    - Found projects array indices...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {resumeParsedData && !isParsingResume && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: easeOut }}
                  className="p-4 bg-indigo-500/[0.08] border border-indigo-400/20 rounded-xl text-left"
                >
                  <div className="flex items-center gap-2 text-indigo-300 text-xs font-medium mb-2">
                    <Check className="w-4 h-4 text-indigo-400" /> Auto-fill import successful
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Imported profile data for <span className="font-medium text-white">{resumeParsedData.name}</span> as <span className="font-medium text-white">{resumeParsedData.role}</span>. Populated {resumeParsedData.skills.length} skills and {resumeParsedData.projects.length} project cards.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-2 mt-1">
              <button 
                onClick={() => handleSend(answers.resumeFileName ? "Resume parsed and imported" : "Skipped resume upload")}
                disabled={isParsingResume}
                className={`${primaryBtnClass} flex-grow py-2.5 text-sm`}
              >
                {answers.resumeFileName ? "Apply & Continue" : "Skip Upload"}
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="flex gap-2 w-full max-w-lg">
            <input
              type="url"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g. https://github.com/alex-dev"
              className={fieldClass}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              autoFocus
            />
            <button 
              onClick={() => handleSend(inputValue || "Skipped URLs")}
              className={`${primaryBtnClass} px-5 text-sm shrink-0`}
            >
              Continue
            </button>
          </div>
        );

      case 6:
        return (
          <div className="flex flex-col gap-4 w-full max-w-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
              {THEMES.map((theme) => {
                const selected = answers.theme === theme.id;
                return (
                  <motion.button
                    key={theme.id}
                    onClick={() => updateAnswer('theme', theme.id)}
                    whileTap={{ scale: 0.98 }}
                    className={`p-3.5 text-left rounded-xl border transition-colors duration-200 flex flex-col gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 ${
                      selected 
                        ? 'border-indigo-400/50 bg-indigo-500/[0.08]' 
                        : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="font-medium text-sm text-white">{theme.name}</span>
                      {selected && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                    </div>
                    <span className="text-[11px] text-white/40 leading-normal">{theme.desc}</span>
                  </motion.button>
                );
              })}
            </div>
            <button 
              onClick={() => handleSend(`Style selected: ${answers.theme}`)}
              className={`${primaryBtnClass} py-2.5 text-sm flex items-center justify-center gap-1.5`}
            >
              Apply theme <Palette className="w-4 h-4" />
            </button>
          </div>
        );

      case 7:
        return (
          <div className={`flex flex-col gap-4 w-full max-w-lg ${cardClass}`}>
            <p className="text-xs font-medium text-white/40 uppercase tracking-widest font-mono">Select motion scale</p>
            <div className="grid grid-cols-3 gap-2">
              {['normal', 'fancy', 'crazy'].map((intensity) => {
                const selected = answers.animation === intensity;
                return (
                  <motion.button
                    key={intensity}
                    onClick={() => updateAnswer('animation', intensity)}
                    whileTap={{ scale: 0.96 }}
                    className={`py-2 px-3 rounded-lg border text-xs font-medium capitalize transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 ${
                      selected 
                        ? 'bg-indigo-500 border-indigo-500 text-white' 
                        : 'bg-white/[0.02] border-white/10 hover:border-white/25 text-white/50'
                    }`}
                  >
                    {intensity}
                  </motion.button>
                );
              })}
            </div>
            <button 
              onClick={() => handleSend(`Animation Level: ${answers.animation}`)}
              className={`${primaryBtnClass} mt-1 py-3 text-sm flex items-center justify-center gap-1.5`}
            >
              Generate my brand <Sparkles className="w-4 h-4" />
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  const progressPct = Math.round((step / 8) * 100);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white flex flex-col items-center justify-between font-sans relative overflow-hidden">
      {/* Background decoration — single restrained ambient glow */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-600/[0.06] to-transparent pointer-events-none" />

      {/* Header bar */}
      <header className="w-full border-b border-white/5 px-6 py-4 flex flex-col gap-3 bg-[#0A0A0B]/80 backdrop-blur-md relative z-10">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => step > 0 ? setStep(s => s - 1) : setScreen('landing')}
            className="flex items-center gap-1.5 text-xs font-medium text-white/50 hover:text-white transition-colors duration-200 py-1.5 px-3 border border-white/10 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs font-mono text-white/40">
              {progressPct}%
            </span>
          </div>
        </div>
        {/* Slim progress bar — new, non-functional addition (purely visual anchor) */}
        <div className="w-full h-1 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className="h-full bg-indigo-400 rounded-full"
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.5, ease: easeOut }}
          />
        </div>
      </header>

      {/* Main chat window */}
      <main className="flex-grow w-full max-w-2xl px-6 py-8 flex flex-col justify-between overflow-y-auto relative z-10">
        {/* Chat bubbles area */}
        <div className="flex-grow flex flex-col gap-5 py-4 overflow-y-auto select-none">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, ease: easeOut }}
                className={`flex items-end gap-2.5 w-full ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 mb-0.5">
                    <Sparkles className="w-3 h-3 text-black" />
                  </div>
                )}
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm border ${
                  msg.sender === 'bot' 
                    ? 'bg-white/[0.04] border-white/10 text-white/90 rounded-bl-sm' 
                    : 'bg-indigo-500 border-indigo-500 text-white rounded-br-sm'
                }`}>
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>

        {/* Input box section */}
        <div className="mt-6 flex justify-center w-full min-h-[120px] items-start border-t border-white/5 pt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: easeOut }}
              className="w-full flex justify-center"
            >
              {renderInputArea()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}