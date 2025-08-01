'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Database } from 'lucide-react';

interface AllDataResponse {
  analytics: {
    totals: {
      totalUsers: number;
      totalDeposits: number;
      totalWithdrawals: number;
      totalGridEarnings: number;
      totalPendingWithdrawals: number;
      netInflow: number;
    };
    leaderboard: Array<{
      userId: string;
      username: string;
      balance: number;
      deposits: number;
      withdrawals: number;
      gridEarnings: number;
      rank: string;
    }>;
    rankChartData: Array<{
      name: string;
      value: number;
      fill: string;
    }>;
  };
  wallets: Record<string, any>;
  pendingDeposits: any[];
  pendingWithdrawals: any[];
  verifications: any[];
  publicSettings: any;
  marketSummary: any;
  publicChat: any[];
  notifications: Record<string, any[]>;
  settings: any;
}

interface LoadingState {
  isLoading: boolean;
  loadedCount: number;
  totalCount: number;
  currentOperation: string;
  error: string | null;
}

export default function AllDataFetcher() {
  const [allData, setAllData] = useState<AllDataResponse | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    loadedCount: 0,
    totalCount: 10,
    currentOperation: '',
    error: null
  });

  const updateLoading = (operation: string, increment: boolean = true) => {
    setLoadingState(prev => ({
      ...prev,
      currentOperation: operation,
      loadedCount: increment ? prev.loadedCount + 1 : prev.loadedCount
    }));
  };

  const fetchAllData = async () => {
    setLoadingState({
      isLoading: true,
      loadedCount: 0,
      totalCount: 10,
      currentOperation: 'Starting data fetch...',
      error: null
    });

    try {
      const fetchPromises = [];

      // Analytics data
      updateLoading('Fetching analytics data...', false);
      fetchPromises.push(
        fetch('/api/admin/analytics', { method: 'POST' })
          .then(res => res.json())
          .then(data => {
            updateLoading('Analytics data loaded');
            return { analytics: data };
          })
      );

      // All wallets
      updateLoading('Fetching wallet data...', false);
      fetchPromises.push(
        fetch('/api/admin/wallets', { method: 'POST' })
          .then(res => res.json())
          .then(data => {
            updateLoading('Wallet data loaded');
            return { wallets: data };
          })
      );

      // Pending deposits
      updateLoading('Fetching pending deposits...', false);
      fetchPromises.push(
        fetch('/api/admin/pending-deposits', { method: 'POST' })
          .then(res => res.json())
          .then(data => {
            updateLoading('Pending deposits loaded');
            return { pendingDeposits: data };
          })
      );

      // Pending withdrawals
      updateLoading('Fetching pending withdrawals...', false);
      fetchPromises.push(
        fetch('/api/admin/pending-withdrawals', { method: 'POST' })
          .then(res => res.json())
          .then(data => {
            updateLoading('Pending withdrawals loaded');
            return { pendingWithdrawals: data };
          })
      );

      // Verifications
      updateLoading('Fetching user verifications...', false);
      fetchPromises.push(
        fetch('/api/admin/verifications', { method: 'POST' })
          .then(res => res.json())
          .then(data => {
            updateLoading('User verifications loaded');
            return { verifications: data };
          })
      );

      // Public settings
      updateLoading('Fetching public settings...', false);
      fetchPromises.push(
        fetch('/api/public-settings')
          .then(res => res.json())
          .then(data => {
            updateLoading('Public settings loaded');
            return { publicSettings: data };
          })
      );

      // Market summary
      updateLoading('Fetching market summary...', false);
      fetchPromises.push(
        fetch('/api/market-summary', { method: 'POST' })
          .then(res => res.json())
          .then(data => {
            updateLoading('Market summary loaded');
            return { marketSummary: data };
          })
      );

      // Public chat
      updateLoading('Fetching public chat...', false);
      fetchPromises.push(
        fetch('/api/chat/public', { method: 'POST' })
          .then(res => res.json())
          .then(data => {
            updateLoading('Public chat loaded');
            return { publicChat: data };
          })
      );

      // Static data files
      updateLoading('Loading notifications data...', false);
      fetchPromises.push(
        import('@/data/notifications.json')
          .then(data => {
            updateLoading('Notifications data loaded');
            return { notifications: data.default };
          })
      );

      updateLoading('Loading settings data...', false);
      fetchPromises.push(
        import('@/data/settings.json')
          .then(data => {
            updateLoading('Settings data loaded');
            return { settings: data.default };
          })
      );

      // Wait for all promises to resolve
      const results = await Promise.all(fetchPromises);
      
      // Merge all results
      const combinedData = results.reduce((acc, curr) => ({ ...acc, ...curr }), {}) as AllDataResponse;
      
      setAllData(combinedData);
      setLoadingState(prev => ({
        ...prev,
        isLoading: false,
        currentOperation: 'All data loaded successfully!'
      }));

    } catch (error) {
      console.error('Error fetching data:', error);
      setLoadingState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }));
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const renderDataSummary = () => {
    if (!allData) return null;

    const totalUsers = allData.analytics?.totals?.totalUsers || 0;
    const totalBalance = allData.analytics?.totals?.totalDeposits || 0;
    const pendingDepositsCount = allData.pendingDeposits?.length || 0;
    const pendingWithdrawalsCount = allData.pendingWithdrawals?.length || 0;
    const verificationsCount = allData.verifications?.length || 0;
    const chatMessagesCount = allData.publicChat?.length || 0;
    const walletsCount = Object.keys(allData.wallets || {}).length;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-sm text-muted-foreground">Total registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Wallets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{walletsCount}</div>
            <p className="text-sm text-muted-foreground">Active wallets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline">{pendingDepositsCount} Deposits</Badge>
              <Badge variant="outline">{pendingWithdrawalsCount} Withdrawals</Badge>
              <Badge variant="outline">{verificationsCount} Verifications</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chatMessagesCount}</div>
            <p className="text-sm text-muted-foreground">Chat messages</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-3 xl:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Platform Overview</CardTitle>
            <CardDescription>Comprehensive platform statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-xl font-semibold">${allData.analytics?.totals?.totalDeposits?.toLocaleString() || 0}</div>
                <p className="text-sm text-muted-foreground">Total Deposits</p>
              </div>
              <div>
                <div className="text-xl font-semibold">${allData.analytics?.totals?.totalWithdrawals?.toLocaleString() || 0}</div>
                <p className="text-sm text-muted-foreground">Total Withdrawals</p>
              </div>
              <div>
                <div className="text-xl font-semibold">${allData.analytics?.totals?.totalGridEarnings?.toLocaleString() || 0}</div>
                <p className="text-sm text-muted-foreground">Grid Earnings</p>
              </div>
              <div>
                <div className="text-xl font-semibold">${allData.analytics?.totals?.netInflow?.toLocaleString() || 0}</div>
                <p className="text-sm text-muted-foreground">Net Inflow</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Database className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">All Data Fetcher</h1>
            <p className="text-muted-foreground">Comprehensive platform data overview</p>
          </div>
        </div>
        <Button onClick={fetchAllData} disabled={loadingState.isLoading} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${loadingState.isLoading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {loadingState.isLoading && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Loader2 className="h-6 w-6 animate-spin" />
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-2">
                  <span>{loadingState.currentOperation}</span>
                  <span>{loadingState.loadedCount}/{loadingState.totalCount}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(loadingState.loadedCount / loadingState.totalCount) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {loadingState.error && (
        <Card className="mb-6 border-destructive">
          <CardContent className="pt-6">
            <div className="text-destructive">
              <strong>Error:</strong> {loadingState.error}
            </div>
          </CardContent>
        </Card>
      )}

      {allData && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Data Loaded Successfully
            </Badge>
            <span className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
          
          {renderDataSummary()}

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Raw Data</CardTitle>
              <CardDescription>Complete JSON data structure for debugging and analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96 text-xs">
                {JSON.stringify(allData, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
