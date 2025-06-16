"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

// Import Firebase types and functions with error handling
let firebaseAuth: any = null
let firebaseFirestore: any = null

try {
  const firebaseAuthModule = require("firebase/auth")
  const firestoreModule = require("firebase/firestore")

  firebaseAuth = firebaseAuthModule
  firebaseFirestore = firestoreModule
} catch (error) {
  console.warn("Firebase modules not available:", error)
}

interface AuthContextType {
  user: any | null
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
  role?: "user" | "admin" | "employer"
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Check if we're in a preview environment
const isPreviewEnvironment =
  typeof window !== "undefined" &&
  (process.env.NODE_ENV !== "production" ||
    process.env.VERCEL_ENV === "preview" ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === "preview" ||
    window.location.hostname.includes("vercel.app") ||
    window.location.hostname.includes("localhost"))

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [initError, setInitError] = useState<string | null>(null)
  const [isPreview, setIsPreview] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Always check for preview environment first
    if (isPreviewEnvironment) {
      console.log("Running in preview environment, using mock authentication")
      setIsPreview(true)
      setLoading(false)
      return () => {}
    }

    // Try to initialize Firebase auth
    let auth: any = null
    let db: any = null

    try {
      const firebaseModule = require("@/lib/firebase")
      auth = firebaseModule.auth
      db = firebaseModule.db

      if (!auth) {
        throw new Error("Firebase auth not initialized")
      }
    } catch (error) {
      console.error("Firebase initialization error:", error)
      setInitError("Firebase authentication not available. Running in preview mode.")
      setIsPreview(true)
      setLoading(false)
      return () => {}
    }

    console.log("Setting up auth state listener")

