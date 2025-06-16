"use client"

import {
  ArrowRight,
  Clock,
  DollarSign,
  FileText,
  Mail,
  MapPin,
  Star,
  TrendingUp,
  Users,
  Zap,
  Briefcase,
  CheckCircle,
  Gift,
  RefreshCw,
  AlertCircle,
  Lock,
  Eye,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useJobs, type Job } from "@/lib/job-manager"

export default function JobsPage() {
  const { userProfile, loading: authLoading, isAccountActivated, activateAccount } = useAuth()
  const { jobs, loading: jobsLoading, jobManager } = useJobs()
  const { toast } = useToast()
  const router = useRouter()
  const [activationDialogOpen, setActivationDialogOpen] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState("all")
  const [isInitialized, setIsInitialized] = useState(false)
  const [surveyCompleted, setSurveyCompleted] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("")
  const [refreshing, setRefreshing] = useState(false)

  // Memoize expensive computations
  const { jobsByCategory, categories, featuredJobs, filteredJobs } = useMemo(() => {
    let filtered = jobs

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower) ||
          job.tags?.some((tag) => tag.toLowerCase().includes(searchLower)),
      )
    }

    // Apply difficulty filter
    if (difficultyFilter) {
      filtered = filtered.filter((job) => job.difficulty === difficultyFilter)
    }

    // Group by category
    const jobsByCategory: Record<string, Job[]> = {}
    filtered.forEach((job) => {
      if (!jobsByCategory[job.category]) {
        jobsByCategory[job.category] = []
      }
      jobsByCategory[job.category].push(job)
    })

    const categories = Object.keys(jobsByCategory)
    const featuredJobs = filtered.filter((job) => job.featured)

    return { jobsByCategory, categories, featuredJobs, filteredJobs: filtered }
  }, [jobs, searchTerm, difficultyFilter])

  useEffect(() => {
    // Check survey completion status
    const surveyStatus = localStorage.getItem("welcome_survey_completed")
    if (surveyStatus === "true") {
      setSurveyCompleted(true)
    }

    // Check if returning from payment
    const urlParams = new URLSearchParams(window.location.search)
    const paymentStatus = urlParams.get("payment_status")

    if (paymentStatus === "success") {
      // Activate the account
      activateAccount()
        .then(() => {
          const pendingJobId = sessionStorage.getItem("pending_job_id")
          if (pendingJobId) {
            sessionStorage.removeItem("pending_job_id")
            router.push(`/job/${pendingJobId}`)
          }

          toast({
            title: "Account Activated! 🎉",
            description: "Your account has been successfully activated. You now have access to all job details.",
          })
        })
        .catch((error) => {
          console.error("Error activating account:", error)
          toast({
            title: "Activation Error",
            description: "There was an issue activating your account. Please contact support.",
            variant: "destructive",
          })
        })
    }

    setIsInitialized(true)
  }, [toast, router, activateAccount])

  const handleViewDetails = (jobId: string) => {
    if (isAccountActivated()) {
      router.push(`/job/${jobId}`)
    } else {
      setSelectedJobId(jobId)
      setActivationDialogOpen(true)
    }
  }

  const handleStartSurvey = () => {
    router.push("/survey/welcome")
  }

  const handlePaymentRedirect = () => {
    if (selectedJobId) {
      sessionStorage.setItem("pending_job_id", selectedJobId)
    }
    console.log("Redirecting to PayPal payment page...")
    window.location.href = "https://www.paypal.com/ncp/payment/HX5S7CVY9BQQ2"
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate refresh delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setRefreshing(false)
    toast({
      title: "Jobs Refreshed",
      description: "Job listings have been updated with the latest opportunities.",
    })
  }

  // Show loading skeleton while auth is loading or not initialized
  if (authLoading || !isInitialized) {
    return <JobsPageSkeleton />
  }

  if (!userProfile) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="text-gray-600 mb-6">You need to be signed in to browse job opportunities.</p>
          <div className="space-y-4">
            <Link href="/login">
              <Button size="lg" className="mr-4">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline">
                Create Account
              </Button>
            </Link>
          </div>
          <div className="mt-8 text-sm text-gray-500">
            <p>Join thousands of people earning money from home with legitimate online opportunities.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30"></div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center">
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Welcome back, {userProfile.fullName}! Browse legitimate online opportunities with flexible hours and
              competitive pay.
            </p>

            {/* Show activation status */}
            {isAccountActivated() ? (
              <div className="mb-6">
                <Badge className="bg-green-500 text-white px-4 py-2 text-sm">✓ Account Activated - Full Access</Badge>
              </div>
            ) : (
              <div className="mb-6">
                <Badge className="bg-yellow-500 text-white px-4 py-2 text-sm">
                  👁️ Preview Mode - Activate for Full Access
                </Badge>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 text-lg shadow-xl"
                onClick={() => document.getElementById("jobs-section")?.scrollIntoView({ behavior: "smooth" })}
              >
                Browse Jobs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-4 text-lg"
                >
                  View Dashboard
                </Button>
              </Link>
            </div>

            {/* Dynamic Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{jobs.length}</div>
                <div className="text-blue-200">Available Jobs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{categories.length}</div>
                <div className="text-blue-200">Job Categories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">4.9★</div>
                <div className="text-blue-200">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Survey Section - Only show if not activated */}
      {!surveyCompleted && !isAccountActivated() && (
        <section className="py-8 px-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-white rounded-xl shadow-lg border border-green-200 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                      <Gift className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Welcome Survey - Earn $1.50!</h3>
                      <p className="text-green-100">
                        Help us understand your preferences • 2 minutes • One-time opportunity
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-400 text-yellow-900 font-semibold">Limited Time</Badge>
                </div>
              </div>

              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div>
                    <h4 className="font-semibold text-lg mb-3 text-gray-900">Quick Survey About:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Your experience with online work platforms
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Types of jobs you're interested in
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Your availability and preferences
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Platform features you'd like to see
                      </li>
                    </ul>
                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-800">
                        <strong>Note:</strong> Minimum withdrawal amount is $25. Your survey earnings will be added to
                        your account balance.
                      </p>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="mb-4">
                      <div className="text-3xl font-bold text-green-600 mb-2">$1.50</div>
                      <div className="text-sm text-gray-600">Instant payment upon completion</div>
                    </div>
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3"
                      onClick={handleStartSurvey}
                    >
                      Start Survey
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">Takes approximately 2 minutes to complete</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Search and Filter Section */}
      <section className="py-8 px-4 bg-white border-b">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search jobs by title, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-4 items-center">
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      {featuredJobs.length > 0 && (
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Featured Opportunities</h2>
              <p className="text-lg text-gray-600">High-demand jobs with excellent earning potential</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {featuredJobs.map((job) => (
                <JobCard key={job.id} job={job} onViewDetails={handleViewDetails} isActivated={isAccountActivated()} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Jobs Section */}
      <section id="jobs-section" className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              {filteredJobs.length > 0 ? "All Available Jobs" : "Job Queue"}
            </h2>
            <p className="text-lg text-gray-600">
              {filteredJobs.length > 0
                ? `${filteredJobs.length} opportunities available now`
                : "New jobs are posted regularly. Check back soon!"}
            </p>
            {!isAccountActivated() && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-2xl mx-auto">
                <div className="flex items-center justify-center space-x-2">
                  <Eye className="h-5 w-5 text-yellow-600" />
                  <p className="text-yellow-800 font-medium">
                    You're in preview mode. Activate your account to apply for jobs and access full details.
                  </p>
                </div>
              </div>
            )}
          </div>

          {jobsLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <JobCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Jobs Available Right Now</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                You're in the queue! New survey and AI training jobs are posted regularly.
                {searchTerm || difficultyFilter ? " Try adjusting your filters or " : " "}
                Check back in a few minutes for fresh opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={handleRefresh} disabled={refreshing}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                  Check for New Jobs
                </Button>
                <Link href="/create-job">
                  <Button variant="outline">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Post a Job
                  </Button>
                </Link>
              </div>
              {(searchTerm || difficultyFilter) && (
                <div className="mt-6">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSearchTerm("")
                      setDifficultyFilter("")
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveCategory}>
              <TabsList className="flex flex-wrap justify-center mb-8 h-auto bg-white shadow-sm">
                <TabsTrigger
                  value="all"
                  className="mb-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  All Jobs ({filteredJobs.length})
                </TabsTrigger>
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="mb-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    {category} ({jobsByCategory[category]?.length || 0})
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="all" className="space-y-8">
                {Object.entries(jobsByCategory).map(([category, categoryJobs]) => (
                  <div key={category} className="mb-12">
                    <h3 className="text-2xl font-semibold mb-6 text-gray-900 flex items-center">
                      {category}
                      <Badge variant="secondary" className="ml-3">
                        {categoryJobs.length} jobs
                      </Badge>
                    </h3>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {categoryJobs.map((job) => (
                        <JobCard
                          key={job.id}
                          job={job}
                          onViewDetails={handleViewDetails}
                          isActivated={isAccountActivated()}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </TabsContent>

              {categories.map((category) => (
                <TabsContent key={category} value={category} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {jobsByCategory[category]?.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        onViewDetails={handleViewDetails}
                        isActivated={isAccountActivated()}
                      />
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </section>

      {/* Success Tips Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Tips for Success</h2>
            <p className="text-lg text-gray-600">Maximize your earning potential with these proven strategies</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Complete Your Profile</h3>
              <p className="text-gray-600">
                Fill out your profile completely with accurate information and relevant skills to increase your chances
                of being selected for premium opportunities.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Meet Deadlines</h3>
              <p className="text-gray-600">
                Always submit your work on time to build a positive reputation and receive more high-paying
                opportunities from our premium clients.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibent text-lg mb-2">Quality Over Quantity</h3>
              <p className="text-gray-600">
                Focus on delivering high-quality work rather than rushing through tasks. Quality work leads to better
                ratings and higher-paying assignments.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Set a Schedule</h3>
              <p className="text-gray-600">
                Treat online work like a regular job by setting consistent hours. This helps maximize productivity and
                creates a sustainable income stream.
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Track Your Income</h3>
              <p className="text-gray-600">
                Keep detailed records of all earnings for tax purposes. You'll be classified as an independent
                contractor, so proper documentation is essential.
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl border border-indigo-200">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Join the Community</h3>
              <p className="text-gray-600">
                Connect with other remote workers in our community forums. Share tips, get support, and learn about new
                opportunities from experienced members.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">WorkHub Global</span>
              </div>
              <p className="text-gray-300 mb-4">
                Find legitimate online opportunities that match your skills and schedule. Join thousands earning from
                home.
              </p>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-gray-300">4.9/5 from 15,000+ reviews</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.slice(0, 6).map((category) => (
                  <li key={category}>
                    <button
                      onClick={() => setActiveCategory(category)}
                      className="text-gray-300 hover:text-white transition-colors text-left"
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/faq" className="text-gray-300 hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-gray-300 hover:text-white transition-colors">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <a
                    href="mailto:support@workhubglobal.com"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    support@workhubglobal.com
                  </a>
                </li>
                <li className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-gray-300">Remote Worldwide</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} WorkHub Global Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Account Activation Dialog - Only show if NOT activated */}
      {!isAccountActivated() && (
        <Dialog open={activationDialogOpen} onOpenChange={setActivationDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Lock className="h-5 w-5 text-blue-600 mr-2" />
                Account Activation Required
              </DialogTitle>
              <DialogDescription>
                To view job details and apply for positions, a one-time account activation fee of $5.00 is required.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col space-y-4 py-4">
              <div className="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-4 border border-blue-200">
                <h3 className="font-medium mb-3 text-gray-900">✨ Benefits of Account Activation:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Access to all job details and application forms</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Apply to unlimited job opportunities</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Receive job alerts for new opportunities</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Track your applications and earnings</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Priority support and faster payments</span>
                  </li>
                </ul>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">One-time payment: $5.00</div>
                <div className="text-sm text-gray-600">Secure payment via PayPal</div>
                <div className="text-xs text-green-600 mt-1 font-medium">
                  ✓ Never asked for payment again after activation
                </div>
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
              <Button variant="outline" onClick={() => setActivationDialogOpen(false)}>
                Maybe Later
              </Button>
              <Button
                onClick={() => {
                  console.log("Activate button clicked")
                  handlePaymentRedirect()
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Activate Account Now
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Loading skeleton component
function JobsPageSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <Skeleton className="h-16 w-3/4 mx-auto mb-6 bg-white/20" />
            <Skeleton className="h-8 w-2/3 mx-auto mb-8 bg-white/20" />
            <div className="flex gap-4 justify-center mb-12">
              <Skeleton className="h-12 w-32 bg-white/20" />
              <Skeleton className="h-12 w-32 bg-white/20" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center">
                  <Skeleton className="h-8 w-20 mx-auto mb-2 bg-white/20" />
                  <Skeleton className="h-4 w-24 mx-auto bg-white/20" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Jobs Skeleton */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function JobCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border p-6">
      <Skeleton className="h-6 w-3/4 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3 mb-4" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <Skeleton className="h-10 w-full mt-4" />
    </div>
  )
}

interface JobCardProps {
  job: Job
  onViewDetails: (jobId: string) => void
  isActivated: boolean
}

function JobCard({ job, onViewDetails, isActivated }: JobCardProps) {
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

  const formatPayRange = (job: Job) => {
    if (job.payType === "hourly") {
      return `$${job.payAmount}/hour`
    } else if (job.payType === "per-task") {
      return `$${job.payAmount}/task`
    } else {
      return `$${job.payAmount} fixed`
    }
  }

  return (
    <div
      className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white rounded-lg border p-6 ${job.featured ? "ring-2 ring-blue-500 shadow-lg" : ""}`}
    >
      <div className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="text-lg font-semibold group-hover:text-blue-600 transition-colors">
              {job.title}
              {job.featured && (
                <Badge className="ml-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">Featured</Badge>
              )}
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Badge className={`text-xs ${getDifficultyColor(job.difficulty)}`}>{job.difficulty}</Badge>
              <div className="flex items-center text-sm text-gray-600">
                <Star className="h-3 w-3 text-yellow-500 mr-1" />
                {job.popularity}% match
              </div>
              <div className="text-xs text-gray-500">
                {job.currentWorkers}/{job.maxWorkers} workers
              </div>
            </div>
          </div>
          {!isActivated && (
            <div className="flex items-center">
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
          )}
        </div>
        <div className="mt-3 text-gray-600 line-clamp-2">{job.description}</div>
      </div>
      <div className="pb-4">
        <div className="grid gap-3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600 flex-shrink-0" />
            <div>
              <div className="font-medium text-sm text-gray-900">{formatPayRange(job)}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600 flex-shrink-0" />
            <div>
              <div className="text-sm text-gray-600">{job.estimatedTime}</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <FileText className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm text-gray-600 line-clamp-2">{job.requirements}</div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Button
          className={`w-full shadow-lg group-hover:shadow-xl transition-all ${
            isActivated
              ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
          }`}
          onClick={() => onViewDetails(job.id)}
        >
          {isActivated ? (
            <>
              View Details & Apply
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Activate to View Details
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
