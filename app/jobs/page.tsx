"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Job data from the main page
type Job = {
  title: string
  description: string
  fullDescription: string
  payRange: string
  requirements: string
  estimatedTime: string
  category: string
  id?: string
}

const jobData: Record<string, Job> = {
  "survey-tester-001": {
    title: "Product Tester",
    description:
      "Share your opinions on new products and services through our detailed survey platform. Your feedback helps companies improve their offerings and marketing strategies.",
    fullDescription: `
      <h2>Job Overview</h2>
      <p>As a Product Survey Tester, you'll evaluate products, services, and concepts by completing detailed surveys. Your honest feedback helps shape the future of consumer products and services.</p>
      <h2>Responsibilities</h2>
      <ul>
        <li>Complete online surveys about products, services, and consumer experiences</li>
        <li>Provide thoughtful, detailed responses to questions</li>
        <li>Test new products and provide feedback on your experience</li>
        <li>Participate in market research studies</li>
        <li>Meet deadlines for survey completion</li>
      </ul>
      <h2>Requirements</h2>
      <ul>
        <li>Reliable internet connection</li>
        <li>Basic computer skills</li>
        <li>Ability to express thoughts clearly</li>
        <li>Attention to detail</li>
        <li>Honesty and integrity in providing feedback</li>
      </ul>
      <h2>Payment Details</h2>
      <p>Payment varies by survey length and complexity:</p>
      <ul>
        <li>Short surveys (5-10 minutes): $2-$5</li>
        <li>Medium surveys (11-20 minutes): $6-$15</li>
        <li>Long surveys (21-30 minutes): $16-$25</li>
        <li>Premium surveys (specialized knowledge): $26-$45</li>
      </ul>
      <p>Payments are processed within 7 days of survey completion.</p>
      <h2>How to Apply</h2>
      <p>Complete the application form below. Once approved, you'll receive survey opportunities based on your demographic profile and interests.</p>
    `,
    payRange: "$2-$45 per survey",
    requirements: "Internet access, basic computer skills",
    estimatedTime: "5-30 minutes per survey",
    category: "Surveys & Market Research",
  },
  "transcription-specialist-001": {
    title: "Audio Transcription Specialist",
    description: "Convert audio recordings into accurate text documents for our business clients.",
    fullDescription: `
      <h2>Job Overview</h2>
      <p>As an Audio Transcription Specialist, you'll convert spoken content from audio recordings into written text. This role requires excellent listening skills and attention to detail.</p>
      <h2>Responsibilities</h2>
      <ul>
        <li>Transcribe audio recordings accurately and efficiently</li>
        <li>Follow specific formatting guidelines for different clients</li>
        <li>Meet deadlines for project completion</li>
        <li>Maintain confidentiality of sensitive information</li>
        <li>Perform quality checks on your work before submission</li>
      </ul>
      <h2>Requirements</h2>
      <ul>
        <li>Excellent listening skills</li>
        <li>Fast typing speed (minimum 50 WPM)</li>
        <li>Strong grammar and punctuation skills</li>
        <li>Ability to understand various accents</li>
        <li>Reliable internet connection</li>
        <li>Quiet work environment</li>
      </ul>
      <h2>Payment Details</h2>
      <p>Payment is based on audio hour (the length of the recording):</p>
      <ul>
        <li>Standard transcription: $15-$20 per audio hour</li>
        <li>Technical content: $20-$25 per audio hour</li>
        <li>Rush jobs may include a 20% premium</li>
      </ul>
      <p>Payments are processed weekly for all completed and approved transcriptions.</p>
      <h2>How to Apply</h2>
      <p>Complete the application form below and submit a short transcription sample. Successful applicants will be invited to complete a paid test assignment.</p>
    `,
    payRange: "$15-$25 per audio hour",
    requirements: "Good listening skills, typing speed (min. 50 WPM), attention to detail",
    estimatedTime: "Varies by project",
    category: "Transcription & Translation",
  },
  "survey-004": {
    title: "Brand Awareness Surveyor",
    description: "Help brands measure their reach by answering simple surveys.",
    fullDescription: `
      <h2>Job Overview</h2>
      <p>As a Brand Awareness Surveyor, you'll participate in surveys to help brands understand their market reach and customer perception.</p>
      <h2>Responsibilities</h2>
      <ul>
        <li>Complete online surveys about brand recognition and preferences</li>
        <li>Provide honest and thoughtful feedback</li>
        <li>Meet deadlines for survey completion</li>
      </ul>
      <h2>Requirements</h2>
      <ul>
        <li>Internet access</li>
      </ul>
      <h2>Payment Details</h2>
      <p>Earn $2-$8 per survey, depending on length and complexity.</p>
      <h2>How to Apply</h2>
      <p>Sign up and start participating in surveys immediately.</p>
    `,
    payRange: "$2-$8 per survey",
    requirements: "Internet access",
    estimatedTime: "5-15 minutes per survey",
    category: "Surveys & Market Research",
  },
  "survey-005": {
    title: "Market Research Panelist",
    description: "Join our market research panel and influence new products.",
    fullDescription: `
      <h2>Job Overview</h2>
      <p>As a Market Research Panelist, you'll provide feedback on products and services to help companies improve their offerings.</p>
      <h2>Responsibilities</h2>
      <ul>
        <li>Participate in online surveys and focus groups</li>
        <li>Share your opinions on new products and concepts</li>
        <li>Complete surveys in a timely manner</li>
      </ul>
      <h2>Requirements</h2>
      <ul>
        <li>Internet access</li>
        <li>Basic English</li>
      </ul>
      <h2>Payment Details</h2>
      <p>Earn $4-$12 per survey. Payments processed after survey completion.</p>
      <h2>How to Apply</h2>
      <p>Register and join our panel to start receiving survey invitations.</p>
    `,
    payRange: "$4-$12 per survey",
    requirements: "Internet access, basic English",
    estimatedTime: "10-30 minutes per survey",
    category: "Surveys & Market Research",
  },
  "virtual-assistant-011": {
    title: "Virtual Assistant",
    description: "Assist businesses remotely with scheduling, email, and admin tasks.",
    fullDescription: `
      <h2>Job Overview</h2>
      <p>As a Virtual Assistant, you'll support clients with administrative tasks, scheduling, and communication.</p>
      <h2>Responsibilities</h2>
      <ul>
        <li>Manage emails and calendars</li>
        <li>Schedule appointments and meetings</li>
        <li>Prepare documents and reports</li>
        <li>Perform data entry and research</li>
      </ul>
      <h2>Requirements</h2>
      <ul>
        <li>Strong organizational skills</li>
        <li>Good written communication</li>
        <li>Reliable internet connection</li>
      </ul>
      <h2>Payment Details</h2>
      <p>$8-$15 per hour, paid weekly.</p>
      <h2>How to Apply</h2>
      <p>Submit your resume and a brief cover letter.</p>
    `,
    payRange: "$8-$15 per hour",
    requirements: "Organizational skills, communication, internet",
    estimatedTime: "10-40 hours/week",
    category: "Virtual Assistance",
  },
  "data-entry-011": {
    title: "Remote Data Entry Clerk",
    description: "Enter and update data for our clients from home.",
    fullDescription: `
      <h2>Job Overview</h2>
      <p>As a Data Entry Clerk, you'll input and update information in databases and spreadsheets.</p>
      <h2>Responsibilities</h2>
      <ul>
        <li>Enter data accurately and efficiently</li>
        <li>Verify and correct data as needed</li>
        <li>Maintain confidentiality of information</li>
      </ul>
      <h2>Requirements</h2>
      <ul>
        <li>Attention to detail</li>
        <li>Basic computer skills</li>
        <li>Reliable internet connection</li>
      </ul>
      <h2>Payment Details</h2>
      <p>$10-$14 per hour, paid biweekly.</p>
      <h2>How to Apply</h2>
      <p>Complete the application form and submit a typing test.</p>
    `,
    payRange: "$10-$14 per hour",
    requirements: "Attention to detail, computer skills",
    estimatedTime: "Flexible",
    category: "Data Entry",
  },
  "ai-data-labeler-001": {
    title: "AI Training Data Specialist",
    description: "Help improve our AI systems by labeling data, reviewing content, and providing feedback.",
    fullDescription: `
      <h2>Job Overview</h2>
      <p>As an AI Training Data Specialist, you'll help train and improve artificial intelligence systems by labeling data and providing human feedback.</p>
      <h2>Responsibilities</h2>
      <ul>
        <li>Label images, text, or audio for AI training</li>
        <li>Review AI-generated content for accuracy</li>
        <li>Provide feedback on AI responses</li>
        <li>Follow detailed guidelines for data labeling</li>
      </ul>
      <h2>Requirements</h2>
      <ul>
        <li>Attention to detail</li>
        <li>Basic computer skills</li>
        <li>Reliable internet connection</li>
        <li>Ability to follow detailed instructions</li>
      </ul>
      <h2>Payment Details</h2>
      <p>Payment structure:</p>
      <ul>
        <li>Basic labeling tasks: $10-$12 per hour</li>
        <li>Complex labeling: $12-$15 per hour</li>
        <li>Specialized AI feedback: $15-$18 per hour</li>
      </ul>
      <p>Payments are processed weekly for all completed work.</p>
      <h2>How to Apply</h2>
      <p>Complete the application form below. Successful applicants will receive a short training and qualification test.</p>
    `,
    payRange: "$10-$18 per hour",
    requirements: "Attention to detail, basic computer skills",
    estimatedTime: "5-20 hours per week",
    category: "AI & Machine Learning",
  },
}

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [job, setJob] = useState<Job | null>(null)
  const [isActivated, setIsActivated] = useState(false)
  const [activationDialogOpen, setActivationDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const jobId = params.id as string

  useEffect(() => {
    // Check if account is activated
    const activationStatus = localStorage.getItem("account_activated")
    if (activationStatus === "true") {
      setIsActivated(true)
    }

    // Get job data
    if (jobData[jobId]) {
      setJob(jobData[jobId])
    } else {
      // Job not found
      router.push("/jobs")
    }

    setLoading(false)
  }, [jobId, router])

  const handlePaymentRedirect = () => {
    // Store the job ID in sessionStorage so we can retrieve it when the user returns
    sessionStorage.setItem("pending_job_id", jobId)

    // Redirect to PayPal payment page
    console.log("Redirecting to PayPal payment page...")
    window.location.href = "https://www.paypal.com/ncp/payment/HX5S7CVY9BQQ2"
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <p>Loading job details...</p>
        </div>
      </div>
    )
  }

  if (!job) {
    return null // Will redirect in useEffect
  }

  // If not activated, show activation dialog
  if (!isActivated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Link href="/jobs" className="inline-flex items-center text-sm mb-6 hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to all jobs
          </Link>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{job.title}</CardTitle>
              <CardDescription>{job.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-sm mb-1">Pay Range</h3>
                    <p>{job.payRange}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm mb-1">Time Commitment</h3>
                    <p>{job.estimatedTime}</p>
                  </div>
                </div>

                <div className="bg-muted p-6 rounded-lg border text-center">
                  <h2 className="text-xl font-semibold mb-2">Account Activation Required</h2>
                  <p className="mb-4">
                    To view complete job details and apply for this position, please activate your account.
                  </p>
                  <Button onClick={() => setActivationDialogOpen(true)}>Activate Account ($5.00)</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Activation Dialog */}
          <Dialog open={activationDialogOpen} onOpenChange={setActivationDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Account Activation Required</DialogTitle>
                <DialogDescription>
                  To view job details and apply for positions, a one-time account activation fee of $5.00 is required.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col space-y-4 py-4">
                <div className="rounded-md bg-muted p-4">
                  <h3 className="font-medium mb-2">Benefits of Account Activation:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Access to all job details and application forms</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Apply to unlimited job opportunities</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Receive job alerts for new opportunities</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Track your applications and earnings</span>
                    </li>
                  </ul>
                </div>
                <div className="text-center font-medium">One-time payment: $5.00</div>
              </div>
              <DialogFooter className="flex-col sm:flex-row sm:justify-between">
                <Button variant="outline" onClick={() => setActivationDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    console.log("Activate button clicked")
                    handlePaymentRedirect()
                  }}
                >
                  Activate Account
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    )
  }

  // If activated, show full job details
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/jobs" className="inline-flex items-center text-sm mb-6 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all jobs
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{job.title}</CardTitle>
            <CardDescription>{job.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm mb-1">Pay Range</h3>
                  <p>{job.payRange}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm mb-1">Time Commitment</h3>
                  <p>{job.estimatedTime}</p>
                </div>
              </div>

              <div dangerouslySetInnerHTML={{ __html: job.fullDescription }} className="prose max-w-none" />

              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Apply for this Position</h2>
                <form className="space-y-4">
                  <div className="grid gap-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter your email address"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="experience" className="text-sm font-medium">
                      Relevant Experience
                    </label>
                    <textarea
                      id="experience"
                      className="w-full p-2 border rounded-md min-h-[100px]"
                      placeholder="Describe any relevant experience you have"
                    />
                  </div>
                  {jobId === "transcription-specialist-001" && (
                    <div className="grid gap-2">
                      <label htmlFor="transcription-sample" className="text-sm font-medium">
                        Transcription Sample
                      </label>
                      <textarea
                        id="transcription-sample"
                        className="w-full p-2 border rounded-md min-h-[100px]"
                        placeholder="Submit a short transcription sample"
                      />
                    </div>
                  )}
                  <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white">
                    Submit Application
                  </Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
