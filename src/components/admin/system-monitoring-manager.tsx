"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Server, 
  Database, 
  Activity, 
  Cpu,
  HardDrive,
  Wifi,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Mock system data
const systemStatus = {
  server: {
    status: 'online',
    uptime: '15d 8h 32m',
    cpu: 45,
    memory: 68,
    disk: 34,
    network: 23
  },
  database: {
    status: 'online',
    connections: 25,
    maxConnections: 100,
    queryTime: 1.2,
    cacheHitRate: 94.5
  },
  services: [
    { name: 'API Server', status: 'running', port: 3000, lastCheck: '2 min ago' },
    { name: 'Database', status: 'running', port: 5432, lastCheck: '1 min ago' },
    { name: 'Redis Cache', status: 'running', port: 6379, lastCheck: '30 sec ago' },
    { name: 'Email Service', status: 'running', port: 587, lastCheck: '1 min ago' },
    { name: 'File Storage', status: 'warning', port: 9000, lastCheck: '5 min ago' }
  ]
};

const errorLogs = [
  {
    id: 'err_001',
    timestamp: new Date('2024-01-15T10:30:00Z'),
    level: 'error',
    service: 'API Server',
    message: 'Database connection timeout after 30 seconds',
    count: 3
  },
  {
    id: 'err_002',
    timestamp: new Date('2024-01-15T10:25:00Z'),
    level: 'warning',
    service: 'File Storage',
    message: 'High memory usage detected (85%)',
    count: 1
  },
  {
    id: 'err_003',
    timestamp: new Date('2024-01-15T10:20:00Z'),
    level: 'info',
    service: 'Email Service',
    message: 'Successfully sent 45 notification emails',
    count: 1
  }
];

const performanceMetrics = [
  { metric: 'Response Time', value: '145ms', trend: 'up', change: '+5%' },
  { metric: 'Throughput', value: '2.3k req/min', trend: 'down', change: '-2%' },
  { metric: 'Error Rate', value: '0.12%', trend: 'down', change: '-50%' },
  { metric: 'Cache Hit Rate', value: '94.5%', trend: 'up', change: '+3%' }
];

export function SystemMonitoringManager() {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Auto refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
      case 'online':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
      case 'offline':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      running: 'bg-green-500/20 text-green-500 border-green-500/30',
      online: 'bg-green-500/20 text-green-500 border-green-500/30',
      warning: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
      error: 'bg-red-500/20 text-red-500 border-red-500/30',
      offline: 'bg-red-500/20 text-red-500 border-red-500/30'
    };
    return variants[status as keyof typeof variants] || variants.offline;
  };

  const getLogLevelBadge = (level: string) => {
    const variants = {
      info: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
      warning: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
      error: 'bg-red-500/20 text-red-500 border-red-500/30'
    };
    return variants[level as keyof typeof variants] || variants.info;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500/10 p-2 rounded-lg">
            <Server className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">System Monitoring</h2>
            <p className="text-muted-foreground">Monitor system health and performance</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLastUpdate(new Date())}
            className="glass-button"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Cpu className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium">CPU Usage</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-2xl font-bold">{systemStatus.server.cpu}%</span>
                  <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30">
                    Normal
                  </Badge>
                </div>
                <Progress value={systemStatus.server.cpu} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">Memory Usage</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-2xl font-bold">{systemStatus.server.memory}%</span>
                  <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                    High
                  </Badge>
                </div>
                <Progress value={systemStatus.server.memory} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <HardDrive className="h-5 w-5 text-purple-500" />
                <span className="text-sm font-medium">Disk Usage</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-2xl font-bold">{systemStatus.server.disk}%</span>
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                    Good
                  </Badge>
                </div>
                <Progress value={systemStatus.server.disk} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Wifi className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-medium">Network I/O</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-2xl font-bold">{systemStatus.server.network}%</span>
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                    Low
                  </Badge>
                </div>
                <Progress value={systemStatus.server.network} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* System Details */}
      <Tabs defaultValue="services" className="space-y-4">
        <TabsList className="glass">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="logs">Error Logs</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Service Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Port</TableHead>
                    <TableHead>Last Check</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {systemStatus.services.map((service, index) => (
                    <motion.tr
                      key={service.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(service.status)}
                          {service.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(service.status)}>
                          {service.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">{service.port}</TableCell>
                      <TableCell className="text-muted-foreground">{service.lastCheck}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="glass-button">
                            Restart
                          </Button>
                          <Button size="sm" variant="outline" className="glass-button">
                            Logs
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {performanceMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.metric}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 glass rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{metric.metric}</h3>
                      <p className="text-2xl font-bold">{metric.value}</p>
                    </div>
                    <div className="text-right">
                      <Badge 
                        className={metric.trend === 'up' 
                          ? "bg-green-500/20 text-green-500 border-green-500/30" 
                          : "bg-red-500/20 text-red-500 border-red-500/30"
                        }
                      >
                        {metric.change}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>System Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Uptime</span>
                    <span className="font-medium">{systemStatus.server.uptime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Server Status</span>
                    <Badge className={getStatusBadge(systemStatus.server.status)}>
                      {systemStatus.server.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Load Average</span>
                    <span className="font-medium">0.85, 0.92, 1.15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Active Connections</span>
                    <span className="font-medium">142</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Error Logs
                </CardTitle>
                <Button size="sm" variant="outline" className="glass-button">
                  <Download className="h-4 w-4 mr-2" />
                  Export Logs
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {errorLogs.map((log, index) => (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-muted/50"
                    >
                      <TableCell className="font-mono text-sm">
                        {log.timestamp.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={getLogLevelBadge(log.level)}>
                          {log.level}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{log.service}</TableCell>
                      <TableCell className="max-w-md truncate">{log.message}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.count}</Badge>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge className={getStatusBadge(systemStatus.database.status)}>
                      {systemStatus.database.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Connections</span>
                    <span className="font-medium">
                      {systemStatus.database.connections}/{systemStatus.database.maxConnections}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg Query Time</span>
                    <span className="font-medium">{systemStatus.database.queryTime}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Cache Hit Rate</span>
                    <span className="font-medium">{systemStatus.database.cacheHitRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Database Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full glass-button" variant="outline">
                  Run Backup
                </Button>
                <Button className="w-full glass-button" variant="outline">
                  Optimize Tables
                </Button>
                <Button className="w-full glass-button" variant="outline">
                  Check Integrity
                </Button>
                <Button className="w-full glass-button" variant="outline">
                  View Slow Queries
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
