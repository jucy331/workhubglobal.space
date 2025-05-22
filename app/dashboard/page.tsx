"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  AlertCircle,
  Briefcase,
  DollarSign,
  Clock,
  CreditCard,
  FileText,
  Settings,
  ChevronRight,
  PlusCircle,
  Info,
  Bell,
  Loader2,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { getUserApplications } from "@/lib/job-applications"
import { useSearchParams, useRouter } from "next/navigation"
import ProtectedRoute from "@/components/protected-route"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function DashboardPage() {
  const { user, userProfile } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [applications, setApplications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get the active tab from URL params or default to 'applications'
  const activeTab = searchParams.get("tab") || "applications"

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) return

      try {
        const result = await getUserApplications(user.uid)
        if (result.success) {
          setApplications(result.applications)
        } else {
          setError(result.error || "Failed to load applications")
        }
      } catch (err) {
        console.error("Error fetching applications:", err)
        setError("An unexpected error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchApplications()
    } else {
      setIsLoading(false)
    }
  }, [user])

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", value)
    router.push(`/dashboard?${params.toString()}`)
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your account, applications, and payments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Available Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">$0.00</span>
                <span className="text-sm text-gray-500 ml-2">USD</span>
              </div>
              <Button size="sm" className="mt-4" disabled asChild>
                <Link href="#withdraw">Withdraw Funds</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {applications.length > 0 ? (
                <>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">{applications.length}</span>
                    <span className="text-sm text-gray-500 ml-2">Total</span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                      <span>{applications.filter((app) => app.status === "pending").length} Pending</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-green-400"></div>
                      <span>{applications.filter((app) => app.status === "interview").length} Interview</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">0</span>
                    <span className="text-sm text-gray-500 ml-2">Total</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">You haven't applied to any jobs yet</div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Account Status</CardTitle>
            </CardHeader>
            <CardContent>
              {userProfile?.isActivated ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Activated</span>
                </div>
              ) : userProfile?.activationPending ? (
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium">Pending Activation</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span className="font-medium">Not Activated</span>
                </div>
              )}
              <p className="text-sm text-gray-500 mt-2">
                {userProfile?.isActivated
                  ? "Your account is fully activated. You can apply for any job."
                  : userProfile?.activationPending
                    ? "Your payment is being verified. This usually takes 1-2 business days."
                    : "Activate your account to apply for jobs."}
              </p>
              {!userProfile?.isActivated && !userProfile?.activationPending && (
  <>
    <Button size="sm" className="mt-4" onClick={() => setShowActivateDialog(true)}>
      Activate Now
    </Button>
    {showActivateDialog && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowActivateDialog(false)}
            aria-label="Close"
          >
            ×
          </button>
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
      </div>
    )}
  </>
)}
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid grid-cols-4 md:w-[600px]">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    <span>Job Applications</span>
                  </CardTitle>
                  <CardDescription>Track the status of your job applications</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : error ? (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  ) : applications.length > 0 ? (
                    <div className="space-y-4">
                      {applications.map((application) => (
                        <div
                          key={application.id}
                          className="border rounded-lg p-4 hover:border-primary transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{application.jobTitle}</h3>
                              <p className="text-sm text-gray-500">{application.company}</p>
                            </div>
                            <Badge variant="outline" className="capitalize">
                              {application.status}
                            </Badge>
                          </div>
                          <div className="mt-2 text-sm text-gray-500">
                            Applied on {application.appliedAt?.toDate().toLocaleDateString() || "Unknown date"}
                          </div>
                          <div className="mt-3 flex justify-end">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/applications/${application.id}`}>
                                View Details
                                <ChevronRight className="ml-1 h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border border-dashed rounded-lg">
                      <Briefcase className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No applications yet</h3>
                      <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        When you apply for jobs, they'll appear here so you can track their status
                      </p>
                      <Button asChild>
                        <Link href="/jobs">Browse Jobs</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span>Application Timeline</span>
                  </CardTitle>
                  <CardDescription>Recent activity on your applications</CardDescription>
                </CardHeader>
                <CardContent>
                  {applications.length > 0 ? (
                    <div className="space-y-4">
                      {applications.slice(0, 3).map((application) => (
                        <div key={`timeline-${application.id}`} className="flex gap-3">
                          <div className="relative flex flex-col items-center">
                            <div className="h-3 w-3 rounded-full bg-primary"></div>
                            <div className="h-full w-0.5 bg-gray-200"></div>
                          </div>
                          <div className="pb-4 flex-1">
                            <p className="text-sm font-medium">
                              Application {application.status === "pending" ? "submitted" : application.status}
                            </p>
                            <p className="text-xs text-gray-500">
                              {application.jobTitle} at {application.company}
                            </p>
                            <p className="text-xs text-gray-400">
                              {application.updatedAt?.toDate().toLocaleDateString() || "Unknown date"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border border-dashed rounded-lg">
                      <Clock className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No activity yet</h3>
                      <p className="text-gray-500 max-w-md mx-auto">
                        Your application timeline will show updates and activity as you apply for jobs
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <span>Recommended Jobs</span>
                </CardTitle>
                <CardDescription>Jobs that match your profile and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {isLoading ? (
                    <div className="col-span-3 flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <>
                      {/* Placeholder recommended jobs */}
                      <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                        <h3 className="font-medium">Remote Content Writer</h3>
                        <p className="text-sm text-gray-500">ContentCraft</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          <Badge variant="secondary" className="text-xs capitalize">
                            remote
                          </Badge>
                          <Badge variant="secondary" className="text-xs capitalize">
                            freelance
                          </Badge>
                        </div>
                        <div className="mt-3 flex justify-end">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href="/apply/job-001">
                              View Job
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                        <h3 className="font-medium">Frontend Developer</h3>
                        <p className="text-sm text-gray-500">TechInnovate</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          <Badge variant="secondary" className="text-xs capitalize">
                            remote
                          </Badge>
                          <Badge variant="secondary" className="text-xs capitalize">
                            full-time
                          </Badge>
                        </div>
                        <div className="mt-3 flex justify-end">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href="/apply/job-014">
                              View Job
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                        <h3 className="font-medium">UI/UX Designer</h3>
                        <p className="text-sm text-gray-500">DesignMasters</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          <Badge variant="secondary" className="text-xs capitalize">
                            remote
                          </Badge>
                          <Badge variant="secondary" className="text-xs capitalize">
                            freelance
                          </Badge>
                        </div>
                        <div className="mt-3 flex justify-end">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href="/apply/job-008">
                              View Job
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    <span>Earnings Overview</span>
                  </CardTitle>
                  <CardDescription>Summary of your account balance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 border border-dashed rounded-lg">
                    <DollarSign className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No earnings yet</h3>
                    <p className="text-gray-500 text-sm max-w-md mx-auto">
                      Your earnings will appear here once you start receiving payments
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Payment History</span>
                  </CardTitle>
                  <CardDescription>Recent transactions in your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 border border-dashed rounded-lg">
                    <CreditCard className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No payment history</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Your payment history will be displayed here once you make or receive payments
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="withdraw" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Withdraw Funds</span>
                </CardTitle>
                <CardDescription>Transfer your earnings to your preferred payment method</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 border border-dashed rounded-lg">
                  <DollarSign className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No funds to withdraw</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    You don't have any funds available for withdrawal yet. Start earning by applying for jobs or
                    referring friends.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild>
                      <Link href="/jobs">Browse Jobs</Link>
                    </Button>
                    <Button variant="outline">Get Referral Link</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  <span>Account Settings</span>
                </CardTitle>
                <CardDescription>Manage your account preferences and profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-4">Profile Information</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium mb-1 block">Full Name</label>
                          <input
                            type="text"
                            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                            placeholder="Enter your full name"
                            defaultValue={userProfile?.fullName || ""}
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-1 block">Email Address</label>
                          <input
                            type="email"
                            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                            placeholder="Enter your email address"
                            defaultValue={userProfile?.email || ""}
                            disabled
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-1 block">Phone Number</label>
                          <input
                            type="tel"
                            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                            placeholder="Enter your phone number"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-4">Password</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium mb-1 block">Current Password</label>
                          <input
                            type="password"
                            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                            placeholder="••••••••"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-1 block">New Password</label>
                          <input
                            type="password"
                            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                            placeholder="••••••••"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-1 block">Confirm New Password</label>
                          <input
                            type="password"
                            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                    </div>

                    <Button>Save Changes</Button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-4">Notification Preferences</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Job Recommendations</p>
                            <p className="text-sm text-gray-500">Receive personalized job suggestions</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Application Updates</p>
                            <p className="text-sm text-gray-500">Get notified about your application status</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Payment Notifications</p>
                            <p className="text-sm text-gray-500">Receive alerts about account transactions</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-4">Payment Methods</h3>
                      <div className="border border-dashed rounded-lg p-6 text-center">
                        <CreditCard className="h-10 w-10 mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500 mb-4">No payment methods added yet</p>
                        <Button variant="outline" size="sm">
                          Add Payment Method
                        </Button>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="font-medium text-red-600 mb-2">Danger Zone</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <Button variant="destructive" size="sm">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Getting Started Guide for new users */}
        {applications.length === 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-100 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 rounded-full p-3">
                <Info className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-blue-800 mb-2">Getting Started with WorkHub Online</h2>
                <p className="text-gray-700 mb-4">
                  Welcome to your dashboard! Here's how to get started with WorkHub Online:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-blue-100 rounded-full h-6 w-6 flex items-center justify-center text-blue-600 font-medium">
                        1
                      </div>
                      <h3 className="font-medium">Complete Your Profile</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Add your skills, experience, and preferences to get personalized job recommendations.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-blue-100 rounded-full h-6 w-6 flex items-center justify-center text-blue-600 font-medium">
                        2
                      </div>
                      <h3 className="font-medium">Browse Jobs</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Explore available remote and freelance opportunities that match your skills.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-blue-100 rounded-full h-6 w-6 flex items-center justify-center text-blue-600 font-medium">
                        3
                      </div>
                      <h3 className="font-medium">Activate Your Account</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Unlock full access to apply for jobs with a one-time activation fee.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild>
                    <Link href="/jobs">Browse Jobs</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/dashboard?tab=settings">Complete Profile</Link>
                  </Button>
                  {!userProfile?.isActivated && !userProfile?.activationPending && (
                    <Button variant="outline" asChild>
                      <Link href="/activate-account">Activate Account</Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Job Alert Banner */}
        <div className="mt-6 bg-gray-50 border rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-medium">Set Up Job Alerts</h3>
              <p className="text-sm text-gray-500">Get notified when new jobs matching your skills are posted</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Alert
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  )
}
