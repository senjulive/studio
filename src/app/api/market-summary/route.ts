
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
    // Use eval('import(...)') so webpack cannot statically analyze or bundle the flow (avoids handlebars warnings).
    const loadFlow = () =>
      eval('import("@/ai/flows/market-summary-flow")') as Promise<
        typeof import('@/ai/flows/market-summary-flow')
      >;

    const { summarizeMarket } = await loadFlow();
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
