
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bot, Layers, TrendingUp, Cpu, Info } from "lucide-react";

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="flex items-start gap-4">
        <div className="bg-primary/10 text-primary p-3 rounded-full mt-1">
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
                <p className="text-muted-foreground leading-relaxed">
                    AstralCore is an intelligent crypto management platform designed to simplify and automate your trading strategy. At its heart is a sophisticated trading bot that employs a time-tested technique known as **Grid Trading**. Our goal is to empower users, from beginners to experts, to consistently generate profits by leveraging the natural price fluctuations of the cryptocurrency market.
                </p>
            </Section>
            
            <Section title="The Power of Grid Trading">
                <p className="text-muted-foreground leading-relaxed">
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

            <Section title="Why Choose AstralCore?">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
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
