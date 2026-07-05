import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  generatePolishedBio, 
  generateHeadlines, 
  improveProjects, 
  parseResumeMock, 
  evaluatePortfolioScore 
} from '../utils/aiSimulator';

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

  const updateAnswer = (field, value) => {
    setAnswers(prev => {
      const updated = { ...prev, [field]: value };
      
      // If user updates role/skills directly or bio, sync options if we can
      if (field === 'role' || field === 'skills' || field === 'bio') {
        // We will regenerate options below dynamically or on command
      }
      return updated;
    });
  };

  const updateBulkAnswers = (newData) => {
    setAnswers(prev => ({ ...prev, ...newData }));
  };

  // Run AI simulation calculations when we finalize details
  const runAISimulations = () => {
    const headlines = generateHeadlines(answers.role, answers.skills);
    const bios = generatePolishedBio(answers.name, answers.role, answers.bio, answers.skills);
    
    // Auto-generate projects if nothing exists
    const projects = improveProjects(answers.projectsText || '', answers.skills);
    
    // Choose defaults
    const defaultHeadline = headlines[0] || '';
    const defaultBio = bios.professional || '';

    setAnswers(prev => ({
      ...prev,
      projects: prev.projects.length === 0 ? projects : prev.projects,
      selectedHeadline: prev.selectedHeadline || defaultHeadline,
      selectedBio: prev.selectedBio || defaultBio
    }));

    setAiOptions({
      headlines,
      bios,
      score: evaluatePortfolioScore({
        ...answers,
        projects: answers.projects.length === 0 ? projects : answers.projects,
        selectedHeadline: answers.selectedHeadline || defaultHeadline,
        selectedBio: answers.selectedBio || defaultBio
      })
    });
  };

  // Triggered after resume upload triggers
  const handleResumeUpload = (fileName) => {
    setIsParsingResume(true);
    
    // Simulate web assembly / python parsing time
    setTimeout(() => {
      const parsed = parseResumeMock(fileName);
      setResumeParsedData(parsed);
      
      // Autofill forms
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

  // Fix scorecard issue command
  const applyScoreFix = (suggestion) => {
    if (suggestion.fix === 'skills') {
      updateAnswer('skills', [...answers.skills, 'React', 'TypeScript', 'TailwindCSS', 'REST APIs', 'Git']);
    } else if (suggestion.fix === 'socialUrl') {
      updateAnswer('socialUrl', 'https://github.com/profile-link');
    } else if (suggestion.fix === 'bio') {
      const polished = generatePolishedBio(answers.name, answers.role, answers.bio, answers.skills);
      updateAnswer('selectedBio', polished.professional);
    }
  };

  // Whenever answers structure changes, revalidate scorecard
  useEffect(() => {
    if (screen === 'preview') {
      const score = evaluatePortfolioScore(answers);
      setAiOptions(prev => ({ ...prev, score }));
    }
  }, [answers.skills, answers.socialUrl, answers.selectedBio, answers.theme, answers.animation, screen]);

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
