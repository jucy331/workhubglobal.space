import { type NextRequest, NextResponse } from "next/server"
import { jobManager } from "@/lib/job-manager"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const job = jobManager.getJobById(params.id)

    if (!job) {
      return NextResponse.json({ success: false, error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, job })
  } catch (error) {
    console.error("Error fetching job:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch job" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updateData = await request.json()
    const updatedJob = jobManager.updateJob(params.id, updateData)

    if (!updatedJob) {
      return NextResponse.json({ success: false, error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, job: updatedJob })
  } catch (error) {
    console.error("Error updating job:", error)
    return NextResponse.json({ success: false, error: "Failed to update job" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = jobManager.deleteJob(params.id)

    if (!success) {
      return NextResponse.json({ success: false, error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting job:", error)
    return NextResponse.json({ success: false, error: "Failed to delete job" }, { status: 500 })
  }
}
