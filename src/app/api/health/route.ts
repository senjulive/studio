import { NextRequest, NextResponse } from 'next/server';

// Health check endpoint for deployment monitoring
export async function GET(request: NextRequest) {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      platform: process.env.DEPLOYMENT_PLATFORM || 'unknown',
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      },
      services: {
        database: await checkDatabase(),
        redis: await checkRedis(),
        external_apis: await checkExternalAPIs(),
      },
    };

    return NextResponse.json(health, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { 
        status: 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    );
  }
}

// Database connectivity check
async function checkDatabase(): Promise<{ status: string; latency?: number }> {
  try {
    const start = Date.now();
    
    // Simulated database check - replace with actual database ping
    // const result = await db.raw('SELECT 1');
    await new Promise(resolve => setTimeout(resolve, 10)); // Simulate DB query
    
    const latency = Date.now() - start;
    
    return {
      status: 'connected',
      latency,
    };
  } catch (error) {
    return {
      status: 'disconnected',
    };
  }
}

// Redis connectivity check
async function checkRedis(): Promise<{ status: string; latency?: number }> {
  try {
    const start = Date.now();
    
    // Simulated Redis check - replace with actual Redis ping
    // const result = await redis.ping();
    await new Promise(resolve => setTimeout(resolve, 5)); // Simulate Redis ping
    
    const latency = Date.now() - start;
    
    return {
      status: 'connected',
      latency,
    };
  } catch (error) {
    return {
      status: 'disconnected',
    };
  }
}

// External APIs connectivity check
async function checkExternalAPIs(): Promise<{ [key: string]: { status: string; latency?: number } }> {
  const apis = {
    coincap: 'https://api.coincap.io/v2/assets/bitcoin',
    builder: 'https://cdn.builder.io/api/v1/status',
  };

  const results: { [key: string]: { status: string; latency?: number } } = {};

  for (const [name, url] of Object.entries(apis)) {
    try {
      const start = Date.now();
      const response = await fetch(url, {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
      const latency = Date.now() - start;

      results[name] = {
        status: response.ok ? 'available' : 'error',
        latency,
      };
    } catch (error) {
      results[name] = {
        status: 'unavailable',
      };
    }
  }

  return results;
}

// Alternative endpoint alias
export { GET as HEAD };
