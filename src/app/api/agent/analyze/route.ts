import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userMessage,
      currentQuestion,
      upcomingQuestions = [],
    } = body;

    if (!userMessage) {
      return NextResponse.json({
        acknowledgment: '',
        extractedAnswers: [],
        skippedQuestionIndices: [],
      });
    }

    const questionsList = upcomingQuestions
      .map((q: string, idx: number) => `[Question Index ${idx}]: "${q}"`)
      .join('\n');

    const prompt = `You are an elite, highly intelligent conversational AI assistant.
Your task is to analyze a user's response in a chatbot conversation and determine if they have already provided answers to any of the upcoming questions. Additionally, you will generate a brief, warm, contextual reaction/acknowledgment to their message.

Input Details:
- User Message: "${userMessage}"
- Question Just Answered: "${currentQuestion || 'None'}"
- Remaining Upcoming Questions:
${questionsList || 'None'}

Task Instructions:
1. "acknowledgment": Generate a brief, warm, highly conversational, human-like 1-sentence reaction (in English) acknowledging their response. For example:
   - If they mention a tech stack like React, Python, Node.js, Next.js, or TypeScript: warmly highlight Ryan's deep expertise in it.
   - If they mention a prominent company name: express polite excitement or respect about working with them.
   - If they mention working remote or hybrid: mention that it's highly compatible.
   - Otherwise, generate a warm, supportive bridge based on their input.
   *Keep the acknowledgment extremely brief (max 1 sentence) and natural. Do not sign off.*
2. "extractedAnswers": Carefully scan the "User Message" to see if they have already supplied information that answers any of the "Remaining Upcoming Questions".
   - If they did, extract the exact relevant answer/details.
   - Map it to the corresponding "Question Index" from the list of remaining upcoming questions.
3. "skippedQuestionIndices": Return an array of the "Question Index" numbers for any questions that have been answered in the "User Message". Only skip a question if the user has explicitly and clearly answered it.

Return a JSON object with this exact format:
{
  "acknowledgment": "Brief natural reaction sentence in English",
  "extractedAnswers": [
    { "questionIndex": 1, "answer": "Extracted answer details" }
  ],
  "skippedQuestionIndices": [1]
}

Ensure the output is clean JSON. Do not include markdown wraps or anything else outside the JSON object.`;

    const MODELS = ["gemini-2.5-flash-lite", "gemini-2.5-flash", "gemini-3.1-flash-lite", "gemini-3-flash"];
    let text = "";
    let success = false;
    let lastError: any = null;

    for (const modelName of MODELS) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        });

        const result = await model.generateContent(prompt);
        text = result.response.text().trim();
        success = true;
        break;
      } catch (err) {
        console.warn(`Analyze route model ${modelName} failed, trying next backup...`, err);
        lastError = err;
      }
    }

    if (!success) {
      throw lastError || new Error("All backup models failed for response analysis");
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0]);
      return NextResponse.json(analysis);
    }

    throw new Error('Failed to parse analysis JSON from AI response');
  } catch (error: any) {
    console.error('Analyze route error:', error);
    // Graceful fallback to avoid breaking the conversational flow
    return NextResponse.json({
      acknowledgment: '',
      extractedAnswers: [],
      skippedQuestionIndices: [],
    });
  }
}
