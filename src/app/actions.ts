'use server';

import { generateNote, noteGenerationInputSchema, type NoteGenerationInput } from '@/ai/flows/note-flow';
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
