
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuickAssistChatbotInputSchema = z.object({
  message: z.string().describe('The user message to the chatbot.'),
});
export type QuickAssistChatbotInput = z.infer<typeof QuickAssistChatbotInputSchema>;

const QuickAssistChatbotOutputSchema = z.object({
  response: z.string().describe('The chatbot response.'),
  suggestedRewrite: z.string().optional().describe('A suggested rewrite of the user message, if applicable.'),
});
export type QuickAssistChatbotOutput = z.infer<typeof QuickAssistChatbotOutputSchema>;

export async function quickAssistChatbot(input: QuickAssistChatbotInput): Promise<QuickAssistChatbotOutput> {
  return quickAssistChatbotFlow(input);
}

const faqAnswers = `
Q: How do I report a problem?
A: You can report a problem by clicking the "Report a Problem" button on the homepage and filling out the form.

Q: How do I upvote a problem?
A: You can upvote a problem by clicking the upvote button next to the problem description on the homepage or problem details page.

Q: How do I search for a problem?
A: You can search for a problem by using the search bar on the homepage and entering keywords, problem ID, or hashtags.

Q: What are the problem statuses?
A: The problem statuses are: Unsolved, Approved and Under Investigation, Solved, and Rejected.

Q: How do I track my complaint?
A: You can track your complaint status on the "Track your complaint" page, which you can find in the header. You will need your complaint ID.
`;

const prompt = ai.definePrompt({
  name: 'quickAssistChatbotPrompt',
  input: {schema: QuickAssistChatbotInputSchema},
  output: {schema: QuickAssistChatbotOutputSchema},
  prompt: `You are an empathetic AI chatbot powered by Gemini, assisting students with reporting problems. Your primary goal is to answer frequently asked questions and help them articulate their problems clearly before submission.

  Here are some frequently asked questions and their answers:
  ${faqAnswers}
  
  If the user's message is a question covered in the FAQs, provide a direct answer.
  If the user is describing a problem, gently suggest a rewrite to improve clarity and detail. Focus on encouraging the user to provide specific information about the issue they are facing.
  If the user asks a simple logical or general knowledge question (like a math problem), provide the answer. However, if they continue with off-topic questions, gently guide them back to the chatbot's main purpose of assisting with campus-related problems.
  If the user asks about the status of an issue or how to track it, explain that they can use the "Track your complaint" page and will need their complaint ID.

  User Message: {{{message}}}

  Your Response: (Provide only the text for your response, with no extra formatting or newlines)
`,
  config: {
    safetySettings: [
        {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_ONLY_HIGH',
        },
        {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_ONLY_HIGH',
        },
        {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_ONLY_HIGH',
        },
        {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_ONLY_HIGH',
        },
    ]
  }
});

const quickAssistChatbotFlow = ai.defineFlow(
  {
    name: 'quickAssistChatbotFlow',
    inputSchema: QuickAssistChatbotInputSchema,
    outputSchema: QuickAssistChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
