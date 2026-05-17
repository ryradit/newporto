import { supabase } from '@/lib/supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export interface MatchProject {
  name: string;
  relevance: string;
}

export interface PhaseEstimate {
  phase: string;
  percentage: number;
  hours: number;
  deliverables: string[];
}

/**
 * 🔍 SUB-AGENT A: Portfolio Research Agent
 * Fetches real portfolio projects from Supabase and ranks the top matching ones.
 */
export async function researchAgent(query: string, language: string = 'en'): Promise<MatchProject[]> {
  try {
    // 1. Fetch live projects from Supabase database
    const { data: dbProjects, error } = await supabase
      .from('portfolio_projects')
      .select('title, description, tags')
      .eq('language', language === 'zh' ? 'zh' : language === 'id' ? 'id' : 'en');

    if (error || !dbProjects || dbProjects.length === 0) {
      console.warn("Research agent: Failed to fetch projects or empty DB, using fallback.");
      return [
        { name: "Radityatama AI Agent Hub", relevance: "Demonstrates full-stack Next.js and high-speed Gemini integration, which aligns perfectly with your requirements." },
        { name: "Computer Vision Face Recognition", relevance: "Showcases deep AI/ML capabilities, perfect for complex intelligent system components." }
      ];
    }

    // 2. Feed them into Gemini to select the top 2-3 most relevant ones
    const projectsListStr = dbProjects
      .map((p, idx) => `[ID ${idx}]: "${p.title}"\nDescription: ${p.description}\nTags: ${p.tags ? p.tags.join(', ') : 'None'}`)
      .join('\n\n');

    const prompt = `You are a Senior Technical Researcher Agent.
Your task is to analyze a client's project description / recruiter's requirements and select the top 2-3 most relevant projects from Ryan Radityatama's actual portfolio.

User Query/Requirements: "${query}"

Ryan's Actual Portfolio Projects:
${projectsListStr}

Instructions:
- Select the top 2 or 3 projects that match the user query best. If matches are weak, select the best generic full-stack/AI ones.
- For each selected project, write a 1-sentence "relevance" explanation showing exactly why that project's tech stack or execution aligns with the user's specific request.
- Keep the explanations brief, professional, and convincing.

Return a JSON array with this exact structure:
[
  {
    "name": "Project Title",
    "relevance": "Specific reasons why this project is highly relevant to their requirements"
  }
]

Ensure the output is clean JSON. Do not include markdown wraps or anything else outside the JSON array.`;

    const MODELS = ["gemini-2.5-flash-lite", "gemini-2.5-flash", "gemini-3.1-flash-lite", "gemini-3-flash"];
    let text = "";
    let success = false;

    for (const modelName of MODELS) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: { temperature: 0.2, maxOutputTokens: 1024 },
        });
        const result = await model.generateContent(prompt);
        text = result.response.text().trim();
        success = true;
        break;
      } catch (err) {
        console.warn(`Research sub-agent ${modelName} failed, trying next...`, err);
      }
    }

    if (success) {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }
  } catch (err) {
    console.error("Research Agent error:", err);
  }

  // Safe fallback matching
  return [
    { name: "Radityatama AI Agent Hub", relevance: "Demonstrates full-stack Next.js and high-speed Gemini integration, which aligns perfectly with your requirements." },
    { name: "Computer Vision Face Recognition", relevance: "Showcases deep AI/ML capabilities, perfect for complex intelligent system components." }
  ];
}

/**
 * 💰 SUB-AGENT B: Financial Estimator Agent
 * Calculates dynamic phase breakdowns, hours, and percentage scopes.
 */
