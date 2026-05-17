'use server';

/**
 * @fileOverview Proposal Generator Agent — part of the Agentic AI pipeline.
 * Generates a custom project proposal based on budget tier, scope answers, and Ryan's portfolio.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { RYAN_PROFILE_DATA } from '@/lib/profile-data';

const ProposalInputSchema = z.object({
  visitorName: z.string().optional(),
  visitorCompany: z.string().optional(),
  tier: z.enum(['starter', 'standard', 'professional', 'enterprise']),
  tierLabel: z.string(),
  priceRange: z.string(),
  deliverables: z.array(z.string()),
  timeline: z.string(),
  projectDescription: z.string(),
  scopeAnswers: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })),
});

const ProposalOutputSchema = z.object({
  proposalTitle: z.string(),
  executiveSummary: z.string(),
  whyRyan: z.string(),
  includedFeatures: z.array(z.string()),
  timeline: z.string(),
  estimatedCost: z.string(),
  nextSteps: z.array(z.string()),
  relevantProjects: z.array(z.object({
    name: z.string(),
    relevance: z.string(),
  })),
  closingMessage: z.string(),
  emailDraft: z.string(),
});

export type ProposalInput = z.infer<typeof ProposalInputSchema>;
export type ProposalOutput = z.infer<typeof ProposalOutputSchema>;

const proposalPrompt = ai.definePrompt({
  name: 'proposalGeneratorPrompt',
  input: { schema: ProposalInputSchema },
  output: { schema: ProposalOutputSchema },
  prompt: `You are an expert proposal writer for Ryan Radityatama, a web developer.
Generate a compelling, professional project proposal based on the information below.

Ryan's Profile:
${RYAN_PROFILE_DATA}

Client Details:
- Name: {{visitorName}}
- Company: {{visitorCompany}}
- Service Tier: {{tierLabel}} ({{priceRange}})
- Project Description: {{projectDescription}}
- Timeline: {{timeline}}
- Standard Deliverables for this tier: {{deliverables}}

Scope Q&A:
{{#each scopeAnswers}}
Q: {{question}}
A: {{answer}}
{{/each}}

Generate:
1. proposalTitle: A specific, exciting title for this proposal (e.g. "Custom E-Commerce Platform for [Company]")
2. executiveSummary: 2-3 sentences summarizing what Ryan will build and why it's perfect for them
3. whyRyan: 2-3 sentences on why Ryan is the right developer for this specific project (match his real skills to their needs)
4. includedFeatures: List of 5-8 specific features/deliverables tailored to their project (not generic)
5. timeline: Realistic timeline for this specific project
6. estimatedCost: Specific cost estimate within their tier range
7. nextSteps: 3 concrete next steps (e.g. "Schedule a 30-min discovery call", "Review and sign project brief")
8. relevantProjects: 2-3 of Ryan's real projects that are most relevant (from his profile/portfolio)
9. closingMessage: A warm closing paragraph from Ryan
10. emailDraft: A full email Ryan would send to follow up, addressed to the visitor

Be specific, professional, and persuasive. Reference real skills and projects from Ryan's profile.`,
});

export const generateProposalFlow = ai.defineFlow(
  { name: 'generateProposalFlow', inputSchema: ProposalInputSchema, outputSchema: ProposalOutputSchema },
  async (input) => {
    const { output } = await proposalPrompt(input);
    return output!;
  }
);

export async function generateProposal(input: ProposalInput): Promise<ProposalOutput> {
  return generateProposalFlow(input);
}
