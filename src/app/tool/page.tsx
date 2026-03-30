"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Paywall } from "@/components/layout/paywall";
import {
  Loader2,
  Heart,
  MessageCircle,
  AlertTriangle,
  Clock,
  HandHelping,
  Smile,
} from "lucide-react";

interface SpecificOffer {
  offer: string;
  why: string;
  timing: string;
}

interface MessageTemplate {
  situation: string;
  message: string;
}

interface TimingGuide {
  when: string;
  what: string;
}

interface HelpResult {
  specificOffers: SpecificOffer[];
  messageTemplates: MessageTemplate[];
  thingsToAvoid: string[];
  timingGuide: TimingGuide[];
  practicalHelp: string[];
  emotionalSupport: string[];
}

const CRISIS_TYPES = [
  { value: "illness", label: "Illness / Health Crisis" },
  { value: "death-in-family", label: "Death in Family" },
  { value: "job-loss", label: "Job Loss" },
  { value: "divorce", label: "Divorce / Separation" },
  { value: "new-baby", label: "New Baby" },
  { value: "moving", label: "Moving" },
  { value: "accident", label: "Accident / Injury" },
  { value: "financial-hardship", label: "Financial Hardship" },
  { value: "other", label: "Other" },
];

const RELATIONSHIPS = [
  { value: "close-friend", label: "Close Friend" },
  { value: "family", label: "Family Member" },
  { value: "colleague", label: "Colleague" },
  { value: "neighbor", label: "Neighbor" },
  { value: "acquaintance", label: "Acquaintance" },
];

export default function ToolPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">HelpfulOffers</h1>
      <p className="text-muted-foreground mb-6">
        Get specific, meaningful offers of help instead of &quot;let me know if you need anything.&quot;
      </p>

      <Paywall featureName="help suggestions">
        <SuggestForm />
      </Paywall>
    </div>
  );
}

function SuggestForm() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HelpResult | null>(null);

  const [crisisType, setCrisisType] = useState("");
  const [relationship, setRelationship] = useState("");
  const [details, setDetails] = useState("");

  async function handleSuggest() {
    if (!session?.user?.email || !crisisType || !relationship) return;

    setLoading(true);
    setResult(null);

    try {
      // Consume a credit
      const creditRes = await fetch("/api/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }),
      });

      if (!creditRes.ok) {
        const err = await creditRes.json();
        alert(`Error: ${err.error}`);
        setLoading(false);
        return;
      }

      // Call AI suggestion API
      const res = await fetch("/api/tool/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crisisType, relationship, details }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate suggestions");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  }

  const isFormValid = crisisType !== "" && relationship !== "";

  if (result) {
    return <ResultView result={result} onReset={() => setResult(null)} />;
  }

  return (
    <div className="space-y-6">
      {/* Crisis Type */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Heart className="h-5 w-5" />
            What happened?
          </CardTitle>
          <CardDescription>
            Select the type of situation your friend or family member is going through.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Label>Crisis Type</Label>
          <Select value={crisisType} onValueChange={(v) => setCrisisType(v ?? "")}>
            <SelectTrigger>
              <SelectValue placeholder="Select a situation..." />
            </SelectTrigger>
            <SelectContent>
              {CRISIS_TYPES.map((ct) => (
                <SelectItem key={ct.value} value={ct.value}>
                  {ct.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Relationship */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Your Relationship
          </CardTitle>
          <CardDescription>
            How close are you? This affects the type and tone of suggestions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Label>Relationship</Label>
          <Select value={relationship} onValueChange={(v) => setRelationship(v ?? "")}>
            <SelectTrigger>
              <SelectValue placeholder="Select your relationship..." />
            </SelectTrigger>
            <SelectContent>
              {RELATIONSHIPS.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Any Details (Optional)</CardTitle>
          <CardDescription>
            Add context for more personalized suggestions. E.g., they have young kids, live far away, etc.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="E.g., She has two kids under 5, her husband is traveling for work, she lives 30 minutes away..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      <Button
        onClick={handleSuggest}
        disabled={loading || !isFormValid}
        className="w-full h-12 text-lg"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Generating help suggestions...
          </>
        ) : (
          <>
            <Heart className="h-5 w-5 mr-2" />
            Get Specific Help Suggestions (1 credit)
          </>
        )}
      </Button>
    </div>
  );
}

function ResultView({ result, onReset }: { result: HelpResult; onReset: () => void }) {
  return (
    <div className="space-y-6">
      {/* Specific Offers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <HandHelping className="h-5 w-5 text-blue-600" />
            Specific Offers You Can Make
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {result.specificOffers.map((offer, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-2">
                <p className="font-medium">{offer.offer}</p>
                <p className="text-sm text-muted-foreground">{offer.why}</p>
                <div className="flex items-center gap-1 text-xs text-blue-600">
                  <Clock className="h-3 w-3" />
                  {offer.timing}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Message Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-green-600" />
            Ready-to-Send Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {result.messageTemplates.map((tmpl, i) => (
              <div key={i} className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {tmpl.situation}
                </p>
                <div className="bg-muted rounded-lg p-3 text-sm">
                  {tmpl.message}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Things to Avoid */}
      {result.thingsToAvoid.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Things to Avoid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.thingsToAvoid.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-red-500 mt-0.5 shrink-0">x</span>
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Timing Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-600" />
            Timing Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {result.timingGuide.map((item, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="bg-purple-100 text-purple-800 rounded-full px-3 py-1 text-xs font-medium shrink-0">
                  {item.when}
                </span>
                <span>{item.what}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Practical Help */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <HandHelping className="h-5 w-5 text-orange-600" />
            Practical Help Ideas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {result.practicalHelp.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Emotional Support */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Smile className="h-5 w-5 text-pink-600" />
            Emotional Support Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {result.emotionalSupport.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Heart className="h-4 w-4 text-pink-500 mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Button onClick={onReset} variant="outline" className="w-full">
        Get Suggestions for Another Situation
      </Button>
    </div>
  );
}
