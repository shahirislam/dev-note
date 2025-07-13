'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { noteGenerationInputSchema, type NoteGenerationInput, noteGenerationOutputSchema, type NoteGenerationOutput } from '@/ai/schemas/note-schema';
import { googleAI } from '@genkit-ai/googleai';

// Update input schema to include the API key
const noteGenerationWithKeyInputSchema = noteGenerationInputSchema.extend({
    apiKey: z.string().optional(),
});
type NoteGenerationWithKeyInput = z.infer<typeof noteGenerationWithKeyInputSchema>;


const noteGenerationPrompt = ai.definePrompt({
    name: "noteGenerationPrompt",
    input: { schema: noteGenerationInputSchema },
    output: { schema: noteGenerationOutputSchema },
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

User Prompt: "{{prompt}}"

---
Generate a title and content for the new note.
`
});


const noteFlow = ai.defineFlow(
  {
    name: 'noteFlow',
    inputSchema: noteGenerationWithKeyInputSchema,
    outputSchema: noteGenerationOutputSchema,
  },
  async (input) => {
    try {
        const model = googleAI({ apiKey: input.apiKey });

        const { output } = await ai.generate({
            model: model,
            prompt: noteGenerationPrompt.prompt, // We use the raw prompt string
            input: {
                contextNotes: input.contextNotes,
                prompt: input.prompt,
            },
            output: {
                schema: noteGenerationOutputSchema,
            },
        });

        return output!;
    } catch (error) {
        console.error("Error generating note with LLM:", error);
        return {
            title: "Error",
            content: "Sorry, I was unable to generate a note at this time."
        };
    }
  }
);

// The exported function now accepts the key
export async function generateNote(input: NoteGenerationWithKeyInput): Promise<NoteGenerationOutput> {
  return await noteFlow(input);
}
