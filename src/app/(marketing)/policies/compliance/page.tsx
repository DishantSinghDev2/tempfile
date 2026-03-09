// src/app/(marketing)/policies/compliance/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compliance & Security — Temp File",
  description: "Security standards, regulatory compliance, and data protection at Temp File.",
};

export default function CompliancePage() {
  return (
    <div className="max-w-3xl mx-auto py-20 px-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8">
        Compliance & Security
      </h1>
      <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-foreground font-semibold text-lg">Our Commitment</h2>
          <p>
            At Temp File, security and regulatory compliance are at the heart of our operations. We utilize industry-leading infrastructure provided by Google Cloud and Cloudflare to ensure your data is protected according to global standards.
          </p>
        </section>

        <section>
          <h2 className="text-foreground font-semibold text-lg">GDPR Compliance</h2>
          <p>
            We are fully committed to the General Data Protection Regulation (GDPR). We ensure that:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Data is processed lawfully, fairly, and transparently.</li>
            <li>We collect only the minimum necessary data for our services.</li>
            <li>Users have the right to access, rectify, and delete their data.</li>
            <li>We implement strict data retention policies (auto-deletion of files).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-foreground font-semibold text-lg">Security Standards</h2>
          <p>
            Our security measures include:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Encryption:</strong> All data is encrypted in transit via TLS 1.3 and at rest using AES-256 encryption.</li>
            <li><strong>Infrastructure:</strong> We run on Cloudflare Workers and Google Cloud Storage, which are SOC 2 and ISO 27001 compliant.</li>
            <li><strong>Bot Protection:</strong> We use Cloudflare Turnstile to prevent automated abuse and DDoS attacks.</li>
            <li><strong>Zero Tracking:</strong> We do not use intrusive tracking cookies or sell user data to third parties.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-foreground font-semibold text-lg">Data Locality</h2>
          <p>
            Depending on your usage, data may be stored in various regions across Google Cloud Platform and Cloudflare's global network to ensure high performance and redundancy.
          </p>
        </section>
      </div>
    </div>
  );
}
