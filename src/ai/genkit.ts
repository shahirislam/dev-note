import {genkit, isConfigured} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import 'dotenv/config';

if (!isConfigured()) {
  genkit({
    plugins: [googleAI()],
  });
}

// Re-export ai object getter
export {ai} from 'genkit';
