"use client"
import { Suspense } from "react"
import RegisterForm from "./register-form"
import { useToast } from "@/hooks/use-toast"

function RegisterPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="shadow-xl border-0 bg-white/90 backdrop-blur-sm rounded-lg p-8">
          <div className="text-center pb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded mx-auto animate-pulse"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  const { toast } = useToast()

  return (
    <Suspense fallback={<RegisterPageSkeleton />}>
      <RegisterForm />
    </Suspense>
  )
}
