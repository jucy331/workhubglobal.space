"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowRight, Users, Shield, DollarSign, Clock } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function WelcomePage() {
  const router = useRouter()
  const { userProfile, loading } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (!loading && !userProfile) {
      router.push("/login")
    }
  }, [userProfile, loading, router])

  const steps = [
    {
      title: "Welcome to WorkHub Global!",
      description: "Your gateway to remote survey and AI training opportunities",
      icon: <Users className="h-8 w-8 text-blue-600" />,
    },
    {
      title: "Secure & Trusted Platform",
      description: "All jobs are verified and payments are guaranteed",
      icon: <Shield className="h-8 w-8 text-green-600" />,
    },
    {
      title: "Earn While You Learn",
      description: "Complete surveys and AI training tasks from anywhere",
      icon: <DollarSign className="h-8 w-8 text-yellow-600" />,
    },
    {
      title: "Flexible Schedule",
      description: "Work on your own time, at your own pace",
      icon: <Clock className="h-8 w-8 text-purple-600" />,
    },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      router.push("/jobs")
    }
  }

  const handleSkip = () => {
    router.push("/jobs")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              {steps[currentStep].icon}
            </div>
            <CardTitle className="text-3xl text-gray-900 mb-2">{steps[currentStep].title}</CardTitle>
            <CardDescription className="text-lg text-gray-600">{steps[currentStep].description}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {userProfile && (
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-800">
                  Welcome, <span className="font-semibold">{userProfile.fullName}</span>!
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  Your account is {userProfile.isActivated ? "activated" : "pending activation"}
                </p>
              </div>
            )}

            {/* Progress indicators */}
            <div className="flex justify-center space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index <= currentStep ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* Step-specific content */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">Survey Tasks</h4>
                    <p className="text-sm text-green-700">
                      Complete market research surveys and earn $2-$15 per survey
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-2">AI Training</h4>
                    <p className="text-sm text-purple-700">
                      Help train AI models with data labeling and feedback tasks
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">All employers are verified</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Secure payment processing</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">24/7 customer support</span>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">$500+</div>
                  <p className="text-gray-600">Average monthly earnings for active users</p>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">$5</div>
                    <p className="text-sm text-gray-600">Avg per task</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">15min</div>
                    <p className="text-sm text-gray-600">Avg duration</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">24h</div>
                    <p className="text-sm text-gray-600">Payment time</p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="text-center">
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">Ready to get started?</h4>
                  <p className="text-gray-600 mb-6">
                    Browse available jobs and start earning today. You can work as little or as much as you want.
                  </p>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    No minimum hours required
                  </Badge>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={handleSkip}>
                Skip Tour
              </Button>
              <Button onClick={handleNext} className="bg-gradient-to-r from-blue-600 to-purple-600">
                {currentStep === steps.length - 1 ? "Start Browsing Jobs" : "Next"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
