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
import { useEffect, useState, useMemo } from "react"
import { useAuth } from "@/contexts/auth-context"
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
import { Skeleton } from "@/components/ui/skeleton"

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
  "survey-product-feedback-001": {
    title: "Product Feedback Survey Specialist",
    description:
      "Test new products and provide detailed feedback through surveys. Help shape the future of consumer products by sharing your honest opinions on everything from apps to household items.",
    fullDescription: `
      <h2>Job Overview</h2>
      <p>As a Product Feedback Survey Specialist, you'll be among the first to test new products, services, and digital platforms. Your detailed feedback helps companies improve their offerings before public launch.</p>
      <h2>Responsibilities</h2>
      <ul>
        <li>Test new products, apps, and services before public release</li>
        <li>Complete detailed feedback surveys about your experience</li>
        <li>Provide honest opinions on usability, design, and functionality</li>
        <li>Participate in follow-up surveys and focus groups</li>
        <li>Meet survey deadlines and quality requirements</li>
      </ul>
      <h2>Requirements</h2>
      <ul>
        <li>Reliable internet connection and smartphone</li>
        <li>Attention to detail and honest feedback</li>
        <li>Ability to articulate thoughts clearly</li>
        <li>18+ years old with valid email address</li>
        <li>Willingness to try new products and services</li>
      </ul>
      <h2>Payment Details</h2>
      <p>Competitive pay based on survey complexity:</p>
      <ul>
        <li>Quick surveys (5-10 minutes): $3-$8</li>
        <li>Product testing surveys (15-25 minutes): $10-$25</li>
        <li>In-depth feedback sessions (30-45 minutes): $25-$50</li>
        <li>Premium brand testing: $50-$100</li>
      </ul>
      <p>Payments processed within 48 hours via PayPal or direct deposit.</p>
      <h2>How to Apply</h2>
      <p>Complete the application form below. Approved testers receive immediate access to available surveys.</p>
    `,
    payRange: "$3-$100 per survey",
    requirements: "Internet access, smartphone, honest feedback",
    estimatedTime: "5-45 minutes per survey",
    category: "Surveys & Market Research",
    difficulty: "Beginner",
    popularity: 98,
    featured: true,
  },
  "ai-chatbot-trainer-001": {
    title: "AI Chatbot Conversation Trainer",
    description:
      "Help train AI chatbots by having conversations and rating responses. Improve AI communication through human feedback and conversation examples.",
    fullDescription: `
      <h2>Job Overview</h2>
      <p>As an AI Chatbot Conversation Trainer, you'll engage in conversations with AI systems and provide feedback to improve their responses. This role is crucial for developing more natural and helpful AI assistants.</p>
      <h2>Responsibilities</h2>
      <ul>
        <li>Engage in conversations with AI chatbots on various topics</li>
        <li>Rate the quality and helpfulness of AI responses</li>
        <li>Provide examples of better responses when needed</li>
        <li>Test AI systems for bias, accuracy, and appropriateness</li>
        <li>Complete training modules on AI evaluation criteria</li>
      </ul>
      <h2>Requirements</h2>
      <ul>
        <li>Strong communication skills in English</li>
        <li>Basic understanding of AI and chatbots</li>
        <li>Critical thinking and evaluation skills</li>
        <li>Reliable internet connection</li>
        <li>Patience for repetitive tasks</li>
      </ul>
      <h2>Payment Details</h2>
      <p>Hourly compensation based on experience:</p>
      <ul>
        <li>Entry level: $14-$16 per hour</li>
        <li>Experienced trainers: $16-$20 per hour</li>
        <li>Specialized domains (medical, legal): $20-$25 per hour</li>
        <li>Quality bonuses available for top performers</li>
      </ul>
      <p>Weekly payments via PayPal or bank transfer.</p>
      <h2>How to Apply</h2>
      <p>Submit your application with a brief writing sample. Successful candidates complete a paid training session.</p>
    `,
    payRange: "$14-$25 per hour",
    requirements: "Communication skills, critical thinking, internet",
    estimatedTime: "10-30 hours per week",
    category: "AI & Machine Learning",
    difficulty: "Intermediate",
    popularity: 94,
    featured: true,
  },
  "survey-consumer-habits-001": {
    title: "Consumer Behavior Survey Participant",
    description:
      "Share your shopping habits and lifestyle preferences through quick surveys. Help brands understand consumer trends and preferences.",
    fullDescription: `
      <h2>Job Overview</h2>
      <p>Participate in surveys about your shopping habits, lifestyle choices, and consumer preferences. Your insights help brands develop better products and marketing strategies.</p>
      <h2>Responsibilities</h2>
      <ul>
        <li>Complete surveys about shopping and lifestyle habits</li>
        <li>Provide honest feedback about brands and products</li>
        <li>Participate in market research studies</li>
        <li>Share opinions on advertising and marketing campaigns</li>
        <li>Maintain consistent participation for ongoing studies</li>
      </ul>
      <h2>Requirements</h2>
      <ul>
        <li>18+ years old with regular shopping habits</li>
        <li>Honest and detailed responses</li>
        <li>Reliable internet access</li>
        <li>Basic computer or smartphone skills</li>
        <li>Willingness to share consumer preferences</li>
      </ul>
      <h2>Payment Details</h2>
      <p>Payment varies by survey type:</p>
      <ul>
        <li>Quick preference surveys: $2-$5</li>
        <li>Shopping habit surveys: $5-$12</li>
        <li>Brand perception studies: $10-$20</li>
        <li>Lifestyle research surveys: $15-$30</li>
      </ul>
      <p>Instant payments upon survey completion.</p>
      <h2>How to Apply</h2>
      <p>Complete your demographic profile to receive matched survey opportunities.</p>
    `,
    payRange: "$2-$30 per survey",
    requirements: "Age 18+, shopping habits, internet access",
    estimatedTime: "3-20 minutes per survey",
    category: "Surveys & Market Research",
    difficulty: "Beginner",
    popularity: 96,
  },
  "ai-image-labeling-001": {
    title: "AI Image Recognition Trainer",
    description:
      "Help train AI systems to recognize objects, people, and scenes in images. Label and categorize images to improve computer vision technology.",
    fullDescription: `
      <h2>Job Overview</h2>
      <p>Train AI systems to better understand visual content by labeling images, identifying objects, and categorizing visual elements. Your work directly improves computer vision technology.</p>
      <h2>Responsibilities</h2>
      <ul>
        <li>Label objects, people, and scenes in digital images</li>
        <li>Categorize images based on content and context</li>
        <li>Identify and tag specific elements within images</li>
        <li>Verify accuracy of AI-generated image labels</li>
        <li>Follow detailed labeling guidelines and standards</li>
      </ul>
      <h2>Requirements</h2>
      <ul>
        <li>Good visual perception and attention to detail</li>
        <li>Basic computer skills and internet access</li>
        <li>Ability to follow detailed instructions</li>
        <li>Patience for repetitive visual tasks</li>
        <li>Understanding of basic image categories</li>
      </ul>
      <h2>Payment Details</h2>
      <p>Competitive rates based on task complexity:</p>
      <ul>
        <li>Simple object labeling: $12-$14 per hour</li>
        <li>Complex scene analysis: $14-$17 per hour</li>
        <li>Specialized content (medical, technical): $17-$22 per hour</li>
        <li>Quality bonuses for high accuracy rates</li>
      </ul>
      <p>Weekly payments with performance tracking dashboard.</p>
      <h2>How to Apply</h2>
      <p>Complete the application and pass a brief image labeling test to get started.</p>
    `,
    payRange: "$12-$22 per hour",
    requirements: "Visual perception, attention to detail, computer skills",
    estimatedTime: "5-25 hours per week",
    category: "AI & Machine Learning",
    difficulty: "Beginner",
    popularity: 91,
  },
  "simple-data-entry-001": {
    title: "Online Data Entry Specialist",
    description:
      "Enter information from various sources into digital databases. Simple, straightforward work that can be done from anywhere with flexible hours.",
    fullDescription: `
      <h2>Job Overview</h2>
      <p>Perform accurate data entry tasks from the comfort of your home. Work involves transferring information from various sources into digital formats with high accuracy requirements.</p>
      <h2>Responsibilities</h2>
      <ul>
        <li>Enter data from documents into online systems</li>
        <li>Verify accuracy of entered information</li>
        <li>Maintain data quality and consistency standards</li>
        <li>Process various document types (forms, receipts, surveys)</li>
        <li>Meet daily productivity targets</li>
      </ul>
      <h2>Requirements</h2>
      <ul>
        <li>Typing speed of at least 40 WPM</li>
        <li>High attention to detail and accuracy</li>
        <li>Basic computer and internet skills</li>
        <li>Quiet work environment</li>
        <li>Reliable internet connection</li>
      </ul>
      <h2>Payment Details</h2>
      <p>Competitive hourly rates with bonuses:</p>
      <ul>
        <li>Standard data entry: $11-$14 per hour</li>
        <li>Specialized data entry: $14-$17 per hour</li>
        <li>Accuracy bonuses up to $2/hour extra</li>
        <li>Speed bonuses for exceeding targets</li>
      </ul>
      <p>Bi-weekly payments via direct deposit or PayPal.</p>
      <h2>How to Apply</h2>
      <p>Complete the application and take a brief typing and accuracy test.</p>
    `,
    payRange: "$11-$17 per hour",
    requirements: "40+ WPM typing, accuracy, computer skills",
    estimatedTime: "10-40 hours per week",
    category: "Data Entry",
    difficulty: "Beginner",
    popularity: 93,
  },
  "survey-app-testing-001": {
    title: "Mobile App Testing Survey Specialist",
    description:
      "Test new mobile apps and provide feedback through detailed surveys. Help developers improve app functionality and user experience.",
    fullDescription: `
      <h2>Job Overview</h2>
      <p>Test mobile applications before they launch to the public and provide valuable feedback through surveys. Your input helps developers create better, more user-friendly apps.</p>
      <h2>Responsibilities</h2>
      <ul>
        <li>Download and test new mobile applications</li>
        <li>Complete detailed surveys about app functionality</li>
        <li>Report bugs, glitches, and usability issues</li>
        <li>Provide feedback on app design and user experience</li>
        <li>Test apps across different scenarios and use cases</li>
      </ul>
      <h2>Requirements</h2>
      <ul>
        <li>Smartphone (iOS or Android) with internet access</li>
        <li>Willingness to download and test various apps</li>
        <li>Good communication skills for detailed feedback</li>
        <li>Patience for testing and retesting features</li>
        <li>Basic understanding of mobile app functionality</li>
      </ul>
      <h2>Payment Details</h2>
      <p>Payment based on testing complexity:</p>
      <ul>
        <li>Quick app tests (10-15 minutes): $5-$10</li>
        <li>Detailed app reviews (20-30 minutes): $12-$20</li>
        <li>Comprehensive testing sessions (45-60 minutes): $25-$40</li>
        <li>Beta testing programs: $40-$75</li>
      </ul>
      <p>Same-day payments for completed surveys.</p>
      <h2>How to Apply</h2>
      <p>Register with your device information to receive compatible app testing opportunities.</p>
    `,
    payRange: "$5-$75 per test",
    requirements: "Smartphone, internet, testing patience",
    estimatedTime: "10-60 minutes per test",
    category: "Surveys & Market Research",
    difficulty: "Beginner",
    popularity: 89,
    featured: true,
  },
  "virtual-assistant-simple-001": {
    title: "Simple Virtual Assistant Tasks",
    description:
      "Handle basic administrative tasks for small businesses. Includes email management, appointment scheduling, and simple research tasks.",
    fullDescription: `
      <h2>Job Overview</h2>
      <p>Provide virtual administrative support to small businesses and entrepreneurs. Handle routine tasks that help business owners focus on growing their companies.</p>
      <h2>Responsibilities</h2>
      <ul>
        <li>Manage email correspondence and responses</li>
        <li>Schedule appointments and manage calendars</li>
        <li>Conduct basic online research</li>
        <li>Create simple documents and spreadsheets</li>
        <li>Handle customer inquiries and basic support</li>
      </ul>
      <h2>Requirements</h2>
      <ul>
        <li>Strong written communication skills</li>
        <li>Basic computer skills (email, documents, internet)</li>
        <li>Reliable internet connection</li>
        <li>Professional attitude and discretion</li>
        <li>Ability to work independently</li>
      </ul>
      <h2>Payment Details</h2>
      <p>Flexible hourly rates based on tasks:</p>
      <ul>
        <li>Basic admin tasks: $10-$13 per hour</li>
        <li>Email management: $12-$15 per hour</li>
        <li>Research and data tasks: $13-$16 per hour</li>
        <li>Customer service tasks: $14-$17 per hour</li>
      </ul>
      <p>Weekly payments with detailed time tracking.</p>
      <h2>How to Apply</h2>
      <p>Submit your application with a brief cover letter highlighting your administrative experience.</p>
    `,
    payRange: "$10-$17 per hour",
    requirements: "Communication skills, computer basics, reliability",
    estimatedTime: "5-30 hours per week",
    category: "Virtual Assistance",
    difficulty: "Beginner",
    popularity: 87,
  },
  "ai-text-evaluation-001": {
    title: "AI Writing Quality Evaluator",
    description:
      "Review and rate AI-generated text content for quality, accuracy, and helpfulness. Help improve AI writing capabilities through human feedback.",
    fullDescription: `
      <h2>Job Overview</h2>
      <p>Evaluate AI-generated written content across various topics and formats. Your feedback helps train AI systems to produce better, more accurate, and more helpful written content.</p>
      <h2>Responsibilities</h2>
      <ul>
        <li>Read and evaluate AI-generated articles, emails, and responses</li>
        <li>Rate content for accuracy, clarity, and helpfulness</li>
        <li>Identify factual errors and inconsistencies</li>
        <li>Provide feedback on writing style and tone</li>
        <li>Compare multiple AI responses and rank quality</li>
      </ul>
      <h2>Requirements</h2>
      <ul>
        <li>Excellent reading comprehension and writing skills</li>
        <li>Strong attention to detail</li>
        <li>Basic knowledge across various topics</li>
        <li>Critical thinking and evaluation abilities</li>
        <li>Reliable internet connection</li>
      </ul>
      <h2>Payment Details</h2>
      <p>Competitive rates for quality evaluation:</p>
      <ul>
        <li>Basic text evaluation: $13-$16 per hour</li>
        <li>Technical content review: $16-$20 per hour</li>
        <li>Specialized subject evaluation: $18-$24 per hour</li>
        <li>Quality bonuses for consistent accuracy</li>
      </ul>
      <p>Weekly payments with performance metrics tracking.</p>
      <h2>How to Apply</h2>
      <p>Complete the application and pass a text evaluation assessment to begin.</p>
    `,
    payRange: "$13-$24 per hour",
    requirements: "Writing skills, critical thinking, attention to detail",
    estimatedTime: "8-25 hours per week",
    category: "AI & Machine Learning",
    difficulty: "Intermediate",
    popularity: 88,
  },
  "survey-website-feedback-001": {
    title: "Website User Experience Survey Tester",
    description:
      "Visit websites and provide feedback through surveys about usability, design, and user experience. Help improve website functionality.",
    fullDescription: `
      <h2>Job Overview</h2>
      <p>Test websites and online platforms by completing specific tasks and providing detailed feedback through surveys. Your insights help improve website design and user experience.</p>
      <h2>Responsibilities</h2>
      <ul>
        <li>Navigate websites and complete assigned tasks</li>
        <li>Provide feedback on website usability and design</li>
        <li>Complete surveys about your user experience</li>
        <li>Test website functionality across different devices</li>
        <li>Report any technical issues or broken features</li>
      </ul>
      <h2>Requirements</h2>
      <ul>
        <li>Basic internet browsing skills</li>
        <li>Access to computer and/or mobile device</li>
        <li>Ability to follow detailed instructions</li>
        <li>Good observation and communication skills</li>
        <li>Reliable internet connection</li>
      </ul>
      <h2>Payment Details</h2>
      <p>Payment based on testing session length:</p>
      <ul>
        <li>Quick website tests (5-10 minutes): $4-$8</li>
        <li>Standard usability tests (15-25 minutes): $10-$18</li>
        <li>Comprehensive site reviews (30-45 minutes): $20-$35</li>
        <li>Multi-device testing sessions: $35-$50</li>
      </ul>
      <p>Immediate payment upon survey completion.</p>
      <h2>How to Apply</h2>
      <p>Register and complete a sample website test to qualify for paid opportunities.</p>
    `,
    payRange: "$4-$50 per test",
    requirements: "Internet browsing, device access, observation skills",
    estimatedTime: "5-45 minutes per test",
    category: "Surveys & Market Research",
    difficulty: "Beginner",
    popularity: 92,
  },
  "simple-transcription-001": {
    title: "Simple Audio Transcription Tasks",
    description:
      "Transcribe clear, short audio recordings into text. Perfect for beginners with basic typing skills looking for flexible work.",
    fullDescription: `
      <h2>Job Overview</h2>
      <p>Transcribe short, clear audio recordings into accurate text documents. Work with high-quality audio files that are easy to understand and transcribe.</p>
      <h2>Responsibilities</h2>
      <ul>
        <li>Listen to audio recordings and type what you hear</li>
        <li>Ensure accurate spelling and punctuation</li>
        <li>Follow basic formatting guidelines</li>
        <li>Complete transcriptions within specified deadlines</li>
        <li>Review work for accuracy before submission</li>
      </ul>
      <h2>Requirements</h2>
      <ul>
        <li>Good listening skills and attention to detail</li>
        <li>Basic typing skills (minimum 35 WPM)</li>
        <li>Quiet work environment</li>
        <li>Reliable internet connection</li>
        <li>Basic English grammar and spelling skills</li>
      </ul>
      <h2>Payment Details</h2>
      <p>Fair rates for transcription work:</p>
      <ul>
        <li>Simple transcription: $12-$15 per audio hour</li>
        <li>Clear speech recordings: $15-$18 per audio hour</li>
        <li>Rush jobs: 25% bonus rate</li>
        <li>Quality bonuses for high accuracy</li>
      </ul>
      <p>Weekly payments for all completed work.</p>
      <h2>How to Apply</h2>
      <p>Complete the application and submit a short transcription sample to demonstrate your skills.</p>
    `,
    payRange: "$12-$18 per audio hour",
    requirements: "Listening skills, 35+ WPM typing, quiet environment",
    estimatedTime: "Flexible hours",
    category: "Transcription & Translation",
    difficulty: "Beginner",
    popularity: 85,
  },
  "content-moderation-simple-001": {
    title: "Basic Content Review Specialist",
    description:
      "Review user-generated content for basic policy violations. Simple moderation tasks with clear guidelines and training provided.",
    fullDescription: `
      <h2>Job Overview</h2>
      <p>Review user-generated content such as comments, posts, and images to ensure they meet basic community guidelines. Work with clear policies and comprehensive training.</p>
      <h2>Responsibilities</h2>
      <ul>
        <li>Review text posts and comments for policy violations</li>
        <li>Check images for inappropriate content</li>
        <li>Apply community guidelines consistently</li>
        <li>Flag content that requires further review</li>
        <li>Maintain productivity and accuracy standards</li>
      </ul>
      <h2>Requirements</h2>
      <ul>
        <li>Good judgment and decision-making skills</li>
        <li>Ability to handle potentially sensitive content</li>
        <li>Strong attention to detail</li>
        <li>Reliable internet connection</li>
        <li>Professional attitude and discretion</li>
      </ul>
      <h2>Payment Details</h2>
      <p>Competitive hourly rates with training:</p>
      <ul>
        <li>Training period: $12 per hour (paid)</li>
        <li>Standard moderation: $13-$16 per hour</li>
        <li>Specialized content: $16-$19 per hour</li>
        <li>Performance bonuses available</li>
      </ul>
      <p>Bi-weekly payments with detailed performance tracking.</p>
      <h2>How to Apply</h2>
      <p>Submit your application and complete a content review assessment to get started.</p>
    `,
    payRange: "$12-$19 per hour",
    requirements: "Good judgment, attention to detail, discretion",
    estimatedTime: "15-35 hours per week",
    category: "Social Media & Moderation",
    difficulty: "Beginner",
    popularity: 82,
  },
  "survey-food-delivery-001": {
    title: "Food & Restaurant Survey Participant",
    description:
      "Share your dining and food delivery experiences through surveys. Help restaurants and delivery services improve their offerings.",
    fullDescription: `
      <h2>Job Overview</h2>
      <p>Participate in surveys about your food ordering, dining, and delivery experiences. Your feedback helps restaurants and food delivery services enhance their customer experience.</p>
      <h2>Responsibilities</h2>
      <ul>
        <li>Complete surveys about restaurant and food delivery experiences</li>
        <li>Provide feedback on food quality, service, and delivery</li>
        <li>Share opinions on menu items and pricing</li>
        <li>Participate in taste testing surveys (when applicable)</li>
        <li>Review restaurant apps and ordering platforms</li>
      </ul>
      <h2>Requirements</h2>
      <ul>
        <li>Regular food ordering or dining out habits</li>
        <li>Honest and detailed feedback abilities</li>
        <li>Basic internet and smartphone skills</li>
        <li>18+ years old</li>
        <li>Willingness to try new restaurants and foods</li>
      </ul>
      <h2>Payment Details</h2>
      <p>Rewards for food-related surveys:</p>
      <ul>
        <li>Quick dining surveys: $3-$7</li>
        <li>Delivery experience surveys: $5-$12</li>
        <li>Restaurant review surveys: $8-$15</li>
        <li>Food taste testing: $15-$30</li>
      </ul>
      <p>Instant payments plus occasional food vouchers and discounts.</p>
      <h2>How to Apply</h2>
      <p>Complete your food preferences profile to receive relevant survey opportunities.</p>
    `,
    payRange: "$3-$30 per survey",
    requirements: "Dining habits, honest feedback, smartphone",
    estimatedTime: "5-25 minutes per survey",
    category: "Surveys & Market Research",
    difficulty: "Beginner",
    popularity: 90,
  },
}

