import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_MODELS } from '@/lib/gemini-models';

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fileBase64, fileName, fileType, currentIntent, language } = body;

    if (!fileBase64) {
      return NextResponse.json({ error: 'No file data provided' }, { status: 400 });
    }

    const outputLanguage = typeof language === 'string' && language.trim() ? language.trim().slice(0, 40) : 'English';

    // Normalize mimeType for Gemini
    let mimeType = fileType || 'application/pdf';
    if (fileName && fileName.endsWith('.pdf')) mimeType = 'application/pdf';
    else if (fileName && (fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg'))) {
      mimeType = fileName.endsWith('.png') ? 'image/png' : 'image/jpeg';
    } else if (fileName && (fileName.endsWith('.txt') || fileName.endsWith('.md'))) {
      mimeType = 'text/plain';
    }

    const systemPrompt = `You are an expert AI document analyzer for Ryan Radityatama, a Senior Fullstack Web Developer and AI/ML Engineer.
Analyze this uploaded document (which could be a Job Description, an RFP, a Client Project Brief, or technical requirements).

LANGUAGE INSTRUCTION: Write all descriptive text, summaries, and chatReply in ${outputLanguage}. Keep technical stack keywords, names, and numbers unchanged.

Tasks:
1. Determine whether this is a "recruiter" job opening / contract role OR a "client" project brief / website requirement. If currentIntent is specified as "${currentIntent}", honor it if ambiguous.
2. If it is a RECRUITER document:
   - Extract the job position title
   - Extract the company name
   - Determine contract type ('fulltime', 'parttime', 'freelance', or 'permanent')
   - Extract salary / compensation range (if mentioned, otherwise 'Not specified in document')
   - Extract work location / remote policy
   - List 4-7 key technical requirements and responsibilities
   - Compose a friendly chatReply confirming the role details and letting them know Ryan matches these skills.
3. If it is a CLIENT project document:
   - Extract the project title or concept
   - Recommend a budget tier ('starter' [under $300], 'standard' [$300-$1000], 'professional' [$1000-$3000], 'enterprise' [$3000+])
   - Extract key features / deliverables requested
   - Extract target timeline (if any)
   - Compose a friendly chatReply confirming the project scope and recommending a tier.

Return a valid JSON object strictly matching this schema:
{
  "detectedType": "recruiter" | "client",
  "documentTitle": "Clean title of the document or role/project",
  "companyName": "Extracted company or client name (or 'Valued Client')",
  "summary": "2-3 sentences concise summary of the document requirements",
  "extractedData": {
    "roleOrProject": "Job title or Project concept",
    "budgetOrSalary": "Salary range or recommended project budget",
    "suggestedTier": "starter" | "standard" | "professional" | "enterprise" | null,
    "timeline": "Target timeline or contract length",
    "keyPoints": ["Key requirement 1", "Key requirement 2", "Key requirement 3", "Key requirement 4"]
  },
  "chatReply": "Warm 2-3 sentence conversational response addressing the user in ${outputLanguage}, summarizing what was extracted, and inviting them to generate the custom proposal or candidate brief with one click."
}`;

    const MODELS = GEMINI_MODELS;
    let text = "";
    let success = false;
    let lastError: any = null;

    for (const modelName of MODELS) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 3072,
            responseMimeType: 'application/json',
          },
        }, { timeout: 15000 });

        const result = await model.generateContent([
          {
            inlineData: {
              mimeType,
              data: fileBase64,
            },
          },
          systemPrompt,
        ]);

        text = result.response.text().trim();
        success = true;
        break;
      } catch (err: any) {
        console.warn(`Analyze document with ${modelName} failed, falling back to next...`, err?.message || err);
        lastError = err;
      }
    }

    if (!success) {
      throw lastError || new Error("All backup models failed for document analysis");
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return NextResponse.json({
        success: true,
        fileName: fileName || 'Uploaded Document',
        analysis: parsed,
      });
    }

    throw new Error('Failed to parse analysis JSON from model response');
  } catch (error: any) {
    console.error('Analyze document error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to analyze uploaded document' },
      { status: 500 }
    );
  }
}
