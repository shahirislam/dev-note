'use server';

import { genkit } from 'genkit';
import { z } from 'zod';
import { gemini15Flash, googleAI } from '@genkit-ai/googleai';
import { noteGenerationInputSchema, type NoteGenerationInput, noteGenerationOutputSchema, type NoteGenerationOutput } from '@/ai/schemas/note-schema';

const noteGenerationWithKeyInputSchema = noteGenerationInputSchema.extend({
    apiKey: z.string().optional(),
});
type NoteGenerationWithKeyInput = z.infer<typeof noteGenerationWithKeyInputSchema>;

export async function generateNote(input: NoteGenerationWithKeyInput): Promise<NoteGenerationOutput> {
    try {
        const dynamicAi = genkit({
            plugins: [googleAI({ apiKey: input.apiKey })],
        });

        const { output } = await dynamicAi.generate({
            model: gemini15Flash,
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
            output: { schema: noteGenerationOutputSchema },
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
