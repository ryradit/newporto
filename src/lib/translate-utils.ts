import { GoogleGenerativeAI } from "@google/generative-ai";

// Use NEXT_PUBLIC_ prefix to make it accessible in the client
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('NEXT_PUBLIC_GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Function to detect language
async function detectLanguage(text: string): Promise<'en' | 'id' | 'zh'> {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash-lite",
    generationConfig: {
      temperature: 0.1, // Very low temperature for consistent language detection
      maxOutputTokens: 10,
    }
  });
  const prompt = `Analyze this text and return only the language code:
"${text}"
Only respond with one of these codes: "en" for English, "id" for Indonesian, "zh" for Chinese.
Just the code, nothing else.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim() as 'en' | 'id' | 'zh';
}

export async function translateText(text: string, targetLang: 'en' | 'id' | 'zh') {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    // First detect the source language
    const sourceLanguage = await detectLanguage(text);
    
    // Don't translate if target language is the same as source
    if (sourceLanguage === targetLang) {
      return text;
    }

    // Configure the model with appropriate settings
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash-lite",
      generationConfig: {
        temperature: 0.3, // Lower temperature for more consistent translations
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048,
      }
    });
    
    console.log('Translating text:', text, 'to', targetLang);

    const targetLanguageMap = {
      'en': 'English',
      'id': 'Indonesian',
      'zh': 'Chinese (Simplified)'
    };

    const prompt = `Translate the following text from ${targetLanguageMap[sourceLanguage]} to ${targetLanguageMap[targetLang]}. 
Important: Only provide the direct translation without any additional text or explanation:
"${text}"`;

    let retries = 3;
    while (retries > 0) {
      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const translation = response.text();
        
        console.log('Translation result:', translation);
        return translation.trim();
      } catch (err: any) {
        retries--;
        if (err?.message?.includes('429') && retries > 0) {
          console.log(`Rate limited, waiting before retry. ${retries} retries left`);
          await delay(5000); // Wait 5 seconds before retrying
          continue;
        }
        throw err;
      }
    }
    
    throw new Error('Failed after multiple retries');
  } catch (error) {
    console.error('Translation error details:', error);
    return null;
  }
}
