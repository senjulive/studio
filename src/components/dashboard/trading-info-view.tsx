
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Gem, Trophy, TrendingUp, Unlock } from "lucide-react";
import { getBotTierSettings, type TierSetting } from "@/lib/settings";
import { ranks } from "@/lib/ranks";
import { Badge } from "@/components/ui/badge";

const Section = ({ title, icon: Icon, children }: { title: string, icon?: React.ElementType, children: React.ReactNode }) => (
    <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground border-b pb-2 flex items-center gap-2">
            {Icon && <Icon className="h-5 w-5 text-primary" />}
            {title}
        </h2>
        {children}
    </div>
);

export function TradingInfoView() {
  const [tierSettings, setTierSettings] = React.useState<TierSetting[]>([]);

  React.useEffect(() => {
    async function fetchSettings() {
        const settings = await getBotTierSettings();
        setTierSettings(settings);
    }
    fetchSettings();
  }, []);
  
  const calculateEarnings = (balance: number, dailyProfit: number, days: number) => {
    // Note: This is a simple projection and doesn't account for compounding.
    const dailyEarning = balance * dailyProfit;
    return dailyEarning * days;
  };


  return (
    <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
            <CardTitle className="text-3xl font-headline">Tiers & Ranks</CardTitle>
            <CardDescription className="max-w-2xl mx-auto">
                Understand how your balance unlocks higher profit potential and prestigious account ranks on the AstralCore platform.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pt-4">
            <Section title="Trading Tiers & Profit Potential" icon={Gem}>
                <p className="text-muted-foreground">
                    Your profit potential is directly linked to your account tier, which is determined by your total asset balance. As you climb the tiers, you unlock more daily grid trades and a higher profit rate, allowing our bot to generate more returns for you. The system is designed to reward growth and investment in your portfolio.
                </p>
                 <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tier Name</TableHead>
                                <TableHead className="text-right">Min. Balance (USDT)</TableHead>
                                <TableHead className="text-right">Daily Grids</TableHead>
                                <TableHead className="text-right">Daily Profit Rate</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tierSettings.map((tier) => (
                                <TableRow key={tier.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <tier.Icon className="h-5 w-5" />
                                            <span className={tier.className}>{tier.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-mono">${tier.balanceThreshold.toLocaleString()}</TableCell>
                                    <TableCell className="text-right font-mono">{tier.clicks}</TableCell>
                                    <TableCell className="text-right font-mono text-green-600">~{(tier.dailyProfit * 100).toFixed(1)}%</TableCell>
                                    <TableCell className="text-right">
                                        {tier.name.includes('VII') || tier.name.includes('VIII') ? (
                                            <Badge variant="secondary">Locked</Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-green-600 border-green-600/50">
                                                <Unlock className="mr-1 h-3 w-3" />
                                                Available
                                            </Badge>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </Section>

            <Section title="Estimated Earnings" icon={TrendingUp}>
                <p className="text-muted-foreground">
                    The table below provides a projection of potential earnings based on the minimum balance required for each tier. These are estimates to illustrate how higher tiers can accelerate your growth on the platform.
                </p>
                 <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tier</TableHead>
                                <TableHead className="text-right">15 Days</TableHead>
                                <TableHead className="text-right">30 Days</TableHead>
                                <TableHead className="text-right">60 Days</TableHead>
                                <TableHead className="text-right">90 Days</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tierSettings.filter(t => t.balanceThreshold > 0).map((tier) => (
                                <TableRow key={`earnings-${tier.id}`} className={tier.name.includes('VII') || tier.name.includes('VIII') ? 'opacity-50' : ''}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <tier.Icon className="h-5 w-5" />
                                            <span className={tier.className}>{tier.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-green-600">${calculateEarnings(tier.balanceThreshold, tier.dailyProfit, 15).toFixed(2)}</TableCell>
                                    <TableCell className="text-right font-mono text-green-600">${calculateEarnings(tier.balanceThreshold, tier.dailyProfit, 30).toFixed(2)}</TableCell>
                                    <TableCell className="text-right font-mono text-green-600">${calculateEarnings(tier.balanceThreshold, tier.dailyProfit, 60).toFixed(2)}</TableCell>
                                    <TableCell className="text-right font-mono text-green-600">${calculateEarnings(tier.balanceThreshold, tier.dailyProfit, 90).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </Section>

            <Section title="Account Ranks" icon={Trophy}>
                <p className="text-muted-foreground">
                    As your balance grows, you'll achieve new ranks that signify your status and journey on the platform. Each rank is a badge of honor, representing a significant milestone in your trading success. Ranks provide a clear path of progression and are displayed proudly on your profile.
                </p>
                 <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Rank</TableHead>
                                <TableHead className="text-right">Balance Requirement (USDT)</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ranks.map((rank) => (
                                <TableRow key={rank.name}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <rank.Icon className="h-5 w-5" />
                                            <span className={rank.className}>{rank.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-mono">${rank.minBalance.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">
                                         {rank.name === 'Astral' || rank.name === 'Cosmic' ? (
                                            <Badge variant="secondary">Locked</Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-green-600 border-green-600/50">
                                                <Unlock className="mr-1 h-3 w-3" />
                                                Available
                                            </Badge>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </Section>
            
            <div>
                 <p className="text-sm text-center text-muted-foreground italic mt-8">
                    Disclaimer: All trading involves risk. The earnings estimates are projections based on current data. Past performance is not indicative of future results. Please invest responsibly.
                </p>
            </div>

        </CardContent>
    </Card>
  );
}

    