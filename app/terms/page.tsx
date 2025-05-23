import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/jobs" className="inline-flex items-center text-sm mb-6 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to jobs
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
            <CardDescription>Last updated: May 23, 2025</CardDescription>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Workhubglobal Platform ("Platform"), you agree to be bound by these Terms of
              Service. If you do not agree to these terms, please do not use our services.
            </p>

            <h2>2. Account Registration</h2>
            <p>
              To access certain features of the Platform, you must register for an account. You agree to provide
              accurate, current, and complete information during the registration process and to update such information
              to keep it accurate, current, and complete.
            </p>

            <h2>3. Account Activation</h2>
            <p>
              A one-time account activation fee is required to access job details and apply for positions. This fee is
              non-refundable once your account has been successfully activated.
            </p>

            <h2>4. User Conduct</h2>
            <p>
              You agree not to use the Platform for any illegal or unauthorized purpose. You must not, in the use of the
              Platform, violate any laws in your jurisdiction.
            </p>

            <h2>5. Job Listings</h2>
            <p>
              While we strive to ensure all job listings are legitimate, we cannot guarantee the accuracy of all
              information provided by employers. Users are encouraged to perform their own due diligence before
              accepting any job offers.
            </p>

            <h2>6. Payments and Fees</h2>
            <p>
              The Platform charges a one-time activation fee. This fee grants you access to job details and the ability
              to apply for positions. Additional fees may apply for premium services, which will be clearly disclosed
              before purchase.
            </p>

            <h2>7. Intellectual Property</h2>
            <p>
              The Platform and its original content, features, and functionality are owned by Workhubglobal and are
              protected by international copyright, trademark, patent, trade secret, and other intellectual property
              laws.
            </p>

            <h2>8. Termination</h2>
            <p>
              We may terminate or suspend your account and bar access to the Platform immediately, without prior notice
              or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>

            <h2>9. Limitation of Liability</h2>
            <p>
              In no event shall Workhubglobal, nor its directors, employees, partners, agents, suppliers, or affiliates,
              be liable for any indirect, incidental, special, consequential or punitive damages, including without
              limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>

            <h2>10. Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. It is your responsibility to check
              these Terms periodically for changes. Your continued use of the Platform following the posting of any
              changes constitutes acceptance of those changes.
            </p>

            <h2>11. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at{" "}
              <a href="mailto:support@workhubglobal.com">support@workhubglobal.com</a>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
