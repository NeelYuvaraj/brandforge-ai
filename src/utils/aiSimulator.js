// Simulated AI Copywriter and Resume Parser utilities.
// Also serves as the offline/error fallback for services/gemini.js —
// so it must follow the same fact-grounding rules: never fabricate
// projects, employers, technologies, or metrics the user didn't provide.

export const generatePolishedBio = (name, role, basicBio, skills = []) => {
  const defaultBio = basicBio || "A dedicated professional focused on doing great work.";
  const skillsList = skills.length > 0 ? skills.slice(0, 3).join(', ') : 'their core skills';

  return {
    professional: `As a dedicated ${role || 'professional'}, ${name ? `${name} focuses` : 'I focus'} on delivering thoughtful, high-quality work${skills.length ? `, with strengths in ${skillsList}` : ''}. ${defaultBio}`,
    creative: `${name || 'This person'} is a ${role || 'professional'} who brings curiosity and care to everything they do${skills.length ? `, drawing on ${skillsList}` : ''}. ${defaultBio}`,
    technical: `${role || 'Professional'} with practical strengths in ${skills.join(', ') || 'their field'}. Detail-oriented and focused on doing the work well. ${defaultBio}`
  };
};

export const generateHeadlines = (role, skills = []) => {
  const roleName = role || "Professional";
  const skillName = skills[0] || null;

  return [
    `Hi, I'm ${roleName}`,
    skillName ? `${roleName} focused on ${skillName}` : `Dedicated ${roleName}`,
    `Bringing care and craft to ${roleName.toLowerCase()} work`,
    `${roleName} — here to do great work`
  ];
};

/**
 * Fact-grounded fallback: only ever rewrites what the user actually typed.
 * Returns an empty array if no real project input was given — never
 * fabricates filler projects.
 */
export const improveProjects = (projectText = "", skills = []) => {
  const cleanText = (projectText || '').trim();
  if (cleanText.length < 5) {
    return [];
  }

  const techUsed = skills.length > 0 ? skills.slice(0, 3) : [];

  return [
    {
      id: "user-project-1",
      title: cleanText.split(' ').slice(0, 6).join(' '),
      description: cleanText,
      longDescription: cleanText,
      tech: techUsed,
      improvements: [],
      metrics: ""
    }
  ];
};

export const parseResumeMock = (fileName) => {
  const lowerName = fileName.toLowerCase();

  if (lowerName.includes('designer') || lowerName.includes('design') || lowerName.includes('ui') || lowerName.includes('ux')) {
    return {
      name: "Sienna Vance",
      role: "Lead Product Designer",
      skills: ["Figma", "UI Design", "Design Systems", "Prototyping", "TailwindCSS", "HTML/CSS", "Framer Motion", "User Testing"],
      bio: "Creating beautiful, accessible, and high-converting digital interfaces for web and mobile. Passionate about detail, consistency, and interaction aesthetics.",
      socials: { github: "https://github.com/sienna-vance", linkedin: "https://linkedin.com/in/sienna-vance" },
      experience: [
        { period: "2023 - Present", title: "Lead Product Designer", company: "PixelCraft Studios", desc: "Maintained design systems and led redlines for 3 flagship apps. Reduced onboarding bounce rates by 22%." },
        { period: "2021 - 2023", title: "UX Designer", company: "Interface Labs", desc: "Designed wireframes, prototypes and high-fidelity mockups for e-commerce and fintech clients. Conducted 40+ user interviews." }
      ],
      education: [
        { period: "2017 - 2021", degree: "BFA in Graphic Communication", school: "Academy of Design & Arts" }
      ],
      projects: [
        {
          id: "res-proj-1",
          title: "Vivid Design System v3",
          description: "An open-source token-based Figma library and matching Tailwind Component Suite used by 120+ team members.",
          tech: ["Figma", "TailwindCSS", "React"],
          metrics: "Used by 120+ engineers/designers"
        },
        {
          id: "res-proj-2",
          title: "SimplCart Mobile App Flow",
          description: "Redesigned checkout process for leading e-commerce brand, boosting conversions by 14% on iOS and Android.",
          tech: ["UX Research", "Figma", "Micro-Interactions"],
          metrics: "14% mobile checkout increase"
        }
      ]
    };
  }

  return {
    name: "Alex Mercer",
    role: "Senior Full-Stack Engineer",
    skills: ["Javascript", "React", "NodeJS", "TailwindCSS", "Next.js", "Express", "PostgreSQL", "Framer Motion", "TypeScript", "REST APIs"],
    bio: "Full stack engineer focused on constructing highly modular react portals, interactive dashboards, and optimized REST/GraphQL servers.",
    socials: { github: "https://github.com/alex-mercer", linkedin: "https://linkedin.com/in/alex-mercer" },
    experience: [
      { period: "2022 - Present", title: "Senior Full-Stack Engineer", company: "SysFlow Technologies", desc: "Led a team of three building custom microservices. Cut cloud infrastructure expenses by 18%." },
      { period: "2019 - 2022", title: "Software Engineer II", company: "DevCore Solutions", desc: "Built responsive database-driven dashboards and implemented automated unit tests, raising coverage from 40% to 92%." }
    ],
    education: [
      { period: "2015 - 2019", degree: "BS in Computer Science", school: "Metropolis University" }
    ],
    projects: [
      {
        id: "res-proj-1",
        title: "DevMetrics Log Engine",
        description: "Open-source developer tracing middleware logging HTTP timings, errors, and cache hit ratios. Fetches 12k npm downloads/month.",
        tech: ["TypeScript", "NodeJS", "Redis", "Grafana"],
        metrics: "12,000+ monthly npm downloads"
      },
      {
        id: "res-proj-2",
        title: "CollabSync Workspace",
        description: "Interactive real-time text and whiteboard collaboration canvas utilizing CRDT sync engines and canvas rendering.",
        tech: ["React", "WebSockets", "Canvas", "Redis"],
        metrics: "Sub-50ms latency collaboration"
      }
    ]
  };
};

