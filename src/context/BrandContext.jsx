import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  generateBrandKit,
  saveBrandKit
} from '../services/gemini';
import { parseResumeMock, evaluatePortfolioScore } from '../utils/aiSimulator'; // scoring is always local now

const BrandContext = createContext();

const initialAnswers = {
  // ==================================================
  // BUSINESS INFORMATION
  // ==================================================

  businessName: '',
  industry: '',
  description: '',
  targetAudience: '',
  services: [],

  // Additional factual business details
tagline: '',
address: '',
openingHours: '',

// Menu, products, pricing, packages, or other uploaded/pasted content
menuText: '',
menuFileName: '',

// Other factual details supplied by the user
additionalDetails: '',

// User's custom website design direction
designPreference: '',

// Optional reference website supplied by the user
designReference: '',

  // ==================================================
  // BUSINESS OWNER / CONTACT
  // ==================================================

  ownerName: '',
  ownerRole: '',
  email: '',
  phone: '',

  // ==================================================
  // USER-SELECTED DESIGN
  // ==================================================

  // Keep your existing theme system.
  // The USER selects the theme — NOT Gemini.
  theme: 'apple',

  animation: 'fancy',

  // Palette mode:
  // "preset" = user selects one of our palettes
  // "custom" = user types a color preference
  colorPaletteMode: 'preset',

  // Name of selected preset palette
  selectedPalette: 'ocean',

  // Exact colors selected by user/preset
  colorPalette: {
    primary: '#2563EB',
    secondary: '#0F172A',
    accent: '#38BDF8'
  },

  // Example:
  // "dark forest green and cream"
  // "burgundy"
  // "#14532D"
  customColorInput: '',

  // ==================================================
  // GENERATED BRAND KIT
  // ==================================================

  brandKit: null,

  // ==================================================
  // OLD FIELDS
  // Keep temporarily so existing UI does not crash.
  // We will remove these only after migration is complete.
  // ==================================================

  name: '',
  role: '',
  bio: '',
  skills: [],
  projectsText: '',
  experience: '',
  education: [],
  socialUrl: '',
  projects: [],
  timeline: [],
  selectedHeadline: '',
  selectedBio: '',
  bioType: 'professional'
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
    // --------------------------------------------------
    // Determine what color information Gemini receives
    // --------------------------------------------------

    let preferredColors = '';

    if (answers.colorPaletteMode === 'custom') {
      // User typed something like:
      // "dark green and cream"
      // "#14532D"
      // "burgundy"
      preferredColors = answers.customColorInput || '';
    } else {
      // User selected one of our preset palettes
      preferredColors = `
        Primary: ${answers.colorPalette?.primary || ''}
        Secondary: ${answers.colorPalette?.secondary || ''}
        Accent: ${answers.colorPalette?.accent || ''}
      `;
    }

    // --------------------------------------------------
    // Generate complete Brand Kit with ONE Gemini call
    // --------------------------------------------------

    const result = await generateBrandKit({
  // BUSINESS
  businessName: answers.businessName,
  industry: answers.industry,
  description: answers.description,
  targetAudience: answers.targetAudience,
  services: answers.services || [],

  // ADDITIONAL FACTUAL BUSINESS DETAILS
  tagline: answers.tagline || '',
  address: answers.address || '',
  openingHours: answers.openingHours || '',
  menuText: answers.menuText || '',
  menuFileName: answers.menuFileName || '',
  additionalDetails: answers.additionalDetails || '',

  // DESIGN
  // User-selected theme remains the base theme.
  brandStyle: answers.theme,

  // User can describe exactly how they want the site to look.
  designPreference: answers.designPreference || '',

  // Optional reference URL.
  designReference: answers.designReference || '',

  // Preset palette OR custom color request.
  preferredColors,

  // CONTACT
  ownerName: answers.ownerName || '',
  ownerRole: answers.ownerRole || '',
  email: answers.email || '',
  phone: answers.phone || ''
});

    // --------------------------------------------------
    // If user selected a PRESET palette,
    // force the generated Brand Kit to use those colors.
    //
    // Gemini must NOT overwrite preset colors.
    // --------------------------------------------------

    if (
      answers.colorPaletteMode === 'preset' &&
      result?.visualIdentity
    ) {
      result.visualIdentity.primaryColor =
        answers.colorPalette.primary;

      result.visualIdentity.secondaryColor =
        answers.colorPalette.secondary;

      result.visualIdentity.accentColor =
        answers.colorPalette.accent;
    }

    // --------------------------------------------------
    // IMPORTANT:
    // Always preserve USER'S selected theme.
    // Gemini does NOT choose the website theme.
    // --------------------------------------------------

    if (result?.visualIdentity) {
      result.visualIdentity.theme = answers.theme;
    }

    // --------------------------------------------------
    // Save generated Brand Kit into application state
    // --------------------------------------------------

    setAnswers(prev => ({
      ...prev,

      brandKit: result,

      // Keep user's theme
      theme: prev.theme,

      // Temporary compatibility with your old
      // portfolio components
      name:
        result.business?.name ||
        prev.businessName,

      role:
        result.business?.industry ||
        prev.industry,

      bio:
        result.business?.description ||
        prev.description,

      selectedHeadline:
        result.website?.headline || '',

      selectedBio:
        result.website?.about || ''
    }));

    // --------------------------------------------------
    // Save locally
    // --------------------------------------------------

    saveBrandKit(result);

    return result;

  } catch (error) {
    console.error(
      '[BrandForge] Brand Kit generation failed:',
      error
    );

    return null;

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