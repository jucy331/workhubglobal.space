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
    title: "Product Tester",
    description: "...",
    fullDescription: `...`,
    payRange: "$2-$45 per survey",
    requirements: "Internet access, basic computer skills",
    estimatedTime: "5-30 minutes per survey",
    category: "Surveys & Market Research",
  },
  "transcription-specialist-001": {
    title: "Audio Transcription Specialist",
    description: "...",
    fullDescription: `...`,
    payRange: "$15-$25 per audio hour",
    requirements: "Good listening skills, typing speed (min. 50 WPM), attention to detail",
    estimatedTime: "Varies by project",
    category: "Transcription & Translation",
  },
  "survey-004": {
    title: "Brand Awareness Surveyor",
    description: "...",
    fullDescription: `...`,
    payRange: "$2-$8 per survey",
    requirements: "Internet access",
    estimatedTime: "5-15 minutes per survey",
    category: "Surveys & Market Research",
  },
  "survey-005": {
    title: "Market Research Panelist",
    description: "...",
    fullDescription: `...`,
    payRange: "$4-$12 per survey",
    requirements: "Internet access, basic English",
    estimatedTime: "10-30 minutes per survey",
    category: "Surveys & Market Research",
  },
  "survey-006": {
    title: "Online Poll Participant",
    description: "...",
    fullDescription: `...`,
    payRange: "$1-$3 per poll",
    requirements: "Internet access",
    estimatedTime: "2-5 minutes per poll",
    category: "Surveys & Market Research",
  },
  "survey-007": {
    title: "Product Feedback Reviewer",
    description: "...",
    fullDescription: `...`,
    payRange: "$5-$15 per review",
    requirements: "Internet access, attention to detail",
    estimatedTime: "10-20 minutes per review",
    category: "Product Testing",
  },
  "survey-008": {
    title: "Lifestyle Survey Taker",
    description: "...",
    fullDescription: `...`,
    payRange: "$3-$10 per survey",
    requirements: "Internet access",
    estimatedTime: "10-15 minutes per survey",
    category: "Lifestyle",
  },
  "survey-009": {
    title: "Healthcare Survey Panelist",
    description: "...",
    fullDescription: `...`,
    payRange: "$6-$18 per survey",
    requirements: "Internet access, 18+ years old",
    estimatedTime: "15-30 minutes per survey",
    category: "Healthcare",
  },
  "survey-010": {
    title: "Education Survey Contributor",
    description: "...",
    fullDescription: `...`,
    payRange: "$4-$12 per survey",
    requirements: "Internet access, student or parent",
    estimatedTime: "10-20 minutes per survey",
    category: "Tutoring & Education",
  },
  "virtual-assistant-011": {
    title: "Virtual Assistant",
    description: "...",
    fullDescription: `...`,
    payRange: "$8-$15 per hour",
    requirements: "Organizational skills, communication, internet",
    estimatedTime: "10-40 hours/week",
    category: "Virtual Assistance",
  },
  "data-entry-011": {
    title: "Remote Data Entry Clerk",
    description: "...",
    fullDescription: `...`,
    payRange: "$10-$14 per hour",
    requirements: "Attention to detail, computer skills",
    estimatedTime: "Flexible",
    category: "Data Entry",
  },
  "content-writer-012": {
    title: "Freelance Content Writer",
    description: "...",
    fullDescription: `...`,
    payRange: "$20-$50 per article",
    requirements: "Writing skills, research, internet",
    estimatedTime: "Varies by assignment",
    category: "Writing & Content",
  },
  "customer-support-013": {
    title: "Remote Customer Support Agent",
    description: "...",
    fullDescription: `...`,
    payRange: "$12-$18 per hour",
    requirements: "Communication, problem-solving, internet",
    estimatedTime: "20-40 hours/week",
    category: "Customer Support",
  },
  "social-media-014": {
    title: "Social Media Evaluator",
    description: "...",
    fullDescription: `...`,
    payRange: "$7-$12 per hour",
    requirements: "Social media knowledge, detail-oriented",
    estimatedTime: "Flexible",
    category: "Social Media & Moderation",
  },
  "product-tester-015": {
    title: "Remote Product Tester",
    description: "...",
    fullDescription: `...`,
    payRange: "$10-$25 per review",
    requirements: "Internet, attention to detail",
    estimatedTime: "15-30 minutes per review",
    category: "Product Testing",
  },
  "website-tester-016": {
    title: "Website Usability Tester",
    description: "...",
    fullDescription: `...`,
    payRange: "$8-$20 per test",
    requirements: "Computer/smartphone, internet",
    estimatedTime: "10-30 minutes per test",
    category: "App & Website Testing",
  },
  "online-tutor-017": {
    title: "Online Tutor",
    description: "...",
    fullDescription: `...`,
    payRange: "$15-$30 per hour",
    requirements: "Subject expertise, communication, internet",
    estimatedTime: "Flexible",
    category: "Tutoring & Education",
  },
  "graphic-designer-018": {
    title: "Freelance Graphic Designer",
    description: "...",
    fullDescription: `...`,
    payRange: "$30-$100 per project",
    requirements: "Design skills, portfolio, internet",
    estimatedTime: "Varies by project",
    category: "Design & Creative",
  },
  "translation-019": {
    title: "Remote Translator",
    description: "...",
    fullDescription: `...`,
    payRange: "$0.05-$0.15 per word",
    requirements: "Fluency in 2+ languages, detail-oriented",
    estimatedTime: "Varies by project",
    category: "Transcription & Translation",
  },
  "video-captioner-020": {
    title: "Video Captioner",
    description: "...",
    fullDescription: `...`,
    payRange: "$1-$2 per video minute",
    requirements: "Listening, typing, detail-oriented",
    estimatedTime: "Varies by video",
    category: "Voice & Audio",
  },
  "microtask-worker-021": {
    title: "Online Microtask Worker",
    description: "...",
    fullDescription: `...`,
    payRange: "$0.05-$1 per task",
    requirements: "Internet, attention to detail",
    estimatedTime: "1-10 minutes per task",
    category: "Microtasks & Gigs",
  },
  "app-tester-022": {
    title: "Mobile App Tester",
    description: "...",
    fullDescription: `...`,
    payRange: "$5-$15 per app",
    requirements: "Smartphone/tablet, internet",
    estimatedTime: "10-30 minutes per app",
    category: "App & Website Testing",
  },
  "online-moderator-023": {
    title: "Online Community Moderator",
    description: "...",
    fullDescription: `...`,
    payRange: "$10-$18 per hour",
    requirements: "Judgment, communication, internet",
    estimatedTime: "Flexible",
    category: "Social Media & Moderation",
  },
  "review-writer-024": {
    title: "Online Review Writer",
    description: "...",
    fullDescription: `...`,
    payRange: "$3-$10 per review",
    requirements: "Writing skills, internet",
    estimatedTime: "10-20 minutes per review",
    category: "Review Writing",
  },
  "voice-actor-025": {
    title: "Remote Voice Actor",
    description: "...",
    fullDescription: `...`,
    payRange: "$20-$100 per project",
    requirements: "Voice, recording setup, internet",
    estimatedTime: "Varies by project",
    category: "Voice & Audio",
  },
  "survey-026": {
    title: "Consumer Electronics Surveyor",
    description: "...",
    fullDescription: `...`,
    payRange: "$4-$10 per survey",
    requirements: "Interest in tech, internet",
    estimatedTime: "10-20 minutes per survey",
    category: "Technology",
  },
  "survey-027": {
    title: "Travel Experience Surveyor",
    description: "...",
    fullDescription: `...`,
    payRange: "$5-$12 per survey",
    requirements: "Interest in travel, internet",
    estimatedTime: "10-25 minutes per survey",
    category: "Travel",
  },
  "survey-028": {
    title: "Food & Beverage Surveyor",
    description: "...",
    fullDescription: `...`,
    payRange: "$3-$9 per survey",
    requirements: "Interest in food, internet",
    estimatedTime: "5-15 minutes per survey",
    category: "Food & Beverage",
  },
  "survey-029": {
    title: "Fitness & Wellness Surveyor",
    description: "...",
    fullDescription: `...`,
    payRange: "$3-$10 per survey",
    requirements: "Interest in fitness, internet",
    estimatedTime: "10-20 minutes per survey",
    category: "Fitness & Wellness",
  },
  "survey-030": {
    title: "Entertainment Surveyor",
    description: "...",
    fullDescription: `...`,
    payRange: "$2-$8 per survey",
    requirements: "Interest in entertainment, internet",
    estimatedTime: "5-15 minutes per survey",
    category: "Entertainment",
  },
  "survey-031": {
    title: "Shopping Habits Surveyor",
    description: "...",
    fullDescription: `...`,
    payRange: "$3-$9 per survey",
    requirements: "Interest in shopping, internet",
    estimatedTime: "5-15 minutes per survey",
    category: "Shopping & Retail",
  },
  "survey-032": {
    title: "Pet Owner Surveyor",
    description: "...",
    fullDescription: `...`,
    payRange: "$4-$10 per survey",
    requirements: "Pet owner, internet",
    estimatedTime: "10-20 minutes per survey",
    category: "Pet Care",
  },
  "survey-033": {
    title: "Parenting Surveyor",
    description: "...",
    fullDescription: `...`,
    payRange: "$5-$12 per survey",
    requirements: "Parent/guardian, internet",
    estimatedTime: "10-20 minutes per survey",
    category: "Parenting & Family",
  },
  "survey-034": {
    title: "Student Surveyor",
    description: "...",
    fullDescription: `...`,
    payRange: "$3-$8 per survey",
    requirements: "Student, internet",
    estimatedTime: "5-15 minutes per survey",
    category: "Student Jobs",
  },
}   
export default function JobsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Sign In Required</h2>
        <p className="mb-4">You must be signed in to browse jobs.</p>
        <Link href="/login">
          <Button>Sign In</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Browse Jobs</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {Object.entries(jobData).map(([id, job]) => (
          <Card key={id}>
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
              <CardDescription>{job.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <span className="font-medium">Pay Range:</span> {job.payRange}
              </div>
              <Link href={`/apply/${id}`}>
                <Button>View Details</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
