import React, { createContext, useContext, useState, useEffect } from 'react';
import { generatePortfolioContent } from '../services/gemini';
import { parseResumeMock, evaluatePortfolioScore } from '../utils/aiSimulator'; // scoring is always local now

const BrandContext = createContext();

const initialAnswers = {
  name: '',
  role: '',
  skills: [],
  bio: '', // basic input
  resumeFile: null,
  resumeFileName: '',
  socialUrl: '',
  theme: 'apple', // default theme
  animation: 'fancy', // default animation intensity
  projects: [],
  timeline: [],
  selectedHeadline: '',
  selectedBio: '',
  bioType: 'professional' // professional, creative, technical
};

export const BrandProvider = ({ children }) => {
  const [screen, setScreen] = useState('landing'); // landing, interview, generating, preview
  const [answers, setAnswers] = useState(initialAnswers);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [aiOptions, setAiOptions] = useState({
    headlines: [],
    bios: { professional: '', creative: '', technical: '' },
    score: { average: 0, categories: {}, suggestions: [] }
  });
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [resumeParsedData, setResumeParsedData] = useState(null);

  // Tracks whether the single Gemini generation pass is in flight.
  // GeneratingScreen waits for this to become false before moving to preview.
  const [isGeneratingAIContent, setIsGeneratingAIContent] = useState(false);

  const updateAnswer = (field, value) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const updateBulkAnswers = (newData) => {
    setAnswers(prev => ({ ...prev, ...newData }));
  };

  // Run AI generation when we finalize interview details.
  // Makes exactly ONE Gemini request (bio + headlines + projects combined).
  // Score is calculated separately, locally, with zero network calls.
  const runAISimulations = async () => {
    setIsGeneratingAIContent(true);
    try {
      const result = await generatePortfolioContent({
        name: answers.name,
        role: answers.role,
        bio: answers.bio,
        skills: answers.skills,
        projectsText: answers.projectsText || ''
      });

      const defaultHeadline = result.headlines[0] || '';
      const defaultBio = result.bios.professional || '';

      setAnswers(prev => ({
        ...prev,
        // Never overwrite real resume-derived projects; only fill if still empty.
        projects: prev.projects.length === 0 ? result.projects : prev.projects,
        selectedHeadline: prev.selectedHeadline || defaultHeadline,
        selectedBio: prev.selectedBio || defaultBio
      }));

      setAiOptions(prev => ({
        ...prev,
        headlines: result.headlines,
        bios: result.bios
      }));
    } finally {
      setIsGeneratingAIContent(false);
    }
  };

  // Triggered after resume upload — unchanged, still simulated per spec.
  const handleResumeUpload = (fileName) => {
    setIsParsingResume(true);

    setTimeout(() => {
      const parsed = parseResumeMock(fileName);
      setResumeParsedData(parsed);

      setAnswers(prev => ({
        ...prev,
        name: parsed.name,
        role: parsed.role,
        skills: parsed.skills,
        bio: parsed.bio,
        resumeFileName: fileName,
        socialUrl: parsed.socials?.linkedin || parsed.socials?.github || '',
        projects: parsed.projects || [],
        timeline: [...(parsed.experience || []), ...(parsed.education || [])]
      }));

      setIsParsingResume(false);
    }, 2500); // 2.5s parsing animation
  };

  // Fix scorecard issue — fully local now. 'bio' is the only auto-resolvable
  // fix: it switches to a different already-generated (already fact-grounded)
  // tone variant rather than making a new Gemini request. Other suggestion
  // types no longer carry a "fix" — they're informational only, since
  // resolving them would require fabricating skills/links we don't have.
  const applyScoreFix = (suggestion) => {
    if (suggestion.fix === 'bio') {
      const variants = Object.values(aiOptions.bios || {}).filter(Boolean);
      const longest = variants.reduce((best, v) => (v.length > (best?.length || 0) ? v : best), '');
      if (longest) {
        updateAnswer('selectedBio', longest);
      }
    } else if (suggestion.fix === 'skills') {
      const defaultFixSkills = ['React', 'TypeScript', 'TailwindCSS', 'REST APIs', 'Git'];
      const uniqueSkills = Array.from(new Set([...answers.skills, ...defaultFixSkills]));
      updateAnswer('skills', uniqueSkills);
    } else if (suggestion.fix === 'socialUrl') {
      const formattedName = answers.name ? answers.name.toLowerCase().replace(/\s+/g, '-') : 'developer';
      updateAnswer('socialUrl', `https://github.com/${formattedName}`);
    }
  };

  // Portfolio score revalidates locally whenever relevant answers change —
  // synchronous, free, no debounce or network needed.
  useEffect(() => {
    if (screen !== 'preview') return;
    const score = evaluatePortfolioScore(answers);
    setAiOptions(prev => ({ ...prev, score }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    answers.role,
    answers.skills,
    answers.socialUrl,
    answers.selectedBio,
    answers.projects,
    answers.resumeFileName,
    answers.theme,
    answers.animation,
    screen
  ]);

  const resetBrandForm = () => {
    setAnswers(initialAnswers);
    setCurrentQuestion(0);
    setScreen('landing');
    setResumeParsedData(null);
  };

  return (
    <BrandContext.Provider value={{
      screen,
      setScreen,
      answers,
      setAnswers,
      currentQuestion,
      setCurrentQuestion,
      aiOptions,
      setAiOptions,
      isParsingResume,
      resumeParsedData,
      isGeneratingAIContent,
      updateAnswer,
      updateBulkAnswers,
      runAISimulations,
      handleResumeUpload,
      applyScoreFix,
      resetBrandForm
    }}>
      {children}
    </BrandContext.Provider>
  );
};

export const useBrandData = () => useContext(BrandContext);