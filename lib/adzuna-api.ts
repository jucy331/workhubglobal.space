// Types for Adzuna API responses
export interface AdzunaJob {
  id: string
  title: string
  description: string
  created: string
  company: { display_name: string }
  location: { display_name: string; area: string[] }
  category: { label: string; tag: string }
  salary_min: number
  salary_max: number
  salary_is_predicted: boolean
  contract_type: string
  contract_time: string
  redirect_url: string
}

export interface AdzunaResponse {
  results: AdzunaJob[]
  count: number
  __CLASS__: string
  mean: number
}

// Convert Adzuna job types to our app's job types
export function mapAdzunaJobType(contractTime?: string, contractType?: string): string[] {
  const types: string[] = []

  if (contractTime === "part_time") {
    types.push("part-time")
  } else if (contractTime === "full_time") {
    types.push("full-time")
  }

  if (contractType === "contract" || contractType === "temporary") {
    types.push("freelance")
  }

  // Add remote if location contains "remote" or "anywhere"
  types.push("remote")

  return types.length > 0 ? types : ["remote"]
}

// Map Adzuna category to our app's categories
export function mapAdzunaCategory(category?: string): string {
  const categoryMap: Record<string, string> = {
    "it-jobs": "development",
    "engineering-jobs": "development",
    "scientific-jobs": "development",
    "pr-advertising-marketing-jobs": "marketing",
    "accounting-finance-jobs": "admin",
    "teaching-jobs": "education",
    "healthcare-nursing-jobs": "other",
    "hospitality-catering-jobs": "other",
    "sales-jobs": "other",
    "customer-services-jobs": "customer-support",
    "creative-design-jobs": "design",
    "hr-jobs": "admin",
    "charity-voluntary-jobs": "other",
    "social-work-jobs": "other",
    "trade-construction-jobs": "other",
    "retail-jobs": "other",
    "legal-jobs": "other",
    "graduate-jobs": "other",
    "logistics-warehouse-jobs": "other",
    "domestic-help-cleaning-jobs": "other",
    "manufacturing-jobs": "other",
    "travel-jobs": "other",
    "consultancy-jobs": "other",
    "energy-oil-gas-jobs": "other",
    "property-jobs": "other",
    apprenticeships: "other",
    "part-time-jobs": "other",
  }

  if (!category) return "other"
  return categoryMap[category] || "other"
}

// Format salary range
export function formatSalary(min?: number, max?: number, isPredicted = false): string {
  if (!min && !max) return "Competitive"

  const formatValue = (value: number) => {
    if (value >= 1000) {
      return `$${Math.round(value / 1000)}K`
    }
    return `$${value}`
  }

  if (min && max && min !== max) {
    return `${formatValue(min)} - ${formatValue(max)}${isPredicted ? " (est.)" : ""}`
  } else if (min) {
    return `${formatValue(min)}${isPredicted ? " (est.)" : ""}`
  } else if (max) {
    return `Up to ${formatValue(max)}${isPredicted ? " (est.)" : ""}`
  }

  return "Competitive"
}

// Fetch jobs from Adzuna API
export async function fetchJobs(params: {
  what?: string
  where?: string
  category?: string
  page?: number
  results_per_page?: number
}) {
  try {
    const appId = process.env.ADZUNA_APP_ID
    const apiKey = process.env.ADZUNA_API_KEY

    if (!appId || !apiKey) {
      throw new Error("Adzuna API credentials not found")
    }

    const queryParams = new URLSearchParams({
      app_id: appId,
      app_key: apiKey,
      results_per_page: (params.results_per_page || 10).toString(),
      page: (params.page || 1).toString(),
      ...(params.what && { what: params.what }),
      ...(params.where && { where: params.where }),
      ...(params.category && { category: params.category }),
      content_type: "application/json",
    })

    // Default to US jobs, but this could be made configurable
    const response = await fetch(`https://api.adzuna.com/v1/api/jobs/us/search/1?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store", // Disable caching to always get fresh data
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Adzuna API error (${response.status}):`, errorText)
      throw new Error(`Adzuna API error: ${response.status}`)
    }

    const data: AdzunaResponse = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching jobs from Adzuna:", error)
    throw error
  }
}

// Convert Adzuna job to our app's job format
export function convertAdzunaJob(adzunaJob: AdzunaJob) {
  return {
    id: adzunaJob.id,
    title: adzunaJob.title,
    company: adzunaJob.company?.display_name || "Unknown Company",
    location: adzunaJob.location?.display_name || "Remote",
    salary: formatSalary(adzunaJob.salary_min, adzunaJob.salary_max, adzunaJob.salary_is_predicted),
    description: adzunaJob.description,
    requirements: [],
    type: mapAdzunaJobType(adzunaJob.contract_time, adzunaJob.contract_type),
    category: mapAdzunaCategory(adzunaJob.category?.tag),
    postedAt: adzunaJob.created,
    logo: "/placeholder.svg?height=80&width=80",
    url: adzunaJob.redirect_url,
  }
}
