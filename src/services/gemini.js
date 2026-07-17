// BrandForge AI - Gemini Brand Kit Generator
//
// FLOW:
//
// Business interview
//      ↓
// User facts + design preferences
//      ↓
// Gemini brand/design reasoning
//      ↓
// Structured Brand Kit
//      ↓
// React renders:
// - Dynamic logo
// - Business website
// - Business card
//
// IMPORTANT:
// Gemini may generate creative marketing/design content.
// Gemini must NEVER invent factual business information.

import {
  GoogleGenAI,
  Type
} from '@google/genai';


const MODEL =
  'gemini-2.5-flash';

const REQUEST_TIMEOUT_MS =
  30000;


// ======================================================
// GEMINI CLIENT
// ======================================================

let client = null;


function getClient() {

  const apiKey =
    import.meta.env
      .VITE_GEMINI_API_KEY;


  if (!apiKey) {
    return null;
  }


  if (!client) {

    client =
      new GoogleGenAI({
        apiKey
      });

  }


  return client;

}


// ======================================================
// TIMEOUT HELPER
// ======================================================

function withTimeout(
  promise,
  ms
) {

  return Promise.race([

    promise,

    new Promise(
      (_, reject) =>

        setTimeout(

          () =>
            reject(
              new Error(
                'Gemini request timed out'
              )
            ),

          ms

        )
    )

  ]);

}


// ======================================================
// STRUCTURED GEMINI REQUEST
// ======================================================

async function generateStructuredJSON({
  prompt,
  schema,
  systemInstruction
}) {

  const ai =
    getClient();


  if (!ai) {

    throw new Error(
      'Gemini API key not configured'
    );

  }


  const response =
    await withTimeout(

      ai.models.generateContent({

        model:
          MODEL,

        contents:
          prompt,

        config: {

          systemInstruction,

          responseMimeType:
            'application/json',

          responseSchema:
            schema

        }

      }),

      REQUEST_TIMEOUT_MS

    );


  const text =
    response?.text;


  if (!text) {

    throw new Error(
      'Gemini returned an empty response'
    );

  }


  return JSON.parse(text);

}


// ======================================================
// SYSTEM INSTRUCTION
// ======================================================

const BRAND_SYSTEM_INSTRUCTION = `

You are BrandForge AI.

You are an expert:

- Brand strategist
- Brand identity designer
- Website creative director
- UX content strategist
- Business copywriter

Your task is to transform REAL information supplied by
a business owner into ONE coherent brand identity.

The final brand identity will be rendered by a React
application as:

1. A business logo
2. A business website
3. A business card
4. A downloadable brand kit


========================================================
CRITICAL RULE: FACTS VS CREATIVE CONTENT
========================================================

You MUST distinguish between factual business information
and creative marketing/design content.


YOU MAY CREATIVELY GENERATE:

- Marketing headlines
- Hero copy
- Taglines ONLY when the user did not provide one
- Brand personality
- Brand tone
- Brand keywords
- Logo concepts
- Visual direction
- Layout recommendations
- Decorative style recommendations
- Section titles
- Calls to action
- Descriptions of user-provided services
- Descriptions of user-provided menu/product items


YOU MUST NEVER INVENT:

- Products
- Services
- Menu items
- Menu prices
- Packages
- Business addresses
- Locations
- Opening hours
- Phone numbers
- Email addresses
- Owner names
- Owner roles
- Social media links
- Delivery availability
- Reservation availability
- Facilities
- Awards
- Certifications
- Customer counts
- Revenue
- Years in business
- Testimonials
- Partnerships
- Clients
- Ratings
- Factual achievements


If factual information is missing:

Return an empty string or empty array.

DO NOT fill missing facts with plausible information.


========================================================
DESIGN RULES
========================================================

The website must visually represent the BUSINESS TYPE,
TARGET AUDIENCE, and USER'S DESIGN PREFERENCES.

Do NOT create the same generic design direction for
every industry.

Examples:

A traditional South Indian restaurant may use:

- Food-first visual hierarchy
- Warm and welcoming visual direction
- Culturally appropriate geometric or botanical accents
- Menu-focused sections
- Strong restaurant branding

A modern technology company may use:

- Structured grids
- Geometric visuals
- Technical visual language
- Clear product/service hierarchy

A luxury brand may use:

- Strong whitespace
- Editorial typography
- Refined composition
- Restrained decorative elements

These are examples only.

Always adapt to the actual user input.


========================================================
USER CONTROL
========================================================

The user's selected theme has priority.

The user's custom design preference has priority over
your default recommendations.

The user's selected colors have priority.

If the user provides a custom natural-language color
preference, generate appropriate valid HEX colors.

A reference URL may be provided as inspiration metadata.

IMPORTANT:

You cannot assume that you have inspected or visited
the reference URL.

Do not claim to have analyzed the website at that URL.

Use only any design preference explicitly described by
the user.


========================================================
COHERENCE
========================================================

The following must feel like ONE brand:

- Logo
- Website
- Business card
- Colors
- Typography direction
- Brand voice
- Decorative style


========================================================
LOGO
========================================================

Choose ONE logoType:

- monogram
- geometric
- organic
- tech
- premium


Choose ONE logoSymbol:

- initials
- circle
- diamond
- leaf
- spark
- connected-nodes
- abstract
- shield
- wave
- star


Do not claim that a generated logo is:

- Trademarked
- Legally protected
- Globally unique


========================================================
WEBSITE
========================================================

Create a website specification appropriate for the
business.

Possible sections include:

- hero
- about
- services
- menu
- products
- business-details
- contact

Only include sections supported by actual user data.

Do not invent information just to fill a section.


========================================================
OUTPUT
========================================================

Return valid JSON only.

The JSON must exactly match the supplied schema.

`;


