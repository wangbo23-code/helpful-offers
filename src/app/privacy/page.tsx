import { siteConfig } from "@/lib/config";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16 prose prose-sm dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p className="text-muted-foreground">Last updated: {new Date().toISOString().split("T")[0]}</p>

      <h2>1. Information We Collect</h2>
      <p>
        When you use {siteConfig.name}, we collect the following information:
      </p>
      <ul>
        <li><strong>Account information:</strong> Email address, name, and profile picture from your Google account</li>
        <li><strong>Usage data:</strong> How you interact with the Service (pages visited, features used)</li>
        <li><strong>Input data:</strong> Content you provide to the tool for processing</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use your information to:</p>
      <ul>
        <li>Provide and maintain the Service</li>
        <li>Process your transactions</li>
        <li>Send important service notifications</li>
        <li>Improve our products and services</li>
      </ul>

      <h2>3. Data Storage and Security</h2>
      <p>
        Your data is stored securely using industry-standard encryption. We use
        Supabase for database hosting with row-level security enabled. We do not
        sell your personal data to third parties.
      </p>

      <h2>4. Third-Party Services</h2>
      <p>We use the following third-party services:</p>
      <ul>
        <li><strong>Google OAuth:</strong> For authentication</li>
        <li><strong>Lemon Squeezy:</strong> For payment processing</li>
        <li><strong>Vercel:</strong> For hosting</li>
        <li><strong>Supabase:</strong> For database services</li>
      </ul>

      <h2>5. Cookies</h2>
      <p>
        We use essential cookies for authentication and session management. We do
        not use tracking cookies or third-party advertising cookies.
      </p>

      <h2>6. Your Rights (GDPR)</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access your personal data</li>
        <li>Correct inaccurate data</li>
        <li>Request deletion of your data</li>
        <li>Export your data in a portable format</li>
        <li>Object to data processing</li>
      </ul>
      <p>
        To exercise these rights, contact us at{" "}
        <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.
      </p>

      <h2>7. Data Retention</h2>
      <p>
        We retain your account data as long as your account is active. Input data
        provided to the tool is processed in real-time and not permanently stored
        unless explicitly saved by you.
      </p>

      <h2>8. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you
        of any changes by posting the new policy on this page.
      </p>

      <h2>9. Contact</h2>
      <p>
        For questions about this Privacy Policy, contact us at{" "}
        <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.
      </p>
    </div>
  );
}
