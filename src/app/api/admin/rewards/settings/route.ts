import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const SETTINGS_DATA_FILE = path.join(process.cwd(), 'data', 'reward-settings.json');

interface RewardSettings {
  globalMultiplier: number;
  dailyResetTime: string;
  maxRewardsPerDay: number;
  vipBonusMultiplier: number;
  referralLevels: {
    level: number;
    percentage: number;
    maxDepth: number;
  }[];
}

const DEFAULT_SETTINGS: RewardSettings = {
  globalMultiplier: 1.0,
  dailyResetTime: '00:00',
  maxRewardsPerDay: 10,
  vipBonusMultiplier: 1.5,
  referralLevels: [
    { level: 1, percentage: 5, maxDepth: 3 },
    { level: 2, percentage: 2, maxDepth: 2 },
    { level: 3, percentage: 1, maxDepth: 1 }
  ]
};

async function ensureSettingsFile() {
  try {
    await fs.access(SETTINGS_DATA_FILE);
  } catch {
    const dataDir = path.dirname(SETTINGS_DATA_FILE);
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(SETTINGS_DATA_FILE, JSON.stringify({ settings: DEFAULT_SETTINGS }, null, 2));
  }
}

async function readSettingsData(): Promise<{ settings: RewardSettings }> {
  await ensureSettingsFile();
  try {
    const data = await fs.readFile(SETTINGS_DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return { settings: DEFAULT_SETTINGS };
  }
}

async function writeSettingsData(data: { settings: RewardSettings }): Promise<void> {
  await ensureSettingsFile();
  await fs.writeFile(SETTINGS_DATA_FILE, JSON.stringify(data, null, 2));
}

export async function GET() {
  try {
    const data = await readSettingsData();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to load settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { settings } = body;

    if (!settings) {
      return NextResponse.json(
        { error: 'Invalid settings data' },
        { status: 400 }
      );
    }

    await writeSettingsData({ settings });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to save settings' },
      { status: 500 }
    );
  }
}
