// src/ai/flows/ai-symptom-assessment.ts
'use server';
/**
 * @fileOverview An AI agent to provide preliminary assessment of sleep disorder based on user input symptoms.
 *
 * - assessSymptoms - A function that handles the symptom assessment process.
 * - SymptomAssessmentInput - The input type for the assessSymptoms function.
 * - SymptomAssessmentOutput - The return type for the assessSymptoms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SymptomAssessmentInputSchema = z.object({
  symptoms: z
    .string()
    .describe(
      'A comma-separated list of sleep-related symptoms experienced by the user (e.g., snoring, fatigue, pauses in breathing).'
    ),
});
export type SymptomAssessmentInput = z.infer<typeof SymptomAssessmentInputSchema>;

const SymptomAssessmentOutputSchema = z.object({
  assessment: z
    .string()
    .describe(
      'A preliminary assessment of potential sleep disorders based on the symptoms provided.'
    ),
  recommendation: z
    .string()
    .describe(
      'A recommendation on whether the user should seek professional help, based on the assessment.'
    ),
});
export type SymptomAssessmentOutput = z.infer<typeof SymptomAssessmentOutputSchema>;

export async function assessSymptoms(
  input: SymptomAssessmentInput
): Promise<SymptomAssessmentOutput> {
  return assessSymptomsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'symptomAssessmentPrompt',
  input: {schema: SymptomAssessmentInputSchema},
  output: {schema: SymptomAssessmentOutputSchema},
  prompt: `You are a sleep disorder expert. Analyze the following symptoms and provide a preliminary assessment of potential sleep disorders and a recommendation on whether the user should seek professional help.

Symptoms: {{{symptoms}}}`,
});

const assessSymptomsFlow = ai.defineFlow(
  {
    name: 'assessSymptomsFlow',
    inputSchema: SymptomAssessmentInputSchema,
    outputSchema: SymptomAssessmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
