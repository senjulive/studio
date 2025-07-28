
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const dataFilePath = path.join(process.cwd(), 'src/data/promotions.json');

function readPromotions() {
    try {
        const jsonData = fs.readFileSync(dataFilePath, 'utf-8');
        return JSON.parse(jsonData);
    } catch (error) {
        return [];
    }
}

function writePromotions(data: any) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function POST(req: Request) {
    const body = await req.json();
    const promotions = readPromotions();
    const newPromotion = {
        id: uuidv4(),
        created_at: new Date().toISOString(),
        ...body
    };
    promotions.push(newPromotion);
    writePromotions(promotions);
    return NextResponse.json(newPromotion);
}

export async function PUT(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const body = await req.json();
    let promotions = readPromotions();
    promotions = promotions.map((p: any) => (p.id === id ? { ...p, ...body } : p));
    writePromotions(promotions);
    return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
    const { promotionId } = await req.json();
    let promotions = readPromotions();
    promotions = promotions.filter((p: any) => p.id !== promotionId);
    writePromotions(promotions);
    return NextResponse.json({ success: true });
}
