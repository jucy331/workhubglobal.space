import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface FirebaseErrorProps {
  error: string
}

export default function FirebaseError({ error }: FirebaseErrorProps) {
  const isPreview =
    process.env.NODE_ENV !== "production" ||
    process.env.VERCEL_ENV === "preview" ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Firebase Configuration Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>

        <div className="bg-gray-50 p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">How to fix this issue:</h2>

          {isPreview ? (
            <>
              <p className="mb-4">You're viewing this site in a preview environment. To enable full functionality:</p>
              <ol className="list-decimal pl-5 space-y-2 mb-6">
                <li>Deploy the project to your own Vercel account</li>
                <li>Set up a Firebase project and add the environment variables in Vercel</li>
                <li>For local development, create a .env.local file with your Firebase configuration</li>
              </ol>
            </>
          ) : (
            <ol className="list-decimal pl-5 space-y-2 mb-6">
              <li>
                Make sure you've created a Firebase project at{" "}
                <a
                  href="https://console.firebase.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  firebase.google.com
                </a>
              </li>
              <li>Add the required environment variables to your .env.local file:</li>
              <li className="pl-5 list-none">
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                  {`NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id`}
                </pre>
              </li>
              <li>Ensure the API key and other credentials are correct</li>
              <li>Restart your development server</li>
            </ol>
          )}

          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
