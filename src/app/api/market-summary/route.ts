
import { NextResponse } from 'next/server';

const ENABLE_MARKET_SUMMARY = process.env.ENABLE_MARKET_SUMMARY === 'true';

export async function POST(request: Request) {
  if (!ENABLE_MARKET_SUMMARY) {
    return NextResponse.json(
      { error: 'Market summary is disabled in this environment.' },
      { status: 503 }
    );
  }
  try {
    const { summarizeMarket, type: { MarketSummaryInput } = {} } = await import('@/ai/flows/market-summary-flow');
    const input = await request.json();
    const result = await summarizeMarket(input as any);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
