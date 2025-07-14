
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bot, Layers, TrendingUp, Cpu, Info, Gem, Trophy } from "lucide-react";
import { getBotTierSettings, type TierSetting } from "@/lib/settings";
import { ranks } from "@/lib/ranks";

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="flex items-start gap-4">
        <div className="bg-primary/10 text-primary p-3 rounded-full">
            {icon}
        </div>
        <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    </div>
);

const Section = ({ title, icon: Icon, children }: { title: string, icon?: React.ElementType, children: React.ReactNode }) => (
    <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground border-b pb-2 flex items-center gap-2">
            {Icon && <Icon className="h-5 w-5 text-primary" />}
            {title}
        </h2>
        {children}
    </div>
);

export function AboutView() {
  const [tierSettings, setTierSettings] = React.useState<TierSetting[]>([]);

  React.useEffect(() => {
    async function fetchSettings() {
        const settings = await getBotTierSettings();
        setTierSettings(settings);
    }
    fetchSettings();
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full mb-2 w-fit">
                <Cpu className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-headline">AstralCore Trading Platform</CardTitle>
            <CardDescription className="max-w-2xl mx-auto">
                Discover the strategy behind our automated trading bot and how it helps you capitalize on market volatility.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pt-4">
            <Section title="What is AstralCore?">
                <p className="text-muted-foreground">
                    AstralCore is an intelligent crypto management platform designed to simplify and automate your trading strategy. At its heart is a sophisticated trading bot that employs a time-tested technique known as **Grid Trading**. Our goal is to empower users, from beginners to experts, to consistently generate profits by leveraging the natural price fluctuations of the cryptocurrency market.
                </p>
            </Section>
            
            <Section title="The Power of Grid Trading">
                <p className="text-muted-foreground">
                    Grid Trading is a strategy that automates buying and selling cryptocurrencies at preset intervals around a static price. It involves placing a series of buy and sell orders at incrementally increasing and decreasing prices, creating a "grid" of orders. This approach thrives in volatile, sideways markets, turning price fluctuations into profitable opportunities.
                </p>
                <Alert className="bg-muted/50 border-l-primary">
                    <Info className="h-4 w-4" />
                    <AlertTitle>How The Bot Works</AlertTitle>
                    <AlertDescription>
                        The fundamental idea is simple: **Buy Low, Sell High**. The bot automatically executes buy orders when the price drops and sell orders when it rises, capturing small profits from each completed pair of trades. The higher your asset balance, the more grids you can run per day, and the higher your potential profit percentage.
                    </AlertDescription>
                </Alert>
            </Section>

            <Section title="Trading Tiers & Profit Potential" icon={Gem}>
                <p className="text-muted-foreground">
                    Your profit potential is determined by your account tier, which is based on your total asset balance. Higher tiers unlock more daily grids and a better profit rate.
                </p>
                 <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tier Name</TableHead>
                                <TableHead className="text-right">Min. Balance (USDT)</TableHead>
                                <TableHead className="text-right">Daily Grids</TableHead>
                                <TableHead className="text-right">Daily Profit Rate</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tierSettings.map((tier) => (
                                <TableRow key={tier.id}>
                                    <TableCell className="font-medium">{tier.name}</TableCell>
                                    <TableCell className="text-right font-mono">${tier.balanceThreshold.toLocaleString()}</TableCell>
                                    <TableCell className="text-right font-mono">{tier.clicks}</TableCell>
                                    <TableCell className="text-right font-mono text-green-600">~{(tier.dailyProfit * 100).toFixed(1)}%</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </Section>

            <Section title="Account Ranks" icon={Trophy}>
                <p className="text-muted-foreground">
                    As your balance grows, you'll achieve new ranks that signify your status on the platform. Each rank is a milestone in your trading journey.
                </p>
                 <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Rank</TableHead>
                                <TableHead className="text-right">Balance Requirement (USDT)</TableHead>
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
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </Section>

            <Section title="Why Choose AstralCore?">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FeatureCard 
                        icon={<Bot className="h-6 w-6" />}
                        title="Fully Automated"
                        description="Set it and forget it. Our bot operates 24/7, executing trades based on the grid you define, so you don't have to monitor the markets constantly."
                    />
                    <FeatureCard 
                        icon={<Layers className="h-6 w-6" />}
                        title="Profit from Volatility"
                        description="Instead of fearing market swings, our grid system is designed to profit from them. The more the price fluctuates within your set range, the more trades are executed."
                    />
                    <FeatureCard 
                        icon={<TrendingUp className="h-6 w-6" />}
                        title="Consistent Growth"
                        description="By locking in small, frequent profits, the grid strategy aims for steady, incremental growth of your assets over time, reducing the risk associated with lump-sum investments."
                    />
                     <FeatureCard 
                        icon={<Cpu className="h-6 w-6" />}
                        title="Simplified for You"
                        description="We've taken the complexity out of grid trading. With our tiered system, you don't need to manually configure prices. Just start the bot and let it work based on your balance tier."
                    />
                </div>
            </Section>
            
            <div>
                 <p className="text-sm text-center text-muted-foreground italic mt-8">
                    Disclaimer: All trading involves risk. Past performance is not indicative of future results. Please invest responsibly.
                </p>
            </div>

        </CardContent>
    </Card>
  );
}
