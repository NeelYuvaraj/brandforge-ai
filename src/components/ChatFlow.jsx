import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Palette,
  Upload
} from 'lucide-react';
import { useBrandData } from '../context/BrandContext';


// ======================================================
// BUSINESS INDUSTRIES
// ======================================================

const PRESET_INDUSTRIES = [
  'Technology',
  'Restaurant & Food',
  'Fashion',
  'Beauty & Wellness',
  'Healthcare',
  'Education',
  'Consulting',
  'Real Estate',
  'Creative Agency',
  'Other'
];


// ======================================================
// EXISTING THEMES
// KEEPING YOUR ORIGINAL THEME SYSTEM
// ======================================================

const THEMES = [
  {
    id: 'apple',
    name: 'Apple',
    desc: 'White background, frosted glass, smooth subtle micro-animations.',
    color:
      'from-gray-100 to-gray-200 border-gray-300 text-gray-800'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    desc: 'Neon violet/cyan glow, monospace fonts, grid layouts.',
    color:
      'from-fuchsia-950 to-cyan-950 border-purple-500 text-purple-300'
  },
  {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    desc: 'Frosted floating tiles, colorful gradient backdrops.',
    color:
      'from-blue-900/40 to-pink-900/40 border-pink-400/50 text-white'
  },
  {
    id: 'luxury',
    name: 'Luxury',
    desc: 'Elegant charcoal, gold-lined trimmings, serif headers.',
    color:
      'from-stone-900 to-amber-950 border-yellow-600 text-yellow-100'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    desc: 'Clean whitespace, stark high-contrast text, single accent tone.',
    color:
      'from-white to-slate-50 border-slate-200 text-slate-900'
  },
  {
    id: 'dark',
    name: 'Dark Theme',
    desc: 'Deep charcoal background, sharp electric blue highlights.',
    color:
      'from-slate-900 via-slate-950 to-slate-900 border-blue-500 text-blue-200'
  },
  {
    id: 'developer',
    name: 'Developer',
    desc: 'Terminal aesthetics, monospace outputs, syntax hues.',
    color:
      'from-zinc-900 to-black border-lime-500 text-lime-400'
  }
];


// ======================================================
// COLOR PALETTES
// ======================================================

const COLOR_PALETTES = [
  {
    id: 'ocean',
    name: 'Ocean Tech',
    description: 'Modern, trustworthy and technology-focused.',
    colors: {
      primary: '#2563EB',
      secondary: '#0F172A',
      accent: '#38BDF8'
    }
  },
  {
    id: 'luxury-gold',
    name: 'Luxury Gold',
    description: 'Premium, elegant and sophisticated.',
    colors: {
      primary: '#1C1917',
      secondary: '#D4AF37',
      accent: '#F5F0E6'
    }
  },
  {
    id: 'natural',
    name: 'Natural',
    description: 'Organic, calm and environmentally conscious.',
    colors: {
      primary: '#166534',
      secondary: '#84A98C',
      accent: '#F5F5DC'
    }
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Energetic, expressive and bold.',
    colors: {
      primary: '#7C3AED',
      secondary: '#EC4899',
      accent: '#F97316'
    }
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Reliable, corporate and confident.',
    colors: {
      primary: '#1E3A8A',
      secondary: '#475569',
      accent: '#F8FAFC'
    }
  }
];


// ======================================================
// SHARED STYLES
// ======================================================

const easeOut = [0.16, 1, 0.3, 1];

const fieldClass =
  'flex-grow bg-white/[0.03] border border-white/10 text-white rounded-xl px-4 py-3 ' +
  'placeholder-white/25 text-sm transition-all duration-200 ' +
  'focus:outline-none focus:border-blue-400/40 focus:ring-2 focus:ring-blue-400/20';

const primaryBtnClass =
  'bg-white text-black font-medium rounded-xl transition-all duration-200 ' +
  'hover:bg-white/90 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400';

const cardClass =
  'bg-white/[0.02] border border-white/10 rounded-2xl p-5';


// ======================================================
// COMPONENT
// ======================================================