export async function estimatorAgent(
  tier: string,
  priceRange: string,
  scopeAnswers: { question: string; answer: string }[]
): Promise<PhaseEstimate[]> {
  try {
    const scopeStr = scopeAnswers
      .map(s => `Q: ${s.question}\nA: ${s.answer}`)
      .join('\n');

    // Estimate hours based on tier
    const isEnterprise = tier.toLowerCase().includes('enterprise') || tier.toLowerCase().includes('complex');
    const isProfessional = tier.toLowerCase().includes('pro') || tier.toLowerCase().includes('mid');
    const totalHours = isEnterprise ? 240 : isProfessional ? 120 : 60;

    const prompt = `You are a Senior Project Estimator & Solution Architect.
Your task is to breakdown a project's timeline and scope into 4 distinct phases:
1. Architecture & Design
2. Core Development (Frontend/Backend)
3. AI Integration & Testing
4. Deployment & Launch

Project Details:
- Tier: ${tier} (${priceRange})
- Target Development Hours: ${totalHours} hours
- Scope Details:
${scopeStr || 'No details provided'}

Determine the percentage and hours distribution across the 4 phases. Ensure the total hours sum up to precisely ${totalHours} and the total percentage sums up to precisely 100.
List 2 specific, concrete deliverables for each phase based on the scope details provided.

Return a JSON array with this exact structure:
[
  {
    "phase": "Architecture & Design",
    "percentage": 15,
    "hours": 18,
    "deliverables": ["Interactive UI Mockups", "Database Schema Layout"]
  }
]

Ensure the output is clean JSON. Do not include markdown wraps or anything else outside the JSON array.`;

    const MODELS = ["gemini-2.5-flash-lite", "gemini-2.5-flash", "gemini-3.1-flash-lite", "gemini-3-flash"];
    let text = "";
    let success = false;

    for (const modelName of MODELS) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: { temperature: 0.2, maxOutputTokens: 1024 },
        });
        const result = await model.generateContent(prompt);
        text = result.response.text().trim();
        success = true;
        break;
      } catch (err) {
        console.warn(`Estimator sub-agent ${modelName} failed, trying next...`, err);
      }
    }

    if (success) {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }
  } catch (err) {
    console.error("Estimator Agent error:", err);
  }

  // Safe fallback distribution
  return [
    { phase: "Architecture & Design", percentage: 15, hours: 15, deliverables: ["System Architecture Diagram", "Technical Specifications Doc"] },
    { phase: "Core Development", percentage: 50, hours: 50, deliverables: ["Frontend Components", "Backend APIs & Database Integrations"] },
    { phase: "AI Integration & Testing", percentage: 25, hours: 25, deliverables: ["Gemini LLM Orchestration", "Unit & System Integration Tests"] },
    { phase: "Deployment & Launch", percentage: 10, hours: 10, deliverables: ["CI/CD Pipeline Setup", "Vercel / Supabase Production Deploy"] }
  ];
}

/**
 * 📅 SUB-AGENT C: Interview Scheduler Agent
 * Generates dynamic meeting parameters and convenient booking availability.
 * Connects directly to Google Calendar API using standard fetch query to parse live free slots.
 */
