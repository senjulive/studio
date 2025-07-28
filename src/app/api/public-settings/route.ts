
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const settingsFilePath = path.join(process.cwd(), 'src/data/settings.json');

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    if (!key) {
        return NextResponse.json({ error: 'Missing settings key' }, { status: 400 });
    }

    try {
        const settingsData = fs.readFileSync(settingsFilePath, 'utf-8');
        const settings = JSON.parse(settingsData);
        const value = settings[key];
        
        if (value !== undefined) {
            return NextResponse.json(value);
        } else {
            return NextResponse.json(null);
        }
    } catch (error) {
        return NextResponse.json(null);
    }
}
