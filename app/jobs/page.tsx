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
    category: "Surveys & Market Research",
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
    category: "Product Testing",
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
    category: "Lifestyle",
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
    category: "Healthcare",
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
    category: "Tutoring & Education",
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
"content-writer-012": {
  title: "Freelance Content Writer",
  description: "Write articles and blog posts for various online platforms.",
  fullDescription: `
    <h2>Job Overview</h2>
    <p>As a Freelance Content Writer, you'll create engaging content for websites, blogs, and social media.</p>
    <h2>Responsibilities</h2>
    <ul>
      <li>Research and write articles on assigned topics</li>
      <li>Meet deadlines for content delivery</li>
      <li>Edit and proofread your work</li>
    </ul>
    <h2>Requirements</h2>
    <ul>
      <li>Excellent writing skills</li>
      <li>Ability to research topics independently</li>
      <li>Internet access</li>
    </ul>
    <h2>Payment Details</h2>
    <p>$20-$50 per article, depending on length and complexity.</p>
    <h2>How to Apply</h2>
    <p>Submit writing samples and a brief bio.</p>
  `,
  payRange: "$20-$50 per article",
  requirements: "Writing skills, research, internet",
  estimatedTime: "Varies by assignment",
  category: "Writing & Content",
},
"customer-support-013": {
  title: "Remote Customer Support Agent",
  description: "Assist customers via chat and email from your home office.",
  fullDescription: `
    <h2>Job Overview</h2>
    <p>As a Customer Support Agent, you'll help customers resolve issues and answer questions online.</p>
    <h2>Responsibilities</h2>
    <ul>
      <li>Respond to customer inquiries via chat and email</li>
      <li>Document and escalate issues as needed</li>
      <li>Provide excellent service and support</li>
    </ul>
    <h2>Requirements</h2>
    <ul>
      <li>Good communication skills</li>
      <li>Problem-solving ability</li>
      <li>Internet access</li>
    </ul>
    <h2>Payment Details</h2>
    <p>$12-$18 per hour, paid monthly.</p>
    <h2>How to Apply</h2>
    <p>Apply online and complete a short assessment.</p>
  `,
  payRange: "$12-$18 per hour",
  requirements: "Communication, problem-solving, internet",
  estimatedTime: "20-40 hours/week",
  category: "Customer Support",
},
"social-media-014": {
  title: "Social Media Evaluator",
  description: "Review and rate social media content for quality and relevance.",
  fullDescription: `
    <h2>Job Overview</h2>
    <p>As a Social Media Evaluator, you'll assess posts, ads, and videos for quality and appropriateness.</p>
    <h2>Responsibilities</h2>
    <ul>
      <li>Review and rate social media content</li>
      <li>Follow guidelines for content evaluation</li>
      <li>Provide feedback on trends and issues</li>
    </ul>
    <h2>Requirements</h2>
    <ul>
      <li>Familiarity with social media platforms</li>
      <li>Attention to detail</li>
      <li>Internet access</li>
    </ul>
    <h2>Payment Details</h2>
    <p>$7-$12 per hour, paid weekly.</p>
    <h2>How to Apply</h2>
    <p>Sign up and complete a qualification test.</p>
  `,
  payRange: "$7-$12 per hour",
  requirements: "Social media knowledge, detail-oriented",
  estimatedTime: "Flexible",
  category: "Social Media & Moderation",
},
"product-tester-015": {
  title: "Remote Product Tester",
  description: "Test new products and provide feedback from home.",
  fullDescription: `
    <h2>Job Overview</h2>
    <p>As a Product Tester, you'll receive products to try and review from your home.</p>
    <h2>Responsibilities</h2>
    <ul>
      <li>Test products and complete feedback forms</li>
      <li>Share honest opinions and suggestions</li>
      <li>Meet review deadlines</li>
    </ul>
    <h2>Requirements</h2>
    <ul>
      <li>Internet access</li>
      <li>Attention to detail</li>
    </ul>
    <h2>Payment Details</h2>
    <p>$10-$25 per product review, plus free products.</p>
    <h2>How to Apply</h2>
    <p>Apply online and provide your shipping address.</p>
  `,
  payRange: "$10-$25 per review",
  requirements: "Internet, attention to detail",
  estimatedTime: "15-30 minutes per review",
  category: "Product Testing",
},
"website-tester-016": {
  title: "Website Usability Tester",
  description: "Test websites and apps for usability and report issues.",
  fullDescription: `
    <h2>Job Overview</h2>
    <p>As a Usability Tester, you'll review websites and apps, providing feedback on user experience.</p>
    <h2>Responsibilities</h2>
    <ul>
      <li>Test websites and apps on various devices</li>
      <li>Report bugs and usability issues</li>
      <li>Complete feedback surveys</li>
    </ul>
    <h2>Requirements</h2>
    <ul>
      <li>Computer or smartphone</li>
      <li>Internet access</li>
    </ul>
    <h2>Payment Details</h2>
    <p>$8-$20 per test, paid after completion.</p>
    <h2>How to Apply</h2>
    <p>Sign up and complete a sample test.</p>
  `,
  payRange: "$8-$20 per test",
  requirements: "Computer/smartphone, internet",
  estimatedTime: "10-30 minutes per test",
  category: "App & Website Testing",
},
"online-tutor-017": {
  title: "Online Tutor",
  description: "Teach students online in your area of expertise.",
  fullDescription: `
    <h2>Job Overview</h2>
    <p>As an Online Tutor, you'll help students learn and succeed in various subjects.</p>
    <h2>Responsibilities</h2>
    <ul>
      <li>Conduct virtual tutoring sessions</li>
      <li>Prepare lesson plans and materials</li>
      <li>Track student progress</li>
    </ul>
    <h2>Requirements</h2>
    <ul>
      <li>Subject expertise</li>
      <li>Good communication skills</li>
      <li>Internet access</li>
    </ul>
    <h2>Payment Details</h2>
    <p>$15-$30 per hour, paid monthly.</p>
    <h2>How to Apply</h2>
    <p>Submit your resume and teaching credentials.</p>
  `,
  payRange: "$15-$30 per hour",
  requirements: "Subject expertise, communication, internet",
  estimatedTime: "Flexible",
  category: "Tutoring & Education",
},
"graphic-designer-018": {
  title: "Freelance Graphic Designer",
  description: "Design graphics and visuals for clients remotely.",
  fullDescription: `
    <h2>Job Overview</h2>
    <p>As a Freelance Graphic Designer, you'll create logos, banners, and marketing materials for clients.</p>
    <h2>Responsibilities</h2>
    <ul>
      <li>Design graphics based on client briefs</li>
      <li>Revise designs as needed</li>
      <li>Deliver files in required formats</li>
    </ul>
    <h2>Requirements</h2>
    <ul>
      <li>Graphic design skills</li>
      <li>Portfolio of previous work</li>
      <li>Internet access</li>
    </ul>
    <h2>Payment Details</h2>
    <p>$30-$100 per project, depending on scope.</p>
    <h2>How to Apply</h2>
    <p>Submit your portfolio and a short cover letter.</p>
  `,
  payRange: "$30-$100 per project",
  requirements: "Design skills, portfolio, internet",
  estimatedTime: "Varies by project",
  category: "Design & Creative",
},
"translation-019": {
  title: "Remote Translator",
  description: "Translate documents and content between languages.",
  fullDescription: `
    <h2>Job Overview</h2>
    <p>As a Translator, you'll convert written content from one language to another.</p>
    <h2>Responsibilities</h2>
    <ul>
      <li>Translate documents accurately</li>
      <li>Meet deadlines for translation projects</li>
      <li>Proofread and edit translations</li>
    </ul>
    <h2>Requirements</h2>
    <ul>
      <li>Fluency in at least two languages</li>
      <li>Attention to detail</li>
      <li>Internet access</li>
    </ul>
    <h2>Payment Details</h2>
    <p>$0.05-$0.15 per word, paid after project completion.</p>
    <h2>How to Apply</h2>
    <p>Submit your resume and language certifications.</p>
  `,
  payRange: "$0.05-$0.15 per word",
  requirements: "Fluency in 2+ languages, detail-oriented",
  estimatedTime: "Varies by project",
  category: "Transcription & Translation",
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
},"app-tester-022": {
  title: "Mobile App Tester",
  description: "Test mobile apps and report bugs or usability issues.",
  fullDescription: `
    <h2>Job Overview</h2>
    <p>As a Mobile App Tester, you'll install and test apps, providing feedback to developers.</p>
    <h2>Responsibilities</h2>
    <ul>
      <li>Test apps on your device</li>
      <li>Report bugs and issues</li>
      <li>Complete feedback forms</li>
    </ul>
    <h2>Requirements</h2>
    <ul>
      <li>Smartphone or tablet</li>
      <li>Internet access</li>
    </ul>
    <h2>Payment Details</h2>
    <p>$5-$15 per app test, paid after completion.</p>
    <h2>How to Apply</h2>
    <p>Sign up and download the test app.</p>
  `,
  payRange: "$5-$15 per app",
  requirements: "Smartphone/tablet, internet",
  estimatedTime: "10-30 minutes per app",
  category: "App & Website Testing",
},
"online-moderator-023": {
  title: "Online Community Moderator",
  description: "Moderate forums and social groups to ensure positive interactions.",
  fullDescription: `
    <h2>Job Overview</h2>
    <p>As a Community Moderator, you'll review posts and comments, enforce rules, and foster a positive environment.</p>
    <h2>Responsibilities</h2>
    <ul>
      <li>Monitor online communities</li>
      <li>Remove inappropriate content</li>
      <li>Respond to member questions</li>
    </ul>
    <h2>Requirements</h2>
    <ul>
      <li>Good judgment</li>
      <li>Communication skills</li>
      <li>Internet access</li>
    </ul>
    <h2>Payment Details</h2>
    <p>$10-$18 per hour, paid monthly.</p>
    <h2>How to Apply</h2>
    <p>Apply online and complete a moderation scenario test.</p>
  `,
  payRange: "$10-$18 per hour",
  requirements: "Judgment, communication, internet",
  estimatedTime: "Flexible",
  category: "Social Media & Moderation",
},
"review-writer-024": {
  title: "Online Review Writer",
  description: "Write reviews for products, services, and apps.",
  fullDescription: `
    <h2>Job Overview</h2>
    <p>As a Review Writer, you'll share your experiences with products and services online.</p>
    <h2>Responsibilities</h2>
    <ul>
      <li>Write honest and detailed reviews</li>
      <li>Follow guidelines for each review</li>
    </ul>
    <h2>Requirements</h2>
    <ul>
      <li>Good writing skills</li>
      <li>Internet access</li>
    </ul>
    <h2>Payment Details</h2>
    <p>$3-$10 per review, paid after approval.</p>
    <h2>How to Apply</h2>
    <p>Submit a sample review and your profile.</p>
  `,
  payRange: "$3-$10 per review",
  requirements: "Writing skills, internet",
  estimatedTime: "10-20 minutes per review",
  category: "Review Writing",
},
"voice-actor-025": {
  title: "Remote Voice Actor",
  description: "Record voiceovers for videos, ads, and audiobooks.",
  fullDescription: `
    <h2>Job Overview</h2>
    <p>As a Voice Actor, you'll record scripts for various audio projects from your home studio.</p>
    <h2>Responsibilities</h2>
    <ul>
      <li>Record and edit voiceovers</li>
      <li>Deliver files in required formats</li>
    </ul>
    <h2>Requirements</h2>
    <ul>
      <li>Clear speaking voice</li>
      <li>Microphone and recording setup</li>
      <li>Internet access</li>
    </ul>
    <h2>Payment Details</h2>
    <p>$20-$100 per project, depending on length.</p>
    <h2>How to Apply</h2>
    <p>Submit a voice sample and your rates.</p>
  `,
  payRange: "$20-$100 per project",
  requirements: "Voice, recording setup, internet",
  estimatedTime: "Varies by project",
  category: "Voice & Audio",
},
"survey-026": {
  title: "Consumer Electronics Surveyor",
  description: "Share your opinions on the latest gadgets and electronics.",
  fullDescription: `
    <h2>Job Overview</h2>
    <p>As a Consumer Electronics Surveyor, you'll participate in surveys about new tech products and trends.</p>
    <h2>Responsibilities</h2>
    <ul>
      <li>Complete electronics-related surveys</li>
      <li>Share honest feedback on gadgets</li>
    </ul>
    <h2>Requirements</h2>
    <ul>
      <li>Interest in technology</li>
      <li>Internet access</li>
    </ul>
    <h2>Payment Details</h2>
    <p>$4-$10 per survey, paid monthly.</p>
    <h2>How to Apply</h2>
    <p>Register and start receiving survey invitations.</p>
  `,
  payRange: "$4-$10 per survey",
  requirements: "Interest in tech, internet",
  estimatedTime: "10-20 minutes per survey",
  category: "Technology",
},
"survey-027": {
  title: "Travel Experience Surveyor",
  description: "Answer surveys about your travel experiences and preferences.",
  fullDescription: `
    <h2>Job Overview</h2>
    <p>As a Travel Experience Surveyor, you'll help travel companies improve their services by sharing your experiences.</p>
    <h2>Responsibilities</h2>
    <ul>
      <li>Complete travel-related surveys</li>
      <li>Share honest opinions on destinations and services</li>
    </ul>
    <h2>Requirements</h2>
    <ul>
      <li>Interest in travel</li>
      <li>Internet access</li>
    </ul>
    <h2>Payment Details</h2>
    <p>$5-$12 per survey, paid after completion.</p>
    <h2>How to Apply</h2>
    <p>Sign up and complete your travel profile.</p>
  `,
  payRange: "$5-$12 per survey",
  requirements: "Interest in travel, internet",
  estimatedTime: "10-25 minutes per survey",
  category: "Travel",
},
"survey-028": {
  title: "Food & Beverage Surveyor",
  description: "Participate in surveys about food, drinks, and dining experiences.",
  fullDescription: `
    <h2>Job Overview</h2>
    <p>As a Food & Beverage Surveyor, you'll share your opinions on food products and dining experiences.</p>
    <h2>Responsibilities</h2>
    <ul>
      <li>Complete food-related surveys</li>
      <li>Share honest feedback on products and restaurants</li>
    </ul>
    <h2>Requirements</h2>
    <ul>
      <li>Interest in food and dining</li>
      <li>Internet access</li>
    </ul>
    <h2>Payment Details</h2>
    <p>$3-$9 per survey, paid monthly.</p>
    <h2>How to Apply</h2>
    <p>Register and start participating in surveys.</p>
  `,
  payRange: "$3-$9 per survey",
  requirements: "Interest in food, internet",
  estimatedTime: "5-15 minutes per survey",
  category: "Food & Beverage",
},
"survey-028-mobile": {
  title: "Mobile Usage Surveyor",
  description: "Share your mobile phone usage habits in quick surveys.",
  fullDescription: `
    <h2>Job Overview</h2>
    <p>As a Mobile Usage Surveyor, you'll answer questions about your smartphone habits and preferences.</p>
    <h2>Responsibilities</h2>
    <ul>
      <li>Complete mobile usage surveys</li>
      <li>Share honest feedback on apps and devices</li>
    </ul>
    <h2>Requirements</h2>
    <ul>
      <li>Own a smartphone</li>
      <li>Internet access</li>
    </ul>
    <h2>Payment Details</h2>
    <p>$2-$7 per survey, paid after completion.</p>
    <h2>How to Apply</h2>
    <p>Sign up and complete your mobile profile.</p>
  `,
  payRange: "$2-$7 per survey",
  requirements: "Smartphone, internet",
  estimatedTime: "5-10 minutes per survey",
  category: "Technology",
},
"survey-029": {
  title: "Fitness & Wellness Surveyor",
  description: "Answer surveys about fitness routines and wellness products.",
  fullDescription: `
    <h2>Job Overview</h2>
    <p>As a Fitness & Wellness Surveyor, you'll help companies improve health products and services.</p>
    <h2>Responsibilities</h2>
    <ul>
      <li>Complete fitness and wellness surveys</li>
      <li>Share honest feedback on routines and products</li>
    </ul>
    <h2>Requirements</h2>
    <ul>
      <li>Interest in fitness/wellness</li>
      <li>Internet access</li>
    </ul>
    <h2>Payment Details</h2>
    <p>$3-$10 per survey, paid monthly.</p>
    <h2>How to Apply</h2>
    <p>Register and start participating in surveys.</p>
  `,
  payRange: "$3-$10 per survey",
  requirements: "Interest in fitness, internet",
  estimatedTime: "10-20 minutes per survey",
  category: "Fitness & Wellness",
},
"survey-030": {
  title: "Entertainment Surveyor",
  description: "Share your opinions on movies, TV, and streaming services.",
  fullDescription: `
    <h2>Job Overview</h2>
    <p>As an Entertainment Surveyor, you'll answer questions about your viewing habits and preferences.</p>
    <h2>Responsibilities</h2>
    <ul>
      <li>Complete entertainment-related surveys</li>
      <li>Share honest feedback on shows and platforms</li>
    </ul>
    <h2>Requirements</h2>
    <ul>
      <li>Interest in movies/TV</li>
      <li>Internet access</li>
    </ul>
    <h2>Payment Details</h2>
    <p>$2-$8 per survey, paid after completion.</p>
    <h2>How to Apply</h2>
    <p>Sign up and complete your entertainment profile.</p>
  `,
  payRange: "$2-$8 per survey",
  requirements: "Interest in entertainment, internet",
  estimatedTime: "5-15 minutes per survey",
  category: "Entertainment",
},
"survey-031": {
  title: "Shopping Habits Surveyor",
  description: "Answer surveys about your shopping preferences and habits.",
  fullDescription: `
    <h2>Job Overview</h2>
    <p>As a Shopping Habits Surveyor, you'll help retailers understand consumer trends.</p>
    <h2>Responsibilities</h2>
    <ul>
      <li>Complete shopping-related surveys</li>
      <li>Share honest feedback on products and stores</li>
    </ul>
    <h2>Requirements</h2>
    <ul>
      <li>Interest in shopping</li>
      <li>Internet access</li>
    </ul>
    <h2>Payment Details</h2>
    <p>$3-$9 per survey, paid monthly.</p>
    <h2>How to Apply</h2>
    <p>Register and start participating in surveys.</p>
  `,
  payRange: "$3-$9 per survey",
  requirements: "Interest in shopping, internet",
  estimatedTime: "5-15 minutes per survey",
  category: "Shopping & Retail",
},
"survey-032": {
  title: "Pet Owner Surveyor",
  description: "Share your experiences as a pet owner in online surveys.",
  fullDescription: `
    <h2>Job Overview</h2>
    <p>As a Pet Owner Surveyor, you'll answer questions about pet care, products, and services.</p>
    <h2>Responsibilities</h2>
    <ul>
      <li>Complete pet-related surveys</li>
      <li>Share honest feedback on pet products and services</li>
    </ul>
    <h2>Requirements</h2>
    <ul>
      <li>Own a pet</li>
      <li>Internet access</li>
    </ul>
    <h2>Payment Details</h2>
    <p>$4-$10 per survey, paid after completion.</p>
    <h2>How to Apply</h2>
    <p>Sign up and complete your pet profile.</p>
  `,
  payRange: "$4-$10 per survey",
  requirements: "Pet owner, internet",
  estimatedTime: "10-20 minutes per survey",
  category: "Pet Care",
},
"survey-033": {
  title: "Parenting Surveyor",
  description: "Participate in surveys about parenting and family life.",
  fullDescription: `
    <h2>Job Overview</h2>
    <p>As a Parenting Surveyor, you'll help companies understand family needs and preferences.</p>
    <h2>Responsibilities</h2>
    <ul>
      <li>Complete parenting-related surveys</li>
      <li>Share honest feedback on family products and services</li>
    </ul>
    <h2>Requirements</h2>
    <ul>
      <li>Parent or guardian</li>
      <li>Internet access</li>
    </ul>
    <h2>Payment Details</h2>
    <p>$5-$12 per survey, paid monthly.</p>
    <h2>How to Apply</h2>
    <p>Register and start participating in surveys.</p>
  `,
  payRange: "$5-$12 per survey",
  requirements: "Parent/guardian, internet",
  estimatedTime: "10-20 minutes per survey",
  category: "Parenting & Family",
},
"survey-034": {
  title: "Student Surveyor",
  description: "Share your experiences as a student in online surveys.",
  fullDescription: `
    <h2>Job Overview</h2>
    <p>As a Student Surveyor, you'll answer questions about your education and student life.</p>
    <h2>Responsibilities</h2>
    <ul>
      <li>Complete student-related surveys</li>
      <li>Share honest feedback on educational products and services</li>
    </ul>
    <h2>Requirements</h2>
    <ul>
      <li>Currently enrolled student</li>
      <li>Internet access</li>
    </ul>
    <h2>Payment Details</h2>
    <p>$3-$8 per survey, paid after completion.</p>
    <h2>How to Apply</h2>
    <p>Sign up and complete your student profile.</p>
  `,
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
    {Object.entries(jobsByCategory).map(([category, jobs]) => (
      <div key={category} className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">{category}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <CardTitle>{job.title}</CardTitle>
                <CardDescription>{job.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="font-medium">Pay Range:</span> {job.payRange}
                </div>
                <Link href={`/apply/${job.id}`}>
                  <Button>View Details</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    ))}
  </div>
)
