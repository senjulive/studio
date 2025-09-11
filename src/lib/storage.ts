'use server';

/**
 * Cloud-agnostic JSON storage for serverless:
 * - Postgres (Supabase) via DATABASE_URL as a key-value store (preferred when configured)
 * - Vercel: @vercel/blob (preferred on Vercel)
 * - Netlify: @netlify/blobs
 * - Local dev: filesystem (data/*.json)
 *
 * Reads never throw; writes swallow failures to keep APIs functional in read-only envs.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { getPool, query } from './db';

type JsonValue = any;

const DATA_DIR = path.join(process.cwd(), 'data');
const BLOB_PREFIX = process.env.BLOB_PREFIX || 'app-data/';

function keyToPath(key: string) {
  const cleaned = key.startsWith('/') ? key.slice(1) : key;
  return `${BLOB_PREFIX}${cleaned}`;
}

// Initialize Postgres KV table lazily
let dbInited = false;
async function ensureDbKv() {
  if (dbInited) return;
  const pool = getPool();
  if (!pool) return;
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS app_kv (
        k TEXT PRIMARY KEY,
        v JSONB NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT now()
      )
    `);
  } catch {
    // ignore init failure, fallback to other backends
    return;
  }
  dbInited = true;
}

// Dynamically import Vercel Blob only when available
async function getVercelBlob() {
  try {
    // @ts-ignore
    const mod = await import('@vercel/blob');
    return mod;
  } catch {
    return null;
  }
}

// Dynamically import Netlify blobs only when needed/available
async function getNetlifyBlobStore() {
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
  // Try Postgres KV first if configured
  const pool = getPool();
  if (pool) {
    try {
      await ensureDbKv();
      const res = await query<{ v: T }>('SELECT v FROM app_kv WHERE k = $1 LIMIT 1', [key]);
      if (res.rows.length > 0) {
        return res.rows[0].v as T;
      }
    } catch {
      // ignore and continue
    }
  }

  // Try Vercel Blob
  const vercelBlob = await getVercelBlob();
  if (vercelBlob) {
    try {
      const { list } = vercelBlob as { list: (args: any) => Promise<any> };
      const blobPath = keyToPath(key);
      const { blobs } = await list({ prefix: blobPath, limit: 1 });
      if (blobs && blobs.length > 0) {
        const url = blobs[0].url as string;
        const resp = await fetch(url, { cache: 'no-store' });
        if (resp.ok) {
          const json = (await resp.json()) as T;
          return json;
        }
      }
    } catch {
      // ignore and continue
    }
  }

  // Try Netlify Blobs
  const store = await getNetlifyBlobStore();
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
  // Try Postgres KV first if configured
  const pool = getPool();
  if (pool) {
    try {
      await ensureDbKv();
      await query(
        `INSERT INTO app_kv (k, v, updated_at)
         VALUES ($1, $2::jsonb, now())
         ON CONFLICT (k)
         DO UPDATE SET v = EXCLUDED.v, updated_at = now()`,
        [key, JSON.stringify(data)]
      );
      return;
    } catch {
      // ignore and continue
    }
  }

  // Try Vercel Blob
  const vercelBlob = await getVercelBlob();
  if (vercelBlob) {
    try {
      const { put } = vercelBlob as { put: (pathname: string, body: string | Blob | ArrayBufferView, opts?: any) => Promise<any> };
      await put(keyToPath(key), JSON.stringify(data), { contentType: 'application/json' });
      return;
    } catch {
      // ignore and try next
    }
  }

  // Try Netlify Blobs
  const store = await getNetlifyBlobStore();
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