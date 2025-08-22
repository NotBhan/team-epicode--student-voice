
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateHashtagsInputSchema = z.object({
  problemDescription: z
    .string()
    .describe('The description of the problem for which hashtags need to be generated.'),
});
export type GenerateHashtagsInput = z.infer<typeof GenerateHashtagsInputSchema>;

const GenerateHashtagsOutputSchema = z.object({
  hashtags: z
    .array(z.string())
    .describe('An array of relevant hashtags generated for the problem description.'),
});
export type GenerateHashtagsOutput = z.infer<typeof GenerateHashtagsOutputSchema>;

export async function generateHashtags(input: GenerateHashtagsInput): Promise<GenerateHashtagsOutput> {
  return generateHashtagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateHashtagsPrompt',
  input: {schema: GenerateHashtagsInputSchema},
  output: {schema: GenerateHashtagsOutputSchema},
  prompt: `You are an expert at generating relevant hashtags for problem descriptions. Given a problem description, generate an array of relevant hashtags.

Problem Description: {{{problemDescription}}}

Please provide the hashtags as a JSON array of strings.`,
});

const generateHashtagsFlow = ai.defineFlow(
  {
    name: 'generateHashtagsFlow',
    inputSchema: GenerateHashtagsInputSchema,
    outputSchema: GenerateHashtagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
