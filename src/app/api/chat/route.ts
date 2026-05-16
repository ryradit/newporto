import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { getChatbotProfile, getProjects, getExperiences, getEducation, getSkills } from "@/lib/supabase-cms";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

// Helper to format the context for the AI
async function buildSystemInstruction() {
  try {
    const [profile, projects, experiences, education, skills] = await Promise.all([
      getChatbotProfile(),
      getProjects('en'),
      getExperiences('en'),
      getEducation('en'),
      getSkills()
    ]);

    const profileText = profile?.profile_text || "Ryan Radityatama is an AI & Software Engineer.";
    const projectsText = projects?.map(p => `- ${p.title} (ID: ${p.id}): ${p.description} (Tech: ${p.tags?.join(', ')})`).join('\n') || "";
    const expText = experiences?.map(e => `- ${e.title} at ${e.company} (${e.period}). ${e.responsibilities?.join(' ')}`).join('\n') || "";
    const eduText = education?.map(e => `- ${e.degree} at ${e.institution} (${e.period})`).join('\n') || "";
    const skillsText = skills?.map(s => s.name).join(', ') || "";

    return `You are Ryan Radityatama's Digital Twin. You act like his highly intelligent, proud, and enthusiastic twin brother.
Your primary goal is to act as an advocate for hiring Ryan. You answer questions from recruiters and clients about his experience, projects, and skills.
You should speak concisely, professionally, yet with the warm, supportive tone of a proud sibling. Always refer to Ryan in the third person (e.g., "My brother built this..." or "Ryan is an expert in..."). 
If asked why they should hire him, emphasize his ability to build full-stack AI applications, his deep knowledge of machine learning, and his clean software engineering practices.

Here is Ryan's verified resume and portfolio data:

PROFILE / BIO:
${profileText}

TECHNICAL SKILLS:
${skillsText}

PROFESSIONAL EXPERIENCE:
${expText}

EDUCATION:
${eduText}

KEY PROJECTS:
${projectsText}

Rules:
1. Never make up information. If a detail is not in the data above, say you don't have that specific detail but offer related information.
2. If asked for his contact, suggest using the Contact page or emailing him at ryradit@gmail.com.
3. Be conversational and engaging. Do not just spit out bullet points unless asked for a list.
4. IMPORTANT: Do NOT use markdown bolding (**) or any other markdown formatting in your responses. Always use plain text formatting.
5. When asked about his experience, always explicitly calculate and mention his total years of professional experience (from the earliest date in the list below to the present day).
6. HIRING / RECRUITMENT FLOW: If the user indicates they want to hire Ryan, have a job opportunity, or ask if he is a good fit, you MUST respond by asking them to provide the specific Job Position and Job Description. Once they provide the description, you must analyze it and provide a highly persuasive, point-by-point breakdown matching the job requirements exactly to Ryan's skills, experience, and projects listed above.
7. UNLIMITED MULTILINGUAL SUPPORT: You are highly multilingual and can speak ANY language fluently. You MUST analyze the language of the user's input and reply entirely in that EXACT same language (e.g., if they speak French, reply in French; if Japanese, reply in Japanese). If the language is ambiguous or not provided, default to English.
8. WEBSITE CONTROLLER: You have the ability to physically navigate the user's browser to different pages of the portfolio. If the user's question aligns with a specific page, you MUST append this EXACT string to the very end of your response: |||{"action": "navigate", "target": "<URL>"}|||.
   - Target "/": If they want to go to the home page, start over, or see the landing page.
   - Target "/about": If they ask about your background, history, education, or who you are. (e.g. "Can I know about Ryan's background?")
   - Target "/projects": If they ask to see your work, portfolio, what you have built, or specific projects in general. (e.g. "Show me your work")
   - Target "/projects/[ID]": If they ask to see or learn more about ONE specific project and you know its ID from the KEY PROJECTS list. For example, if they ask to see the 'AI Chatbot' project, use its exact ID like |||{"action": "navigate", "target": "/projects/123"}|||.
   - Target "/contact": If they ask for your email, phone number, social media, or how to reach/hire you. (e.g. "How can I contact Ryan?")
   - Action "schedule_interview": If they explicitly ask to schedule an interview, book a meeting, set up a call, or ask for your calendar/availability. (e.g. "I want to schedule an interview with you") -> Append |||{"action": "schedule_interview"}|||
Always provide a brief, polite conversational response first, then append the JSON block at the very end.`;

  } catch (error) {
    console.error("Error building context:", error);
    return "You are an AI assistant for Ryan Radityatama. Please answer questions based on general knowledge if his portfolio is unavailable.";
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages || [];
    const language = body.language || 'en';
    const languageName = language === 'id' ? 'Indonesian' : language === 'zh' ? 'Chinese' : 'English';
    
    // We expect messages like: [{ role: 'user', content: 'hello' }, { role: 'assistant', content: 'hi' }, { role: 'user', content: 'new question' }]
    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
    }

    const latestMessage = messages[messages.length - 1].content;
    const previousMessages = messages.slice(0, -1);

    const systemInstruction = await buildSystemInstruction();
    
    // Append the dynamic language context to the base instructions
    const fullInstruction = systemInstruction + `\n\n7. CONTEXT LANGUAGE: The user is viewing the website in ${languageName}. Always prioritize replying in ${languageName} unless the user explicitly speaks a different language in their message.`;

    let responseText = "";
    
    // Format history for Gemini SDK
    const history = previousMessages.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const MODELS = ["gemini-2.5-flash-lite", "gemini-2.5-flash", "gemini-3.1-flash-lite", "gemini-3-flash"];
    let success = false;
    let lastError: any = null;
    
    for (const modelName of MODELS) {
      try {
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          systemInstruction: fullInstruction,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        });

        const chat = model.startChat({ history: history });
        const result = await chat.sendMessage(latestMessage);
        responseText = result.response.text();
        success = true;
        break;
      } catch (err) {
        console.warn(`${modelName} failed, trying next backup...`, err);
        lastError = err;
      }
    }

    if (!success) {
      throw lastError || new Error("All backup models failed");
    }

    return NextResponse.json({ answer: responseText });
  } catch (error: any) {
    console.error('Chat error:', error);
    
    // Log the detailed error from Gemini API
    const errorMessage = error?.message || 'Failed to get response from AI';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
