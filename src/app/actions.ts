'use server';

import { generateNote } from '@/ai/flows/note-flow';
import { noteGenerationInputSchema, type NoteGenerationInput, type NoteGenerationOutput } from '@/ai/schemas/note-schema';
import { z } from 'zod';
import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';

export async function generateNoteAction(input: NoteGenerationInput, apiKey: string): Promise<NoteGenerationOutput | null> {
  try {
    // Configure Genkit on the server with the user's key for this action
    if (!apiKey) {
      throw new Error("API key is missing.");
    }
    ai.configure({
      plugins: [googleAI({ apiKey })],
    });
    
    const validatedInput = noteGenerationInputSchema.parse(input);
    const result = await generateNote(validatedInput);

    if (result.title === 'Error') {
      return null;
    }
    return result;

  } catch (error) {
    console.error("Error running noteFlow action:", error);
    if (error instanceof z.ZodError) {
      return null;
    }
    // Handle other potential errors, like API key issues from Genkit
    return null;
  }
}
