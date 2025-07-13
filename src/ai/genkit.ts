import {genkit, isConfigured} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const configureGenkit = (apiKey?: string) => {
  if (isConfigured()) {
    return;
  }
  
  const plugins = [];
  if (apiKey) {
    plugins.push(googleAI({apiKey}));
  } else {
    // If no API key is provided, we can't use Google AI.
    // You might want to add other plugins here that don't require an API key.
  }
  
  genkit({
    plugins,
  });
};

// Re-export ai object getter
export {ai} from 'genkit';