export default function JobsPage() {
  const { userProfile, loading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isActivated, setIsActivated] = useState(false)
  const [activationDialogOpen, setActivationDialogOpen] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState("all")
  const [isInitialized, setIsInitialized] = useState(false)

  // Memoize expensive computations
  const { jobsByCategory, categories, featuredJobs } = useMemo(() => {
    const jobsByCategory: Record<string, Job[]> = {}
    Object.entries(jobData).forEach(([id, job]) => {
      if (!jobsByCategory[job.category]) {
        jobsByCategory[job.category] = []
      }
      jobsByCategory[job.category].push({ ...job, id })
    })

    const categories = Object.keys(jobsByCategory)
    const featuredJobs = Object.entries(jobData)
      .filter(([_, job]) => job.featured)
      .map(([id, job]) => ({ ...job, id }))

    return { jobsByCategory, categories, featuredJobs }
  }, [])

  useEffect(() => {
    // Initialize client-side state
    const activationStatus = localStorage.getItem("account_activated")
    if (activationStatus === "true") {
      setIsActivated(true)
    }

    // Check if returning from payment
    const urlParams = new URLSearchParams(window.location.search)
    const paymentStatus = urlParams.get("payment_status")

    if (paymentStatus === "success") {
      localStorage.setItem("account_activated", "true")
      setIsActivated(true)

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

    setIsInitialized(true)
  }, [toast, router])

  const handleViewDetails = (jobId: string) => {
    if (isActivated) {
      router.push(`/job/${jobId}`)
    } else {
      setSelectedJobId(jobId)
      setActivationDialogOpen(true)
    }
  }

  const handlePaymentRedirect = () => {
    if (selectedJobId) {
      sessionStorage.setItem("pending_job_id", selectedJobId)
    }
    console.log("Redirecting to PayPal payment page...")
    window.location.href = "https://www.paypal.com/ncp/payment/HX5S7CVY9BQQ2"
  }

  // Show loading skeleton while auth is loading or not initialized
  if (loading || !isInitialized) {
    return <JobsPageSkeleton />
  }

  if (!userProfile) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="text-gray-600 mb-6">You need to be signed in to browse job opportunities.</p>
          <div className="space-y-4">
            <Link href="/login">
              <Button size="lg" className="mr-4">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline">
                Create Account
              </Button>
            </Link>
          </div>
          <div className="mt-8 text-sm text-gray-500">
            <p>Join thousands of people earning money from home with legitimate online opportunities.</p>
          </div>
        </div>
      </div>
    )
  }

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
              Welcome back, {userProfile.fullName}! Browse legitimate online opportunities with flexible hours and
              competitive pay.
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
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-4 text-lg"
                >
                  View Dashboard
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">15,000+</div>
                <div className="text-blue-200">Active Workers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">$3M+</div>
                <div className="text-blue-200">Paid Out Monthly</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">4.9★</div>
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
                <span className="text-sm text-gray-300">4.9/5 from 15,000+ reviews</span>
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

