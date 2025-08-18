'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Server, 
  Database, 
  Globe, 
  Shield, 
  Zap,
  TrendingUp,
  Users,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MonitoringData {
  status: string;
  application: {
    name: string;
    version: string;
    uptime: number;
  };
  performance: {
    memory: {
      used: number;
      total: number;
    };
    cpu: {
      usage: any;
    };
  };
  health: {
    database: { status: string; latency?: number };
    redis: { status: string; latency?: number };
    externalAPIs: Record<string, { status: string; latency?: number }>;
  };
  trading: {
    activeBots: number;
    userSessions: number;
    tradingVolume24h: {
      volume: string;
      trades: number;
    };
    systemLoad: {
      memory: string;
      cpu: string;
      status: string;
    };
  };
}

export function ProductionDashboard() {
  const [data, setData] = React.useState<MonitoringData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [lastUpdate, setLastUpdate] = React.useState<Date>(new Date());

  const fetchData = React.useCallback(async () => {
    try {
      const response = await fetch('/api/monitoring/dashboard');
      if (response.ok) {
        const result = await response.json();
        setData(result);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch monitoring data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [fetchData]);

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
      case 'healthy':
        return 'text-green-500';
      case 'degraded':
        return 'text-yellow-500';
      case 'unhealthy':
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'unhealthy':
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin text-primary mr-2" />
        <span>Loading monitoring dashboard...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center p-8">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Monitoring Unavailable</h3>
        <p className="text-muted-foreground mb-4">Unable to fetch monitoring data</p>
        <Button onClick={fetchData}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Production Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time monitoring for AstralCore • Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <Button onClick={fetchData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            {getStatusIcon(data.status)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{data.status}</div>
            <p className="text-xs text-muted-foreground">
              Uptime: {formatUptime(data.application.uptime)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bots</CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.trading.activeBots}</div>
            <p className="text-xs text-muted-foreground">
              Trading automatically
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.trading.userSessions}</div>
            <p className="text-xs text-muted-foreground">
              Online sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${parseFloat(data.trading.tradingVolume24h.volume).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {data.trading.tradingVolume24h.trades.toLocaleString()} trades
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="system" className="space-y-4">
        <TabsList>
          <TabsTrigger value="system">System Health</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trading">Trading Platform</TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Health Checks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Service Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {getStatusIcon(data.health.database.status)}
                    Database
                  </span>
                  <Badge variant="outline" className={getStatusColor(data.health.database.status)}>
                    {data.health.database.latency}ms
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {getStatusIcon(data.health.redis.status)}
                    Redis Cache
                  </span>
                  <Badge variant="outline" className={getStatusColor(data.health.redis.status)}>
                    {data.health.redis.latency}ms
                  </Badge>
                </div>

                {Object.entries(data.health.externalAPIs).map(([name, api]) => (
                  <div key={name} className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {getStatusIcon(api.status)}
                      {name}
                    </span>
                    <Badge variant="outline" className={getStatusColor(api.status)}>
                      {api.latency ? `${api.latency}ms` : api.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Application Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Application
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Version</span>
                  <Badge variant="secondary">{data.application.version}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Platform</span>
                  <Badge variant="outline">Production</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Uptime</span>
                  <span className="text-sm">{formatUptime(data.application.uptime)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Memory Usage */}
            <Card>
              <CardHeader>
                <CardTitle>Memory Usage</CardTitle>
                <CardDescription>
                  {data.performance.memory.used}MB / {data.performance.memory.total}MB
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress 
                  value={(data.performance.memory.used / data.performance.memory.total) * 100} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {((data.performance.memory.used / data.performance.memory.total) * 100).toFixed(1)}% utilized
                </p>
              </CardContent>
            </Card>

            {/* System Load */}
            <Card>
              <CardHeader>
                <CardTitle>System Load</CardTitle>
                <CardDescription>Current resource utilization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Memory</span>
                  <Badge variant={data.trading.systemLoad.status === 'normal' ? 'default' : 'destructive'}>
                    {data.trading.systemLoad.memory}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>CPU</span>
                  <Badge variant="outline">
                    {data.trading.systemLoad.cpu}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Status</span>
                  <Badge variant={data.trading.systemLoad.status === 'normal' ? 'default' : 'secondary'}>
                    {data.trading.systemLoad.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trading" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trading Bots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{data.trading.activeBots}</div>
                <p className="text-sm text-muted-foreground">Active automated traders</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Volume (24h)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary">
                  ${parseFloat(data.trading.tradingVolume24h.volume).toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">
                  {data.trading.tradingVolume24h.trades.toLocaleString()} total trades
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">User Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">{data.trading.userSessions}</div>
                <p className="text-sm text-muted-foreground">Currently active users</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
