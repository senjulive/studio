'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Check = {
  name: string;
  url: string;
  method?: 'GET' | 'POST';
  body?: any;
};

type Result = {
  name: string;
  url: string;
  ok: boolean;
  status: number;
  timeMs: number;
  error?: string;
  data?: any;
};

const checks: Check[] = [
  { name: 'Health', url: '/api/health' },
  { name: 'DB Health', url: '/api/db/health' },
  { name: 'App Data', url: '/api/app-data' },
  { name: 'Public Settings', url: '/api/public-settings?key=botTierSettings' },
  { name: 'Public Chat (GET)', url: '/api/chat/public' },
  // Flagged routes – may return 503
  { name: 'Market Summary (POST)', url: '/api/market-summary', method: 'POST', body: { coins: [{ name: 'BTC', ticker: 'BTC', price: 68000, change24h: 1.2 }] } },
  { name: 'Support Agent (POST)', url: '/api/support-agent', method: 'POST', body: { messages: [{ role: 'user', content: 'Hello' }] } },
];

export default function SmokeTestPage() {
  const [results, setResults] = React.useState<Result[]>([]);
  const [running, setRunning] = React.useState(false);

  const run = React.useCallback(async () => {
    setRunning(true);
    const out: Result[] = [];
    for (const c of checks) {
      const started = performance.now();
      try {
        const res = await fetch(c.url, {
          method: c.method || 'GET',
          headers: c.method === 'POST' ? { 'Content-Type': 'application/json' } : undefined,
          body: c.method === 'POST' ? JSON.stringify(c.body || {}) : undefined,
        });
        const timeMs = Math.round(performance.now() - started);
        let data: any = null;
        try {
          data = await res.clone().json();
        } catch {
          try {
            data = await res.text();
          } catch {}
        }
        out.push({
          name: c.name,
          url: c.url,
          ok: res.ok,
          status: res.status,
          timeMs,
          data,
        });
      } catch (e: any) {
        const timeMs = Math.round(performance.now() - started);
        out.push({
          name: c.name,
          url: c.url,
          ok: false,
          status: 0,
          timeMs,
          error: e?.message || 'Network error',
        });
      }
    }
    setResults(out);
    setRunning(false);
  }, []);

  React.useEffect(() => {
    run();
  }, [run]);

  return (
    <main className="container mx-auto max-w-5xl p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Smoke Test</h1>
          <p className="text-muted-foreground">Pings key API endpoints and shows their status.</p>
        </div>
        <Button onClick={run} disabled={running}>
          {running ? 'Running…' : 'Run Again'}
        </Button>
      </div>

      <div className="grid gap-4">
        {results.map((r) => (
          <Card key={r.name + r.url}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className={r.ok ? 'text-green-600' : 'text-red-600'}>
                  {r.ok ? 'OK' : 'FAIL'}
                </span>
                <span>{r.name}</span>
              </CardTitle>
              <CardDescription>
                {r.url} — {r.status} — {r.timeMs}ms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-xs whitespace-pre-wrap break-all">
                {typeof r.data === 'string' ? r.data : JSON.stringify(r.data ?? { error: r.error }, null, 2)}
              </pre>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}