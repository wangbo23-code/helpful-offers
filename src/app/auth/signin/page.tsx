"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteConfig } from "@/lib/config";

export default function SignInPage() {
  return (
    <div className="container mx-auto max-w-sm px-4 py-20">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{siteConfig.name}</CardTitle>
          <CardDescription>
            Sign in to get {siteConfig.credits.freeOnSignup} free credits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Google OAuth — shown when configured */}
          <Button
            className="w-full"
            onClick={() => signIn("google", { callbackUrl: "/tool" })}
          >
            Continue with Google
          </Button>

          {/* Demo login — shown in mock mode */}
          {!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() =>
                signIn("credentials", {
                  email: "demo@example.com",
                  callbackUrl: "/tool",
                })
              }
            >
              Demo Login (dev mode)
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
