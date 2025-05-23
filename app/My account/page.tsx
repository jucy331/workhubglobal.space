"use client"

import { useAuth } from "@/contexts/auth-context"
import { User, Mail, CheckCircle, Crown } from "lucide-react"

export default function AccountPage() {
  const { userProfile, user } = useAuth()

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-4xl font-bold mb-6 flex items-center gap-3">
        <User className="h-8 w-8 text-blue-600" />
        My Account
      </h1>
      <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-gradient-to-br from-blue-500 to-purple-600 h-16 w-16 flex items-center justify-center text-white text-2xl font-bold">
            {(userProfile?.fullName || user?.displayName || "AC")
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .substring(0, 2)}
          </div>
          <div>
            <div className="text-xl font-semibold">{userProfile?.fullName || user?.displayName || "Account"}</div>
            <div className="flex items-center gap-2 mt-1">
              {userProfile?.isActivated ? (
                <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                  <Crown className="h-4 w-4 mr-1" /> Activated
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
                  Free Account
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-700">
            <Mail className="h-5 w-5 text-blue-500" />
            <span>{userProfile?.email || user?.email || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>
              Status:{" "}
              {userProfile?.isActivated ? (
                <span className="text-green-700 font-medium">Activated</span>
              ) : (
                <span className="text-gray-700">Free Account</span>
              )}
            </span>
          </div>
        </div>
        <div className="pt-4 border-t">
          <p className="text-gray-500 text-sm">
            Need to update your info? Contact support or visit the <a href="/settings" className="text-blue-600 underline">Settings</a> page.
          </p>
        </div>
      </div>
    </div>
  )
}
