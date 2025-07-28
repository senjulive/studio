
import { NextResponse } from 'next/server';
import promotions from '@/data/promotions.json';

export async function GET() {
    return NextResponse.json(promotions);
}