// ======================================================
// RESPONSE SCHEMA
// ======================================================

const brandKitSchema = {

  type:
    Type.OBJECT,

  properties: {


    // ==================================================
    // BUSINESS
    // ==================================================

    business: {

      type:
        Type.OBJECT,

      properties: {

        name: {
          type:
            Type.STRING
        },

        industry: {
          type:
            Type.STRING
        },

        description: {
          type:
            Type.STRING
        },

        targetAudience: {
          type:
            Type.STRING
        },

        address: {
          type:
            Type.STRING
        },

        openingHours: {
          type:
            Type.STRING
        },

        additionalDetails: {
          type:
            Type.STRING
        }

      },

      required: [

        'name',

        'industry',

        'description',

        'targetAudience',

        'address',

        'openingHours',

        'additionalDetails'

      ]

    },


    // ==================================================
    // BRAND IDENTITY
    // ==================================================

    identity: {

      type:
        Type.OBJECT,

      properties: {

        tagline: {
          type:
            Type.STRING
        },

        personality: {

          type:
            Type.ARRAY,

          items: {
            type:
              Type.STRING
          }

        },

        tone: {
          type:
            Type.STRING
        },

        keywords: {

          type:
            Type.ARRAY,

          items: {
            type:
              Type.STRING
          }

        }

      },

      required: [

        'tagline',

        'personality',

        'tone',

        'keywords'

      ]

    },


    // ==================================================
    // VISUAL IDENTITY
    // ==================================================

    visualIdentity: {

      type:
        Type.OBJECT,

      properties: {

        theme: {
          type:
            Type.STRING
        },

        designDirection: {
          type:
            Type.STRING
        },

        heroStyle: {
          type:
            Type.STRING
        },

        decorativeStyle: {
          type:
            Type.STRING
        },

        typographyDirection: {
          type:
            Type.STRING
        },

        layoutStyle: {
          type:
            Type.STRING
        },

        logoType: {
          type:
            Type.STRING
        },

        logoSymbol: {
          type:
            Type.STRING
        },

        logoConcept: {
          type:
            Type.STRING
        },

        primaryColor: {
          type:
            Type.STRING
        },

        secondaryColor: {
          type:
            Type.STRING
        },

        accentColor: {
          type:
            Type.STRING
        }

      },

      required: [

        'theme',

        'designDirection',

        'heroStyle',

        'decorativeStyle',

        'typographyDirection',

        'layoutStyle',

        'logoType',

        'logoSymbol',

        'logoConcept',

        'primaryColor',

        'secondaryColor',

        'accentColor'

      ]

    },


    // ==================================================
    // WEBSITE
    // ==================================================

    website: {

      type:
        Type.OBJECT,

      properties: {


        headline: {
          type:
            Type.STRING
        },


        subheadline: {
          type:
            Type.STRING
        },


        aboutTitle: {
          type:
            Type.STRING
        },


        about: {
          type:
            Type.STRING
        },


        servicesTitle: {
          type:
            Type.STRING
        },


        services: {

          type:
            Type.ARRAY,

          items: {

            type:
              Type.OBJECT,

            properties: {

              title: {
                type:
                  Type.STRING
              },

              description: {
                type:
                  Type.STRING
              }

            },

            required: [

              'title',

              'description'

            ]

          }

        },


        menuTitle: {
          type:
            Type.STRING
        },


        menuIntro: {
          type:
            Type.STRING
        },


        cta: {
          type:
            Type.STRING
        },


        ctaType: {
          type:
            Type.STRING
        },


        navigation: {

          type:
            Type.ARRAY,

          items: {
            type:
              Type.STRING
          }

        },


        sectionOrder: {

          type:
            Type.ARRAY,

          items: {
            type:
              Type.STRING
          }

        }

      },

      required: [

        'headline',

        'subheadline',

        'aboutTitle',

        'about',

        'servicesTitle',

        'services',

        'menuTitle',

        'menuIntro',

        'cta',

        'ctaType',

        'navigation',

        'sectionOrder'

      ]

    },


    // ==================================================
    // BUSINESS CARD
    // ==================================================

    businessCard: {

      type:
        Type.OBJECT,

      properties: {

        tagline: {
          type:
            Type.STRING
        },

        ownerName: {
          type:
            Type.STRING
        },

        ownerRole: {
          type:
            Type.STRING
        },

        email: {
          type:
            Type.STRING
        },

        phone: {
          type:
            Type.STRING
        },

        address: {
          type:
            Type.STRING
        }

      },

      required: [

        'tagline',

        'ownerName',

        'ownerRole',

        'email',

        'phone',

        'address'

      ]

    }

  },


  required: [

    'business',

    'identity',

    'visualIdentity',

    'website',

    'businessCard'

  ]

};


