'use server';

import { run } from '@genkit-ai/next';
import { noteFlow, noteGenerationInputSchema } from '@/ai/flows/note-flow';
import { z } from 'zod';

export async function generateNoteAction(input: z.infer<typeof noteGenerationInputSchema>) {
  try {
    const validatedInput = noteGenerationInputSchema.parse(input);
    return await run(noteFlow, validatedInput);
  } catch (error) {
    console.error("Error running noteFlow action:", error);
    if (error instanceof z.ZodError) {
      // Handle validation errors specifically
      return null;
    }
    return null;
  }
}
