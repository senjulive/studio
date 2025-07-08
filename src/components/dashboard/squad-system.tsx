
"use client";

import * as React from "react";
import { Copy, Users, UserCheck, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { getOrCreateWallet, type WalletData } from "@/lib/wallet";
import { useUser } from "@/app/dashboard/layout";

export function SquadSystem() {
  const { toast } = useToast();
  const [walletData, setWalletData] = React.useState<WalletData | null>(null);
  const [squadLink, setSquadLink] = React.useState("");
  const { user } = useUser();

  const referralCode = walletData?.squad?.referralCode || "";

  React.useEffect(() => {
    if (user?.id) {
      async function fetchWallet() {
        const data = await getOrCreateWallet(user.id);
        setWalletData(data);
      }
      fetchWallet();
    }
  }, [user]);

  React.useEffect(() => {
    if (referralCode) {
      // Ensure this runs only on the client to safely access window.location
      setSquadLink(`${window.location.origin}/register?referralCode=${referralCode}`);
    }
  }, [referralCode]);

  const handleCopy = async (text: string) => {
    if (!text) return;
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

  const squadMembers = walletData?.squad?.members || [];
  const squadLeader = walletData?.squad?.squadLeader;
  const totalEarnings = squadMembers.length * 5;

  if (!walletData) {
    return (
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {squadLeader && (
        <Alert>
            <UserCheck className="h-4 w-4" />
            <AlertTitle>You're in a Squad!</AlertTitle>
            <AlertDescription>
                Your squad leader is <span className="font-semibold text-foreground">{squadLeader.username}</span>. Keep growing your assets together.
            </AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Build Your Squad</CardTitle>
            <CardDescription>
              Share your squad code or link. You'll both earn $5 in your wallet for every new member who joins.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="squad-code">Your Unique Squad Code</Label>
              <div className="flex items-center gap-2">
                <Input id="squad-code" value={referralCode} readOnly className="font-mono text-base" />
                <Button variant="outline" size="icon" onClick={() => handleCopy(referralCode)} aria-label="Copy squad code">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="squad-link">Your Invitation Link</Label>
              <div className="flex items-center gap-2">
                <Input id="squad-link" value={squadLink} readOnly />
                <Button variant="outline" size="icon" onClick={() => handleCopy(squadLink)} aria-label="Copy squad link">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <QrCode className="mr-2 h-4 w-4" />
                        Show QR Code
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-xs">
                    <DialogHeader>
                        <DialogTitle>Share Your QR Code</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center p-4 text-center">
                    {squadLink ? (
                      <div className="p-4 bg-white rounded-lg">
                        <QRCodeSVG value={squadLink} size={200} fgColor="#000" bgColor="#fff" />
                      </div>
                    ) : (
                      <div className="h-[216px] w-[216px] bg-muted rounded-lg flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">Loading QR Code...</p>
                      </div>
                    )}
                    <p className="mt-4 text-sm text-muted-foreground">
                        Let friends scan this to join your squad instantly.
                    </p>
                    </div>
                </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>

        <div className="space-y-6 lg:col-span-2">
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
          <Card>
            <CardHeader>
              <CardTitle>Squad Roster</CardTitle>
               <CardDescription>
                A list of users who have joined your squad.
              </CardDescription>
            </Header>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member Email</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {squadMembers.length > 0 ? (
                    squadMembers.map((memberEmail) => (
                      <TableRow key={memberEmail}>
                        <TableCell className="font-medium">{memberEmail}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary">Active</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="h-24 text-center text-muted-foreground">
                        Your squad is empty. Start inviting!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
