'use client';

export interface WalletAsset {
  symbol: string;
  name: string;
  balance: number;
  value: number; // USD value
  change24h: number; // Percentage change
  price: number; // Current price per unit
  icon: string;
  network?: string;
  address?: string;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'trade' | 'transfer' | 'fee' | 'reward';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  asset: string;
  amount: number;
  value: number; // USD value at time of transaction
  fee?: number;
  fromAddress?: string;
  toAddress?: string;
  txHash?: string;
  blockNumber?: number;
  confirmations?: number;
  requiredConfirmations?: number;
  timestamp: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface DepositRequest {
  id: string;
  asset: string;
  amount: number;
  address: string;
  memo?: string;
  network: string;
  status: 'pending' | 'confirmed' | 'failed';
  txHash?: string;
  confirmations: number;
  requiredConfirmations: number;
  createdAt: string;
  estimatedCompletion?: string;
}

export interface WithdrawalRequest {
  id: string;
  asset: string;
  amount: number;
  toAddress: string;
  memo?: string;
  network: string;
  fee: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  txHash?: string;
  createdAt: string;
  processedAt?: string;
  approvedBy?: string;
  reason?: string; // For failed/cancelled withdrawals
}

export interface WalletStats {
  totalValue: number;
  change24h: number;
  changePercent24h: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalTrades: number;
  profitLoss: number;
  profitLossPercent: number;
}

class WalletManager {
  private assets: Map<string, WalletAsset> = new Map();
  private transactions: Transaction[] = [];
  private deposits: DepositRequest[] = [];
  private withdrawals: WithdrawalRequest[] = [];
  private subscribers: Set<() => void> = new Set();

  constructor() {
    this.initializeMockData();
    this.startRealTimeUpdates();
  }

  private initializeMockData() {
    // Mock wallet assets
    const mockAssets: WalletAsset[] = [
      {
        symbol: 'USDT',
        name: 'Tether USD',
        balance: 1500.00,
        value: 1500.00,
        change24h: 0.02,
        price: 1.00,
        icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
        network: 'TRC20',
        address: 'TXYZabc123...'
      },
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        balance: 0.045,
        value: 1957.50,
        change24h: 2.1,
        price: 43500,
        icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
        network: 'Bitcoin',
        address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        balance: 0.8,
        value: 2120.00,
        change24h: -1.5,
        price: 2650,
        icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
        network: 'Ethereum',
        address: '0x742d35Cc6634C0532925a3b8D5C25FE3E8C8CC8F'
      },
      {
        symbol: 'BNB',
        name: 'Binance Coin',
        balance: 2.5,
        value: 875.00,
        change24h: 0.8,
        price: 350,
        icon: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png',
        network: 'BSC',
        address: '0x742d35Cc6634C0532925a3b8D5C25FE3E8C8CC8F'
      }
    ];

    mockAssets.forEach(asset => {
      this.assets.set(asset.symbol, asset);
    });

    // Mock transactions
    const mockTransactions: Transaction[] = [
      {
        id: 'tx_001',
        type: 'deposit',
        status: 'completed',
        asset: 'USDT',
        amount: 500,
        value: 500,
        fee: 1,
        toAddress: 'TXYZabc123...',
        txHash: '0xabc123def456...',
        confirmations: 6,
        requiredConfirmations: 1,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        description: 'Deposit via TRC20'
      },
      {
        id: 'tx_002',
        type: 'trade',
        status: 'completed',
        asset: 'BTC',
        amount: 0.015,
        value: 652.50,
        fee: 2.50,
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        description: 'Grid Trading Bot Purchase'
      },
      {
        id: 'tx_003',
        type: 'withdrawal',
        status: 'pending',
        asset: 'ETH',
        amount: 0.1,
        value: 265,
        fee: 0.005,
        fromAddress: '0x742d35Cc6634C0532925a3b8D5C25FE3E8C8CC8F',
        toAddress: '0x123abc456def...',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        description: 'Withdrawal to external wallet'
      },
      {
        id: 'tx_004',
        type: 'reward',
        status: 'completed',
        asset: 'USDT',
        amount: 25.50,
        value: 25.50,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        description: 'Trading bot profits'
      }
    ];

    this.transactions = mockTransactions;

    // Mock pending deposits
    this.deposits = [
      {
        id: 'dep_001',
        asset: 'BTC',
        amount: 0.01,
        address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        network: 'Bitcoin',
        status: 'pending',
        txHash: '0x789def123abc...',
        confirmations: 2,
        requiredConfirmations: 6,
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        estimatedCompletion: new Date(Date.now() + 15 * 60 * 1000).toISOString()
      }
    ];