// Loading skeleton component
function JobsPageSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <Skeleton className="h-16 w-3/4 mx-auto mb-6 bg-white/20" />
            <Skeleton className="h-8 w-2/3 mx-auto mb-8 bg-white/20" />
            <div className="flex gap-4 justify-center mb-12">
              <Skeleton className="h-12 w-32 bg-white/20" />
              <Skeleton className="h-12 w-32 bg-white/20" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center">
                  <Skeleton className="h-8 w-20 mx-auto mb-2 bg-white/20" />
                  <Skeleton className="h-4 w-24 mx-auto bg-white/20" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Skeleton */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="border rounded-lg p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <Skeleton className="h-10 w-full mt-4" />
              </div>
            ))}
          </div>
        </div>
      </section>
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
      className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white rounded-lg border p-6 ${featured ? "ring-2 ring-blue-500 shadow-lg" : ""}`}
    >
      <div className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="text-lg font-semibold group-hover:text-blue-600 transition-colors">
              {title}
              {featured && (
                <Badge className="ml-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">Featured</Badge>
              )}
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Badge className={`text-xs ${getDifficultyColor(difficulty)}`}>{difficulty}</Badge>
              <div className="flex items-center text-sm text-gray-600">
                <Star className="h-3 w-3 text-yellow-500 mr-1" />
                {popularity}% match
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 text-gray-600 line-clamp-2">{description}</div>
      </div>
      <div className="pb-4">
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
