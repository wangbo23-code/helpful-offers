"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { SignInButton } from "@/components/auth/sign-in-button";
import { Separator } from "@/components/ui/separator";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4 mx-auto max-w-5xl">
        <Link href="/" className="font-bold text-lg">
          {siteConfig.name}
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/tool"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Tool
          </Link>
          <Link
            href="/pricing"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
          <Separator orientation="vertical" className="h-4" />
          <SignInButton />
        </nav>
      </div>
    </header>
  );
}
