"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Briefcase, Plus, Eye, Download, DollarSign, Users, CheckCircle, AlertCircle, BarChart3 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { firebaseAdminService, type JobPosting, type JobApplication } from "@/lib/firebase-admin"

export default function EmployerDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const { userProfile, loading } = useAuth()
  const [jobs, setJobs] = useState<JobPosting[]>([])
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null)
  const [jobSubmissions, setJobSubmissions] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [isCreatingJob, setIsCreatingJob] = useState(false)

  // Job creation form state
  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    category: "",
    payAmount: "",
    payType: "per-task" as const,
    maxWorkers: "",
    estimatedTime: "",
    requirements: "",
    instructions: "",
    submissionsRequired: "",
    deadline: "",
    featured: false,
    urgent: false,
  })

  useEffect(() => {
    if (!loading && !userProfile) {
      router.push("/login?redirect=/employer/dashboard")
      return
    }

    if (userProfile && userProfile.role !== "employer") {
      toast({
        title: "Access Denied",
        description: "You need employer privileges to access this page.",
        variant: "destructive",
      })
      router.push("/dashboard")
      return
    }

    if (userProfile) {
      loadEmployerData()
    }
  }, [userProfile, loading, router])

  const loadEmployerData = async () => {
    if (!userProfile) return

    try {
      // Load employer's jobs
      const employerJobs = await firebaseAdminService.getEmployerJobs(userProfile.uid)
      setJobs(employerJobs)

      // Subscribe to applications for employer's jobs
      const unsubscribeApplications = firebaseAdminService.subscribeToJobApplications((allApplications) => {
        const employerApplications = allApplications.filter((app) => app.employerId === userProfile.uid)
        setApplications(employerApplications)
      })

      return () => {
        unsubscribeApplications()
      }
    } catch (error) {
      console.error("Error loading employer data:", error)
    }
  }

  const handleCreateJob = async () => {
    if (!userProfile) return

    setIsCreatingJob(true)
    try {
      const jobData = {
        title: jobForm.title,
        description: jobForm.description,
        category: jobForm.category,
        payAmount: Number.parseFloat(jobForm.payAmount),
        payType: jobForm.payType,
        maxWorkers: Number.parseInt(jobForm.maxWorkers),
        estimatedTime: jobForm.estimatedTime,
        requirements: jobForm.requirements,
        instructions: jobForm.instructions,
        submissionsRequired: Number.parseInt(jobForm.submissionsRequired),
        deadline: jobForm.deadline ? new Date(jobForm.deadline) : null,
        featured: jobForm.featured,
        urgent: jobForm.urgent,
        status: "active" as const,
        employerId: userProfile.uid,
        employerName: userProfile.fullName,
        employerEmail: userProfile.email,
        tags: [jobForm.category, jobForm.payType],
        totalBudget: Number.parseFloat(jobForm.payAmount) * Number.parseInt(jobForm.maxWorkers),
      }

      const jobId = await firebaseAdminService.createJob(jobData)

      if (jobId) {
        toast({
          title: "Job Created Successfully",
          description: `Your job "${jobForm.title}" has been posted and is now live.`,
        })

        // Reset form
        setJobForm({
          title: "",
          description: "",
          category: "",
          payAmount: "",
          payType: "per-task",
          maxWorkers: "",
          estimatedTime: "",
          requirements: "",
          instructions: "",
          submissionsRequired: "",
          deadline: "",
          featured: false,
          urgent: false,
        })

        // Reload jobs
        loadEmployerData()
        setActiveTab("jobs")
      } else {
        throw new Error("Failed to create job")
      }
    } catch (error) {
      toast({
        title: "Error Creating Job",
        description: "Failed to create job. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreatingJob(false)
    }
  }

  const handleViewJobData = async (job: JobPosting) => {
    setSelectedJob(job)
    try {
      const submissions = await firebaseAdminService.getJobSubmissions(job.id)
      setJobSubmissions(submissions)
      setActiveTab("data")
    } catch (error) {
      toast({
        title: "Error Loading Data",
        description: "Failed to load job submissions.",
        variant: "destructive",
      })
    }
  }

  const handleDownloadJobData = () => {
    if (!selectedJob || jobSubmissions.length === 0) return

    const csvContent = [
      ["Worker Name", "Worker Email", "Completed At", "Earnings", "Submission Data"].join(","),
      ...jobSubmissions.map((submission) =>
        [
          submission.workerName,
          submission.workerEmail,
          submission.completedAt?.toDate?.()?.toLocaleDateString() || "N/A",
          `$${submission.earnings}`,
          JSON.stringify(submission.submissionData).replace(/,/g, ";"), // Replace commas to avoid CSV issues
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${selectedJob.title}-submissions-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Data Downloaded",
      description: "Job submission data has been downloaded as CSV.",
    })
  }

  const getJobStats = () => {
    const activeJobs = jobs.filter((job) => job.status === "active").length
    const completedJobs = jobs.filter((job) => job.status === "completed").length
    const totalApplications = applications.length
    const completedApplications = applications.filter((app) => app.status === "completed").length
    const totalSpent = jobs.reduce((sum, job) => sum + (job.amountPaid || 0), 0)

    return {
      activeJobs,
      completedJobs,
      totalApplications,
      completedApplications,
      totalSpent,
    }
  }

  const stats = getJobStats()

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading employer dashboard...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your job postings and track submissions</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-5 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeJobs}</div>
            <p className="text-xs text-muted-foreground">Currently posted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedJobs}</div>
            <p className="text-xs text-muted-foreground">Finished projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">Worker applications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Work</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedApplications}</div>
            <p className="text-xs text-muted-foreground">Submissions received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">On completed work</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="create">Create Job</TabsTrigger>
          <TabsTrigger value="jobs">My Jobs</TabsTrigger>
          <TabsTrigger value="data">Job Data</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Jobs</CardTitle>
                <CardDescription>Your latest job postings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobs.slice(0, 5).map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{job.title}</h4>
                        <p className="text-sm text-gray-600">{job.category}</p>
                        <p className="text-xs text-gray-500">
                          {job.submissionsReceived}/{job.submissionsRequired} submissions
                        </p>
                      </div>
                      <Badge
                        className={
                          job.status === "active"
                            ? "bg-green-100 text-green-800"
                            : job.status === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }
                      >
                        {job.status}
                      </Badge>
                    </div>
                  ))}
                  {jobs.length === 0 && (
                    <div className="text-center py-8">
                      <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No jobs posted yet</p>
                      <Button className="mt-4" onClick={() => setActiveTab("create")}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Job
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common employer tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  <Button variant="outline" className="justify-start h-auto p-4" onClick={() => setActiveTab("create")}>
                    <Plus className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Create New Job</div>
                      <div className="text-sm text-gray-600">Post a new task or survey</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto p-4" onClick={() => setActiveTab("jobs")}>
                    <Eye className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">View My Jobs</div>
                      <div className="text-sm text-gray-600">{jobs.length} total jobs</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto p-4" onClick={() => setActiveTab("data")}>
                    <Download className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Download Data</div>
                      <div className="text-sm text-gray-600">Export job submissions</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Job</CardTitle>
              <CardDescription>Post a new task or survey for workers to complete</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Job Title *</label>
                  <Input
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    placeholder="e.g., Product Feedback Survey"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Category *</label>
                  <Select
                    value={jobForm.category}
                    onValueChange={(value) => setJobForm({ ...jobForm, category: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Surveys & Market Research">Surveys & Market Research</SelectItem>
                      <SelectItem value="AI & Machine Learning">AI & Machine Learning</SelectItem>
                      <SelectItem value="Data Entry & Processing">Data Entry & Processing</SelectItem>
                      <SelectItem value="Content Moderation">Content Moderation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Job Description *</label>
                <Textarea
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  placeholder="Describe what workers will be doing..."
                  className="mt-1"
                  rows={4}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Detailed Instructions *</label>
                <Textarea
                  value={jobForm.instructions}
                  onChange={(e) => setJobForm({ ...jobForm, instructions: e.target.value })}
                  placeholder="Provide step-by-step instructions..."
                  className="mt-1"
                  rows={6}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="text-sm font-medium">Payment Type *</label>
                  <Select
                    value={jobForm.payType}
                    onValueChange={(value) => setJobForm({ ...jobForm, payType: value as any })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="per-task">Per Task</SelectItem>
                      <SelectItem value="hourly">Per Hour</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Payment Amount ($) *</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.50"
                    value={jobForm.payAmount}
                    onChange={(e) => setJobForm({ ...jobForm, payAmount: e.target.value })}
                    placeholder="5.00"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Max Workers *</label>
                  <Input
                    type="number"
                    min="1"
                    value={jobForm.maxWorkers}
                    onChange={(e) => setJobForm({ ...jobForm, maxWorkers: e.target.value })}
                    placeholder="100"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Estimated Time *</label>
                  <Input
                    value={jobForm.estimatedTime}
                    onChange={(e) => setJobForm({ ...jobForm, estimatedTime: e.target.value })}
                    placeholder="e.g., 10-15 minutes"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Submissions Required *</label>
                  <Input
                    type="number"
                    min="1"
                    value={jobForm.submissionsRequired}
                    onChange={(e) => setJobForm({ ...jobForm, submissionsRequired: e.target.value })}
                    placeholder="100"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Requirements</label>
                <Textarea
                  value={jobForm.requirements}
                  onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                  placeholder="Any specific requirements or qualifications..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleCreateJob} disabled={isCreatingJob} size="lg">
                  {isCreatingJob ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Creating Job...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Job
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Jobs</CardTitle>
              <CardDescription>Manage your job postings and track progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{job.title}</h4>
                      <p className="text-sm text-gray-600">{job.category}</p>
                      <p className="text-xs text-gray-500">
                        Created: {job.createdAt?.toDate?.()?.toLocaleDateString() || "N/A"}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-500">
                          Progress: {job.submissionsReceived}/{job.submissionsRequired}
                        </span>
                        <span className="text-xs text-gray-500">Budget: ${job.totalBudget}</span>
                        <span className="text-xs text-gray-500">Workers: {job.currentWorkers}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge
                        className={
                          job.status === "active"
                            ? "bg-green-100 text-green-800"
                            : job.status === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }
                      >
                        {job.status}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleViewJobData(job)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View Data
                        </Button>
                        {job.submissionsReceived > 0 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedJob(job)
                              handleDownloadJobData()
                            }}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {jobs.length === 0 && (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No jobs posted yet</p>
                    <Button className="mt-4" onClick={() => setActiveTab("create")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Job
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          {selectedJob ? (
            <Card>
              <CardHeader>
                <CardTitle>Job Data: {selectedJob.title}</CardTitle>
                <CardDescription>
                  Submissions received: {jobSubmissions.length} / {selectedJob.submissionsRequired}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {jobSubmissions.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">
                        Total submissions: {jobSubmissions.length} | Total paid: $
                        {jobSubmissions.reduce((sum, sub) => sum + sub.earnings, 0).toFixed(2)}
                      </p>
                      <Button onClick={handleDownloadJobData}>
                        <Download className="h-4 w-4 mr-2" />
                        Download CSV
                      </Button>
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
                            <pre className="text-xs mt-1 whitespace-pre-wrap">
                              {JSON.stringify(submission.submissionData, null, 2)}
                            </pre>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No submissions received yet</p>
                    <p className="text-sm text-gray-500">Data will appear here once workers complete your job</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Select a job to view its data</p>
                <p className="text-sm text-gray-500">Go to "My Jobs" tab and click "View Data" on any job</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
