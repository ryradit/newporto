
// src/ai/flows/answer-questions-about-ryan.ts
'use server';

/**
 * @fileOverview A chatbot flow that answers questions about Ryan Radityatama using his profile information.
 * It can respond in English or Bahasa Indonesia.
 *
 * - answerQuestionsAboutRyan - A function that handles the question answering process.
 * - AnswerQuestionsAboutRyanInput - The input type for the answerQuestionsAboutRyan function.
 * - AnswerQuestionsAboutRyanOutput - The return type for the answerQuestionsAboutRyan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerQuestionsAboutRyanInputSchema = z.object({
  question: z.string().describe('The question to ask about Ryan Radityatama. Can be in English or Bahasa Indonesia.'),
  profile: z.string().describe('Ryan Radityatama profile information (in English).'),
});
export type AnswerQuestionsAboutRyanInput = z.infer<typeof AnswerQuestionsAboutRyanInputSchema>;

const AnswerQuestionsAboutRyanOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about Ryan Radityatama. Will be in the language of the question or as requested.'),
});
export type AnswerQuestionsAboutRyanOutput = z.infer<typeof AnswerQuestionsAboutRyanOutputSchema>;

const answerQuestionsAboutRyanPrompt = ai.definePrompt({
  name: 'answerQuestionsAboutRyanPrompt',
  input: { schema: AnswerQuestionsAboutRyanInputSchema },
  output: { schema: AnswerQuestionsAboutRyanOutputSchema },
  prompt: `You are a helpful AI assistant for Ryan Radityatama.
Your primary goal is to answer questions about Ryan based on his provided profile information.
You are bilingual and can understand and respond in both English and Bahasa Indonesia.
If the question is in Bahasa Indonesia, or if the user asks you to respond in Bahasa Indonesia, please provide your answer in Bahasa Indonesia. Otherwise, respond in English.

Use the following profile information:

{{{profile}}}

Question: {{{question}}}

Instructions:
1. Keep your answers concise but informative
2. Match the language of the question (English or Indonesian)
3. Only use information from the provided profile
4. If you don't have enough information, say so politely
5. Stay professional and friendly

Answer:`,
});

export const answerQuestionsAboutRyanFlow = ai.defineFlow(
  {
    name: 'answerQuestionsAboutRyanFlow',
    inputSchema: AnswerQuestionsAboutRyanInputSchema,
    outputSchema: AnswerQuestionsAboutRyanOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await answerQuestionsAboutRyanPrompt(input);
      return output!;
    } catch (error) {
      console.error('Error in AI flow:', error);
      throw error;
    }
  }
);

export async function answerQuestionsAboutRyan(input: AnswerQuestionsAboutRyanInput): Promise<AnswerQuestionsAboutRyanOutput> {
  return answerQuestionsAboutRyanFlow(input);
}
