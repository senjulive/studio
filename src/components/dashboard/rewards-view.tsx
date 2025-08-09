'use client';

import * as React from 'react';
import type { SVGProps } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/contexts/UserContext';
import { ranks, type Rank } from '@/lib/ranks';
import { type TierSetting } from '@/lib/tiers';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';
import { Award, Check, GitBranch, Lock, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getRewardSettings } from '@/lib/rewards';

import { RecruitRankIcon } from '@/components/icons/ranks/recruit-rank-icon';
import { BronzeRankIcon } from '@/components/icons/ranks/bronze-rank-icon';
import { SilverRankIcon } from '@/components/icons/ranks/silver-rank-icon';
import { GoldRankIcon } from '@/components/icons/ranks/gold-rank-icon';
import { PlatinumRankIcon } from '@/components/icons/ranks/platinum-rank-icon';
import { DiamondRankIcon } from '@/components/icons/ranks/diamond-rank-icon';
import { tierIcons } from '@/lib/settings';

type IconComponent = (props: SVGProps<SVGSVGElement>) => JSX.Element;

const rankIcons: Record<string, IconComponent> = {
    RecruitRankIcon, BronzeRankIcon, SilverRankIcon, GoldRankIcon, PlatinumRankIcon, DiamondRankIcon, Lock: (props: SVGProps<SVGSVGElement>) => <Lock {...props} />,
};

type RewardSettings = {
  rankAchievementBonus: number;
  tierAchievementBonus: number;
  referralBonusTier1: number;
  referralBonusTier2: number;
  newUserBonus: number;
};

const AchievementItem = ({
  item,
  type,
  isUnlocked,
  isClaimed,
  onClaim,
  isClaiming,
  bonus,
}: {
  item: Rank | TierSetting;
  type: 'rank' | 'tier';
  isUnlocked: boolean;
  isClaimed: boolean;
  onClaim: () => void;
  isClaiming: boolean;
  bonus: number;
}) => {
    // @ts-ignore
    const Icon = type === 'rank' ? rankIcons[item.Icon] : tierIcons[item.id];

    return (
      <div className={cn(
        "flex flex-col items-center gap-4 rounded-lg border p-4 text-center transition-all",
        isUnlocked ? "border-primary/50 bg-card shadow-lg" : "border-dashed bg-muted/50 text-muted-foreground",
        !isUnlocked && "grayscale"
      )}>
        <Icon style={{width: '1.9cm', height: '1.9cm'}}/>
        <div className="flex-1">
          <p className="font-bold text-lg text-foreground">{item.name}</p>
          <p className="text-sm">Min. Balance: ${item.balanceThreshold.toLocaleString()}</p>
        </div>
        {isUnlocked && <p className="font-semibold text-primary">🎉 Congratulations! 🎉</p>}
        {isUnlocked && (
           <Button onClick={onClaim} disabled={isClaimed || isClaiming} className="w-full">
                {isClaiming ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : isClaimed ? <Check className="mr-2 h-4 w-4"/> : <Award className="mr-2 h-4 w-4"/>}
                {isClaimed ? "Claimed" : `Claim $${bonus}`}
           </Button>
        )}
      </div>
    );
};

export function RewardsView() {
    const { user, wallet, rank, tier, tierSettings } = useUser();
    const { toast } = useToast();
    const [claiming, setClaiming] = React.useState<string | null>(null);
    const [rewardSettings, setRewardSettings] = React.useState<RewardSettings | null>(null);

    React.useEffect(() => {
        getRewardSettings().then(setRewardSettings);
    }, []);

    const handleClaim = async (type: 'rank' | 'tier', key: string) => {
        if (!user) return;
        setClaiming(`${type}-${key}`);
        try {
            const response = await fetch('/api/rewards/claim', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, type, key }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Failed to claim reward.');
            toast({ title: "Reward Claimed!", description: "Your balance has been updated." });
            // Here you would ideally refetch the wallet data to update the UI
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setClaiming(null);
        }
    };

    const isLoading = !wallet || !rank || !tier || !rewardSettings;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Rewards Center</CardTitle>
                <CardDescription>Unlock achievements and claim bonuses for your progress and for growing your squad.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="achievements">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="achievements"><Award className="mr-2 h-4 w-4"/> Achievements</TabsTrigger>
                        <TabsTrigger value="referrals"><GitBranch className="mr-2 h-4 w-4"/> Squad Referrals</TabsTrigger>
                    </TabsList>
                    <TabsContent value="achievements" className="mt-6">
                         <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-semibold mb-4 text-center">Account Ranks</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {isLoading ? Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-64 w-full"/>) :
                                    ranks.filter(r => r.Icon !== 'Lock').map(r => (
                                        <AchievementItem
                                            key={r.name}
                                            item={r}
                                            type="rank"
                                            isUnlocked={wallet.balances.usdt >= r.minBalance}
                                            isClaimed={wallet.claimed_achievements?.ranks?.includes(r.name)}
                                            onClaim={() => handleClaim('rank', r.name)}
                                            isClaiming={claiming === `rank-${r.name}`}
                                            bonus={rewardSettings.rankAchievementBonus}
                                        />
                                    ))
                                }
                                </div>
                            </div>
                             <div>
                                <h3 className="text-xl font-semibold mb-4 text-center">VIP CORE Tiers</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {isLoading ? Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-64 w-full"/>) :
                                    tierSettings.filter(t => !t.locked).map(t => (
                                        <AchievementItem
                                            key={t.id}
                                            item={t}
                                            type="tier"
                                            isUnlocked={wallet.balances.usdt >= t.balanceThreshold}
                                            isClaimed={wallet.claimed_achievements?.tiers?.includes(t.id)}
                                            onClaim={() => handleClaim('tier', t.id)}
                                            isClaiming={claiming === `tier-${t.id}`}
                                            bonus={rewardSettings.tierAchievementBonus}
                                        />
                                    ))
                                }
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="referrals" className="mt-6">
                        <p className="text-center text-muted-foreground">Referral claims feature coming soon!</p>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
