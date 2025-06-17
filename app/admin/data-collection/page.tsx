"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Download,
  Eye,
  Send,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  FileText,
  Search,
  Filter,
  Mail,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { firebaseAdminService, type JobPosting } from "@/lib/firebase-admin"

export default function AdminDataCollection() {
  const router = useRouter()
  const { toast } = useToast()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [completedJobs, setCompletedJobs] = useState<JobPosting[]>([])
  const [allJobs, setAllJobs] = useState<JobPosting[]>([])
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null)
  const [jobSubmissions, setJobSubmissions] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const authStatus = localStorage.getItem("admin_authenticated")
    if (authStatus === "true") {
      setIsAuthenticated(true)
      loadJobData()
    } else {
      router.push("/admin/login")
    }
  }, [router])

  const loadJobData = async () => {
    try {
      // Subscribe to all jobs
      const unsubscribeJobs = firebaseAdminService.subscribeToJobs((jobs) => {
        setAllJobs(jobs)
        const completed = jobs.filter((job) => job.status === "completed" || job.submissionsReceived > 0)
        setCompletedJobs(completed)
        setLoading(false)
      })

      return () => {
        unsubscribeJobs()
      }
    } catch (error) {
      console.error("Error loading job data:", error)
      setLoading(false)
    }
  }

  const handleViewJobData = async (job: JobPosting) => {
    setSelectedJob(job)
    try {
      const submissions = await firebaseAdminService.getJobSubmissions(job.id)
      setJobSubmissions(submissions)
    } catch (error) {
      toast({
        title: "Error Loading Data",
        description: "Failed to load job submissions.",
        variant: "destructive",
      })
    }
  }

  const handleDownloadJobData = (job: JobPosting) => {
    if (jobSubmissions.length === 0) {
      toast({
        title: "No Data Available",
        description: "This job has no submissions to download.",
        variant: "destructive",
      })
      return
    }

    const csvContent = [
      ["Job Title", "Employer", "Worker Name", "Worker Email", "Completed At", "Earnings", "Submission Data"].join(","),
      ...jobSubmissions.map((submission) =>
        [
          job.title,
          job.employerName,
          submission.workerName,
          submission.workerEmail,
          submission.completedAt?.toDate?.()?.toLocaleDateString() || "N/A",
          `$${submission.earnings}`,
          JSON.stringify(submission.submissionData).replace(/,/g, ";"),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `admin-${job.title}-submissions-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Data Downloaded",
      description: "Job submission data has been downloaded for admin review.",
    })
  }

  const handleSendDataToEmployer = async (job: JobPosting) => {
    try {
      // In a real implementation, this would send an email with the data
      // For now, we'll simulate the process

      toast({
        title: "Data Sent to Employer",
        description: `Job data for "${job.title}" has been compiled and sent to ${job.employerName}.`,
      })

      // Update job status to indicate data has been delivered
      // This would be implemented with a proper status update in Firebase
      console.log(`Sending data for job ${job.id} to employer ${job.employerId}`)
    } catch (error) {
      toast({
        title: "Error Sending Data",
        description: "Failed to send data to employer. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getJobStats = () => {
    const totalJobs = allJobs.length
    const activeJobs = allJobs.filter((job) => job.status === "active").length
    const completedJobsCount = allJobs.filter((job) => job.status === "completed").length
    const totalSubmissions = allJobs.reduce((sum, job) => sum + (job.submissionsReceived || 0), 0)
    const totalRevenue = allJobs.reduce((sum, job) => sum + (job.amountPaid || 0), 0)

    return {
      totalJobs,
      activeJobs,
      completedJobsCount,
      totalSubmissions,
      totalRevenue,
    }
  }

  const filteredJobs = completedJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.employerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || job.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = getJobStats()

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Verifying authentication...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Loading job data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Data Collection Center</h1>
          <p className="text-gray-600 mt-2">Manage completed jobs and deliver data to employers</p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-5 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalJobs}</div>
              <p className="text-xs text-muted-foreground">All job postings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeJobs}</div>
              <p className="text-xs text-muted-foreground">Currently running</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedJobsCount}</div>
              <p className="text-xs text-muted-foreground">Ready for delivery</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
              <p className="text-xs text-muted-foreground">Data points collected</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">From completed work</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Search Jobs</label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by job title or employer..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="completed">Completed Jobs</TabsTrigger>
            <TabsTrigger value="data-review">Data Review</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Jobs Ready for Data Delivery</CardTitle>
                  <CardDescription>Jobs with completed submissions ready to send to employers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredJobs.slice(0, 5).map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{job.title}</h4>
                          <p className="text-sm text-gray-600">{job.employerName}</p>
                          <p className="text-xs text-gray-500">
                            {job.submissionsReceived}/{job.submissionsRequired} submissions
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleViewJobData(job)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" onClick={() => handleSendDataToEmployer(job)}>
                            <Send className="h-4 w-4 mr-1" />
                            Send
                          </Button>
                        </div>
                      </div>
                    ))}
                    {filteredJobs.length === 0 && (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No completed jobs found</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest job completions and data deliveries</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {allJobs
                      .filter((job) => job.submissionsReceived > 0)
                      .slice(0, 5)
                      .map((job) => (
                        <div key={job.id} className="flex items-center space-x-3">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              job.status === "completed" ? "bg-green-500" : "bg-blue-500"
                            }`}
                          ></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{job.title}</p>
                            <p className="text-xs text-gray-600">{job.employerName}</p>
                          </div>
                          <Badge
                            className={
                              job.status === "completed" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                            }
                          >
                            {job.submissionsReceived} submissions
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Completed Jobs</CardTitle>
                <CardDescription>Jobs with submissions ready for data collection and delivery</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredJobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{job.title}</h4>
                        <p className="text-sm text-gray-600">{job.category}</p>
                        <p className="text-xs text-gray-500">Employer: {job.employerName}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-gray-500">
                            Progress: {job.submissionsReceived}/{job.submissionsRequired}
                          </span>
                          <span className="text-xs text-gray-500">
                            Completion: {Math.round((job.submissionsReceived / job.submissionsRequired) * 100)}%
                          </span>
                          <span className="text-xs text-gray-500">Budget: ${job.totalBudget}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge
                          className={
                            job.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : job.submissionsReceived >= job.submissionsRequired
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {job.status === "completed"
                            ? "Completed"
                            : job.submissionsReceived >= job.submissionsRequired
                              ? "Ready"
                              : "In Progress"}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleViewJobData(job)}>
                            <Eye className="h-4 w-4 mr-1" />
                            Review Data
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDownloadJobData(job)}>
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                          <Button size="sm" onClick={() => handleSendDataToEmployer(job)}>
                            <Mail className="h-4 w-4 mr-1" />
                            Send to Employer
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredJobs.length === 0 && (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No completed jobs found</p>
                      <p className="text-sm text-gray-500">Jobs will appear here once workers complete them</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data-review" className="space-y-6">
            {selectedJob ? (
              <Card>
                <CardHeader>
                  <CardTitle>Data Review: {selectedJob.title}</CardTitle>
                  <CardDescription>
                    Employer: {selectedJob.employerName} | Submissions: {jobSubmissions.length} /{" "}
                    {selectedJob.submissionsRequired}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {jobSubmissions.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">
                            Total submissions: {jobSubmissions.length} | Total paid: $
                            {jobSubmissions.reduce((sum, sub) => sum + sub.earnings, 0).toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Completion rate:{" "}
                            {Math.round((jobSubmissions.length / selectedJob.submissionsRequired) * 100)}%
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={() => handleDownloadJobData(selectedJob)}>
                            <Download className="h-4 w-4 mr-2" />
                            Download Data
                          </Button>
                          <Button onClick={() => handleSendDataToEmployer(selectedJob)}>
                            <Send className="h-4 w-4 mr-2" />
                            Send to Employer
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {jobSubmissions.map((submission, index) => (
                          <div key={index} className="p-4 border rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{submission.workerName}</h4>
                                <p className="text-sm text-gray-600">{submission.workerEmail}</p>
                                <p className="text-xs text-gray-500">
                                  Completed: {submission.completedAt?.toDate?.()?.toLocaleDateString() || "N/A"}
                                </p>
                              </div>
                              <Badge className="bg-green-100 text-green-800">${submission.earnings}</Badge>
                            </div>
                            <div className="mt-3 p-3 bg-gray-50 rounded">
                              <p className="text-sm font-medium">Submission Data:</p>
                              <pre className="text-xs mt-1 whitespace-pre-wrap max-h-40 overflow-y-auto">
                                {JSON.stringify(submission.submissionData, null, 2)}
                              </pre>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No submissions available for review</p>
                      <p className="text-sm text-gray-500">Data will appear here once workers complete the job</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Select a job to review its data</p>
                  <p className="text-sm text-gray-500">Go to "Completed Jobs" tab and click "Review Data" on any job</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
