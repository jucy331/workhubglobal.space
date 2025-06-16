"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { jobManager } from "@/lib/job-manager"
import { Briefcase, DollarSign, Users, Shield } from "lucide-react"
import { revenueManager } from "@/lib/revenue-manager"

export default function CreateJobPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { userProfile } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    category: "",
    payType: "",
    payAmount: "",
    estimatedTime: "",
    requirements: "",
    difficulty: "",
    maxWorkers: "",
    instructions: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Calculate job posting costs
      const jobCosts = revenueManager.calculateJobPostingCost({
        payAmount: Number.parseFloat(jobData.payAmount),
        maxWorkers: Number.parseInt(jobData.maxWorkers) || 100,
        featured: Math.random() > 0.7, // 30% chance of being featured
        urgent: false,
      })

      // Create job using the job manager
      const newJob = jobManager.createJob({
        title: jobData.title,
        description: jobData.description,
        fullDescription: `
        <h2>Job Overview</h2>
        <p>${jobData.description}</p>
        <h2>Instructions</h2>
        <p>${jobData.instructions}</p>
        <h2>Requirements</h2>
        <p>${jobData.requirements || "No specific requirements"}</p>
      `,
        payRange: `$${jobData.payAmount}${jobData.payType === "hourly" ? "/hour" : jobData.payType === "per-task" ? "/task" : " fixed"}`,
        requirements: jobData.requirements || "Basic computer skills",
        estimatedTime: jobData.estimatedTime,
        category:
          jobData.category === "surveys"
            ? "Surveys & Market Research"
            : jobData.category === "ai-training"
              ? "AI & Machine Learning"
              : jobData.category === "data-entry"
                ? "Data Entry & Processing"
                : "Content Moderation",
        difficulty: jobData.difficulty as "Beginner" | "Intermediate" | "Advanced",
        popularity: Math.floor(Math.random() * 20) + 80,
        featured: jobCosts.featuredFee > 0,
        status: "active",
        maxWorkers: Number.parseInt(jobData.maxWorkers) || 100,
        employerId: userProfile?.uid || "anonymous",
        employerName: userProfile?.fullName || "Anonymous Employer",
        payType: jobData.payType as "per-task" | "hourly" | "fixed",
        payAmount: Number.parseFloat(jobData.payAmount),
        instructions: jobData.instructions,
        tags: [
          jobData.category,
          jobData.difficulty.toLowerCase(),
          jobData.payType,
          ...jobData.title.toLowerCase().split(" ").slice(0, 3),
        ],
      })

      // Process job posting payment
      const paymentResult = revenueManager.processJobPosting(
        userProfile?.uid || "anonymous",
        {
          payAmount: Number.parseFloat(jobData.payAmount),
          maxWorkers: Number.parseInt(jobData.maxWorkers) || 100,
          featured: jobCosts.featuredFee > 0,
          urgent: false,
        },
        newJob.id,
      )

      if (paymentResult.success) {
        toast({
          title: "Job Created Successfully!",
          description: `Your job "${newJob.title}" has been posted. Posting fee: $${paymentResult.costs.totalCost.toFixed(2)}`,
        })
      } else {
        toast({
          title: "Job Created with Payment Issue",
          description: `Job posted but payment processing failed: ${paymentResult.error}`,
          variant: "destructive",
        })
      }

      router.push("/jobs")
    } catch (error) {
      toast({
        title: "Error Creating Job",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setJobData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Job</h1>
          <p className="text-gray-600">Post a survey or AI training job for workers to complete</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                Job Information
              </CardTitle>
              <CardDescription>Provide basic details about your job posting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  required
                  value={jobData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="e.g., Product Feedback Survey, AI Chatbot Training"
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={jobData.category} onValueChange={(value) => handleChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="surveys">Surveys & Market Research</SelectItem>
                    <SelectItem value="ai-training">AI & Machine Learning</SelectItem>
                    <SelectItem value="data-entry">Data Entry & Processing</SelectItem>
                    <SelectItem value="content-moderation">Content Moderation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  required
                  value={jobData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Describe what workers will be doing..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="instructions">Detailed Instructions *</Label>
                <Textarea
                  id="instructions"
                  required
                  value={jobData.instructions}
                  onChange={(e) => handleChange("instructions", e.target.value)}
                  placeholder="Provide step-by-step instructions for completing the task..."
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment & Time */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Payment & Duration
              </CardTitle>
              <CardDescription>Set compensation and time requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="payType">Payment Type *</Label>
                  <Select value={jobData.payType} onValueChange={(value) => handleChange("payType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="per-task">Per Task/Survey</SelectItem>
                      <SelectItem value="hourly">Per Hour</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="payAmount">Payment Amount ($) *</Label>
                  <Input
                    id="payAmount"
                    type="number"
                    step="0.01"
                    min="0.50"
                    required
                    value={jobData.payAmount}
                    onChange={(e) => handleChange("payAmount", e.target.value)}
                    placeholder="5.00"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="estimatedTime">Estimated Time *</Label>
                  <Input
                    id="estimatedTime"
                    required
                    value={jobData.estimatedTime}
                    onChange={(e) => handleChange("estimatedTime", e.target.value)}
                    placeholder="e.g., 10-15 minutes"
                  />
                </div>

                <div>
                  <Label htmlFor="maxWorkers">Maximum Workers</Label>
                  <Input
                    id="maxWorkers"
                    type="number"
                    min="1"
                    value={jobData.maxWorkers}
                    onChange={(e) => handleChange("maxWorkers", e.target.value)}
                    placeholder="100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Worker Requirements
              </CardTitle>
              <CardDescription>Specify requirements and difficulty level</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="difficulty">Difficulty Level *</Label>
                <Select value={jobData.difficulty} onValueChange={(value) => handleChange("difficulty", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner - No experience required</SelectItem>
                    <SelectItem value="Intermediate">Intermediate - Some experience helpful</SelectItem>
                    <SelectItem value="Advanced">Advanced - Specialized skills required</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="requirements">Requirements & Qualifications</Label>
                <Textarea
                  id="requirements"
                  value={jobData.requirements}
                  onChange={(e) => handleChange("requirements", e.target.value)}
                  placeholder="List any specific requirements, skills, or qualifications needed..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {jobData.payAmount && jobData.maxWorkers && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <DollarSign className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-green-900">Cost Breakdown</h4>
                    <div className="text-sm text-green-700 mt-2 space-y-1">
                      <div className="flex justify-between">
                        <span>Job Posting Fee:</span>
                        <span>$5.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Job Value:</span>
                        <span>
                          $
                          {(Number.parseFloat(jobData.payAmount) * Number.parseInt(jobData.maxWorkers || "1")).toFixed(
                            2,
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Platform Commission (15%):</span>
                        <span>
                          $
                          {(
                            Number.parseFloat(jobData.payAmount) *
                            Number.parseInt(jobData.maxWorkers || "1") *
                            0.15
                          ).toFixed(2)}
                        </span>
                      </div>
                      <div className="border-t border-green-300 pt-1 flex justify-between font-medium">
                        <span>Your Total Cost:</span>
                        <span>
                          $
                          {(
                            5 +
                            Number.parseFloat(jobData.payAmount) * Number.parseInt(jobData.maxWorkers || "1")
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Notice */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Security & Quality Assurance</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    All job postings are reviewed for quality and compliance. Workers are verified and rated based on
                    their performance. Payment is held in escrow until work is completed satisfactorily.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating Job...
                </>
              ) : (
                <>
                  <Briefcase className="h-4 w-4 mr-2" />
                  Create Job Posting
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