// ======================================================
// NORMALIZE SERVICES
// ======================================================

function normalizeServices(
  services
) {

  if (
    Array.isArray(
      services
    )
  ) {

    return services

      .map(
        service =>
          String(
            service || ''
          ).trim()
      )

      .filter(Boolean);

  }


  return String(
    services || ''
  )

    .split(',')

    .map(
      service =>
        service.trim()
    )

    .filter(Boolean);

}


// ======================================================
// FALLBACK BRAND KIT
// ======================================================
//
// This fallback uses ONLY user-provided factual data.
//
// It may provide minimal UI labels but does not invent
// products, prices, addresses, hours, or services.
//

function generateFallbackBrandKit(
  input
) {

  const {

    businessName =
      'Your Business',

    industry = '',

    description = '',

    targetAudience = '',

    services = [],

    tagline = '',

    address = '',

    openingHours = '',

    menuText = '',

    additionalDetails = '',

    brandStyle =
      'modern',

    designPreference = '',

    preferredColors = '',

    ownerName = '',

    ownerRole = '',

    email = '',

    phone = ''

  } = input;


  const safeServices =
    normalizeServices(
      services
    );


  const fallbackTagline =
    tagline ||
    businessName;


  return {

    business: {

      name:
        businessName,

      industry,

      description,

      targetAudience,

      address,

      openingHours,

      additionalDetails

    },


    identity: {

      tagline:
        fallbackTagline,

      personality: [],

      tone: '',

      keywords:
        industry
          ? [industry]
          : []

    },


    visualIdentity: {

      theme:
        brandStyle ||
        'modern',

      designDirection:
        designPreference ||
        '',

      heroStyle: '',

      decorativeStyle: '',

      typographyDirection: '',

      layoutStyle: '',

      logoType:
        'monogram',

      logoSymbol:
        'initials',

      logoConcept:
        `A monogram using the initials of ${businessName}.`,

      primaryColor:
        '#2563EB',

      secondaryColor:
        '#0F172A',

      accentColor:
        '#38BDF8'

    },


    website: {

      headline:
        businessName,

      subheadline:
        description,

      aboutTitle:
        description
          ? 'About Us'
          : '',

      about:
        description,

      servicesTitle:
        safeServices.length
          ? 'What We Offer'
          : '',

      services:

        safeServices.map(
          service => ({

            title:
              service,

            description: ''

          })
        ),

      menuTitle:
        menuText
          ? 'Menu'
          : '',

      menuIntro: '',

      cta:
        email ||
        phone
          ? 'Contact Us'
          : '',

      ctaType:
        email
          ? 'email'
          : phone
            ? 'call'
            : '',

      navigation: [

        'Home',

        description
          ? 'About'
          : '',

        safeServices.length
          ? 'Services'
          : '',

        menuText
          ? 'Menu'
          : '',

        email ||
        phone ||
        address
          ? 'Contact'
          : ''

      ].filter(Boolean),


      sectionOrder: [

        'hero',

        description
          ? 'about'
          : '',

        menuText
          ? 'menu'
          : '',

        safeServices.length
          ? 'services'
          : '',

        address ||
        openingHours
          ? 'business-details'
          : '',

        email ||
        phone ||
        address
          ? 'contact'
          : ''

      ].filter(Boolean)

    },


    businessCard: {

      tagline:
        fallbackTagline,

      ownerName,

      ownerRole,

      email,

      phone,

      address

    }

  };

}


