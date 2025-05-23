"use client"
import Link from "next/link"
import { LogOut, Settings, User, LayoutDashboard, FileText, CheckCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { useEffect, useState } from "react"

export function UserAccountDropdown() {
  const { user, logout } = useAuth()
  const [userData, setUserData] = useState<{
    name: string
    email: string
    isActivated?: boolean
  }>({
    name: "Account",
    email: "",
    isActivated: false,
  })

  useEffect(() => {
    // Try to get user data from localStorage
    try {
      const storedUserData = localStorage.getItem("user_data")
      const isActivated = localStorage.getItem("account_activated") === "true"

      if (storedUserData) {
        const parsedData = JSON.parse(storedUserData)
        setUserData({
          ...parsedData,
          isActivated,
        })
      } else if (user) {
        // If no stored data but we have auth user
        setUserData({
          name: user.displayName || "Account",
          email: user.email || "",
          isActivated,
        })
      }
    } catch (e) {
      console.error("Failed to parse user data", e)
    }
  }, [user])

  // Get initials from user name
  const getInitials = (name: string) => {
    if (!name || typeof name !== "string") return "AC"

    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const initials = getInitials(userData.name)

  const handleLogout = async () => {
    try {
      await logout()
      // Clear localStorage data
      localStorage.removeItem("user_data")
      localStorage.removeItem("account_activated")
      // Redirect to login page
      window.location.href = "/login"
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gray-100 text-gray-800">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex flex-col space-y-1 p-2">
          <p className="text-sm font-medium">{userData.name}</p>
          <p className="text-xs text-muted-foreground">{userData.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account" className="flex w-full cursor-pointer items-center">
            <User className="mr-2 h-4 w-4" />
            <span>My Account</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="flex w-full cursor-pointer items-center">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/applications" className="flex w-full cursor-pointer items-center">
            <FileText className="mr-2 h-4 w-4" />
            <span>My Applications</span>
          </Link>
        </DropdownMenuItem>
        {!userData.isActivated && (
          <DropdownMenuItem asChild>
            <Link href="/activate" className="flex w-full cursor-pointer items-center">
              <CheckCircle className="mr-2 h-4 w-4" />
              <span>Activate Account</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex w-full cursor-pointer items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex cursor-pointer items-center text-red-500 focus:text-red-500"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
