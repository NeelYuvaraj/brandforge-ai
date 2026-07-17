import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  BriefcaseBusiness,
  Check,
  Download,
  Globe2,
  Mail,
  MapPin,
  Menu as MenuIcon,
  Palette,
  Phone,
  Share2,
  Sparkles,
  Clock,
} from 'lucide-react';

import { useBrandData } from '../context/BrandContext';


// ======================================================
// HELPERS
// ======================================================

const safeText = (value, fallback = '') => {
  if (typeof value !== 'string') return fallback;
  return value.trim() || fallback;
};


const slugify = value =>
  String(value || 'brandforge')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');


const getInitials = (name = '') => {
  const words = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) return 'BF';

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return (
    words[0][0] +
    words[words.length - 1][0]
  ).toUpperCase();
};


const isValidHex = value =>
  /^#[0-9A-F]{6}$/i.test(
    String(value || '').trim()
  );


const downloadFile = (
  content,
  filename,
  type = 'text/plain'
) => {
  const blob = new Blob([content], {
    type,
  });

  const url =
    URL.createObjectURL(blob);

  const anchor =
    document.createElement('a');

  anchor.href = url;
  anchor.download = filename;

  document.body.appendChild(anchor);

  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
};


// ======================================================
// THEMES
//
// These affect GENERATED WEBSITE only.
// They do not affect BrandForge Studio UI.
// ======================================================

const THEMES = {
  apple: {
    page: 'bg-[#f5f5f7] text-[#1d1d1f]',
    nav: 'bg-white/90 border-black/5',
    surface: 'bg-white border-black/5',
    muted: 'text-black/55',
  },

  cyberpunk: {
    page: 'bg-[#05030a] text-cyan-100',
    nav: 'bg-black/90 border-cyan-500/20',
    surface:
      'bg-cyan-950/10 border-cyan-500/20',
    muted: 'text-cyan-100/55',
  },

  glassmorphism: {
    page:
      'bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white',
    nav:
      'bg-white/5 border-white/10 backdrop-blur-xl',
    surface:
      'bg-white/5 border-white/10 backdrop-blur-xl',
    muted: 'text-white/55',
  },

  luxury: {
    page:
      'bg-[#15120f] text-[#f5ead7]',
    nav:
      'bg-[#15120f]/95 border-amber-500/20',
    surface:
      'bg-[#201b16] border-amber-500/20',
    muted:
      'text-[#f5ead7]/55',
  },

  minimal: {
    page:
      'bg-white text-slate-950',
    nav:
      'bg-white/95 border-slate-200',
    surface:
      'bg-white border-slate-200',
    muted:
      'text-slate-500',
  },

  dark: {
    page:
      'bg-slate-950 text-white',
    nav:
      'bg-slate-950/95 border-white/10',
    surface:
      'bg-slate-900/70 border-white/10',
    muted:
      'text-white/50',
  },

  developer: {
    page:
      'bg-black text-lime-300',
    nav:
      'bg-black/95 border-lime-500/20',
    surface:
      'bg-zinc-950 border-lime-500/20',
    muted:
      'text-lime-300/50',
  },
};


// ======================================================
// DYNAMIC LOGO
// ======================================================

function BrandLogo({
  businessName,
  symbol = 'initials',
  primaryColor,
  accentColor,
  size = 72,
  showName = false,
  nameColor,
}) {
  const initials =
    getInitials(businessName);


  const renderSymbol = () => {
    switch (symbol) {
      case 'leaf':
        return (
          <>
            <path
              d="M20 68C22 35 45 16 80 20C78 53 58 77 25 80C39 65 52 51 68 36C48 47 34 59 20 68Z"
              fill={primaryColor}
            />

            <path
              d="M25 72C40 58 53 47 68 36"
              stroke={accentColor}
              strokeWidth="5"
              strokeLinecap="round"
            />
          </>
        );


      case 'diamond':
        return (
          <>
            <rect
              x="25"
              y="25"
              width="50"
              height="50"
              rx="8"
              transform="rotate(45 50 50)"
              fill={primaryColor}
            />

            <circle
              cx="50"
              cy="50"
              r="9"
              fill={accentColor}
            />
          </>
        );


      case 'spark':
      case 'star':
        return (
          <path
            d="M50 8L60 39L92 50L60 61L50 92L40 61L8 50L40 39L50 8Z"
            fill={primaryColor}
          />
        );


      case 'wave':
        return (
          <>
            <path
              d="M10 42C25 20 40 20 55 42C70 64 82 64 92 42"
              fill="none"
              stroke={primaryColor}
              strokeWidth="10"
              strokeLinecap="round"
            />

            <path
              d="M10 65C25 43 40 43 55 65C70 87 82 87 92 65"
              fill="none"
              stroke={accentColor}
              strokeWidth="5"
              strokeLinecap="round"
            />
          </>
        );


      case 'connected-nodes':
        return (
          <>
            <path
              d="M25 28L72 25L78 70L35 78Z"
              fill="none"
              stroke={primaryColor}
              strokeWidth="6"
            />

            <circle
              cx="25"
              cy="28"
              r="8"
              fill={primaryColor}
            />

            <circle
              cx="72"
              cy="25"
              r="8"
              fill={accentColor}
            />

            <circle
              cx="78"
              cy="70"
              r="8"
              fill={primaryColor}
            />

            <circle
              cx="35"
              cy="78"
              r="8"
              fill={accentColor}
            />
          </>
        );


      case 'shield':
        return (
          <>
            <path
              d="M50 8L84 22V48C84 70 70 85 50 94C30 85 16 70 16 48V22L50 8Z"
              fill={primaryColor}
            />

            <text
              x="50"
              y="59"
              textAnchor="middle"
              fontSize="25"
              fontWeight="700"
              fill="#fff"
              fontFamily="Arial"
            >
              {initials}
            </text>
          </>
        );


      case 'circle':
        return (
          <>
            <circle
              cx="50"
              cy="50"
              r="40"
              fill={primaryColor}
            />

            <circle
              cx="50"
              cy="50"
              r="23"
              fill="none"
              stroke={accentColor}
              strokeWidth="7"
            />
          </>
        );


      case 'abstract':
        return (
          <>
            <path
              d="M15 75L39 15L55 54L77 25L85 80L15 75Z"
              fill={primaryColor}
            />

            <circle
              cx="68"
              cy="28"
              r="10"
              fill={accentColor}
            />
          </>
        );


      case 'initials':
      default:
        return (
          <>
            <rect
              x="8"
              y="8"
              width="84"
              height="84"
              rx="25"
              fill={primaryColor}
            />

            <text
              x="50"
              y="61"
              textAnchor="middle"
              fontSize="31"
              fontWeight="800"
              fill="#fff"
              fontFamily="Arial"
            >
              {initials}
            </text>

            <circle
              cx="79"
              cy="21"
              r="9"
              fill={accentColor}
            />
          </>
        );
    }
  };


  return (
    <div className="flex items-center gap-4 min-w-0">
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="shrink-0"
      >
        {renderSymbol()}
      </svg>

      {showName && (
        <span
          className="font-black tracking-[-0.04em] leading-none"
          style={{
            color:
              nameColor ||
              'currentColor',

            fontSize:
              Math.max(
                22,
                size * 0.42
              ),
          }}
        >
          {businessName}
        </span>
      )}
    </div>
  );
}