    // Mock pending withdrawals
    this.withdrawals = [
      {
        id: 'with_001',
        asset: 'USDT',
        amount: 200,
        toAddress: 'TXYZabc789...',
        network: 'TRC20',
        fee: 1,
        status: 'processing',
        createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString()
      }
    ];
  }

  private startRealTimeUpdates() {
    // Simulate real-time price updates
    setInterval(() => {
      this.assets.forEach((asset, symbol) => {
        // Simulate small price movements
        const volatility = symbol === 'USDT' ? 0.001 : 0.02; // USDT is more stable
        const change = (Math.random() - 0.5) * volatility;
        const newPrice = asset.price * (1 + change);
        
        asset.price = newPrice;
        asset.value = asset.balance * newPrice;
        asset.change24h += change * 100 * 0.1; // Smooth the 24h change
        
        this.assets.set(symbol, asset);
      });

      this.notifySubscribers();
    }, 5000); // Update every 5 seconds

    // Simulate transaction confirmations
    setInterval(() => {
      this.deposits.forEach(deposit => {
        if (deposit.status === 'pending' && deposit.confirmations < deposit.requiredConfirmations) {
          deposit.confirmations += Math.random() > 0.7 ? 1 : 0;
          
          if (deposit.confirmations >= deposit.requiredConfirmations) {
            deposit.status = 'confirmed';
            this.processDeposit(deposit);
          }
        }
      });

      this.withdrawals.forEach(withdrawal => {
        if (withdrawal.status === 'processing' && Math.random() > 0.9) {
          withdrawal.status = 'completed';
          withdrawal.processedAt = new Date().toISOString();
          withdrawal.txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
        }
      });

      this.notifySubscribers();
    }, 10000); // Check every 10 seconds
  }

  private processDeposit(deposit: DepositRequest) {
    // Add to wallet balance
    const asset = this.assets.get(deposit.asset);
    if (asset) {
      asset.balance += deposit.amount;
      asset.value = asset.balance * asset.price;
      this.assets.set(deposit.asset, asset);
    }

    // Add transaction record
    const transaction: Transaction = {
      id: `tx_dep_${deposit.id}`,
      type: 'deposit',
      status: 'completed',
      asset: deposit.asset,
      amount: deposit.amount,
      value: deposit.amount * (asset?.price || 0),
      toAddress: deposit.address,
      txHash: deposit.txHash,
      confirmations: deposit.confirmations,
      requiredConfirmations: deposit.requiredConfirmations,
      timestamp: new Date().toISOString(),
      description: `Deposit confirmed on ${deposit.network}`
    };

    this.transactions.unshift(transaction);
  }

  public getAssets(): WalletAsset[] {
    return Array.from(this.assets.values());
  }

  public getAsset(symbol: string): WalletAsset | undefined {
    return this.assets.get(symbol);
  }

  public getTransactions(limit?: number): Transaction[] {
    return limit ? this.transactions.slice(0, limit) : this.transactions;
  }

  public getDeposits(): DepositRequest[] {
    return this.deposits;
  }

  public getWithdrawals(): WithdrawalRequest[] {
    return this.withdrawals;
  }

  public getStats(): WalletStats {
    const assets = this.getAssets();
    const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
    const totalChange24h = assets.reduce((sum, asset) => sum + (asset.value * asset.change24h / 100), 0);
    
    const deposits = this.transactions.filter(tx => tx.type === 'deposit' && tx.status === 'completed');
    const withdrawals = this.transactions.filter(tx => tx.type === 'withdrawal' && tx.status === 'completed');
    const trades = this.transactions.filter(tx => tx.type === 'trade');
    
    const totalDeposits = deposits.reduce((sum, tx) => sum + tx.value, 0);
    const totalWithdrawals = withdrawals.reduce((sum, tx) => sum + tx.value, 0);
    const profitLoss = totalValue - totalDeposits + totalWithdrawals;

    return {
      totalValue,
      change24h: totalChange24h,
      changePercent24h: totalValue > 0 ? (totalChange24h / totalValue) * 100 : 0,
      totalDeposits,
      totalWithdrawals,
      totalTrades: trades.length,
      profitLoss,
      profitLossPercent: totalDeposits > 0 ? (profitLoss / totalDeposits) * 100 : 0
    };
  }

