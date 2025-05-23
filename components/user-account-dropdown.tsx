"use client"
import Link from "next/link"
import { LogOut, Settings, User, LayoutDashboard, FileText, CheckCircle, Crown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { useEffect, useState } from "react"

export function UserAccountDropdown() {
  const { userProfile, logout, user } = useAuth()
  const [userData, setUserData] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    // Try to get user data from localStorage as fallback
    try {
      const storedData = localStorage.getItem("user_data")
      if (storedData) {
        setUserData(JSON.parse(storedData))
      }
    } catch (error) {
      console.error("Error reading user data from localStorage:", error)
    }
  }, [])

  // Get initials from user's full name
  const getInitials = (name: string) => {
    if (!name || typeof name !== "string") return "AC"

    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Use userProfile.fullName, user.displayName, localStorage data, or fallback
  const displayName = userProfile?.fullName || user?.displayName || userData?.name || "Account"
  const displayEmail = userProfile?.email || user?.email || userData?.email || ""
  const initials = getInitials(displayName)

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-blue-500/20 transition-all"
        >
          <Avatar className="h-10 w-10 ring-2 ring-white shadow-lg">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          {userProfile?.isActivated && (
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <CheckCircle className="h-2.5 w-2.5 text-white" />
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <div className="flex flex-col space-y-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
              <p className="text-xs text-gray-600 truncate">{displayEmail}</p>
              <div className="flex items-center space-x-2 mt-1">
                {userProfile?.isActivated ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                    <Crown className="h-3 w-3 mr-1" />
                    Activated
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    Free Account
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="flex w-full cursor-pointer items-center">
            <LayoutDashboard className="mr-3 h-4 w-4 text-gray-500" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/applications" className="flex w-full cursor-pointer items-center">
            <FileText className="mr-3 h-4 w-4 text-gray-500" />
            <span>My Applications</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account" className="flex w-full cursor-pointer items-center">
            <User className="mr-3 h-4 w-4 text-gray-500" />
            <span>My Account</span>
          </Link>
        </DropdownMenuItem>
        {!userProfile?.isActivated && (
          <DropdownMenuItem asChild>
            <Link href="/activate" className="flex w-full cursor-pointer items-center text-blue-600">
              <CheckCircle className="mr-3 h-4 w-4" />
              <span>Activate Account</span>
              <Badge className="ml-auto bg-blue-100 text-blue-800 text-xs">$5.00</Badge>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex w-full cursor-pointer items-center">
            <Settings className="mr-3 h-4 w-4 text-gray-500" />
            <span>Profile Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex cursor-pointer items-center text-red-600 focus:text-red-600 focus:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span>Log Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
