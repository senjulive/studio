
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src/data/moderators.json');

function readData() {
    try {
        const jsonData = fs.readFileSync(dataFilePath, 'utf-8');
        return JSON.parse(jsonData);
    } catch (error) {
        return { moderators: [] };
    }
}

function writeData(data: any) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET() {
    const data = readData();
    return NextResponse.json(data.moderators);
}

export async function POST(req: Request) {
    const { moderators } = await req.json();
    const data = readData();
    data.moderators = moderators;
    writeData(data);
    return NextResponse.json({ success: true, data: data.moderators });
}
