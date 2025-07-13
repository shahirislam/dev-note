'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { noteGenerationInputSchema, type NoteGenerationInput, noteGenerationOutputSchema, type NoteGenerationOutput } from '@/ai/schemas/note-schema';

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
    inputSchema: noteGenerationInputSchema,
    outputSchema: noteGenerationOutputSchema,
  },
  async (input) => {
    try {
        const { output } = await noteGenerationPrompt(input);
        return output!;
    } catch (error) {
        console.error("Error generating note with LLM:", error);
        // Return a structured error response
        return {
            title: "Error",
            content: "Sorry, I was unable to generate a note at this time."
        };
    }
  }
);

export async function generateNote(input: NoteGenerationInput): Promise<NoteGenerationOutput> {
  return await noteFlow(input);
}