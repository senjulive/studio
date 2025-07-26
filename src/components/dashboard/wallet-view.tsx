
'use client';

import * as React from "react";
import Link from "next/link";
import { Repeat, Lock, LineChart as LineChartIcon, Wallet as WalletIcon, User, HeartHandshake, Users, ArrowLeftRight, AlertCircle, Calendar } from "lucide-react";
import type { SVGProps } from 'react';

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getOrCreateWallet, type WalletData } from "@/lib/wallet";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { getUserRank } from "@/lib/ranks";
import { useUser } from "@/contexts/UserContext";
import { type TierSetting as TierData, getBotTierSettings, getCurrentTier } from "@/lib/tiers";
import { tierIcons, tierClassNames } from '@/lib/settings';

// Import rank icons
import { RecruitRankIcon } from '@/components/icons/ranks/recruit-rank-icon';
import { BronzeRankIcon } from '@/components/icons/ranks/bronze-rank-icon';
import { SilverRankIcon } from '@/components/icons/ranks/silver-rank-icon';
import { GoldRankIcon } from '@/components/icons/ranks/gold-rank-icon';
import { PlatinumRankIcon } from '@/components/icons/ranks/platinum-rank-icon';
import { DiamondRankIcon } from '@/components/icons/ranks/diamond-rank-icon';
import { LiveTradingChart } from "./live-trading-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Bitcoin, Landmark, Scale, TrendingUp } from "lucide-react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { UsdtLogoIcon } from "../icons/usdt-logo";

type IconComponent = (props: SVGProps<SVGSVGElement>) => JSX.Element;

const rankIcons: Record<string, IconComponent> = {
    RecruitRankIcon,
    BronzeRankIcon,
    SilverRankIcon,
    GoldRankIcon,
    PlatinumRankIcon,
    DiamondRankIcon,
    Lock,
};


type Transaction = {
  id: string;
  type: string;
  asset: 'USDT' | 'BTC' | 'ETH';
  amount: number;
  date: string;
  status: "Completed" | "Pending" | "Failed";
};

type CryptoData = {
  id: string;
  name: string;
  ticker: string;
  iconUrl: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  priceHistory: { value: number }[];
};

const quickAccessItems = [
  { href: "/dashboard/market", label: "Market", icon: LineChartIcon },
  { href: "/dashboard/deposit", label: "Deposit", icon: WalletIcon },
  { href: "/dashboard/trading", label: "Trade", icon: Repeat },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/support", label: "Support", icon: HeartHandshake },
  { href: "/dashboard/squad", label: "Squad", icon: Users },
  { href: "/dashboard/withdraw", label: "Withdraw", icon: ArrowLeftRight },
];

const assetConfig = [
    {
        ticker: "USDT",
        name: "USDT Balance",
        iconUrl: "https://assets.coincap.io/assets/icons/usdt@2x.png",
        balanceKey: "usdt",
    },
    {
        ticker: "ETH",
        name: "ETH Balance",
        iconUrl: "https://assets.coincap.io/assets/icons/eth@2x.png",
        balanceKey: "eth",
    },
    {
        ticker: "BTC",
        name: "BTC Balance",
        iconUrl: "https://assets.coincap.io/assets/icons/btc@2x.png",
        balanceKey: "btc",
    },
] as const;

// --- New Transaction History Components ---
function getTypeDetails(type: string) {
  switch (type) {
    case 'Deposit':
    case 'Registration Bonus':
      return { label: 'Deposit', amountColor: 'text-green-500' };
    case 'Withdrawal':
      return { label: 'Withdraw', amountColor: 'text-red-500' };
    case 'Grid Profit':
      return { label: 'Grid Profit', amountColor: 'text-sky-500' };
    case 'Team Earnings':
    case 'Invitation Bonus':
      return { label: 'Squad Earnings', amountColor: 'text-purple-500' };
    default:
      return { label: type, amountColor: 'text-foreground' };
  }
}

