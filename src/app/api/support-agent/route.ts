
import { NextResponse } from 'next/server';

const ENABLE_SUPPORT_AGENT = process.env.ENABLE_SUPPORT_AGENT === 'true';

export async function POST(request: Request) {
  if (!ENABLE_SUPPORT_AGENT) {
    return NextResponse.json(
      { error: 'Support agent analysis is disabled in this environment.' },
      { status: 503 }
    );
  }
  try {
    // Use eval('import(...)') so webpack cannot statically analyze or bundle the flow (avoids handlebars warnings).
    const loadFlow = () =>
      eval('import("@/ai/flows/support-agent-flow")') as Promise<
        typeof import('@/ai/flows/support-agent-flow')
      >;

    const { analyzeSupportThread } = await loadFlow();
    const input = await request.json();
    const result = await analyzeSupportThread(input as any);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
