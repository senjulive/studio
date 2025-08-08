"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Flag, 
  Ban, 
  CheckCircle,
  XCircle,
  AlertTriangle,
  Filter,
  Search,
  Eye,
  Trash2
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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

// Mock data for content moderation
const reportedContent = [
  {
    id: 'report_001',
    type: 'chat_message',
    content: 'This is spam content that violates our terms',
    reporter: 'user@example.com',
    reported_user: 'spammer@test.com',
    reason: 'spam',
    timestamp: new Date('2024-01-15T10:30:00Z'),
    status: 'pending',
    severity: 'medium'
  },
  {
    id: 'report_002',
    type: 'profile_content',
    content: 'Inappropriate profile description with offensive language',
    reporter: 'moderator@astral.com',
    reported_user: 'baduser@example.com',
    reason: 'inappropriate_content',
    timestamp: new Date('2024-01-15T09:15:00Z'),
    status: 'reviewed',
    severity: 'high'
  },
  {
    id: 'report_003',
    type: 'chat_message',
    content: 'Suspicious trading advice that might be misleading',
    reporter: 'trader@crypto.com',
    reported_user: 'advisor@fake.com',
    reason: 'misleading_information',
    timestamp: new Date('2024-01-14T18:45:00Z'),
    status: 'dismissed',
    severity: 'low'
  }
];

const autoModerationRules = [
  {
    id: 'rule_001',
    name: 'Spam Detection',
    description: 'Automatically flag messages with repeated text or excessive links',
    enabled: true,
    actions: ['flag', 'rate_limit'],
    triggers: 15
  },
  {
    id: 'rule_002',
    name: 'Profanity Filter',
    description: 'Block messages containing inappropriate language',
    enabled: true,
    actions: ['block', 'warn_user'],
    triggers: 8
  },
  {
    id: 'rule_003',
    name: 'Trading Advice Detector',
    description: 'Flag potential financial advice that requires review',
    enabled: false,
    actions: ['flag'],
    triggers: 3
  }
];

const moderationStats = {
  totalReports: 47,
  pendingReports: 12,
  resolvedToday: 8,
  autoActionsToday: 25,
  flaggedUsers: 6
};

