import { type NextRequest, NextResponse } from "next/server"
import { jobManager } from "@/lib/job-manager"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const difficulty = searchParams.get("difficulty")

    let jobs = jobManager.getAllJobs()

    if (category && category !== "all") {
      jobs = jobs.filter((job) => job.category === category)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      jobs = jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower) ||
          job.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
      )
    }

    if (difficulty) {
      jobs = jobs.filter((job) => job.difficulty === difficulty)
    }

    return NextResponse.json({ success: true, jobs })
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch jobs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const jobData = await request.json()

    // Validate required fields
    const requiredFields = ["title", "description", "payAmount", "category", "difficulty"]
    for (const field of requiredFields) {
      if (!jobData[field]) {
        return NextResponse.json({ success: false, error: `${field} is required` }, { status: 400 })
      }
    }

    const newJob = jobManager.createJob(jobData)
    return NextResponse.json({ success: true, job: newJob })
  } catch (error) {
    console.error("Error creating job:", error)
    return NextResponse.json({ success: false, error: "Failed to create job" }, { status: 500 })
  }
}
