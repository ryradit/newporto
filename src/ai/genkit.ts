import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error('NEXT_PUBLIC_GEMINI_API_KEY is not set in environment variables');
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: GEMINI_API_KEY
    }),
  ],
});
