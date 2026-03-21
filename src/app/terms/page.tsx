import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms of Service | Riveo Health",
  description:
    "Riveo Health Terms of Service — the agreement governing your use of our platform.",
};

export default function TermsOfServicePage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        {/* Hero */}
        <section className="bg-gradient-to-b from-indigo-50/60 to-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-surface-dark tracking-tight">
              Terms of Service
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
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using the Riveo Health platform
                (&quot;Service&quot;), you agree to be bound by these Terms of
                Service (&quot;Terms&quot;). If you are using the Service on
                behalf of an organization, you represent and warrant that you
                have the authority to bind that organization to these Terms. If
                you do not agree to these Terms, you must not access or use the
                Service.
              </p>
            </div>

            {/* 2 */}
            <div>
              <h2 className="text-2xl font-bold text-surface-dark mb-4">
                2. Description of Service
              </h2>
              <p>
                Riveo Health is a Healthcare AI Revenue &amp; Interaction Operating
                System that provides artificial intelligence-powered tools for
                revenue cycle management, patient interaction, claims
                processing, denial management, and related healthcare
                administrative functions. The Service includes web-based
                applications, APIs, integrations, and associated support
                services as described in your applicable subscription agreement
                or order form.
              </p>
            </div>

            {/* 3 */}
            <div>
              <h2 className="text-2xl font-bold text-surface-dark mb-4">
                3. User Accounts
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  You must provide accurate, current, and complete information
                  when creating an account and keep your account information
                  up-to-date.
                </li>
                <li>
                  You are responsible for maintaining the confidentiality of your
                  account credentials and for all activities that occur under
                  your account.
                </li>
                <li>
                  You must notify us immediately of any unauthorized access to or
                  use of your account.
                </li>
                <li>
                  We reserve the right to suspend or terminate accounts that
                  violate these Terms or pose a security risk.
                </li>
                <li>
                  Account administrators are responsible for managing user access
                  and permissions within their organization.
                </li>
              </ul>
            </div>

            {/* 4 */}
            <div>
              <h2 className="text-2xl font-bold text-surface-dark mb-4">
                4. Acceptable Use
              </h2>
              <p className="mb-3">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Violate any applicable laws, regulations, or third-party
                  rights, including HIPAA, HITECH, and other healthcare
                  regulations.
                </li>
                <li>
                  Upload, transmit, or distribute malicious code, viruses, or
                  any other harmful technology.
                </li>
                <li>
                  Attempt to gain unauthorized access to the Service, other
                  accounts, or computer systems connected to the Service.
                </li>
                <li>
                  Interfere with or disrupt the integrity or performance of the
                  Service or the data contained therein.
                </li>
                <li>
                  Reverse engineer, decompile, disassemble, or attempt to
                  discover the source code or underlying algorithms of the
                  Service.
                </li>
                <li>
                  Use the Service for any purpose other than its intended
                  healthcare revenue cycle and patient interaction functions.
                </li>
                <li>
                  Access or use the Service to build a competitive product or
                  service.
                </li>
              </ul>
            </div>

            {/* 5 */}
            <div>
              <h2 className="text-2xl font-bold text-surface-dark mb-4">
                5. Intellectual Property
              </h2>
              <p>
                The Service, including all software, algorithms, models,
                interfaces, documentation, and content, is the exclusive property
                of Riveo Health and is protected by intellectual property laws. You
                are granted a limited, non-exclusive, non-transferable,
                revocable license to access and use the Service in accordance
                with these Terms and your subscription agreement. You retain
                ownership of all data you submit to the Service. By using the
                Service, you grant us a limited license to process your data
                solely for the purpose of providing and improving the Service.
              </p>
            </div>

            {/* 6 */}
            <div>
              <h2 className="text-2xl font-bold text-surface-dark mb-4">
                6. Fees &amp; Payment
              </h2>
              <p>
                Fees for the Service are set forth in your subscription agreement
                or order form. All fees are non-refundable except as expressly
                stated in your agreement. We reserve the right to modify pricing
                with 30 days&apos; advance written notice. Late payments may be
                subject to interest charges of 1.5% per month or the maximum
                rate permitted by law, whichever is lower. We may suspend access
                to the Service for accounts with overdue balances exceeding 30
                days.
              </p>
            </div>

            {/* 7 */}
            <div>
              <h2 className="text-2xl font-bold text-surface-dark mb-4">
                7. Service Level &amp; Availability
              </h2>
              <p>
                We strive to maintain 99.9% uptime for the Service. Scheduled
                maintenance windows will be communicated in advance. We are not
                liable for any downtime caused by factors outside our reasonable
                control, including internet outages, force majeure events, or
                third-party service failures. Specific service level commitments
                may be outlined in your subscription agreement.
              </p>
            </div>

            {/* 8 */}
            <div>
              <h2 className="text-2xl font-bold text-surface-dark mb-4">
                8. Limitation of Liability
              </h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, RIVEO HEALTH SHALL NOT BE
                LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
                PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS,
                DATA, USE, OR GOODWILL, ARISING OUT OF OR IN CONNECTION WITH
                THESE TERMS OR THE USE OF THE SERVICE, WHETHER BASED ON
                WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), OR ANY OTHER
                LEGAL THEORY, EVEN IF RIVEO HEALTH HAS BEEN ADVISED OF THE
                POSSIBILITY OF SUCH DAMAGES. OUR TOTAL AGGREGATE LIABILITY
                SHALL NOT EXCEED THE AMOUNTS PAID BY YOU TO RIVEO HEALTH IN THE
                TWELVE (12) MONTHS PRECEDING THE CLAIM.
              </p>
            </div>

            {/* 9 */}
            <div>
              <h2 className="text-2xl font-bold text-surface-dark mb-4">
                9. Indemnification
              </h2>
              <p>
                You agree to indemnify, defend, and hold harmless Riveo Health, its
                officers, directors, employees, agents, and affiliates from and
                against any and all claims, damages, losses, liabilities, costs,
                and expenses (including reasonable attorneys&apos; fees) arising
                out of or in connection with: (a) your use of the Service; (b)
                your violation of these Terms; (c) your violation of any
                applicable law or regulation; or (d) any data you submit to the
                Service that infringes upon the rights of a third party.
              </p>
            </div>

            {/* 10 */}
            <div>
              <h2 className="text-2xl font-bold text-surface-dark mb-4">
                10. Warranties &amp; Disclaimers
              </h2>
              <p>
                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS
                AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR
                IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF
                MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
                NON-INFRINGEMENT. RIVEO HEALTH DOES NOT WARRANT THAT THE SERVICE
                WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE. THE SERVICE IS NOT
                INTENDED TO REPLACE PROFESSIONAL MEDICAL JUDGMENT AND SHOULD NOT
                BE USED AS THE SOLE BASIS FOR CLINICAL DECISIONS.
              </p>
            </div>

            {/* 11 */}
            <div>
              <h2 className="text-2xl font-bold text-surface-dark mb-4">
                11. Termination
              </h2>
              <p className="mb-3">
                Either party may terminate these Terms:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Upon 30 days&apos; written notice for convenience, effective at
                  the end of the current billing period.
                </li>
                <li>
                  Immediately if the other party materially breaches these Terms
                  and fails to cure such breach within 15 days of written notice.
                </li>
                <li>
                  Immediately if required by law or regulation.
                </li>
              </ul>
              <p className="mt-3">
                Upon termination, your right to use the Service will cease
                immediately. We will make your data available for export for a
                period of 30 days following termination, after which it may be
                permanently deleted.
              </p>
            </div>

            {/* 12 */}
            <div>
              <h2 className="text-2xl font-bold text-surface-dark mb-4">
                12. Governing Law &amp; Dispute Resolution
              </h2>
              <p>
                These Terms shall be governed by and construed in accordance with
                the laws of the State of California, without regard to its
                conflict of law provisions. Any dispute arising out of or
                relating to these Terms shall first be attempted to be resolved
                through good-faith negotiation. If negotiation fails, disputes
                shall be resolved through binding arbitration administered by the
                American Arbitration Association in San Francisco, California.
                Each party shall bear its own costs of arbitration unless the
                arbitrator determines otherwise.
              </p>
            </div>

            {/* 13 */}
            <div>
              <h2 className="text-2xl font-bold text-surface-dark mb-4">
                13. Changes to Terms
              </h2>
              <p>
                We reserve the right to modify these Terms at any time. Material
                changes will be communicated via email or through a prominent
                notice on our platform at least 30 days before they take effect.
                Your continued use of the Service after the effective date of any
                changes constitutes acceptance of the updated Terms. If you do
                not agree with the revised Terms, you must stop using the
                Service.
              </p>
            </div>

            {/* 14 */}
            <div>
              <h2 className="text-2xl font-bold text-surface-dark mb-4">
                14. General Provisions
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-surface-dark">Severability:</strong> If
                  any provision of these Terms is found to be unenforceable, the
                  remaining provisions shall continue in full force and effect.
                </li>
                <li>
                  <strong className="text-surface-dark">Waiver:</strong> Failure
                  to enforce any provision of these Terms shall not constitute a
                  waiver of that provision.
                </li>
                <li>
                  <strong className="text-surface-dark">
                    Entire Agreement:
                  </strong>{" "}
                  These Terms, together with your subscription agreement and any
                  applicable BAA, constitute the entire agreement between you and
                  Riveo Health regarding the Service.
                </li>
                <li>
                  <strong className="text-surface-dark">Assignment:</strong> You
                  may not assign these Terms without our prior written consent.
                  We may assign these Terms in connection with a merger or
                  acquisition.
                </li>
              </ul>
            </div>

            {/* 15 */}
            <div>
              <h2 className="text-2xl font-bold text-surface-dark mb-4">
                15. Contact Us
              </h2>
              <p>
                If you have any questions about these Terms of Service, please
                contact us at:
              </p>
              <div className="mt-4 bg-slate-50 rounded-xl p-6 text-sm space-y-1">
                <p className="font-semibold text-surface-dark">
                  Riveo Health Legal Team
                </p>
                <p>
                  Email:{" "}
                  <a
                    href="mailto:legal@riveohealth.com"
                    className="text-primary hover:underline"
                  >
                    legal@riveohealth.com
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
