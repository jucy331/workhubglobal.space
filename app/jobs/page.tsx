"use client"

import { ArrowRight, Clock, DollarSign, FileText, Mail, MapPin } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

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
  "content-moderator-001": {
    title: "Content Moderation Specialist",
    description: "Review and moderate user-generated content for our client platforms.",
    fullDescription: `
      <h2>Job Overview</h2>
      <p>As a Content Moderation Specialist, you'll review user-generated content to ensure it meets community guidelines and standards.</p>
      <h2>Responsibilities</h2>
      <ul>
        <li>Review text, images, and videos for policy violations</li>
        <li>Make quick decisions on content acceptability</li>
        <li>Flag inappropriate or harmful content</li>
        <li>Apply platform-specific guidelines consistently</li>
      </ul>
      <h2>Requirements</h2>
      <ul>
        <li>Good judgment and decision-making skills</li>
        <li>Attention to detail</li>
        <li>Ability to handle potentially sensitive content</li>
        <li>Reliable internet connection</li>
      </ul>
      <h2>Payment Details</h2>
      <p>$12-$18 per hour, depending on shift and content type.</p>
      <p>Payments processed bi-weekly.</p>
      <h2>How to Apply</h2>
      <p>Complete the application form below. Successful candidates will receive training on content policies.</p>
    `,
    payRange: "$12-$18 per hour",
    requirements: "Good judgment, attention to detail, resilience",
    estimatedTime: "15-30 hours per week",
    category: "Social Media & Moderation",
  },
  "video-captioner-020": {
    title: "Video Captioner",
    description: "Create captions for online videos and webinars.",
    fullDescription: `
      <h2>Job Overview</h2>
      <p>As a Video Captioner, you'll transcribe and time captions for video content.</p>
      <h2>Responsibilities</h2>
      <ul>
        <li>Transcribe spoken content from videos</li>
        <li>Sync captions with video timing</li>
        <li>Review and edit captions for accuracy</li>
      </ul>
      <h2>Requirements</h2>
      <ul>
        <li>Good listening and typing skills</li>
        <li>Attention to detail</li>
        <li>Internet access</li>
      </ul>
      <h2>Payment Details</h2>
      <p>$1-$2 per video minute, paid weekly.</p>
      <h2>How to Apply</h2>
      <p>Submit a sample captioning assignment.</p>
    `,
    payRange: "$1-$2 per video minute",
    requirements: "Listening, typing, detail-oriented",
    estimatedTime: "Varies by video",
    category: "Voice & Audio",
  },
  "microtask-worker-021": {
    title: "Online Microtask Worker",
    description: "Complete small online tasks for quick payments.",
    fullDescription: `
      <h2>Job Overview</h2>
      <p>As a Microtask Worker, you'll perform simple online tasks such as data labeling, categorization, and surveys.</p>
      <h2>Responsibilities</h2>
      <ul>
        <li>Complete assigned microtasks accurately</li>
        <li>Meet daily or weekly quotas</li>
      </ul>
      <h2>Requirements</h2>
      <ul>
        <li>Internet access</li>
        <li>Attention to detail</li>
      </ul>
      <h2>Payment Details</h2>
      <p>$0.05-$1 per task, paid instantly or weekly.</p>
      <h2>How to Apply</h2>
      <p>Sign up and start working immediately.</p>
    `,
    payRange: "$0.05-$1 per task",
    requirements: "Internet, attention to detail",
    estimatedTime: "1-10 minutes per task",
    category: "Microtasks & Gigs",
  },
}

// Organize jobs by category
const jobsByCategory: Record<string, Job[]> = {}
Object.entries(jobData).forEach(([id, job]) => {
  if (!jobsByCategory[job.category]) {
    jobsByCategory[job.category] = []
  }
  jobsByCategory[job.category].push({ ...job, id })
})

// Get all unique categories
const categories = Object.keys(jobsByCategory)

