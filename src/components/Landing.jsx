import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, MessageSquareText, Wand2, LayoutTemplate } from 'lucide-react';
import { useBrandData } from '../context/BrandContext';

const easeOut = [0.16, 1, 0.3, 1];

const FEATURES = [
  {
    icon: MessageSquareText,
    title: 'Conversational setup',
    description: 'Answer 6–8 direct questions or upload a resume to populate every detail instantly.'
  },
  {
    icon: Wand2,
    title: 'AI copywriting',
    description: 'Plain statements become polished summaries, headlines, and metrics — automatically.'
  },
  {
    icon: LayoutTemplate,
    title: 'Multi-theme presets',
    description: 'Switch instantly between minimal, glass, luxury, terminal, and more.'
  }
];

export default function Landing() {
  const { setScreen } = useBrandData();
  const [typedText, setTypedText] = useState('');
  const fullTagline = "Your personal brand, built by AI in 60 seconds";
  const [stage, setStage] = useState(0);

  // Typing effect — unchanged behavior
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(fullTagline.slice(0, index + 1));
      index++;
      if (index >= fullTagline.length) {
        clearInterval(interval);
      }
    }, 45);
    return () => clearInterval(interval);
  }, []);

  // Live preview loop: interview state <-> generated portfolio state
  useEffect(() => {
    const loop = setInterval(() => {
      setStage((s) => (s + 1) % 2);
    }, 3400);
    return () => clearInterval(loop);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0A0A0B] text-white font-sans overflow-hidden flex flex-col">
      {/* Single restrained ambient accent — no multi-color gradient soup */}
      <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[130px] pointer-events-none" />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.04)_1px,transparent_0)] bg-[size:32px_32px] pointer-events-none opacity-40"
        aria-hidden="true"
      />

      {/* Header */}
      <header className="relative z-10 container mx-auto px-6 md:px-12 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-black" />
          </div>
          <span className="font-semibold text-lg tracking-tight text-white">
            BrandForge <span className="text-white/40 font-normal">AI</span>
          </span>
        </div>
        <nav className="hidden sm:flex items-center gap-8 text-sm text-white/60">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 text-xs font-mono text-indigo-300">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            MVP live
          </span>
        </nav>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-grow container mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-16 lg:gap-12 items-center py-12 lg:py-0">
        {/* Left column — copy */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
          }}
          className="max-w-xl"
        >
          <motion.span
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.5, ease: easeOut }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-xs font-mono text-white/60 mb-6"
          >
            <Sparkles className="w-3 h-3 text-indigo-400" />
            AI portfolio engine
          </motion.span>

          <motion.h1
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, ease: easeOut }}
            className="text-5xl sm:text-6xl lg:text-[4rem] font-semibold tracking-tight leading-[1.05] mb-6"
          >
            <span className="text-white/50 font-light">Build your</span><br />
            digital presence.<br />
            <span className="text-white">Without writing code.</span>
          </motion.h1>

          <motion.p
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.5, ease: easeOut }}
            className="h-6 mb-10 font-mono text-sm sm:text-base text-white/50"
          >
            {typedText}
            <span className="inline-block w-[2px] h-4 ml-1 bg-indigo-400 animate-pulse align-middle" />
          </motion.p>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.5, ease: easeOut }}
            className="flex items-center gap-4"
          >
            <button
              onClick={() => setScreen('interview')}
              className="group inline-flex items-center gap-2.5 bg-white text-black font-medium text-sm rounded-full pl-6 pr-5 py-3.5 hover:bg-white/90 active:scale-[0.98] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0B]"
            >
              Build my brand
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            <span className="text-xs text-white/40 font-mono">No signup required</span>
          </motion.div>
        </motion.div>

        {/* Right column — live interview → portfolio preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: easeOut }}
          className="relative"
        >
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
          <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/10">
              <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
              <span className="ml-3 text-[11px] font-mono text-white/30">
                {stage === 0 ? 'interview.ai' : 'preview.live'}
              </span>
            </div>

            <div className="p-6 sm:p-8 h-[280px] flex items-center">
              <AnimatePresence mode="wait">
                {stage === 0 ? (
                  <motion.div
                    key="input"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.4, ease: easeOut }}
                    className="w-full space-y-4"
                  >
                    <div className="max-w-[80%] rounded-2xl rounded-bl-sm bg-white/[0.06] border border-white/10 px-4 py-3 text-sm text-white/70">
                      What's your role and biggest achievement?
                    </div>
                    <div className="max-w-[85%] ml-auto rounded-2xl rounded-br-sm bg-indigo-500/15 border border-indigo-400/20 px-4 py-3 text-sm text-white">
                      Senior Product Designer — led a redesign that lifted conversion 34%.
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-white/30 pt-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                      Drafting your headline...
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="output"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.4, ease: easeOut }}
                    className="w-full"
                  >
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <div className="h-3 w-28 rounded bg-white/80 mb-2" />
                        <div className="h-2 w-40 rounded bg-white/25" />
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600" />
                    </div>
                    <div className="h-2 w-full rounded bg-white/10 mb-2" />
                    <div className="h-2 w-5/6 rounded bg-white/10 mb-5" />
                    <div className="flex gap-2">
                      <span className="px-2.5 py-1 rounded-full border border-indigo-400/30 bg-indigo-500/10 text-[11px] font-mono text-indigo-300">
                        +34% conversion
                      </span>
                      <span className="px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-[11px] font-mono text-white/50">
                        Product design
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Features */}
      <section id="features" className="relative z-10 container mx-auto px-6 md:px-12 py-24 border-t border-white/5">
        <div className="grid md:grid-cols-3 gap-px bg-white/5 rounded-2xl overflow-hidden">
          {FEATURES.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: easeOut }}
              className="bg-[#0A0A0B] p-8"
            >
              <Icon className="w-5 h-5 text-indigo-400 mb-5" strokeWidth={1.5} />
              <h3 className="font-medium text-white mb-2 text-base">{title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 text-center py-8 text-xs text-white/30 font-mono">
        © {new Date().getFullYear()} BrandForge AI — built for the modern web professional.
      </footer>
    </div>
  );
}