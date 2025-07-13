import { defineFlow } from '@genkit-ai/flow';
import { ai } from '../genkit';
import { z } from 'zod';

export const noteGenerationInputSchema = z.object({
  contextNotes: z.array(z.string()),
  prompt: z.string(),
});

export const noteFlow = defineFlow(
  {
    name: 'noteFlow',
    inputSchema: noteGenerationInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const llm = ai.model('googleai/gemini-2.0-flash');
    
    const contextText = input.contextNotes.length > 0 
      ? `Here are some existing notes for context:\n${input.contextNotes.map(note => `- ${note}`).join('\n')}`
      : "There are no existing notes for context.";

    const fullPrompt = `
You are an intelligent note-taking assistant for a software developer.
Based on the provided context and the user's prompt, generate a new, concise, and helpful note.
If the context is irrelevant to the prompt, ignore it and focus on the user's request.

${contextText}

User Prompt: "${input.prompt}"

---
Generated Note:
    `;

    try {
        const result = await llm.generate({
            prompt: fullPrompt,
        });

        return result.text();
    } catch (error) {
        console.error("Error generating note with LLM:", error);
        return "Sorry, I was unable to generate a note at this time.";
    }
  }
);
