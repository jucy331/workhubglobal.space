"use server"

import { fetchJobs, convertAdzunaJob } from "@/lib/adzuna-api"
import { jobs as fallbackJobs } from "@/lib/jobs"

export async function getJobs(params: {
  search?: string
  category?: string
  types?: string[]
  page?: number
  resultsPerPage?: number
}) {
  try {
    // Map our app's parameters to Adzuna parameters
    const adzunaParams: any = {
      what: params.search,
      page: params.page || 1,
      results_per_page: params.resultsPerPage || 10,
    }

    // Map category if provided
    if (params.category) {
      // This is a simplified mapping - you might want to expand this
      const categoryMap: Record<string, string> = {
        writing: "pr-advertising-marketing-jobs",
        admin: "accounting-finance-jobs",
        design: "creative-design-jobs",
        development: "it-jobs",
        "customer-support": "customer-services-jobs",
        marketing: "pr-advertising-marketing-jobs",
        education: "teaching-jobs",
      }

      adzunaParams.category = categoryMap[params.category] || undefined
    }

    // Fetch jobs from Adzuna API
    const response = await fetchJobs(adzunaParams)

    // Convert Adzuna jobs to our app's format
    const jobs = response.results.map(convertAdzunaJob)

    return {
      jobs,
      totalJobs: response.count,
      success: true,
    }
  } catch (error) {
    console.error("Error fetching jobs:", error)

    // Filter fallback jobs to match search criteria if provided
    let filteredJobs = [...fallbackJobs]

    if (params.search) {
      const searchLower = params.search.toLowerCase()
      filteredJobs = filteredJobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchLower) ||
          job.company.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower),
      )
    }

    if (params.category) {
      filteredJobs = filteredJobs.filter((job) => job.category === params.category)
    }

    if (params.types && params.types.length > 0) {
      filteredJobs = filteredJobs.filter((job) => params.types!.some((type) => job.type.includes(type)))
    }

    // Sort by date (newest first)
    filteredJobs.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime())

    // Paginate
    const startIndex = ((params.page || 1) - 1) * (params.resultsPerPage || 10)
    const paginatedJobs = filteredJobs.slice(startIndex, startIndex + (params.resultsPerPage || 10))

    return {
      jobs: paginatedJobs,
      totalJobs: filteredJobs.length,
      success: false,
      error: "Failed to fetch jobs from Adzuna API. Using fallback data.",
    }
  }
}

export async function getJobById(id: string) {
  try {
    // For a real implementation, you would fetch the specific job by ID
    // However, Adzuna doesn't have a direct endpoint for this
    // So we'll simulate it by searching for the job ID

    // Try to find the job in our fallback data first (for demo purposes)
    const fallbackJob = fallbackJobs.find((job) => job.id === id)
    if (fallbackJob) {
      return {
        job: fallbackJob,
        success: true,
      }
    }

    // If it's an Adzuna ID (which would be different format)
    // We would need to implement a different approach
    // This is a placeholder for now
    return {
      job: null,
      success: false,
      error: "Job not found",
    }
  } catch (error) {
    console.error("Error fetching job by ID:", error)
    return {
      job: null,
      success: false,
      error: "Failed to fetch job details",
    }
  }
}
