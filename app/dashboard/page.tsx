"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Briefcase, CheckCircle, DollarSign, FileText, Star, Users } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { userProfile, loading } = useAuth()
  const [stats, setStats] = useState({
    applicationsSubmitted: 12,
    applicationsAccepted: 8,
    totalEarnings: 245.5,
    currentWeekEarnings: 67.25,
    completedJobs: 15,
    averageRating: 4.8,
    hoursWorked: 42,
    activeJobs: 3,
  })

  const recentApplications = [
    {
      id: "1",
      jobTitle: "Product Survey Tester",
      company: "Market Research Co.",
      status: "accepted",
      appliedDate: "2024-01-15",
      earnings: 45.0,
    },
    {
      id: "2",
      jobTitle: "AI Training Data Specialist",
      company: "TechCorp AI",
      status: "pending",
      appliedDate: "2024-01-14",
      earnings: 0,
    },
    {
      id: "3",
      jobTitle: "Virtual Assistant",
      company: "StartupXYZ",
      status: "completed",
      appliedDate: "2024-01-12",
      earnings: 120.0,
    },
    {
      id: "4",
      jobTitle: "Content Moderator",
      company: "Social Platform Inc.",
      status: "in_progress",
      appliedDate: "2024-01-10",
      earnings: 80.5,
    },
  ]

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading dashboard...</div>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="text-gray-600 mb-6">You need to be signed in to view your dashboard.</p>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "in_progress":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "accepted":
        return "Accepted"
      case "pending":
        return "Pending"
      case "completed":
        return "Completed"
      case "in_progress":
        return "In Progress"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userProfile.fullName}!</h1>
        <p className="text-gray-600 mt-2">Here's an overview of your work activity</p>
      </div>

      {/* Account Status */}
      {!userProfile.isActivated && (
        <Card className="mb-8 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-800">
              <CheckCircle className="h-5 w-5 mr-2" />
              Account Activation Required
            </CardTitle>
            <CardDescription className="text-orange-700">
              Activate your account to access all job opportunities and features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/jobs">
              <Button className="bg-orange-600 hover:bg-orange-700">Activate Account ($5.00)</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+${stats.currentWeekEarnings.toFixed(2)} this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.applicationsSubmitted}</div>
            <p className="text-xs text-muted-foreground">{stats.applicationsAccepted} accepted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedJobs}</div>
            <p className="text-xs text-muted-foreground">{stats.activeJobs} currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating}</div>
            <p className="text-xs text-muted-foreground">Based on {stats.completedJobs} reviews</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Your latest job applications and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApplications.map((application) => (
                <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{application.jobTitle}</h4>
                    <p className="text-sm text-gray-600">{application.company}</p>
                    <p className="text-xs text-gray-500">Applied: {application.appliedDate}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={getStatusColor(application.status)}>{getStatusText(application.status)}</Badge>
                    {application.earnings > 0 && (
                      <span className="text-sm font-medium text-green-600">${application.earnings.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/applications">
                <Button variant="outline" className="w-full">
                  View All Applications
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Your work statistics and progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Application Success Rate</span>
                <span>{Math.round((stats.applicationsAccepted / stats.applicationsSubmitted) * 100)}%</span>
              </div>
              <Progress value={(stats.applicationsAccepted / stats.applicationsSubmitted) * 100} />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Profile Completion</span>
                <span>85%</span>
              </div>
              <Progress value={85} />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.hoursWorked}</div>
                <div className="text-xs text-gray-600">Hours Worked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.averageRating}</div>
                <div className="text-xs text-gray-600">Avg Rating</div>
              </div>
            </div>

            <div className="pt-4">
              <Link href="/jobs">
                <Button className="w-full">Browse New Jobs</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/jobs">
              <Button variant="outline" className="w-full h-20 flex flex-col">
                <Briefcase className="h-6 w-6 mb-2" />
                Browse Jobs
              </Button>
            </Link>
            <Link href="/applications">
              <Button variant="outline" className="w-full h-20 flex flex-col">
                <FileText className="h-6 w-6 mb-2" />
                My Applications
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="outline" className="w-full h-20 flex flex-col">
                <Users className="h-6 w-6 mb-2" />
                Profile Settings
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