export async function schedulerAgent(): Promise<{ bookingLink: string; flexibleSlots: string[] }> {
  const fallbackLink = process.env.GOOGLE_CALENDAR_BOOKING_LINK || "propose-time";
  const fallbackSlots = [
    "Mondays: 2:00 PM - 5:00 PM WIB (Jakarta Time)",
    "Wednesdays: 10:00 AM - 1:00 PM WIB (Jakarta Time)",
    "Thursdays: 3:00 PM - 6:00 PM WIB (Jakarta Time)"
  ];

  const apiKey = process.env.GOOGLE_CALENDAR_API_KEY;
  const calendarId = process.env.GOOGLE_CALENDAR_ID || "ryradit@gmail.com";

  if (!apiKey) {
    console.warn("Google Calendar API key not configured, using fallback slots.");
    return { bookingLink: fallbackLink, flexibleSlots: fallbackSlots };
  }

  try {
    const timeMin = new Date().toISOString();
    const timeMax = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const endpoint = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${apiKey}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;
    const mockReferer = process.env.GOOGLE_CALENDAR_REFERER || "https://ryradit.my.id/";
    const res = await fetch(endpoint, {
      headers: {
        "Referer": mockReferer
      }
    });
    if (!res.ok) {
      if (res.status === 403 || res.status === 404) {
        console.warn(`[Google Calendar API Info] Calendar query returned status ${res.status}.
This usually means your Google Calendar is private or cannot be accessed without OAuth. 
To resolve this using an API Key:
1. Go to Google Calendar > Settings > Settings for my calendars > Access permissions.
2. Check "Make available to public" and choose "See only free/busy (hide details)" so your events remain secure but the API can check your availability.
Using graceful default fallback list.`);
      }
      throw new Error(`Google Calendar API responded with status ${res.status}`);
    }

    const data = await res.json();
    const events: any[] = data.items || [];

    // Parse busy ranges
    const busyRanges = events.map(event => {
      const start = event.start?.dateTime ? new Date(event.start.dateTime) : (event.start?.date ? new Date(event.start.date + "T00:00:00Z") : null);
      const end = event.end?.dateTime ? new Date(event.end.dateTime) : (event.end?.date ? new Date(event.end.date + "T23:59:59Z") : null);
      return { start, end };
    }).filter(r => r.start !== null && r.end !== null) as { start: Date; end: Date }[];

    // Calculate free slots for the next 7 days (Monday - Friday)
    const freeSlots: string[] = [];
    const now = new Date();

    // Standard hourly slots in WIB (Jakarta Time is UTC+7)
    // Map standard slot hours to their UTC offsets
    const slotsConfig = [
      { wibHour: 9, utcHour: 2 },
      { wibHour: 10, utcHour: 3 },
      { wibHour: 11, utcHour: 4 },
      { wibHour: 13, utcHour: 6 }, // 13:00 WIB (1:00 PM) is 06:00 UTC
      { wibHour: 14, utcHour: 7 },
      { wibHour: 15, utcHour: 8 },
      { wibHour: 16, utcHour: 9 }
    ];

    for (let dayOffset = 1; dayOffset <= 7; dayOffset++) {
      const targetDate = new Date(Date.now() + dayOffset * 24 * 60 * 60 * 1000);
      const dayOfWeek = targetDate.getUTCDay();

      // Skip Saturdays (6) and Sundays (0)
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;

      for (const slot of slotsConfig) {
        // Construct standard slot start & end in UTC
        const slotStart = new Date(Date.UTC(
          targetDate.getUTCFullYear(),
          targetDate.getUTCMonth(),
          targetDate.getUTCDate(),
          slot.utcHour,
          0,
          0,
          0
        ));

        const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000);

        // Ensure slot is in the future
        if (slotStart.getTime() <= now.getTime()) continue;

        // Check if slot overlaps with any busy range
        const isOverlapping = busyRanges.some(busy => {
          return busy.start.getTime() < slotEnd.getTime() && busy.end.getTime() > slotStart.getTime();
        });

        if (!isOverlapping) {
          const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric' };
          const dateStr = slotStart.toLocaleDateString('en-US', options);
          const hour12 = slot.wibHour > 12 ? slot.wibHour - 12 : slot.wibHour;
          const ampm = slot.wibHour >= 12 ? 'PM' : 'AM';
          freeSlots.push(`${dateStr} at ${hour12}:00 ${ampm} WIB (Jakarta Time)`);
        }

        // Limit to top 5 available slots to keep it clean
        if (freeSlots.length >= 5) break;
      }
      if (freeSlots.length >= 5) break;
    }

    if (freeSlots.length > 0) {
      return {
        bookingLink: process.env.GOOGLE_CALENDAR_BOOKING_LINK || `https://calendar.google.com/calendar/u/0/r?cid=${encodeURIComponent(calendarId)}`,
        flexibleSlots: freeSlots
      };
    }
  } catch (err) {
    console.error("Failed to query live Google Calendar API:", err);
  }

  return { bookingLink: fallbackLink, flexibleSlots: fallbackSlots };
}
