"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Eye, 
  Ban, 
  AlertTriangle, 
  Activity,
  Clock,
  MapPin,
  Trash2,
  Search,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock data for security events
const securityEvents = [
  {
    id: 'sec_001',
    type: 'failed_login',
    user: 'user@example.com',
    ip: '192.168.1.100',
    timestamp: new Date('2024-01-15T10:30:00Z'),
    severity: 'medium',
    details: 'Multiple failed login attempts',
    action: 'blocked'
  },
  {
    id: 'sec_002',
    type: 'suspicious_activity',
    user: 'admin@test.com',
    ip: '10.0.0.1',
    timestamp: new Date('2024-01-15T09:15:00Z'),
    severity: 'high',
    details: 'Unusual transaction pattern detected',
    action: 'flagged'
  },
  {
    id: 'sec_003',
    type: 'password_change',
    user: 'trader@crypto.com',
    ip: '203.0.113.45',
    timestamp: new Date('2024-01-14T18:45:00Z'),
    severity: 'low',
    details: 'Password changed successfully',
    action: 'logged'
  },
];

const activeSessions = [
  {
    id: 'sess_001',
    user: 'john.doe@example.com',
    ip: '192.168.1.50',
    location: 'New York, US',
    device: 'Chrome on Windows',
    lastActivity: new Date('2024-01-15T11:00:00Z'),
    status: 'active'
  },
  {
    id: 'sess_002',
    user: 'jane.smith@example.com',
    ip: '10.0.0.25',
    location: 'London, UK',
    device: 'Safari on macOS',
    lastActivity: new Date('2024-01-15T10:45:00Z'),
    status: 'idle'
  },
];

const blockedIPs = [
  {
    ip: '198.51.100.1',
    reason: 'Repeated failed login attempts',
    blockedAt: new Date('2024-01-14T12:00:00Z'),
    attempts: 25
  },
  {
    ip: '203.0.113.99',
    reason: 'Suspicious transaction patterns',
    blockedAt: new Date('2024-01-13T08:30:00Z'),
    attempts: 12
  },
];

export function SecurityManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');

  const getSeverityBadge = (severity: string) => {
    const variants = {
      low: 'bg-green-500/20 text-green-500 border-green-500/30',
      medium: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
      high: 'bg-red-500/20 text-red-500 border-red-500/30',
    };
    return variants[severity as keyof typeof variants] || variants.low;
  };

  const getActionBadge = (action: string) => {
    const variants = {
      blocked: 'bg-red-500/20 text-red-500 border-red-500/30',
      flagged: 'bg-orange-500/20 text-orange-500 border-orange-500/30',
      logged: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
    };
    return variants[action as keyof typeof variants] || variants.logged;
  };

  const filteredEvents = securityEvents.filter(event => {
    const matchesSearch = event.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.ip.includes(searchTerm) ||
                         event.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || event.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-red-500/10 p-2 rounded-lg">
            <Shield className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Security Management</h2>
            <p className="text-muted-foreground">Monitor and manage platform security</p>
          </div>
        </div>
      </div>

      {/* Security Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <span className="text-sm font-medium">Security Alerts</span>
              </div>
              <p className="text-2xl font-bold text-red-500">12</p>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
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
              <div className="flex items-center gap-2 mb-2">
                <Ban className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-medium">Blocked IPs</span>
              </div>
              <p className="text-2xl font-bold text-orange-500">{blockedIPs.length}</p>
              <p className="text-xs text-muted-foreground">Active blocks</p>
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
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">Active Sessions</span>
              </div>
              <p className="text-2xl font-bold text-green-500">{activeSessions.length}</p>
              <p className="text-xs text-muted-foreground">Logged in users</p>
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
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium">Failed Logins</span>
              </div>
              <p className="text-2xl font-bold text-blue-500">45</p>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Security Tabs */}
      <Tabs defaultValue="events" className="space-y-4">
        <TabsList className="glass">
          <TabsTrigger value="events">Security Events</TabsTrigger>
          <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
          <TabsTrigger value="blocked">Blocked IPs</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          {/* Filters */}
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="glass-input"
                  />
                </div>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-48 glass-input">
                    <SelectValue placeholder="Filter by severity" />
                  </SelectTrigger>
                  <SelectContent className="glass border-border/50">
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Events Table */}
          <Card className="glass-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Type</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event, index) => (
                    <motion.tr
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">
                        {event.type.replace('_', ' ').toUpperCase()}
                      </TableCell>
                      <TableCell>{event.user}</TableCell>
                      <TableCell className="font-mono">{event.ip}</TableCell>
                      <TableCell>
                        <Badge className={getSeverityBadge(event.severity)}>
                          {event.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getActionBadge(event.action)}>
                          {event.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {event.timestamp.toLocaleDateString()} {event.timestamp.toLocaleTimeString()}
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card className="glass-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeSessions.map((session, index) => (
                    <motion.tr
                      key={session.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">{session.user}</TableCell>
                      <TableCell className="font-mono">{session.ip}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {session.location}
                        </div>
                      </TableCell>
                      <TableCell>{session.device}</TableCell>
                      <TableCell className="text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {session.lastActivity.toLocaleTimeString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="glass-button text-red-500 hover:bg-red-500/20"
                        >
                          Terminate
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blocked" className="space-y-4">
          <Card className="glass-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Blocked Date</TableHead>
                    <TableHead>Attempts</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blockedIPs.map((blocked, index) => (
                    <motion.tr
                      key={blocked.ip}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-muted/50"
                    >
                      <TableCell className="font-mono font-medium">{blocked.ip}</TableCell>
                      <TableCell>{blocked.reason}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {blocked.blockedAt.toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{blocked.attempts} attempts</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="glass-button text-green-500 hover:bg-green-500/20"
                        >
                          Unblock
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
