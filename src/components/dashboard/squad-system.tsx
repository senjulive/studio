"use client";

import * as React from "react";
import { Copy, Users, UserCheck } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUserEmail } from "@/lib/auth";
import { getOrCreateWallet, type WalletData } from "@/lib/wallet";

export function SquadSystem() {
  const { toast } = useToast();
  const [walletData, setWalletData] = React.useState<WalletData | null>(null);
  const [squadLink, setSquadLink] = React.useState("");

  const referralCode = walletData?.squad.referralCode || "";

  React.useEffect(() => {
    const email = getCurrentUserEmail();
    if (email) {
      async function fetchWallet() {
        const data = await getOrCreateWallet(email);
        setWalletData(data);
      }
      fetchWallet();
    }
  }, []);

  React.useEffect(() => {
    if (referralCode) {
      // Ensure this runs only on the client to safely access window.location
      setSquadLink(`${window.location.origin}/register?referralCode=${referralCode}`);
    }
  }, [referralCode]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied to clipboard!" });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const squadMembers = walletData?.squad.members || [];
  const squadLeader = walletData?.squad.squadLeader;
  const totalEarnings = squadMembers.length * 5;

  if (!walletData) {
    return (
        <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
                <Skeleton className="h-56 w-full" />
                <Skeleton className="h-72 w-full" />
            </div>
            <div className="space-y-6">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      {squadLeader && (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-primary" />
                    You're in a Squad!
                </CardTitle>
                <CardDescription>
                    Your squad leader is <span className="font-semibold text-foreground">{squadLeader}</span>.
                </CardDescription>
            </CardHeader>
        </Card>
      )}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Build Your Squad</CardTitle>
              <CardDescription>
                Share your squad code or link. You'll both earn $5 in your virtual wallet for every friend who joins.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="squad-code">Your Squad Code</Label>
                <div className="flex items-center gap-2">
                  <Input id="squad-code" value={referralCode} readOnly />
                  <Button variant="outline" size="icon" onClick={() => handleCopy(referralCode)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="squad-link">Your Squad Link</Label>
                <div className="flex items-center gap-2">
                  <Input id="squad-link" value={squadLink} readOnly />
                  <Button variant="outline" size="icon" onClick={() => handleCopy(squadLink)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Squad Members</CardTitle>
              <CardDescription>
                A list of users who have joined your squad.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member Email</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {squadMembers.length > 0 ? (
                    squadMembers.map((memberEmail) => (
                      <TableRow key={memberEmail}>
                        <TableCell className="font-medium">{memberEmail}</TableCell>
                        <TableCell>
                          <Badge variant="default">Active</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                        <TableCell colSpan={2} className="text-center h-24 text-muted-foreground">
                            Your squad is empty. Start inviting!
                        </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Squad Earnings</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                        From {squadMembers.length} squad member{squadMembers.length !== 1 && 's'}
                    </p>
                </CardContent>
            </Card>
            <Card className="flex flex-col items-center text-center">
              <CardHeader>
                <CardTitle>Share via QR Code</CardTitle>
              </CardHeader>
              <CardContent>
                {squadLink ? (
                  <QRCodeSVG value={squadLink} size={160} fgColor="hsl(var(--foreground))" bgColor="transparent" />
                ) : (
                  <div className="h-[160px] w-[160px] bg-muted rounded-md flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Loading QR Code...</p>
                  </div>
                )}
                <p className="mt-4 text-xs text-muted-foreground">
                    Let friends scan this to join your squad.
                </p>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
