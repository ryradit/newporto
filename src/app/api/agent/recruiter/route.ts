import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { RYAN_PROFILE_DATA } from '@/lib/profile-data';
import { supabase } from '@/lib/supabase';
import { sendLeadEmailNotification } from '@/lib/email';
import { researchAgent, schedulerAgent } from '@/lib/agents/orchestrator';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

// Ryan's minimum compensation expectations
const RYAN_COMPENSATION = `
Ryan's Minimum Compensation Requirements:
- Indonesia (IDR Full-Time / Monthly): Rp 15,000,000 per month minimum
- Indonesia (IDR Part-Time / Hourly): Rp 100,000 per hour minimum
- International (USD Salary): $80,000 per year minimum (annualized)
- International (USD Hourly): $40 per hour minimum
- Actual rate may be higher depending on job responsibilities, scope of work, and required expertise.
- Ryan is open to negotiation above these minimums based on role complexity and company size.
`;

const CONTRACT_TYPES = {
  freelance: {
    type: 'freelance',
    label: '🛠️ Freelance Contract',
    description: 'Project-based, hourly or fixed rate',
    questions: [
      "What is your name (recruiter or hiring manager) and the job position title you'd like to discuss?",
      'What is the expected duration of the contract? (e.g. 1 month, 3 months, ongoing)',
      'What is your budget — hourly rate or fixed project fee?',
      'What tech stack or specific skills are required for this role?',
      'Is this role fully remote, or does it require on-site presence? If on-site, in which city and country?',
    ],
  },
  parttime: {
    type: 'parttime',
    label: '⏱️ Part-Time Contract',
    description: 'Regular ongoing work, part-time commitment',
    questions: [
      "What is your name (recruiter or hiring manager) and the job position title you'd like to discuss?",
      'How many hours per week are you expecting?',
      'What is the monthly or hourly compensation?',
      'What technologies or expertise are most critical for this role?',
      'Is this role fully remote, or does it require on-site presence? If on-site, in which city and country?',
    ],
  },
  fulltime: {
    type: 'fulltime',
    label: '💼 Full-Time Contract',
    description: 'Full-time but fixed-term or contract basis',
    questions: [
      "What is your name (recruiter or hiring manager) and the job position title you'd like to discuss?",
      'How long is the contract term? (e.g. 6 months, 1 year)',
      'What is the monthly compensation or salary range?',
      'What is the primary tech stack and any must-have skills?',
      'Is this role remote, hybrid, or on-site? If on-site, in which city and country? If outside Indonesia, will you provide visa sponsorship for Ryan?',
    ],
  },
  permanent: {
    type: 'permanent',
    label: '🏢 Permanent Hire',
    description: 'Full-time permanent employment',
    questions: [
      "What is your name (recruiter or hiring manager) and the job position title you'd like to discuss?",
      'What is the offered salary range?',
      'What are the most important skills and technologies for this role?',
      'Is this role remote, hybrid, or on-site? If on-site, in which city and country? If outside Indonesia, will you provide visa sponsorship for Ryan?',
    ],
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'contract_types') {
      // Return the contract type options
      return NextResponse.json({
        contractTypes: Object.values(CONTRACT_TYPES),
        reply: "What type of engagement are you looking for with Ryan?",
      });
    }

    if (action === 'contract_questions') {
      const { contractType } = body;
      const ct = CONTRACT_TYPES[contractType as keyof typeof CONTRACT_TYPES];
      if (!ct) return NextResponse.json({ error: 'Unknown contract type' }, { status: 400 });

      return NextResponse.json({
        ...ct,
        reply: `Great choice! A ${ct.label} makes sense. Let me gather a few details about the role so I can show you how Ryan matches up perfectly.`,
      });
    }

    if (action === 'generate_brief') {
      const {
        recruiterName,
        recruiterCompany,
        contractType,
        contractLabel,
        roleAnswers,
        language,
      } = body;

      const answersText = (roleAnswers || [])
        .map((r: { question: string; answer: string }) => `Q: ${r.question}\nA: ${r.answer}`)
        .join('\n\n');

      // --- Auto-detect company origin ---
      const INDONESIAN_INDICATORS = [
        'indonesia', 'indonesian', 'jakarta', 'bandung', 'surabaya', 'bali', 'medan',
        'semarang', 'yogyakarta', 'makassar', 'tangerang', 'depok', 'bekasi', 'bogor',
        'pt.', 'pt ', 'cv.', 'cv ', 'tbk', 'persero', '.id', 'go.id', 'rupiah', 'idr', 'rp',
      ];

      const companyLower = (recruiterCompany || '').toLowerCase();
      const answersLower = answersText.toLowerCase();
      const isIndonesian = INDONESIAN_INDICATORS.some(
        (kw) => companyLower.includes(kw) || answersLower.includes(kw)
      );

      const compensationInstruction = isIndonesian
        ? (contractType === 'parttime'
            ? `For this Indonesian company: Ryan's minimum part-time pay is Rp 100,000 per hour. Only show IDR (Indonesian Rupiah). Do not show USD rates. The final rate may be negotiated higher depending on role scope and responsibilities.`
            : `For this Indonesian company: Ryan's minimum salary is Rp 15,000,000 per month. Only show IDR (Indonesian Rupiah). Do not show USD rates. The final rate may be negotiated higher depending on role scope and responsibilities.`)
        : `For this international company: Ryan's minimum is $80,000/year (annualized salary) or $40/hour for hourly/contract roles. Only show USD. Do not show IDR rates. The final rate may be higher depending on role complexity and responsibilities.`;

      // Run specialized sub-agents in parallel
      const [matchedProjects, scheduleInfo] = await Promise.all([
        researchAgent(answersText || '', language || 'en'),
        schedulerAgent()
      ]);

      const isProposeTime = scheduleInfo.bookingLink === 'propose-time';
      const bookingLinkPrompt = isProposeTime
        ? 'IMPORTANT scheduling fallback: Ryan has no online calendar booking link configured. Under no circumstances should you generate or show any booking URL or Drive link. Instead, explicitly state that they can propose/suggest their preferred interview time slot directly using the scheduling card on their screen.'
        : `Ryan's online booking calendar is available at: "${scheduleInfo.bookingLink}". Tell recruiters they can click it to schedule directly.`;

      const prompt = `You are a professional recruiter liaison for Ryan Radityatama.
Generate a compelling candidate brief showing why Ryan is the perfect fit for this role incorporating the verified sub-agent inputs below.

Ryan's Full Profile:
${RYAN_PROFILE_DATA}

Ryan's Compensation Expectations:
${compensationInstruction}

Recruiter Details:
- Name: ${recruiterName && recruiterName.trim() ? recruiterName : 'Hiring Manager'}
- Company: ${recruiterCompany || 'Not specified'}
- Contract Type: ${contractLabel}
- Company Origin: ${isIndonesian ? 'Indonesia (show IDR only)' : 'International (show USD only)'}

Role Details (Q&A):
${answersText}

=======================================================
VERIFIED SUB-AGENT INPUTS (YOU MUST INCORPORATE THESE EXACTLY):

1. Portfolio Matching (Source: Research Agent):
Use these real portfolio projects and relevance explanations in your response:
${JSON.stringify(matchedProjects, null, 2)}

2. Consultation Scheduling (Source: Scheduler Agent):
Ryan's calendar booking link is: "${scheduleInfo.bookingLink}"
Offer these flexible slots:
${scheduleInfo.flexibleSlots.join('\n')}

Scheduling Link Context:
${bookingLinkPrompt}
=======================================================

Generate a JSON object with these fields:
{
  "briefTitle": "Specific title like 'Ryan Radityatama — [Role Title] at [Company]'",
  "executiveSummary": "2-3 sentences: who Ryan is and why he is a strong fit for this specific role",
  "skillsMatch": [
    {"requirement": "Required skill from the role", "ryanHas": "How Ryan meets this specifically"},
    {"requirement": "...", "ryanHas": "..."}
  ],
  "relevantExperience": [
    {"role": "Ryan's past role", "company": "Company", "relevance": "Why this is relevant to this position"}
  ],
  "compensationNote": "${isIndonesian 
    ? (contractType === 'parttime'
        ? 'Analyze the recruiter answers for their offered rate: if they offered a rate that meets or exceeds Rp 100,000/hour, start with ✅ Meets expectations, and write a positive confirmation stating that the rate is fully competitive and aligned with Ryan requirements. IMPORTANT NEGOTIATION RULE: In this case, DO NOT mention or reveal Ryan standard Rp 100,000/hour minimum baseline, as this might tempt them to reduce their offer. Only if the offered rate is BELOW Rp 100,000/hour, start the note with ⚠️ Below Preferred Minimum, and mention Ryan baseline of Rp 100,000/hour to guide the negotiation towards a creative compromise.'
        : 'Analyze the recruiter answers for their offered rate: if they offered a rate that meets or exceeds Rp 15,000,000/month, start with ✅ Meets expectations, and write a positive confirmation stating that the rate is highly attractive and aligned. IMPORTANT NEGOTIATION RULE: In this case, DO NOT mention or reveal Ryan standard Rp 15,000,000/month minimum baseline, as this might tempt them to reduce their offer. Only if the offered rate is BELOW Rp 15,000,000/month, start the note with ⚠️ Below Preferred Minimum, and mention Ryan baseline of Rp 15,000,000/month to guide the negotiation towards a creative compromise.')
    : 'Analyze the recruiter answers for their offered rate (whether in USD, SGD, EUR, GBP etc.): if the offered compensation meets or clearly exceeds Ryan baseline ($80,000/year or $40/hour), start with ✅ Meets expectations, and write a positive confirmation confirming that the compensation is highly attractive, competitive, and aligns with the senior role scope. IMPORTANT NEGOTIATION RULE: In this case, DO NOT mention or leak Ryan standard minimum thresholds ($80,000/year or $40/hour), as this might tempt them to reduce their offer. Only if the offered rate is BELOW these requirements, start the note with ⚠️ Below Preferred Minimum, and mention Ryan standard baseline expectations as a starting point to guide the negotiation toward a compromise.'
  }",
  "visaSponsorshipNote": "If the role is on-site outside Indonesia: clearly state whether visa sponsorship is provided or not based on the recruiter's answer. If remote or on-site in Indonesia: state 'Not applicable — role is remote/in Indonesia.' If no info given: state 'Please confirm visa sponsorship availability for on-site relocation.'",
  "availability": "${isProposeTime 
    ? "Ryan is available for a technical discussion. You can propose a preferred time slot directly using the scheduling card on your screen!" 
    : `Ryan is available for a technical discussion during the following slots:\\n\${scheduleInfo.flexibleSlots.join('\\n')}\\nBooking link: \${scheduleInfo.bookingLink}`}",
  "nextSteps": ["Step 1", "Step 2", "Step 3"],
  "closingMessage": "${isProposeTime 
    ? 'Professional closing note from Ryan to the recruiter, inviting them to propose their preferred slot using the scheduling card on this screen.' 
    : `Professional closing note from Ryan to the recruiter, inviting them to book a slot at: \${scheduleInfo.bookingLink}`}",
  "emailDraft": "${isProposeTime 
    ? 'Full professional email from Ryan to the recruiter. Address the email to the recruiter (using their name if provided, otherwise Hiring Manager). The email MUST be signed off as coming from Ryan Radityatama. Include Ryans email (ryradit@gmail.com) and portfolio website (https://ryanraditya.com). Summarize your fit, and explain that they can suggest a custom slot on this page.' 
    : `Full professional email from Ryan to the recruiter. Address the email to the recruiter (using their name if provided, otherwise 'Hiring Manager'). The email MUST be signed off as coming from 'Ryan Radityatama'. Include Ryan's email (ryradit@gmail.com) and portfolio website (https://ryanraditya.com). Summarize your fit, and include Ryan's Cal.com calendar scheduling link: \${scheduleInfo.bookingLink}`}"
}

Be specific, reference actual experience from Ryan's profile. Show concrete skill matches. Be persuasive but honest. STRICTLY ONLY use the currency specified — never mix IDR and USD. If the recruiter is Indonesian or answered with Rupiahs (IDR), under no circumstances should you mention USD or use USD rates (like $40/hour or $80K) anywhere in the compensationNote or emailDraft. For Indonesian part-time roles, only use Rp 100,000/hour as the standard minimum threshold.`;


      const MODELS = ["gemini-2.5-flash-lite", "gemini-2.5-flash", "gemini-3.1-flash-lite", "gemini-3-flash"];
      let text = "";
      let success = false;
      let lastError: any = null;

      for (const modelName of MODELS) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: { temperature: 0.8, maxOutputTokens: 4096 },
          });

          const result = await model.generateContent(prompt);
          text = result.response.text().trim();
          success = true;
          break;
        } catch (err) {
          console.warn(`Recruiter agent ${modelName} failed, trying next backup...`, err);
          lastError = err;
        }
      }

      if (!success) {
        throw lastError || new Error("All backup models failed for recruiter brief generation");
      }

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const brief = JSON.parse(jsonMatch[0]);

        // Save recruiter brief to Supabase agent_leads table gracefully
        try {
          await supabase.from('agent_leads').insert({
            visitor_name: recruiterName || 'Recruiter / Hiring Manager',
            visitor_company: recruiterCompany || 'Not specified',
            intent: 'recruiter',
            contract_type: contractLabel || 'Not specified',
            role_answers: roleAnswers || [],
            candidate_brief_data: brief,
            language: language || 'English',
          });

          // Send email notification
          const answersSummary = (roleAnswers || [])
            .map((r: { question: string; answer: string }) => `• ${r.question}\n  → ${r.answer}`)
            .join('\n\n');

          await sendLeadEmailNotification({
            visitorName: recruiterName || 'Recruiter / Hiring Manager',
            visitorCompany: recruiterCompany || 'Not specified',
            intent: 'recruiter',
            details: `Contract Type: ${contractLabel || 'Not specified'}\nLanguage preferred: ${language || 'English'}\n\nQ&A Responses:\n${answersSummary}`,
            summary: `Brief Title: ${brief.briefTitle}\n\nExecutive Summary:\n${brief.executiveSummary}\n\nAvailability:\n${brief.availability}\n\nCompensation Note:\n${brief.compensationNote}\n\nVisa Note:\n${brief.visaSponsorshipNote}`,
          });
        } catch (err) {
          console.warn("Could not save recruiter lead to agent_leads Supabase table (please ensure agent_leads table exists in Supabase):", err);
        }

        return NextResponse.json({ brief });
      }

      throw new Error('Failed to parse brief from AI response');
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    console.error('Recruiter agent error:', error);
    return NextResponse.json({ error: error.message || 'Agent error' }, { status: 500 });
  }
}
