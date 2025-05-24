"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, User, Mail, Calendar, CheckCircle, Shield, Settings, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

export default function AccountPage() {
  const router = useRouter()
  const { userProfile, loading, isPreview } = useAuth()
  const { toast } = useToast()
  const [accountCreationDate, setAccountCreationDate] = useState<string>("")
  const [notifications, setNotifications] = useState({
    jobs: true,
    applications: true,
    payments: true,
    marketing: false,
  })
  const [preferences, setPreferences] = useState({
    language: "en",
    region: "us",
    jobAlerts: true,
    emailFrequency: "daily",
  })

  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (!loading && !userProfile && !isPreview) {
      router.push("/login?redirect=/account")
    }

    // Format account creation date
    if (userProfile?.createdAt) {
      const date = userProfile.createdAt instanceof Date ? userProfile.createdAt : new Date(userProfile.createdAt)

      setAccountCreationDate(
        date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      )
    } else {
      setAccountCreationDate("January 1, 2024") // Fallback date
    }
  }, [userProfile, loading, router, isPreview])

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }))
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved.",
    })
  }

  const handlePreferenceChange = (key: string, value: string | boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  const savePreferences = () => {
    toast({
      title: "Preferences updated",
      description: "Your account preferences have been saved successfully.",
    })
  }

  const enable2FA = () => {
    toast({
      title: "2FA Setup",
      description:
        "Two-factor authentication setup will be available soon. You'll be notified when this feature is ready.",
    })
  }

  const manageSessions = () => {
    toast({
      title: "Session Management",
      description:
        "Session management features are coming soon. You'll be able to view and manage all your active sessions.",
    })
  }

  const changePassword = () => {
    toast({
      title: "Password Change",
      description: "Password change functionality will be available soon. You'll receive an email with instructions.",
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading account information...</div>
      </div>
    )
  }

  if (!userProfile && !isPreview) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/dashboard" className="inline-flex items-center text-sm mb-4 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
        <p className="text-gray-600 mt-2">Manage your account details and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Your basic account details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Full Name</div>
                      <div className="font-medium">{userProfile?.fullName || "User"}</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Email Address</div>
                      <div className="font-medium">{userProfile?.email || "user@example.com"}</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Member Since</div>
                      <div className="font-medium">{accountCreationDate}</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Account Status</div>
                      <div className="flex items-center">
                        {userProfile?.isActivated ? (
                          <>
                            <Badge className="bg-green-100 text-green-800 mr-2">Activated</Badge>
                            <span className="text-sm text-gray-500">Full access to all features</span>
                          </>
                        ) : (
                          <>
                            <Badge variant="outline" className="mr-2">
                              Free Account
                            </Badge>
                            <span className="text-sm text-gray-500">Limited access</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Link href="/settings">
                    <Button>Edit Profile</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
                <CardDescription>Overview of your account activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <div className="text-gray-600">Total Applications</div>
                    <div className="font-medium">0</div>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b">
                    <div className="text-gray-600">Accepted Applications</div>
                    <div className="font-medium">0</div>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b">
                    <div className="text-gray-600">Completed Jobs</div>
                    <div className="font-medium">0</div>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b">
                    <div className="text-gray-600">Total Earnings</div>
                    <div className="font-medium text-green-600">$0.00</div>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b">
                    <div className="text-gray-600">Average Rating</div>
                    <div className="font-medium">0.0</div>
                  </div>
                </div>

                <div className="mt-6">
                  <Link href="/applications">
                    <Button variant="outline" className="w-full">
                      View All Applications
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security Settings
                </CardTitle>
                <CardDescription>Manage your password and security preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Password</h3>
                    <p className="text-gray-600 mb-4">Your password was last changed on January 15, 2024</p>
                    <Button onClick={changePassword}>Change Password</Button>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-2">Two-Factor Authentication</h3>
                    <p className="text-gray-600 mb-4">Add an extra layer of security to your account</p>
                    <div className="flex items-center space-x-4">
                      <Button variant="outline" onClick={enable2FA}>
                        Enable 2FA
                      </Button>
                      <Badge variant="outline" className="text-orange-600 border-orange-200">
                        Coming Soon
                      </Badge>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-2">Login Sessions</h3>
                    <p className="text-gray-600 mb-4">Manage your active sessions and sign out from other devices</p>
                    <div className="flex items-center space-x-4">
                      <Button variant="outline" onClick={manageSessions}>
                        Manage Sessions
                      </Button>
                      <Badge variant="outline" className="text-orange-600 border-orange-200">
                        Coming Soon
                      </Badge>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-2">Account Security</h3>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-green-800 font-medium">Your account is secure</span>
                      </div>
                      <p className="text-green-700 text-sm mt-1">
                        No suspicious activity detected. Last login: Today at {new Date().toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preferences">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose which emails and notifications you'd like to receive</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notify-jobs">New job opportunities</Label>
                      <p className="text-sm text-gray-500">Get notified when new jobs match your preferences</p>
                    </div>
                    <Switch
                      id="notify-jobs"
                      checked={notifications.jobs}
                      onCheckedChange={(checked) => handleNotificationChange("jobs", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notify-applications">Application updates</Label>
                      <p className="text-sm text-gray-500">Updates on your job applications and status changes</p>
                    </div>
                    <Switch
                      id="notify-applications"
                      checked={notifications.applications}
                      onCheckedChange={(checked) => handleNotificationChange("applications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notify-payments">Payment notifications</Label>
                      <p className="text-sm text-gray-500">Alerts about payments and earnings</p>
                    </div>
                    <Switch
                      id="notify-payments"
                      checked={notifications.payments}
                      onCheckedChange={(checked) => handleNotificationChange("payments", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notify-marketing">Marketing and promotions</Label>
                      <p className="text-sm text-gray-500">Special offers and platform updates</p>
                    </div>
                    <Switch
                      id="notify-marketing"
                      checked={notifications.marketing}
                      onCheckedChange={(checked) => handleNotificationChange("marketing", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Account Preferences
                </CardTitle>
                <CardDescription>Customize your account settings and job preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={preferences.language}
                        onValueChange={(value) => handlePreferenceChange("language", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="region">Region</Label>
                      <Select
                        value={preferences.region}
                        onValueChange={(value) => handlePreferenceChange("region", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="eu">Europe</SelectItem>
                          <SelectItem value="asia">Asia</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email-frequency">Email Frequency</Label>
                    <Select
                      value={preferences.emailFrequency}
                      onValueChange={(value) => handlePreferenceChange("emailFrequency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="daily">Daily digest</SelectItem>
                        <SelectItem value="weekly">Weekly summary</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="job-alerts">Job Alerts</Label>
                      <p className="text-sm text-gray-500">Receive alerts for jobs matching your skills</p>
                    </div>
                    <Switch
                      id="job-alerts"
                      checked={preferences.jobAlerts}
                      onCheckedChange={(checked) => handlePreferenceChange("jobAlerts", checked)}
                    />
                  </div>

                  <div className="pt-4">
                    <Button onClick={savePreferences} className="w-full md:w-auto">
                      Update Preferences
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
