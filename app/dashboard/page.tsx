"use client"

import { DialogFooter } from "@/components/ui/dialog"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Briefcase, CheckCircle, DollarSign, FileText, Star, Users, Gift } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

// Sample data for demonstration
const sampleApplications = []

export default function DashboardPage() {
  const { userProfile, loading } = useAuth()
  const [stats, setStats] = useState({
    applicationsSubmitted: 0,
    applicationsAccepted: 0,
    totalEarnings: 0.0,
    currentWeekEarnings: 0.0,
    completedJobs: 0,
    averageRating: 0,
    hoursWorked: 0,
    activeJobs: 0,
  })

  const [activationDialogOpen, setActivationDialogOpen] = useState(false)
  const [isActivated, setIsActivated] = useState(false)
  const [surveyCompleted, setSurveyCompleted] = useState(false)

  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    activatedReferrals: 0,
    pendingReferrals: 0,
    referralEarnings: 0,
  })
  const [showReferralLinks, setShowReferralLinks] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    const activationStatus = localStorage.getItem("account_activated")
    if (activationStatus === "true") {
      setIsActivated(true)
    }

    // Check survey completion and load earnings
    const surveyStatus = localStorage.getItem("welcome_survey_completed")
    if (surveyStatus === "true") {
      setSurveyCompleted(true)
    }

    // Load user earnings from localStorage (in a real app, this would come from the server)
    const userEarnings = Number.parseFloat(localStorage.getItem("user_earnings") || "0")

    // Process referral earnings if user just activated
    const urlParams = new URLSearchParams(window.location.search)
    const justActivated = urlParams.get("activated") === "true"

    if (justActivated) {
      // Check if this user was referred and process referral bonus
      const userProfile = JSON.parse(localStorage.getItem("user_profile") || "{}")
      if (userProfile.referredBy) {
        // Award referral bonus to the referrer
        const referralEarnings = Number.parseFloat(localStorage.getItem("referral_earnings") || "0")
        localStorage.setItem("referral_earnings", (referralEarnings + 1).toString())

        // Update referral stats
        const currentStats = JSON.parse(
          localStorage.getItem("user_referral_stats") ||
            '{"totalReferrals":0,"activatedReferrals":0,"pendingReferrals":0,"referralEarnings":0}',
        )
        currentStats.activatedReferrals += 1
        currentStats.referralEarnings += 1
        localStorage.setItem("user_referral_stats", JSON.stringify(currentStats))
      }
    }

    setStats((prev) => ({
      ...prev,
      totalEarnings: userEarnings + Number.parseFloat(localStorage.getItem("referral_earnings") || "0"),
      currentWeekEarnings: userEarnings,
    }))

    // Load referral stats
    const referralData = localStorage.getItem("user_referral_stats")
    if (referralData) {
      setReferralStats(JSON.parse(referralData))
    }
  }, [])

  // Use sample data for demonstration
  const recentApplications = sampleApplications

  const handlePaymentRedirect = () => {
    console.log("Redirecting to PayPal payment page...")
    window.location.href = "https://www.paypal.com/ncp/payment/HX5S7CVY9BQQ2"
  }

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

  const successRate =
    stats.applicationsSubmitted > 0 ? Math.round((stats.applicationsAccepted / stats.applicationsSubmitted) * 100) : 0

  const canWithdraw = stats.totalEarnings >= 50

  const generateReferralCode = () => {
    return userProfile?.fullName?.replace(/\s+/g, "").toLowerCase() + Math.random().toString(36).substr(2, 6)
  }

  const referralCode = generateReferralCode()
  const referralLink = `${window.location.origin}/register?ref=${referralCode}`

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard.",
      })
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please copy the link manually.",
        variant: "destructive",
      })
    }
  }

  const shareReferral = (platform: string) => {
    const message = `Join me on WorkHub Global and start earning money from home! Use my referral link: ${referralLink}`

    switch (platform) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank")
        break
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, "_blank")
        break
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`, "_blank")
        break
      case "email":
        window.open(`mailto:?subject=Join WorkHub Global&body=${encodeURIComponent(message)}`, "_blank")
        break
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userProfile?.fullName || "User"}!</h1>
        <p className="text-gray-600 mt-2">Here's an overview of your work activity</p>
      </div>

      {/* Survey Completion Notification */}
      {surveyCompleted && stats.totalEarnings > 0 && (
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center text-green-800">
              <Gift className="h-5 w-5 mr-2" />
              Survey Completed! 🎉
            </CardTitle>
            <CardDescription className="text-green-700">
              Thank you for completing the welcome survey. $1.50 has been added to your account.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Account Status */}
      {!userProfile?.isActivated && (
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
            <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => setActivationDialogOpen(true)}>
              Activate Account ($5.00)
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Withdrawal Notice */}
      {stats.totalEarnings > 0 && stats.totalEarnings < 50 && (
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-800">
              <DollarSign className="h-5 w-5 mr-2" />
              Earnings Update
            </CardTitle>
            <CardDescription className="text-blue-700">
              You have ${stats.totalEarnings.toFixed(2)} in your account. Minimum withdrawal amount is $50.00.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Progress value={(stats.totalEarnings / 50) * 100} className="flex-1" />
              <span className="text-sm font-medium text-blue-800">${(50 - stats.totalEarnings).toFixed(2)} to go</span>
            </div>
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
            <p className="text-xs text-muted-foreground">
              {canWithdraw ? "Ready for withdrawal" : `$${(50 - stats.totalEarnings).toFixed(2)} until withdrawal`}
            </p>
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
              {recentApplications.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No applications yet</p>
                  <Link href="/jobs">
                    <Button>Browse Jobs</Button>
                  </Link>
                </div>
              ) : (
                recentApplications.map((application) => (
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
                ))
              )}
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
                <span>{successRate}%</span>
              </div>
              <Progress value={successRate} />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Profile Completion</span>
                <span>85%</span>
              </div>
              <Progress value={85} />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Withdrawal Progress</span>
                <span>{Math.min(100, (stats.totalEarnings / 50) * 100).toFixed(0)}%</span>
              </div>
              <Progress value={Math.min(100, (stats.totalEarnings / 50) * 100)} />
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
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <Link href="/jobs">
              <Button variant="outline" className="w-full h-20 flex flex-col">
                <Briefcase className="h-6 w-6 mb-2" />
                Browse Jobs
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="outline" className="w-full h-20 flex flex-col">
                <Users className="h-6 w-6 mb-2" />
                Profile Settings
              </Button>
            </Link>
            {canWithdraw && (
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col bg-green-50 border-green-200 hover:bg-green-100"
              >
                <DollarSign className="h-6 w-6 mb-2 text-green-600" />
                <span className="text-green-600">Request Withdrawal</span>
              </Button>
            )}
          </div>

          {/* Referral Section */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Referral Program</h3>
                <p className="text-sm text-gray-600">Earn $1.00 for each friend who activates their account</p>
              </div>
              <Badge className="bg-green-100 text-green-800">$1 per referral</Badge>
            </div>

            {/* Referral Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{referralStats.totalReferrals}</div>
                <div className="text-xs text-blue-600">Total Referrals</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{referralStats.activatedReferrals}</div>
                <div className="text-xs text-green-600">Activated</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{referralStats.pendingReferrals}</div>
                <div className="text-xs text-yellow-600">Pending</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">${referralStats.referralEarnings.toFixed(2)}</div>
                <div className="text-xs text-purple-600">Earned</div>
              </div>
            </div>

            {/* Referral Link */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Your Referral Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                  />
                  <Button onClick={() => copyToClipboard(referralLink)} variant="outline" size="sm">
                    Copy
                  </Button>
                </div>
              </div>

              {/* Share Buttons */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Share via</label>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    onClick={() => shareReferral("whatsapp")}
                    variant="outline"
                    size="sm"
                    className="bg-green-50 border-green-200 hover:bg-green-100"
                  >
                    WhatsApp
                  </Button>
                  <Button
                    onClick={() => shareReferral("facebook")}
                    variant="outline"
                    size="sm"
                    className="bg-blue-50 border-blue-200 hover:bg-blue-100"
                  >
                    Facebook
                  </Button>
                  <Button
                    onClick={() => shareReferral("twitter")}
                    variant="outline"
                    size="sm"
                    className="bg-sky-50 border-sky-200 hover:bg-sky-100"
                  >
                    Twitter
                  </Button>
                  <Button
                    onClick={() => shareReferral("email")}
                    variant="outline"
                    size="sm"
                    className="bg-gray-50 border-gray-200 hover:bg-gray-100"
                  >
                    Email
                  </Button>
                </div>
              </div>

              {/* Referral Instructions */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-gray-900 mb-2">How it works:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Share your unique referral link with friends and family</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>They sign up using your link and create an account</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>When they activate their account ($5 fee), you earn $1.00</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Earnings are added instantly to your account balance</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Activation Dialog */}
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
  )
}
