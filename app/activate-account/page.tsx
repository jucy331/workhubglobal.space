"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CheckCircle2, Upload, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { doc, updateDoc, serverTimestamp } from "firebase/firestore"
import { storage, db } from "@/lib/firebase"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import ProtectedRoute from "@/components/protected-route"

export default function ActivateAccountPage() {
  const { user, userProfile, updateUserProfile } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [uploadedScreenshot, setUploadedScreenshot] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  useEffect(() => {
    if (userProfile) {
      setIsLoading(false)
    }
  }, [userProfile])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setUploadedFile(file)

      // Preview the file
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedScreenshot(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)

      // Clear any previous errors
      setUploadError(null)
    }
  }

  const handleSubmitScreenshot = async () => {
    if (!user || !uploadedFile) return

    setIsUploading(true)
    setUploadError(null)

    try {
      // Upload file to Firebase Storage
      const storageRef = ref(storage, `payment-screenshots/${user.uid}/${Date.now()}-${uploadedFile.name}`)
      await uploadBytes(storageRef, uploadedFile)

      // Get download URL
      const downloadURL = await getDownloadURL(storageRef)

      // Update user document in Firestore
      const userRef = doc(db, "users", user.uid)
      await updateDoc(userRef, {
        activationPending: true,
        paymentScreenshotURL: downloadURL,
        paymentSubmittedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      // Update local state
      await updateUserProfile({ activationPending: true })

      setUploadSuccess(true)
    } catch (error) {
      console.error("Error uploading screenshot:", error)
      setUploadError("Failed to upload screenshot. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-center">Activate Your Account</h1>
          <p className="text-gray-600 mb-8 text-center">
            Gain full access to job applications with a one-time activation fee
          </p>

          {userProfile?.isActivated ? (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                  <CardTitle>Account Already Activated</CardTitle>
                </div>
                <CardDescription>
                  Your account is already activated. You can apply for jobs without any restrictions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" asChild>
                  <Link href="/jobs">Browse Available Jobs</Link>
                </Button>
              </CardContent>
            </Card>
          ) : userProfile?.activationPending ? (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Loader2 className="h-6 w-6 text-yellow-500 animate-spin" />
                  <CardTitle>Activation Pending</CardTitle>
                </div>
                <CardDescription>Your payment is being verified. This usually takes 1-2 business days.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Once your payment is verified, your account will be activated and you'll be able to apply for jobs.
                </p>
                <Button className="w-full" asChild>
                  <Link href="/jobs">Browse Jobs</Link>
                </Button>
              </CardContent>
            </Card>
          ) : uploadSuccess ? (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                  <CardTitle>Payment Submitted!</CardTitle>
                </div>
                <CardDescription>
                  Thank you for submitting your payment. Your account activation is now pending verification.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  We'll review your payment and activate your account within 1-2 business days. You'll receive an email
                  notification once your account is activated.
                </p>
                <Button className="w-full" asChild>
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Activate your WorkHub account</CardTitle>
                  <CardDescription>Pay a one-time fee of $5 to unlock full access to job applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg border text-center">
                      <p className="font-medium text-lg">$5.00 USD</p>
                      <p className="text-sm text-gray-500">One-time payment</p>
                    </div>

                    <div className="space-y-2">
                      <Button className="w-full" asChild>
                        <a
                          href="https://www.paypal.com/ncp/payment/WDLF3BFC43H8N"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center"
                        >
                          Pay with PayPal
                        </a>
                      </Button>
                    </div>

                    <div className="text-sm text-gray-500">
                      <p>After payment, please upload your payment confirmation screenshot below.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upload Payment Confirmation</CardTitle>
                  <CardDescription>
                    After completing your payment, upload a screenshot of your PayPal receipt
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {uploadError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{uploadError}</AlertDescription>
                      </Alert>
                    )}

                    {uploadedScreenshot ? (
                      <div className="space-y-4">
                        <div className="border rounded-lg overflow-hidden">
                          <img
                            src={uploadedScreenshot || "/placeholder.svg"}
                            alt="Payment screenshot"
                            className="w-full h-auto"
                          />
                        </div>
                        <Button onClick={handleSubmitScreenshot} className="w-full" disabled={isUploading}>
                          {isUploading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            "Submit for Verification"
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div
                          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => document.getElementById("screenshot-upload")?.click()}
                        >
                          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-500">
                            Drag and drop your screenshot here, or click to browse
                          </p>
                          <p className="text-xs text-gray-400 mt-1">Supported formats: JPG, PNG, PDF (Max 5MB)</p>
                          <Input
                            type="file"
                            className="hidden"
                            accept="image/*,.pdf"
                            onChange={handleFileChange}
                            id="screenshot-upload"
                          />
                          <Label htmlFor="screenshot-upload" className="sr-only">
                            Upload screenshot
                          </Label>
                        </div>

                        <div className="text-sm text-gray-500">
                          <p className="font-medium mb-1">Why do we need this?</p>
                          <p>
                            We require payment confirmation to verify your account activation. This helps us maintain a
                            quality platform for serious job seekers.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="mt-8 bg-gray-50 rounded-lg p-6 border">
            <h2 className="font-semibold mb-3">Why activate your account?</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span>Apply to unlimited job listings</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span>Get early access to new job opportunities</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span>One-time payment, no recurring fees</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span>Secure payment through PayPal</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