export default function ChatFlow() {
  const {
    setScreen,
    answers,
    updateAnswer,
    updateBulkAnswers,
    runAISimulations
  } = useBrandData();

  // 0 Business name
  // 1 Industry
  // 2 Services
  // 3 Description
  // 4 Target audience
  // 5 Business details / menu
  // 6 Contact
  // 7 Theme + custom design preference / reference
  // 8 Color palette
  // 9 Animation

  const [step, setStep] = useState(0);

  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text:
        "👋 Hi! I'm BrandForge AI. Tell me about your business and I'll help create your complete brand identity, website, logo, and business card."
    }
  ]);

  const [inputValue, setInputValue] = useState('');

  const [customIndustry, setCustomIndustry] = useState('');

  const [servicesInput, setServicesInput] = useState('');

  const [contact, setContact] = useState({
    ownerName: '',
    ownerRole: '',
    email: '',
    phone: ''
  });

  const [customColor, setCustomColor] = useState('');

  const [businessDetails, setBusinessDetails] = useState({
    tagline: '',
    address: '',
    openingHours: '',
    additionalDetails: '',
    menuText: ''
  });

  const [menuFileName, setMenuFileName] = useState('');

  const [designPreference, setDesignPreference] = useState('');
  const [designReference, setDesignReference] = useState('');

  const chatEndRef = useRef(null);


  // ======================================================
  // AUTO SCROLL
  // ======================================================

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages, step]);


  // ======================================================
  // QUESTIONS
  // ======================================================

  useEffect(() => {
    const askQuestion = () => {
      let promptText = '';

      switch (step) {
        case 0:
          promptText =
            'First, what is the name of your business/brand?';
          break;

        case 1:
          promptText =
            `Great! What type of business is ${
              answers.businessName || 'your business'
            }? Choose an industry or type your own.`;
          break;

        case 2:
          promptText =
            'What products or services does your business offer? Separate multiple services with commas.';
          break;

        case 3:
          promptText =
            'Briefly describe what your business does in 1–2 sentences.';
          break;

        case 4:
          promptText =
            'Who are your main customers or target audience?';
          break;

        case 5:
          promptText =
            'Add any real business details you want the website to use. You can include a tagline, address, opening hours, menu/products, or other facts. You can also upload a text, CSV, or JSON menu/details file. Leave anything unknown blank — BrandForge will not invent missing facts.';
          break;

        case 6:
          promptText =
            'Add the contact details you want displayed on your website and business card. These are optional.';
          break;

        case 7:
          promptText =
            'Choose one of the existing visual themes. You can also describe your own design preference and add a reference website URL. Your custom preference will guide the generated design without removing the default themes.';
          break;

        case 8:
          promptText =
            'Choose a color palette for your brand, or enter your own preferred color or color combination.';
          break;

        case 9:
          promptText =
            'Finally, choose the animation energy intensity:';
          break;

        default:
          break;
      }

      if (promptText) {
        setMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            text: promptText
          }
        ]);
      }
    };

    const timer =
      setTimeout(askQuestion, 300);

    return () =>
      clearTimeout(timer);
  }, [step]);


  // ======================================================
  // ADD USER MESSAGE
  // ======================================================

  const addUserMessage = text => {
    if (!text) return;

    setMessages(prev => [
      ...prev,
      {
        sender: 'user',
        text
      }
    ]);
  };


  // ======================================================
  // STANDARD TEXT ANSWER
  // ======================================================

  const handleSend = (
    textToSend = null
  ) => {
    const textVal =
      textToSend !== null
        ? textToSend
        : inputValue;

    const clean =
      String(textVal || '').trim();

    // Required text fields
    if (
      [0, 2, 3, 4].includes(step) &&
      !clean
    ) {
      return;
    }

    if (clean) {
      addUserMessage(clean);
    }

    setInputValue('');

    // BUSINESS NAME
    if (step === 0) {
      updateAnswer(
        'businessName',
        clean
      );

      setStep(1);
      return;
    }

    // INDUSTRY
    if (step === 1) {
      updateAnswer(
        'industry',
        clean
      );

      setStep(2);
      return;
    }

    // SERVICES
    if (step === 2) {
      const services =
        clean
          .split(',')
          .map(service =>
            service.trim()
          )
          .filter(Boolean);

      updateAnswer(
        'services',
        services
      );

      setStep(3);
      return;
    }

    // DESCRIPTION
    if (step === 3) {
      updateAnswer(
        'description',
        clean
      );

      setStep(4);
      return;
    }

    // TARGET AUDIENCE
    if (step === 4) {
      updateAnswer(
        'targetAudience',
        clean
      );

      setStep(5);
    }
  };


  // ======================================================
  // BUSINESS DETAILS / MENU
  // ======================================================

  const handleBusinessDetailsContinue = () => {
    updateBulkAnswers({
      tagline: businessDetails.tagline.trim(),
      address: businessDetails.address.trim(),
      openingHours: businessDetails.openingHours.trim(),
      additionalDetails: businessDetails.additionalDetails.trim(),
      menuText: businessDetails.menuText.trim(),
      menuFileName
    });

    const supplied = [
      businessDetails.tagline,
      businessDetails.address,
      businessDetails.openingHours,
      businessDetails.additionalDetails,
      businessDetails.menuText,
      menuFileName
    ].some(value => String(value || '').trim());

    addUserMessage(
      supplied
        ? 'Business details added'
        : 'Skipped additional business details'
    );

    setStep(6);
  };

  const handleMenuFileUpload = async event => {
    const file = event.target.files?.[0];
    if (!file) return;

    setMenuFileName(file.name);

    const lowerName = file.name.toLowerCase();
    const readable =
      file.type.startsWith('text/') ||
      lowerName.endsWith('.txt') ||
      lowerName.endsWith('.csv') ||
      lowerName.endsWith('.json') ||
      lowerName.endsWith('.md');

    if (!readable) {
      setBusinessDetails(prev => ({
        ...prev,
        additionalDetails:
          `${prev.additionalDetails}${prev.additionalDetails ? '\n' : ''}` +
          `Uploaded file: ${file.name}. File contents were not extracted in the browser.`
      }));
      return;
    }

    try {
      const contents = await file.text();
      setBusinessDetails(prev => ({
        ...prev,
        menuText: contents.slice(0, 20000)
      }));
    } catch (error) {
      console.error('Unable to read uploaded business file:', error);
    }
  };


  // ======================================================
  // INDUSTRY
  // ======================================================

  const handleSelectIndustry =
    industry => {
      updateAnswer(
        'industry',
        industry
      );

      addUserMessage(industry);

      setStep(2);
    };


  const handleCustomIndustry = () => {
    const industry =
      customIndustry.trim();

    if (!industry) return;

    updateAnswer(
      'industry',
      industry
    );

    addUserMessage(industry);

    setCustomIndustry('');

    setStep(2);
  };


  // ======================================================
  // CONTACT DETAILS
  // ======================================================

  const handleContactContinue = () => {
    updateBulkAnswers({
      ownerName:
        contact.ownerName.trim(),

      ownerRole:
        contact.ownerRole.trim(),

      email:
        contact.email.trim(),

      phone:
        contact.phone.trim()
    });

    const label =
      contact.ownerName ||
      contact.email ||
      contact.phone
        ? 'Contact details added'
        : 'Skipped contact details';

    addUserMessage(label);

    setStep(7);
  };


  // ======================================================
  // THEME
  // ======================================================

  const handleThemeContinue = () => {
    const selected =
      THEMES.find(
        theme =>
          theme.id === answers.theme
      );

    updateBulkAnswers({
      designPreference: designPreference.trim(),
      designReference: designReference.trim()
    });

    addUserMessage(
      `Theme: ${selected?.name || answers.theme || 'Default'}${
        designPreference.trim()
          ? ` | Custom preference: ${designPreference.trim()}`
          : ''
      }${
        designReference.trim()
          ? ` | Reference: ${designReference.trim()}`
          : ''
      }`
    );

    setStep(8);
  };


  // ======================================================
  // PRESET COLOR PALETTE
  // ======================================================

  const handleSelectPalette =
    palette => {
      updateBulkAnswers({
        colorPaletteMode:
          'preset',

        selectedPalette:
          palette.id,

        colorPalette:
          palette.colors,

        customColorInput:
          ''
      });
    };


  const handlePaletteContinue = () => {
    const palette =
      COLOR_PALETTES.find(
        item =>
          item.id ===
          answers.selectedPalette
      );

    addUserMessage(
      `Color palette: ${
        palette?.name ||
        'Selected palette'
      }`
    );

    setStep(9);
  };


  // ======================================================
  // CUSTOM COLOR
  // ======================================================

  const handleCustomColorContinue =
    () => {
      const color =
        customColor.trim();

      if (!color) return;

      updateBulkAnswers({
        colorPaletteMode:
          'custom',

        selectedPalette:
          'custom',

        customColorInput:
          color
      });

      addUserMessage(
        `Custom colors: ${color}`
      );

      setStep(9);
    };


  // ======================================================
  // FINAL GENERATION
  // ======================================================

  const handleGenerate = async () => {
    addUserMessage(
      `Animation: ${answers.animation}`
    );

    setScreen('generating');

    await runAISimulations();
  };


  // ======================================================
  // INPUT AREA
  // ======================================================

  const renderInputArea = () => {
    switch (step) {

      // --------------------------------------------------
      // STEP 0 — BUSINESS NAME
      // --------------------------------------------------

      case 0:
        return (
          <div className="flex gap-2 w-full max-w-lg">
            <input
              type="text"
              value={inputValue}
              onChange={e =>
                setInputValue(
                  e.target.value
                )
              }
              placeholder="e.g. NovaByte AI"
              className={fieldClass}
              onKeyDown={e =>
                e.key === 'Enter' &&
                handleSend()
              }
              autoFocus
            />

            <button
              onClick={() =>
                handleSend()
              }
              aria-label="Send"
              className={`${primaryBtnClass} p-3 shrink-0`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        );


      // --------------------------------------------------
      // STEP 1 — INDUSTRY
      // --------------------------------------------------

      case 1:
        return (
          <div className="flex flex-col gap-4 w-full max-w-lg">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto">

              {PRESET_INDUSTRIES.map(
                industry => (
                  <motion.button
                    key={industry}
                    onClick={() =>
                      handleSelectIndustry(
                        industry
                      )
                    }
                    whileHover={{
                      y: -1
                    }}
                    whileTap={{
                      scale: 0.98
                    }}
                    className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-blue-400/30 text-sm text-white/80 hover:text-white rounded-xl px-4 py-2.5 text-left transition-colors duration-200 font-medium"
                  >
                    {industry}
                  </motion.button>
                )
              )}

            </div>

            <div className="flex gap-2">

              <input
                type="text"
                value={
                  customIndustry
                }
                onChange={e =>
                  setCustomIndustry(
                    e.target.value
                  )
                }
                placeholder="Or type your industry"
                className={fieldClass}
                onKeyDown={e =>
                  e.key === 'Enter' &&
                  handleCustomIndustry()
                }
              />

              <button
                onClick={
                  handleCustomIndustry
                }
                className={`${primaryBtnClass} px-5 text-sm shrink-0`}
              >
                Send
              </button>

            </div>

          </div>
        );


      // --------------------------------------------------
      // STEP 2 — SERVICES
      // --------------------------------------------------

      case 2:
        return (
          <div className="flex gap-2 w-full max-w-lg">

            <textarea
              value={
                servicesInput
              }
              onChange={e =>
                setServicesInput(
                  e.target.value
                )
              }
              placeholder="e.g. AI automation, consulting, workflow optimization"
              className={`${fieldClass} h-24 resize-none`}
            />

            <button
              onClick={() => {
                if (
                  !servicesInput.trim()
                )
                  return;

                setInputValue('');

                handleSend(
                  servicesInput
                );

                setServicesInput('');
              }}
              className={`${primaryBtnClass} p-3 self-end shrink-0`}
            >
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        );


      // --------------------------------------------------
      // STEP 3 — DESCRIPTION
      // --------------------------------------------------

      case 3:
        return (
          <div className="flex gap-2 w-full max-w-lg">

            <textarea
              value={inputValue}
              onChange={e =>
                setInputValue(
                  e.target.value
                )
              }
              placeholder="e.g. We help small businesses automate repetitive work using AI."
              className={`${fieldClass} h-24 resize-none`}
            />

            <button
              onClick={() =>
                handleSend()
              }
              className={`${primaryBtnClass} p-3 self-end shrink-0`}
            >
              <Send className="w-4 h-4" />
            </button>

          </div>
        );


      // --------------------------------------------------
      // STEP 4 — TARGET AUDIENCE
      // --------------------------------------------------

      case 4:
        return (
          <div className="flex gap-2 w-full max-w-lg">

            <input
              type="text"
              value={inputValue}
              onChange={e =>
                setInputValue(
                  e.target.value
                )
              }
              placeholder="e.g. Small and medium business owners"
              className={fieldClass}
              onKeyDown={e =>
                e.key === 'Enter' &&
                handleSend()
              }
            />

            <button
              onClick={() =>
                handleSend()
              }
              className={`${primaryBtnClass} p-3 shrink-0`}
            >
              <Send className="w-4 h-4" />
            </button>

          </div>
        );


      // --------------------------------------------------
      // STEP 5 — BUSINESS DETAILS / MENU
      // --------------------------------------------------

      case 5:
        return (
          <div className={`flex flex-col gap-3 w-full max-w-lg ${cardClass}`}>
            <input
              value={businessDetails.tagline}
              onChange={e =>
                setBusinessDetails(prev => ({ ...prev, tagline: e.target.value }))
              }
              placeholder="Brand tagline (optional)"
              className={fieldClass}
            />

            <input
              value={businessDetails.address}
              onChange={e =>
                setBusinessDetails(prev => ({ ...prev, address: e.target.value }))
              }
              placeholder="Business address / location (optional)"
              className={fieldClass}
            />

            <input
              value={businessDetails.openingHours}
              onChange={e =>
                setBusinessDetails(prev => ({ ...prev, openingHours: e.target.value }))
              }
              placeholder="Opening hours (optional)"
              className={fieldClass}
            />

            <textarea
              value={businessDetails.menuText}
              onChange={e =>
                setBusinessDetails(prev => ({ ...prev, menuText: e.target.value }))
              }
              placeholder="Paste real menu items, products, prices, packages, or other offerings here. Leave blank if not provided."
              className={`${fieldClass} h-28 resize-none`}
            />

            <label className="flex items-center justify-center gap-2 border border-dashed border-white/15 hover:border-blue-400/40 rounded-xl px-4 py-3 text-sm text-white/60 hover:text-white cursor-pointer transition-colors">
              <Upload className="w-4 h-4" />
              <span>{menuFileName || 'Upload menu/details (.txt, .csv, .json, .md)'}</span>
              <input
                type="file"
                accept=".txt,.csv,.json,.md,.pdf,image/*"
                onChange={handleMenuFileUpload}
                className="hidden"
              />
            </label>

            <textarea
              value={businessDetails.additionalDetails}
              onChange={e =>
                setBusinessDetails(prev => ({
                  ...prev,
                  additionalDetails: e.target.value
                }))
              }
              placeholder="Other factual details: delivery, reservations, facilities, specialties, social links, etc. (optional)"
              className={`${fieldClass} h-24 resize-none`}
            />

            <p className="text-[11px] text-white/35 leading-relaxed">
              Only information you provide here should be treated as a business fact.
              AI may improve wording, but should not invent menu items, prices, hours,
              locations, services, or contact details.
            </p>

            <button
              onClick={handleBusinessDetailsContinue}
              className={`${primaryBtnClass} py-2.5 text-sm`}
            >
              Continue
            </button>
          </div>
        );


      // --------------------------------------------------
      // STEP 6 — CONTACT
      // --------------------------------------------------

      case 6:
        return (
          <div
            className={`flex flex-col gap-3 w-full max-w-lg ${cardClass}`}
          >

            <input
              value={
                contact.ownerName
              }
              onChange={e =>
                setContact(prev => ({
                  ...prev,
                  ownerName:
                    e.target.value
                }))
              }
              placeholder="Owner / contact name (optional)"
              className={fieldClass}
            />

            <input
              value={
                contact.ownerRole
              }
              onChange={e =>
                setContact(prev => ({
                  ...prev,
                  ownerRole:
                    e.target.value
                }))
              }
              placeholder="Role, e.g. Founder (optional)"
              className={fieldClass}
            />

            <input
              type="email"
              value={contact.email}
              onChange={e =>
                setContact(prev => ({
                  ...prev,
                  email:
                    e.target.value
                }))
              }
              placeholder="Business email (optional)"
              className={fieldClass}
            />

            <input
              type="tel"
              value={contact.phone}
              onChange={e =>
                setContact(prev => ({
                  ...prev,
                  phone:
                    e.target.value
                }))
              }
              placeholder="Phone number (optional)"
              className={fieldClass}
            />

            <button
              onClick={
                handleContactContinue
              }
              className={`${primaryBtnClass} py-2.5 text-sm`}
            >
              Continue
            </button>

          </div>
        );


      // --------------------------------------------------
      // STEP 7 — EXISTING THEMES
      // --------------------------------------------------

      case 7:
        return (
          <div className="flex flex-col gap-4 w-full max-w-lg">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">

              {THEMES.map(theme => {
                const selected =
                  answers.theme ===
                  theme.id;

                return (
                  <motion.button
                    key={theme.id}
                    onClick={() =>
                      updateAnswer(
                        'theme',
                        theme.id
                      )
                    }
                    whileTap={{
                      scale: 0.98
                    }}
                    className={`p-3.5 text-left rounded-xl border transition-colors duration-200 flex flex-col gap-1 ${
                      selected
                        ? 'border-blue-400/50 bg-blue-500/[0.08]'
                        : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                    }`}
                  >

                    <div className="flex justify-between items-center w-full">

                      <span className="font-medium text-sm text-white">
                        {theme.name}
                      </span>

                      {selected && (
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      )}

                    </div>

                    <span className="text-[11px] text-white/40 leading-normal">
                      {theme.desc}
                    </span>

                  </motion.button>
                );
              })}

            </div>

            <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
              <textarea
                value={designPreference}
                onChange={e => setDesignPreference(e.target.value)}
                placeholder="Describe your preferred design, e.g. Traditional South Indian restaurant with warm earthy tones, subtle temple-inspired geometry, banana-leaf accents, and a premium modern layout."
                className={`${fieldClass} h-24 resize-none`}
              />

              <input
                type="url"
                value={designReference}
                onChange={e => setDesignReference(e.target.value)}
                placeholder="Reference website URL (optional)"
                className={fieldClass}
              />

              <p className="text-[11px] text-white/35">
                Your custom preference adds direction to the selected theme. It does not replace your chosen colors or factual business information.
              </p>
            </div>

            <button
              onClick={
                handleThemeContinue
              }
              className={`${primaryBtnClass} py-2.5 text-sm flex items-center justify-center gap-1.5`}
            >
              Apply theme
              <Palette className="w-4 h-4" />
            </button>

          </div>
        );


      // --------------------------------------------------
      // STEP 8 — COLOR PALETTE
      // --------------------------------------------------

      case 8:
        return (
          <div
            className={`flex flex-col gap-4 w-full max-w-lg ${cardClass}`}
          >

            <p className="text-xs font-medium text-white/40 uppercase tracking-widest font-mono">
              Select brand colors
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

              {COLOR_PALETTES.map(
                palette => {
                  const selected =
                    answers.colorPaletteMode ===
                      'preset' &&
                    answers.selectedPalette ===
                      palette.id;

                  return (
                    <motion.button
                      key={palette.id}
                      onClick={() =>
                        handleSelectPalette(
                          palette
                        )
                      }
                      whileTap={{
                        scale: 0.98
                      }}
                      className={`p-3 text-left rounded-xl border transition-colors ${
                        selected
                          ? 'border-blue-400/60 bg-blue-500/[0.08]'
                          : 'border-white/10 bg-white/[0.02] hover:border-white/25'
                      }`}
                    >

                      <div className="flex justify-between items-center mb-2">

                        <span className="text-sm font-medium text-white">
                          {palette.name}
                        </span>

                        {selected && (
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        )}

                      </div>

                      <div className="flex gap-2 mb-2">

                        {Object.values(
                          palette.colors
                        ).map(
                          (
                            color,
                            index
                          ) => (
                            <div
                              key={index}
                              className="w-7 h-7 rounded-full border border-white/20"
                              style={{
                                backgroundColor:
                                  color
                              }}
                            />
                          )
                        )}

                      </div>

                      <p className="text-[10px] text-white/35">
                        {
                          palette.description
                        }
                      </p>

                    </motion.button>
                  );
                }
              )}

            </div>

            <button
              onClick={
                handlePaletteContinue
              }
              disabled={
                answers.colorPaletteMode !==
                'preset'
              }
              className={`${primaryBtnClass} py-2.5 text-sm`}
            >
              Use selected palette
            </button>


            <div className="border-t border-white/10 pt-4">

              <p className="text-xs text-white/40 mb-2">
                Or enter your own color
              </p>

              <div className="flex gap-2">

                <input
                  type="text"
                  value={
                    customColor
                  }
                  onChange={e =>
                    setCustomColor(
                      e.target.value
                    )
                  }
                  placeholder="e.g. Burgundy and gold, forest green, or #14532D"
                  className={fieldClass}
                  onKeyDown={e =>
                    e.key === 'Enter' &&
                    handleCustomColorContinue()
                  }
                />

                <button
                  onClick={
                    handleCustomColorContinue
                  }
                  disabled={
                    !customColor.trim()
                  }
                  className={`${primaryBtnClass} px-4 text-sm shrink-0`}
                >
                  Use
                </button>

              </div>

            </div>

          </div>
        );


      // --------------------------------------------------
      // STEP 9 — EXISTING ANIMATION OPTIONS
      // --------------------------------------------------

      case 9:
        return (
          <div
            className={`flex flex-col gap-4 w-full max-w-lg ${cardClass}`}
          >

            <p className="text-xs font-medium text-white/40 uppercase tracking-widest font-mono">
              Select motion scale
            </p>

            <div className="grid grid-cols-3 gap-2">

              {[
                'normal',
                'fancy',
                'crazy'
              ].map(intensity => {
                const selected =
                  answers.animation ===
                  intensity;

                return (
                  <motion.button
                    key={intensity}
                    onClick={() =>
                      updateAnswer(
                        'animation',
                        intensity
                      )
                    }
                    whileTap={{
                      scale: 0.96
                    }}
                    className={`py-2 px-3 rounded-lg border text-xs font-medium capitalize transition-colors duration-200 ${
                      selected
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/25 text-white/50'
                    }`}
                  >
                    {intensity}
                  </motion.button>
                );
              })}

            </div>

            <button
              onClick={
                handleGenerate
              }
              className={`${primaryBtnClass} mt-1 py-3 text-sm flex items-center justify-center gap-1.5`}
            >
              Generate my brand kit
              <Sparkles className="w-4 h-4" />
            </button>

          </div>
        );

      default:
        return null;
    }
  };


  // ======================================================
  // PROGRESS
  // ======================================================

  const progressPct =
    Math.round(
      ((step + 1) / 10) * 100
    );


  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white flex flex-col items-center justify-between font-sans relative overflow-hidden">

      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-600/[0.06] to-transparent pointer-events-none" />


      {/* HEADER */}

      <header className="w-full border-b border-white/5 px-6 py-4 flex flex-col gap-3 bg-[#0A0A0B]/80 backdrop-blur-md relative z-10">

        <div className="flex items-center justify-between">

          <button
            onClick={() =>
              step > 0
                ? setStep(
                    current =>
                      current - 1
                  )
                : setScreen(
                    'landing'
                  )
            }
            className="flex items-center gap-1.5 text-xs font-medium text-white/50 hover:text-white transition-colors py-1.5 px-3 border border-white/10 rounded-lg bg-white/[0.02]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>


          <div className="flex items-center gap-2">

            <Sparkles className="w-4 h-4 text-blue-400" />

            <span className="text-sm font-semibold">
              BrandForge AI
            </span>

          </div>


          <span className="text-xs text-white/30 font-mono">
            {step + 1}/10
          </span>

        </div>


        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">

          <motion.div
            className="h-full bg-blue-500 rounded-full"
            animate={{
              width:
                `${progressPct}%`
            }}
            transition={{
              duration: 0.35
            }}
          />

        </div>

      </header>


      {/* CHAT */}

      <main className="relative z-10 flex-1 w-full max-w-3xl overflow-y-auto px-6 py-8">

        <div className="flex flex-col gap-5">

          <AnimatePresence initial={false}>

            {messages.map(
              (message, index) => (

                <motion.div
                  key={`${index}-${message.text}`}
                  initial={{
                    opacity: 0,
                    y: 8
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  transition={{
                    duration: 0.3,
                    ease: easeOut
                  }}
                  className={`flex ${
                    message.sender ===
                    'user'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >

                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      message.sender ===
                      'user'
                        ? 'bg-blue-600 text-white rounded-br-md'
                        : 'bg-white/[0.03] border border-white/5 text-white/80 rounded-bl-md'
                    }`}
                  >
                    {message.text}
                  </div>

                </motion.div>

              )
            )}

          </AnimatePresence>

          <div ref={chatEndRef} />

        </div>

      </main>


      {/* INPUT */}

      <footer className="relative z-10 w-full border-t border-white/5 bg-[#0A0A0B]/90 backdrop-blur-xl">

        <div className="max-w-3xl mx-auto px-6 py-5 flex justify-center">

          <AnimatePresence mode="wait">

            <motion.div
              key={step}
              initial={{
                opacity: 0,
                y: 8
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              exit={{
                opacity: 0,
                y: -6
              }}
              transition={{
                duration: 0.25,
                ease: easeOut
              }}
              className="w-full flex justify-center"
            >
              {renderInputArea()}
            </motion.div>

          </AnimatePresence>

        </div>

      </footer>

    </div>
  );
}