export function ContentModerationManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<any>(null);

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
      reviewed: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
      dismissed: 'bg-gray-500/20 text-gray-500 border-gray-500/30',
      action_taken: 'bg-green-500/20 text-green-500 border-green-500/30'
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      low: 'bg-green-500/20 text-green-500 border-green-500/30',
      medium: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
      high: 'bg-red-500/20 text-red-500 border-red-500/30'
    };
    return variants[severity as keyof typeof variants] || variants.low;
  };

  const filteredReports = reportedContent.filter(report => {
    const matchesSearch = report.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reported_user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleReportAction = (reportId: string, action: 'approve' | 'dismiss' | 'escalate') => {
    console.log(`${action} report ${reportId}`);
    // Handle report action
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500/10 p-2 rounded-lg">
            <MessageSquare className="h-6 w-6 text-orange-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Content Moderation</h2>
            <p className="text-muted-foreground">Manage reported content and moderation rules</p>
          </div>
        </div>
      </div>

      {/* Moderation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Flag className="h-5 w-5 text-red-500" />
                <span className="text-sm font-medium">Total Reports</span>
              </div>
              <p className="text-2xl font-bold">{moderationStats.totalReports}</p>
              <p className="text-xs text-muted-foreground">All time</p>
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
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium">Pending</span>
              </div>
              <p className="text-2xl font-bold text-yellow-500">{moderationStats.pendingReports}</p>
              <p className="text-xs text-muted-foreground">Needs review</p>
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
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">Resolved Today</span>
              </div>
              <p className="text-2xl font-bold text-green-500">{moderationStats.resolvedToday}</p>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
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
                <Filter className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium">Auto Actions</span>
              </div>
              <p className="text-2xl font-bold text-blue-500">{moderationStats.autoActionsToday}</p>
              <p className="text-xs text-muted-foreground">Today</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Ban className="h-5 w-5 text-red-500" />
                <span className="text-sm font-medium">Flagged Users</span>
              </div>
              <p className="text-2xl font-bold text-red-500">{moderationStats.flaggedUsers}</p>
              <p className="text-xs text-muted-foreground">Under review</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Moderation Tabs */}
      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList className="glass">
          <TabsTrigger value="reports">Reported Content</TabsTrigger>
          <TabsTrigger value="rules">Auto-Moderation Rules</TabsTrigger>
          <TabsTrigger value="settings">Moderation Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          {/* Filters */}
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="glass-input"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48 glass-input">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="glass border-border/50">
                    <SelectItem value="all">All Reports</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="dismissed">Dismissed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Reports Table */}
          <Card className="glass-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Content Type</TableHead>
                    <TableHead>Reporter</TableHead>
                    <TableHead>Reported User</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report, index) => (
                    <motion.tr
                      key={report.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-muted/50 cursor-pointer"
                      onClick={() => setSelectedReport(report)}
                    >
                      <TableCell className="font-medium">
                        {report.type.replace('_', ' ').toUpperCase()}
                      </TableCell>
                      <TableCell>{report.reporter}</TableCell>
                      <TableCell>{report.reported_user}</TableCell>
                      <TableCell>{report.reason.replace('_', ' ')}</TableCell>
                      <TableCell>
                        <Badge className={getSeverityBadge(report.severity)}>
                          {report.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(report.status)}>
                          {report.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="glass-button text-green-500 hover:bg-green-500/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReportAction(report.id, 'approve');
                            }}
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="glass-button text-red-500 hover:bg-red-500/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReportAction(report.id, 'dismiss');
                            }}
                          >
                            <XCircle className="h-3 w-3" />
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

        <TabsContent value="rules" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Automated Moderation Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {autoModerationRules.map((rule, index) => (
                <motion.div
                  key={rule.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 glass rounded-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{rule.name}</h3>
                      <Badge variant="outline">
                        {rule.triggers} triggers today
                      </Badge>
                    </div>
                    <Switch checked={rule.enabled} />
                  </div>
                  <p className="text-sm text-muted-foreground">{rule.description}</p>
                  <div className="flex gap-2">
                    {rule.actions.map((action) => (
                      <Badge key={action} variant="outline" className="text-xs">
                        {action.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              ))}
              
              <Button className="btn-primary w-full">
                Add New Rule
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Moderation Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Content Filters</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Profanity Filter</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Spam Detection</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Link Filtering</span>
                      <Switch />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Auto Actions</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Auto-ban Repeat Offenders</span>
                      <Switch />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Auto-delete Spam</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Rate Limiting</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button className="btn-primary">
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card max-w-2xl w-full max-h-[80vh] overflow-auto"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Report Details</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedReport(null)}
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Reporter</label>
                  <p className="text-sm text-muted-foreground">{selectedReport.reporter}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Reported User</label>
                  <p className="text-sm text-muted-foreground">{selectedReport.reported_user}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Reported Content</label>
                <div className="p-3 mt-1 glass rounded-lg">
                  <p className="text-sm">{selectedReport.content}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Moderation Note</label>
                <Textarea
                  placeholder="Add your moderation notes..."
                  className="glass-input mt-1"
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  className="btn-primary flex-1"
                  onClick={() => {
                    handleReportAction(selectedReport.id, 'approve');
                    setSelectedReport(null);
                  }}
                >
                  Take Action
                </Button>
                <Button 
                  variant="outline" 
                  className="glass-button flex-1"
                  onClick={() => {
                    handleReportAction(selectedReport.id, 'dismiss');
                    setSelectedReport(null);
                  }}
                >
                  Dismiss
                </Button>
              </div>
            </CardContent>
          </motion.div>
        </div>
      )}
    </div>
  );
}
