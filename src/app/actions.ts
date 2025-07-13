'use server';

import { generateNote } from '@/ai/flows/note-flow';
import { noteGenerationInputSchema, type NoteGenerationInput } from '@/ai/schemas/note-schema';
import { z } from 'zod';

export async function generateNoteAction(input: NoteGenerationInput) {
  try {
    const validatedInput = noteGenerationInputSchema.parse(input);
    return await generateNote(validatedInput);
  } catch (error) {
    console.error("Error running noteFlow action:", error);
    if (error instanceof z.ZodError) {
      return null;
    }
    return null;
  }
}
