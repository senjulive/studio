
"use client";

import * as React from "react";
import { Copy, Users, UserCheck, QrCode, User } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { getOrCreateWallet, type WalletData } from "@/lib/wallet";
import { useUser } from "@/app/dashboard/layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { SquadMember } from "@/app/api/squad/route";

const SubSquad = ({ members }: { members: SquadMember[] }) => {
    if (members.length === 0) {
        return <p className="text-sm text-muted-foreground py-2 pl-2">This member has not recruited anyone yet.</p>;
    }

    return (
        <Accordion type="multiple" className="w-full pl-3 border-l ml-3">
            {members.map(member => (
                <AccordionItem value={member.id} key={member.id} className="border-b-0">
                    <AccordionTrigger className="py-2">
                        <div className="flex items-center gap-3">
                            <User className="h-5 w-5 text-muted-foreground"/>
                            <div>
                                <p className="font-semibold text-sm">{member.username}</p>
                                {member.team.length > 0 && <p className="text-xs text-muted-foreground">{member.team.length} members</p>}
                            </div>
                            {member.team.length > 0 && <Badge variant="secondary">Sub-Leader</Badge>}
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <SubSquad members={member.team} />
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
};


export function SquadSystem() {
  const { toast } = useToast();
  const [walletData, setWalletData] = React.useState<WalletData | null>(null);
  const [squadLink, setSquadLink] = React.useState("");
  const { user } = useUser();
  const [squadTree, setSquadTree] = React.useState<SquadMember[]>([]);
  const [isSquadLoading, setIsSquadLoading] = React.useState(true);

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
      if (user) {
          const fetchSquad = async () => {
              setIsSquadLoading(true);
              try {
                  const response = await fetch('/api/squad');
                  if (!response.ok) {
                      const err = await response.json();
                      throw new Error(err.error || 'Failed to fetch squad data');
                  }
                  const data = await response.json();
                  if (data.error) throw new Error(data.error);
                  setSquadTree(data);
              } catch (error: any) {
                  console.error(error);
                  toast({ title: "Could not load squad", description: error.message, variant: "destructive" });
              } finally {
                  setIsSquadLoading(false);
              }
          };
          fetchSquad();
      }
  }, [user, toast]);

  React.useEffect(() => {
    if (referralCode) {
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

  const squadLeader = walletData?.squad?.squadLeader;
  const countMembers = (members: SquadMember[]): number => members.reduce((acc, member) => acc + 1 + countMembers(member.team), 0);
  const totalMembers = countMembers(squadTree);
  const totalEarnings = totalMembers * 5;

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
                From {totalMembers} squad member{totalMembers !== 1 && 's'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Squad Roster</CardTitle>
               <CardDescription>
                Your squad hierarchy. Expand to see the chain.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSquadLoading ? (
                  <div className="space-y-2">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                  </div>
              ) : squadTree.length > 0 ? (
                  <SubSquad members={squadTree} />
              ) : (
                  <div className="h-24 text-center flex items-center justify-center text-muted-foreground">
                    Your squad is empty. Start inviting!
                  </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