// ======================================================
// MAIN BRAND KIT GENERATION
// ======================================================

export async function generateBrandKit({

  businessName,

  industry,

  description,

  targetAudience,

  services = [],


  // NEW FACTUAL FIELDS

  tagline = '',

  address = '',

  openingHours = '',

  menuText = '',

  menuFileName = '',

  additionalDetails = '',


  // DESIGN INPUT

  brandStyle = '',

  designPreference = '',

  designReference = '',

  preferredColors = '',


  // CONTACT

  ownerName = '',

  ownerRole = '',

  email = '',

  phone = ''

}) {


  const serviceList =
    normalizeServices(
      services
    );


  const input = {

    businessName,

    industry,

    description,

    targetAudience,

    services:
      serviceList,

    tagline,

    address,

    openingHours,

    menuText,

    menuFileName,

    additionalDetails,

    brandStyle,

    designPreference,

    designReference,

    preferredColors,

    ownerName,

    ownerRole,

    email,

    phone

  };


  const fallback =
    () =>
      generateFallbackBrandKit(
        input
      );


  try {


    // ==================================================
    // REQUIRED INPUT VALIDATION
    // ==================================================

    if (
      !businessName?.trim()
    ) {

      throw new Error(
        'Business name is required'
      );

    }


    if (
      !industry?.trim()
    ) {

      throw new Error(
        'Industry is required'
      );

    }


    if (
      !description?.trim()
    ) {

      throw new Error(
        'Business description is required'
      );

    }


    // ==================================================
    // PROMPT
    // ==================================================

    const prompt = `

Create a complete BrandForge AI brand kit using the
information below.


========================================================
FACTUAL BUSINESS INFORMATION
========================================================

BUSINESS NAME:
${businessName}


INDUSTRY:
${industry}


BUSINESS DESCRIPTION:
${description}


TARGET AUDIENCE:
${targetAudience || 'NOT PROVIDED'}


USER-PROVIDED PRODUCTS OR SERVICES:
${
  serviceList.length > 0
    ? serviceList.join('\n')
    : 'NOT PROVIDED'
}


USER-PROVIDED TAGLINE:
${tagline || 'NOT PROVIDED'}


BUSINESS ADDRESS:
${address || 'NOT PROVIDED'}


OPENING HOURS:
${openingHours || 'NOT PROVIDED'}


MENU / PRODUCTS / PRICES / PACKAGES:

${
  menuText ||
  'NOT PROVIDED'
}


UPLOADED MENU / DETAILS FILE NAME:

${
  menuFileName ||
  'NOT PROVIDED'
}


ADDITIONAL FACTUAL BUSINESS DETAILS:

${
  additionalDetails ||
  'NOT PROVIDED'
}


========================================================
CONTACT INFORMATION
========================================================

OWNER / CONTACT NAME:
${ownerName || 'NOT PROVIDED'}


OWNER ROLE:
${ownerRole || 'NOT PROVIDED'}


EMAIL:
${email || 'NOT PROVIDED'}


PHONE:
${phone || 'NOT PROVIDED'}


========================================================
USER DESIGN CHOICES
========================================================

SELECTED BASE THEME:

${
  brandStyle ||
  'No base theme specified'
}


CUSTOM DESIGN PREFERENCE:

${
  designPreference ||
  'No custom design preference provided'
}


REFERENCE WEBSITE URL:

${
  designReference ||
  'No reference URL provided'
}


IMPORTANT:

The reference URL is metadata only.

Do NOT claim that you visited, opened, inspected,
or analyzed the reference website.


COLOR PREFERENCE:

${
  preferredColors ||
  'No color preference provided'
}


========================================================
YOUR TASK
========================================================


1. BRAND IDENTITY

Create a coherent brand identity.

If USER-PROVIDED TAGLINE exists:

Use that exact tagline.

Do not replace it.

Otherwise:

Generate one short, memorable tagline.

Also generate:

- Exactly 3 personality traits
- A brand tone
- 3 to 5 brand keywords


========================================================
2. VISUAL IDENTITY
========================================================

The visual identity must reflect:

- Business industry
- Business description
- Target audience
- Selected base theme
- Custom design preference
- User-selected colors


Create:

- designDirection
- heroStyle
- decorativeStyle
- typographyDirection
- layoutStyle


The website should NOT feel like a generic template.

For example:

If the business is a restaurant, the visual direction
should prioritize food, menu discovery, atmosphere,
location, and contact details when those facts exist.

If the business is technology-focused, the design may
use more structured, technical, geometric, or product-
focused visual language.

If the business is luxury-focused, the design may use
editorial composition, refined spacing, restrained
decoration, and premium typography direction.

These are examples only.

Adapt to the actual business.


========================================================
3. COLORS
========================================================

If explicit user color preferences are supplied:

Respect them.

If natural-language color preferences are supplied:

Return appropriate HEX values.

All three returned colors must be valid HEX values:

primaryColor
secondaryColor
accentColor


========================================================
4. LOGO
========================================================

Choose ONE logoType:

monogram
geometric
organic
tech
premium


Choose ONE logoSymbol:

initials
circle
diamond
leaf
spark
connected-nodes
abstract
shield
wave
star


The logo concept should reflect the business identity.

Do not claim trademark protection or uniqueness.


========================================================
5. WEBSITE HERO
========================================================

Create:

- headline
- subheadline

The brand/business name should remain visually important.

The tagline should be suitable for prominent display
when available.


========================================================
6. ABOUT SECTION
========================================================

Create:

- aboutTitle
- about

Use the supplied business description as the factual
foundation.

You may improve the writing.

Do not add factual claims that were not supplied.


========================================================
7. SERVICES
========================================================

Create service cards ONLY for these user-provided
services:

${
  serviceList.length > 0
    ? serviceList.join('\n')
    : 'NO SERVICES PROVIDED'
}


You may improve wording and descriptions.

You must NOT add new services.

If no services were provided:

Return an empty services array.


========================================================
8. MENU / PRODUCTS
========================================================

The raw menu/product content is:

${
  menuText ||
  'NO MENU OR PRODUCT DATA PROVIDED'
}


If menu/product information exists:

Create an appropriate menuTitle and menuIntro.

Do NOT invent:

- Menu items
- Product names
- Prices
- Categories
- Ingredients

The React application will render the original factual
menu data separately.

If no menu/product information exists:

Return empty strings for menuTitle and menuIntro.


========================================================
9. WEBSITE NAVIGATION
========================================================

Create navigation labels only for sections that have
real content.

Possible labels:

Home
About
Services
Menu
Products
Details
Contact


Return navigation as an array of labels.


========================================================
10. WEBSITE SECTION ORDER
========================================================

Create an appropriate section order for this specific
business.

Allowed section IDs:

hero
about
services
menu
business-details
contact


Only include sections supported by available data.

Always include:

hero


========================================================
11. CALL TO ACTION
========================================================

Create a primary CTA based only on available factual
actions.


Allowed ctaType values:

contact
email
call
menu
none


Examples:

If email exists:
CTA may use email.

If phone exists:
CTA may use call.

If menu exists:
CTA may use menu.

If no actionable information exists:

Return an empty CTA and ctaType "none".


Do NOT invent:

- Booking systems
- Reservation links
- Ordering links
- WhatsApp numbers
- Delivery links


========================================================
12. BUSINESS CARD
========================================================

Use the SAME brand identity and tagline.

Use only the supplied:

- Owner name
- Owner role
- Email
- Phone
- Address

If a field was not supplied:

Return an empty string.


========================================================
FINAL REQUIREMENT
========================================================

The logo direction, website, business card, colors,
brand voice, and visual direction must feel like ONE
consistent brand.

Return JSON matching the provided schema exactly.

`;


    // ==================================================
    // GEMINI CALL
    // ==================================================

    const result =
      await generateStructuredJSON({

        prompt,

        schema:
          brandKitSchema,

        systemInstruction:
          BRAND_SYSTEM_INSTRUCTION

      });


    // ==================================================
    // RESPONSE VALIDATION
    // ==================================================

    if (

      !result?.business ||

      !result?.identity ||

      !result?.visualIdentity ||

      !result?.website ||

      !result?.businessCard

    ) {

      throw new Error(
        'Incomplete Brand Kit response from Gemini'
      );

    }


    // ==================================================
    // FACTUAL DATA SAFETY
    //
    // ALWAYS overwrite factual fields with original
    // user input.
    // ==================================================

    result.business.name =
      businessName;

    result.business.industry =
      industry;

    result.business.description =
      description;

    result.business.targetAudience =
      targetAudience || '';

    result.business.address =
      address || '';

    result.business.openingHours =
      openingHours || '';

    result.business.additionalDetails =
      additionalDetails || '';


    // ==================================================
    // USER TAGLINE HAS PRIORITY
    // ==================================================

    if (
      tagline?.trim()
    ) {

      result.identity.tagline =
        tagline.trim();

      result.businessCard.tagline =
        tagline.trim();

    }


    // ==================================================
    // CONTACT FACTS
    // ==================================================

    result.businessCard.ownerName =
      ownerName || '';

    result.businessCard.ownerRole =
      ownerRole || '';

    result.businessCard.email =
      email || '';

    result.businessCard.phone =
      phone || '';

    result.businessCard.address =
      address || '';


    // ==================================================
    // LIMIT PERSONALITY + KEYWORDS
    // ==================================================

    result.identity.personality =

      Array.isArray(
        result.identity.personality
      )

        ? result.identity.personality
            .slice(0, 3)

        : [];


    result.identity.keywords =

      Array.isArray(
        result.identity.keywords
      )

        ? result.identity.keywords
            .slice(0, 5)

        : [];


    // ==================================================
    // STRICT SERVICE SAFETY
    //
    // We do NOT trust Gemini to define which services
    // exist.
    //
    // Only user-supplied services survive.
    // Gemini descriptions may be matched by position.
    // ==================================================

    const generatedServices =

      Array.isArray(
        result.website.services
      )

        ? result.website.services

        : [];


    result.website.services =

      serviceList.map(
        (
          service,
          index
        ) => ({

          title:
            service,

          description:

            generatedServices[index]
              ?.description || ''

        })
      );


    // ==================================================
    // MENU SAFETY
    // ==================================================

    if (
      !menuText?.trim()
    ) {

      result.website.menuTitle =
        '';

      result.website.menuIntro =
        '';

    }


    // ==================================================
    // NAVIGATION SAFETY
    // ==================================================

    const validNavigation =
      new Set([

        'Home',

        'About',

        'Services',

        'Menu',

        'Products',

        'Details',

        'Contact'

      ]);


    result.website.navigation =

      Array.isArray(
        result.website.navigation
      )

        ? result.website.navigation

            .filter(
              item =>
                validNavigation.has(
                  item
                )
            )

        : [];


    if (

      !result.website.navigation
        .includes('Home')

    ) {

      result.website.navigation
        .unshift('Home');

    }


    // Remove unsupported nav items

    if (
      !description?.trim()
    ) {

      result.website.navigation =

        result.website.navigation
          .filter(
            item =>
              item !==
              'About'
          );

    }


    if (
      serviceList.length === 0
    ) {

      result.website.navigation =

        result.website.navigation
          .filter(
            item =>
              item !==
              'Services'
          );

    }


    if (
      !menuText?.trim()
    ) {

      result.website.navigation =

        result.website.navigation
          .filter(
            item =>
              item !==
                'Menu' &&
              item !==
                'Products'
          );

    }


    if (

      !email &&
      !phone &&
      !address

    ) {

      result.website.navigation =

        result.website.navigation
          .filter(
            item =>
              item !==
              'Contact'
          );

    }


    // ==================================================
    // SECTION ORDER SAFETY
    // ==================================================

    const validSections =
      new Set([

        'hero',

        'about',

        'services',

        'menu',

        'business-details',

        'contact'

      ]);


    result.website.sectionOrder =

      Array.isArray(
        result.website.sectionOrder
      )

        ? result.website.sectionOrder

            .filter(
              section =>
                validSections.has(
                  section
                )
            )

        : [];


    // Always include hero

    if (

      !result.website.sectionOrder
        .includes('hero')

    ) {

      result.website.sectionOrder
        .unshift('hero');

    }


    // Remove unsupported sections

    if (
      !description?.trim()
    ) {

      result.website.sectionOrder =

        result.website.sectionOrder
          .filter(
            section =>
              section !==
              'about'
          );

    }


    if (
      serviceList.length === 0
    ) {

      result.website.sectionOrder =

        result.website.sectionOrder
          .filter(
            section =>
              section !==
              'services'
          );

    }


    if (
      !menuText?.trim()
    ) {

      result.website.sectionOrder =

        result.website.sectionOrder
          .filter(
            section =>
              section !==
              'menu'
          );

    }


    if (

      !address &&
      !openingHours &&
      !additionalDetails

    ) {

      result.website.sectionOrder =

        result.website.sectionOrder
          .filter(
            section =>
              section !==
              'business-details'
          );

    }


    if (

      !email &&
      !phone &&
      !address

    ) {

      result.website.sectionOrder =

        result.website.sectionOrder
          .filter(
            section =>
              section !==
              'contact'
          );

    }


    // ==================================================
    // CTA SAFETY
    // ==================================================

    const validCTA =
      new Set([

        'contact',

        'email',

        'call',

        'menu',

        'none'

      ]);


    if (

      !validCTA.has(
        result.website.ctaType
      )

    ) {

      result.website.ctaType =
        'none';

    }


    if (

      result.website.ctaType ===
        'email' &&
      !email

    ) {

      result.website.ctaType =
        'none';

      result.website.cta =
        '';

    }


    if (

      result.website.ctaType ===
        'call' &&
      !phone

    ) {

      result.website.ctaType =
        'none';

      result.website.cta =
        '';

    }


    if (

      result.website.ctaType ===
        'menu' &&
      !menuText

    ) {

      result.website.ctaType =
        'none';

      result.website.cta =
        '';

    }


    if (

      result.website.ctaType ===
        'contact' &&
      !email &&
      !phone &&
      !address

    ) {

      result.website.ctaType =
        'none';

      result.website.cta =
        '';

    }


    // ==================================================
    // STORE ORIGINAL MENU DATA
    //
    // Gemini never becomes the source of truth.
    // ==================================================

    result.business.menuText =
      menuText || '';

    result.business.menuFileName =
      menuFileName || '';


    // ==================================================
    // STORE DESIGN PREFERENCES
    // ==================================================

    result.visualIdentity
      .userDesignPreference =
        designPreference || '';

    result.visualIdentity
      .designReference =
        designReference || '';


    return result;

  }


  catch (err) {


    if (
      import.meta.env.DEV
    ) {

      console.warn(

        '[BrandForge Gemini] Falling back:',

        err.message

      );

    }


    return fallback();

  }

}


// ======================================================
// SAVE BRAND KIT LOCALLY
// ======================================================

export function saveBrandKit(
  brandKit
) {

  try {

    localStorage.setItem(

      'brandforge_brand_kit',

      JSON.stringify(
        brandKit
      )

    );


    return true;

  }


  catch (error) {

    console.error(

      'Unable to save Brand Kit:',

      error

    );


    return false;

  }

}


// ======================================================
// LOAD SAVED BRAND KIT
// ======================================================

export function loadBrandKit() {

  try {

    const saved =
      localStorage.getItem(
        'brandforge_brand_kit'
      );


    if (!saved) {

      return null;

    }


    return JSON.parse(
      saved
    );

  }


  catch (error) {

    console.error(

      'Unable to load Brand Kit:',

      error

    );


    return null;

  }

}


// ======================================================
// DELETE SAVED BRAND KIT
// ======================================================

export function clearBrandKit() {

  try {

    localStorage.removeItem(
      'brandforge_brand_kit'
    );


    return true;

  }


  catch (error) {

    console.error(

      'Unable to clear Brand Kit:',

      error

    );


    return false;

  }

}