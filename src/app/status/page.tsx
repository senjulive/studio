'use client';

import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AstralLogo } from '@/components/icons/astral-logo';
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Clock, 
  Activity,
  Server,
  Database,
  Wifi,
  Shield,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'outage' | 'maintenance';
  uptime: number;
  responseTime: number;
  icon: any;
  description: string;
}

interface Incident {
  id: string;
  title: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  severity: 'minor' | 'major' | 'critical';
  description: string;
  timestamp: string;
  updates: {
    time: string;
    message: string;
    status: string;
  }[];
}

export default function StatusPage() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: 'Trading Engine',
      status: 'operational',
      uptime: 99.98,
      responseTime: 12,
      icon: Activity,
      description: 'Core trading and order execution system'
    },
    {
      name: 'API Services',
      status: 'operational',
      uptime: 99.95,
      responseTime: 28,
      icon: Server,
      description: 'REST API and WebSocket connections'
    },
    {
      name: 'Database',
      status: 'operational',
      uptime: 99.99,
      responseTime: 8,
      icon: Database,
      description: 'User data and trading history storage'
    },
    {
      name: 'Authentication',
      status: 'operational',
      uptime: 99.97,
      responseTime: 15,
      icon: Shield,
      description: 'User login and security services'
    },
    {
      name: 'Market Data',
      status: 'operational',
      uptime: 99.93,
      responseTime: 35,
      icon: BarChart3,
      description: 'Real-time cryptocurrency market feeds'
    },
    {
      name: 'Exchange Connectivity',
      status: 'operational',
      uptime: 99.89,
      responseTime: 45,
      icon: Wifi,
      description: 'Connections to cryptocurrency exchanges'
    }
  ]);

  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: '1',
      title: 'Scheduled Maintenance - Trading Engine Upgrade',
      status: 'resolved',
      severity: 'minor',
      description: 'Planned upgrade to improve trading performance and add new features.',
      timestamp: '2024-01-15T02:00:00Z',
      updates: [
        {
          time: '2024-01-15T02:00:00Z',
          message: 'Maintenance window started. Trading services temporarily unavailable.',
          status: 'investigating'
        },
        {
          time: '2024-01-15T02:30:00Z',
          message: 'Upgrade in progress. Expected completion in 30 minutes.',
          status: 'identified'
        },
        {
          time: '2024-01-15T03:00:00Z',
          message: 'Upgrade completed. All services restored and functioning normally.',
          status: 'resolved'
        }
      ]
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'degraded':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'outage':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'maintenance':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Operational</Badge>;
      case 'degraded':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Degraded</Badge>;
      case 'outage':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Outage</Badge>;
      case 'maintenance':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Maintenance</Badge>;
      default:
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Operational</Badge>;
    }
  };

  const getIncidentSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'major':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Major</Badge>;
      case 'minor':
        return <Badge variant="secondary">Minor</Badge>;
      default:
        return <Badge variant="secondary">Minor</Badge>;
    }
  };

  const overallStatus = services.every(service => service.status === 'operational') 
    ? 'All Systems Operational' 
    : services.some(service => service.status === 'outage')
    ? 'System Outage'
    : 'Partial System Outage';

  const averageUptime = services.reduce((sum, service) => sum + service.uptime, 0) / services.length;

  const refreshStatus = () => {
    setLastUpdated(new Date());
    // In a real app, this would fetch fresh data from the API
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <AstralLogo className="h-6 w-6" />
            <span className="font-bold">AstralCore</span>
          </Link>
          <div className="ml-auto flex items-center space-x-4">
            <Link href="/help">
              <Button variant="ghost">Help</Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost">Contact</Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">System Status</h1>
              <p className="text-muted-foreground">
                Real-time status of AstralCore services and infrastructure
              </p>
            </div>
            <Button variant="outline" onClick={refreshStatus}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Overall Status */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon('operational')}
                  <div>
                    <CardTitle className="text-xl">{overallStatus}</CardTitle>
                    <CardDescription>
                      Last updated: {lastUpdated.toLocaleString()}
                    </CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{averageUptime.toFixed(2)}%</div>
                  <div className="text-sm text-muted-foreground">Overall Uptime</div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Service Status */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Service Status</CardTitle>
              <CardDescription>
                Current operational status of all AstralCore services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center space-x-4">
                      <service.icon className="h-6 w-6 text-primary" />
                      <div>
                        <h3 className="font-medium">{service.name}</h3>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="text-right">
                        <div className="font-medium">{service.uptime}%</div>
                        <div className="text-muted-foreground">Uptime</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{service.responseTime}ms</div>
                        <div className="text-muted-foreground">Response</div>
                      </div>
                      {getStatusBadge(service.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Incidents */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Incidents</CardTitle>
              <CardDescription>
                History of system incidents and maintenance windows
              </CardDescription>
            </CardHeader>
            <CardContent>
              {incidents.length > 0 ? (
                <div className="space-y-6">
                  {incidents.map((incident) => (
                    <div key={incident.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium mb-1">{incident.title}</h3>
                          <p className="text-sm text-muted-foreground">{incident.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getIncidentSeverityBadge(incident.severity)}
                          <Badge 
                            variant={incident.status === 'resolved' ? 'default' : 'outline'}
                            className={incident.status === 'resolved' ? 'bg-green-100 text-green-800' : ''}
                          >
                            {incident.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {incident.updates.map((update, updateIndex) => (
                          <div key={updateIndex} className="flex items-start space-x-3 text-sm">
                            <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></div>
                            <div>
                              <div className="font-medium">
                                {new Date(update.time).toLocaleString()}
                              </div>
                              <div className="text-muted-foreground">{update.message}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
                  <p>No recent incidents. All systems are running smoothly!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Uptime History */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>90-Day Uptime History</CardTitle>
              <CardDescription>
                Service availability over the past 90 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {services.map((service, index) => (
                  <div key={index} className="text-center p-4 rounded-lg border">
                    <service.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="font-medium">{service.name}</div>
                    <div className="text-2xl font-bold text-green-600">{service.uptime}%</div>
                    <div className="text-sm text-muted-foreground">Average Uptime</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Subscribe to Updates */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Stay Informed</CardTitle>
              <CardDescription>
                Get notified about system status updates and planned maintenance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="flex-1">
                  Subscribe to Status Updates
                </Button>
                <Button variant="outline" className="flex-1">
                  RSS Feed
                </Button>
                <Button variant="outline" className="flex-1">
                  Webhook Integration
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 AstralCore. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
