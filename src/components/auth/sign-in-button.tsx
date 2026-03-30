"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User } from "lucide-react";

export function SignInButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Button variant="ghost" size="sm" disabled>
        <User className="h-4 w-4 mr-2" />
        Loading...
      </Button>
    );
  }

  if (session?.user) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="gap-2"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        <span className="hidden sm:inline">
          {session.user.name ?? session.user.email}
        </span>
        <LogOut className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="default"
      size="sm"
      onClick={() => signIn()}
    >
      <LogIn className="h-4 w-4 mr-2" />
      Sign In
    </Button>
  );
}
