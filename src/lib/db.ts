'use server';

import { Pool, PoolClient, QueryResult } from 'pg';

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

function needsSSL(url: string) {
  // Supabase requires SSL in production; also respect ?sslmode=require if present
  return /supabase\.co|supabase\.com/.test(url) || /sslmode=require/.test(url);
}

function createPool(): Pool | null {
  const url = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL || '';
  if (!url) return null;

  // Basic pool with keepalive; avoid creating many pools in serverless by reusing global
  const pool = new Pool({
    connectionString: url,
    max: 5,
    idleTimeoutMillis: 20_000,
    connectionTimeoutMillis: 10_000,
    allowExitOnIdle: true,
    keepAlive: true,
    keepAliveInitialDelayMillis: 5_000,
    ssl: needsSSL(url) ? { rejectUnauthorized: false } : undefined,
  });

  return pool;
}

export function getPool(): Pool | null {
  if (!globalThis.__pgPool) {
    const p = createPool();
    if (!p) return null;
    globalThis.__pgPool = p;
  }
  return globalThis.__pgPool || null;
}

export async function query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
  const pool = getPool();
  if (!pool) {
    throw new Error('No DATABASE_URL configured');
  }
  return pool.query<T>(text, params);
}

export async function withClient<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const pool = getPool();
  if (!pool) {
    throw new Error('No DATABASE_URL configured');
  }
  const client = await pool.connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}