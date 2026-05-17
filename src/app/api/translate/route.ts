import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { text, targetLanguage } = await req.json();
    
    if (!targetLanguage) {
      return NextResponse.json({ error: 'Missing targetLanguage' }, { status: 400 });
    }

    if (text === undefined || text === null || String(text).trim() === '') {
      return NextResponse.json({ translation: '' });
    }

    const prompt = `Translate the following text exactly into ${targetLanguage}. Do not add any extra commentary, conversational text, or markdown formatting. Just provide the direct translation. Keep all names and technical terms appropriately formatted.\n\nText to translate:\n"${text}"`;
    
    const MODELS = ["gemini-2.5-flash-lite", "gemini-2.5-flash", "gemini-3.1-flash-lite", "gemini-3-flash"];
    let translatedText = "";
    let success = false;
    let lastError: any = null;

    for (const modelName of MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        translatedText = response.text().trim();
        success = true;
        break;
      } catch (err) {
        console.warn(`${modelName} failed for translation, trying next backup...`, err);
        lastError = err;
      }
    }

    if (!success) {
      throw lastError || new Error("All backup models failed");
    }

    // Remove any accidental quotes added by the LLM
    const cleanText = translatedText.replace(/^["']|["']$/g, '');

    return NextResponse.json({ translation: cleanText });
  } catch (error: any) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to translate text' },
      { status: 500 }
    );
  }
}
