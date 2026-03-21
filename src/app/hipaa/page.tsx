import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "HIPAA Compliance | Riveo Health",
  description:
    "Riveo Health HIPAA Compliance — our commitment to protecting health information.",
};

export default function HipaaCompliancePage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        {/* Hero */}
        <section className="bg-gradient-to-b from-indigo-50/60 to-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-surface-dark tracking-tight">
              HIPAA Compliance
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
                1. Our Commitment to HIPAA
              </h2>
              <p>
                Riveo Health is fully committed to compliance with the Health
                Insurance Portability and Accountability Act of 1996 (HIPAA),
                the Health Information Technology for Economic and Clinical
                Health Act (HITECH), and all associated regulations. As a
                business associate to covered entities, we recognize the
                critical importance of protecting Protected Health Information
                (PHI) and have implemented comprehensive safeguards to ensure
                the confidentiality, integrity, and availability of all health
                information entrusted to us.
              </p>
            </div>

            {/* 2 */}
            <div>
              <h2 className="text-2xl font-bold text-surface-dark mb-4">
                2. Protected Health Information (PHI) Handling
              </h2>
              <p className="mb-3">
                We handle PHI with the highest level of care and security:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  PHI is only accessed, used, or disclosed for purposes
                  permitted under HIPAA and as specified in our Business
                  Associate Agreements.
                </li>
                <li>
                  We apply the minimum necessary standard, ensuring that access
                  to PHI is limited to only the information required to perform
                  a specific function.
                </li>
                <li>
                  All PHI is encrypted in transit using TLS 1.2 or higher and at
                  rest using AES-256 encryption.
                </li>
                <li>
                  PHI is stored exclusively in SOC 2 Type II certified data
                  centers within the United States.
                </li>
                <li>
                  De-identification procedures follow the Safe Harbor or Expert
                  Determination methods as defined by HIPAA.
                </li>
              </ul>
            </div>

            {/* 3 */}
            <div>
              <h2 className="text-2xl font-bold text-surface-dark mb-4">
                3. Administrative Safeguards
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-surface-dark">
                    Security Officer:
                  </strong>{" "}
                  A designated HIPAA Security Officer oversees the development
                  and implementation of all security policies, procedures, and
                  safeguards.
                </li>
                <li>
                  <strong className="text-surface-dark">
                    Privacy Officer:
                  </strong>{" "}
                  A designated HIPAA Privacy Officer manages all privacy-related
                  policies and procedures, including complaint handling and
                  incident response.
                </li>
                <li>
                  <strong className="text-surface-dark">
                    Risk Assessments:
                  </strong>{" "}
                  Comprehensive risk assessments are conducted annually and
                  whenever significant changes occur to our systems or
                  operations.
                </li>
                <li>
                  <strong className="text-surface-dark">
                    Policies &amp; Procedures:
                  </strong>{" "}
                  Formal, documented policies and procedures govern all aspects
                  of PHI handling, access, and disclosure.
                </li>
                <li>
                  <strong className="text-surface-dark">
                    Workforce Management:
                  </strong>{" "}
                  Background checks are conducted on all personnel with access
                  to PHI. Sanctions are enforced for policy violations.
                </li>
                <li>
                  <strong className="text-surface-dark">
                    Contingency Planning:
                  </strong>{" "}
                  Business continuity and disaster recovery plans ensure
                  availability of PHI during emergencies.
                </li>
              </ul>
            </div>

            {/* 4 */}
            <div>
              <h2 className="text-2xl font-bold text-surface-dark mb-4">
                4. Physical Safeguards
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-surface-dark">
                    Facility Access Controls:
                  </strong>{" "}
                  Data centers employ multi-layered physical security including
                  biometric access, 24/7 security personnel, and video
                  surveillance.
                </li>
                <li>
                  <strong className="text-surface-dark">
                    Workstation Security:
                  </strong>{" "}
                  All workstations accessing PHI are equipped with full-disk
                  encryption, automatic screen locks, and endpoint protection
                  software.
                </li>
                <li>
                  <strong className="text-surface-dark">
                    Device &amp; Media Controls:
                  </strong>{" "}
                  Strict policies govern the use, transfer, and disposal of
                  electronic media containing PHI. All media is securely wiped
                  or destroyed before disposal.
                </li>
                <li>
                  <strong className="text-surface-dark">
                    Environmental Controls:
                  </strong>{" "}
                  Data centers maintain redundant power, cooling, and fire
                  suppression systems to protect infrastructure.
                </li>
              </ul>
            </div>

            {/* 5 */}
            <div>
              <h2 className="text-2xl font-bold text-surface-dark mb-4">
                5. Technical Safeguards
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-surface-dark">
                    Access Controls:
                  </strong>{" "}
                  Role-based access control (RBAC) ensures that users can only
                  access the PHI necessary for their job functions.
                  Multi-factor authentication (MFA) is required for all users.
                </li>
                <li>
                  <strong className="text-surface-dark">
                    Audit Controls:
                  </strong>{" "}
                  Comprehensive audit logs track all access to, creation of,
                  modification of, and deletion of PHI. Logs are immutable and
                  retained for a minimum of six years.
                </li>
                <li>
                  <strong className="text-surface-dark">
                    Integrity Controls:
                  </strong>{" "}
                  Checksums and digital signatures verify that PHI has not been
                  altered or destroyed in an unauthorized manner.
                </li>
                <li>
                  <strong className="text-surface-dark">
                    Transmission Security:
                  </strong>{" "}
                  All data in transit is encrypted using TLS 1.2 or higher.
                  VPN tunnels are used for site-to-site data transfers.
                </li>
                <li>
                  <strong className="text-surface-dark">
                    Network Security:
                  </strong>{" "}
                  Firewalls, intrusion detection/prevention systems (IDS/IPS),
                  and network segmentation protect against unauthorized access
                  and threats.
                </li>
                <li>
                  <strong className="text-surface-dark">
                    Vulnerability Management:
                  </strong>{" "}
                  Regular vulnerability scans and annual penetration tests
                  identify and remediate potential security weaknesses.
                </li>
              </ul>
            </div>

            {/* 6 */}
            <div>
              <h2 className="text-2xl font-bold text-surface-dark mb-4">
                6. Breach Notification
              </h2>
              <p className="mb-3">
                In the event of a breach of unsecured PHI, Riveo Health will:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Notify affected covered entities without unreasonable delay
                  and no later than 60 days after discovery of the breach, as
                  required by the HIPAA Breach Notification Rule.
                </li>
                <li>
                  Provide covered entities with sufficient information to fulfill
                  their own breach notification obligations, including the
                  identity of affected individuals, a description of the types
                  of PHI involved, and recommended mitigation steps.
                </li>
                <li>
                  Cooperate fully with covered entities and regulatory
                  authorities during breach investigations.
                </li>
                <li>
                  Conduct a thorough root cause analysis and implement
                  corrective actions to prevent recurrence.
                </li>
                <li>
                  Maintain a breach log documenting all incidents, regardless of
                  size, in compliance with federal requirements.
                </li>
              </ul>
            </div>

            {/* 7 */}
            <div>
              <h2 className="text-2xl font-bold text-surface-dark mb-4">
                7. Business Associate Agreements (BAA)
              </h2>
              <p>
                Riveo Health enters into Business Associate Agreements with all
                covered entities prior to accessing, creating, receiving,
                maintaining, or transmitting PHI on their behalf. Our BAAs
                clearly define the permitted uses and disclosures of PHI, our
                obligations under HIPAA, and the terms for breach notification
                and termination. We also require all subcontractors who handle
                PHI to execute subcontractor BAAs, ensuring that the full chain
                of custody is protected. To request a BAA, please contact our
                compliance team at{" "}
                <a
                  href="mailto:compliance@riveohealth.com"
                  className="text-primary hover:underline"
                >
                  compliance@riveohealth.com
                </a>
                .
              </p>
            </div>

            {/* 8 */}
            <div>
              <h2 className="text-2xl font-bold text-surface-dark mb-4">
                8. Employee Training
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  All employees receive HIPAA privacy and security training
                  during onboarding before they are granted access to any
                  systems containing PHI.
                </li>
                <li>
                  Annual refresher training is mandatory for all team members,
                  covering updates to regulations, policies, and emerging
                  threats.
                </li>
                <li>
                  Role-specific training is provided for personnel with elevated
                  access to PHI, including developers, support engineers, and
                  data analysts.
                </li>
                <li>
                  Phishing simulations and security awareness campaigns are
                  conducted regularly to reinforce best practices.
                </li>
                <li>
                  Training completion is tracked, and employees who do not
                  complete required training may have their access suspended.
                </li>
              </ul>
            </div>

            {/* 9 */}
            <div>
              <h2 className="text-2xl font-bold text-surface-dark mb-4">
                9. Audit Controls &amp; Monitoring
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  All access to PHI is logged with user identity, timestamp,
                  action performed, and data accessed.
                </li>
                <li>
                  Automated monitoring systems detect and alert on anomalous
                  access patterns, such as unusual login times, bulk data
                  exports, or access from unrecognized locations.
                </li>
                <li>
                  Audit logs are reviewed regularly by the security team and
                  during annual compliance assessments.
                </li>
                <li>
                  Independent third-party audits are conducted annually to
                  verify the effectiveness of our HIPAA compliance program.
                </li>
                <li>
                  Audit logs are stored in tamper-proof, append-only storage and
                  retained for a minimum of six years as required by HIPAA.
                </li>
              </ul>
            </div>

            {/* 10 */}
            <div>
              <h2 className="text-2xl font-bold text-surface-dark mb-4">
                10. Incident Response
              </h2>
              <p>
                Riveo Health maintains a formal incident response plan that outlines
                procedures for identifying, containing, investigating, and
                remediating security incidents involving PHI. The incident
                response team includes representatives from security,
                engineering, legal, and compliance. All incidents are documented
                and reviewed as part of our continuous improvement process.
                Lessons learned are incorporated into updated training materials
                and security procedures.
              </p>
            </div>

            {/* 11 */}
            <div>
              <h2 className="text-2xl font-bold text-surface-dark mb-4">
                11. Continuous Improvement
              </h2>
              <p>
                Our HIPAA compliance program is not static. We continuously
                monitor regulatory developments, industry best practices, and
                emerging threats to ensure our safeguards remain effective and
                up-to-date. We participate in industry working groups and
                collaborate with healthcare compliance experts to refine our
                approach. Findings from risk assessments, audits, and incidents
                are used to drive improvements across all aspects of our
                compliance program.
              </p>
            </div>

            {/* 12 */}
            <div>
              <h2 className="text-2xl font-bold text-surface-dark mb-4">
                12. Contact Us
              </h2>
              <p>
                If you have any questions about our HIPAA compliance program,
                need to report a potential security concern, or would like to
                request a Business Associate Agreement, please contact us:
              </p>
              <div className="mt-4 bg-slate-50 rounded-xl p-6 text-sm space-y-1">
                <p className="font-semibold text-surface-dark">
                  Riveo Health Compliance Team
                </p>
                <p>
                  Email:{" "}
                  <a
                    href="mailto:compliance@riveohealth.com"
                    className="text-primary hover:underline"
                  >
                    compliance@riveohealth.com
                  </a>
                </p>
                <p>
                  HIPAA Security Officer:{" "}
                  <a
                    href="mailto:security@riveohealth.com"
                    className="text-primary hover:underline"
                  >
                    security@riveohealth.com
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