function TransactionItem({ type, amount, date, status, balance }: Transaction & { balance: number }) {
  const isDepositLike = amount >= 0;
  const statusColor = status === 'Completed' ? 'text-green-600' : status === 'Pending' ? 'text-yellow-500' : 'text-red-500';
  const { label, amountColor } = getTypeDetails(type);
  const time = new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex justify-between items-center border-b pb-3 pt-3">
      <div className="flex items-center space-x-3">
        <UsdtLogoIcon className="w-6 h-6"/>
        <div>
          <p className="font-semibold capitalize">{label}</p>
          <p className="text-sm text-muted-foreground">{time}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={cn('font-bold font-mono', amountColor)}>
          {isDepositLike ? '+' : ''}${Math.abs(amount).toFixed(2)}
        </p>
        <p className={cn('text-sm', statusColor)}>{status}</p>
        <p className="text-xs text-muted-foreground">Balance: ${balance.toFixed(2)}</p>
      </div>
    </div>
  );
}

function DailyEarningsSummary({ deposits, withdrawals, grid, squad }: { deposits: number, withdrawals: number, grid: number, squad: number }) {
  const net = deposits + squad + grid - withdrawals;
  const netColor = net >= 0 ? 'text-green-600' : 'text-red-500';

  return (
    <div className="mt-2 border-t pt-2 text-sm text-muted-foreground grid grid-cols-2 gap-x-4 gap-y-1">
      <div>Total Deposits: <span className="font-medium text-green-600">${deposits.toFixed(2)}</span></div>
      <div>Grid Profits: <span className="font-medium text-sky-500">${grid.toFixed(2)}</span></div>
      <div>Squad Earnings: <span className="font-medium text-purple-500">${squad.toFixed(2)}</span></div>
      <div>Total Withdrawals: <span className="font-medium text-red-600">${withdrawals.toFixed(2)}</span></div>
      <div className="col-span-2 font-semibold">Net for Day: <span className={netColor}>${net.toFixed(2)}</span></div>
    </div>
  );
}

function groupByDate(transactions: Transaction[]) {
  return transactions.reduce((acc, tx) => {
    const date = new Date(tx.date).toISOString().split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(tx);
    return acc;
  }, {} as Record<string, Transaction[]>);
}

