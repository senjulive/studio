import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Configure AI with error handling
const plugins = [];
try {
  // Only add Google AI if API key is available
  if (process.env.GOOGLE_AI_API_KEY) {
    plugins.push(googleAI());
  }
} catch (error) {
  console.warn('Google AI plugin could not be initialized:', error);
}

export const ai = genkit({
  plugins,
  model: process.env.GOOGLE_AI_API_KEY ? 'googleai/gemini-2.0-flash' : undefined,
});
