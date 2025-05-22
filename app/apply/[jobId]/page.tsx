"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Loader2, Upload } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getJobById } from "@/app/actions/job-actions"
import { useAuth } from "@/contexts/auth-context"
import { applyForJob } from "@/lib/job-applications"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "@/lib/firebase"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import ProtectedRoute from "@/components/protected-route"

export default function ApplyPage() {
  const params = useParams()
  const router = useRouter()
  const { user, userProfile } = useAuth()
  const [job, setJob] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [redirecting, setRedirecting] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
  })
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeFileName, setResumeFileName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    // Pre-fill form with user data if available
    if (userProfile) {
      setFormData((prev) => ({
        ...prev,
        fullName: userProfile.fullName || "",
        email: userProfile.email || "",
      }))
    }
  }, [userProfile])

  useEffect(() => {
    const fetchJob = async () => {
      setIsLoading(true)
      try {
        const result = await getJobById(params.jobId as string)

        if (result.success && result.job) {
          setJob(result.job)
        } else {
          setError(result.error || "Job not found")
          // If job has a URL, it might be an external Adzuna job
          if (params.jobId && params.jobId.toString().startsWith("http")) {
            window.location.href = params.jobId.toString()
            return
          }
        }
      } catch (err) {
        console.error("Error fetching job:", err)
        setError("Failed to load job details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchJob()
  }, [params.jobId, router])

  useEffect(() => {
    if (job?.url) {
      setRedirecting(true)
      window.location.href = job.url
    }
  }, [job?.url])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setResumeFile(file)
      setResumeFileName(file.name)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !userProfile || !job) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      let resumeUrl = ""

      // Upload resume if provided
      if (resumeFile) {
        const storageRef = ref(storage, `resumes/${user.uid}/${Date.now()}-${resumeFile.name}`)
        await uploadBytes(storageRef, resumeFile)
        resumeUrl = await getDownloadURL(storageRef)
      }

      // Submit application
      const result = await applyForJob({
        userId: user.uid,
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        coverLetter: formData.coverLetter,
        resumeUrl,
      })

      if (result.success) {
        setSubmitSuccess(true)

        // Redirect to dashboard after a delay
        setTimeout(() => {
          router.push("/dashboard?tab=applications")
        }, 3000)
      } else {
        setSubmitError(result.error || "Failed to submit application")
      }
    } catch (error) {
      console.error("Error submitting application:", error)
      setSubmitError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Link href="/jobs" className="text-primary hover:underline mb-4 inline-block">
            &larr; Back to Jobs
          </Link>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800 mb-2">Job Not Found</h3>
                <p className="text-gray-700 mb-4">
                  {error ||
                    "The job you're looking for could not be found. It may have been removed or is no longer available."}
                </p>
                <Button asChild>
                  <Link href="/jobs">Browse Other Jobs</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If the job has a URL, it's an external job listing
  if (redirecting) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div>Redirecting to external job listing...</div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/jobs" className="text-primary hover:underline mb-4 inline-block">
              &larr; Back to Jobs
            </Link>

            <div className="flex items-start gap-6">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border">
                <Image src={job.logo || "/placeholder.svg"} alt={`${job.company} logo`} fill className="object-cover" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <span>{job.company}</span>
                  <span>•</span>
                  <span>{job.location}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {job.type.map((type: string) => (
                    <Badge key={type} variant="secondary" className="capitalize">
                      {type}
                    </Badge>
                  ))}
                  <Badge variant="outline" className="capitalize">
                    {job.category}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">Job Description</h2>
                <p className="text-gray-700">{job.description}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Requirements</h2>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  {job.requirements.map((req: string, index: number) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>

              {!user ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-blue-800 mb-2">Login Required</h3>
                      <p className="text-gray-700 mb-4">Please log in or create an account to apply for this job.</p>
                      <div className="flex gap-3">
                        <Button asChild>
                          <Link href={`/login?redirect=${encodeURIComponent(`/apply/${job.id}`)}`}>Log In</Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link href="/create-account">Create Account</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : !userProfile?.isActivated ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-red-800 mb-2">Account Activation Required</h3>
                      <p className="text-gray-700 mb-4">
                        🚫 To apply for jobs, please activate your account for a one-time fee of $5. Once your payment
                        is verified, you'll gain full access to the application system.
                      </p>
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Benefits of Account Activation:</h4>
                        <ul className="list-disc pl-5 text-sm text-gray-700 mb-2">
                          <li>Access to all job details and application forms</li>
                          <li>Apply to unlimited job opportunities</li>
                          <li>Receive job alerts for new opportunities</li>
                          <li>Track your applications and earnings</li>
                        </ul>
                        <div className="text-center font-medium">One-time payment: $5.00</div>
                      </div>
                      <form
                        action="https://www.paypal.com/ncp/payment/8M4GB5JBDTP9U"
                        method="post"
                        target="_blank"
                        style={{
                          display: "inline-grid",
                          justifyItems: "center",
                          alignContent: "start",
                          gap: "0.5rem",
                          marginTop: "1rem"
                        }}
                      >
                        <input
                          className="pp-8M4GB5JBDTP9U"
                          type="submit"
                          value="Activate Account ($5.00)"
                          style={{
                            textAlign: "center",
                            border: "none",
                            borderRadius: "0.25rem",
                            minWidth: "11.625rem",
                            padding: "0 2rem",
                            height: "2.625rem",
                            fontWeight: "bold",
                            backgroundColor: "#FFD140",
                            color: "#000000",
                            fontFamily: '"Helvetica Neue",Arial,sans-serif',
                            fontSize: "1rem",
                            lineHeight: "1.25rem",
                            cursor: "pointer",
                          }}
                        />
                        <img src="https://www.paypalobjects.com/images/Debit_Credit.svg" alt="cards" />
                        <section style={{ fontSize: "0.75rem" }}>
                          Powered by{" "}
                          <img
                            src="https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-wordmark-color.svg"
                            alt="paypal"
                            style={{ height: "0.875rem", verticalAlign: "middle" }}
                          />
                        </section>
                      </form>
                    </div>
                  </div>
                </div>
              ) : submitSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-green-800 mb-2">Application Submitted!</h3>
                      <p className="text-gray-700 mb-4">
                        Your application has been successfully submitted. You can track its status in your dashboard.
                      </p>
                      <Button asChild>
                        <Link href="/dashboard?tab=applications">View My Applications</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 border rounded-lg p-6">
                  <h2 className="text-xl font-semibold">Apply for this position</h2>

                  {submitError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{submitError}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="fullName"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Full Name
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="flex h-10 w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 data-[state=open]:ring-muted-foreground"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Your email address"
                        className="flex h-10 w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 data-[state=open]:ring-muted-foreground"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="phone"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Your phone number"
                        className="flex h-10 w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 data-[state=open]:ring-muted-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="coverLetter"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Cover Letter
                      </label>
                      <textarea
                        id="coverLetter"
                        name="coverLetter"
                        value={formData.coverLetter}
                        onChange={handleChange}
                        placeholder="Write a brief cover letter..."
                        className="flex min-h-[150px] w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 data-[state=open]:ring-muted-foreground"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="resume"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Resume/CV
                      </label>
                      <div
                        className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => document.getElementById("resume")?.click()}
                      >
                        {resumeFileName ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="bg-primary/10 p-2 rounded-full">
                              <Upload className="h-5 w-5 text-primary" />
                            </div>
                            <span className="text-sm font-medium">{resumeFileName}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                setResumeFile(null)
                                setResumeFileName("")
                              }}
                            >
                              Change
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-gray-500">Drag and drop your resume here, or click to browse</p>
                            <p className="text-xs text-gray-400 mt-1">Supported formats: PDF, DOCX, RTF (Max 5MB)</p>
                          </>
                        )}
                        <input
                          id="resume"
                          type="file"
                          className="hidden"
                          accept=".pdf,.docx,.doc,.rtf"
                          onChange={handleResumeChange}
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </Button>
                  </form>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6 border">
                <h3 className="font-semibold mb-4">Job Details</h3>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500 block">Salary</span>
                    <span className="font-medium">{job.salary}</span>
                  </div>

                  <div>
                    <span className="text-gray-500 block">Job Type</span>
                    <span className="font-medium capitalize">{job.type.join(", ")}</span>
                  </div>

                  <div>
                    <span className="text-gray-500 block">Category</span>
                    <span className="font-medium capitalize">{job.category}</span>
                  </div>

                  <div>
                    <span className="text-gray-500 block">Posted On</span>
                    <span className="font-medium">{new Date(job.postedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border">
                <h3 className="font-semibold mb-4">About {job.company}</h3>
                <p className="text-sm text-gray-700">
                  {job.company} is a leading company in the {job.category} industry, providing exceptional services to
                  clients worldwide. With a focus on quality and innovation, we're always looking for talented
                  individuals to join our team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
