import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/lib/config";
import { Check } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2">Pricing</h1>
        <p className="text-muted-foreground">
          Start free, upgrade when you need more.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {/* Free Tier */}
        <Card>
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <CardDescription>Try it out</CardDescription>
            <p className="text-3xl font-bold">$0</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm mb-6">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                {siteConfig.credits.freeOnSignup} free uses
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Google sign-in
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Full feature access
              </li>
            </ul>
            <Link href="/tool">
              <Button variant="outline" className="w-full">
                Get Started
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Paid Tier */}
        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>Pro</CardTitle>
              <Badge>Popular</Badge>
            </div>
            <CardDescription>For power users</CardDescription>
            <p className="text-3xl font-bold">{siteConfig.pricing.price}</p>
            <p className="text-sm text-muted-foreground">
              {siteConfig.pricing.period}
            </p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm mb-6">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                {siteConfig.pricing.credits} credits
              </li>
              {siteConfig.pricing.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/tool">
              <Button className="w-full">Buy Now</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
