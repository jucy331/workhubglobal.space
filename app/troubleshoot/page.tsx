import AuthDebugger from "@/components/auth-debugger"

export default function TroubleshootPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Authentication Troubleshooter</h1>
        <p className="text-gray-600 mb-8">Use this tool to diagnose issues with Firebase authentication</p>

        <AuthDebugger />

        <div className="mt-8 bg-gray-50 p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Common Authentication Issues</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium">1. Missing Environment Variables</h3>
              <p className="text-gray-600">
                Ensure all Firebase configuration variables are correctly set in your Vercel project settings.
              </p>
            </div>

            <div>
              <h3 className="font-medium">2. Authentication Not Enabled</h3>
              <p className="text-gray-600">
                In the Firebase console, go to Authentication → Sign-in method and enable Email/Password authentication.
              </p>
            </div>

            <div>
              <h3 className="font-medium">3. API Restrictions</h3>
              <p className="text-gray-600">
                If you've restricted your Firebase API key, make sure your website's domain is in the allowed list.
              </p>
            </div>

            <div>
              <h3 className="font-medium">4. CORS Issues</h3>
              <p className="text-gray-600">
                Add your domain to the authorized domains list in Firebase Authentication settings.
              </p>
            </div>

            <div>
              <h3 className="font-medium">5. Deployment Cache</h3>
              <p className="text-gray-600">
                Try redeploying your application after making changes to environment variables.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
