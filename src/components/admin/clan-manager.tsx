"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MessageSquare, Pencil, RefreshCw, Save, Trash2 } from "lucide-react";

type Clan = {
  id: string;
  name: string;
  avatarUrl: string;
  leaderId: string;
  members: string[];
};

type ClanChatMessage = {
  id: string;
  clanId: string;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  text: string;
  timestamp: number;
};

export function ClanManager() {
  const { toast } = useToast();
  const [clans, setClans] = React.useState<Record<string, Clan>>({});
  const [editing, setEditing] = React.useState<Record<string, { name: string; avatarUrl: string }>>({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [viewingClan, setViewingClan] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState<ClanChatMessage[]>([]);
  const [isSaving, setIsSaving] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);

  const fetchClans = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/squad/clans");
      const data = (await res.json()) as { clans?: Record<string, Clan>; error?: string };
      if (!res.ok) throw new Error(data?.error || "Failed to fetch clans");
      const clansMap: Record<string, Clan> = data?.clans ?? {};
      setClans(clansMap);

      // Build a strongly-typed editing map without relying on Object.fromEntries inference.
      const editingMap: Record<string, { name: string; avatarUrl: string }> = {};
      (Object.values(clansMap) as Clan[]).forEach((c) => {
        editingMap[c.id] = { name: c.name, avatarUrl: c.avatarUrl ?? "" };
      });
      setEditing(editingMap);
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to fetch clans", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchClans();
  }, [fetchClans]);

  const saveClan = async (clanId: string) => {
    try {
      setIsSaving(clanId);
      const payload = editing[clanId];
      const res = await fetch("/api/admin/squad/clans", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clanId, ...payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update clan");
      toast({ title: "Updated", description: "Clan details saved." });
      fetchClans();
    } catch (e: any) {
      toast({ title: "Update Failed", description: e.message, variant: "destructive" });
    } finally {
      setIsSaving(null);
    }
  };

  const deleteClan = async (clanId: string) => {
    try {
      setIsDeleting(clanId);
      const res = await fetch("/api/admin/squad/clans", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clanId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete clan");
      toast({ title: "Deleted", description: "Clan removed." });
      fetchClans();
      if (viewingClan === clanId) {
        setViewingClan(null);
        setMessages([]);
      }
    } catch (e: any) {
      toast({ title: "Delete Failed", description: e.message, variant: "destructive" });
    } finally {
      setIsDeleting(null);
    }
  };

  const viewChat = async (clanId: string) => {
    try {
      setViewingClan(clanId);
      const res = await fetch(`/api/admin/squad/clans/chat?clanId=${encodeURIComponent(clanId)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch chat");
      setMessages(data.messages || []);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const clearChat = async (clanId: string) => {
    try {
      const res = await fetch("/api/admin/squad/clans/chat", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clanId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to clear chat");
      toast({ title: "Cleared", description: "Clan chat cleared." });
      if (viewingClan === clanId) setMessages([]);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Clan Manager</CardTitle>
          <CardDescription>Review, rename, and remove clans. Inspect or clear clan chats.</CardDescription>
        </div>
        <Button variant="outline" onClick={fetchClans} size="icon" disabled={isLoading}>
          <RefreshCw className={isLoading ? "animate-spin" : ""} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Clan ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Avatar URL</TableHead>
                <TableHead className="text-right">Members</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.values(clans).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No clans found.
                  </TableCell>
                </TableRow>
              ) : (
                Object.values(clans).map((clan: Clan) => (
                  <TableRow key={clan.id}>
                    <TableCell className="font-mono text-xs">{clan.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Pencil className="h-3 w-3 text-muted-foreground" />
                        <Input
                          value={editing[clan.id]?.name ?? clan.name}
                          onChange={(e) =>
                            setEditing((prev) => ({ ...prev, [clan.id]: { ...(prev[clan.id] || {}), name: e.target.value } }))
                          }
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input
                        value={editing[clan.id]?.avatarUrl ?? clan.avatarUrl}
                        onChange={(e) =>
                          setEditing((prev) => ({ ...prev, [clan.id]: { ...(prev[clan.id] || {}), avatarUrl: e.target.value } }))
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right">{clan.members.length}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewChat(clan.id)}
                        title="View Chat"
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Chat
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => saveClan(clan.id)}
                        disabled={isSaving === clan.id}
                        title="Save"
                      >
                        {isSaving === clan.id ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
                        Save
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteClan(clan.id)}
                        disabled={isDeleting === clan.id}
                        title="Delete Clan"
                      >
                        {isDeleting === clan.id ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Trash2 className="h-4 w-4 mr-1" />}
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {viewingClan && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Chat Messages for {viewingClan}</h3>
              <Button variant="outline" onClick={() => clearChat(viewingClan)}>Clear Chat</Button>
            </div>
            <div className="border rounded-lg max-h-80 overflow-auto p-2 space-y-2 bg-muted/30">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground text-sm">No messages.</div>
              ) : (
                messages
                  .sort((a, b) => a.timestamp - b.timestamp)
                  .map((m) => (
                    <div key={m.id} className="flex items-start gap-2">
                      <div className="rounded bg-background px-2 py-1 text-xs text-muted-foreground">{new Date(m.timestamp).toLocaleString()}</div>
                      <div className="font-medium">{m.displayName}</div>
                      <div className="text-sm">{m.text}</div>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}