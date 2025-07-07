"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield } from "lucide-react";
import { WalletManager } from "./wallet-manager";
import { MessageViewer } from "./message-viewer";
import { BotSettingsManager } from "./bot-settings-manager";

export function AdminPanel() {
  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-primary"/>
            </div>
            <div>
                <CardTitle>Administrator Panel</CardTitle>
                <CardDescription>
                  Manage wallets, support, and bot settings.
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="wallets" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="wallets">Wallet Management</TabsTrigger>
            <TabsTrigger value="messages">User Messages</TabsTrigger>
            <TabsTrigger value="bot-settings">Bot Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="wallets" className="mt-6">
            <WalletManager />
          </TabsContent>
          <TabsContent value="messages" className="mt-6">
            <MessageViewer />
          </TabsContent>
          <TabsContent value="bot-settings" className="mt-6">
            <BotSettingsManager />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
