
"use client";

import * as React from "react";
import { Copy, QrCode, UserCheck } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { FacebookIcon } from "../icons/social/facebook-icon";
import { InstagramIcon } from "../icons/social/instagram-icon";
import { TelegramIcon } from "../icons/social/telegram-icon";
import { WhatsappIcon } from "../icons/social/whatsapp-icon";
import { Separator } from "../ui/separator";

const SocialShareButton = ({
  platform,
  icon,
  shareUrl,
  onClick,
}: {
  platform: string;
  icon: React.ReactNode;
  shareUrl?: string;
  onClick?: () => void;
}) => {
  const Comp = shareUrl ? "a" : "button";
  const props = shareUrl
    ? { href: shareUrl, target: "_blank", rel: "noopener noreferrer" }
    : { onClick };

  return (
    <Comp
      {...props}
      className="flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
    >
      {icon}
      <span className="text-xs font-medium">{platform}</span>
    </Comp>
  );
};


export function InviteView() {
  const { toast } = useToast();
  const [walletData, setWalletData] = React.useState<WalletData | null>(null);
  const [squadLink, setSquadLink] = React.useState("");
  const { user } = useUser();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const referralCode = walletData?.squad?.referral_code || "";

  React.useEffect(() => {
    if (user?.id) {
      async function fetchWallet() {
        const data = await getOrCreateWallet();
        setWalletData(data);
      }
      fetchWallet();
    }
  }, [user]);

  React.useEffect(() => {
    if (referralCode && typeof window !== "undefined") {
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
  
  const squadLeader = walletData?.squad?.squad_leader;
  const shareText = `Join my squad on AstralCore and we both get a $5 bonus! Use my code: ${referralCode}`;
  const encodedShareText = encodeURIComponent(shareText);
  const encodedSquadLink = encodeURIComponent(squadLink);
  
  const sharePlatforms = [
      { name: 'WhatsApp', icon: <WhatsappIcon />, url: `https://api.whatsapp.com/send?text=${encodedShareText}%0A${encodedSquadLink}` },
      { name: 'Telegram', icon: <TelegramIcon />, url: `https://t.me/share/url?url=${encodedSquadLink}&text=${encodedShareText}` },
      { name: 'Facebook', icon: <FacebookIcon />, url: `https://www.facebook.com/sharer/sharer.php?u=${encodedSquadLink}` },
      { name: 'Instagram', icon: <InstagramIcon />, onClick: () => { handleCopy(squadLink); toast({title: "Link Copied!", description: "Paste the link in your Instagram story or bio."}) } },
  ];

  if (!walletData) {
    return <Skeleton className="h-96 w-full" />;
  }
  
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
        {squadLeader && (
            <Alert>
                <UserCheck className="h-4 w-4" />
                <AlertTitle>You're in a Squad!</AlertTitle>
                <AlertDescription>
                    Your squad leader is <span className="font-semibold text-foreground">{squadLeader.username}</span>. Keep growing your assets together.
                </AlertDescription>
            </Alert>
        )}
        <Card>
            <CardHeader>
                <CardTitle>Invite and Build Your Squad</CardTitle>
                <CardDescription>
                Share your squad code or link to earn rewards. You'll both get $5 in your wallet for every new member who joins.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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

                <Separator />
                
                <div>
                    <Label className="text-sm font-medium">Share via</Label>
                    <div className="mt-4 grid grid-cols-4 gap-4 text-center">
                        {isClient && sharePlatforms.map(platform => (
                            <SocialShareButton 
                                key={platform.name}
                                platform={platform.name}
                                icon={platform.icon}
                                shareUrl={platform.url}
                                onClick={platform.onClick}
                            />
                        ))}
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
    </div>
  )
}
