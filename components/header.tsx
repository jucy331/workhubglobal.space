"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { UserAccountDropdown } from "./user-account-dropdown"

export default function Header() {
  const [user, setUser] = useState<{ name: string; email: string; isActivated: boolean } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const checkUserLoggedIn = () => {
      // In a real app, this would check with your auth system
      // For demo purposes, we'll simulate a logged in user
      const mockUser = {
        name: "John Doe",
        email: "john.doe@example.com",
        isActivated: localStorage.getItem("account_activated") === "true",
      }

      setUser(mockUser)
      setLoading(false)
    }

    checkUserLoggedIn()
  }, [])

  const handleLogout = () => {
    // In a real app, this would call your logout API
    console.log("Logging out...")
    // For demo purposes, we'll just clear localStorage
    localStorage.removeItem("account_activated")
    // Redirect to login page
    window.location.href = "/login"
  }

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/jobs" className="text-xl font-bold">
          WorkHubGlobal
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/jobs" className="text-sm font-medium hover:text-gray-900">
            Jobs
          </Link>
          <Link href="/faq" className="text-sm font-medium hover:text-gray-900">
            FAQ
          </Link>
          <Link href="/support" className="text-sm font-medium hover:text-gray-900">
            Support
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {!loading && user ? (
            <UserAccountDropdown user={user} onLogout={handleLogout} />
          ) : (
            <Link href="/login">
              <button className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
                Sign In
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
