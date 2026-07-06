// Client themes configuration for Personal Brand Builder

export const THEME_STYLES = {
  apple: {
    container: "bg-slate-50 text-slate-800 font-sans min-h-screen",
    nav: "border-b border-slate-100 bg-white/80 backdrop-blur-md py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-30",
    section: "py-16 px-6 md:px-12 max-w-5xl mx-auto border-b border-slate-100 last:border-0",
    card: "bg-white/90 border border-slate-100 shadow-sm hover:shadow-lg rounded-3xl p-6 backdrop-blur-lg transition-all duration-300 hover:scale-[1.015]",
    title: "text-3xl md:text-4xl font-semibold tracking-tight text-slate-900",
    subtitle: "text-lg text-slate-500 mt-2 font-light",
    accentText: "text-slate-900 font-semibold tracking-tight",
    buttonPrimary: "bg-slate-900 text-white hover:bg-slate-800 active:scale-95 font-medium text-sm rounded-full py-2.5 px-6 transition duration-200",
    buttonSecondary: "bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-95 font-medium text-sm rounded-full py-2.5 px-6 transition duration-200",
    badge: "bg-slate-100 border border-slate-200/60 text-slate-600 rounded-full px-3 py-1 text-xs font-medium",
    footer: "bg-white border-t border-slate-100 text-slate-400 py-10 px-6 text-center text-sm",
    heroLayout: "centered",
    navStyle: "topbar",
    projectLayout: "grid",
    voice: "Elegant & refined",
    accentColor: "#0F172A",
    eyebrow: "text-xs uppercase tracking-[0.2em] text-slate-400 font-medium",
    bioLayout: "lede",
    skillsLayout: "pills",
    footerLayout: "minimal",
    density: "spacious"
  },
  cyberpunk: {
    container: "bg-zinc-950 text-zinc-100 font-mono min-h-screen selection:bg-fuchsia-500 selection:text-white pb-6",
    nav: "border-b border-fuchsia-500/20 bg-zinc-950/80 backdrop-blur-md py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-30",
    section: "py-16 px-6 md:px-12 max-w-5xl mx-auto border-b border-fuchsia-500/10 last:border-0",
    card: "bg-zinc-900/60 border border-fuchsia-500/30 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] backdrop-blur-md rounded-none p-6 transition-all duration-300 relative before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-fuchsia-500",
    title: "text-3xl md:text-4xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-purple-400 to-cyan-400 uppercase",
    subtitle: "text-sm text-cyan-400 font-mono mt-1 uppercase tracking-widest",
    accentText: "text-fuchsia-400 font-bold uppercase tracking-wider text-sm",
    buttonPrimary: "border border-fuchsia-500 bg-fuchsia-950/20 text-fuchsia-400 hover:bg-fuchsia-500 hover:text-black font-semibold text-xs tracking-widest uppercase py-2.5 px-6 transition duration-300 shadow-[0_0_10px_rgba(240,70,250,0.15)] hover:shadow-[0_0_20px_rgba(240,70,250,0.5)]",
    buttonSecondary: "border border-cyan-500 bg-cyan-950/20 text-cyan-405 hover:bg-cyan-500 hover:text-black font-semibold text-xs tracking-widest uppercase py-2.5 px-6 transition duration-300 shadow-[0_0_10px_rgba(34,211,238,0.15)] hover:shadow-[0_0_20px_rgba(34,211,238,0.5)]",
    badge: "bg-cyan-500/15 border border-cyan-400/40 text-cyan-400 rounded-none px-2.5 py-1 uppercase tracking-wider text-[10px]",
    footer: "border-t border-fuchsia-500/10 bg-zinc-950 text-zinc-650 py-10 px-6 text-center text-xs",
    heroLayout: "neon",
    navStyle: "breadcrumb",
    projectLayout: "log",
    voice: "Bold & futuristic",
    accentColor: "#E879F9",
    eyebrow: "text-[10px] uppercase tracking-[0.3em] text-cyan-400 font-mono",
    bioLayout: "hud",
    skillsLayout: "neon",
    footerLayout: "hud",
    density: "normal"
  },
  glassmorphism: {
    // Deep gradient + multiple radial "orbs" so backdrop-blur has real color to refract.
    // Also adds two floating blurred blobs via before:/after: (pure Tailwind, no new markup).
    container:
      "relative min-h-screen overflow-hidden text-white font-sans pb-8 " +
      "bg-[radial-gradient(ellipse_60%_50%_at_15%_15%,rgba(236,72,153,0.35),transparent_60%),radial-gradient(ellipse_55%_45%_at_85%_20%,rgba(6,182,212,0.30),transparent_60%),radial-gradient(ellipse_70%_55%_at_50%_100%,rgba(139,92,246,0.40),transparent_65%),linear-gradient(180deg,#0b1020_0%,#141033_50%,#1a0f3d_100%)] " +
      "before:content-[''] before:pointer-events-none before:absolute before:-top-24 before:-left-24 before:w-[520px] before:h-[520px] before:rounded-full before:bg-pink-500/30 before:blur-3xl " +
      "after:content-[''] after:pointer-events-none after:absolute after:bottom-[-160px] after:right-[-120px] after:w-[560px] after:h-[560px] after:rounded-full after:bg-cyan-400/25 after:blur-3xl",

    nav:
      "sticky top-0 z-30 py-4 px-6 md:px-12 flex justify-between items-center " +
      "bg-white/10 backdrop-blur-2xl backdrop-saturate-150 " +
      "border-b border-white/20 " +
      "shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.25)]",

    section:
      "relative py-16 px-6 md:px-12 max-w-5xl mx-auto border-b border-white/10 last:border-0",

    card:
      "relative bg-white/10 border border-white/20 " +
      "backdrop-blur-2xl backdrop-saturate-150 " +
      "rounded-3xl p-6 " +
      "shadow-[0_10px_40px_-10px_rgba(0,0,0,0.55),0_2px_6px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.30)] " +
      "hover:bg-white/15 hover:border-white/30 " +
      "hover:shadow-[0_18px_50px_-12px_rgba(0,0,0,0.65),0_4px_10px_rgba(0,0,0,0.30),inset_0_1px_0_rgba(255,255,255,0.40)] " +
      "transition-all duration-300 " +
      "before:content-[''] before:absolute before:inset-x-6 before:top-0 before:h-px " +
      "before:bg-gradient-to-r before:from-transparent before:via-white/70 before:to-transparent " +
      "after:content-[''] after:absolute after:inset-0 after:rounded-3xl after:pointer-events-none " +
      "after:bg-[linear-gradient(135deg,rgba(255,255,255,0.10),rgba(255,255,255,0)_40%)]",

    title:
      "text-3xl md:text-5xl font-extrabold tracking-tight " +
      "bg-gradient-to-r from-pink-300 via-fuchsia-200 to-cyan-200 " +
      "bg-clip-text text-transparent " +
      "drop-shadow-[0_2px_12px_rgba(236,72,153,0.35)]",

    subtitle: "text-base text-white/70 mt-2 font-light",
    accentText: "text-pink-300 font-semibold",

    buttonPrimary:
      "border border-white/30 bg-white/20 hover:bg-white/30 active:scale-95 " +
      "text-white font-semibold text-sm rounded-full py-2.5 px-6 " +
      "transition-all duration-300 backdrop-blur-xl backdrop-saturate-150 " +
      "shadow-[0_8px_24px_rgba(0,0,0,0.30),inset_0_1px_0_rgba(255,255,255,0.45)]",

    buttonSecondary:
      "border border-white/20 bg-white/5 hover:bg-white/15 active:scale-95 " +
      "text-white/90 font-medium text-sm rounded-full py-2.5 px-6 " +
      "transition-all duration-300 backdrop-blur-xl",

    badge:
      "bg-white/15 border border-white/25 text-white/95 " +
      "rounded-full px-3 py-1 text-xs backdrop-blur-xl " +
      "shadow-[inset_0_1px_0_rgba(255,255,255,0.30)]",

    footer:
      "border-t border-white/10 bg-white/5 backdrop-blur-xl " +
      "text-white/60 py-10 px-6 text-center text-sm",

    heroLayout: "glass",
    navStyle: "topbar",
    projectLayout: "grid",
    voice: "Soft & translucent",
    accentColor: "#F472B6",
    eyebrow: "text-xs uppercase tracking-[0.25em] text-white/60 font-medium",
    bioLayout: "glass",
    skillsLayout: "glass",
    footerLayout: "glass",
    density: "normal"
  },
  luxury: {
    container: "bg-[#090807] text-[#EDE8DF] font-serif min-h-screen selection:bg-amber-900 selection:text-amber-50",
    nav: "border-b border-amber-900/20 bg-[#090807]/90 backdrop-blur-md py-5 px-6 md:px-12 flex justify-between items-center sticky top-0 z-30",
    section: "py-20 px-6 md:px-12 max-w-5xl mx-auto border-b border-amber-900/10 last:border-0",
    card: "bg-[#0F0E0B] border border-amber-900/20 hover:border-amber-600/50 hover:shadow-[0_0_25px_rgba(217,119,6,0.08)] rounded-none p-6 transition duration-500",
    title: "text-3xl md:text-4xl text-amber-500 uppercase tracking-widest font-light",
    subtitle: "text-sm text-stone-400 font-sans tracking-wide uppercase italic mt-1",
    accentText: "text-amber-550 uppercase tracking-widest italic font-sans text-xs",
    buttonPrimary: "border border-amber-600 bg-transparent text-amber-500 hover:bg-amber-650 hover:text-black font-semibold text-[10px] tracking-widest uppercase py-3 px-6 transition duration-400 rounded-none",
    buttonSecondary: "border border-[#3A352A] bg-transparent text-[#C2B7A3] hover:border-amber-600/50 hover:text-amber-500 font-semibold text-[10px] tracking-widest uppercase py-3 px-6 transition duration-400 rounded-none",
    badge: "bg-transparent border border-amber-800/40 text-amber-500 rounded-none px-2.5 py-1 font-sans uppercase tracking-widest text-[9px]",
    footer: "border-t border-amber-905/10 bg-[#070605] text-stone-600 py-12 px-6 text-center text-xs tracking-wider uppercase font-sans",
    heroLayout: "editorial",
    navStyle: "wordmark",
    projectLayout: "list",
    voice: "Sophisticated & considered",
    accentColor: "#D97706",
    eyebrow: "text-[10px] uppercase tracking-[0.35em] text-amber-600 font-sans",
    bioLayout: "magazine",
    skillsLayout: "tags",
    footerLayout: "colophon",
    density: "spacious"
  },
  minimal: {
    container: "bg-white text-stone-850 font-sans min-h-screen selection:bg-stone-105",
    nav: "border-b border-stone-100 bg-white py-5 px-6 md:px-12 flex justify-between items-center sticky top-0 z-30",
    section: "py-16 px-6 md:px-12 max-w-4xl mx-auto border-b border-stone-100 last:border-0",
    card: "bg-white border border-stone-200 hover:border-stone-800 rounded-none p-6 transition duration-200",
    title: "text-2xl md:text-3xl font-bold tracking-tight text-stone-900",
    subtitle: "text-base text-stone-450 mt-1 font-normal",
    accentText: "text-stone-900 font-medium underline underline-offset-4 decoration-stone-300",
    buttonPrimary: "border border-stone-900 bg-stone-900 hover:bg-transparent text-white hover:text-stone-900 font-semibold text-xs tracking-wider uppercase rounded-none py-3 px-6 transition duration-200",
    buttonSecondary: "border border-stone-200 hover:border-stone-800 text-stone-800 font-semibold text-xs tracking-wider uppercase rounded-none py-3 px-6 transition duration-200",
    badge: "bg-stone-50 border border-stone-150 text-stone-650 rounded-none px-2.5 py-1 text-xs font-mono",
    footer: "border-t border-stone-100 bg-stone-50 text-stone-400 py-10 px-6 text-center text-xs uppercase tracking-widest",
    heroLayout: "editorial",
    navStyle: "wordmark",
    projectLayout: "list",
    voice: "Clean & understated",
    accentColor: "#1C1917",
    eyebrow: "text-[10px] uppercase tracking-[0.2em] text-stone-400 font-mono",
    bioLayout: "plain",
    skillsLayout: "checklist",
    footerLayout: "notion",
    density: "compact"
  },
  dark: {
    container: "bg-slate-950 text-slate-200 font-sans min-h-screen selection:bg-blue-900",
    nav: "border-b border-slate-900 bg-slate-950/80 backdrop-blur-md py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-30",
    section: "py-16 px-6 md:px-12 max-w-5xl mx-auto border-b border-slate-900 last:border-0",
    card: "bg-slate-900/60 border border-slate-900 hover:border-blue-500/40 hover:shadow-[0_0_15px_rgba(59,130,246,0.1)] rounded-2xl p-6 transition duration-300",
    title: "text-3xl md:text-4xl font-extrabold tracking-tight text-white",
    subtitle: "text-base text-slate-450 mt-1",
    accentText: "text-blue-400 font-bold",
    buttonPrimary: "bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-sm rounded-xl py-2.5 px-6 transition duration-200 shadow-lg shadow-blue-500/10",
    buttonSecondary: "bg-slate-900 hover:bg-slate-850 active:scale-95 text-slate-205 border border-slate-800 font-semibold text-sm rounded-xl py-2.5 px-6 transition duration-200",
    badge: "bg-blue-950/30 border border-blue-900/30 text-blue-400 rounded-lg px-2.5 py-1 text-xs font-medium",
    footer: "border-t border-slate-900 bg-slate-950 text-slate-600 py-10 px-6 text-center text-sm",
    heroLayout: "centered",
    navStyle: "topbar",
    projectLayout: "grid",
    voice: "Sharp & modern",
    accentColor: "#3B82F6",
    eyebrow: "text-xs uppercase tracking-[0.2em] text-blue-400 font-medium",
    bioLayout: "card",
    skillsLayout: "bento",
    footerLayout: "saas",
    density: "normal"
  },
  developer: {
    container: "bg-black text-lime-400 font-mono min-h-screen selection:bg-lime-950 selection:text-white",
    nav: "border-b border-lime-950/40 bg-black/90 py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-30",
    section: "py-16 px-6 md:px-12 max-w-4xl mx-auto border-b border-lime-950/30 last:border-0",
    card: "bg-zinc-950 border border-lime-950 hover:border-lime-500 p-6 rounded-lg transition duration-200 relative",
    title: "text-2xl md:text-3xl font-bold tracking-wide text-white before:content-['#_'] before:text-lime-500",
    subtitle: "text-xs text-lime-600 mt-1 uppercase font-mono tracking-widest",
    accentText: "text-white font-bold before:content-['>_'] before:text-lime-500 text-sm",
    buttonPrimary: "border border-lime-500 bg-lime-950/10 hover:bg-lime-500 hover:text-black font-semibold text-xs tracking-wider py-2.5 px-6 transition duration-150 rounded-md",
    buttonSecondary: "border border-zinc-800 bg-transparent text-zinc-400 hover:border-zinc-500 hover:text-white font-semibold text-xs tracking-wider py-2.5 px-6 transition duration-150 rounded-md",
    badge: "bg-transparent border border-lime-950 text-lime-500 rounded px-2 py-0.5 text-[10px]",
    footer: "border-t border-lime-950/30 bg-black text-lime-700 py-10 px-6 text-center text-xs font-mono",
    heroLayout: "terminal",
    navStyle: "breadcrumb",
    projectLayout: "log",
    voice: "Precise & technical",
    accentColor: "#84CC16",
    eyebrow: "text-[10px] uppercase tracking-widest text-lime-600 font-mono",
    bioLayout: "terminal",
    skillsLayout: "array",
    footerLayout: "terminal",
    density: "compact"
  }
};

export const MOTION_PRESETS = {
  normal: {
    container: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.4 }
    },
    item: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.3 }
    },
    hover: {}
  },
  fancy: {
    container: {
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.15
        }
      }
    },
    item: {
      initial: { opacity: 0, y: 30 },
      animate: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 100, damping: 14 }
      }
    },
    hover: {
      scale: 1.018,
      y: -4,
      transition: { type: 'spring', stiffness: 200, damping: 8 }
    }
  },
  crazy: {
    container: {
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: {
          staggerChildren: 0.15,
          delayChildren: 0.2
        }
      }
    },
    item: {
      initial: { opacity: 0, scale: 0.8, rotate: -2 },
      animate: {
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: { type: 'spring', stiffness: 150, damping: 8 }
      }
    },
    hover: {
      scale: 1.04,
      rotate: 1,
      filter: "hue-rotate(15deg)",
      shadow: "0px 10px 30px rgba(0,0,0,0.5)",
      transition: { type: 'spring', stiffness: 220, damping: 6 }
    }
  }
};