// src/app/(marketing)/policies/copyright/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Copyright Policy — Temp File",
  description: "Intellectual property and DMCA compliance policy for Temp File.",
};

export default function CopyrightPage() {
  return (
    <div className="max-w-3xl mx-auto py-20 px-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8">
        Copyright Policy
      </h1>
      <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-foreground font-semibold text-lg">Introduction</h2>
          <p>
            Temp File respects the intellectual property rights of others and expects its users to do the same. In accordance with the Digital Millennium Copyright Act (DMCA), we will respond expeditiously to notices of alleged infringement that are reported to our designated copyright agent.
          </p>
        </section>

        <section>
          <h2 className="text-foreground font-semibold text-lg">DMCA Notice</h2>
          <p>
            If you are a copyright owner or an agent thereof and believe that any content hosted on our platform infringes upon your copyrights, you may submit a notification pursuant to the DMCA by providing our Copyright Agent with the following information in writing:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
            <li>Identification of the copyrighted work claimed to have been infringed.</li>
            <li>Identification of the material that is claimed to be infringing or to be the subject of infringing activity and that is to be removed.</li>
            <li>Information reasonably sufficient to permit us to contact you, such as an address, telephone number, and an electronic mail address.</li>
            <li>A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.</li>
            <li>A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-foreground font-semibold text-lg">Repeat Infringers</h2>
          <p>
            It is our policy in appropriate circumstances to disable and/or terminate the accounts of users who are repeat infringers.
          </p>
        </section>

        <section>
          <h2 className="text-foreground font-semibold text-lg">Contact Information</h2>
          <p>
            For copyright inquiries, please contact us at: <br />
            Email: copyright@tempfile.freecustom.email
          </p>
        </section>
      </div>
    </div>
  );
}
