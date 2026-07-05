// Simulated AI Copywriter and Resume Parser utilities

export const generatePolishedBio = (name, role, basicBio, skills = []) => {
  const defaultBio = basicBio || "I am a passionate professional looking to build amazing things.";
  const skillsList = skills.length > 0 ? skills.slice(0, 3).join(', ') : 'modern tech';

  return {
    professional: `As a dedicated ${role}, I specialize in bridging the gap between complex technical problems and elegant, scalable solutions. With expertise in ${skillsList}, I focus on writing clean code, optimizing performance, and building intuitive user experiences that drive product success. ${defaultBio}`,
    creative: `Imagineer, builder, and problem solver. I'm a ${role} who thrives on turning abstract ideas into tangible digital realities. Driven by curiosity and powered by ${skillsList}, I approach challenges with a fresh perspective and design interfaces that capture users' hearts and minds. ${defaultBio}`,
    technical: `Engineered-focused ${role} with deep core competencies in ${skills.join(', ') || 'software engineering'}. Pragmatic in code execution, architecture design, and automation. I focus heavily on writing robust tests, improving pipeline efficiency, and utilizing state-of-the-art frameworks to deliver high-availability software. ${defaultBio}`
  };
};

export const generateHeadlines = (role, skills = []) => {
  const roleName = role || "Developer";
  const skillName = skills[0] || "React";
  
  return [
    `Crafting Elegant Solutions as a ${roleName}`,
    `Building the Future of Tech with ${skillName}`,
    `Transforming Complexity into Simple, Beautiful Code`,
    `Hi, I'm a ${roleName} | Focused on Performance & UX`
  ];
};

export const improveProjects = (projectText = "", skills = []) => {
  const fallbackProjects = [
    {
      id: "proj-1",
      title: "OmniChannel Analytics Dashboard",
      description: "Designed and engineered an enterprise-grade analytics dashboard that aggregates data from 8+ APIs. Real-time visualization reduces report generation latency by 45%.",
      longDescription: "A comprehensive data visualization suite built to handle high-frequency data streaming. Integrates Chart.js/Recharts, WebSockets, and a robust caching layer to deliver latency-free analytics across millions of database records.",
      tech: ["React", "Express", "TailwindCSS", "WebSockets", "ChartJS"],
      improvements: [
        "Replaced canvas-based renders with SVG charts for smoother high-frequency charting.",
        "Created an offline caching layer using IndexedDB."
      ],
      metrics: "45% latency reduction, 8+ APIs integrated"
    },
    {
      id: "proj-2",
      title: "Decentralized File Management Engine",
      description: "An open-source secure cloud management solution that encrypts files client-side and stores chunks across peer-to-peer nodes, minimizing server overhead.",
      longDescription: "A cryptographic document storage system featuring client-side AES-256 encryption. Files are split into sharded chunks and uploaded concurrently to decentralized storage blocks, allowing self-healing retrieval options.",
      tech: ["React", "TailwindCSS", "NodeJs", "WebRTC", "CryptoAPI"],
      improvements: [
        "Refashioned chunk upload script to parallelize pipelines, increasing speeds by 3x.",
        "Integrated WebRTC P2P status monitors."
      ],
      metrics: "3x faster uploads, AES-256 secure sharding"
    }
  ];

  if (!projectText || projectText.trim().length < 5) {
    return fallbackProjects;
  }

  // Generate improved project card from user single-line description
  const cleanText = projectText.trim();
  const techUsed = skills.length > 0 ? skills.slice(0, 3) : ["React", "Tailwind", "REST API"];

  return [
    {
      id: "proj-custom-1",
      title: `${cleanText.split(' ').slice(0, 3).join(' ')} Application`,
      description: `Optimized implementation of "${cleanText}" featuring high-performance state management, clean responsive grids, and an automated deployment pipeline.`,
      longDescription: `A production-ready application addressing the core requirements of: "${cleanText}". Scaled with clean modular code, comprehensive SEO optimization, and a lightweight mobile-first layout.`,
      tech: techUsed,
      improvements: [
        "Implemented strict component boundaries and lazy loading.",
        "Configured semantic HTML structure to boost search index rankings."
      ],
      metrics: "98+ lighthouse performance score, fully responsive"
    },
    ...fallbackProjects
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
  
  // Standard software developer profile
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

export const evaluatePortfolioScore = (data) => {
  const scores = {
    seo: 80,
    design: 85,
    readability: 90,
    professionalism: 85
  };
  const suggestions = [];

  // SEO
  if (data.skills && data.skills.length > 5) {
    scores.seo += 10;
  } else {
    suggestions.push({
      category: "seo",
      text: "Add at least 5-6 core skill tags to improve search ranking for specific developer/designer keywords.",
      fix: "skills" // target field/step
    });
  }

  if (data.socialUrl && (data.socialUrl.includes('git') || data.socialUrl.includes('link'))) {
    scores.seo += 10;
  } else {
    suggestions.push({
      category: "seo",
      text: "Link your GitHub or LinkedIn profile to build outbound link authority and SEO trust.",
      fix: "socialUrl"
    });
  }

  // Reading / Content
  if (data.bio && data.bio.length > 120) {
    scores.readability += 10;
  } else {
    suggestions.push({
      category: "readability",
      text: "Your professional bio is very brief. Expand it with our AI Copirwriter tools for better content density.",
      fix: "bio"
    });
  }

  // Design Theme pairing check
  if (data.theme === 'minimal' || data.theme === 'apple') {
    scores.design += 10;
  }
  if (data.animation === 'fancy') {
    scores.design += 5;
  }

  // Clamp values
  scores.seo = Math.min(scores.seo, 100);
  scores.design = Math.min(scores.design, 100);
  scores.readability = Math.min(scores.readability, 100);
  scores.professionalism = Math.min(scores.professionalism, 100);

  const average = Math.round((scores.seo + scores.design + scores.readability + scores.professionalism) / 4);

  return {
    average,
    categories: scores,
    suggestions: suggestions.length > 0 ? suggestions : [
      { category: "professionalism", text: "Everything looks outstanding! Add an SVG dynamic avatar signature to take design closer to 100.", fix: null }
    ]
  };
};
