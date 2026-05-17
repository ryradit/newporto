import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { RYAN_PROFILE_DATA } from '@/lib/profile-data';

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
    } = body;

    const scopeText = (scopeAnswers || [])
      .map((s: { question: string; answer: string }) => `Q: ${s.question}\nA: ${s.answer}`)
      .join('\n\n');

    const deliverablesText = (deliverables || []).map((d: string) => `- ${d}`).join('\n');

    const prompt = `You are a professional proposal writer for Ryan Radityatama.

Ryan's Profile & Background:
${RYAN_PROFILE_DATA}

Generate a detailed, compelling project proposal for this client.

Client: ${visitorName || 'Valued Client'}${visitorCompany ? ` from ${visitorCompany}` : ''}
Service Tier: ${tierLabel} (${priceRange})
Project Description: ${projectDescription || 'A web development project'}
Timeline: ${timeline}
Standard Deliverables for this tier:
${deliverablesText}

Client's Scope Answers:
${scopeText || 'No additional scope details provided'}

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
    {"name": "Project Name", "relevance": "Why this project is relevant to their needs"},
    {"name": "Project Name 2", "relevance": "Why this is relevant"}
  ],
  "closingMessage": "Warm professional closing paragraph from Ryan",
  "emailDraft": "Full follow-up email Ryan would send to the client"
}

Be specific, reference actual skills and projects from Ryan's profile. Make it feel personalized, not generic.`;

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
      return NextResponse.json({ proposal });
    }

    throw new Error('Failed to parse proposal JSON from AI response');
  } catch (error: any) {
    console.error('Proposal agent error:', error);
    return NextResponse.json({ error: error.message || 'Proposal generation failed' }, { status: 500 });
  }
}