// ======================================================
// DECORATIVE BACKGROUND
//
// Uses design preference to make visual direction more
// visible without inventing factual content.
// ======================================================

function DecorativeBackground({
  answers,
  brandKit,
  colors,
}) {
  const designText = `
    ${answers.designPreference || ''}
    ${
      brandKit?.visualIdentity
        ?.designDirection || ''
    }
    ${
      brandKit?.visualIdentity
        ?.decorativeStyle || ''
    }
  `.toLowerCase();


  const wantsLeaf =
    designText.includes('leaf') ||
    designText.includes('banana') ||
    designText.includes('organic') ||
    designText.includes('nature');


  const wantsGeometry =
    designText.includes('geometry') ||
    designText.includes('geometric') ||
    designText.includes('temple') ||
    designText.includes('pattern') ||
    designText.includes('traditional');


  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      <div
        className="absolute -top-32 -right-20 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{
          backgroundColor:
            colors.primary,
        }}
      />

      <div
        className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full blur-3xl opacity-15"
        style={{
          backgroundColor:
            colors.accent,
        }}
      />


      {wantsGeometry && (
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(45deg, ${colors.primary} 25%, transparent 25%),
              linear-gradient(-45deg, ${colors.primary} 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, ${colors.accent} 75%),
              linear-gradient(-45deg, transparent 75%, ${colors.accent} 75%)
            `,

            backgroundSize:
              '48px 48px',

            backgroundPosition:
              '0 0, 0 24px, 24px -24px, -24px 0',
          }}
        />
      )}


      {wantsLeaf && (
        <>
          <div
            className="absolute right-[7%] top-[20%] w-36 h-72 rounded-[100%_0_100%_0] rotate-[28deg] opacity-10"
            style={{
              backgroundColor:
                colors.primary,
            }}
          />

          <div
            className="absolute right-[18%] top-[35%] w-24 h-52 rounded-[100%_0_100%_0] rotate-[45deg] opacity-10"
            style={{
              backgroundColor:
                colors.accent,
            }}
          />
        </>
      )}

    </div>
  );
}


// ======================================================
// WEBSITE PREVIEW
// ======================================================

function WebsitePreview({
  answers,
  brandKit,
  colors,
}) {
  const theme =
    THEMES[
      answers.theme ||
        'apple'
    ] || THEMES.apple;


  const businessName =
    safeText(
      answers.businessName,
      brandKit?.business?.name ||
        'Your Business'
    );


  const industry =
    safeText(
      answers.industry,
      brandKit?.business
        ?.industry || ''
    );


  const description =
    safeText(
      answers.description,
      brandKit?.business
        ?.description || ''
    );


  const tagline =
    safeText(
      answers.tagline,
      brandKit?.identity
        ?.tagline || ''
    );


  const headline =
    safeText(
      brandKit?.website
        ?.headline,
      businessName
    );


  const subheadline =
    safeText(
      brandKit?.website
        ?.subheadline,
      description
    );


  const about =
    safeText(
      brandKit?.website
        ?.about,
      description
    );


  const aboutTitle =
    safeText(
      brandKit?.website
        ?.aboutTitle,
      'About Us'
    );


  const userServices =
    Array.isArray(
      answers.services
    )
      ? answers.services.filter(
          Boolean
        )
      : [];


  const generatedServices =
    Array.isArray(
      brandKit?.website
        ?.services
    )
      ? brandKit.website
          .services
      : [];


  const services =
    userServices.map(
      (service, index) => ({
        title:
          service,

        description:
          generatedServices[
            index
          ]?.description || '',
      })
    );


  const hasContact =
    Boolean(
      answers.email ||
        answers.phone ||
        answers.address
    );


  const scrollToSection =
    sectionId => {
      const element =
        document.getElementById(
          sectionId
        );

      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    };


  const handleCTA = () => {
    const type =
      brandKit?.website
        ?.ctaType;


    if (
      type === 'call' &&
      answers.phone
    ) {
      window.location.href =
        `tel:${answers.phone}`;

      return;
    }


    if (
      type === 'email' &&
      answers.email
    ) {
      window.location.href =
        `mailto:${answers.email}`;

      return;
    }


    if (
      type === 'menu' &&
      answers.menuText
    ) {
      scrollToSection(
        'menu'
      );

      return;
    }


    if (
      type === 'contact'
    ) {
      scrollToSection(
        'contact'
      );

      return;
    }


    if (
      answers.menuText
    ) {
      scrollToSection(
        'menu'
      );

      return;
    }


    if (
      userServices.length
    ) {
      scrollToSection(
        'services'
      );
    }
  };


  const navigation = [
    {
      label: 'Home',
      id: 'home',
      show: true,
    },

    {
      label: 'About',
      id: 'about',
      show: Boolean(about),
    },

    {
      label: 'Services',
      id: 'services',
      show:
        services.length > 0,
    },

    {
      label: 'Menu',
      id: 'menu',
      show: Boolean(
        answers.menuText
      ),
    },

    {
      label: 'Details',
      id: 'details',
      show: Boolean(
        answers.address ||
          answers.openingHours ||
          answers.additionalDetails
      ),
    },

    {
      label: 'Contact',
      id: 'contact',
      show: hasContact,
    },
  ].filter(item => item.show);


  return (
    <div
      className={`rounded-3xl overflow-hidden border border-white/10 shadow-2xl ${theme.page}`}
    >

      {/* NAVIGATION */}

      <nav
        className={`sticky top-0 z-30 px-6 md:px-10 py-4 border-b backdrop-blur-xl ${theme.nav}`}
      >
        <div className="flex items-center justify-between gap-8">

          <button
            onClick={() =>
              scrollToSection(
                'home'
              )
            }
            className="text-left"
          >
            <BrandLogo
              businessName={
                businessName
              }
              symbol={
                brandKit
                  ?.visualIdentity
                  ?.logoSymbol
              }
              primaryColor={
                colors.primary
              }
              accentColor={
                colors.accent
              }
              size={56}
              showName
            />
          </button>


          <div className="hidden md:flex items-center gap-5">

            {navigation.map(
              item => (
                <button
                  key={item.id}
                  onClick={() =>
                    scrollToSection(
                      item.id
                    )
                  }
                  className="text-xs font-semibold opacity-60 hover:opacity-100 transition-opacity"
                >
                  {item.label}
                </button>
              )
            )}

          </div>

        </div>
      </nav>


      {/* HERO */}

      <section
        id="home"
        className="relative min-h-[680px] px-6 md:px-14 py-20 md:py-28 flex items-center overflow-hidden scroll-mt-24"
      >

        <DecorativeBackground
          answers={answers}
          brandKit={
            brandKit
          }
          colors={colors}
        />


        <div className="relative z-10 max-w-5xl">

          {industry && (
            <div
              className="inline-flex px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.15em] border mb-8"
              style={{
                color:
                  colors.primary,

                borderColor:
                  `${colors.primary}55`,

                backgroundColor:
                  `${colors.primary}10`,
              }}
            >
              {industry}
            </div>
          )}


          <div className="mb-10">
            <BrandLogo
              businessName={
                businessName
              }
              symbol={
                brandKit
                  ?.visualIdentity
                  ?.logoSymbol
              }
              primaryColor={
                colors.primary
              }
              accentColor={
                colors.accent
              }
              size={112}
              showName
            />
          </div>


          {tagline && (
            <p
              className="text-xl md:text-3xl font-semibold mb-5 max-w-3xl"
              style={{
                color:
                  colors.primary,
              }}
            >
              {tagline}
            </p>
          )}


          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-[-0.055em] leading-[0.95] max-w-5xl">
            {headline}
          </h1>


          {subheadline && (
            <p
              className={`mt-8 text-lg md:text-xl leading-relaxed max-w-3xl ${theme.muted}`}
            >
              {subheadline}
            </p>
          )}


          <div className="mt-10 flex flex-wrap gap-3">

            {brandKit?.website
              ?.cta &&
              brandKit?.website
                ?.ctaType !==
                'none' && (

                <button
                  onClick={
                    handleCTA
                  }
                  className="px-6 py-3.5 rounded-xl text-sm font-bold text-white shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform"
                  style={{
                    backgroundColor:
                      colors.primary,
                  }}
                >
                  {
                    brandKit
                      .website
                      .cta
                  }
                </button>

              )}


            {services.length >
              0 && (

              <button
                onClick={() =>
                  scrollToSection(
                    'services'
                  )
                }
                className="px-6 py-3.5 rounded-xl text-sm font-semibold border border-current/20 hover:bg-current/5 transition-colors"
              >
                Explore Services
              </button>

            )}


            {answers.menuText && (

              <button
                onClick={() =>
                  scrollToSection(
                    'menu'
                  )
                }
                className="px-6 py-3.5 rounded-xl text-sm font-semibold border border-current/20 hover:bg-current/5 transition-colors"
              >
                View Menu
              </button>

            )}

          </div>

        </div>

      </section>


      {/* ABOUT */}

      {about && (
        <section
          id="about"
          className="px-6 md:px-14 py-20 scroll-mt-24"
          style={{
            backgroundColor:
              `${colors.primary}08`,
          }}
        >

          <div className="max-w-4xl">

            <p
              className="text-xs uppercase tracking-[0.2em] font-bold"
              style={{
                color:
                  colors.primary,
              }}
            >
              Our Story
            </p>


            <h2 className="text-4xl md:text-5xl font-black tracking-tight mt-4">
              {aboutTitle}
            </h2>


            <p
              className={`mt-7 text-lg leading-relaxed ${theme.muted}`}
            >
              {about}
            </p>


            {answers.targetAudience && (

              <div className="mt-8">

                <p className="text-xs uppercase tracking-wider opacity-40">
                  Created for
                </p>

                <p className="mt-2 font-semibold">
                  {
                    answers.targetAudience
                  }
                </p>

              </div>

            )}

          </div>

        </section>
      )}


      {/* SERVICES */}

      {services.length > 0 && (

        <section
          id="services"
          className="px-6 md:px-14 py-20 scroll-mt-24"
        >

          <p
            className="text-xs uppercase tracking-[0.2em] font-bold"
            style={{
              color:
                colors.primary,
            }}
          >
            What We Offer
          </p>


          <h2 className="text-4xl md:text-5xl font-black tracking-tight mt-4">
            {brandKit?.website
              ?.servicesTitle ||
              'Our Services'}
          </h2>


          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">

            {services.map(
              (
                service,
                index
              ) => (

                <div
                  key={`${service.title}-${index}`}
                  className={`rounded-2xl border p-7 ${theme.surface}`}
                >

                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      color:
                        colors.primary,

                      backgroundColor:
                        `${colors.primary}15`,
                    }}
                  >
                    <BriefcaseBusiness className="w-5 h-5" />
                  </div>


                  <h3 className="text-xl font-bold mt-6">
                    {service.title}
                  </h3>


                  {service.description && (

                    <p
                      className={`mt-3 text-sm leading-relaxed ${theme.muted}`}
                    >
                      {
                        service.description
                      }
                    </p>

                  )}

                </div>

              )
            )}

          </div>

        </section>

      )}


      {/* MENU */}

      {answers.menuText && (

        <section
          id="menu"
          className="px-6 md:px-14 py-20 scroll-mt-24"
          style={{
            backgroundColor:
              `${colors.accent}08`,
          }}
        >

          <div className="flex items-center gap-3">

            <MenuIcon
              className="w-5 h-5"
              style={{
                color:
                  colors.primary,
              }}
            />

            <p
              className="text-xs uppercase tracking-[0.2em] font-bold"
              style={{
                color:
                  colors.primary,
              }}
            >
              Menu / Products
            </p>

          </div>


          <h2 className="text-4xl md:text-5xl font-black tracking-tight mt-4">
            {brandKit?.website
              ?.menuTitle ||
              'Explore Our Menu'}
          </h2>


          {brandKit?.website
            ?.menuIntro && (

            <p
              className={`mt-5 max-w-3xl text-lg ${theme.muted}`}
            >
              {
                brandKit.website
                  .menuIntro
              }
            </p>

          )}


          <div
            className={`mt-10 rounded-2xl border p-7 md:p-10 whitespace-pre-wrap leading-8 ${theme.surface}`}
          >
            {answers.menuText}
          </div>

        </section>

      )}


      {/* DETAILS */}

      {(answers.address ||
        answers.openingHours ||
        answers.additionalDetails) && (

        <section
          id="details"
          className="px-6 md:px-14 py-20 scroll-mt-24"
        >

          <p
            className="text-xs uppercase tracking-[0.2em] font-bold"
            style={{
              color:
                colors.primary,
            }}
          >
            Business Details
          </p>


          <h2 className="text-4xl md:text-5xl font-black tracking-tight mt-4">
            Visit & Details
          </h2>


          <div className="grid md:grid-cols-2 gap-5 mt-10">

            {answers.address && (

              <div
                className={`rounded-2xl border p-7 ${theme.surface}`}
              >

                <MapPin
                  className="w-6 h-6"
                  style={{
                    color:
                      colors.primary,
                  }}
                />

                <p className="text-xs uppercase tracking-wider opacity-40 mt-5">
                  Address
                </p>

                <p className="mt-2 font-semibold">
                  {
                    answers.address
                  }
                </p>

              </div>

            )}


            {answers.openingHours && (

              <div
                className={`rounded-2xl border p-7 ${theme.surface}`}
              >

                <Clock
                  className="w-6 h-6"
                  style={{
                    color:
                      colors.primary,
                  }}
                />

                <p className="text-xs uppercase tracking-wider opacity-40 mt-5">
                  Opening Hours
                </p>

                <p className="mt-2 font-semibold whitespace-pre-wrap">
                  {
                    answers.openingHours
                  }
                </p>

              </div>

            )}

          </div>


          {answers.additionalDetails && (

            <div
              className={`mt-5 rounded-2xl border p-7 whitespace-pre-wrap leading-relaxed ${theme.surface}`}
            >
              {
                answers.additionalDetails
              }
            </div>

          )}

        </section>

      )}


      {/* CONTACT */}

      {hasContact && (

        <section
          id="contact"
          className="px-6 md:px-14 py-20 scroll-mt-24"
          style={{
            backgroundColor:
              `${colors.primary}0A`,
          }}
        >

          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            Get in touch
          </h2>


          <p
            className={`mt-4 ${theme.muted}`}
          >
            Connect with {businessName}.
          </p>


          <div className="flex flex-wrap gap-3 mt-8">

            {answers.phone && (

              <a
                href={`tel:${answers.phone}`}
                className="px-5 py-3 rounded-xl text-white font-semibold flex items-center gap-2"
                style={{
                  backgroundColor:
                    colors.primary,
                }}
              >
                <Phone className="w-4 h-4" />

                Call
              </a>

            )}


            {answers.email && (

              <a
                href={`mailto:${answers.email}`}
                className="px-5 py-3 rounded-xl border border-current/20 font-semibold flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />

                Email
              </a>

            )}

          </div>

        </section>

      )}


      {/* FOOTER */}

      <footer className="px-6 md:px-14 py-10 border-t border-current/10">

        <BrandLogo
          businessName={
            businessName
          }
          symbol={
            brandKit
              ?.visualIdentity
              ?.logoSymbol
          }
          primaryColor={
            colors.primary
          }
          accentColor={
            colors.accent
          }
          size={46}
          showName
        />

      </footer>

    </div>
  );
}


// ======================================================
// BUSINESS CARD
// ======================================================

function BusinessCardPreview({
  answers,
  brandKit,
  colors,
}) {
  const businessName =
    safeText(
      answers.businessName,
      'Your Business'
    );


  const tagline =
    safeText(
      answers.tagline,
      brandKit?.identity
        ?.tagline || ''
    );


  return (
    <div className="space-y-8">

      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-white/35">
          Business Card
        </p>

        <h2 className="text-3xl font-bold mt-2">
          Ready to make an impression.
        </h2>
      </div>


      <div className="grid lg:grid-cols-2 gap-6 max-w-5xl">

        {/* FRONT */}

        <div
          className="aspect-[1.75/1] min-h-[270px] rounded-3xl p-8 relative overflow-hidden shadow-2xl flex flex-col justify-between"
          style={{
            backgroundColor:
              colors.secondary,
          }}
        >

          <div
            className="absolute -right-20 -top-20 w-64 h-64 rounded-full opacity-20"
            style={{
              backgroundColor:
                colors.primary,
            }}
          />


          <div className="relative z-10">

            <BrandLogo
              businessName={
                businessName
              }
              symbol={
                brandKit
                  ?.visualIdentity
                  ?.logoSymbol
              }
              primaryColor={
                colors.primary
              }
              accentColor={
                colors.accent
              }
              size={76}
              showName
              nameColor="#FFFFFF"
            />

          </div>


          <div className="relative z-10">

            {tagline && (
              <p className="text-xl font-semibold text-white max-w-md">
                {tagline}
              </p>
            )}

            {answers.industry && (
              <p className="text-xs uppercase tracking-[0.18em] text-white/45 mt-3">
                {answers.industry}
              </p>
            )}

          </div>

        </div>


        {/* BACK */}

        <div
          className="aspect-[1.75/1] min-h-[270px] rounded-3xl p-8 relative overflow-hidden shadow-2xl flex flex-col justify-between"
          style={{
            backgroundColor:
              colors.primary,
          }}
        >

          <div className="relative z-10">

            <h3 className="text-3xl font-black text-white">
              {answers.ownerName ||
                businessName}
            </h3>


            {answers.ownerRole && (
              <p className="text-white/60 mt-2">
                {
                  answers.ownerRole
                }
              </p>
            )}

          </div>


          <div className="relative z-10 space-y-3 text-white/85">

            {answers.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4" />
                {answers.phone}
              </div>
            )}


            {answers.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                {answers.email}
              </div>
            )}


            {answers.address && (
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-1 shrink-0" />
                {answers.address}
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}


// ======================================================
// BRAND KIT
// ======================================================

function BrandKitPreview({
  answers,
  brandKit,
  colors,
  downloadLogo,
  downloadKit,
  downloadWebsite,
}) {
  const businessName =
    answers.businessName ||
    'Your Business';


  return (
    <div className="space-y-7">

      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-white/35">
          Complete Brand Kit
        </p>

        <h2 className="text-3xl font-bold mt-2">
          {businessName}
        </h2>
      </div>


      <div className="grid md:grid-cols-2 gap-5">

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">

          <p className="text-xs uppercase tracking-wider text-white/35 mb-6">
            Logo
          </p>


          <div className="bg-white rounded-2xl min-h-48 flex items-center justify-center p-8">

            <BrandLogo
              businessName={
                businessName
              }
              symbol={
                brandKit
                  ?.visualIdentity
                  ?.logoSymbol
              }
              primaryColor={
                colors.primary
              }
              accentColor={
                colors.accent
              }
              size={88}
              showName
              nameColor="#111827"
            />

          </div>


          <button
            onClick={
              downloadLogo
            }
            className="mt-5 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Logo
          </button>

        </div>


        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">

          <p className="text-xs uppercase tracking-wider text-white/35 mb-6">
            Colors
          </p>


          {[
            [
              'Primary',
              colors.primary,
            ],

            [
              'Secondary',
              colors.secondary,
            ],

            [
              'Accent',
              colors.accent,
            ],
          ].map(
            ([label, color]) => (

              <div
                key={label}
                className="flex items-center gap-4 mb-4"
              >

                <div
                  className="w-14 h-14 rounded-xl border border-white/10"
                  style={{
                    backgroundColor:
                      color,
                  }}
                />

                <div>
                  <p className="font-semibold">
                    {label}
                  </p>

                  <p className="text-xs text-white/35 font-mono mt-1">
                    {color}
                  </p>
                </div>

              </div>

            )
          )}

        </div>


        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">

          <p className="text-xs uppercase tracking-wider text-white/35">
            Design Direction
          </p>


          <p className="text-sm text-white/65 leading-relaxed mt-4">
            {answers.designPreference ||
              brandKit
                ?.visualIdentity
                ?.designDirection ||
              'No custom design direction provided.'}
          </p>

        </div>


        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">

          <p className="text-xs uppercase tracking-wider text-white/35 mb-5">
            Export
          </p>


          <div className="space-y-3">

            <button
              onClick={
                downloadWebsite
              }
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold flex items-center justify-center gap-2"
            >
              <Globe2 className="w-4 h-4" />

              Download Website HTML
            </button>


            <button
              onClick={
                downloadKit
              }
              className="w-full py-3 rounded-xl bg-white text-black text-sm font-semibold flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />

              Download Brand Kit
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}


// ======================================================
// MAIN COMPONENT
// ======================================================

export default function PortfolioGenerator() {
  const {
    answers,
    updateAnswer,
    setScreen,
  } = useBrandData();


  const [activeTab, setActiveTab] =
    useState('website');


  const [shared, setShared] =
    useState(false);


  const brandKit =
    answers.brandKit || {};


  const colors =
    useMemo(() => {

      if (
        answers
          .colorPaletteMode ===
          'preset' &&
        answers.colorPalette
      ) {
        return {
          primary:
            answers
              .colorPalette
              .primary ||
            '#2563EB',

          secondary:
            answers
              .colorPalette
              .secondary ||
            '#0F172A',

          accent:
            answers
              .colorPalette
              .accent ||
            '#38BDF8',
        };
      }


      return {
        primary:
          isValidHex(
            brandKit
              ?.visualIdentity
              ?.primaryColor
          )
            ? brandKit
                .visualIdentity
                .primaryColor
            : '#2563EB',

        secondary:
          isValidHex(
            brandKit
              ?.visualIdentity
              ?.secondaryColor
          )
            ? brandKit
                .visualIdentity
                .secondaryColor
            : '#0F172A',

        accent:
          isValidHex(
            brandKit
              ?.visualIdentity
              ?.accentColor
          )
            ? brandKit
                .visualIdentity
                .accentColor
            : '#38BDF8',
      };

    }, [
      answers.colorPaletteMode,
      answers.colorPalette,
      brandKit,
    ]);


  const businessName =
    answers.businessName ||
    brandKit?.business?.name ||
    'Your Business';


  // ====================================================
  // DOWNLOAD LOGO
  // ====================================================

  const downloadLogo = () => {
    const initials = getInitials(businessName);
    const symbol =
      brandKit?.visualIdentity?.logoSymbol ||
      'initials';

    const symbolMarkup =
      symbol === 'leaf'
        ? `
  <path d="M20 68C22 35 45 16 80 20C78 53 58 77 25 80C39 65 52 51 68 36C48 47 34 59 20 68Z" fill="${colors.primary}" />
  <path d="M25 72C40 58 53 47 68 36" stroke="${colors.accent}" stroke-width="5" stroke-linecap="round" />`
        : `
  <rect x="8" y="8" width="84" height="84" rx="25" fill="${colors.primary}" />
  <text x="50" y="61" text-anchor="middle" font-size="31" font-weight="800" fill="#FFFFFF" font-family="Arial, sans-serif">${initials}</text>
  <circle cx="79" cy="21" r="9" fill="${colors.accent}" />`;

    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 100 100">
${symbolMarkup}
</svg>`.trim();

    downloadFile(
      svg,
      `${slugify(businessName)}-logo.svg`,
      'image/svg+xml'
    );
  };

  // ====================================================
  // DOWNLOAD BRAND KIT
  // ====================================================

  const downloadKit = () => {
    const data = {
      business: {
        businessName:
          answers.businessName,

        industry:
          answers.industry,

        description:
          answers.description,

        targetAudience:
          answers.targetAudience,

        services:
          answers.services,

        tagline:
          answers.tagline,

        address:
          answers.address,

        openingHours:
          answers.openingHours,

        menuText:
          answers.menuText,

        additionalDetails:
          answers.additionalDetails,

        ownerName:
          answers.ownerName,

        ownerRole:
          answers.ownerRole,

        email:
          answers.email,

        phone:
          answers.phone,
      },

      design: {
        theme:
          answers.theme,

        designPreference:
          answers.designPreference,

        designReference:
          answers.designReference,

        colors,
      },

      generatedBrandKit:
        brandKit,
    };


    downloadFile(
      JSON.stringify(
        data,
        null,
        2
      ),
      `${slugify(
        businessName
      )}-brand-kit.json`,
      'application/json'
    );
  };


  // ====================================================
  // DOWNLOAD STANDALONE WEBSITE
  // ====================================================

  const downloadWebsite = () => {
    const esc = value =>
      String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

    const name = esc(businessName);
    const tagline = esc(
      answers.tagline ||
      brandKit?.identity?.tagline ||
      ''
    );

    const headline = esc(
      brandKit?.website?.headline ||
      businessName
    );

    const subheadline = esc(
      brandKit?.website?.subheadline ||
      answers.description ||
      ''
    );

    const aboutTitle = esc(
      brandKit?.website?.aboutTitle ||
      'Our Story'
    );

    const aboutText = esc(
      brandKit?.website?.about ||
      answers.description ||
      ''
    );

    const industry = esc(
      answers.industry || ''
    );

    const audience = esc(
      answers.targetAudience || ''
    );

    const menuText = esc(
      answers.menuText || ''
    );

    const address = esc(
      answers.address || ''
    );

    const openingHours = esc(
      answers.openingHours || ''
    );

    const email = esc(
      answers.email || ''
    );

    const phone = esc(
      answers.phone || ''
    );

    const additionalDetails = esc(
      answers.additionalDetails || ''
    );

    const services = Array.isArray(answers.services)
      ? answers.services.filter(Boolean)
      : [];

    const designText = `
      ${answers.designPreference || ''}
      ${brandKit?.visualIdentity?.designDirection || ''}
      ${brandKit?.visualIdentity?.decorativeStyle || ''}
      ${answers.industry || ''}
    `.toLowerCase();

    const isSouthIndian =
      designText.includes('south indian') ||
      designText.includes('south-indian') ||
      designText.includes('kolam') ||
      designText.includes('rangoli') ||
      designText.includes('temple') ||
      designText.includes('banana leaf') ||
      designText.includes('banana-leaf') ||
      designText.includes('traditional indian');

    const wantsWarmEarthy =
      designText.includes('warm earthy') ||
      designText.includes('earthy') ||
      designText.includes('terracotta') ||
      designText.includes('clay') ||
      designText.includes('ochre') ||
      designText.includes('rustic');

    const customThemePalette =
      isSouthIndian && wantsWarmEarthy
        ? {
            primary: '#8C3F24',
            secondary: '#F3E2C7',
            accent: '#557A46',
            bg: '#F7EBDD',
            surface: '#FFF8ED',
            text: '#321D14',
            muted: '#735B4D',
            nav: 'rgba(247,235,221,.94)'
          }
        : null;

    const wantsLeaf =
      isSouthIndian ||
      designText.includes('leaf') ||
      designText.includes('banana') ||
      designText.includes('organic') ||
      designText.includes('nature');

    const wantsGeometry =
      isSouthIndian ||
      designText.includes('geometry') ||
      designText.includes('geometric') ||
      designText.includes('temple') ||
      designText.includes('pattern') ||
      designText.includes('traditional');

    const themeName = String(answers.theme || 'apple').toLowerCase();

    const themeMap = {
      apple: {
        bg: '#F5F5F7',
        surface: '#FFFFFF',
        text: '#1D1D1F',
        muted: '#6E6E73',
        nav: 'rgba(255,255,255,.88)',
      },
      minimal: {
        bg: '#FAFAF8',
        surface: '#FFFFFF',
        text: '#18181B',
        muted: '#71717A',
        nav: 'rgba(250,250,248,.92)',
      },
      luxury: {
        bg: '#15120F',
        surface: '#211B15',
        text: '#F7EBD8',
        muted: '#B9AA94',
        nav: 'rgba(21,18,15,.92)',
      },
      cyberpunk: {
        bg: '#05030A',
        surface: '#10091A',
        text: '#CFFAFE',
        muted: '#67E8F9',
        nav: 'rgba(5,3,10,.92)',
      },
      glassmorphism: {
        bg: '#07101F',
        surface: 'rgba(255,255,255,.07)',
        text: '#FFFFFF',
        muted: '#CBD5E1',
        nav: 'rgba(7,16,31,.78)',
      },
      developer: {
        bg: '#050505',
        surface: '#0C0C0C',
        text: '#BEF264',
        muted: '#86EFAC',
        nav: 'rgba(5,5,5,.94)',
      },
      dark: {
        bg: '#070A10',
        surface: '#111827',
        text: '#F8FAFC',
        muted: '#94A3B8',
        nav: 'rgba(7,10,16,.92)',
      },
    };

    const theme = customThemePalette || themeMap[themeName] || themeMap.dark;
    const exportColors = customThemePalette
      ? {
          primary: customThemePalette.primary,
          secondary: customThemePalette.secondary,
          accent: customThemePalette.accent
        }
      : colors;

    const logoSymbol =
      brandKit?.visualIdentity?.logoSymbol ||
      (wantsLeaf ? 'leaf' : 'initials');

    const initials = esc(getInitials(businessName));

    const logoMarkup = logoSymbol === 'leaf'
      ? `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M20 68C22 35 45 16 80 20C78 53 58 77 25 80C39 65 52 51 68 36C48 47 34 59 20 68Z" fill="${exportColors.primary}"/><path d="M25 72C40 58 53 47 68 36" stroke="${exportColors.accent}" stroke-width="5" stroke-linecap="round"/></svg>`
      : `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="8" y="8" width="84" height="84" rx="25" fill="${exportColors.primary}"/><text x="50" y="61" text-anchor="middle" font-size="31" font-weight="800" fill="#fff" font-family="Arial">${initials}</text><circle cx="79" cy="21" r="9" fill="${exportColors.accent}"/></svg>`;

    const serviceCards = services.map((service, index) => {
      const serviceName =
        typeof service === 'string'
          ? service
          : service?.name || service?.title || '';

      const serviceDescription =
        typeof service === 'object'
          ? service?.description || ''
          : '';

      return `
        <article class="service-card reveal">
          <div class="service-number">${String(index + 1).padStart(2, '0')}</div>
          <h3>${esc(serviceName)}</h3>
          ${serviceDescription ? `<p>${esc(serviceDescription)}</p>` : ''}
        </article>
      `;
    }).join('');

    const kolam = isSouthIndian
      ? `
        <svg class="kolam kolam-one" viewBox="0 0 240 240" aria-hidden="true">
          <g fill="none" stroke="${exportColors.accent}" stroke-width="2">
            <circle cx="120" cy="120" r="72"/>
            <circle cx="120" cy="120" r="44"/>
            <path d="M120 20C140 70 170 90 220 120C170 140 140 170 120 220C100 170 70 140 20 120C70 90 100 70 120 20Z"/>
            <path d="M50 50C92 72 98 92 120 120C142 92 148 72 190 50C168 92 148 98 120 120C148 142 168 148 190 190C148 168 142 148 120 120C98 148 92 168 50 190C72 148 92 142 120 120C92 98 72 92 50 50Z"/>
          </g>
        </svg>
        <svg class="kolam kolam-two" viewBox="0 0 240 240" aria-hidden="true">
          <g fill="none" stroke="${exportColors.primary}" stroke-width="2">
            <circle cx="120" cy="120" r="78"/>
            <path d="M120 24C132 74 166 108 216 120C166 132 132 166 120 216C108 166 74 132 24 120C74 108 108 74 120 24Z"/>
          </g>
        </svg>
      `
      : '';

    const leafDecor = wantsLeaf
      ? `
        <div class="leaf leaf-one"></div>
        <div class="leaf leaf-two"></div>
      `
      : '';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${name}</title>
<style>
:root{
  --primary:${exportColors.primary};
  --secondary:${exportColors.secondary};
  --accent:${exportColors.accent};
  --bg:${theme.bg};
  --surface:${theme.surface};
  --text:${theme.text};
  --muted:${theme.muted};
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{
  margin:0;
  font-family:Inter,ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  background:var(--bg);
  color:var(--text);
  line-height:1.6;
  overflow-x:hidden;
}
a{color:inherit}
.site-nav{
  position:sticky;top:0;z-index:50;
  min-height:86px;padding:14px clamp(22px,6vw,88px);
  display:flex;align-items:center;justify-content:space-between;gap:30px;
  background:${theme.nav};backdrop-filter:blur(20px);
  border-bottom:1px solid color-mix(in srgb,var(--text) 10%,transparent);
}
.brand{display:flex;align-items:center;gap:14px;text-decoration:none;min-width:0}
.brand svg{width:52px;height:52px;flex:0 0 auto}
.brand-name{
  font-size:clamp(24px,2.6vw,40px);font-weight:950;letter-spacing:-.05em;
  line-height:1;color:var(--text);white-space:nowrap;
}
.nav-links{display:flex;align-items:center;gap:25px}
.nav-links a{
  text-decoration:none;font-size:14px;font-weight:750;color:var(--muted);
  transition:.2s ease;
}
.nav-links a:hover{color:var(--primary);transform:translateY(-1px)}
.hero{
  position:relative;isolation:isolate;min-height:calc(100vh - 86px);
  padding:clamp(80px,10vw,150px) clamp(24px,6vw,90px);
  display:flex;align-items:center;overflow:hidden;
  background:
    radial-gradient(circle at 88% 16%,color-mix(in srgb,var(--primary) 25%,transparent),transparent 30%),
    radial-gradient(circle at 12% 85%,color-mix(in srgb,var(--accent) 18%,transparent),transparent 28%),
    var(--bg);
}
.hero-content{position:relative;z-index:4;max-width:1050px}
.eyebrow{
  display:inline-flex;padding:8px 14px;border:1px solid color-mix(in srgb,var(--primary) 50%,transparent);
  border-radius:999px;color:var(--primary);font-size:12px;font-weight:900;
  text-transform:uppercase;letter-spacing:.14em;
}
.hero-brand{display:flex;align-items:center;gap:24px;margin:42px 0 18px}
.hero-brand svg{width:82px;height:82px}
.hero-brand-name{
  font-size:clamp(46px,6vw,92px);font-weight:950;letter-spacing:-.06em;
  line-height:.95;
}
.tagline{font-size:clamp(20px,2.4vw,34px);font-weight:850;color:var(--accent);margin:20px 0 10px}
.hero h1{
  max-width:1000px;margin:18px 0;font-size:clamp(52px,8vw,120px);
  line-height:.91;letter-spacing:-.07em;font-weight:950;
}
.hero-copy{max-width:720px;font-size:clamp(17px,1.6vw,23px);color:var(--muted)}
.actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:34px}
.btn{
  display:inline-flex;align-items:center;justify-content:center;min-height:50px;
  padding:0 22px;border-radius:14px;text-decoration:none;font-weight:850;
  border:1px solid color-mix(in srgb,var(--text) 25%,transparent);transition:.2s ease;
}
.btn-primary{background:var(--primary);color:white;border-color:var(--primary)}
.btn:hover{transform:translateY(-3px);box-shadow:0 14px 35px rgba(0,0,0,.18)}
.kolam{position:absolute;width:min(34vw,430px);opacity:.12;z-index:1;pointer-events:none}
.kolam-one{right:-70px;top:5%;transform:rotate(12deg)}
.kolam-two{left:-100px;bottom:-100px;transform:rotate(-15deg)}
.leaf{position:absolute;z-index:2;opacity:.13;pointer-events:none;background:var(--primary);border-radius:100% 0 100% 0}
.leaf-one{width:180px;height:420px;right:10%;top:28%;transform:rotate(38deg)}
.leaf-two{width:100px;height:250px;right:25%;bottom:5%;background:var(--accent);transform:rotate(55deg)}
.traditional-border{
  position:absolute;left:0;right:0;bottom:0;height:12px;z-index:3;
  background:repeating-linear-gradient(
    90deg,
    var(--primary) 0 28px,
    var(--accent) 28px 56px,
    var(--secondary) 56px 84px
  );
  opacity:${isSouthIndian ? '1' : '0'};
}
.pattern{
  position:absolute;inset:0;z-index:0;pointer-events:none;opacity:${wantsGeometry ? '.09' : '0'};
  background-image:
    linear-gradient(45deg,var(--primary) 25%,transparent 25%),
    linear-gradient(-45deg,var(--primary) 25%,transparent 25%),
    linear-gradient(45deg,transparent 75%,var(--accent) 75%),
    linear-gradient(-45deg,transparent 75%,var(--accent) 75%);
  background-size:54px 54px;
  background-position:0 0,0 27px,27px -27px,-27px 0;
}
.section{padding:clamp(75px,9vw,130px) clamp(24px,6vw,90px);position:relative}
.section.alt{background:color-mix(in srgb,var(--surface) 88%,var(--bg))}
.section-inner{max-width:1250px;margin:0 auto}
.section-label{
  color:var(--primary);font-size:12px;font-weight:950;text-transform:uppercase;
  letter-spacing:.2em;margin-bottom:12px;
}
.section h2{font-size:clamp(38px,5vw,70px);line-height:1;letter-spacing:-.055em;margin:0 0 30px}
.about-copy{max-width:900px;font-size:clamp(18px,2vw,26px);color:var(--muted)}
.meta{margin-top:30px;display:flex;flex-wrap:wrap;gap:12px}
.pill{padding:9px 14px;border-radius:999px;background:var(--surface);border:1px solid color-mix(in srgb,var(--text) 12%,transparent)}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px;margin-top:40px}
.service-card{
  min-height:250px;padding:30px;border-radius:24px;background:var(--surface);
  border:1px solid color-mix(in srgb,var(--primary) 35%,transparent);
  transition:.25s ease;
}
.service-card:hover{transform:translateY(-7px);border-color:var(--primary)}
.service-number{font-size:12px;font-weight:900;color:var(--primary);letter-spacing:.15em}
.service-card h3{font-size:25px;margin:55px 0 10px}
.service-card p{color:var(--muted)}
.menu-box{
  white-space:pre-wrap;font:inherit;background:var(--surface);padding:30px;border-radius:24px;
  border:1px solid color-mix(in srgb,var(--text) 12%,transparent);max-width:900px;
}
.detail-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px}
.detail{padding:25px;border-radius:20px;background:var(--surface)}
.detail small{display:block;color:var(--primary);font-weight:900;text-transform:uppercase;letter-spacing:.12em;margin-bottom:8px}
.contact-actions{display:flex;flex-wrap:wrap;gap:12px}
footer{
  padding:35px clamp(24px,6vw,90px);display:flex;justify-content:space-between;gap:20px;
  border-top:1px solid color-mix(in srgb,var(--text) 10%,transparent);color:var(--muted)
}
.reveal{opacity:0;transform:translateY(24px);transition:opacity .7s ease,transform .7s ease}
.reveal.visible{opacity:1;transform:none}
@media(max-width:850px){
  .nav-links{display:none}
  .hero-brand{align-items:flex-start;flex-direction:column}
  .hero-brand svg{width:68px;height:68px}
  footer{flex-direction:column}
}
</style>
</head>
<body>
<nav class="site-nav">
  <a class="brand" href="#home">
    ${logoMarkup}
    <span class="brand-name">${name}</span>
  </a>
  <div class="nav-links">
    <a href="#home">Home</a>
    ${aboutText ? '<a href="#about">About</a>' : ''}
    ${services.length ? '<a href="#services">Services</a>' : ''}
    ${menuText ? '<a href="#menu">Menu</a>' : ''}
    ${(address || openingHours || additionalDetails) ? '<a href="#details">Details</a>' : ''}
    ${(email || phone) ? '<a href="#contact">Contact</a>' : ''}
  </div>
