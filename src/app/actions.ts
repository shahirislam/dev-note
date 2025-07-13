'use server';

import { generateNote } from '@/ai/flows/note-flow';
import { noteGenerationInputSchema, type NoteGenerationInput, type NoteGenerationOutput } from '@/ai/schemas/note-schema';
import { z } from 'zod';

export async function generateNoteAction(input: NoteGenerationInput, apiKey: string): Promise<NoteGenerationOutput | null> {
  try {
    if (!apiKey) {
      throw new Error("API key is missing.");
    }
    
    const validatedInput = noteGenerationInputSchema.parse(input);
    
    const result = await generateNote({ ...validatedInput, apiKey });

    if (result.title === 'Error') {
      // Pass the specific error message to the client
      return { title: 'AI Generation Failed', content: result.content };
    }
    return result;

  } catch (error) {
    console.error("Error running noteFlow action:", error);
    if (error instanceof z.ZodError) {
      return { title: 'AI Generation Failed', content: 'Invalid input provided.' };
    }
    return { title: 'AI Generation Failed', content: 'An unexpected error occurred.' };
  }
}
