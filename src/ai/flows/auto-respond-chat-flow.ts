
'use server';
/**
 * @fileOverview A Genkit flow to provide a conversational AI assistant for Ryan Radityatama.
 *
 * - autoRespondChat - A function that generates a conversational AI reply.
 * - AutoRespondChatInput - The input type for the autoRespondChat function.
 * - AutoRespondChatOutput - The return type for the autoRespondChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

const AutoRespondChatInputSchema = z.object({
  name: z.string().min(1, "Name is required").describe("The name of the user sending the message."),
  companyOrIndividual: z.string().optional().describe("The company or organization the user represents, or if they are an individual."),
  message: z.string().min(1, "Message is required").describe("The user's latest message content."),
  chatHistory: z.array(ChatMessageSchema).optional().describe("The history of the conversation so far, including previous user messages and AI responses."),
  profileContext: z.string().describe("Ryan Radityatama's profile information (e.g., CV)."),
});
export type AutoRespondChatInput = z.infer<typeof AutoRespondChatInputSchema>;

const AutoRespondChatOutputSchema = z.object({
  autoResponse: z.string().describe("The AI-generated conversational response."),
});
export type AutoRespondChatOutput = z.infer<typeof AutoRespondChatOutputSchema>;

export async function autoRespondChat(input: AutoRespondChatInput): Promise<AutoRespondChatOutput> {
  return autoRespondChatFlow(input);
}

const autoRespondChatPrompt = ai.definePrompt({
  name: 'autoRespondChatPrompt',
  input: {schema: AutoRespondChatInputSchema},
  output: {schema: AutoRespondChatOutputSchema},
  prompt: `You are a friendly, helpful, and highly capable AI assistant for Ryan Radityatama.
Your primary goal is to engage in a conversation with users visiting Ryan's portfolio website.
You should answer their questions based on Ryan's provided profile information, assist them, and maintain a natural, engaging conversation.

User's Name: {{{name}}}
{{#if companyOrIndividual}}User's Company/Organization: {{{companyOrIndividual}}}{{/if}}

Ryan's Profile Information (use this as your knowledge base about Ryan):
{{{profileContext}}}

Conversation History (most recent message is the user's current message below):
{{#if chatHistory}}
{{#each chatHistory}}
{{#if (eq role "user") }}User ({{{../name}}}):{{else}}Assistant:{{/if}} {{{content}}}
{{/each}}
{{/if}}
User ({{{name}}}): {{{message}}}

Assistant Response:
Based on the entire conversation history and Ryan's profile, provide a helpful and relevant response to the user's latest message.
If the user asks for direct contact, or if the conversation seems to be naturally concluding and it's appropriate, provide Ryan's contact details:
- Email: ryradit@gmail.com
- WhatsApp: +62813-8764-3604

Strive for natural, helpful, and engaging conversation. Do not just repeat information if it has already been covered or is not relevant.
If you don't know the answer to something not covered in Ryan's profile, politely say so and offer to help with information that is available or suggest they contact Ryan directly for more specific queries.
`,
});

const autoRespondChatFlow = ai.defineFlow(
  {
    name: 'autoRespondChatFlow',
    inputSchema: AutoRespondChatInputSchema,
    outputSchema: AutoRespondChatOutputSchema,
  },
  async (input) => {
    const {output} = await autoRespondChatPrompt(input);
    return output!;
  }
);