</nav>

<main>
<section class="hero" id="home">
  <div class="pattern"></div>
  ${kolam}
  ${leafDecor}
  ${isSouthIndian ? '<div class="traditional-border"></div>' : ''}
  <div class="hero-content reveal">
    ${industry ? `<div class="eyebrow">${industry}</div>` : ''}
    <div class="hero-brand">
      ${logoMarkup}
      <div class="hero-brand-name">${name}</div>
    </div>
    ${tagline ? `<div class="tagline">${tagline}</div>` : ''}
    <h1>${headline}</h1>
    ${subheadline ? `<p class="hero-copy">${subheadline}</p>` : ''}
    <div class="actions">
      ${menuText ? '<a class="btn btn-primary" href="#menu">View Our Menu</a>' : ''}
      ${services.length ? '<a class="btn" href="#services">Explore Services</a>' : ''}
      ${phone ? `<a class="btn" href="tel:${phone}">Call Us</a>` : ''}
    </div>
  </div>
</section>

${aboutText ? `
<section class="section" id="about">
  <div class="section-inner reveal">
    <div class="section-label">Our Story</div>
    <h2>${aboutTitle}</h2>
    <p class="about-copy">${aboutText}</p>
    ${audience ? `<div class="meta"><span class="pill">Created for: ${audience}</span></div>` : ''}
  </div>
</section>` : ''}

