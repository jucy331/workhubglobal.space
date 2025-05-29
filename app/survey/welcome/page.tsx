"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, ArrowRight, CheckCircle, DollarSign, Gift, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Question {
  id: number
  type: "radio" | "textarea" | "select" | "checkbox" | "input"
  question: string
  options?: string[]
  required: boolean
}

const surveyQuestions: Question[] = [
  {
    id: 1,
    type: "radio",
    question: "How familiar are you with online work platforms?",
    options: [
      "Very familiar - I use them regularly",
      "Somewhat familiar - I've tried a few",
      "New to this - This is my first platform",
      "I've heard about them but never tried",
    ],
    required: true,
  },
  {
    id: 2,
    type: "radio",
    question: "What is your primary motivation for joining WorkHub Global?",
    options: [
      "Primary income source",
      "Supplemental income",
      "Flexible side work",
      "Exploring new opportunities",
      "Building skills and experience",
    ],
    required: true,
  },
  {
    id: 3,
    type: "checkbox",
    question: "Which types of work are you most interested in? (Select all that apply)",
    options: [
      "Surveys & Market Research",
      "Data Entry",
      "Virtual Assistance",
      "Content Writing",
      "AI Training & Evaluation",
      "Transcription",
      "Customer Service",
      "Social Media Management",
    ],
    required: true,
  },
  {
    id: 4,
    type: "radio",
    question: "How many hours per week are you looking to work?",
    options: [
      "1-5 hours",
      "6-10 hours",
      "11-20 hours",
      "21-30 hours",
      "30+ hours",
      "Flexible - depends on availability",
    ],
    required: true,
  },
  {
    id: 5,
    type: "radio",
    question: "What time zone are you in?",
    options: [
      "Eastern Time (ET)",
      "Central Time (CT)",
      "Mountain Time (MT)",
      "Pacific Time (PT)",
      "Other US timezone",
      "International",
    ],
    required: true,
  },
  {
    id: 6,
    type: "radio",
    question: "What is your preferred work schedule?",
    options: [
      "Morning (6 AM - 12 PM)",
      "Afternoon (12 PM - 6 PM)",
      "Evening (6 PM - 12 AM)",
      "Night (12 AM - 6 AM)",
      "Flexible - any time",
      "Weekends only",
    ],
    required: true,
  },
  {
    id: 7,
    type: "radio",
    question: "What is your highest level of education?",
    options: [
      "High School",
      "Some College",
      "Associate Degree",
      "Bachelor's Degree",
      "Master's Degree",
      "Doctoral Degree",
    ],
    required: true,
  },
  {
    id: 8,
    type: "radio",
    question: "Do you have previous remote work experience?",
    options: ["Yes, extensive experience", "Yes, some experience", "Limited experience", "No, but eager to learn"],
    required: true,
  },
  {
    id: 9,
    type: "select",
    question: "What is your age range?",
    options: ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"],
    required: true,
  },
  {
    id: 10,
    type: "radio",
    question: "How would you rate your English proficiency?",
    options: ["Native speaker", "Fluent", "Advanced", "Intermediate", "Basic"],
    required: true,
  },
  {
    id: 11,
    type: "radio",
    question: "What type of device do you primarily use for work?",
    options: ["Desktop computer", "Laptop", "Tablet", "Smartphone", "Multiple devices"],
    required: true,
  },
  {
    id: 12,
    type: "radio",
    question: "How would you describe your internet connection?",
    options: [
      "Very fast and reliable",
      "Fast and mostly reliable",
      "Adequate for basic tasks",
      "Sometimes slow or unreliable",
    ],
    required: true,
  },
  {
    id: 13,
    type: "checkbox",
    question: "Which skills do you have? (Select all that apply)",
    options: [
      "Data entry",
      "Customer service",
      "Writing/editing",
      "Research",
      "Social media",
      "Basic design",
      "Translation",
      "Technical skills",
    ],
    required: true,
  },
  {
    id: 14,
    type: "radio",
    question: "What is your minimum acceptable hourly rate?",
    options: ["$8-10/hour", "$11-13/hour", "$14-16/hour", "$17-20/hour", "$20+/hour", "Depends on the task"],
    required: true,
  },
  {
    id: 15,
    type: "textarea",
    question: "What features would you like to see on WorkHub Global to improve your experience?",
    required: false,
  },
  {
    id: 16,
    type: "radio",
    question: "How did you hear about WorkHub Global?",
    options: ["Search engine", "Social media", "Friend/family referral", "Online advertisement", "Job board", "Other"],
    required: true,
  },
  {
    id: 17,
    type: "textarea",
    question: "Is there anything else you'd like us to know about your work preferences or goals?",
    required: false,
  },
]

