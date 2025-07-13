import { z } from 'zod';

export const noteGenerationInputSchema = z.object({
  contextNotes: z.array(z.string()),
  prompt: z.string(),
});
export type NoteGenerationInput = z.infer<typeof noteGenerationInputSchema>;


export const noteGenerationOutputSchema = z.object({
    title: z.string().describe("A concise, relevant title for the generated note."),
    content: z.string().describe("The full content of the generated note."),
});
export type NoteGenerationOutput = z.infer<typeof noteGenerationOutputSchema>;