function TransactionHistory({ transactions, initialBalance }: { transactions: Transaction[], initialBalance: number }) {
    if (!transactions.length) {
        return (
            <div className="h-24 text-center flex flex-col items-center justify-center text-muted-foreground border-dashed border rounded-md p-4">
                <p className="font-medium">No transactions yet.</p>
                <p className="text-sm">Your transaction history will appear here.</p>
            </div>
        )
    }

  const grouped = groupByDate(transactions);
  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let runningBalance = initialBalance;
  
  return (
    <div className="space-y-5">
      <div className="text-center text-lg font-bold text-foreground">
        Current Balance: ${initialBalance.toFixed(2)}
      </div>

      {sortedDates.map(date => {
        const dayTxs = grouped[date];

        let deposits = 0;
        let withdrawals = 0;
        let grid = 0;
        let squad = 0;

        const items = dayTxs.map(tx => {
          const currentBalance = runningBalance;
          if (tx.status === 'Completed') {
            switch (tx.type) {
                case 'Deposit':
                case 'Registration Bonus':
                  deposits += tx.amount;
                  break;
                case 'Withdrawal':
                  withdrawals += Math.abs(tx.amount);
                  break;
                case 'Grid Profit':
                  grid += tx.amount;
                  break;
                case 'Team Earnings':
                case 'Invitation Bonus':
                  squad += tx.amount;
                  break;
            }
            runningBalance -= tx.amount;
          }
          return <TransactionItem key={tx.id} {...tx} balance={currentBalance} />;
        }).reverse(); // Show oldest transaction first for the day

        return (
          <div key={date}>
            <h2 className="text-lg font-semibold text-primary border-b pb-1 mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4"/>
                {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </h2>
            {items}
            <DailyEarningsSummary
              deposits={deposits}
              withdrawals={withdrawals}
              grid={grid}
              squad={squad}
            />
          </div>
        );
      })}
    </div>
  );
}
// --- End New Transaction History Components ---


export function WalletView() {
  const [walletData, setWalletData] = React.useState<WalletData | null>(null);
  const { user } = useUser();
  const [allAssetsData, setAllAssetsData] = React.useState<CryptoData[]>([]);
  const [tier, setTier] = React.useState<TierData | null>(null);
  const [selectedAsset, setSelectedAsset] = React.useState<CryptoData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchWalletData = React.useCallback(async () => {
    if (user?.id) {
        const [wallet, tiers] = await Promise.all([
          getOrCreateWallet(),
          getBotTierSettings(),
        ]);
        setWalletData(wallet);
        const currentTier = getCurrentTier(wallet.balances?.usdt ?? 0, tiers);
        setTier(currentTier);
      }
  }, [user]);

  React.useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);
  

  const fetchMarketData = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true');
        if (!response.ok) {
            throw new Error('Failed to fetch market data');
        }
        const apiData = await response.json();
        const mappedData: CryptoData[] = apiData.map((coin: any) => ({
            id: coin.id,
            name: coin.name,
            ticker: coin.symbol.toUpperCase(),
            iconUrl: coin.image,
            price: coin.current_price,
            change24h: coin.price_change_percentage_24h,
            volume24h: coin.total_volume,
            marketCap: coin.market_cap,
            priceHistory: coin.sparkline_in_7d.price.map((p: number) => ({ value: p })),
        }));
        setAllAssetsData(mappedData);
        if (!selectedAsset && mappedData.length > 0) {
          setSelectedAsset(mappedData[0]);
        }
    } catch (error: any) {
        console.error(error);
        setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [selectedAsset]);

  React.useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [fetchMarketData]);

  const transactions = React.useMemo(() => {
    if (!walletData || !walletData.created_at) return [];

    const history: Transaction[] = [];
    const registrationDate = new Date(walletData.created_at).toISOString();

    history.push({
      id: `reg-bonus-usdt-${registrationDate}`,
      type: "Registration Bonus",
      asset: "USDT",
      amount: 5,
      date: registrationDate,
      status: "Completed",
    });

    if (walletData.squad.squad_leader) {
      history.push({
        id: `invite-bonus-usdt-${registrationDate}`,
        type: "Invitation Bonus",
        asset: "USDT",
        amount: 5,
        date: registrationDate,
        status: "Completed",
      });
    }

    const growth = walletData.growth as any;
    if (growth.earningsHistory) {
        growth.earningsHistory.forEach((earning: any, index: number) => {
        history.push({
          id: `grid-profit-${earning.timestamp}-${index}`,
          type: "Grid Profit",
          asset: "USDT",
          amount: earning.amount,
          date: new Date(earning.timestamp).toISOString(),
          status: "Completed",
        });
      });
    }

    if(walletData.squad.members) {
      walletData.squad.members.forEach((member: any, index: number) => {
        history.push({
          id: `squad-bonus-${index}-${member.id}`,
          type: "Team Earnings",
          asset: "USDT",
          amount: 5,
          date: new Date(
            Date.now() - Math.random() * (index + 2) * 24 * 60 * 60 * 1000
          ).toISOString(),
          status: "Completed",
        });
      });
    }

    if (walletData.pending_withdrawals) {
        walletData.pending_withdrawals.forEach((w: any) => {
        history.push({
          id: w.id,
          type: "Withdrawal",
          asset: "USDT",
          amount: -w.amount,
          date: new Date(w.timestamp).toISOString(),
          status: "Pending",
        });
      });
    }
    
    // Add pending deposits
    if (walletData.pending_deposits) {
        walletData.pending_deposits.forEach((d: any) => {
            history.push({
                id: d.id,
                type: "Deposit",
                asset: "USDT",
                amount: d.amount,
                date: new Date(d.timestamp).toISOString(),
                status: "Pending",
            });
        });
    }


    return history.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [walletData]);

  const totalBalance = React.useMemo(() => {
    if (!walletData || allAssetsData.length === 0) return 0;
    
    const btcPrice = allAssetsData.find(c => c.ticker === "BTC")?.price ?? 0;
    const ethPrice = allAssetsData.find(c => c.ticker === "ETH")?.price ?? 0;

    const balances = walletData.balances as any;
    return (
        balances.usdt +
        (balances.btc * btcPrice) +
        (balances.eth * ethPrice)
    );
  }, [walletData, allAssetsData]);

  const dailyEarnings = walletData?.growth?.dailyEarnings ?? 0;
  
  const rank = getUserRank(totalBalance);
  const RankIcon = rankIcons[rank.Icon] || RecruitRankIcon;

  const TierIcon = tier ? tierIcons[tier.id] : null;
  const tierClassName = tier ? tierClassNames[tier.id] : null;

    const formatCurrency = (value: number, decimals = 2) =>
    `$${value.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}`;
  
  const formatMarketCap = (value: number) => {
    if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
    return `$${value.toFixed(2)}`;
  }

  const renderRows = (currentData: CryptoData[]) => {
    if (isLoading && allAssetsData.length === 0) {
      return Array.from({ length: 10 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1">
                 <Skeleton className="h-4 w-20" />
                 <Skeleton className="h-3 w-10" />
              </div>
            </div>
          </TableCell>
          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
          <TableCell><Skeleton className="h-5 w-16" /></TableCell>
          <TableCell><Skeleton className="h-5 w-28" /></TableCell>
          {currentData[0]?.marketCap !== undefined && <TableCell><Skeleton className="h-5 w-24" /></TableCell>}
          <TableCell><Skeleton className="h-8 w-32" /></TableCell>
        </TableRow>
      ));
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center">
            <AlertCircle className="mx-auto h-6 w-6 text-destructive mb-2"/>
            Failed to load market data. Please try again later.
          </TableCell>
        </TableRow>
      );
    }

    return currentData.map((asset) => (
      <TableRow 
        key={asset.id}
        onClick={() => setSelectedAsset(asset)}
        className={cn(
          "cursor-pointer",
          selectedAsset?.id === asset.id && "bg-muted/50 hover:bg-muted/60"
        )}
      >
        <TableCell>
          <div className="flex items-center gap-3">
            {asset.iconUrl && <Image
              src={asset.iconUrl}
              alt={`${asset.name} logo`}
              width={32}
              height={32}
              className="rounded-full"
            />}
            <div>
              <div className="font-medium">{asset.name}</div>
              <div className="text-xs text-muted-foreground">{asset.ticker}</div>
            </div>
          </div>
        </TableCell>
        <TableCell className="font-mono text-right">{formatCurrency(asset.price, asset.price < 1 ? 4 : 2)}</TableCell>
        <TableCell
          className={cn(
            "text-right",
            asset.change24h >= 0 ? "text-green-600" : "text-red-600"
          )}
        >
          {asset.change24h >= 0 ? "+" : ""}
          {asset.change24h.toFixed(2)}%
        </TableCell>
        <TableCell className="text-right">{formatMarketCap(asset.volume24h)}</TableCell>
        {asset.marketCap !== undefined && <TableCell className="text-right">{formatMarketCap(asset.marketCap)}</TableCell>}
        <TableCell>
          <div className="h-8 w-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={asset.priceHistory}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={asset.change24h >= 0 ? "hsl(var(--chart-2))" : "hsl(var(--destructive))"}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TableCell>
      </TableRow>
    ));
  };


  if (!walletData) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-60 w-full rounded-lg" />
        <Skeleton className="h-72 w-full rounded-lg" />
      </div>
    );
  }
  
  const balances = walletData.balances as any;
  const assetsWithFunds = assetConfig.filter(asset => balances[asset.balanceKey] > 0);
  const usdtBalance = walletData.balances.usdt;

  return (
    <div className="space-y-6">
      <Card
        className="relative overflow-hidden"
      >
        <div 
          className="absolute inset-0 bg-primary/5 -z-10"
        />
        <CardHeader>
           <CardTitle className="flex flex-wrap items-center gap-x-3 gap-y-2">
            Available Assets
            {walletData && (
              <div className="flex items-center gap-3">
                <Badge variant="outline" className={cn("text-base py-1 px-3 flex items-center gap-1.5", rank.className)}>
                  <RankIcon className="h-5 w-5" />
                  <span>{rank.name}</span>
                </Badge>
                {tier && TierIcon && tierClassName && (
                  <Badge variant="outline" className={cn("text-base py-1 px-3 flex items-center gap-1.5", tierClassName)}>
                    <TierIcon className="h-5 w-5" />
                    <span>{tier.name}</span>
                  </Badge>
                )}
              </div>
            )}
          </CardTitle>
          <CardDescription>
            Your total asset value and individual balances.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Value (USD)
                </p>
                <p className="text-4xl font-bold tracking-tighter">
                  $
                  {totalBalance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  Today's Earnings
                </p>
                <p className="text-lg font-semibold text-green-600">
                  +$
                  {dailyEarnings.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </div>
          {assetsWithFunds.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {assetsWithFunds.map(asset => (
                  <div key={asset.ticker} className="rounded-lg border bg-background/50 p-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <Image src={asset.iconUrl} alt={asset.ticker} width={20} height={20} className="rounded-full" />
                          <span>{asset.name}</span>
                      </div>
                      <p className="text-2xl font-bold mt-1">
                          {asset.balanceKey === 'usdt' && '$'}
                          {balances[asset.balanceKey].toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: asset.balanceKey === 'usdt' ? 2 : 6,
                          }) ?? '0.00'}
                      </p>
                  </div>
              ))}
            </div>
          ) : (
             <div className="text-center text-muted-foreground p-4 border border-dashed rounded-lg">
                You currently have no funds. Make a deposit to get started.
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 text-center">
            {quickAccessItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="flex flex-col items-center justify-center space-y-1 rounded-lg p-1 transition-colors hover:bg-muted"
              >
                <div className="rounded-full bg-primary/10 p-2">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
        
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-3">
          <Tabs defaultValue="crypto" className="w-full">
                <TabsList className="grid w-full grid-cols-4 m-6 mb-0">
                    <TabsTrigger value="crypto" disabled><Bitcoin className="mr-2"/>Crypto</TabsTrigger>
                    <TabsTrigger value="stocks" disabled><TrendingUp className="mr-2"/>Stocks</TabsTrigger>
                    <TabsTrigger value="commodities" disabled><Scale className="mr-2"/>Commodities</TabsTrigger>
                    <TabsTrigger value="forex" disabled><Landmark className="mr-2"/>Forex</TabsTrigger>
                </TabsList>
                <TabsContent value="crypto">
                    <Card>
                      <CardHeader>
                        <CardTitle>Live Crypto Market</CardTitle>
                        <CardDescription>Select a cryptocurrency to view its live chart. Data refreshes automatically.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                            <TableHeader><TableRow><TableHead>Asset</TableHead><TableHead className="text-right">Price</TableHead><TableHead className="text-right">24h Change</TableHead><TableHead className="text-right">24h Volume</TableHead><TableHead className="text-right">Market Cap</TableHead><TableHead>Last 7 Days</TableHead></TableRow></TableHeader>
                            <TableBody>{renderRows(allAssetsData)}</TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                </TabsContent>
              </Tabs>
          </Card>
      </div>


      <Card>
        <CardHeader>
          <CardTitle>Wallet History (USDT)</CardTitle>
          <CardDescription>
            A record of all your deposits, withdrawals, and earnings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionHistory transactions={transactions} initialBalance={usdtBalance} />
        </CardContent>
      </Card>
    </div>
  );
}
