"use client"

import {
  ArrowRight,
  Clock,
  DollarSign,
  FileText,
  Mail,
  MapPin,
  Star,
  TrendingUp,
  Users,
  Zap,
  Briefcase,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  popularity: number
  featured?: boolean
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
    category: "Surveys & Market Research",
    difficulty: "Beginner",
    popularity: 95,
    featured: true,
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
    difficulty: "Intermediate",
    popularity: 88,
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
    difficulty: "Intermediate",
    featured: true,
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
    difficulty: "Beginner",
    popularity: 85,
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
    difficulty: "Intermediate",
    popularity: 78,
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
    difficulty: "Beginner",
    popularity: 90,
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
        router.push(`/job/${pendingJobId}`)
      }

      toast({
        title: "Account Activated! 🎉",
        description: "Your account has been successfully activated. You now have access to all job details.",
      })
    }
  }, [toast, router])

  const handleViewDetails = (jobId: string) => {
    if (isActivated) {
      // If account is activated, go directly to job details
      router.push(`/job/${jobId}`)
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

  // Get featured jobs
  const featuredJobs = Object.entries(jobData)
    .filter(([_, job]) => job.featured)
    .map(([id, job]) => ({ ...job, id }))

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30"></div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Remote Job
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Join thousands of people earning money from home with legitimate online opportunities. Flexible hours,
              competitive pay, no experience required.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 text-lg shadow-xl"
                onClick={() => document.getElementById("jobs-section")?.scrollIntoView({ behavior: "smooth" })}
              >
                Browse Jobs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-4 text-lg"
                asChild
              >
                <Link href="/create-account">Start Free Account</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">10,000+</div>
                <div className="text-blue-200">Active Workers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">$2M+</div>
                <div className="text-blue-200">Paid Out Monthly</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">4.8★</div>
                <div className="text-blue-200">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      {featuredJobs.length > 0 && (
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Featured Opportunities</h2>
              <p className="text-lg text-gray-600">High-demand jobs with excellent earning potential</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {featuredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  id={job.id || ""}
                  title={job.title}
                  description={job.description}
                  payRange={job.payRange}
                  requirements={job.requirements}
                  estimatedTime={job.estimatedTime}
                  difficulty={job.difficulty}
                  popularity={job.popularity}
                  featured={job.featured}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Jobs Section */}
      <section id="jobs-section" className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">All Available Jobs</h2>
            <p className="text-lg text-gray-600">Browse our complete selection of remote opportunities</p>
          </div>

          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveCategory}>
            <TabsList className="flex flex-wrap justify-center mb-8 h-auto bg-white shadow-sm">
              <TabsTrigger value="all" className="mb-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                All Jobs
              </TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="mb-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="space-y-8">
              {Object.entries(jobsByCategory).map(([category, jobs]) => (
                <div key={category} className="mb-12">
                  <h3 className="text-2xl font-semibold mb-6 text-gray-900 flex items-center">
                    {category}
                    <Badge variant="secondary" className="ml-3">
                      {jobs.length} jobs
                    </Badge>
                  </h3>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {jobs.map((job) => (
                      <JobCard
                        key={job.id}
                        id={job.id || ""}
                        title={job.title}
                        description={job.description}
                        payRange={job.payRange}
                        requirements={job.requirements}
                        estimatedTime={job.estimatedTime}
                        difficulty={job.difficulty}
                        popularity={job.popularity}
                        featured={job.featured}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>

            {categories.map((category) => (
              <TabsContent key={category} value={category} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {jobsByCategory[category].map((job) => (
                    <JobCard
                      key={job.id}
                      id={job.id || ""}
                      title={job.title}
                      description={job.description}
                      payRange={job.payRange}
                      requirements={job.requirements}
                      estimatedTime={job.estimatedTime}
                      difficulty={job.difficulty}
                      popularity={job.popularity}
                      featured={job.featured}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Success Tips Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Tips for Success</h2>
            <p className="text-lg text-gray-600">Maximize your earning potential with these proven strategies</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Complete Your Profile</h3>
              <p className="text-gray-600">
                Fill out your profile completely with accurate information and relevant skills to increase your chances
                of being selected for premium opportunities.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Meet Deadlines</h3>
              <p className="text-gray-600">
                Always submit your work on time to build a positive reputation and receive more high-paying
                opportunities from our premium clients.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Quality Over Quantity</h3>
              <p className="text-gray-600">
                Focus on delivering high-quality work rather than rushing through tasks. Quality work leads to better
                ratings and higher-paying assignments.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Set a Schedule</h3>
              <p className="text-gray-600">
                Treat online work like a regular job by setting consistent hours. This helps maximize productivity and
                creates a sustainable income stream.
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Track Your Income</h3>
              <p className="text-gray-600">
                Keep detailed records of all earnings for tax purposes. You'll be classified as an independent
                contractor, so proper documentation is essential.
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl border border-indigo-200">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Join the Community</h3>
              <p className="text-gray-600">
                Connect with other remote workers in our community forums. Share tips, get support, and learn about new
                opportunities from experienced members.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">WorkHub Global</span>
              </div>
              <p className="text-gray-300 mb-4">
                Find legitimate online opportunities that match your skills and schedule. Join thousands earning from
                home.
              </p>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-gray-300">4.8/5 from 10,000+ reviews</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.slice(0, 6).map((category) => (
                  <li key={category}>
                    <button
                      onClick={() => setActiveCategory(category)}
                      className="text-gray-300 hover:text-white transition-colors text-left"
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
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
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
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

          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} WorkHub Global Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Account Activation Dialog */}
      <Dialog open={activationDialogOpen} onOpenChange={setActivationDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
              Account Activation Required
            </DialogTitle>
            <DialogDescription>
              To view job details and apply for positions, a one-time account activation fee of $5.00 is required.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4 py-4">
            <div className="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-4 border border-blue-200">
              <h3 className="font-medium mb-3 text-gray-900">✨ Benefits of Account Activation:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Access to all job details and application forms</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Apply to unlimited job opportunities</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Receive job alerts for new opportunities</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Track your applications and earnings</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Priority support and faster payments</span>
                </li>
              </ul>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">One-time payment: $5.00</div>
              <div className="text-sm text-gray-600">Secure payment via PayPal</div>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
            <Button variant="outline" onClick={() => setActivationDialogOpen(false)}>
              Maybe Later
            </Button>
            <Button
              onClick={() => {
                console.log("Activate button clicked")
                handlePaymentRedirect()
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Activate Account Now
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
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  popularity: number
  featured?: boolean
  onViewDetails: (jobId: string) => void
}

function JobCard({
  id,
  title,
  description,
  payRange,
  requirements,
  estimatedTime,
  difficulty,
  popularity,
  featured,
  onViewDetails,
}: JobCardProps) {
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div
      className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${featured ? "ring-2 ring-blue-500 shadow-lg" : ""}`}
    >
      <div className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="text-lg group-hover:text-blue-600 transition-colors">
              {title}
              {featured && (
                <div className="ml-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">Featured</div>
              )}
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <div className={`rounded-lg px-2 py-1 ${getDifficultyColor(difficulty)}`}>{difficulty}</div>
              <div className="flex items-center text-sm text-gray-600">
                <Star className="h-3 w-3 text-yellow-500 mr-1" />
                {popularity}% match
              </div>
            </div>
          </div>
        </div>
        <div className="mt-2 line-clamp-2">{description}</div>
      </div>
      <div className="pb-3">
        <div className="grid gap-3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600 flex-shrink-0" />
            <div>
              <div className="font-medium text-sm text-gray-900">{payRange}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600 flex-shrink-0" />
            <div>
              <div className="text-sm text-gray-600">{estimatedTime}</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <FileText className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm text-gray-600 line-clamp-2">{requirements}</div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Button
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg group-hover:shadow-xl transition-all"
          onClick={() => onViewDetails(id)}
        >
          View Details & Apply
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  )
}
