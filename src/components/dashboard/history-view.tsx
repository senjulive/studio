"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, Filter, Download, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const mockTransactions = [
  {
    id: 'tx_001',
    type: 'deposit',
    amount: 1500.00,
    currency: 'USDT',
    status: 'completed',
    timestamp: '2024-01-15T10:30:00Z',
    hash: '0x1234...5678',
    fee: 0.5,
  },
  {
    id: 'tx_002',
    type: 'withdrawal',
    amount: 500.00,
    currency: 'USDT',
    status: 'pending',
    timestamp: '2024-01-14T15:45:00Z',
    hash: '0xabcd...efgh',
    fee: 1.0,
  },
  {
    id: 'tx_003',
    type: 'trading_profit',
    amount: 75.50,
    currency: 'USDT',
    status: 'completed',
    timestamp: '2024-01-14T09:20:00Z',
    hash: '0x9876...5432',
    fee: 0.0,
  },
  {
    id: 'tx_004',
    type: 'deposit',
    amount: 2000.00,
    currency: 'USDT',
    status: 'completed',
    timestamp: '2024-01-13T14:15:00Z',
    hash: '0xfedc...ba98',
    fee: 0.5,
  },
  {
    id: 'tx_005',
    type: 'trading_loss',
    amount: -25.75,
    currency: 'USDT',
    status: 'completed',
    timestamp: '2024-01-13T11:30:00Z',
    hash: '0x1357...2468',
    fee: 0.0,
  },
];

export function HistoryView() {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = mockTransactions.filter(tx => {
    const matchesFilter = filter === 'all' || tx.type === filter;
    const matchesSearch = tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case 'withdrawal':
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      case 'trading_profit':
        return <ArrowDownLeft className="h-4 w-4 text-blue-500" />;
      case 'trading_loss':
        return <ArrowUpRight className="h-4 w-4 text-orange-500" />;
      default:
        return <ArrowUpRight className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'bg-green-500/20 text-green-500 border-green-500/30',
      pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
      failed: 'bg-red-500/20 text-red-500 border-red-500/30',
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    const sign = amount >= 0 ? '+' : '';
    return `${sign}${amount.toFixed(2)} ${currency}`;
  };

  return (
    <div className="mobile-container">
      <div className="mobile-header">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gradient">Transaction History</h1>
          <Button variant="ghost" size="icon" className="glass-button">
            <Download className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="mobile-content">
        {/* Filters */}
        <Card className="glass-card">
          <CardContent className="p-4 space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Search by hash or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="glass-input"
                  icon={<Search className="h-4 w-4" />}
                />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-32 glass-input">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent className="glass border-border/50">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="deposit">Deposits</SelectItem>
                  <SelectItem value="withdrawal">Withdrawals</SelectItem>
                  <SelectItem value="trading_profit">Profits</SelectItem>
                  <SelectItem value="trading_loss">Losses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transaction List */}
        <div className="space-y-3">
          {filteredTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-card hover:border-primary/40 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <h3 className="font-medium capitalize">
                          {transaction.type.replace('_', ' ')}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(transaction.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        transaction.amount >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {formatAmount(transaction.amount, transaction.currency)}
                      </p>
                      <Badge className={getStatusBadge(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-border/30">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Hash: {transaction.hash}</span>
                      <span>Fee: {transaction.fee} USDT</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <Card className="glass-card">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No transactions found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
