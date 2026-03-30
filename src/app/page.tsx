import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/lib/config";
import { ArrowRight, Zap, Shield, Sparkles, CheckCircle } from "lucide-react";

export default function HomePage() {
  return (
    <div className="container mx-auto max-w-5xl px-4">
      {/* Hero */}
      <section className="py-20 text-center">
        <Badge variant="secondary" className="mb-4">
          AI-Powered Tool
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          {siteConfig.hero.title}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          {siteConfig.hero.subtitle}
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/tool">
            <Button size="lg">
              {siteConfig.hero.cta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline" size="lg">
              View Pricing
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          {siteConfig.credits.freeOnSignup} free uses. No credit card required.
        </p>
      </section>

      {/* Features */}
      <section className="py-16">
        <h2 className="text-2xl font-bold text-center mb-8">
          Why {siteConfig.name}?
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 mb-2 text-yellow-500" />
              <CardTitle className="text-lg">Lightning Fast</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Get results in seconds, not hours. AI does the heavy lifting so you
              don&apos;t have to.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 mb-2 text-blue-500" />
              <CardTitle className="text-lg">Reliable Output</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Consistent, professional quality every time. Tested and refined for
              real-world use.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Sparkles className="h-8 w-8 mb-2 text-purple-500" />
              <CardTitle className="text-lg">Dead Simple</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              No learning curve. Paste your input, click generate, done. Anyone
              can use it.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <h2 className="text-2xl font-bold text-center mb-4">
          How It Works
        </h2>
        <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">
          Get your results in three simple steps.
        </p>
        <div className="grid sm:grid-cols-3 gap-8">
          {siteConfig.howItWorks.map((item) => (
            <div key={item.step} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl mb-4">
                {item.step}
              </div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 text-center">
        <div className="grid sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div>
            <p className="text-3xl font-bold">Fast</p>
            <p className="text-sm text-muted-foreground">Results in under 30s</p>
          </div>
          <div>
            <p className="text-3xl font-bold">Accurate</p>
            <p className="text-sm text-muted-foreground">AI-powered analysis</p>
          </div>
          <div>
            <p className="text-3xl font-bold">Simple</p>
            <p className="text-sm text-muted-foreground">No signup to try</p>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-16 text-center">
        <h2 className="text-2xl font-bold mb-2">Simple Pricing</h2>
        <p className="text-muted-foreground mb-8">
          Try free, pay only when you need more.
        </p>
        <Card className="max-w-sm mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">
              {siteConfig.pricing.price}
            </CardTitle>
            <p className="text-muted-foreground">
              {siteConfig.pricing.period} &middot;{" "}
              {siteConfig.pricing.credits} credits
            </p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm mb-6">
              {siteConfig.pricing.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/tool">
              <Button className="w-full">Get Started Free</Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <h2 className="text-2xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="max-w-2xl mx-auto space-y-6">
          {siteConfig.faqs.map((faq) => (
            <div key={faq.q}>
              <h3 className="font-semibold mb-1">{faq.q}</h3>
              <p className="text-sm text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Ready to get started?
        </h2>
        <p className="text-muted-foreground mb-6">
          Try {siteConfig.name} free — no credit card required.
        </p>
        <Link href="/tool">
          <Button size="lg">
            {siteConfig.hero.cta}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
