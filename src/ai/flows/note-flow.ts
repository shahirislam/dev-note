'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { googleAI } from '@genkit-ai/googleai'; // Import googleAI
import { noteGenerationInputSchema, type NoteGenerationInput, noteGenerationOutputSchema, type NoteGenerationOutput } from '@/ai/schemas/note-schema';

// Update input schema to include the API key
const noteGenerationWithKeyInputSchema = noteGenerationInputSchema.extend({
    apiKey: z.string().optional(),
});
type NoteGenerationWithKeyInput = z.infer<typeof noteGenerationWithKeyInputSchema>;


const noteFlow = ai.defineFlow(
  {
    name: 'noteFlow',
    inputSchema: noteGenerationWithKeyInputSchema,
    outputSchema: noteGenerationOutputSchema,
  },
  async (input) => {
    try {
        // Create a new googleAI plugin instance with the provided API key
        const googleAiPlugin = googleAI({ apiKey: input.apiKey! });
        // Access the model from this specific plugin instance
        const geminiModel = googleAiPlugin.models['gemini-1.5-flash-latest'];

        const { output } = await geminiModel.generate({
            prompt: `
You are an intelligent note-taking assistant for a software developer.
Based on the provided context and the user's prompt, generate a new, concise, and helpful note with a relevant title.
If the context is irrelevant to the prompt, ignore it and focus on the user's request.

{{#if contextNotes}}
Here are some existing notes for context:
{{#each contextNotes}}
- {{this}}
{{/each}}
{{else}}
There are no existing notes for context.
{{/if}}

User Prompt: "${input.prompt}"

---
Generate a title and content for the new note.
`,
            config: {
                output: { schema: noteGenerationOutputSchema },
            },
            context: {
                contextNotes: input.contextNotes,
            }
        });
        return output!;
    } catch (error) {
        console.error("Error generating note with LLM:", error);
        return {
            title: "Error",
            content: "Sorry, I was unable to generate a note at this time. This could be due to an invalid API key or a network issue."
        };
    }
  }
);

export async function generateNote(input: NoteGenerationWithKeyInput): Promise<NoteGenerationOutput> {
  return await noteFlow(input);
}
