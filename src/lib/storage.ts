'use server';

/**
 * Storage utility that prefers Netlify Blobs (when available) and falls back to local filesystem.
 * This keeps APIs functional in serverless environments while remaining compatible locally.
 */

import * as fs from 'fs/promises';
import * as path from 'path';

type JsonValue = any;

const DATA_DIR = path.join(process.cwd(), 'data');

// Dynamically import Netlify blobs only when needed/available
async function getBlobStore() {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - imported dynamically if available at runtime
    const { getStore } = await import('@netlify/blobs');
    const store = getStore({ name: 'app-data', consistency: 'eventual' });
    return store;
  } catch {
    return null;
  }
}

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // ignore
  }
}

export async function readJson<T extends JsonValue>(key: string, fallback: T): Promise<T> {
  // Try blobs first (in Netlify)
  const store = await getBlobStore();
  if (store) {
    try {
      const blob = await store.get(key, { type: 'json' });
      if (blob) return blob as T;
    } catch {
      // ignore and try filesystem
    }
  }

  // Fallback to filesystem
  try {
    const filePath = path.join(DATA_DIR, key);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch {
    return fallback;
  }
}

export async function writeJson<T extends JsonValue>(key: string, data: T): Promise<void> {
  // Try blobs first
  const store = await getBlobStore();
  if (store) {
    try {
      await store.set(key, JSON.stringify(data));
      return;
    } catch {
      // ignore and try filesystem
    }
  }

  // Fallback to filesystem
  try {
    await ensureDataDir();
    const filePath = path.join(DATA_DIR, key);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch {
    // Ignore write failures to avoid crashing in read-only environments
  }
}