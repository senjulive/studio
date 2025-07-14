// This file is a simple JSON file database for demonstration purposes.
// It allows the app to persist data without a full database setup.
// In a production environment, this would be replaced with a real database like PostgreSQL, MongoDB, or Supabase.
'use server';

import fs from 'fs/promises';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

async function ensureDbReady(fileName: string, defaultData: any) {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.access(path.join(dataDir, fileName));
  } catch (error) {
    // If the file doesn't exist, create it with default data.
    await fs.writeFile(path.join(dataDir, fileName), JSON.stringify(defaultData, null, 2), 'utf-8');
  }
}

export async function readDb(fileName: string, defaultData: any = {}) {
  await ensureDbReady(fileName, defaultData);
  const filePath = path.join(dataDir, fileName);
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

export async function writeDb(fileName: string, data: any) {
  const filePath = path.join(dataDir, fileName);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