  public generateDepositAddress(asset: string, network?: string): Promise<{ address: string; memo?: string; qrCode: string }> {
    return new Promise((resolve) => {
      // Simulate API call delay
      setTimeout(() => {
        const mockAddresses = {
          'BTC': '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
          'ETH': '0x742d35Cc6634C0532925a3b8D5C25FE3E8C8CC8F',
          'USDT': 'TXYZabc123def456789',
          'BNB': '0x742d35Cc6634C0532925a3b8D5C25FE3E8C8CC8F'
        };

        const address = mockAddresses[asset as keyof typeof mockAddresses] || 'mock_address_123';
        const qrCode = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K`;

        resolve({
          address,
          memo: asset === 'XRP' ? '123456789' : undefined,
          qrCode
        });
      }, 1000);
    });
  }

  public requestWithdrawal(request: Omit<WithdrawalRequest, 'id' | 'status' | 'createdAt'>): Promise<WithdrawalRequest> {
    return new Promise((resolve, reject) => {
      // Validate balance
      const asset = this.assets.get(request.asset);
      if (!asset || asset.balance < request.amount + request.fee) {
        reject(new Error('Insufficient balance'));
        return;
      }

      // Create withdrawal request
      const withdrawal: WithdrawalRequest = {
        ...request,
        id: `with_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      this.withdrawals.push(withdrawal);
      
      // Deduct from available balance (pending)
      asset.balance -= (request.amount + request.fee);
      asset.value = asset.balance * asset.price;
      this.assets.set(request.asset, asset);

      this.notifySubscribers();
      resolve(withdrawal);
    });
  }

  public cancelWithdrawal(withdrawalId: string): Promise<boolean> {
    return new Promise((resolve) => {
      const withdrawal = this.withdrawals.find(w => w.id === withdrawalId);
      if (withdrawal && withdrawal.status === 'pending') {
        withdrawal.status = 'cancelled';
        withdrawal.reason = 'Cancelled by user';

        // Refund to balance
        const asset = this.assets.get(withdrawal.asset);
        if (asset) {
          asset.balance += (withdrawal.amount + withdrawal.fee);
          asset.value = asset.balance * asset.price;
          this.assets.set(withdrawal.asset, asset);
        }

        this.notifySubscribers();
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

  public subscribe(callback: () => void): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Error in wallet subscriber:', error);
      }
    });
  }

  public searchTransactions(query: string, filters?: {
    type?: Transaction['type'];
    status?: Transaction['status'];
    asset?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Transaction[] {
    let filteredTransactions = this.transactions;

    // Apply filters
    if (filters?.type) {
      filteredTransactions = filteredTransactions.filter(tx => tx.type === filters.type);
    }
    if (filters?.status) {
      filteredTransactions = filteredTransactions.filter(tx => tx.status === filters.status);
    }
    if (filters?.asset) {
      filteredTransactions = filteredTransactions.filter(tx => tx.asset === filters.asset);
    }
    if (filters?.dateFrom) {
      filteredTransactions = filteredTransactions.filter(tx => tx.timestamp >= filters.dateFrom!);
    }
    if (filters?.dateTo) {
      filteredTransactions = filteredTransactions.filter(tx => tx.timestamp <= filters.dateTo!);
    }

    // Apply search query
    if (query) {
      const lowerQuery = query.toLowerCase();
      filteredTransactions = filteredTransactions.filter(tx =>
        tx.asset.toLowerCase().includes(lowerQuery) ||
        tx.description?.toLowerCase().includes(lowerQuery) ||
        tx.txHash?.toLowerCase().includes(lowerQuery) ||
        tx.toAddress?.toLowerCase().includes(lowerQuery) ||
        tx.fromAddress?.toLowerCase().includes(lowerQuery)
      );
    }

    return filteredTransactions;
  }
}

// Global singleton instance
export const walletManager = new WalletManager();

// React hook for using wallet data
import * as React from 'react';

export function useWallet() {
  const [assets, setAssets] = React.useState<WalletAsset[]>([]);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [deposits, setDeposits] = React.useState<DepositRequest[]>([]);
  const [withdrawals, setWithdrawals] = React.useState<WithdrawalRequest[]>([]);
  const [stats, setStats] = React.useState<WalletStats | null>(null);

  React.useEffect(() => {
    const updateData = () => {
      setAssets(walletManager.getAssets());
      setTransactions(walletManager.getTransactions());
      setDeposits(walletManager.getDeposits());
      setWithdrawals(walletManager.getWithdrawals());
      setStats(walletManager.getStats());
    };

    updateData();
    const unsubscribe = walletManager.subscribe(updateData);

    return unsubscribe;
  }, []);

  return {
    assets,
    transactions,
    deposits,
    withdrawals,
    stats,
    generateDepositAddress: walletManager.generateDepositAddress.bind(walletManager),
    requestWithdrawal: walletManager.requestWithdrawal.bind(walletManager),
    cancelWithdrawal: walletManager.cancelWithdrawal.bind(walletManager),
    searchTransactions: walletManager.searchTransactions.bind(walletManager),
    getAsset: walletManager.getAsset.bind(walletManager),
  };
}
