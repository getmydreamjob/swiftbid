// src/ai/flows/match-contractors.ts
'use server';

/**
 * @fileOverview AI flow to suggest suitable contractors based on house plans and project description.
 *
 * - suggestSuitableContractors - A function that suggests suitable contractors.
 * - SuggestSuitableContractorsInput - The input type for the suggestSuitableContractors function.
 * - SuggestSuitableContractorsOutput - The return type for the suggestSuitableContractors function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSuitableContractorsInputSchema = z.object({
  planDataUri: z
    .string()
    .describe(
      "A house plan document or image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
  projectDescription: z.string().describe('A description of the house project.'),
  clarifyingQuestions: z.string().optional().describe('Optional clarifying questions about the project.'),
});

export type SuggestSuitableContractorsInput = z.infer<typeof SuggestSuitableContractorsInputSchema>;

const ContractorTagSchema = z.object({
  tagName: z.string().describe('Name of the contractor tag'),
  score: z.number().describe('The score of the contractor for the given tag.')
});

const SuggestedContractorSchema = z.object({
  contractorId: z.string().describe('The ID of the contractor.'),
  tags: z.array(ContractorTagSchema).describe('Tags associated with the contractor and their scores.'),
  overallScore: z.number().describe('Overall suitability score for the contractor.'),
});

const SuggestSuitableContractorsOutputSchema = z.object({
  suggestedContractors: z.array(SuggestedContractorSchema).describe('A list of suggested contractors with their suitability scores and tags.'),
});

export type SuggestSuitableContractorsOutput = z.infer<typeof SuggestSuitableContractorsOutputSchema>;

export async function suggestSuitableContractors(input: SuggestSuitableContractorsInput): Promise<SuggestSuitableContractorsOutput> {
  return suggestSuitableContractorsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSuitableContractorsPrompt',
  input: {schema: SuggestSuitableContractorsInputSchema},
  output: {schema: SuggestSuitableContractorsOutputSchema},
  prompt: `You are an AI assistant helping homeowners find suitable contractors for their house plan projects.

  Given the following house plan and project description, suggest a list of contractors who would be a good fit for the project.

  House Plan: {{media url=planDataUri}}
  Project Description: {{{projectDescription}}}
  Clarifying Questions: {{{clarifyingQuestions}}}

  Consider various factors such as the contractor's expertise, experience, and specialization.
  Each contractor should have an overall suitability score, as well as scores for a variety of tags.
  `,
});

const suggestSuitableContractorsFlow = ai.defineFlow(
  {
    name: 'suggestSuitableContractorsFlow',
    inputSchema: SuggestSuitableContractorsInputSchema,
    outputSchema: SuggestSuitableContractorsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
