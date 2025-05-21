"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const jobData: Record<string, any> = {
  // ... jobData stays the same
}

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [job, setJob] = useState<any>(null)
  const [isActivated, setIsActivated] = useState(false)
  const [activationDialogOpen, setActivationDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const jobId = params.id as string

  useEffect(() => {
    // Check activation status
    const activationStatus = localStorage.getItem("account_activated")
    if (activationStatus === "true") {
      setIsActivated(true)
    }

    // Check if returned from PayPal
    const pendingJobId = sessionStorage.getItem("pending_job_id")
    if (pendingJobId === jobId) {
      localStorage.setItem("account_activated", "true")
      setIsActivated(true)
      sessionStorage.removeItem("pending_job_id")
    }

    // Load job
    if (jobData[jobId]) {
      setJob(jobData[jobId])
    } else {
      router.push("/jobs")
    }

    setLoading(false)
  }, [jobId, router])

  const handlePaymentRedirect = () => {
    sessionStorage.setItem("pending_job_id", jobId)
    window.location.href = "https://www.paypal.com/ncp/payment/HX5S7CVY9BQQ2"
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <p>Loading job details...</p>
        </div>
      </div>
    )
  }

  if (!job) {
    return null
  }

  if (!isActivated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Link href="/jobs" className="inline-flex items-center text-sm mb-6 hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to all jobs
          </Link>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{job.title}</CardTitle>
              <CardDescription>{job.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-sm mb-1">Pay Range</h3>
                    <p>{job.payRange}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm mb-1">Time Commitment</h3>
                    <p>{job.estimatedTime}</p>
                  </div>
                </div>

                <div className="bg-muted p-6 rounded-lg border text-center">
                  <h2 className="text-xl font-semibold mb-2">Account Activation Required</h2>
                  <p className="mb-4">
                    To view complete job details and apply for this position, please activate your account.
                  </p>
                  <Button onClick={() => setActivationDialogOpen(true)}>Activate Account ($5.00)</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Dialog open={activationDialogOpen} onOpenChange={setActivationDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Account Activation Required</DialogTitle>
                <DialogDescription>
                  To view job details and apply for positions, a one-time account activation fee of $5.00 is required.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col space-y-4 py-4">
                <div className="rounded-md bg-muted p-4">
                  <h3 className="font-medium mb-2">Benefits of Account Activation:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Access to all job details and application forms</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Apply to unlimited job opportunities</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Receive job alerts for new opportunities</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Track your applications and earnings</span>
                    </li>
                  </ul>
                </div>
                <div className="text-center font-medium">One-time payment: $5.00</div>
              </div>
              <DialogFooter className="flex-col sm:flex-row sm:justify-between">
                <Button variant="outline" onClick={() => setActivationDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handlePaymentRedirect}>Activate Account</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    )
  }

  // 🔓 Activated users see full job details
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/jobs" className="inline-flex items-center text-sm mb-6 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all jobs
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{job.title}</CardTitle>
            <CardDescription>{job.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm mb-1">Pay Range</h3>
                  <p>{job.payRange}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm mb-1">Time Commitment</h3>
                  <p>{job.estimatedTime}</p>
                </div>
              </div>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: job.fullDescription }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
