import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

// Language detection function
async function detectLanguage(text: string) {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash-lite",
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 10,
    }
  });
  const prompt = `Analyze this text and return only the language code:
"${text}"
Only respond with one of these codes: "en" for English, "id" for Indonesian, "zh" for Chinese.
Just the code, nothing else.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim() as "en" | "id" | "zh";
}

export async function POST(req: NextRequest) {
  try {
    const { question, profile } = await req.json();

    // Detect the input language
    const inputLanguage = await detectLanguage(question);

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash-lite",
      generationConfig: {
        temperature: 0.7,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      },
    });

    const prompt = `You are a helpful AI assistant for Ryan Radityatama.
Your primary goal is to answer questions about Ryan based on his provided profile information.
You are bilingual and can understand and respond in both English and Bahasa Indonesia.
If the question is in Bahasa Indonesia, or if the user asks you to respond in Bahasa Indonesia, please provide your answer in Bahasa Indonesia. Otherwise, respond in English.

Use the following profile information to answer the question:

${profile}

Question: ${question}

Answer:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ answer: text });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to get response from AI' },
      { status: 500 }
    );
  }
}
