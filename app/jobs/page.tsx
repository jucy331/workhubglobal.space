"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState, FormEvent } from "react"
import { User, onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"

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
  {
id: "survey-004",
title: "Brand Awareness Surveyor",
company: "BrandScope",
description: "Help brands measure their reach by answering simple surveys.",
pay: "$2-$8 per survey",
requirements: "Internet access",
posted: getRecentDate,
time: "5-15 minutes per survey",
tags: ["Remote", "Flexible"],
category: "surveys",
},
{
id: "survey-005",
title: "Market Research Panelist",
company: "MarketMinds",
description: "Join our market research panel and influence new products.",
pay: "$4-$12 per survey",
requirements: "Internet access, basic English",
posted: "May 22, 2025",
time: "10-30 minutes per survey",
tags: ["Flexible", "Remote"],
category: "surveys",
},
{
id: "survey-006",
title: "Online Poll Participant",
company: "QuickPoll",
description: "Participate in quick online polls and earn rewards.",
pay: "$1-$3 per poll",
requirements: "Internet access",
posted: getRecentDate,
time: "2-5 minutes per poll",
tags: ["Flexible", "No Experience"],
category: "surveys",
},
{
id: "survey-007",
title: "Product Feedback Reviewer",
company: "FeedbackLoop",
description: "Review products and provide feedback for improvement.",
pay: "$5-$15 per review",
requirements: "Internet access, attention to detail",
posted: getRecentDate,
time: "10-20 minutes per review",
tags: ["Remote", "Flexible"],
category: "surveys",
},
{
id: "survey-008",
title: "Lifestyle Survey Taker",
company: "LifeSurveys",
description: "Answer lifestyle surveys and help shape future trends.",
pay: "$3-$10 per survey",
requirements: "Internet access",
posted: getRecentDate,
time: "10-15 minutes per survey",
tags: ["Flexible", "Remote"],
category: "surveys",
},
{
id: "survey-009",
title: "Healthcare Survey Panelist",
company: "HealthPanel",
description: "Share your healthcare experiences in confidential surveys.",
pay: "$6-$18 per survey",
requirements: "Internet access, 18+ years old",
posted: getRecentDate,
time: "15-30 minutes per survey",
tags: ["Flexible", "Remote"],
category: "surveys",
},
{
id: "survey-010",
title: "Education Survey Contributor",
company: "EduVoice",
description: "Help improve education by participating in surveys.",
pay: "$4-$12 per survey",
requirements: "Internet access, student or parent",
posted: getRecentDate,
time: "10-20 minutes per survey",
tags: ["Flexible", "Remote"],
category: "surveys",
},
// --- Transcription (10) ---
{
id: "transcription-001",
title: "Audio Transcription Specialist",
company: "AudioText Inc.",
description: "Transcribe audio files for various clients.",
pay: "$15-$25 per audio hour",
requirements: "Good listening skills, typing speed (min. 50 WPM)",
posted: getRecentDate,
time: "Varies by project",
tags: ["Remote", "Flexible Hours"],
category: "transcription",
},
{
id: "transcription-002",
title: "Podcast Transcriber",
company: "Podscribe",
description: "Transcribe podcast episodes for accessibility.",
pay: "$18 per audio hour",
requirements: "Attention to detail, English proficiency",
posted: "May 20, 2025",
time: "1-2 hours per episode",
tags: ["Remote", "Flexible"],
category: "transcription",
},
{
id: "transcription-003",
title: "Medical Transcriptionist",
company: "MediTrans",
description: "Transcribe medical dictations for clinics and hospitals.",
pay: "$20-$30 per audio hour",
requirements: "Medical terminology knowledge",
posted: "May 21, 2025",
time: "Varies by assignment",
tags: ["Remote", "Specialized"],
category: "transcription",
},
{
id: "transcription-004",
title: "Legal Transcriptionist",
company: "LegalDocs",
description: "Transcribe legal proceedings and interviews.",
pay: "$22-$35 per audio hour",
requirements: "Legal terminology knowledge",
posted: getRecentDate,
time: "Varies by project",
tags: ["Remote", "Specialized"],
category: "transcription",
},
{
id: "transcription-005",
title: "General Transcriptionist",
company: "Transcripto",
description: "Transcribe a variety of audio content.",
pay: "$12-$20 per audio hour",
requirements: "Typing skills, attention to detail",
posted: getRecentDate,
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "transcription",
},
{
id: "transcription-006",
title: "Focus Group Transcriber",
company: "FocusTrans",
description: "Transcribe focus group discussions.",
pay: "$18-$28 per audio hour",
requirements: "Good listening skills",
posted: getRecentDate,
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "transcription",
},
{
id: "transcription-007",
title: "Academic Transcriptionist",
company: "EduTrans",
description: "Transcribe academic lectures and interviews.",
pay: "$15-$22 per audio hour",
requirements: "English proficiency",
posted: getRecentDate,
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "transcription",
},
{
id: "transcription-008",
title: "Business Meeting Transcriber",
company: "BizTrans",
description: "Transcribe business meetings and conference calls.",
pay: "$16-$24 per audio hour",
requirements: "Typing skills, confidentiality",
posted: "May 26, 2025",
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "transcription",
},
{
id: "transcription-009",
title: "Interview Transcriber",
company: "InterTrans",
description: "Transcribe interviews for research and journalism.",
pay: "$14-$20 per audio hour",
requirements: "Typing skills, attention to detail",
posted: getRecentDate,
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "transcription",
},
{
id: "transcription-010",
title: "Video Transcriptionist",
company: "VidTrans",
description: "Transcribe video content for subtitles.",
pay: "$15-$22 per video hour",
requirements: "Typing skills, English proficiency",
posted: getRecentDate,
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "transcription",
},
// --- Captioning (10) ---
{
id: "captioning-001",
title: "Video Captioner",
company: "CaptionFlow",
description: "Create captions for online videos and webinars.",
pay: "$0.50-$1.00 per video minute",
requirements: "Typing skills, English proficiency",
posted: getRecentDate,
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "captioning",
},
{
id: "captioning-002",
title: "Live Event Captioner",
company: "LiveWords",
description: "Provide real-time captions for live events.",
pay: "$25 per event hour",
requirements: "Fast typing, live captioning experience",
posted: getRecentDate,
time: "Event-based",
tags: ["Remote", "Event"],
category: "captioning",
},
{
id: "captioning-003",
title: "TV Show Captioner",
company: "TVText",
description: "Caption TV shows for accessibility.",
pay: "$1.20 per video minute",
requirements: "Typing skills, English proficiency",
posted: "May 22, 2025",
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "captioning",
},
{
id: "captioning-004",
title: "YouTube Captioner",
company: "YTSubs",
description: "Create captions for YouTube creators.",
pay: "$0.80-$1.10 per video minute",
requirements: "Typing skills, English proficiency",
posted: getRecentDate,
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "captioning",
},
{
id: "captioning-005",
title: "Corporate Webinar Captioner",
company: "WebiCap",
description: "Caption corporate webinars and online meetings.",
pay: "$1.00 per video minute",
requirements: "Typing skills, confidentiality",
posted: getRecentDate,
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "captioning",
},
{
id: "captioning-006",
title: "Educational Video Captioner",
company: "EduCap",
description: "Caption educational videos for e-learning platforms.",
pay: "$0.90 per video minute",
requirements: "Typing skills, English proficiency",
posted: getRecentDate,
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "captioning",
},
{
id: "captioning-007",
title: "Movie Captioner",
company: "MovieSubs",
description: "Create captions for movies and documentaries.",
pay: "$1.50 per video minute",
requirements: "Typing skills, English proficiency",
posted: getRecentDate,
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "captioning",
},
{
id: "captioning-008",
title: "Conference Captioner",
company: "ConfCap",
description: "Provide captions for online conferences.",
pay: "$1.10 per video minute",
requirements: "Typing skills, English proficiency",
posted: getRecentDate,
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "captioning",
},
{
id: "captioning-009",
title: "Podcast Captioner",
company: "PodCap",
description: "Create captions for podcast videos.",
pay: "$0.70 per video minute",
requirements: "Typing skills, English proficiency",
posted: getRecentDate,
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "captioning",
},
{
id: "captioning-010",
title: "Social Media Video Captioner",
company: "SocCap",
description: "Caption short social media videos.",
pay: "$0.60 per video minute",
requirements: "Typing skills, English proficiency",
posted: getRecentDate,
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "captioning",
},
// --- AI Training (10) ---
{
id: "ai-001",
title: "Remote AI Data Trainer",
company: "OpenAI Tasks",
description: "Train AI models by completing simple language tasks.",
pay: "$10-$20 per hour",
requirements: "Fluent English, attention to detail",
posted: getRecentDate,
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "ai",
},
{
id: "ai-002",
title: "Image Labeling Specialist",
company: "VisionAI",
description: "Label images to help train computer vision models.",
pay: "$0.05-$0.20 per image",
requirements: "Computer, attention to detail",
posted: getRecentDate,
time: "Flexible",
tags: ["Remote", "No Experience"],
category: "ai",
},
{
id: "ai-003",
title: "Chatbot Conversation Rater",
company: "BotCheck",
description: "Rate chatbot conversations for quality and accuracy.",
pay: "$8-$15 per hour",
requirements: "Fluent English, internet access",
posted: getRecentDate,
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "ai",
},
{
id: "ai-004",
title: "Speech Data Collector",
company: "VoiceAI",
description: "Record and submit speech samples for AI training.",
pay: "$5-$20 per task",
requirements: "Microphone, clear speech",
posted: "May 22, 2025",
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "ai",
},
{
id: "ai-005",
title: "Text Categorization Tasker",
company: "TextAI",
description: "Categorize text samples for machine learning.",
pay: "$0.02-$0.10 per sample",
requirements: "Computer, attention to detail",
posted: getRecentDate,
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "ai",
},
{
id: "ai-006",
title: "Sentiment Analysis Annotator",
company: "SentimentLab",
description: "Label text for sentiment analysis datasets.",
pay: "$0.03-$0.12 per sample",
requirements: "Computer, English proficiency",
posted: getRecentDate,
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "ai",
},
{
id: "ai-007",
title: "Data Validation Worker",
company: "DataCheck",
description: "Validate AI training data for accuracy.",
pay: "$9-$16 per hour",
requirements: "Attention to detail",
posted: getRecentDate,
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "ai",
},
{
id: "ai-008",
title: "Audio Tagging Specialist",
company: "AudioAI",
description: "Tag audio clips for machine learning.",
pay: "$0.04-$0.15 per clip",
requirements: "Computer, headphones",
posted: getRecentDate,
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "ai",
},
{
id: "ai-009",
title: "Image Quality Rater",
company: "PicRate",
description: "Rate images for quality and relevance.",
pay: "$0.03-$0.10 per image",
requirements: "Computer, attention to detail",
posted: getRecentDate,
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "ai",
},
{
id: "ai-010",
title: "AI Prompt Tester",
company: "PromptLab",
description: "Test and evaluate AI-generated prompts.",
pay: "$10-$18 per hour",
requirements: "Fluent English, internet access",
posted: getRecentDate,
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "ai",
},
// --- Writing (10) ---
{
id: "writing-001",
title: "Freelance Blog Writer",
company: "Contently",
description: "Write blog posts on various topics for online publications.",
pay: "$30-$100 per article",
requirements: "Writing samples, English proficiency",
posted: getRecentDate,
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "writing",
},
{
id: "writing-002",
title: "Product Description Writer",
company: "ShopText",
description: "Write engaging product descriptions for e-commerce sites.",
pay: "$10-$25 per description",
requirements: "Writing skills, e-commerce experience",
posted: getRecentDate,
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "writing",
},
{
id: "writing-003",
title: "SEO Content Writer",
company: "RankWriters",
description: "Write SEO-optimized articles for websites.",
pay: "$25-$80 per article",
requirements: "SEO knowledge, writing samples",
posted: getRecentDate,
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "writing",
},
{
id: "writing-004",
title: "Technical Writer",
company: "TechDocs",
description: "Write technical documentation for software products.",
pay: "$40-$120 per document",
requirements: "Technical background, writing samples",
posted: getRecentDate,
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "writing",
},
{
id: "writing-005",
title: "Copywriter",
company: "CopyPro",
description: "Write marketing copy for ads and landing pages.",
pay: "$20-$60 per copy",
requirements: "Writing skills, marketing experience",
posted: getRecentDate,
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "writing",
},
{
id: "writing-006",
title: "Grant Writer",
company: "GrantMakers",
description: "Write grant proposals for nonprofits.",
pay: "$50-$200 per proposal",
requirements: "Grant writing experience",
posted: getRecentDate,
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "writing",
},
{
id: "writing-007",
title: "Resume Writer",
company: "CareerDocs",
description: "Write and edit resumes for job seekers.",
pay: "$15-$40 per resume",
requirements: "Writing skills, HR experience",
posted: getRecentDate,
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "writing",
},
{
id: "writing-008",
title: "Social Media Content Writer",
company: "SocialBuzz",
description: "Write posts and captions for social media brands.",
pay: "$10-$30 per post",
requirements: "Writing skills, social media experience",
posted: getRecentDate,
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "writing",
},
{
id: "writing-009",
title: "Script Writer",
company: "ScriptWorks",
description: "Write scripts for YouTube and podcasts.",
pay: "$25-$70 per script",
requirements: "Writing skills, creativity",
posted: getRecentDate,
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "writing",
},
{
id: "writing-010",
title: "Newsletter Writer",
company: "NewsMail",
description: "Write and edit newsletters for organizations.",
pay: "$20-$50 per newsletter",
requirements: "Writing skills, editing experience",
posted: getRecentDate,
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "writing",
},
// --- Other Tasks (10) ---
{
id: "other-001",
title: "Online Researcher",
company: "InfoFinders",
description: "Conduct online research and summarize findings.",
pay: "$12-$18 per hour",
requirements: "Internet research skills",
posted: getRecentDate,
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "other",
},
{
id: "other-002",
title: "Virtual Assistant",
company: "RemoteAssist",
description: "Assist clients with scheduling, email, and admin tasks.",
pay: "$15-$25 per hour",
requirements: "Organization, communication skills",
posted: getRecentDate,
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "other",
},
{
id: "other-003",
title: "Data Entry Clerk",
company: "DataWorks",
description: "Enter and manage data for various clients.",
pay: "$10-$16 per hour",
requirements: "Typing skills, attention to detail",
posted: getRecentDate,
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "other",
},
{
id: "other-004",
title: "Customer Support Agent",
company: "HelpDesk",
description: "Provide customer support via chat and email.",
pay: "$13-$20 per hour",
requirements: "Communication skills, patience",
posted: getRecentDate,
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "other",
},
{
id: "other-005",
title: "Online Tutor",
company: "TutorNow",
description: "Tutor students in various subjects online.",
pay: "$15-$30 per hour",
requirements: "Subject expertise, teaching skills",
posted: getRecentDate,
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "other",
},
{
id: "other-006",
title: "Survey Moderator",
company: "SurveySafe",
description: "Moderate online surveys for quality and compliance.",
pay: "$12-$18 per hour",
requirements: "Attention to detail",
posted: getRecentDate,
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "other",
},
{
id: "other-007",
title: "Remote Scheduler",
company: "Schedulr",
description: "Manage appointments and calendars for clients.",
pay: "$14-$22 per hour",
requirements: "Organization, communication skills",
posted: getRecentDate,
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "other",
},
{
id: "other-008",
title: "Online Community Moderator",
company: "ForumGuard",
description: "Moderate online forums and communities.",
pay: "$11-$17 per hour",
requirements: "Communication skills, patience",
posted: getRecentDate,
time: "Flexible",
tags: ["Remote", "Flexible"],
category: "other",
},
}

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
