// Real AI layer for BrandForge AI, backed by Gemini 2.5 Flash.
//
// Design principles (per hallucination-fix pass):
// - ONE combined request per interview completion (bio + headlines + projects).
//   No per-field calls, no calls on theme/animation/UI changes.
// - Portfolio scoring is NEVER sent to Gemini — it's pure local JS
//   (see src/utils/aiSimulator.js), since it's a deterministic function
//   of fields the app already has.
// - Every prompt instructs Gemini to act as a fact-grounded editor: it may
//   rewrite/organize/polish what the user provided, but must never invent
//   projects, employers, technologies, metrics, or credentials. It must
//   also detect the person's actual profession and never default to a
//   software-engineering framing for a non-technical profile.
//
// Fallback contract: on missing API key, network failure, invalid/malformed
// JSON, or any thrown error, falls back to aiSimulator.js — which has been
// updated to be equally fact-grounded (no fabricated filler projects).

import { GoogleGenAI, Type } from '@google/genai';
import {
  generatePolishedBio as generatePolishedBioFallback,
  generateHeadlines as generateHeadlinesFallback,
  improveProjects as improveProjectsFallback
} from '../utils/aiSimulator';

const MODEL = 'gemini-2.5-flash';
const REQUEST_TIMEOUT_MS = 20000;

let client = null;
function getClient() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!client) {
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Gemini request timed out')), ms)
    )
  ]);
}

async function generateStructuredJSON({ prompt, schema, systemInstruction }) {
  const ai = getClient();
  if (!ai) {
    throw new Error('Gemini API key not configured');
  }

  const response = await withTimeout(
    ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: schema
      }
    }),
    REQUEST_TIMEOUT_MS
  );

  const text = response?.text;
  if (!text) {
    throw new Error('Gemini returned an empty response');
  }

  return JSON.parse(text);
}

// Shared "editor, not storyteller" system instruction, used for the single
// combined generation call. This is the primary anti-hallucination guardrail.
const EDITOR_SYSTEM_INSTRUCTION = `You are a professional portfolio editor.

You ONLY improve information the user actually provided. You rewrite, organize,
summarize, and polish — you NEVER invent facts.

You must first infer the person's actual profession from their role, skills,
and bio (e.g. Software Engineer, Doctor, Teacher, Singer, Chef, Photographer,
Student, Designer, Lawyer, Researcher, Entrepreneur — or any other profession).
Generate content that is appropriate ONLY for that profession. Never default
to software-engineering language, tools, or metrics unless the person's own
input is actually about software engineering.

You must NEVER invent, under any circumstances:
- Projects, companies, employers, or clients
- Technologies, programming languages, or tools not mentioned by the user
- Awards, certifications, education, or work experience
- Achievements, metrics, or statistics
- Years of experience
- GitHub repositories, live demo links, or portfolio URLs

If the user did not provide project information, return an empty "projects"
array. Do not fill it with plausible-sounding filler. An empty array is the
correct, honest answer in that case.

Return valid JSON only, matching the provided schema exactly.`;

const portfolioContentSchema = {
  type: Type.OBJECT,
  properties: {
    bios: {
      type: Type.OBJECT,
      properties: {
        professional: { type: Type.STRING },
        creative: { type: Type.STRING },
        technical: { type: Type.STRING }
      },
      required: ['professional', 'creative', 'technical']
    },
    headlines: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    projects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          longDescription: { type: Type.STRING },
          tech: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
          metrics: { type: Type.STRING }
        },
        required: ['id', 'title', 'description', 'longDescription', 'tech', 'improvements', 'metrics']
      }
    }
  },
  required: ['bios', 'headlines', 'projects']
};

/**
 * Single combined generation call — replaces 3 separate Gemini requests.
 * Called exactly once, after the interview completes.
 *
 * @param {object} profile
 * @param {string} profile.name
 * @param {string} profile.role
 * @param {string} profile.bio - user's own one-line self-description
 * @param {string[]} profile.skills
 * @param {string} profile.projectsText - raw project description, if the
 *   user provided one; empty string if not.
 * @returns {Promise<{bios: object, headlines: string[], projects: object[]}>}
 */
export async function generatePortfolioContent({ name, role, bio, skills = [], projectsText = '' }) {
  const fallback = () => ({
    bios: generatePolishedBioFallback(name, role, bio, skills),
    headlines: generateHeadlinesFallback(role, skills),
    projects: improveProjectsFallback(projectsText, skills)
  });

  try {
    const skillsList = skills.length > 0 ? skills.join(', ') : 'Not specified';
    const hasProjectInput = projectsText && projectsText.trim().length >= 5;

    const prompt = `Here is the information a person provided about themselves for a personal portfolio website. Use ONLY this information.

Name: ${name || 'Not provided'}
Role: ${role || 'Not provided'}
Skills: ${skillsList}
Their own self-description: "${bio || 'Not provided'}"
Project description they provided: ${hasProjectInput ? `"${projectsText.trim()}"` : 'None provided — they did not describe any project.'}

TASK 1 — Bios: Write three tonally distinct bio paragraphs (3-4 sentences each), all grounded strictly in the information above:
- "professional": polished, confident.
- "creative": expressive, personality-forward.
- "technical" (or field-appropriate equivalent, e.g. "clinical" for a doctor, "pedagogical" for a teacher): precise, competency-focused, using language appropriate to their actual profession.
Do not invent employers, credentials, or metrics not implied by the input above.

TASK 2 — Headlines: Write exactly 4 short, distinct hero headlines (each under 12 words), each taking a different angle, grounded only in their role/skills/bio. No invented expertise.

TASK 3 — Projects: ${hasProjectInput
      ? `The person described one project. Rewrite it into a single polished project card — improve grammar, structure, and clarity, but do not add technologies, metrics, or outcomes they did not mention. Return exactly one project in the "projects" array.`
      : `The person did NOT describe any project. Return an empty "projects" array. Do not invent one.`}`;

    const result = await generateStructuredJSON({
      prompt,
      schema: portfolioContentSchema,
      systemInstruction: EDITOR_SYSTEM_INSTRUCTION
    });

    if (!result.bios?.professional || !Array.isArray(result.headlines) || result.headlines.length === 0) {
      throw new Error('Incomplete portfolio content response from Gemini');
    }

    // Extra safety net: if the user gave no project input, discard anything
    // Gemini returned in "projects" regardless — never trust invented content
    // even if the model ignored the instruction.
    const projects = hasProjectInput && Array.isArray(result.projects) ? result.projects.slice(0, 1) : [];

    return {
      bios: result.bios,
      headlines: result.headlines.slice(0, 4),
      projects
    };
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn('[gemini] generatePortfolioContent falling back to aiSimulator:', err.message);
    }
    return fallback();
  }
}