export default function JobsPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [isActivated, setIsActivated] = useState(false)
  const [activationDialogOpen, setActivationDialogOpen] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState("all")

  useEffect(() => {
    setIsClient(true)

    // Check if account is activated
    const activationStatus = localStorage.getItem("account_activated")
    if (activationStatus === "true") {
      setIsActivated(true)
    }

    // Check if returning from payment
    const urlParams = new URLSearchParams(window.location.search)
    const paymentStatus = urlParams.get("payment_status")

    if (paymentStatus === "success") {
      // Activate account
      localStorage.setItem("account_activated", "true")
      setIsActivated(true)

      // If there was a pending job, redirect to it
      const pendingJobId = sessionStorage.getItem("pending_job_id")
      if (pendingJobId) {
        sessionStorage.removeItem("pending_job_id")
        router.push(`/jobs/${pendingJobId}`)
      }

      toast({
        title: "Account Activated",
        description: "Your account has been successfully activated. You now have access to all job details.",
      })
    }
  }, [toast, router])

  const handleViewDetails = (jobId: string) => {
    if (isActivated) {
      // If account is activated, go directly to job details
      router.push(`/jobs/${jobId}`)
    } else {
      // If not activated, show activation dialog
      setSelectedJobId(jobId)
      setActivationDialogOpen(true)
    }
  }

  const handlePaymentRedirect = () => {
    // Store the job ID in sessionStorage so we can retrieve it when the user returns
    if (selectedJobId) {
      sessionStorage.setItem("pending_job_id", selectedJobId)
    }

    // Redirect to PayPal payment page
    console.log("Redirecting to PayPal payment page...")
    window.location.href = "https://www.paypal.com/ncp/payment/HX5S7CVY9BQQ2"
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-12 flex-grow">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Available Online Jobs</h1>
          <p className="text-muted-foreground mb-8">
            Browse our curated selection of legitimate online opportunities with flexible hours and minimal requirements
          </p>

          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveCategory}>
            <TabsList className="flex flex-wrap mb-8 h-auto">
              <TabsTrigger value="all" className="mb-1">
                All Jobs
              </TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="mb-1">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              {Object.entries(jobsByCategory).map(([category, jobs]) => (
                <div key={category} className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">{category}</h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    {jobs.map((job) => (
                      <JobCard
                        key={job.id}
                        id={job.id || ""}
                        title={job.title}
                        description={job.description}
                        payRange={job.payRange}
                        requirements={job.requirements}
                        estimatedTime={job.estimatedTime}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>

            {categories.map((category) => (
              <TabsContent key={category} value={category} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {jobsByCategory[category].map((job) => (
                    <JobCard
                      key={job.id}
                      id={job.id || ""}
                      title={job.title}
                      description={job.description}
                      payRange={job.payRange}
                      requirements={job.requirements}
                      estimatedTime={job.estimatedTime}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="mt-10 bg-muted p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Tips for Success</h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium">1. Complete Your Profile</h3>
                <p className="text-muted-foreground">
                  Fill out your profile completely with accurate information and relevant skills to increase your
                  chances of being selected.
                </p>
              </div>

              <div>
                <h3 className="font-medium">2. Meet Deadlines</h3>
                <p className="text-muted-foreground">
                  Always submit your work on time to build a positive reputation and receive more opportunities.
                </p>
              </div>

              <div>
                <h3 className="font-medium">3. Set a Schedule</h3>
                <p className="text-muted-foreground">
                  Treat online work like a regular job by setting consistent hours to maximize productivity.
                </p>
              </div>

              <div>
                <h3 className="font-medium">4. Track Your Income</h3>
                <p className="text-muted-foreground">
                  Keep records of all earnings for tax purposes, as you'll be classified as an independent contractor.
                </p>
              </div>

              <div>
                <h3 className="font-medium">5. Quality Over Quantity</h3>
                <p className="text-muted-foreground">
                  Focus on delivering high-quality work rather than rushing through tasks to build a strong reputation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cool Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Remote Jobs</h3>
              <p className="text-gray-300">Find legitimate online opportunities that match your skills and schedule.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Categories</h3>
              <ul className="space-y-2">
                {categories.slice(0, 6).map((category) => (
                  <li key={category}>
                    <button
                      onClick={() => setActiveCategory(category)}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/faq" className="text-gray-300 hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-gray-300 hover:text-white transition-colors">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <a
                    href="mailto:support@workhubglobal.com"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    support@workhubglobal.com
                  </a>
                </li>
                <li className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-gray-300">Remote Worldwide</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Workhubglobal Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>

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
  )
}

interface JobCardProps {
  id: string
  title: string
  description: string
  payRange: string
  requirements: string
  estimatedTime: string
  onViewDetails: (jobId: string) => void
}

function JobCard({ id, title, description, payRange, requirements, estimatedTime, onViewDetails }: JobCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="mt-1">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-start gap-2">
            <DollarSign className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-sm">Pay Range</h3>
              <p className="text-muted-foreground">{payRange}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-sm">Time Commitment</h3>
              <p className="text-muted-foreground">{estimatedTime}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <FileText className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-sm">Requirements</h3>
              <p className="text-muted-foreground">{requirements}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-black hover:bg-gray-800 text-white" onClick={() => onViewDetails(id)}>
          View Details & Apply
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
