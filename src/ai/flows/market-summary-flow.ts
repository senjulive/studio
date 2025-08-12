'use server';
/**
 * @fileOverview An AI flow to generate a summary of the cryptocurrency market.
 *
 * - summarizeMarket - A function that analyzes market data and returns a summary.
 * - MarketSummaryInput - The input type for the summarizeMarket function.
 * - MarketSummaryOutput - The return type for the summarizeMarket function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CryptoDataSchema = z.object({
  name: z.string(),
  ticker: z.string(),
  price: z.number(),
  change24h: z.number().describe('The percentage change in price over the last 24 hours.'),
});

const MarketSummaryInputSchema = z.object({
  coins: z.array(CryptoDataSchema).describe("A list of cryptocurrencies with their current market data."),
});
export type MarketSummaryInput = z.infer<typeof MarketSummaryInputSchema>;

const MarketSummaryOutputSchema = z.object({
  summary: z.string().describe("A concise and insightful summary of the current crypto market state, formatted as a single paragraph."),
});
export type MarketSummaryOutput = z.infer<typeof MarketSummaryOutputSchema>;

export async function summarizeMarket(input: MarketSummaryInput): Promise<MarketSummaryOutput> {
  try {
    // Check if API key is configured
    if (!process.env.GOOGLE_AI_API_KEY) {
      return generateAnalyticFallback(input);
    }

    return await marketSummaryFlow(input);
  } catch (error) {
    console.error('AI market analysis failed:', error);
    return generateAnalyticFallback(input);
  }
}

// Generate a data-driven fallback summary when AI is unavailable
function generateAnalyticFallback(input: MarketSummaryInput): MarketSummaryOutput {
  const { coins } = input;
  const positiveCoins = coins.filter(c => c.change24h > 0);
  const negativeCoins = coins.filter(c => c.change24h < 0);
  const avgChange = coins.reduce((sum, c) => sum + c.change24h, 0) / coins.length;

  const topGainer = coins.reduce((max, coin) => coin.change24h > max.change24h ? coin : max);
  const topLoser = coins.reduce((min, coin) => coin.change24h < min.change24h ? coin : min);

  let summary = `Market Analysis (${new Date().toLocaleDateString()}): `;

  if (avgChange > 2) {
    summary += `The market is showing strong bullish momentum with an average gain of ${avgChange.toFixed(1)}%. `;
  } else if (avgChange > 0) {
    summary += `The market is displaying modest positive sentiment with an average gain of ${avgChange.toFixed(1)}%. `;
  } else if (avgChange > -2) {
    summary += `The market is experiencing mild consolidation with an average change of ${avgChange.toFixed(1)}%. `;
  } else {
    summary += `The market is facing bearish pressure with an average decline of ${Math.abs(avgChange).toFixed(1)}%. `;
  }

  summary += `${topGainer.name} leads gains at +${topGainer.change24h.toFixed(1)}%, while ${topLoser.name} shows the largest decline at ${topLoser.change24h.toFixed(1)}%. `;
  summary += `${positiveCoins.length} of ${coins.length} assets are trading in the green. `;
  summary += `This automated analysis provides a snapshot of current market conditions based on 24-hour price movements.`;

  return { summary };
}

const prompt = ai.definePrompt({
  name: 'marketSummaryPrompt',
  input: {schema: MarketSummaryInputSchema},
  output: {schema: MarketSummaryOutputSchema},
  prompt: `You are an expert financial analyst for AstralCore, specializing in the cryptocurrency market.
Your task is to provide a clear and concise market summary based on the real-time data provided.
The summary should be a single paragraph, easy for a general audience to understand, highlighting key trends, significant price movements, and the overall market sentiment.

Analyze the following market data:
{{#each coins}}
- {{name}} ({{ticker}}): Price: $\{{price}}, 24h Change: {{change24h}}%
{{/each}}

Based on this data, generate a professional market summary. Mention any standout performers (both positive and negative) and give a brief outlook.
`,
});

const marketSummaryFlow = ai.defineFlow(
  {
    name: 'marketSummaryFlow',
    inputSchema: MarketSummaryInputSchema,
    outputSchema: MarketSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
