import { summarizeMarket, type MarketSummaryInput } from '@/ai/flows/market-summary-flow';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as MarketSummaryInput;

    // Validate input
    if (!input.coins || !Array.isArray(input.coins) || input.coins.length === 0) {
      return NextResponse.json(
        { error: 'Invalid input: coins array is required' },
        { status: 400 }
      );
    }

    const result = await summarizeMarket(input);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Market summary API error:', error);

    // Return a fallback summary instead of an error
    const fallbackSummary = generateFallbackSummary();
    return NextResponse.json(fallbackSummary);
  }
}

// Generate a basic market summary when AI is unavailable
function generateFallbackSummary(): { summary: string } {
  return {
    summary: "Market analysis is temporarily unavailable. The cryptocurrency market continues to show dynamic price movements with various assets experiencing different trends. Please check individual asset performance for detailed insights. Our AI-powered analysis will be restored shortly."
  };
}
