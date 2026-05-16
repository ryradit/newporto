import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { name, company, context } = await req.json();
    
    if (!name || !company) {
      return NextResponse.json({ error: 'Name and Company are required' }, { status: 400 });
    }

    const prompt = `You are an AI assistant helping a recruiter write a quick, highly professional message to Ryan Radityatama requesting an interview. 
The recruiter's name is ${name} and they work at ${company}.
${context ? `The recruiter provided these rough notes/context: "${context}". You must expand and polish this context into a professional message.` : `The recruiter did not provide specific notes, so generate a polite, generic request to discuss Ryan's portfolio and potential fit.`}
Keep the message concise (2-3 sentences max). It should be polite, engaging, and express interest in discussing Ryan's portfolio and potential fit.
Do NOT include placeholders like [Date/Time] because the date is handled in a separate UI field.
Just output the raw message text, no markdown, no quotes, no extra conversational text.`;

    const MODELS = ["gemini-2.5-flash-lite", "gemini-2.5-flash", "gemini-3.1-flash-lite", "gemini-3-flash"];
    let draftedText = "";
    let success = false;
    let lastError: any = null;

    for (const modelName of MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        draftedText = response.text().trim();
        success = true;
        break;
      } catch (err) {
        console.warn(`${modelName} failed for draft-message, trying next backup...`, err);
        lastError = err;
      }
    }

    if (!success) {
      throw lastError || new Error("All backup models failed");
    }

    return NextResponse.json({ draft: draftedText });
  } catch (error: any) {
    console.error('Draft message error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to draft message' },
      { status: 500 }
    );
  }
}
