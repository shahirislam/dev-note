'use server';

import { generateNote } from '@/ai/flows/note-flow';
import { noteGenerationInputSchema, type NoteGenerationInput, type NoteGenerationOutput } from '@/ai/schemas/note-schema';
import { z } from 'zod';

export async function generateNoteAction(input: NoteGenerationInput, apiKey: string): Promise<NoteGenerationOutput | null> {
  try {
    if (!apiKey) {
      throw new Error("API key is missing.");
    }
    
    // Validate the user-provided input against the base schema
    const validatedInput = noteGenerationInputSchema.parse(input);
    
    // Call the flow with the validated input and the API key
    const result = await generateNote({ ...validatedInput, apiKey });

    if (result.title === 'Error') {
      return null;
    }
    return result;

  } catch (error) {
    console.error("Error running noteFlow action:", error);
    if (error instanceof z.ZodError) {
      return null;
    }
    return null;
  }
}
