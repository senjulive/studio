"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, MessageCircle } from "lucide-react";
import { SupportChatManager } from "./support-chat-manager";
import { PublicChatManager } from "./public-chat-manager";

export function MessageViewer() {
  return (
    <Tabs defaultValue="support">
      <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 gap-1">
        <TabsTrigger value="support" className="text-xs sm:text-sm">
          <MessageSquare className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Support Chat</span>
          <span className="sm:hidden">Support</span>
        </TabsTrigger>
        <TabsTrigger value="public" className="text-xs sm:text-sm">
          <MessageCircle className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Public Chat</span>
          <span className="sm:hidden">Public</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="support" className="mt-4">
        <SupportChatManager />
      </TabsContent>
      <TabsContent value="public" className="mt-4">
        <PublicChatManager />
      </TabsContent>
    </Tabs>
  );
}
