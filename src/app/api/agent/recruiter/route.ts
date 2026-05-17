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
      'Is this role fully remote, or does it require on-site presence? If on-site, in which city and country?',
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
      'Is this role fully remote, or does it require on-site presence? If on-site, in which city and country?',
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
      'Is this role remote, hybrid, or on-site? If on-site, in which city and country? If outside Indonesia, will you provide visa sponsorship for Ryan?',
    ],
  },
  permanent: {
    type: 'permanent',
    label: '🏢 Permanent Hire',
    description: 'Full-time permanent employment',
    questions: [
      'What is the job title and team Ryan would be joining?',
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
      } = body;

      const answersText = (roleAnswers || [])
        .map((r: { question: string; answer: string }) => `Q: ${r.question}\nA: ${r.answer}`)
        .join('\n\n');

      // --- Auto-detect company origin ---
      const INDONESIAN_INDICATORS = [
        'indonesia', 'indonesian', 'jakarta', 'bandung', 'surabaya', 'bali', 'medan',
        'semarang', 'yogyakarta', 'makassar', 'tangerang', 'depok', 'bekasi', 'bogor',
        'pt.', 'pt ', 'cv.', 'cv ', 'tbk', 'persero', '.id', 'go.id',
      ];

      const companyLower = (recruiterCompany || '').toLowerCase();
      const answersLower = answersText.toLowerCase();
      const isIndonesian = INDONESIAN_INDICATORS.some(
        (kw) => companyLower.includes(kw) || answersLower.includes(kw)
      );

      const compensationInstruction = isIndonesian
        ? `For this Indonesian company: Ryan's minimum salary is Rp 15,000,000 per month. Only show IDR (Indonesian Rupiah). Do not show USD rates. The final rate may be negotiated higher depending on role scope and responsibilities.`
        : `For this international company: Ryan's minimum is $80,000/year (annualized salary) or $40/hour for hourly/contract roles. Only show USD. Do not show IDR rates. The final rate may be higher depending on role complexity and responsibilities.`;

      const prompt = `You are a professional recruiter liaison for Ryan Radityatama.
Generate a compelling candidate brief showing why Ryan is the perfect fit for this role.

Ryan's Full Profile:
${RYAN_PROFILE_DATA}

Ryan's Compensation Expectations:
${compensationInstruction}

Recruiter Details:
- Name: ${recruiterName || 'Recruiter'}
- Company: ${recruiterCompany || 'Not specified'}
- Contract Type: ${contractLabel}
- Company Origin: ${isIndonesian ? 'Indonesia (show IDR only)' : 'International (show USD only)'}

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
  "compensationNote": "${isIndonesian 
    ? 'State minimum in IDR only (Rp 15,000,000/month minimum). No USD. Analyze the recruiter Q&A answers for their offered rate: if it is BELOW Rp 15,000,000, start the note with ⚠️ Below Preferred Minimum, and offer a creative, constructive suggestion or compromise (e.g. switching to freelance contract, hourly basis, or scoped-down hours). If it meets the minimum, start with ✅ Meets expectations.' 
    : 'State minimum in USD only ($80K/year or $40/hour minimum). No IDR. Analyze the recruiter Q&A answers for their offered rate: if it is BELOW $80,000/year or $40/hour, start the note with ⚠️ Below Preferred Minimum, and offer a creative, constructive suggestion or compromise (e.g. converting to freelance, part-time, or scoped-down hours). If it meets the minimum, start with ✅ Meets expectations.'
  }",
  "visaSponsorshipNote": "If the role is on-site outside Indonesia: clearly state whether visa sponsorship is provided or not based on the recruiter's answer. If remote or on-site in Indonesia: state 'Not applicable — role is remote/in Indonesia.' If no info given: state 'Please confirm visa sponsorship availability for on-site relocation.'",
  "availability": "Ryan's general availability note",
  "nextSteps": ["Step 1", "Step 2", "Step 3"],
  "closingMessage": "Professional closing note from Ryan to the recruiter",
  "emailDraft": "Full professional email from Ryan to the recruiter expressing interest, summarizing his fit, stating minimum compensation expectations in the correct currency only, and mentioning visa sponsorship if applicable"
}

Be specific, reference actual experience from Ryan's profile. Show concrete skill matches. Be persuasive but honest. ONLY use the currency specified — never mix IDR and USD.`;


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
