import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

const BUDGET_TIERS = {
  starter: {
    tier: 'starter',
    tierLabel: '🌱 Starter',
    priceRange: 'Under $300',
    deliverables: [
      'Single landing page or static site',
      'Mobile-responsive design',
      'Basic contact form',
      '1 round of revisions',
      'Basic SEO meta tags',
    ],
    timeline: '5–7 business days',
  },
  standard: {
    tier: 'standard',
    tierLabel: '🔵 Standard',
    priceRange: '$300 – $1,000',
    deliverables: [
      'Multi-page website (up to 8 pages)',
      'CMS integration (WordPress or headless)',
      'Contact form with email notifications',
      '2 rounds of revisions',
      'SEO optimization',
      'Performance optimization',
    ],
    timeline: '2–3 weeks',
  },
  professional: {
    tier: 'professional',
    tierLabel: '🟣 Professional',
    priceRange: '$1,000 – $3,000',
    deliverables: [
      'Full custom web application',
      'Database design & integration',
      'User authentication & roles',
      'API development & integrations',
      '3 rounds of revisions',
      'Deployment & hosting setup',
      'Post-launch support (2 weeks)',
    ],
    timeline: '3–6 weeks',
  },
  enterprise: {
    tier: 'enterprise',
    tierLabel: '🚀 Enterprise',
    priceRange: '$3,000+',
    deliverables: [
      'Full SaaS or complex web platform',
      'AI/ML feature integration',
      'Scalable cloud architecture',
      'Custom admin dashboard',
      '4+ rounds of revisions',
      'CI/CD pipeline setup',
      'Ongoing maintenance & support',
      'Team handoff documentation',
    ],
    timeline: 'Varies by scope (typically 6–16 weeks)',
  },
};

function detectBudgetTier(budget: string): keyof typeof BUDGET_TIERS {
  const lower = budget.toLowerCase();
  const num = parseFloat(budget.replace(/[^0-9.]/g, ''));

  if (lower.includes('enterprise') || lower.includes('3000') || num >= 3000) return 'enterprise';
  if (lower.includes('professional') || lower.includes('1000') || lower.includes('2000') || (num >= 1000 && num < 3000)) return 'professional';
  if (lower.includes('standard') || lower.includes('300') || lower.includes('500') || (num >= 300 && num < 1000)) return 'standard';
  return 'starter';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, message, history, budget, projectDescription } = body;

    if (action === 'intent') {
      const MODELS = ["gemini-2.5-flash-lite", "gemini-2.5-flash", "gemini-3.1-flash-lite", "gemini-3-flash"];
      let text = "";
      let success = false;
      let lastError: any = null;

      const historyFormatted = (history || []).map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      for (const modelName of MODELS) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: `You are a warm, friendly AI assistant on Ryan Radityatama's portfolio.
Classify the visitor's intent as "client" (wants to hire Ryan for a project), "recruiter" (wants to hire Ryan as an employee), or "unknown".
Reply naturally and warmly — never mention "classifying" or "detecting".
Return JSON: { "intent": "client"|"recruiter"|"unknown", "reply": "your warm response here" }`,
          });

          const chat = model.startChat({ history: historyFormatted });
          const result = await chat.sendMessage(message);
          text = result.response.text().trim();
          success = true;
          break;
        } catch (err) {
          console.warn(`Qualify intent ${modelName} failed, trying next backup...`, err);
          lastError = err;
        }
      }

      if (!success) {
        throw lastError || new Error("All backup models failed for intent classification");
      }

      // Parse JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json(parsed);
      }

      // Fallback
      return NextResponse.json({
        intent: 'unknown',
        reply: "Thanks for reaching out! Are you looking to hire Ryan for a project, or are you a recruiter with a job opportunity?",
      });
    }

    if (action === 'budget') {
      const tierKey = detectBudgetTier(budget || '');
      const tierData = BUDGET_TIERS[tierKey];

      const MODELS = ["gemini-2.5-flash-lite", "gemini-2.5-flash", "gemini-3.1-flash-lite", "gemini-3-flash"];
      let text = "";
      let success = false;
      let lastError: any = null;

      for (const modelName of MODELS) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: `You are a helpful assistant for Ryan Radityatama. 
Generate 3 specific, relevant scope questions for a ${tierData.tierLabel} web project.
Project description: ${projectDescription || 'not specified yet'}.
Return JSON: { "reply": "warm message about what's included", "scopeQuestions": ["question1", "question2", "question3"] }
Make questions specific to this tier and project type. Be concise and friendly.`,
          });

          const result = await model.generateContent(`Budget: ${budget}. Tier: ${tierData.tierLabel}. ${projectDescription ? `Project: ${projectDescription}` : ''}`);
          text = result.response.text().trim();
          success = true;
          break;
        } catch (err) {
          console.warn(`Qualify budget questions ${modelName} failed, trying next backup...`, err);
          lastError = err;
        }
      }

      if (!success) {
        throw lastError || new Error("All backup models failed for budget classification");
      }

      const jsonMatch = text.match(/\{[\s\S]*\}/);

      let reply = `Great news! At the ${tierData.tierLabel} tier (${tierData.priceRange}), Ryan can absolutely deliver what you need. Let me ask a few quick questions to tailor the proposal.`;
      let scopeQuestions = [
        'Do you have existing content (text, images, logo) ready?',
        'Do you have a preferred color scheme or design references?',
        'When would you like the project to be delivered?',
      ];

      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.reply) reply = parsed.reply;
          if (parsed.scopeQuestions) scopeQuestions = parsed.scopeQuestions;
        } catch {}
      }

      return NextResponse.json({
        ...tierData,
        reply,
        scopeQuestions,
      });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    console.error('Qualify agent error:', error);
    return NextResponse.json({ error: error.message || 'Agent error' }, { status: 500 });
  }
}