${services.length ? `
<section class="section alt" id="services">
  <div class="section-inner">
    <div class="section-label">What We Offer</div>
    <h2>${esc(brandKit?.website?.servicesTitle || 'Our Offerings')}</h2>
    <div class="cards">${serviceCards}</div>
  </div>
</section>` : ''}

${menuText ? `
<section class="section" id="menu">
  <div class="section-inner reveal">
    <div class="section-label">Menu</div>
    <h2>${esc(brandKit?.website?.menuTitle || 'Explore Our Menu')}</h2>
    <div class="menu-box">${menuText}</div>
  </div>
</section>` : ''}

${(address || openingHours || additionalDetails) ? `
<section class="section alt" id="details">
  <div class="section-inner reveal">
    <div class="section-label">Details</div>
    <h2>Plan Your Visit</h2>
    <div class="detail-grid">
      ${address ? `<div class="detail"><small>Address</small>${address}</div>` : ''}
      ${openingHours ? `<div class="detail"><small>Opening Hours</small>${openingHours}</div>` : ''}
      ${additionalDetails ? `<div class="detail"><small>More Information</small>${additionalDetails}</div>` : ''}
    </div>
  </div>
</section>` : ''}

${(email || phone) ? `
<section class="section" id="contact">
  <div class="section-inner reveal">
    <div class="section-label">Contact</div>
    <h2>Get In Touch</h2>
    <div class="contact-actions">
      ${phone ? `<a class="btn btn-primary" href="tel:${phone}">${phone}</a>` : ''}
      ${email ? `<a class="btn" href="mailto:${email}">${email}</a>` : ''}
    </div>
  </div>
</section>` : ''}
</main>

