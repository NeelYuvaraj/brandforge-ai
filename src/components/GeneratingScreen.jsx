import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Sparkles, Check } from 'lucide-react';
import { useBrandData } from '../context/BrandContext';

const TICKS = [
  "Structuring profile context...",
  "Running AI Headline generator...",
  "Polishing bio with AI Copywriter...",
  "Formatting responsive layout styles...",
  "Setting up animation motion frames...",
  "Evaluating initial portfolio SEO score...",
  "Finalizing design templates..."
];

export default function GeneratingScreen() {
  const { setScreen, answers } = useBrandData();
  const [currentTick, setCurrentTick] = useState(0);
  const [completeTicks, setCompleteTicks] = useState([]);

  useEffect(() => {
    // Increment logs — unchanged timing/logic
    const interval = setInterval(() => {
      setCompleteTicks(prev => [...prev, currentTick]);
      setCurrentTick(curr => {
        if (curr < TICKS.length - 1) {
          return curr + 1;
        } else {
          clearInterval(interval);
          // Wait 600ms and switch to preview page
          setTimeout(() => {
            setScreen('preview');
          }, 600);
          return curr;
        }
      });
    }, 450); // 450ms per step = ~3.2s total

    return () => clearInterval(interval);
  }, [currentTick, setScreen]);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white flex flex-col items-center justify-center font-sans relative overflow-hidden select-none">
      {/* Background radial glow — single restrained accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/[0.06] blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md p-8 flex flex-col items-center text-center relative z-10">

        {/* Loading icon */}
        <div className="relative mb-8">
          <motion.div 
            className="absolute -inset-3 rounded-full border border-indigo-400/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center relative">
            <Cpu className="w-7 h-7 text-indigo-400" />
          </div>
        </div>

        {/* Header text */}
        <h2 className="text-2xl font-semibold tracking-tight mb-1.5 text-white">
          Synthesizing your portfolio
        </h2>
        <p className="text-xs text-white/40 mb-8">Please wait while the AI builds your digital workspace...</p>

        {/* Progress terminal window */}
        <div className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-5 text-left font-mono text-xs flex flex-col gap-2 min-h-[220px]">
          <div className="flex gap-1.5 mb-2 pb-2 border-b border-white/10 text-[10px] text-white/30 uppercase tracking-widest font-medium items-center justify-between">
            <span>Terminal core</span>
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white/15" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/15" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/15" />
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-grow justify-start">
            {TICKS.slice(0, currentTick + 1).map((tick, i) => {
              const done = completeTicks.includes(i);
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start gap-2.5"
                >
                  {done ? (
                    <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  ) : (
                    <SpinnerCircle />
                  )}
                  <span className={done ? 'text-white/50' : 'text-white/90 font-medium'}>
                    {tick}
                    {!done && <span className="inline-block w-1.5 h-3 bg-indigo-400 ml-1 animate-pulse" />}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Global progress bar */}
        <div className="w-full bg-white/[0.05] h-1 rounded-full mt-6 overflow-hidden">
          <motion.div 
            className="h-full bg-indigo-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: TICKS.length * 0.45, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );
}

function SpinnerCircle() {
  return (
    <div className="w-3.5 h-3.5 border border-indigo-400/60 border-t-transparent rounded-full animate-spin shrink-0 mt-0.5" />
  );
}