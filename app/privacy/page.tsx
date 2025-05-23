import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/jobs" className="inline-flex items-center text-sm mb-6 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to jobs
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
            <CardDescription>Last updated: May 23, 2025</CardDescription>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <h2>1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when you register for an account, create or modify your
              profile, apply for jobs, or communicate with us. This information may include your name, email address,
              phone number, resume, work history, and payment information.
            </p>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Process job applications and match you with appropriate opportunities</li>
              <li>Communicate with you about services, promotions, and events</li>
              <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
              <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>3. Information Sharing</h2>
            <p>We may share your information with:</p>
            <ul>
              <li>Employers or clients when you apply for jobs</li>
              <li>Service providers who perform services on our behalf</li>
              <li>
                Professional advisors, such as lawyers, auditors, and insurers, where necessary in the course of the
                professional services they render to us
              </li>
              <li>
                Government bodies, regulators, law enforcement agencies, courts, or other third parties where we believe
                it's necessary to comply with applicable laws or regulations
              </li>
            </ul>

            <h2>4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect the security of your personal
              information. However, please be aware that no method of transmission over the Internet or method of
              electronic storage is 100% secure.
            </p>

            <h2>5. Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul>
              <li>The right to access your personal information</li>
              <li>The right to rectify inaccurate personal information</li>
              <li>The right to request deletion of your personal information</li>
              <li>The right to restrict processing of your personal information</li>
              <li>The right to data portability</li>
              <li>The right to object to processing of your personal information</li>
            </ul>

            <h2>6. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our Platform and hold certain
              information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being
              sent.
            </p>

            <h2>7. Children's Privacy</h2>
            <p>
              Our Platform is not intended for children under the age of 18. We do not knowingly collect personal
              information from children under 18. If you are a parent or guardian and you are aware that your child has
              provided us with personal information, please contact us.
            </p>

            <h2>8. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last updated" date.
            </p>

            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:support@workhubglobal.com">support@workhubglobal.com</a>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
