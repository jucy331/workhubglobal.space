"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, User, Mail, Calendar, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"

export default function AccountPage() {
  const router = useRouter()
  const { userProfile, loading, isPreview } = useAuth()
  const [accountCreationDate, setAccountCreationDate] = useState<string>("")

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
                    <div className="font-medium">12</div>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b">
                    <div className="text-gray-600">Accepted Applications</div>
                    <div className="font-medium">8</div>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b">
                    <div className="text-gray-600">Completed Jobs</div>
                    <div className="font-medium">15</div>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b">
                    <div className="text-gray-600">Total Earnings</div>
                    <div className="font-medium text-green-600">$245.50</div>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b">
                    <div className="text-gray-600">Average Rating</div>
                    <div className="font-medium">4.8/5.0</div>
                  </div>
                </div>

                <div className="mt-6">
                  <Link href="/applications">
                    <Button variant="outline">View All Applications</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your password and security preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Password</h3>
                  <p className="text-gray-600 mb-4">Your password was last changed on January 15, 2024</p>
                  <Button>Change Password</Button>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-2">Two-Factor Authentication</h3>
                  <p className="text-gray-600 mb-4">Add an extra layer of security to your account</p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-2">Login Sessions</h3>
                  <p className="text-gray-600 mb-4">Manage your active sessions and sign out from other devices</p>
                  <Button variant="outline">Manage Sessions</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Account Preferences</CardTitle>
              <CardDescription>Customize your account settings and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Email Notifications</h3>
                  <p className="text-gray-600 mb-4">Choose which emails you'd like to receive</p>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="notify-jobs" className="mr-2" defaultChecked />
                      <label htmlFor="notify-jobs">New job opportunities</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="notify-applications" className="mr-2" defaultChecked />
                      <label htmlFor="notify-applications">Application updates</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="notify-payments" className="mr-2" defaultChecked />
                      <label htmlFor="notify-payments">Payment notifications</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="notify-marketing" className="mr-2" />
                      <label htmlFor="notify-marketing">Marketing and promotions</label>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-2">Job Preferences</h3>
                  <p className="text-gray-600 mb-4">Customize your job feed and recommendations</p>
                  <Button variant="outline">Update Preferences</Button>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-2">Language and Region</h3>
                  <p className="text-gray-600 mb-4">Set your preferred language and region</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                        Language
                      </label>
                      <select id="language" className="w-full p-2 border rounded-md">
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                        Region
                      </label>
                      <select id="region" className="w-full p-2 border rounded-md">
                        <option value="us">United States</option>
                        <option value="eu">Europe</option>
                        <option value="asia">Asia</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