    const unsubscribe = firebaseAuth.onAuthStateChanged(
      auth,
      async (user: any) => {
        console.log("Auth state changed:", user ? `User logged in: ${user.email}` : "No user")
        setUser(user)

        if (user) {
          try {
            // Fetch user profile from Firestore
            if (db) {
              console.log("Fetching user profile from Firestore")
              const userDoc = await firebaseFirestore.getDoc(firebaseFirestore.doc(db, "users", user.uid))
              if (userDoc.exists()) {
                console.log("User profile found")
                const profile = userDoc.data() as UserProfile
                setUserProfile(profile)

                // Store user data in localStorage for consistent access
                localStorage.setItem(
                  "user_data",
                  JSON.stringify({
                    name: profile.fullName,
                    email: profile.email,
                    role: profile.role || "user",
                  }),
                )
                localStorage.setItem("account_activated", profile.isActivated.toString())
              } else {
                console.log("No user profile found, creating basic profile")
                const basicProfile: UserProfile = {
                  uid: user.uid,
                  email: user.email || "",
                  fullName: user.displayName || "User",
                  isActivated: false,
                  activationPending: false,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  applications: [],
                  role: "user",
                }
                setUserProfile(basicProfile)

                // Create profile in Firestore
                if (db) {
                  await firebaseFirestore.setDoc(firebaseFirestore.doc(db, "users", user.uid), {
                    ...basicProfile,
                    createdAt: firebaseFirestore.serverTimestamp(),
                    updatedAt: firebaseFirestore.serverTimestamp(),
                  })
                }

                localStorage.setItem(
                  "user_data",
                  JSON.stringify({
                    name: basicProfile.fullName,
                    email: basicProfile.email,
                    role: "user",
                  }),
                )
                localStorage.setItem("account_activated", "false")
              }
            }
          } catch (error) {
            console.error("Error fetching user profile:", error)
            // Still set a basic profile so the UI can function
            const basicProfile: UserProfile = {
              uid: user.uid,
              email: user.email || "",
              fullName: user.displayName || "User",
              isActivated: false,
              activationPending: false,
              createdAt: new Date(),
              updatedAt: new Date(),
              applications: [],
              role: "user",
            }
            setUserProfile(basicProfile)
          }
        } else {
          setUserProfile(null)
          localStorage.removeItem("user_data")
          localStorage.removeItem("account_activated")
        }

        setLoading(false)
      },
      (error: any) => {
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
      console.log("Sign up called in preview mode")
      const mockProfile: UserProfile = {
        uid: "preview-user-id",
        email,
        fullName,
        isActivated: false,
        activationPending: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        applications: [],
        role: "user",
      }

      setUserProfile(mockProfile)
      localStorage.setItem(
        "user_data",
        JSON.stringify({
          name: fullName,
          email,
          role: "user",
        }),
      )
      localStorage.setItem("account_activated", "false")
      return
    }

    try {
      const firebaseModule = require("@/lib/firebase")
      const auth = firebaseModule.auth
      const db = firebaseModule.db

      if (!auth || !db) {
        throw new Error("Firebase services not initialized")
      }

      const userCredential = await firebaseAuth.createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      await firebaseAuth.updateProfile(user, { displayName: fullName })

      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email || email,
        fullName,
        isActivated: false,
        activationPending: false,
        createdAt: firebaseFirestore.serverTimestamp(),
        updatedAt: firebaseFirestore.serverTimestamp(),
        applications: [],
        role: "user",
      }

      await firebaseFirestore.setDoc(firebaseFirestore.doc(db, "users", user.uid), userProfile)
      setUserProfile(userProfile)

      localStorage.setItem(
        "user_data",
        JSON.stringify({
          name: fullName,
          email,
          role: "user",
        }),
      )
      localStorage.setItem("account_activated", "false")
    } catch (error) {
      console.error("Error signing up:", error)
      throw error
    }
  }

  const login = async (email: string, password: string) => {
    if (isPreview) {
      console.log("Login called in preview mode")
      const mockProfile: UserProfile = {
        uid: "preview-user-id",
        email,
        fullName: "Preview User",
        isActivated: true,
        activationPending: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        applications: [],
        role: email.includes("admin") ? "admin" : "user",
      }

      setUserProfile(mockProfile)
      localStorage.setItem(
        "user_data",
        JSON.stringify({
          name: "Preview User",
          email,
          role: mockProfile.role,
        }),
      )
      localStorage.setItem("account_activated", "true")
      return
    }

    try {
      const firebaseModule = require("@/lib/firebase")
      const auth = firebaseModule.auth

      if (!auth) {
        throw new Error("Firebase services not initialized")
      }

      await firebaseAuth.signInWithEmailAndPassword(auth, email, password)
      // Profile will be loaded by the auth state listener
    } catch (error) {
      console.error("Error logging in:", error)
      throw error
    }
  }

  const logout = async () => {
    if (isPreview) {
      setUserProfile(null)
      localStorage.removeItem("user_data")
      localStorage.removeItem("account_activated")
      router.push("/")
      return
    }

    try {
      const firebaseModule = require("@/lib/firebase")
      const auth = firebaseModule.auth

      if (!auth) {
        throw new Error("Firebase services not initialized")
      }

      await firebaseAuth.signOut(auth)
      router.push("/")
    } catch (error) {
      console.error("Error logging out:", error)
      throw error
    }
  }

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (isPreview) {
      const updatedProfile = userProfile ? { ...userProfile, ...data } : null
      setUserProfile(updatedProfile)

      if (updatedProfile && (data.fullName || data.email || data.role)) {
        localStorage.setItem(
          "user_data",
          JSON.stringify({
            name: updatedProfile.fullName,
            email: updatedProfile.email,
            role: updatedProfile.role || "user",
          }),
        )
      }

      if (data.isActivated !== undefined) {
        localStorage.setItem("account_activated", data.isActivated.toString())
      }
      return
    }

    if (!user) {
      throw new Error("User not authenticated")
    }

    try {
      const firebaseModule = require("@/lib/firebase")
      const db = firebaseModule.db

      if (!db) {
        throw new Error("Firebase not initialized")
      }

      const userRef = firebaseFirestore.doc(db, "users", user.uid)
      await firebaseFirestore.updateDoc(userRef, {
        ...data,
        updatedAt: firebaseFirestore.serverTimestamp(),
      })

      const updatedProfile = userProfile ? { ...userProfile, ...data } : null
      setUserProfile(updatedProfile)

      if (updatedProfile && (data.fullName || data.email || data.role)) {
        localStorage.setItem(
          "user_data",
          JSON.stringify({
            name: updatedProfile.fullName,
            email: updatedProfile.email,
            role: updatedProfile.role || "user",
          }),
        )
      }

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
