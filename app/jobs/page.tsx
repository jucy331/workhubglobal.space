"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import JobCard from "@/components/job-card"
import FilterBar from "@/components/filter-bar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, AlertCircle, Loader2 } from "lucide-react"
import { getJobs } from "@/app/actions/job-actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const JOBS_PER_PAGE = 9 // Increased from 6 to show more jobs per page

export default function JobsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [jobs, setJobs] = useState<any[]>([])
  const [totalJobs, setTotalJobs] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUsingFallback, setIsUsingFallback] = useState(false)

  // Get the current page from URL params or default to 1
  useEffect(() => {
    const page = Number.parseInt(searchParams.get("page") || "1", 10)
    setCurrentPage(page)
  }, [searchParams])

  // Fetch jobs based on search params
  useEffect(() => {
    const fetchJobsData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Get filter values from search params
        const search = searchParams.get("search") || undefined
        const category = searchParams.get("category") as string | undefined
        const types = searchParams.getAll("type") as string[] | undefined

        const result = await getJobs({
          search,
          category,
          types,
          page: currentPage,
          resultsPerPage: JOBS_PER_PAGE,
        })

        if (!result.success) {
          setIsUsingFallback(true)
          if (result.error) {
            setError(result.error)
          }
        } else {
          setIsUsingFallback(false)
        }

        setJobs(result.jobs)
        setTotalJobs(result.totalJobs)
        setTotalPages(Math.ceil(result.totalJobs / JOBS_PER_PAGE))
      } catch (err) {
        console.error("Error fetching jobs:", err)
        setError("An unexpected error occurred while fetching jobs")
        setIsUsingFallback(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobsData()
  }, [searchParams, currentPage])

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return

    // Update URL with new page
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`/jobs?${params.toString()}`)
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages is less than or equal to maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show pages around current page
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
      let endPage = startPage + maxPagesToShow - 1

      if (endPage > totalPages) {
        endPage = totalPages
        startPage = Math.max(1, endPage - maxPagesToShow + 1)
      }

      // Always show first page
      if (startPage > 1) {
        pages.push(1)
        if (startPage > 2) {
          pages.push("ellipsis-start")
        }
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i)
        }
      }

      // Always show last page
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push("ellipsis-end")
        }
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Jobs</h1>
        <p className="text-gray-600">Find your perfect remote, freelance, or online job from our curated listings</p>
      </div>

      <div className="mb-6">
        <FilterBar />
      </div>

      {isUsingFallback && (
        <Alert variant="warning" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Using Fallback Data</AlertTitle>
          <AlertDescription>
            We're currently showing local job listings. Live job data will be available soon.
          </AlertDescription>
        </Alert>
      )}

      {error && !isUsingFallback && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4">Loading jobs...</p>
        </div>
      ) : (
        <>
          <div className="text-sm text-gray-500 mb-4">
            {totalJobs} {totalJobs === 1 ? "job" : "jobs"} found
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.length > 0 ? (
              jobs.map((job) => <JobCard key={job.id} job={job} />)
            ) : (
              <div className="col-span-3 text-center py-12">
                <h3 className="text-lg font-medium mb-2">No jobs found</h3>
                <p className="text-gray-600">Try adjusting your search filters</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {jobs.length > 0 && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {getPageNumbers().map((page, index) => {
                  if (page === "ellipsis-start" || page === "ellipsis-end") {
                    return (
                      <span key={`ellipsis-${index}`} className="px-3 py-2">
                        ...
                      </span>
                    )
                  }
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page as number)}
                      className="w-10"
                    >
                      {page}
                    </Button>
                  )
                })}

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
