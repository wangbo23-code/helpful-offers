"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/lib/config";
import { Lock, CreditCard, Sparkles } from "lucide-react";
import { signIn } from "next-auth/react";

interface PaywallProps {
  children: React.ReactNode;
  featureName?: string;
  creditsPerUse?: number;
}

export function Paywall({
  children,
  featureName = "this feature",
  creditsPerUse = siteConfig.credits.perUse,
}: PaywallProps) {
  const { data: session, status } = useSession();
  const [credits, setCredits] = useState<number | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`/api/credits?email=${encodeURIComponent(session.user.email)}`)
        .then((r) => r.json())
        .then((data) => setCredits(data.credits ?? 0))
        .catch(() => setCredits(0));
    }
  }, [session?.user?.email]);

  // Not logged in
  if (status !== "loading" && !session) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader className="text-center">
          <Lock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <CardTitle>Sign in to continue</CardTitle>
          <CardDescription>
            Sign in to use {featureName} for free ({siteConfig.credits.freeOnSignup} uses included)
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button onClick={() => signIn()}>
            Sign In with Google
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Loading credits
  if (credits === null) {
    return <div className="text-center py-8 text-muted-foreground">Loading...</div>;
  }

  // No credits left
  if (credits < creditsPerUse) {
    return (
      <>
        <Card className="max-w-md mx-auto mt-8">
          <CardHeader className="text-center">
            <Sparkles className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <CardTitle>You&apos;re out of credits</CardTitle>
            <CardDescription>
              Get {siteConfig.pricing.credits} more uses for just{" "}
              {siteConfig.pricing.price}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-3">
            <Button onClick={() => setShowPaywall(true)}>
              <CreditCard className="h-4 w-4 mr-2" />
              Buy Credits — {siteConfig.pricing.price}
            </Button>
            <p className="text-xs text-muted-foreground">
              One-time payment. No subscription.
            </p>
          </CardContent>
        </Card>

        <Dialog open={showPaywall} onOpenChange={setShowPaywall}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Get More Credits</DialogTitle>
              <DialogDescription>
                Unlock {siteConfig.pricing.credits} uses of {featureName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {siteConfig.pricing.credits} credits
                </span>
                <Badge variant="secondary">
                  {siteConfig.pricing.price}{" "}
                  {siteConfig.pricing.period}
                </Badge>
              </div>
              <ul className="space-y-2">
                {siteConfig.pricing.features.map((f) => (
                  <li key={f} className="text-sm flex items-center gap-2">
                    <span className="text-green-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                onClick={async () => {
                  // Fetch checkout URL from server (handles mock vs real LS)
                  const email = session?.user?.email ?? "";
                  const res = await fetch(`/api/checkout?email=${encodeURIComponent(email)}`);
                  const data = await res.json();
                  if (data.url) {
                    window.location.href = data.url;
                  }
                }}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Pay {siteConfig.pricing.price}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Has credits — render the children
  return (
    <div>
      <div className="flex justify-end mb-2">
        <Badge variant="outline" className="text-xs">
          {credits} credits remaining
        </Badge>
      </div>
      {children}
    </div>
  );
}
