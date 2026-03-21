import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy | Riveo Health",
  description:
    "Riveo Health Privacy Policy — how we collect, use, and protect your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        {/* Hero */}
        <section className="bg-gradient-to-b from-indigo-50/60 to-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-surface-dark tracking-tight">
              Privacy Policy
            </h1>
            <p className="mt-4 text-text-secondary text-lg">
              Last updated: March 2026
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="prose prose-slate max-w-none text-text-secondary leading-relaxed space-y-10">
            {/* 1 */}
            <div>
              <h2 className="text-2xl font-bold text-surface-dark mb-4">
                1. Introduction
              </h2>
              <p>
                Riveo Health (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;)
                operates the Riveo Health Healthcare AI Revenue &amp; Interaction OS
                platform. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you visit our
                website or use our services. By accessing or using our platform,
                you agree to the terms outlined in this policy.
              </p>
            </div>

            {/* 2 */}
            <div>
              <h2 className="text-2xl font-bold text-surface-dark mb-4">
                2. Information We Collect
              </h2>
              <p className="mb-3">
                We may collect the following categories of information:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-surface-dark">
                    Personal Information:
                  </strong>{" "}
                  Name, email address, phone number, job title, and organization
                  name provided when you create an account, request a demo, or
                  contact us.
                </li>
                <li>
                  <strong className="text-surface-dark">
                    Protected Health Information (PHI):
                  </strong>{" "}
                  When processed on behalf of covered entities under a Business
                  Associate Agreement (BAA), we may handle PHI in accordance
                  with HIPAA regulations.
                </li>
                <li>
                  <strong className="text-surface-dark">Usage Data:</strong>{" "}
                  Browser type, IP address, pages visited, time spent on pages,
                  and other diagnostic data collected automatically.
                </li>
                <li>
                  <strong className="text-surface-dark">
                    Device Information:
                  </strong>{" "}
                  Hardware model, operating system, unique device identifiers,
                  and mobile network information.
                </li>
                <li>
                  <strong className="text-surface-dark">
                    Cookies &amp; Tracking Technologies:
                  </strong>{" "}
                  We use cookies, web beacons, and similar technologies to
                  enhance your experience and gather analytical data.
                </li>
              </ul>
            </div>

            {/* 3 */}
            <div>
              <h2 className="text-2xl font-bold text-surface-dark mb-4">
                3. How We Use Your Information
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  To provide, operate, and maintain our platform and services.
                </li>
                <li>
                  To process transactions and manage your account.
                </li>
                <li>
                  To improve and personalize your experience with our platform.
                </li>
                <li>
                  To communicate with you, including sending service-related
                  updates, security alerts, and support messages.
                </li>
                <li>
                  To comply with legal obligations, including HIPAA and other
                  healthcare regulations.
                </li>
                <li>
                  To detect, prevent, and address fraud, security issues, and
                  technical problems.
                </li>
                <li>
                  To conduct analytics and research to improve our services.
                </li>
              </ul>
            </div>

            {/* 4 */}
            <div>
              <h2 className="text-2xl font-bold text-surface-dark mb-4">
                4. Data Sharing &amp; Disclosure
              </h2>
              <p className="mb-3">
                We do not sell your personal information. We may share your data
                in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-surface-dark">
                    Service Providers:
                  </strong>{" "}
                  Trusted third-party vendors who assist us in operating our
                  platform, conducting business, or serving you, subject to
                  confidentiality obligations.
                </li>
                <li>
                  <strong className="text-surface-dark">
                    Business Associates:
                  </strong>{" "}
                  Entities that perform functions involving PHI on our behalf,
                  governed by BAAs as required by HIPAA.
                </li>
                <li>
                  <strong className="text-surface-dark">
                    Legal Requirements:
                  </strong>{" "}
                  When required by law, regulation, legal process, or
                  governmental request.
                </li>
                <li>
                  <strong className="text-surface-dark">
                    Business Transfers:
                  </strong>{" "}
                  In connection with a merger, acquisition, or sale of assets,
                  your information may be transferred as a business asset.
                </li>
              </ul>
            </div>

            {/* 5 */}
            <div>
              <h2 className="text-2xl font-bold text-surface-dark mb-4">
                5. Cookies &amp; Tracking Technologies
              </h2>
              <p className="mb-3">We use the following types of cookies:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-surface-dark">
                    Essential Cookies:
                  </strong>{" "}
                  Required for the operation of our platform (e.g.,
                  authentication, security).
                </li>
                <li>
                  <strong className="text-surface-dark">
                    Analytics Cookies:
                  </strong>{" "}
                  Help us understand how visitors interact with our site so we
                  can improve performance and content.
                </li>
                <li>
                  <strong className="text-surface-dark">
                    Functional Cookies:
                  </strong>{" "}
                  Remember your preferences and settings for a better
                  experience.
                </li>
              </ul>
              <p className="mt-3">
                You can manage your cookie preferences through your browser
                settings. Disabling certain cookies may affect your ability to
                use some features of our platform.
              </p>
            </div>

            {/* 6 */}
            <div>
              <h2 className="text-2xl font-bold text-surface-dark mb-4">
                6. HIPAA Compliance
              </h2>
              <p>
                Riveo Health is committed to full compliance with the Health
                Insurance Portability and Accountability Act (HIPAA). When we
                process Protected Health Information on behalf of covered
                entities, we do so under a signed Business Associate Agreement.
                We implement administrative, physical, and technical safeguards
                to ensure the confidentiality, integrity, and availability of
                PHI. For more details, please visit our{" "}
                <a href="/hipaa" className="text-primary hover:underline">
                  HIPAA Compliance
                </a>{" "}
                page.
              </p>
            </div>

            {/* 7 */}
            <div>
              <h2 className="text-2xl font-bold text-surface-dark mb-4">
                7. GDPR &amp; International Data Rights
              </h2>
              <p className="mb-3">
                If you are located in the European Economic Area (EEA), United
                Kingdom, or other jurisdictions with data protection laws, you
                have the following rights:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-surface-dark">Right of Access:</strong>{" "}
                  Request a copy of the personal data we hold about you.
                </li>
                <li>
                  <strong className="text-surface-dark">
                    Right to Rectification:
                  </strong>{" "}
                  Request correction of inaccurate or incomplete data.
                </li>
                <li>
                  <strong className="text-surface-dark">
                    Right to Erasure:
                  </strong>{" "}
                  Request deletion of your personal data, subject to legal
                  retention requirements.
                </li>
                <li>
                  <strong className="text-surface-dark">
                    Right to Restrict Processing:
                  </strong>{" "}
                  Request limitation of processing of your personal data.
                </li>
                <li>
                  <strong className="text-surface-dark">
                    Right to Data Portability:
                  </strong>{" "}
                  Receive your data in a structured, machine-readable format.
                </li>
                <li>
                  <strong className="text-surface-dark">
                    Right to Object:
                  </strong>{" "}
                  Object to processing based on legitimate interests or direct
                  marketing.
                </li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, please contact us at{" "}
                <a
                  href="mailto:privacy@riveohealth.com"
                  className="text-primary hover:underline"
                >
                  privacy@riveohealth.com
                </a>
                . We will respond within 30 days.
              </p>
            </div>

            {/* 8 */}
            <div>
              <h2 className="text-2xl font-bold text-surface-dark mb-4">
                8. Patient Data Handling
              </h2>
              <p>
                Patient data processed through our platform is handled with the
                highest level of care. All patient data is encrypted in transit
                and at rest using industry-standard AES-256 encryption. Access to
                patient data is restricted to authorized personnel on a
                need-to-know basis. We maintain comprehensive audit logs of all
                access to patient data. Our platform is designed to support
                minimum necessary standards, ensuring that only the data
                required for a specific function is accessed or disclosed.
              </p>
            </div>

            {/* 9 */}
            <div>
              <h2 className="text-2xl font-bold text-surface-dark mb-4">
                9. Third-Party Services
              </h2>
              <p>
                Our platform may integrate with third-party services such as
                Electronic Health Record (EHR) systems, payment gateways, and
                payer networks. These integrations are governed by their
                respective privacy policies. We require all third-party partners
                who process data on our behalf to maintain equivalent or greater
                security and privacy standards, and where applicable, to enter
                into Business Associate Agreements.
              </p>
            </div>

            {/* 10 */}
            <div>
              <h2 className="text-2xl font-bold text-surface-dark mb-4">
                10. Data Retention
              </h2>
              <p>
                We retain personal information for as long as necessary to
                fulfill the purposes for which it was collected, comply with
                legal obligations, resolve disputes, and enforce our agreements.
                PHI is retained in accordance with HIPAA requirements and the
                terms of applicable Business Associate Agreements. When data is
                no longer needed, it is securely deleted or anonymized in
                accordance with our data retention policies.
              </p>
            </div>

            {/* 11 */}
            <div>
              <h2 className="text-2xl font-bold text-surface-dark mb-4">
                11. Data Security
              </h2>
              <p>
                We implement industry-leading security measures including
                encryption in transit (TLS 1.2+) and at rest (AES-256),
                multi-factor authentication, role-based access controls, regular
                penetration testing, continuous monitoring, and SOC 2 Type II
                audited controls. While no method of transmission over the
                Internet is 100% secure, we strive to use commercially
                acceptable means to protect your data.
              </p>
            </div>

            {/* 12 */}
            <div>
              <h2 className="text-2xl font-bold text-surface-dark mb-4">
                12. Your Rights &amp; Choices
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-surface-dark">
                    Account Information:
                  </strong>{" "}
                  You may update or delete your account information at any time
                  by logging into your account settings.
                </li>
                <li>
                  <strong className="text-surface-dark">
                    Marketing Communications:
                  </strong>{" "}
                  You may opt out of marketing emails by clicking the
                  &quot;unsubscribe&quot; link in any marketing email.
                </li>
                <li>
                  <strong className="text-surface-dark">
                    Data Deletion:
                  </strong>{" "}
                  You may request deletion of your personal data by contacting
                  us. Note that we may retain certain data as required by law.
                </li>
                <li>
                  <strong className="text-surface-dark">
                    Do Not Track:
                  </strong>{" "}
                  Our platform currently does not respond to &quot;Do Not
                  Track&quot; browser signals.
                </li>
              </ul>
            </div>

            {/* 13 */}
            <div>
              <h2 className="text-2xl font-bold text-surface-dark mb-4">
                13. Children&apos;s Privacy
              </h2>
              <p>
                Our platform is not intended for individuals under the age of 18.
                We do not knowingly collect personal information from children.
                If we become aware that we have inadvertently collected data from
                a child under 18, we will take steps to delete such information
                promptly.
              </p>
            </div>

            {/* 14 */}
            <div>
              <h2 className="text-2xl font-bold text-surface-dark mb-4">
                14. Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time to reflect
                changes in our practices, technology, legal requirements, or
                other factors. We will notify you of material changes by posting
                the updated policy on our website with a revised &quot;Last
                updated&quot; date. Your continued use of our platform after any
                changes constitutes acceptance of the updated policy.
              </p>
            </div>

            {/* 15 */}
            <div>
              <h2 className="text-2xl font-bold text-surface-dark mb-4">
                15. Contact Us
              </h2>
              <p>
                If you have any questions or concerns about this Privacy Policy
                or our data practices, please contact us at:
              </p>
              <div className="mt-4 bg-slate-50 rounded-xl p-6 text-sm space-y-1">
                <p className="font-semibold text-surface-dark">
                  Riveo Health Privacy Team
                </p>
                <p>
                  Email:{" "}
                  <a
                    href="mailto:privacy@riveohealth.com"
                    className="text-primary hover:underline"
                  >
                    privacy@riveohealth.com
                  </a>
                </p>
                <p>
                  Address: 1234 Innovation Drive, Suite 500, San Francisco, CA
                  94105
                </p>
                <p>Phone: (800) 555-0199</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
