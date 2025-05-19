"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"
import FirebaseError from "@/components/firebase-error"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireActivation?: boolean
}

export default function ProtectedRoute({ children, requireActivation = false }: ProtectedRouteProps) {
  const { user, userProfile, loading, initError, isPreview } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Skip authentication checks in preview mode
    if (isPreview) return

    if (!loading && !initError) {
      if (!user) {
        router.push("/login?redirect=" + encodeURIComponent(window.location.pathname))
      } else if (requireActivation && userProfile && !userProfile.isActivated) {
        router.push("/activate-account")
      }
    }
  }, [user, userProfile, loading, router, requireActivation, initError, isPreview])

  if (initError && !isPreview) {
    return <FirebaseError error={initError} />
  }

  if (loading && !isPreview) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // In preview mode, always render the children
  if (isPreview) {
    return <>{children}</>
  }

  if (!user) {
    return null
  }

  if (requireActivation && userProfile && !userProfile.isActivated) {
    return null
  }

  return <>{children}</>
}
