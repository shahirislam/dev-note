import { z } from 'zod';

export const noteGenerationInputSchema = z.object({
  contextNotes: z.array(z.string()),
  prompt: z.string(),
});
export type NoteGenerationInput = z.infer<typeof noteGenerationInputSchema>;
