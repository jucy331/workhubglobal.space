"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Info, Loader2 } from "lucide-react"
import { auth } from "@/lib/firebase"

export default function AuthDebugger() {
  const [isChecking, setIsChecking] = useState(false)
  const [results, setResults] = useState<{
    envVars: { name: string; status: "ok" | "missing" | "partial"; value?: string }[]
    firebaseInit: { status: "ok" | "error"; message: string }
    authMethods: { status: "ok" | "error"; message: string }
  } | null>(null)

  const checkFirebaseConfig = async () => {
    setIsChecking(true)

    try {
      // Check environment variables
      const envVars = [
        {
          name: "NEXT_PUBLIC_FIREBASE_API_KEY",
          value: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          status: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "ok" : "missing",
        },
        {
          name: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
          value: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          status: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "ok" : "missing",
        },
        {
          name: "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
          value: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          status: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "ok" : "missing",
        },
        {
          name: "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
          value: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          status: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? "ok" : "missing",
        },
        {
          name: "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
          value: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          status: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? "ok" : "missing",
        },
        {
          name: "NEXT_PUBLIC_FIREBASE_APP_ID",
          value: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
          status: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? "ok" : "missing",
        },
      ] as { name: string; status: "ok" | "missing" | "partial"; value?: string }[]

      // Check Firebase initialization
      let firebaseInit = { status: "error" as const, message: "Firebase auth is not initialized" }
      if (auth) {
        firebaseInit = { status: "ok" as const, message: "Firebase auth is initialized" }
      }

      // Check if authentication methods are enabled
      let authMethods = { status: "error" as const, message: "Could not check auth methods" }

      try {
        // Try to get current user to test auth connection
        await auth?.currentUser?.reload()
        authMethods = {
          status: "ok" as const,
          message: "Connection to Firebase Auth successful",
        }
      } catch (error: any) {
        authMethods = {
          status: "error" as const,
          message: `Error connecting to Firebase Auth: ${error?.message || "Unknown error"}`,
        }
      }

      setResults({
        envVars,
        firebaseInit,
        authMethods,
      })
    } catch (error: any) {
      console.error("Error checking Firebase config:", error)
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Firebase Authentication Troubleshooter</CardTitle>
        <CardDescription>Diagnose issues with your Firebase authentication setup</CardDescription>
      </CardHeader>
      <CardContent>
        {!results ? (
          <div className="text-center">
            <p className="mb-4 text-gray-600">
              This tool will check your Firebase configuration and help identify authentication issues.
            </p>
            <Button onClick={checkFirebaseConfig} disabled={isChecking}>
              {isChecking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                "Run Diagnostics"
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Environment Variables</h3>
              <div className="space-y-2">
                {results.envVars.map((env) => (
                  <div key={env.name} className="flex items-start gap-2">
                    {env.status === "ok" ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium">{env.name}</p>
                      <p className="text-sm text-gray-500">
                        {env.status === "ok"
                          ? `Present: ${env.value?.substring(0, 3)}...${env.value?.substring(env.value.length - 3)}`
                          : "Missing or empty"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Firebase Initialization</h3>
              <Alert variant={results.firebaseInit.status === "ok" ? "default" : "destructive"}>
                {results.firebaseInit.status === "ok" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertTitle>{results.firebaseInit.status === "ok" ? "Success" : "Error"}</AlertTitle>
                <AlertDescription>{results.firebaseInit.message}</AlertDescription>
              </Alert>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Authentication Methods</h3>
              <Alert variant={results.authMethods.status === "ok" ? "default" : "destructive"}>
                {results.authMethods.status === "ok" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertTitle>{results.authMethods.status === "ok" ? "Success" : "Error"}</AlertTitle>
                <AlertDescription>{results.authMethods.message}</AlertDescription>
              </Alert>
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertTitle>Next Steps</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Make sure all environment variables are correctly set in your Vercel project</li>
                  <li>Verify that Email/Password authentication is enabled in your Firebase console</li>
                  <li>Check that your Firebase project's API key is not restricted</li>
                  <li>Try redeploying your application after fixing any issues</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setResults(null)}>
                Back
              </Button>
              <Button onClick={checkFirebaseConfig} disabled={isChecking}>
                {isChecking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  "Run Again"
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
