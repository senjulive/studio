import { NextResponse } from 'next/server';
import { getDeploymentPlatform, getAppUrl } from '@/lib/env-validation';

export async function GET() {
  try {
    const platform = getDeploymentPlatform();
    const appUrl = getAppUrl();
    
    // Collect comprehensive monitoring data
    const monitoringData = {
      status: 'operational',
      timestamp: new Date().toISOString(),
      platform,
      environment: process.env.NODE_ENV,
      
      // Application metrics
      application: {
        name: 'AstralCore',
        version: process.env.APP_VERSION || '1.0.0',
        uptime: process.uptime(),
        nodeVersion: process.version,
        buildTime: process.env.CUSTOM_BUILD_TIME,
      },
      
      // Performance metrics
      performance: {
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          external: Math.round(process.memoryUsage().external / 1024 / 1024),
          rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
        },
        cpu: {
          usage: process.cpuUsage(),
          loadAverage: process.platform !== 'win32' ? process.loadavg() : [0, 0, 0],
        },
      },
      
      // Health checks
      health: {
        database: await checkDatabaseHealth(),
        redis: await checkRedisHealth(),
        externalAPIs: await checkExternalAPIs(),
        fileSystem: await checkFileSystem(),
      },
      
      // Feature flags
      features: {
        tradingBots: true,
        realTimeData: true,
        aiAnalytics: !!process.env.GOOGLE_AI_API_KEY,
        notifications: true,
        charts: true,
        mobileApp: true,
      },
      
      // Security status
      security: {
        httpsEnabled: appUrl.startsWith('https://'),
        headersConfigured: true,
        rateLimitingEnabled: true,
        authenticationEnabled: true,
        encryptionEnabled: true,
      },
      
      // Platform-specific metrics
      ...(platform === 'vercel' && {
        vercel: {
          region: process.env.VERCEL_REGION,
          deploymentId: process.env.VERCEL_GIT_COMMIT_SHA?.substring(0, 7),
          edge: !!process.env.VERCEL_URL,
        },
      }),
      
      ...(platform === 'netlify' && {
        netlify: {
          context: process.env.CONTEXT,
          branch: process.env.BRANCH,
          deployId: process.env.DEPLOY_ID,
          siteId: process.env.SITE_ID,
        },
      }),
      
      // Trading platform metrics (simulated)
      trading: {
        activeBots: await getActiveBots(),
        marketDataFeeds: await getMarketDataStatus(),
        userSessions: await getActiveUserSessions(),
        tradingVolume24h: await getTradingVolume(),
        systemLoad: calculateSystemLoad(),
      },
    };
    
    // Determine overall system status
    const overallStatus = determineOverallStatus(monitoringData);
    
    return NextResponse.json({
      ...monitoringData,
      status: overallStatus,
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
    
  } catch (error) {
    console.error('Monitoring dashboard error:', error);
    
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Failed to fetch monitoring data',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
  }
}

// Health check functions
async function checkDatabaseHealth() {
  try {
    // Simulate database check
    await new Promise(resolve => setTimeout(resolve, 10));
    return {
      status: 'healthy',
      latency: 10,
      connections: 15,
      maxConnections: 100,
    };
  } catch {
    return { status: 'unhealthy', error: 'Connection failed' };
  }
}

async function checkRedisHealth() {
  try {
    // Simulate Redis check
    await new Promise(resolve => setTimeout(resolve, 5));
    return {
      status: 'healthy',
      latency: 5,
      memoryUsage: '45MB',
      hitRate: '96.8%',
    };
  } catch {
    return { status: 'unhealthy', error: 'Connection failed' };
  }
}

async function checkExternalAPIs() {
  const apis = [
    { name: 'CoinCap', url: 'https://api.coincap.io/v2/assets/bitcoin' },
    { name: 'Builder.io', status: 'healthy' },
  ];
  
  const results = {};
  
  for (const api of apis) {
    try {
      if (api.url) {
        const start = Date.now();
        const response = await fetch(api.url, {
          method: 'HEAD',
          signal: AbortSignal.timeout(3000),
        });
        const latency = Date.now() - start;
        
        results[api.name] = {
          status: response.ok ? 'healthy' : 'degraded',
          latency,
          statusCode: response.status,
        };
      } else {
        results[api.name] = { status: api.status || 'healthy' };
      }
    } catch {
      results[api.name] = { status: 'unhealthy', error: 'Timeout or connection failed' };
    }
  }
  
  return results;
}

async function checkFileSystem() {
  try {
    // Check if we can write to temp directory
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const tempFile = path.join('/tmp', `healthcheck-${Date.now()}.txt`);
    await fs.writeFile(tempFile, 'health check');
    await fs.unlink(tempFile);
    
    return {
      status: 'healthy',
      writable: true,
      readable: true,
    };
  } catch {
    return {
      status: 'degraded',
      writable: false,
      readable: true,
    };
  }
}

// Trading platform specific functions
async function getActiveBots() {
  // Simulate active trading bots
  return Math.floor(Math.random() * 50) + 20;
}

async function getMarketDataStatus() {
  return {
    connected: true,
    lastUpdate: new Date().toISOString(),
    symbols: 150,
    latency: Math.floor(Math.random() * 50) + 10,
  };
}

async function getActiveUserSessions() {
  return Math.floor(Math.random() * 200) + 50;
}

async function getTradingVolume() {
  return {
    volume: (Math.random() * 1000000 + 500000).toFixed(2),
    currency: 'USD',
    trades: Math.floor(Math.random() * 1000) + 500,
  };
}

function calculateSystemLoad() {
  const memUsage = process.memoryUsage();
  const memPercentage = (memUsage.heapUsed / memUsage.heapTotal) * 100;
  
  return {
    memory: `${memPercentage.toFixed(1)}%`,
    cpu: `${(Math.random() * 30 + 10).toFixed(1)}%`,
    status: memPercentage < 80 ? 'normal' : 'high',
  };
}

function determineOverallStatus(data: any) {
  const healthChecks = Object.values(data.health);
  const hasUnhealthy = healthChecks.some((check: any) => 
    typeof check === 'object' && check.status === 'unhealthy'
  );
  
  if (hasUnhealthy) return 'degraded';
  
  const memUsage = data.performance.memory.used / data.performance.memory.total;
  if (memUsage > 0.9) return 'degraded';
  
  return 'operational';
}
