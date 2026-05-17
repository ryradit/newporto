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
  const MODELS = ["gemini-2.5-flash-lite", "gemini-2.5-flash", "gemini-3.1-flash-lite", "gemini-3-flash"];
  let code = "en";
  let success = false;
  let lastError: any = null;

  const prompt = `Analyze this text and return only the language code:
"${text}"
Only respond with one of these codes: "en" for English, "id" for Indonesian, "zh" for Chinese.
Just the code, nothing else.`;

  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: {
          temperature: 0.1, // Very low temperature for consistent language detection
          maxOutputTokens: 10,
        }
      });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      code = response.text().trim();
      success = true;
      break;
    } catch (err) {
      console.warn(`Language detection ${modelName} failed, trying next backup...`, err);
      lastError = err;
    }
  }

  if (!success) {
    console.error("All backup models failed for language detection:", lastError);
  }

  return code as 'en' | 'id' | 'zh';
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

    const targetLanguageMap = {
      'en': 'English',
      'id': 'Indonesian',
      'zh': 'Chinese (Simplified)'
    };

    const prompt = `Translate the following text from ${targetLanguageMap[sourceLanguage]} to ${targetLanguageMap[targetLang]}. 
Important: Only provide the direct translation without any additional text or explanation:
"${text}"`;

    const MODELS = ["gemini-2.5-flash-lite", "gemini-2.5-flash", "gemini-3.1-flash-lite", "gemini-3-flash"];
    let translationText = "";
    let success = false;
    let lastError: any = null;

    for (const modelName of MODELS) {
      let retries = 3;
      while (retries > 0) {
        try {
          const model = genAI.getGenerativeModel({ 
            model: modelName,
            generationConfig: {
              temperature: 0.3, // Lower temperature for more consistent translations
              topP: 0.8,
              topK: 40,
              maxOutputTokens: 2048,
            }
          });

          console.log(`Translating text with ${modelName}:`, text, 'to', targetLang);
          const result = await model.generateContent(prompt);
          const response = await result.response;
          translationText = response.text();
          success = true;
          break;
        } catch (err: any) {
          retries--;
          lastError = err;
          if (err?.message?.includes('429') && retries > 0) {
            console.log(`Rate limited for ${modelName}, waiting before retry. ${retries} retries left`);
            await delay(5000); // Wait 5 seconds before retrying
            continue;
          }
          console.warn(`Translation with ${modelName} failed, trying next...`, err);
          break; // Try next model in fallback array
        }
      }
      if (success) break;
    }

    if (!success) {
      throw lastError || new Error("All backup models failed for translateText");
    }

    console.log('Translation result:', translationText);
    return translationText.trim();
  } catch (error) {
    console.error('Translation error details:', error);
    return null;
  }
}
