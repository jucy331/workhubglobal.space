"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, Briefcase } from "lucide-react"
import { UserAccountDropdown } from "./user-account-dropdown"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"

export function Header() {
  const { user, userProfile, loading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check authentication from multiple sources
    const checkAuth = () => {
      // Check auth context
      if (user || userProfile) {
        setIsAuthenticated(true)
        return
      }

      // Fallback to localStorage
      try {
        const userData = localStorage.getItem("user_data")
        if (userData) {
          setIsAuthenticated(true)
          return
        }
      } catch (error) {
        console.error("Error reading from localStorage:", error)
      }

      setIsAuthenticated(false)
    }

    checkAuth()
  }, [user, userProfile])

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/jobs" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg group-hover:scale-105 transition-transform">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              WorkHub Global
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/jobs"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors relative group"
            >
              Jobs
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
            </Link>
            {isAuthenticated && (
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors relative group"
              >
                Dashboard
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
              </Link>
            )}
            <Link
              href="/support"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors relative group"
            >
              Support
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link
              href="/faq"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors relative group"
            >
              FAQ
              <span className="absolute -bottom-1 left-0 w-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
            </Link>
          </nav>

          {/* User Account / Sign In */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <UserAccountDropdown />
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-gray-700 hover:text-blue-600">
                    Sign In
                  </Button>
                </Link>
                <Link href="/create-account">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white/95 backdrop-blur-md">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/jobs"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Jobs
              </Link>
              {isAuthenticated && (
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              <Link
                href="/support"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Support
              </Link>
              <Link
                href="/faq"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              {!isAuthenticated && (
                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/create-account" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

// Also export as default for backward compatibility
export default Header
