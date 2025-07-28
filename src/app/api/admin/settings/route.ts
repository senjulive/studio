
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const settingsFilePath = path.join(process.cwd(), 'src/data/settings.json');

function readSettings() {
    try {
        const jsonData = fs.readFileSync(settingsFilePath, 'utf-8');
        return JSON.parse(jsonData);
    } catch (error) {
        return {};
    }
}

function writeSettings(data: any) {
    fs.writeFileSync(settingsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function POST(req: Request) {
    const { key, value } = await req.json();
    if (!key || value === undefined) {
        return NextResponse.json({ error: 'Missing key or value' }, { status: 400 });
    }
    const settings = readSettings();
    settings[key] = value;
    writeSettings(settings);
    return NextResponse.json({ success: true });
}
