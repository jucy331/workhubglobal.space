"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

export default function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { userProfile, loading, updateUserProfile, isPreview } = useAuth()

  const [profileForm, setProfileForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    bio: "",
  })

  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (!loading && !userProfile && !isPreview) {
      router.push("/login?redirect=/settings")
    }

    // Populate form with user data
    if (userProfile) {
      setProfileForm({
        fullName: userProfile.fullName || "",
        email: userProfile.email || "",
        phone: "", // This would come from userProfile if available
        bio: "", // This would come from userProfile if available
      })
    }
  }, [userProfile, loading, router, isPreview])

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Update user profile
      await updateUserProfile({
        fullName: profileForm.fullName,
        // Only update email if it's different and not empty
        ...(profileForm.email !== userProfile?.email && profileForm.email ? { email: profileForm.email } : {}),
      })

      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading settings...</div>
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
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-2">Update your profile information and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <form onSubmit={handleProfileSubmit}>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={profileForm.fullName}
                    onChange={handleProfileChange}
                    placeholder="Your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    placeholder="Your email address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    placeholder="Your phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio (Optional)</Label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={profileForm.bio}
                    onChange={handleProfileChange}
                    placeholder="Tell us a bit about yourself"
                    className="w-full p-2 border rounded-md min-h-[100px]"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSaving} className="flex items-center">
                  {isSaving ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Account Type</h3>
                <p className="text-gray-600 mb-4">
                  {userProfile?.isActivated
                    ? "Your account is activated with full access to all features."
                    : "You have a free account with limited access to features."}
                </p>
                {!userProfile?.isActivated && (
                  <Link href="/jobs">
                    <Button>Activate Account ($5.00)</Button>
                  </Link>
                )}
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-2">Password</h3>
                <p className="text-gray-600 mb-4">Change your account password</p>
                <Button variant="outline">Change Password</Button>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-2">Delete Account</h3>
                <p className="text-gray-600 mb-4">Permanently delete your account and all data</p>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Control which notifications you receive</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Email Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Job Recommendations</p>
                        <p className="text-sm text-gray-600">Receive personalized job recommendations</p>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="job-recommendations" className="mr-2" defaultChecked />
                        <label htmlFor="job-recommendations" className="sr-only">
                          Job Recommendations
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Application Updates</p>
                        <p className="text-sm text-gray-600">Get notified about your application status</p>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="application-updates" className="mr-2" defaultChecked />
                        <label htmlFor="application-updates" className="sr-only">
                          Application Updates
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Payment Notifications</p>
                        <p className="text-sm text-gray-600">Receive alerts about payments</p>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="payment-notifications" className="mr-2" defaultChecked />
                        <label htmlFor="payment-notifications" className="sr-only">
                          Payment Notifications
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Platform Updates</p>
                        <p className="text-sm text-gray-600">Stay informed about new features and updates</p>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="platform-updates" className="mr-2" defaultChecked />
                        <label htmlFor="platform-updates" className="sr-only">
                          Platform Updates
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Marketing Emails</p>
                        <p className="text-sm text-gray-600">Receive promotional offers and newsletters</p>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="marketing-emails" className="mr-2" />
                        <label htmlFor="marketing-emails" className="sr-only">
                          Marketing Emails
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button className="mt-4">Save Notification Preferences</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
