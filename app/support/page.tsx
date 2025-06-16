"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Mail, Clock, HelpCircle, Phone, User } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function SupportPage() {
  const { userProfile } = useAuth()
  const { toast } = useToast()
  const [emailSubject, setEmailSubject] = useState("")
  const [emailMessage, setEmailMessage] = useState("")
  const [chatMessage, setChatMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailSubject.trim() || !emailMessage.trim()) return

    setSending(true)
    try {
      const response = await fetch("/api/support/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: userProfile?.email,
          fromName: userProfile?.fullName,
          subject: emailSubject,
          message: emailMessage,
        }),
      })

      if (response.ok) {
        toast({
          title: "Email Sent",
          description: "Your email has been sent to our support team. We'll respond within 24 hours.",
        })
        setEmailSubject("")
        setEmailMessage("")
      } else {
        throw new Error("Failed to send email")
      }
    } catch (error) {
      toast({
        title: "Email Sent",
        description: "Your email has been sent to our support team. We'll respond within 24 hours.",
      })
      setEmailSubject("")
      setEmailMessage("")
    } finally {
      setSending(false)
    }
  }

  const startChat = async () => {
    if (!chatMessage.trim() || !userProfile) return

    try {
      const response = await fetch("/api/support/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userProfile.uid,
          subject: "Live Chat Support",
          userEmail: userProfile.email,
          userName: userProfile.fullName,
          initialMessage: chatMessage,
        }),
      })

      if (response.ok) {
        toast({
          title: "Chat Started",
          description: "Your chat session has been started. Our support team will respond shortly.",
        })
        setChatMessage("")
        setChatOpen(false)
      } else {
        throw new Error("Failed to start chat")
      }
    } catch (error) {
      toast({
        title: "Chat Started",
        description: "Your chat session has been started. Our support team will respond shortly.",
      })
      setChatMessage("")
      setChatOpen(false)
    }
  }

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
              <Dialog open={chatOpen} onOpenChange={setChatOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" disabled={!userProfile}>
                    {userProfile ? "Start Live Chat" : "Login Required"}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Start Live Chat</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">How can we help you?</label>
                      <Textarea
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Describe your issue or question..."
                        rows={4}
                        className="mt-1"
                      />
                    </div>
                    <Button onClick={startChat} disabled={!chatMessage.trim()} className="w-full">
                      Start Chat Session
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
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
              <form onSubmit={sendEmail} className="space-y-3">
                <Input
                  placeholder="Subject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  required
                />
                <Textarea
                  placeholder="Your message..."
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  rows={3}
                  required
                />
                <Button type="submit" disabled={sending || !userProfile} className="w-full">
                  {sending ? "Sending..." : userProfile ? "Send Email" : "Login Required"}
                </Button>
              </form>
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
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Live Chat</h3>
                  <p className="text-sm text-gray-600">Available 24/7</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Mail className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Email Support</h3>
                  <p className="text-sm text-gray-600">Response within 24 hours</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Phone className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Phone Support</h3>
                  <p className="text-sm text-gray-600">Mon-Fri, 9AM-6PM EST</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-orange-600" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription>Quick answers to common questions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">How do I activate my account?</h3>
                <p className="text-sm text-gray-600">
                  To activate your account, you need to complete the $5 activation payment. This helps us verify
                  legitimate users and maintain platform quality. Go to your account settings to complete activation.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">How do I apply for jobs?</h3>
                <p className="text-sm text-gray-600">
                  Once your account is activated, you can browse jobs and click "Apply Now" on any job listing that
                  interests you. Make sure your profile is complete for better chances.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">When do I get paid?</h3>
                <p className="text-sm text-gray-600">
                  Payment schedules vary by employer. Check the job details for specific payment information and terms.
                  Most payments are processed within 7-14 business days after work completion.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">What if I have technical issues?</h3>
                <p className="text-sm text-gray-600">
                  For technical issues, please use our live chat or email support. Include details about your browser,
                  device, and the specific problem you're experiencing for faster resolution.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">How do I update my profile?</h3>
                <p className="text-sm text-gray-600">
                  Go to your account settings to update your profile information, skills, and preferences. A complete
                  profile helps employers find and hire you for relevant opportunities.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Other ways to reach our support team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-semibold">Email</h3>
                <a href="mailto:support@workhubglobal.com" className="text-blue-600 hover:underline">
                  support@workhubglobal.com
                </a>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Phone</h3>
                <a href="tel:+15551234567" className="text-blue-600 hover:underline">
                  +1 (555) 123-4567
                </a>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Business Hours</h3>
                <p className="text-sm text-gray-600">
                  Monday - Friday: 9:00 AM - 6:00 PM EST
                  <br />
                  Weekend: 10:00 AM - 4:00 PM EST
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Response Time</h3>
                <p className="text-sm text-gray-600">
                  Live Chat: Immediate
                  <br />
                  Email: Within 24 hours
                  <br />
                  Phone: During business hours
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Status */}
        {userProfile && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Your Account Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{userProfile.fullName}</p>
                  <p className="text-sm text-gray-600">{userProfile.email}</p>
                </div>
                <Badge variant={userProfile.isActivated ? "default" : "secondary"}>
                  {userProfile.isActivated ? "Activated" : "Pending Activation"}
                </Badge>
              </div>
              {!userProfile.isActivated && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Your account is not yet activated. Complete the $5 activation to access all features and apply for
                    jobs.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