export default function WelcomeSurvey() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const progress = ((currentQuestion + 1) / surveyQuestions.length) * 100

  const handleAnswer = (questionId: number, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const handleNext = () => {
    const question = surveyQuestions[currentQuestion]
    if (question.required && !answers[question.id]) {
      toast({
        title: "Answer Required",
        description: "Please answer this question before continuing.",
        variant: "destructive",
      })
      return
    }

    if (currentQuestion < surveyQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mark survey as completed
    localStorage.setItem("welcome_survey_completed", "true")

    // Add earnings to user account (in a real app, this would be done server-side)
    const currentEarnings = Number.parseFloat(localStorage.getItem("user_earnings") || "0")
    localStorage.setItem("user_earnings", (currentEarnings + 1.5).toString())

    toast({
      title: "Survey Completed! 🎉",
      description: "$1.50 has been added to your account balance.",
    })

    router.push("/jobs?survey_completed=true")
  }

  const question = surveyQuestions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Gift className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Welcome Survey</h1>
                <p className="text-sm text-gray-600">Earn $1.50 • 2 minutes</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {surveyQuestions.length}
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-green-600">$1.50</span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Survey Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">{currentQuestion + 1}</span>
              </div>
              <CardTitle className="text-xl text-gray-900 leading-relaxed">{question.question}</CardTitle>
              {question.required && <p className="text-sm text-red-600">* Required</p>}
            </CardHeader>

            <CardContent className="space-y-6">
              {question.type === "radio" && (
                <RadioGroup
                  value={answers[question.id] || ""}
                  onValueChange={(value) => handleAnswer(question.id, value)}
                  className="space-y-3"
                >
                  {question.options?.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-gray-700">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {question.type === "select" && (
                <Select value={answers[question.id] || ""} onValueChange={(value) => handleAnswer(question.id, value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an option..." />
                  </SelectTrigger>
                  <SelectContent>
                    {question.options?.map((option, index) => (
                      <SelectItem key={index} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {question.type === "checkbox" && (
                <div className="space-y-3">
                  {question.options?.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Checkbox
                        id={`checkbox-${index}`}
                        checked={(answers[question.id] || []).includes(option)}
                        onCheckedChange={(checked) => {
                          const currentAnswers = answers[question.id] || []
                          if (checked) {
                            handleAnswer(question.id, [...currentAnswers, option])
                          } else {
                            handleAnswer(
                              question.id,
                              currentAnswers.filter((a: string) => a !== option),
                            )
                          }
                        }}
                      />
                      <Label htmlFor={`checkbox-${index}`} className="flex-1 cursor-pointer text-gray-700">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              )}

              {question.type === "textarea" && (
                <Textarea
                  placeholder="Type your answer here..."
                  value={answers[question.id] || ""}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                  className="min-h-[120px] resize-none"
                />
              )}

              {question.type === "input" && (
                <Input
                  placeholder="Type your answer here..."
                  value={answers[question.id] || ""}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                />
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : currentQuestion === surveyQuestions.length - 1 ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>Complete Survey</span>
                    </>
                  ) : (
                    <>
                      <span>Next</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Survey Info */}
          <div className="mt-8 text-center">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>Secure & Anonymous</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Instant Payment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <span>$50 Minimum Withdrawal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
