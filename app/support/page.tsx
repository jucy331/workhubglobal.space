"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Mail, Clock, HelpCircle } from "lucide-react"
import { SupportChat } from "@/components/support-chat"

export default function SupportPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Support Center</h1>
          <p className="text-lg text-gray-600">We're here to help you succeed. Get support when you need it.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Live Chat */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                Live Chat Support
              </CardTitle>
              <CardDescription>Get instant help from our support team</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Chat with our support agents in real-time. Available 24/7 to help with any questions or issues.
              </p>
              <Button className="w-full">Start Live Chat</Button>
            </CardContent>
          </Card>

          {/* Email Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-green-600" />
                Email Support
              </CardTitle>
              <CardDescription>Send us a detailed message</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                For complex issues or detailed questions, send us an email and we'll respond within 24 hours.
              </p>
              <Button variant="outline" className="w-full">
                Send Email
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Support Hours */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              Support Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-sm text-gray-600">Available 24/7</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-sm text-gray-600">
                  Monday - Friday: 9:00 AM - 6:00 PM EST
                  <br />
                  Weekend: 10:00 AM - 4:00 PM EST
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-orange-600" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription>Quick answers to common questions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">How do I activate my account?</h3>
                <p className="text-sm text-gray-600">
                  To activate your account, you need to complete the $5 activation payment. This helps us verify
                  legitimate users and maintain platform quality.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">How do I apply for jobs?</h3>
                <p className="text-sm text-gray-600">
                  Once your account is activated, you can browse jobs and click "Apply Now" on any job listing that
                  interests you.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">When do I get paid?</h3>
                <p className="text-sm text-gray-600">
                  Payment schedules vary by employer. Check the job details for specific payment information and terms.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Support Chat Component */}
      <SupportChat />
    </div>
  )
}
