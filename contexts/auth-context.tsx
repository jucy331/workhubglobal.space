"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth"
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  isPreview: boolean
  initError: string | null
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>
}

export interface UserProfile {
  uid: string
  email: string
  fullName: string
  isActivated: boolean
  activationPending: boolean
  createdAt: any
  updatedAt: any
  applications?: string[]
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Check if we're in a preview environment
const isPreviewEnvironment =
  process.env.NODE_ENV !== "production" ||
  process.env.VERCEL_ENV === "preview" ||
  process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [initError, setInitError] = useState<string | null>(null)
  const [isPreview, setIsPreview] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if we're in a preview environment
    if (isPreviewEnvironment) {
      console.log("Running in preview environment, using mock authentication")
      setIsPreview(true)

      // For preview, create a mock user profile
      const mockProfile: UserProfile = {
        uid: "preview-user-id",
        email: "preview@example.com",
        fullName: "Preview User",
        isActivated: true,
        activationPending: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        applications: [],
      }

      setUserProfile(mockProfile)
      setLoading(false)
      return () => {}
    }

    // Check if Firebase auth is available
    if (!auth) {
      console.error("Firebase auth not initialized")
      setInitError("Firebase authentication not initialized. Please check your configuration.")
      setLoading(false)
      return () => {}
    }

    console.log("Setting up auth state listener")

    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        console.log("Auth state changed:", user ? `User logged in: ${user.email}` : "No user")
        setUser(user)

        if (user) {
          try {
            // Fetch user profile from Firestore
            if (db) {
              console.log("Fetching user profile from Firestore")
              const userDoc = await getDoc(doc(db, "users", user.uid))
              if (userDoc.exists()) {
                console.log("User profile found")
                const profile = userDoc.data() as UserProfile
                setUserProfile(profile)

                // Store user data in localStorage for consistent access across components
                localStorage.setItem(
                  "user_data",
                  JSON.stringify({
                    name: profile.fullName,
                    email: profile.email,
                  }),
                )

                // Store activation status
                localStorage.setItem("account_activated", profile.isActivated.toString())
              } else {
                console.log("No user profile found in Firestore")
              }
            } else {
              console.error("Firestore not initialized, cannot fetch user profile")
            }
          } catch (error) {
            console.error("Error fetching user profile:", error)
          }
        } else {
          setUserProfile(null)
          // Clear localStorage when user logs out
          localStorage.removeItem("user_data")
          localStorage.removeItem("account_activated")
        }

        setLoading(false)
      },
      (error) => {
        console.error("Auth state change error:", error)
        setInitError(`Firebase authentication error: ${error.message}`)
        setLoading(false)
      },
    )

    return () => {
      console.log("Cleaning up auth state listener")
      unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, fullName: string) => {
    if (isPreview) {
      console.log("Sign up called in preview mode with:", { email, fullName })

      // Simulate successful signup in preview
      const mockProfile: UserProfile = {
        uid: "preview-user-id",
        email,
        fullName,
        isActivated: false,
        activationPending: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        applications: [],
      }

      setUserProfile(mockProfile)

      // Store in localStorage for consistency
      localStorage.setItem(
        "user_data",
        JSON.stringify({
          name: fullName,
          email,
        }),
      )
      localStorage.setItem("account_activated", "false")

      return
    }

    if (!auth || !db) {
      throw new Error("Firebase services not initialized. Please check your configuration.")
    }

    try {
      setLoading(true)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Update user profile in Firebase Auth
      await updateProfile(user, {
        displayName: fullName,
      })

      // Create user document in Firestore
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email || email,
        fullName,
        isActivated: false,
        activationPending: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        applications: [],
      }

      await setDoc(doc(db, "users", user.uid), userProfile)
      setUserProfile(userProfile)

      // Store in localStorage for consistency
      localStorage.setItem(
        "user_data",
        JSON.stringify({
          name: fullName,
          email,
        }),
      )
      localStorage.setItem("account_activated", "false")

      return
    } catch (error) {
      console.error("Error signing up:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    if (isPreview) {
      console.log("Login called in preview mode with:", { email })

      // Simulate successful login in preview
      const mockProfile: UserProfile = {
        uid: "preview-user-id",
        email,
        fullName: "Preview User",
        isActivated: true,
        activationPending: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        applications: [],
      }

      setUserProfile(mockProfile)

      // Store in localStorage for consistency
      localStorage.setItem(
        "user_data",
        JSON.stringify({
          name: "Preview User",
          email,
        }),
      )
      localStorage.setItem("account_activated", "true")

      return
    }

    if (!auth) {
      throw new Error("Firebase services not initialized. Please check your configuration.")
    }

    try {
      setLoading(true)
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error("Error logging in:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    if (isPreview) {
      console.log("Logout called in preview mode")
      setUserProfile(null)
      localStorage.removeItem("user_data")
      localStorage.removeItem("account_activated")
      router.push("/")
      return
    }

    if (!auth) {
      throw new Error("Firebase services not initialized. Please check your configuration.")
    }

    try {
      await signOut(auth)
      router.push("/")
    } catch (error) {
      console.error("Error logging out:", error)
      throw error
    }
  }

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (isPreview) {
      console.log("Update profile called in preview mode with:", data)
      const updatedProfile = userProfile ? { ...userProfile, ...data } : null
      setUserProfile(updatedProfile)

      // Update localStorage if fullName or email changed
      if (updatedProfile && (data.fullName || data.email)) {
        localStorage.setItem(
          "user_data",
          JSON.stringify({
            name: updatedProfile.fullName,
            email: updatedProfile.email,
          }),
        )
      }

      // Update activation status if changed
      if (data.isActivated !== undefined) {
        localStorage.setItem("account_activated", data.isActivated.toString())
      }

      return
    }

    if (!user || !db) {
      throw new Error("User not authenticated or Firebase not initialized")
    }

    try {
      const userRef = doc(db, "users", user.uid)
      await updateDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp(),
      })

      // Update local state
      const updatedProfile = userProfile ? { ...userProfile, ...data } : null
      setUserProfile(updatedProfile)

      // Update localStorage if fullName or email changed
      if (updatedProfile && (data.fullName || data.email)) {
        localStorage.setItem(
          "user_data",
          JSON.stringify({
            name: updatedProfile.fullName,
            email: updatedProfile.email,
          }),
        )
      }

      // Update activation status if changed
      if (data.isActivated !== undefined) {
        localStorage.setItem("account_activated", data.isActivated.toString())
      }
    } catch (error) {
      console.error("Error updating user profile:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        isPreview,
        initError,
        signUp,
        login,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
