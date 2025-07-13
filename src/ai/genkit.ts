import {genkit, isConfigured} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import 'dotenv/config';

// The new Genkit pattern initializes the 'ai' object immediately.
// This config will be used by default on the server.
const ai = genkit({
  plugins: [googleAI()],
});

// Re-export the initialized ai object.
export {ai};
