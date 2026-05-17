'use server';

/**
 * @fileOverview Budget Qualifier Agent — part of the Agentic AI pipeline.
 * Classifies visitor intent (client vs recruiter) and determines budget tier.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// --- Intent Classification ---

const IntentInputSchema = z.object({
  message: z.string(),
  history: z.array(z.object({ role: z.enum(['user', 'assistant']), content: z.string() })).optional(),
});

const IntentOutputSchema = z.object({
  intent: z.enum(['client', 'recruiter', 'unknown']),
  reply: z.string(),
});

export type IntentInput = z.infer<typeof IntentInputSchema>;
export type IntentOutput = z.infer<typeof IntentOutputSchema>;

const intentPrompt = ai.definePrompt({
  name: 'intentClassifierPrompt',
  input: { schema: IntentInputSchema },
  output: { schema: IntentOutputSchema },
  prompt: `You are a friendly AI assistant on Ryan Radityatama's portfolio website.
Your job is to determine if the visitor is:
- A "client" — someone looking to hire Ryan for a project (freelance, contract, or agency work)
- A "recruiter" — someone looking to hire Ryan as an employee (full-time or part-time job)
- "unknown" — unclear, needs more info

Conversation so far:
{{#if history}}
{{#each history}}{{role}}: {{content}}
{{/each}}
{{/if}}
Visitor: {{message}}

Respond with a warm, engaging reply that:
1. Acknowledges what they said
2. If intent is clear, confirms it and explains what comes next
3. If intent is "unknown", asks a clarifying question
4. Never mentions "classifying" or "detecting" — just be natural

Keep reply under 3 sentences.`,
});

export const classifyIntentFlow = ai.defineFlow(
  { name: 'classifyIntentFlow', inputSchema: IntentInputSchema, outputSchema: IntentOutputSchema },
  async (input) => {
    const { output } = await intentPrompt(input);
    return output!;
  }
);

// --- Budget Tier Classification ---

const BudgetInputSchema = z.object({
  budget: z.string().describe('The budget range the user selected or described'),
  projectDescription: z.string().optional().describe('What the user wants to build'),
});

const BudgetOutputSchema = z.object({
  tier: z.enum(['starter', 'standard', 'professional', 'enterprise']),
  tierLabel: z.string(),
  priceRange: z.string(),
  deliverables: z.array(z.string()),
  timeline: z.string(),
  reply: z.string(),
  scopeQuestions: z.array(z.string()),
});

export type BudgetInput = z.infer<typeof BudgetInputSchema>;
export type BudgetOutput = z.infer<typeof BudgetOutputSchema>;

const budgetPrompt = ai.definePrompt({
  name: 'budgetClassifierPrompt',
  input: { schema: BudgetInputSchema },
  output: { schema: BudgetOutputSchema },
  prompt: `You are a helpful assistant for Ryan Radityatama, a web developer.
Based on the budget and project description, classify the service tier and return the details.

Budget: {{budget}}
{{#if projectDescription}}Project: {{projectDescription}}{{/if}}

Use this tier system:
- starter: under $300 → Landing page, static site, basic form, 1 revision, 5-7 day turnaround
- standard: $300-$1000 → Multi-page website, CMS (WordPress/Contentful), contact form, basic SEO, 2 revisions, 2-3 weeks
- professional: $1000-$3000 → Full web app, database, user auth, API integrations, 3 revisions, 3-6 weeks
- enterprise: over $3000 → SaaS, AI features, custom architecture, dedicated support, 4+ revisions, timeline varies

For the reply: be warm, enthusiastic, and explain what Ryan can build for them at this tier.
For scopeQuestions: return 3 relevant questions for this specific tier to understand their project better.`,
});

export const classifyBudgetFlow = ai.defineFlow(
  { name: 'classifyBudgetFlow', inputSchema: BudgetInputSchema, outputSchema: BudgetOutputSchema },
  async (input) => {
    const { output } = await budgetPrompt(input);
    return output!;
  }
);

export async function classifyIntent(input: IntentInput): Promise<IntentOutput> {
  return classifyIntentFlow(input);
}

export async function classifyBudget(input: BudgetInput): Promise<BudgetOutput> {
  return classifyBudgetFlow(input);
}
