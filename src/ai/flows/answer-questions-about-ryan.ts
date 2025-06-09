// src/ai/flows/answer-questions-about-ryan.ts
'use server';

/**
 * @fileOverview A chatbot flow that answers questions about Ryan Radityatama using his profile information.
 *
 * - answerQuestionsAboutRyan - A function that handles the question answering process.
 * - AnswerQuestionsAboutRyanInput - The input type for the answerQuestionsAboutRyan function.
 * - AnswerQuestionsAboutRyanOutput - The return type for the answerQuestionsAboutRyan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerQuestionsAboutRyanInputSchema = z.object({
  question: z.string().describe('The question to ask about Ryan Radityatama.'),
  profile: z.string().describe('Ryan Radityatama profile information.'),
});
export type AnswerQuestionsAboutRyanInput = z.infer<typeof AnswerQuestionsAboutRyanInputSchema>;

const AnswerQuestionsAboutRyanOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about Ryan Radityatama.'),
});
export type AnswerQuestionsAboutRyanOutput = z.infer<typeof AnswerQuestionsAboutRyanOutputSchema>;

export async function answerQuestionsAboutRyan(input: AnswerQuestionsAboutRyanInput): Promise<AnswerQuestionsAboutRyanOutput> {
  return answerQuestionsAboutRyanFlow(input);
}

const answerQuestionsAboutRyanPrompt = ai.definePrompt({
  name: 'answerQuestionsAboutRyanPrompt',
  input: {schema: AnswerQuestionsAboutRyanInputSchema},
  output: {schema: AnswerQuestionsAboutRyanOutputSchema},
  prompt: `You are a chatbot designed to answer questions about Ryan Radityatama.
  Use the following profile information to answer the question.

  Profile: {{{profile}}}

  Question: {{{question}}}

  Answer: `,
});

const answerQuestionsAboutRyanFlow = ai.defineFlow(
  {
    name: 'answerQuestionsAboutRyanFlow',
    inputSchema: AnswerQuestionsAboutRyanInputSchema,
    outputSchema: AnswerQuestionsAboutRyanOutputSchema,
  },
  async input => {
    const {output} = await answerQuestionsAboutRyanPrompt(input);
    return output!;
  }
);
