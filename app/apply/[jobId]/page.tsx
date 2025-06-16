"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Clock, DollarSign, FileText, MapPin, Star, Users } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

// Job data type
type Job = {
  id: string
  title: string
  description: string
  fullDescription: string
  payRange: string
  requirements: string
  estimatedTime: string
  category: string
  difficulty: string
  payAmount: number
  payType: string
  maxWorkers: number
  currentWorkers: number
  featured?: boolean
}

// Mock job data - in a real app, this would come from an API
const jobData: Record<string, Job> = {
  "survey-tester-001": {
    id: "survey-tester-001",
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
    `,
    payRange: "$2-$45 per survey",
    requirements: "Internet access, basic computer skills",
    estimatedTime: "5-30 minutes per survey",
    category: "Surveys & Market Research",
    difficulty: "Beginner",
    payAmount: 25,
    payType: "per-task",
    maxWorkers: 100,
    currentWorkers: 45,
    featured: true,
  },
  "transcription-specialist-001": {
    id: "transcription-specialist-001",
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
    `,
    payRange: "$15-$25 per audio hour",
    requirements: "Good listening skills, typing speed (min. 50 WPM), attention to detail",
    estimatedTime: "Varies by project",
    category: "Transcription & Translation",
    difficulty: "Intermediate",
    payAmount: 20,
    payType: "hourly",
    maxWorkers: 50,
    currentWorkers: 23,
  },
  "data-entry-clerk-001": {
    id: "data-entry-clerk-001",
    title: "Data Entry Clerk",
    description: "Enter data from various sources into digital formats with high accuracy and attention to detail.",
    fullDescription: `
      <h2>Job Overview</h2>
      <p>As a Data Entry Clerk, you'll be responsible for accurately entering information from various sources into our digital systems. This role is perfect for detail-oriented individuals who can work efficiently and maintain high accuracy standards.</p>
      
      <h2>Responsibilities</h2>
      <ul>
        <li>Enter data from physical documents into digital formats</li>
        <li>Verify accuracy of entered information</li>
        <li>Maintain data confidentiality and security</li>
        <li>Meet daily productivity targets</li>
        <li>Report any discrepancies or issues</li>
      </ul>
      
      <h2>Requirements</h2>
      <ul>
        <li>Strong attention to detail</li>
        <li>Basic computer skills</li>
        <li>Good typing speed and accuracy</li>
        <li>Ability to work independently</li>
        <li>Reliable internet connection</li>
      </ul>
      
      <h2>Payment Details</h2>
      <p>Payment structure:</p>
      <ul>
        <li>Base rate: $12-$15 per hour</li>
        <li>Accuracy bonus: Additional $2/hour for 99%+ accuracy</li>
        <li>Speed bonus: Additional $1/hour for exceeding targets</li>
      </ul>
      <p>Payments are processed bi-weekly.</p>
    `,
    payRange: "$12-$18 per hour",
    requirements: "Attention to detail, basic computer skills, reliable internet",
    estimatedTime: "Flexible hours",
    category: "Data Entry & Admin",
    difficulty: "Beginner",
    payAmount: 15,
    payType: "hourly",
    maxWorkers: 75,
    currentWorkers: 32,
  },
}

export default function JobApplicationPage() {
  const params = useParams()
  const router = useRouter()
  const { userProfile, isAccountActivated } = useAuth()
  const { toast } = useToast()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const jobId = params.id as string

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      if (jobData[jobId]) {
        setJob(jobData[jobId])
      }
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [jobId])

  const handleApply = async () => {
    if (!isAccountActivated()) {
      toast({
        title: "Account Activation Required",
        description: "Please activate your account to apply for jobs.",
        variant: "destructive",
      })
      return
    }

    setApplying(true)

    // Simulate application submission
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Application Submitted!",
        description: "Your application has been submitted successfully. You'll hear back within 24 hours.",
      })

      router.push("/applications")
    } catch (error) {
      toast({
        title: "Application Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return <JobApplicationSkeleton />
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
          <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <Link href="/jobs">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>
        </div>
      </div>
    )
  }

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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/jobs">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  Remote
                </span>
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {job.currentWorkers}/{job.maxWorkers} workers
                </span>
                <Badge className={getDifficultyColor(job.difficulty)}>{job.difficulty}</Badge>
                {job.featured && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">Featured</Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
                <CardDescription>{job.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: job.fullDescription }} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Details Card */}
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium">{job.payRange}</div>
                    <div className="text-sm text-gray-600">Payment</div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium">{job.estimatedTime}</div>
                    <div className="text-sm text-gray-600">Duration</div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="font-medium">{job.category}</div>
                    <div className="text-sm text-gray-600">Category</div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <Star className="h-5 w-5 text-yellow-600" />
                  <div>
                    <div className="font-medium">{job.difficulty}</div>
                    <div className="text-sm text-gray-600">Difficulty Level</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Requirements Card */}
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{job.requirements}</p>
              </CardContent>
            </Card>

            {/* Application Card */}
            <Card>
              <CardHeader>
                <CardTitle>Ready to Apply?</CardTitle>
                <CardDescription>
                  {isAccountActivated()
                    ? "Submit your application and start earning today!"
                    : "Please activate your account to apply for this job."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={handleApply} disabled={applying || !isAccountActivated()}>
                  {applying ? "Submitting..." : isAccountActivated() ? "Apply Now" : "Activate Account to Apply"}
                </Button>

                {!isAccountActivated() && (
                  <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-orange-800">
                      <strong>Account activation required:</strong> A one-time $5 fee unlocks access to all job
                      applications and details.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle>Job Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Available Positions</span>
                  <span className="font-medium">{job.maxWorkers - job.currentWorkers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current Workers</span>
                  <span className="font-medium">{job.currentWorkers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="font-medium text-green-600">94%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function JobApplicationSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Skeleton className="h-10 w-32 mb-4" />
          <Skeleton className="h-8 w-96 mb-2" />
          <div className="flex gap-4">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-16" />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-32" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
