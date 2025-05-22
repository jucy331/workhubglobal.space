"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { User, onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Job = {
  title: string
  description: string
  fullDescription: string
  payRange: string
  requirements: string
  estimatedTime: string
}

const jobData: Record<string, Job> = {
  "survey-tester-001": {
    title: "Product Survey Tester",
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
  },
  "survey-006": {
    title: "Online Poll Participant",
    description: "Participate in quick online polls and earn rewards.",
    fullDescription: `
      <h2>Job Overview</h2>
      <p>As an Online Poll Participant, you'll answer short polls on various topics and help companies gather quick insights.</p>
      <h2>Responsibilities</h2>
      <ul>
        <li>Answer online polls honestly and promptly</li>
        <li>Provide feedback on a variety of topics</li>
      </ul>
      <h2>Requirements</h2>
      <ul>
        <li>Internet access</li>
      </ul>
      <h2>Payment Details</h2>
      <p>Earn $1-$3 per poll. Payments are processed weekly.</p>
      <h2>How to Apply</h2>
      <p>Sign up and start participating in polls right away.</p>
    `,
    payRange: "$1-$3 per poll",
    requirements: "Internet access",
    estimatedTime: "2-5 minutes per poll",
  },
  "survey-007": {
    title: "Product Feedback Reviewer",
    description: "Review products and provide feedback for improvement.",
    fullDescription: `
      <h2>Job Overview</h2>
      <p>As a Product Feedback Reviewer, you'll test products and share your opinions to help companies enhance their offerings.</p>
      <h2>Responsibilities</h2>
      <ul>
        <li>Test products and complete feedback surveys</li>
        <li>Provide detailed and honest reviews</li>
        <li>Meet feedback deadlines</li>
      </ul>
      <h2>Requirements</h2>
      <ul>
        <li>Internet access</li>
        <li>Attention to detail</li>
      </ul>
      <h2>Payment Details</h2>
      <p>Earn $5-$15 per review. Payments processed after review approval.</p>
      <h2>How to Apply</h2>
      <p>Apply and receive products to review and provide feedback.</p>
    `,
    payRange: "$5-$15 per review",
    requirements: "Internet access, attention to detail",
    estimatedTime: "10-20 minutes per review",
  },
  "survey-008": {
    title: "Lifestyle Survey Taker",
    description: "Answer lifestyle surveys and help shape future trends.",
    fullDescription: `
      <h2>Job Overview</h2>
      <p>As a Lifestyle Survey Taker, you'll answer questions about your habits, preferences, and opinions to help companies understand consumer trends.</p>
      <h2>Responsibilities</h2>
      <ul>
        <li>Complete lifestyle-related surveys</li>
        <li>Share honest and thoughtful responses</li>
      </ul>
      <h2>Requirements</h2>
      <ul>
        <li>Internet access</li>
      </ul>
      <h2>Payment Details</h2>
      <p>Earn $3-$10 per survey. Payments are processed monthly.</p>
      <h2>How to Apply</h2>
      <p>Register and start taking lifestyle surveys.</p>
    `,
    payRange: "$3-$10 per survey",
    requirements: "Internet access",
    estimatedTime: "10-15 minutes per survey",
  },
  "survey-009": {
    title: "Healthcare Survey Panelist",
    description: "Share your healthcare experiences in confidential surveys.",
    fullDescription: `
      <h2>Job Overview</h2>
      <p>As a Healthcare Survey Panelist, you'll participate in confidential surveys about healthcare experiences and services.</p>
      <h2>Responsibilities</h2>
      <ul>
        <li>Complete healthcare-related surveys</li>
        <li>Share honest and confidential feedback</li>
      </ul>
      <h2>Requirements</h2>
      <ul>
        <li>Internet access</li>
        <li>18+ years old</li>
      </ul>
      <h2>Payment Details</h2>
      <p>Earn $6-$18 per survey. Payments processed after survey completion.</p>
      <h2>How to Apply</h2>
      <p>Sign up and verify your age to participate in healthcare surveys.</p>
    `,
    payRange: "$6-$18 per survey",
    requirements: "Internet access, 18+ years old",
    estimatedTime: "15-30 minutes per survey",
  },
  "survey-010": {
    title: "Education Survey Contributor",
    description: "Help improve education by participating in surveys.",
    fullDescription: `
      <h2>Job Overview</h2>
      <p>As an Education Survey Contributor, you'll answer surveys about educational experiences to help improve learning systems.</p>
      <h2>Responsibilities</h2>
      <ul>
        <li>Complete education-related surveys</li>
        <li>Share your honest experiences as a student or parent</li>
      </ul>
      <h2>Requirements</h2>
      <ul>
        <li>Internet access</li>
        <li>Student or parent</li>
      </ul>
      <h2>Payment Details</h2>
      <p>Earn $4-$12 per survey. Payments processed after survey completion.</p>
      <h2>How to Apply</h2>
      <p>Register and indicate your role as a student or parent to participate.</p>
    `,
    payRange: "$4-$12 per survey",
    requirements: "Internet access, student or parent",
    estimatedTime: "10-20 minutes per survey",
  }
} // <-- No trailing comma here!



export default function JobsPage() {
  const params = useParams()
  const router = useRouter()
  const [job, setJob] = useState<Job | null>(null)
  const [isActivated, setIsActivated] = useState(false)
  const [activationDialogOpen, setActivationDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const jobId = params.id as string
  const [user, setUser] = useState<User | null>(null) 

  useEffect(() => {// Listen for Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
    })

    const activationStatus = localStorage.getItem("account_activated")
    if (activationStatus === "true") setIsActivated(true)
    if (jobData[jobId]) setJob(jobData[jobId])
    else router.push("/jobs")
    setLoading(false)

    return () => unsubscribe()
  }, [jobId, router])

  const handlePaymentRedirect = () => {
    sessionStorage.setItem("pending_job_id", jobId)
    window.location.href = "https://www.paypal.com/ncp/payment/HX5S7CVY9BQQ2"
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    alert("Application submitted!")
    // Add your submission logic here
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

  // AUTH CHECK: Only show page if user is signed in
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Sign In Required</h2>
        <p className="mb-4">You must be signed in to view job listings.</p>
        <Link href="/login">
          <Button>Sign In</Button>
        </Link>
      </div>
    )
  }

  if (!job) return null

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
                <Button onClick={handlePaymentRedirect}>
                  Activate Account
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    )
  }

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
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid gap-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter your full name"
                      required
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
                      required
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
                      required
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
                      required
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
                        required
                      />
                    </div>
                  )}
                  <Button type="submit" className="w-full">
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
