import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { RYAN_PROFILE_DATA } from '@/lib/profile-data';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

// Ryan's minimum compensation expectations
const RYAN_COMPENSATION = `
Ryan's Minimum Compensation Requirements:
- Indonesia (IDR): Rp 15,000,000 per month minimum
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
      'What is the job title or role you need filled?',
      'What is the expected duration of the contract? (e.g. 1 month, 3 months, ongoing)',
      'What is your budget — hourly rate or fixed project fee?',
      'What tech stack or specific skills are required for this role?',
    ],
  },
  parttime: {
    type: 'parttime',
    label: '⏱️ Part-Time Contract',
    description: 'Regular ongoing work, part-time commitment',
    questions: [
      'What is the position and main responsibilities?',
      'How many hours per week are you expecting?',
      'What is the monthly or hourly compensation?',
      'What technologies or expertise are most critical for this role?',
    ],
  },
  fulltime: {
    type: 'fulltime',
    label: '💼 Full-Time Contract',
    description: 'Full-time but fixed-term or contract basis',
    questions: [
      'What is the role title and key responsibilities?',
      'How long is the contract term? (e.g. 6 months, 1 year)',
      'What is the monthly compensation or salary range?',
      'What is the primary tech stack and any must-have skills?',
    ],
  },
  permanent: {
    type: 'permanent',
    label: '🏢 Permanent Hire',
    description: 'Full-time permanent employment',
    questions: [
      'What is the job title and team Ryan would be joining?',
      'What is the offered salary range?',
      'Is this role remote, hybrid, or on-site? And in which location?',
      'What are the most important skills and technologies for this role?',
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
      } = body;

      const answersText = (roleAnswers || [])
        .map((r: { question: string; answer: string }) => `Q: ${r.question}\nA: ${r.answer}`)
        .join('\n\n');

      const prompt = `You are a professional recruiter liaison for Ryan Radityatama.
Generate a compelling candidate brief showing why Ryan is the perfect fit for this role.

Ryan's Full Profile:
${RYAN_PROFILE_DATA}

${RYAN_COMPENSATION}

Recruiter Details:
- Name: ${recruiterName || 'Recruiter'}
- Company: ${recruiterCompany || 'Not specified'}
- Contract Type: ${contractLabel}

Role Details (Q&A):
${answersText}

Generate a JSON object with these fields:
{
  "briefTitle": "Specific title like 'Ryan Radityatama — [Role Title] at [Company]'",
  "executiveSummary": "2-3 sentences: who Ryan is and why he is a strong fit for this specific role",
  "skillsMatch": [
    {"requirement": "Required skill from the role", "ryanHas": "How Ryan meets this specifically"},
    {"requirement": "...", "ryanHas": "..."}
  ],
  "relevantExperience": [
    {"role": "Ryan's past role", "company": "Company", "relevance": "Why this is relevant to this position"},
    ...
  ],
  "compensationNote": "State Ryan's minimum expected compensation clearly for this contract type. For IDR roles: minimum Rp 15,000,000/month. For USD roles: minimum $80K/year (salary) or $40/hour. Mention that the final rate depends on job responsibilities and scope.",
  "availability": "Ryan's general availability note",
  "nextSteps": ["Step 1", "Step 2", "Step 3"],
  "closingMessage": "Professional closing note from Ryan to the recruiter",
  "emailDraft": "Full professional email from Ryan to the recruiter expressing interest, summarizing his fit, and stating his minimum compensation expectations clearly"
}

Be specific, reference actual experience from Ryan's profile. Show concrete skill matches. Be persuasive but honest. Always include the compensation expectations in the compensationNote field.`;

      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash-lite',
        generationConfig: { temperature: 0.8, maxOutputTokens: 4096 },
      });

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const jsonMatch = text.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        const brief = JSON.parse(jsonMatch[0]);
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
