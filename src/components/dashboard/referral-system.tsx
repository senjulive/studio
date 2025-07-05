"use client";

import * as React from "react";
import { Copy, Gift, Users } from "lucide-react";
import { QRCodeSVG as QRCode } from "qrcode.react";

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

const MOCK_REFERRALS = [
  { id: 1, email: "friend1@example.com", date: "2024-05-20", status: "Completed", bonus: 5.00 },
  { id: 2, email: "friend2@example.com", date: "2024-05-18", status: "Completed", bonus: 5.00 },
  { id: 3, email: "user@test.com", date: "2024-05-15", status: "Pending", bonus: 5.00 },
  { id: 4, email: "guest@example.com", date: "2024-05-12", status: "Completed", bonus: 5.00 },
  { id: 5, email: "another@test.com", date: "2024-05-10", status: "Completed", bonus: 5.00 },
];

export function ReferralSystem() {
  const { toast } = useToast();
  const [referralCode] = React.useState("ASTRAL123XYZ");
  const [referralLink, setReferralLink] = React.useState("");

  React.useEffect(() => {
    // Ensure this runs only on the client to safely access window.location
    setReferralLink(`${window.location.origin}/register?ref=${referralCode}`);
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

  const totalEarnings = MOCK_REFERRALS.filter(r => r.status === 'Completed').reduce((sum, ref) => sum + ref.bonus, 0);
  const completedReferrals = MOCK_REFERRALS.filter(r => r.status === 'Completed').length;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Invite Your Friends</CardTitle>
              <CardDescription>
                Share your referral link or code. You'll earn $5 in your virtual wallet for every friend who signs up.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="referral-code">Your Referral Code</Label>
                <div className="flex items-center gap-2">
                  <Input id="referral-code" value={referralCode} readOnly />
                  <Button variant="outline" size="icon" onClick={() => handleCopy(referralCode)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="referral-link">Your Referral Link</Label>
                <div className="flex items-center gap-2">
                  <Input id="referral-link" value={referralLink} readOnly />
                  <Button variant="outline" size="icon" onClick={() => handleCopy(referralLink)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Referral History</CardTitle>
              <CardDescription>
                A list of users who have signed up using your referral code.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Bonus</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_REFERRALS.map((ref) => (
                    <TableRow key={ref.id}>
                      <TableCell className="font-medium">{ref.email}</TableCell>
                      <TableCell>{new Date(ref.date).toLocaleDateString()}</TableCell>
                      <TableCell>${ref.bonus.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={ref.status === 'Completed' ? 'default' : 'secondary'}>
                          {ref.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                    <Gift className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                        From {completedReferrals} successful referrals
                    </p>
                </CardContent>
            </Card>
            <Card className="flex flex-col items-center text-center">
              <CardHeader>
                <CardTitle>Share via QR Code</CardTitle>
              </CardHeader>
              <CardContent>
                {referralLink ? (
                  <QRCode value={referralLink} size={160} fgColor="hsl(var(--foreground))" bgColor="transparent" />
                ) : (
                  <div className="h-[160px] w-[160px] bg-muted rounded-md flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Loading QR Code...</p>
                  </div>
                )}
                <p className="mt-4 text-xs text-muted-foreground">
                    Let friends scan this to sign up.
                </p>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
