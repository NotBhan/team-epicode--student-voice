
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckMediaSourceInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type CheckMediaSourceInput = z.infer<typeof CheckMediaSourceInputSchema>;

const CheckMediaSourceOutputSchema = z.object({
    isAiGenerated: z.boolean().describe('Whether the image is likely AI-generated.'),
    reason: z.string().describe('The reasoning for the determination.'),
});
export type CheckMediaSourceOutput = z.infer<typeof CheckMediaSourceOutputSchema>;

export async function checkMediaSource(input: CheckMediaSourceInput): Promise<CheckMediaSourceOutput> {
  return checkMediaSourceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkMediaSourcePrompt',
  input: {schema: CheckMediaSourceInputSchema},
  output: {schema: CheckMediaSourceOutputSchema},
  prompt: `You are an expert at analyzing images to determine if they are AI-generated.

Analyze the following image and determine if it is likely to be AI-generated. Provide a brief reason for your conclusion.

Image: {{media url=imageDataUri}}`,
});

const checkMediaSourceFlow = ai.defineFlow(
  {
    name: 'checkMediaSourceFlow',
    inputSchema: CheckMediaSourceInputSchema,
    outputSchema: CheckMediaSourceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