<footer>
  <strong>${name}</strong>
  ${tagline ? `<span>${tagline}</span>` : ''}
</footer>

<script>
document.querySelectorAll('a[href^="#"]').forEach(function(link){
  link.addEventListener('click',function(event){
    var target=document.querySelector(this.getAttribute('href'));
    if(target){
      event.preventDefault();
      target.scrollIntoView({behavior:'smooth',block:'start'});
    }
  });
});
var observer=new IntersectionObserver(function(entries){
  entries.forEach(function(entry){
    if(entry.isIntersecting){entry.target.classList.add('visible');}
  });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(function(el){observer.observe(el);});
</script>
</body>
</html>`;

    downloadFile(
      html,
      `${slugify(businessName)}-website.html`,
      'text/html'
    );
  };

  // ====================================================
  // SHARE
  // ====================================================

  const handleShare = async () => {
    const text = [
      businessName,
      brandKit?.identity
        ?.tagline,
      answers.description,
    ]
      .filter(Boolean)
      .join('\n');


    try {
      if (
        navigator.share
      ) {
        await navigator.share({
          title:
            `${businessName} Brand Kit`,

          text,

          url:
            window.location.href,
        });

        return;
      }


      await navigator.clipboard.writeText(
        window.location.href
      );


      setShared(true);


      setTimeout(
        () =>
          setShared(false),
        1800
      );

    } catch (error) {
      console.warn(
        'Share unavailable:',
        error
      );
    }
  };


  const tabs = [
    {
      id: 'website',
      label: 'Website',
      icon: Globe2,
    },

    {
      id: 'card',
      label:
        'Business Card',
      icon:
        BriefcaseBusiness,
    },

    {
      id: 'kit',
      label: 'Brand Kit',
      icon: Palette,
    },
  ];


  return (
    <div className="min-h-screen bg-[#05070B] text-white">

      {/* HEADER */}

      <header className="sticky top-0 z-50 h-16 border-b border-blue-500/10 bg-[#05070B]/95 backdrop-blur-xl px-4 md:px-6 flex items-center justify-between">

        <div className="flex items-center gap-4">

          <button
            onClick={() =>
              setScreen(
                'landing'
              )
            }
            className="w-9 h-9 rounded-xl border border-blue-500/15 bg-blue-500/5 hover:bg-blue-500/10 flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>


          <div>

            <div className="flex items-center gap-2">

              <Sparkles className="w-4 h-4 text-blue-400" />

              <h1 className="font-semibold text-sm">
                BrandForge Studio
              </h1>

            </div>


            <p className="text-[10px] text-white/30">
              {businessName}
            </p>

          </div>

        </div>


        <div className="flex gap-2">

          <button
            onClick={
              handleShare
            }
            className="h-9 px-3 rounded-xl border border-blue-500/15 bg-blue-500/5 hover:bg-blue-500/10 text-xs font-medium flex items-center gap-2"
          >
            {shared ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}

            {shared
              ? 'Copied'
              : 'Share'}
          </button>


          <button
            onClick={
              downloadWebsite
            }
            className="h-9 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-2"
          >
            <Download className="w-4 h-4" />

            Download
          </button>

        </div>

      </header>


      {/* TABS */}

      <div className="border-b border-blue-500/10 px-4 md:px-8 py-4 bg-[#070A10]">

        <div className="flex gap-2">

          {tabs.map(tab => {

            const Icon =
              tab.icon;

            const active =
              activeTab ===
              tab.id;


            return (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(
                    tab.id
                  )
                }
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  active
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/[0.03] text-white/45 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />

                {tab.label}
              </button>
            );

          })}

        </div>

      </div>


      {/* CONTENT */}

      <main className="p-4 md:p-8 bg-[#0A0D14] min-h-[calc(100vh-129px)]">

        {activeTab ===
          'website' && (

          <WebsitePreview
            answers={answers}
            brandKit={
              brandKit
            }
            colors={colors}
          />

        )}


        {activeTab ===
          'card' && (

          <BusinessCardPreview
            answers={answers}
            brandKit={
              brandKit
            }
            colors={colors}
          />

        )}


        {activeTab ===
          'kit' && (

          <BrandKitPreview
            answers={answers}
            brandKit={
              brandKit
            }
            colors={colors}
            downloadLogo={
              downloadLogo
            }
            downloadKit={
              downloadKit
            }
            downloadWebsite={
              downloadWebsite
            }
          />

        )}

      </main>

    </div>
  );
}