"use client"

import Link from "next/link"
import { UserAccountDropdown } from "./user-account-dropdown"
import { useAuth } from "@/contexts/auth-context"

export function Header() {
  const { user, userProfile, loading } = useAuth()

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
          {!loading && user && userProfile ? (
            <UserAccountDropdown />
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
