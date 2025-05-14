// src/ai/flows/analyze-house-plans.ts
'use server';

/**
 * @fileOverview AI flow to analyze house plans and suggest suitable contractors.
 *
 * - analyzeHousePlans - A function that analyzes house plans.
 * - AnalyzeHousePlansInput - The input type for the analyzeHousePlans function.
 * - AnalyzeHousePlansOutput - The return type for the analyzeHousePlans function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeHousePlansInputSchema = z.object({
  planDataUri: z
    .string()
    .describe(
      "A house plan document or image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
  projectDescription: z.string().describe('A description of the house project.'),
});

export type AnalyzeHousePlansInput = z.infer<typeof AnalyzeHousePlansInputSchema>;

const ContractorSuggestionSchema = z.object({
  contractorId: z.string().describe('The ID of the contractor.'),
  reason: z.string().describe('The reason why this contractor is suitable for the project.'),
});

const AnalyzeHousePlansOutputSchema = z.object({
  contractorSuggestions: z.array(ContractorSuggestionSchema).describe('A list of contractors who would be a good fit for the project.'),
});

export type AnalyzeHousePlansOutput = z.infer<typeof AnalyzeHousePlansOutputSchema>;

export async function analyzeHousePlans(input: AnalyzeHousePlansInput): Promise<AnalyzeHousePlansOutput> {
  return analyzeHousePlansFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeHousePlansPrompt',
  input: {schema: AnalyzeHousePlansInputSchema},
  output: {schema: AnalyzeHousePlansOutputSchema},
  prompt: `You are an AI assistant helping homeowners analyze their house plans and suggest suitable contractors for their projects.

  Given the following house plan and project description, suggest a list of contractors who would be a good fit for the project.

  House Plan: {{media url=planDataUri}}
  Project Description: {{{projectDescription}}}

  Consider various factors such as the contractor's expertise, experience, and specialization.
  For each contractor, provide a brief explanation of why they are a good fit for the project.
  `,
});

const analyzeHousePlansFlow = ai.defineFlow(
  {
    name: 'analyzeHousePlansFlow',
    inputSchema: AnalyzeHousePlansInputSchema,
    outputSchema: AnalyzeHousePlansOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
