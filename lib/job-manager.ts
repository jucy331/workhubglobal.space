"use client"

export interface Job {
  id: string
  title: string
  description: string
  fullDescription: string
  payRange: string
  requirements: string
  estimatedTime: string
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  popularity: number
  featured?: boolean
  createdAt: string
  updatedAt: string
  status: "active" | "paused" | "completed" | "cancelled"
  maxWorkers: number
  currentWorkers: number
  employerId: string
  employerName: string
  payType: "per-task" | "hourly" | "fixed"
  payAmount: number
  instructions: string
  tags: string[]
}

export interface JobFilters {
  category?: string
  difficulty?: string
  payRange?: string
  search?: string
}

class JobManager {
  private static instance: JobManager
  private jobs: Job[] = []
  private listeners: Array<(jobs: Job[]) => void> = []

  private constructor() {
    this.loadJobs()
  }

  static getInstance(): JobManager {
    if (!JobManager.instance) {
      JobManager.instance = new JobManager()
    }
    return JobManager.instance
  }

  private loadJobs(): void {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("workhub_jobs")
      if (stored) {
        try {
          this.jobs = JSON.parse(stored)
        } catch (error) {
          console.error("Error loading jobs from storage:", error)
          this.jobs = []
        }
      }
    }
  }

  private saveJobs(): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("workhub_jobs", JSON.stringify(this.jobs))
      this.notifyListeners()
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener([...this.jobs]))
  }

  subscribe(listener: (jobs: Job[]) => void): () => void {
    this.listeners.push(listener)
    // Immediately call with current jobs
    listener([...this.jobs])

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  getAllJobs(): Job[] {
    return [...this.jobs].filter((job) => job.status === "active")
  }

  getJobById(id: string): Job | undefined {
    return this.jobs.find((job) => job.id === id)
  }

  getJobsByCategory(category: string): Job[] {
    return this.jobs.filter((job) => job.status === "active" && (category === "all" || job.category === category))
  }

  getFeaturedJobs(): Job[] {
    return this.jobs.filter((job) => job.status === "active" && job.featured)
  }

  searchJobs(filters: JobFilters): Job[] {
    let filtered = this.jobs.filter((job) => job.status === "active")

    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter((job) => job.category === filters.category)
    }

    if (filters.difficulty) {
      filtered = filtered.filter((job) => job.difficulty === filters.difficulty)
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower) ||
          job.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
      )
    }

    return filtered
  }

  createJob(jobData: Omit<Job, "id" | "createdAt" | "updatedAt" | "currentWorkers">): Job {
    const newJob: Job = {
      ...jobData,
      id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      currentWorkers: 0,
    }

    this.jobs.unshift(newJob) // Add to beginning for newest first
    this.saveJobs()
    return newJob
  }

  updateJob(id: string, updates: Partial<Job>): Job | null {
    const index = this.jobs.findIndex((job) => job.id === id)
    if (index === -1) return null

    this.jobs[index] = {
      ...this.jobs[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    this.saveJobs()
    return this.jobs[index]
  }

  deleteJob(id: string): boolean {
    const index = this.jobs.findIndex((job) => job.id === id)
    if (index === -1) return false

    this.jobs.splice(index, 1)
    this.saveJobs()
    return true
  }

  getJobStats() {
    const active = this.jobs.filter((job) => job.status === "active").length
    const total = this.jobs.length
    const categories = [...new Set(this.jobs.map((job) => job.category))]

    return {
      activeJobs: active,
      totalJobs: total,
      categories: categories.length,
      avgPay: this.jobs.reduce((sum, job) => sum + job.payAmount, 0) / Math.max(this.jobs.length, 1),
    }
  }

  // Initialize with some sample jobs if none exist
  initializeSampleJobs(): void {
    if (this.jobs.length === 0) {
      const sampleJobs: Omit<Job, "id" | "createdAt" | "updatedAt" | "currentWorkers">[] = [
        {
          title: "Product Feedback Survey - Mobile App",
          description: "Test a new mobile shopping app and provide detailed feedback through a comprehensive survey.",
          fullDescription: `
            <h2>Job Overview</h2>
            <p>We're looking for users to test our new mobile shopping application and provide detailed feedback through surveys.</p>
            <h2>What You'll Do</h2>
            <ul>
              <li>Download and install the test app on your mobile device</li>
              <li>Complete specific shopping tasks within the app</li>
              <li>Fill out a detailed survey about your experience</li>
              <li>Provide feedback on usability, design, and functionality</li>
            </ul>
            <h2>Requirements</h2>
            <ul>
              <li>Smartphone (iOS 12+ or Android 8+)</li>
              <li>Regular online shopping experience</li>
              <li>Ability to provide detailed, honest feedback</li>
            </ul>
          `,
          payRange: "$15-$25",
          requirements: "Smartphone, online shopping experience",
          estimatedTime: "20-30 minutes",
          category: "Surveys & Market Research",
          difficulty: "Beginner",
          popularity: 95,
          featured: true,
          status: "active",
          maxWorkers: 50,
          employerId: "emp_001",
          employerName: "TechCorp Solutions",
          payType: "per-task",
          payAmount: 20,
          instructions: "Download the app, complete the shopping flow, and fill out the survey with honest feedback.",
          tags: ["mobile", "app-testing", "survey", "shopping"],
        },
        {
          title: "AI Chatbot Training - Customer Service",
          description:
            "Help train an AI chatbot by having conversations and rating responses for a customer service application.",
          fullDescription: `
            <h2>Job Overview</h2>
            <p>Train our AI chatbot to provide better customer service by engaging in conversations and providing feedback.</p>
            <h2>Responsibilities</h2>
            <ul>
              <li>Engage in realistic customer service conversations with the AI</li>
              <li>Rate the quality and helpfulness of AI responses</li>
              <li>Provide examples of better responses when needed</li>
              <li>Test various customer scenarios and edge cases</li>
            </ul>
          `,
          payRange: "$18-$22 per hour",
          requirements: "Strong communication skills, customer service experience preferred",
          estimatedTime: "2-4 hours",
          category: "AI & Machine Learning",
          difficulty: "Intermediate",
          popularity: 88,
          featured: true,
          status: "active",
          maxWorkers: 25,
          employerId: "emp_002",
          employerName: "AI Innovations Inc",
          payType: "hourly",
          payAmount: 20,
          instructions:
            "Follow the conversation prompts, rate responses on a 1-5 scale, and provide improvement suggestions.",
          tags: ["ai-training", "chatbot", "customer-service", "conversation"],
        },
      ]

      sampleJobs.forEach((jobData) => this.createJob(jobData))
    }
  }
}

export const jobManager = JobManager.getInstance()

// Custom hook for using jobs in React components
export function useJobs() {
  const [jobs, setJobs] = React.useState<Job[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const unsubscribe = jobManager.subscribe((updatedJobs) => {
      setJobs(updatedJobs)
      setLoading(false)
    })

    // Initialize sample jobs if needed
    jobManager.initializeSampleJobs()

    return unsubscribe
  }, [])

  return { jobs, loading, jobManager }
}

// We need to import React for the hook
import React from "react"