/**
 * Portfolio scoring — ALWAYS local, deterministic JavaScript. Never calls
 * Gemini. Reflects completeness of the fields the user actually filled in;
 * suggestions never carry an auto-fix that would require fabricating data
 * ('bio' is the only auto-resolvable fix, since it just switches to an
 * already-generated, already fact-grounded tone variant).
 */
export const evaluatePortfolioScore = (data) => {
  const scores = { seo: 30, design: 55, readability: 30, professionalism: 40 };
  const suggestions = [];

  // Role present
  if (data.role) {
    scores.professionalism += 15;
  } else {
    suggestions.push({ category: "professionalism", text: "Add your role or title so visitors know what you do.", fix: null });
  }

  // Skills count
  const skillCount = data.skills?.length || 0;
  if (skillCount >= 5) {
    scores.seo += 25;
  } else if (skillCount > 0) {
    scores.seo += 12;
    suggestions.push({ category: "seo", text: "Add a few more of your real skills to improve discoverability.", fix: null });
  } else {
    suggestions.push({ category: "seo", text: "Add your skills so people can find you for the right work.", fix: null });
  }

  // Bio present / depth
  const bioLength = (data.selectedBio || data.bio || '').length;
  if (bioLength > 120) {
    scores.readability += 30;
  } else if (bioLength > 0) {
    scores.readability += 15;
    suggestions.push({
      category: "readability",
      text: "Your bio is brief — try a different tone in the AI Copywriter panel for more depth.",
      fix: data.selectedBio ? "bio" : null
    });
  } else {
    suggestions.push({ category: "readability", text: "Add a short description of yourself to generate a bio.", fix: null });
  }

  // Projects
  if (data.projects && data.projects.length > 0) {
    scores.professionalism += 15;
  } else {
    suggestions.push({ category: "professionalism", text: "Add a project to showcase your real work.", fix: null });
  }

  // Social / contact link
  if (data.socialUrl) {
    scores.seo += 10;
  } else {
    suggestions.push({ category: "seo", text: "Add a link to your GitHub, portfolio, or LinkedIn.", fix: null });
  }

  // Resume uploaded
  if (data.resumeFileName) {
    scores.professionalism += 10;
  }

  // Theme/animation polish
  if (data.theme === 'minimal' || data.theme === 'apple') scores.design += 10;
  if (data.animation === 'fancy' || data.animation === 'crazy') scores.design += 10;

  const clamp = (n) => Math.max(0, Math.min(100, Math.round(n)));
  scores.seo = clamp(scores.seo);
  scores.design = clamp(scores.design);
  scores.readability = clamp(scores.readability);
  scores.professionalism = clamp(scores.professionalism);

  const average = Math.round((scores.seo + scores.design + scores.readability + scores.professionalism) / 4);

  return {
    average,
    categories: scores,
    suggestions: suggestions.length > 0
      ? suggestions.slice(0, 3)
      : [{ category: "professionalism", text: "Everything looks great — your profile is complete.", fix: null }]
  };
};