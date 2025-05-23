import Link from "next/link"
import { ArrowLeft, Mail, MessageSquare } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SupportPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/jobs" className="inline-flex items-center text-sm mb-6 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to jobs
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Support Center</CardTitle>
            <CardDescription>Get help with your account or job-related questions</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="contact" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="contact">Contact Us</TabsTrigger>
                <TabsTrigger value="common">Common Issues</TabsTrigger>
              </TabsList>
              <TabsContent value="contact" className="mt-6">
                <form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input id="name" placeholder="Enter your full name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="Enter your email address" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="What is your inquiry about?" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Please describe your issue in detail"
                      className="min-h-[150px]"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Submit Support Request
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="common" className="mt-6">
                <div className="space-y-6">
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium text-lg mb-2">Account Activation Issues</h3>
                    <p className="mb-2">
                      If your account hasn't been activated after payment, please check your email for a confirmation
                      message. If you don't see it, check your spam folder.
                    </p>
                    <p>
                      If you still need help, contact us at{" "}
                      <a href="mailto:support@workhubglobal.com" className="text-blue-600 hover:underline">
                        support@workhubglobal.com
                      </a>{" "}
                      with your payment confirmation.
                    </p>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium text-lg mb-2">Payment Problems</h3>
                    <p className="mb-2">
                      If you're experiencing issues with payments, please ensure your payment method is valid and has
                      sufficient funds.
                    </p>
                    <p>
                      For payment-related inquiries, contact us with your transaction ID and a screenshot of any error
                      messages.
                    </p>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium text-lg mb-2">Job Application Issues</h3>
                    <p className="mb-2">
                      If you're having trouble applying for jobs, make sure your account is activated and your profile
                      is complete.
                    </p>
                    <p>
                      Some jobs may have specific requirements or be temporarily unavailable. Try refreshing the page or
                      applying for a different position.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-muted p-6 rounded-b-lg">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              <a href="mailto:support@workhubglobal.com" className="hover:underline">
                support@workhubglobal.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <span>Response time: Within 24 hours</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
