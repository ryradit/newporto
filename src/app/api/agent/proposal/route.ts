import { GEMINI_MODELS } from '@/lib/gemini-models';
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { RYAN_PROFILE_DATA } from '@/lib/profile-data';
import { supabase } from '@/lib/supabase';
import { sendLeadEmailNotification } from '@/lib/email';
import { researchAgent, estimatorAgent, schedulerAgent } from '@/lib/agents/orchestrator';

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''
);

const asString = (v: unknown, fallback = ''): string =>
  typeof v === 'string' && v.trim() ? v.trim() : fallback;
const asStringArray = (v: unknown): string[] =>
  Array.isArray(v) ? v.map((x) => asString(x)).filter(Boolean) : [];

/** Guarantees the shape the UI relies on, whatever the model returned. */
function normalizeProposal(raw: any, ctx: { tierLabel: string; priceRange: string; timeline: string; visitorName: string }) {
  const projects = Array.isArray(raw?.relevantProjects)
    ? raw.relevantProjects
        .map((p: any) => ({ name: asString(p?.name), relevance: asString(p?.relevance) }))
        .filter((p: any) => p.name)
    : [];

  const phasedOptions = Array.isArray(raw?.budgetConsideration?.phasedOptions)
    ? raw.budgetConsideration.phasedOptions.map((po: any) => ({
        phase: asString(po?.phase, "Phase 1"),
        scope: asString(po?.scope, "Core MVP Delivery"),
        cost: asString(po?.cost, "Flexible"),
        timeline: asString(po?.timeline, ctx.timeline),
      }))
    : [
        {
          phase: "Phase 1 (Core MVP)",
          scope: "Essential features and high-impact deliverables to launch quickly",
          cost: `~60-70% of ${ctx.priceRange || 'tier estimate'}`,
          timeline: "Fast-tracked initial delivery",
        },
        {
          phase: "Phase 2 (Growth & Add-ons)",
          scope: "Advanced features, additional integrations, and ongoing optimization",
          cost: "Remaining milestone balance",
          timeline: "Iterative roll-out",
        },
      ];

  const flexibleTerms = asStringArray(raw?.budgetConsideration?.flexibleTerms);
  const defaultTerms = [
    "Milestone payments (e.g. 50% kick-off / 50% upon final sign-off)",
    "Modular scope: add or remove features to hit your exact budget target",
    "Direct consultation with Ryan to finalize terms before commitment",
  ];

  return {
    proposalTitle: asString(raw?.proposalTitle, `${ctx.tierLabel} Project Proposal`),
    executiveSummary: asString(raw?.executiveSummary),
    whyRyan: asString(raw?.whyRyan),
    includedFeatures: asStringArray(raw?.includedFeatures),
    timeline: asString(raw?.timeline, ctx.timeline),
    estimatedCost: asString(raw?.estimatedCost, ctx.priceRange),
    nextSteps: asStringArray(raw?.nextSteps),
    relevantProjects: projects,
    budgetConsideration: {
      summary: asString(
        raw?.budgetConsideration?.summary,
        "Ryan is committed to value-driven development and offers flexible milestone terms and scope prioritization to fit your budget."
      ),
      scopeTradeOff: asString(
        raw?.budgetConsideration?.scopeTradeOff,
        "If you need to optimize your budget, we can prioritize the core MVP deliverables first and roll out secondary features in subsequent phases."
      ),
      phasedOptions,
      flexibleTerms: flexibleTerms.length > 0 ? flexibleTerms : defaultTerms,
    },
    closingMessage: asString(raw?.closingMessage),
    emailDraft: asString(raw?.emailDraft)
      // Never leak template placeholders into a client-facing email
      .replace(/\[(Your Name|Name|Nama Anda|Recruiter Liaison)\]/gi, 'Ryan Radityatama'),
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      visitorName,
      visitorCompany,
      tier,
      tierLabel,
      priceRange,
      deliverables,
      timeline,
      projectDescription,
      scopeAnswers,
      language,
    } = body;

    if (!tierLabel || !projectDescription || String(projectDescription).trim().length < 5) {
      return NextResponse.json({ error: 'Missing project description or tier' }, { status: 400 });
    }
    const outputLanguage = typeof language === 'string' && language.trim() ? language.trim().slice(0, 40) : 'English';

    const scopeText = (scopeAnswers || [])
      .map((s: { question: string; answer: string }) => `Q: ${s.question}\nA: ${s.answer}`)
      .join('\n\n');

    const deliverablesText = (deliverables || []).map((d: string) => `- ${d}`).join('\n');

    // Run specialized sub-agents in parallel
    const [matchedProjects, phaseEstimates, scheduleInfo] = await Promise.all([
      researchAgent(projectDescription || '', language || 'en'),
      estimatorAgent(tierLabel || '', priceRange || '', scopeAnswers || []),
      schedulerAgent()
    ]);

    const prompt = `You are a professional proposal writer for Ryan Radityatama.

LANGUAGE: Write EVERY text value of the JSON in natural, fluent ${outputLanguage}. Keep JSON keys, project names, technology names and email addresses/URLs unchanged.

RULES:
- Only claim skills and projects that appear in Ryan's profile or the verified sub-agent inputs. Never invent clients, metrics or credentials.
- estimatedCost MUST fall inside the client's tier range (${priceRange}) and be consistent with the phase estimates.
- timeline MUST be consistent with the tier timeline (${timeline}) and the phase estimates.
- includedFeatures: 5-8 concrete items tailored to the client's answers, not generic filler.
- nextSteps: exactly 3 actionable steps; the first should be booking the consultation.
- Be warm and professional, concise, no hype or filler.

Ryan's Profile & Background:
${RYAN_PROFILE_DATA}

Generate a detailed, compelling project proposal for this client incorporating the verified sub-agent inputs below:

Client: ${visitorName || 'Valued Client'}${visitorCompany ? ` from ${visitorCompany}` : ''}
Service Tier: ${tierLabel} (${priceRange})
Project Description: ${projectDescription || 'A web development project'}
Timeline: ${timeline}
Standard Deliverables for this tier:
${deliverablesText}

Client's Scope Answers:
${scopeText || 'No additional scope details provided'}

=======================================================
VERIFIED SUB-AGENT INPUTS (YOU MUST INCORPORATE THESE EXACTLY):

1. Portfolio Matching (Source: Research Agent):
Use these real portfolio projects and relevance explanations in your response:
${JSON.stringify(matchedProjects, null, 2)}

2. Technical Phase Estimates & Hours (Source: Pricing Agent):
Incorporate this cost and time phase breakdown in your roadmap:
${JSON.stringify(phaseEstimates, null, 2)}

3. Consultation Scheduling (Source: Scheduler Agent):
Ryan's calendar booking link is: "${scheduleInfo.bookingLink}"
Offer these flexible slots:
${scheduleInfo.flexibleSlots.join('\n')}
=======================================================

Return a JSON object with these exact fields:
{
  "proposalTitle": "Specific exciting title for this proposal",
  "executiveSummary": "2-3 sentences summarizing the project and Ryan's approach",
  "whyRyan": "2-3 sentences matching Ryan's specific skills to their specific needs",
  "includedFeatures": ["feature1", "feature2", "feature3", "feature4", "feature5"],
  "timeline": "Specific timeline for this project",
  "estimatedCost": "Specific cost within their tier range",
  "nextSteps": ["step1", "step2", "step3"],
  "relevantProjects": [
    {"name": "Project Name", "relevance": "Why this project is relevant to their needs"}
  ],
  "budgetConsideration": {
    "summary": "1-2 sentences explaining how Ryan accommodates budget flexibility via phasing and scope prioritization",
    "scopeTradeOff": "Concrete advice on which core deliverables to prioritize first if the client needs to lower upfront investment",
    "phasedOptions": [
      {
        "phase": "Phase 1: Core MVP",
        "scope": "Essential deliverables to launch fast",
        "cost": "Phase 1 cost estimate",
        "timeline": "Phase 1 timeline"
      },
      {
        "phase": "Phase 2: Scale & Enhancement",
        "scope": "Advanced features, automations, and optimizations",
        "cost": "Phase 2 cost estimate",
        "timeline": "Phase 2 timeline"
      }
    ],
    "flexibleTerms": [
      "Milestone-based payments (e.g. 50% start / 50% launch)",
      "Scope modularity: add/remove features to meet your exact budget target",
      "Direct consultation with Ryan to finalize terms before commitment"
    ]
  },
  "closingMessage": "Warm professional closing paragraph from Ryan, mentioning the booking link: ${scheduleInfo.bookingLink}",
  "emailDraft": "Full follow-up email Ryan would send to the client. Address the email to the client using their name (visitorName) if provided, otherwise 'Team'. The email MUST be signed off as coming from 'Ryan Radityatama' (NEVER use placeholders like '[Your Name]', '[Name]', '[Nama Anda]', or '[Recruiter Liaison]'). Include Ryan's email (ryradit@gmail.com) and portfolio website (https://ryanraditya.com)."
}

Be specific, reference the matching projects exactly. Make it feel highly tailored.`;

    const MODELS = GEMINI_MODELS;
    let text = "";
    let success = false;
    let lastError: any = null;

    for (const modelName of MODELS) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 4096,
            responseMimeType: 'application/json',
          },
        });

        const result = await model.generateContent(prompt);
        text = result.response.text().trim();
        success = true;
        break;
      } catch (err) {
        console.warn(`Proposal agent ${modelName} failed, trying next backup...`, err);
        lastError = err;
      }
    }

    if (!success) {
      throw lastError || new Error("All backup models failed for proposal generation");
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const proposal = normalizeProposal(JSON.parse(jsonMatch[0]), {
        tierLabel: tierLabel || 'Web',
        priceRange: priceRange || '',
        timeline: timeline || '',
        visitorName: visitorName || '',
      });
      if (!proposal.executiveSummary || proposal.includedFeatures.length === 0) {
        throw new Error('AI returned an incomplete proposal');
      }

      // Save proposal response to Supabase leads table gracefully
      try {
        await supabase.from('agent_leads').insert({
          visitor_name: visitorName || 'Valued Client',
          visitor_company: visitorCompany || 'Not specified',
          intent: 'client',
          selected_budget: priceRange || 'Not specified',
          project_description: projectDescription || 'No description provided',
          scope_answers: scopeAnswers || [],
          proposal_data: proposal,
          language: outputLanguage,
        });
      } catch (err) {
        console.warn("Could not save client lead to agent_leads Supabase table:", err);
      }

      // Email notification is independent of the DB save
      try {

        // Send email notification
        const scopeSummary = (scopeAnswers || [])
          .map((s: { question: string; answer: string }) => `• ${s.question}\n  → ${s.answer}`)
          .join('\n\n');

        await sendLeadEmailNotification({
          visitorName: visitorName || 'Valued Client',
          visitorCompany: visitorCompany || 'Not specified',
          intent: 'client',
          details: `Tier: ${tierLabel || 'Not specified'} (${priceRange || 'Not specified'})\nLanguage preferred: ${language || 'English'}\n\nProject Description:\n${projectDescription || 'No description provided'}\n\nScope Answers:\n${scopeSummary}`,
          summary: `Proposal Title: ${proposal.proposalTitle}\n\nExecutive Summary:\n${proposal.executiveSummary}\n\nWhy Ryan:\n${proposal.whyRyan}\n\nTimeline:\n${proposal.timeline}\n\nEstimated Cost:\n${proposal.estimatedCost}`,
        });
      } catch (err) {
        console.warn("Could not save client lead to agent_leads Supabase table (please ensure agent_leads table exists in Supabase):", err);
      }

      return NextResponse.json({ proposal });
    }

    throw new Error('Failed to parse proposal JSON from AI response');
  } catch (error: any) {
    console.error('Proposal agent error:', error);
    return NextResponse.json({ error: error.message || 'Proposal generation failed' }, { status: 500 });
  }
}
