import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { RYAN_PROFILE_DATA } from '@/lib/profile-data';
import { supabase } from '@/lib/supabase';
import { sendLeadEmailNotification } from '@/lib/email';
import { researchAgent, estimatorAgent, schedulerAgent } from '@/lib/agents/orchestrator';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

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
  "closingMessage": "Warm professional closing paragraph from Ryan, mentioning the booking link: ${scheduleInfo.bookingLink}",
  "emailDraft": "Full follow-up email Ryan would send to the client. Address the email to the client using their name (visitorName) if provided, otherwise 'Team'. The email MUST be signed off as coming from 'Ryan Radityatama' (NEVER use placeholders like '[Your Name]', '[Name]', '[Nama Anda]', or '[Recruiter Liaison]'). Include Ryan's email (ryradit@gmail.com) and portfolio website (https://ryanraditya.com)."
}

Be specific, reference the matching projects exactly. Make it feel highly tailored.`;

    const MODELS = ["gemini-2.5-flash-lite", "gemini-2.5-flash", "gemini-3.1-flash-lite", "gemini-3-flash"];
    let text = "";
    let success = false;
    let lastError: any = null;

    for (const modelName of MODELS) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 4096,
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
      const proposal = JSON.parse(jsonMatch[0]);

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
          language: language || 'English',
        });

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
