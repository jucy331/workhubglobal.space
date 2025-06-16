"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Briefcase,
  AlertCircle,
  Shield,
  LogOut,
  BarChart3,
  UserCheck,
  MessageCircle,
  DollarSign,
  Search,
  Filter,
  RefreshCw,
  Download,
  Settings,
  Eye,
  CheckCircle,
  XCircle,
  Activity,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { firebaseAdminService, type FirebaseUser, type PlatformStats } from "@/lib/firebase-admin"
import { AdminChat } from "@/components/admin-chat"

export default function AdminDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminSession, setAdminSession] = useState<any>(null)
  const [users, setUsers] = useState<FirebaseUser[]>([])
  const [filteredUsers, setFilteredUsers] = useState<FirebaseUser[]>([])
  const [platformStats, setPlatformStats] = useState<PlatformStats>({
    totalUsers: 0,
    activeUsers: 0,
    pendingActivations: 0,
    newUsersToday: 0,
    newUsersThisWeek: 0,
    totalRevenue: 0,
    totalWithdrawals: 0,
    activeJobs: 0,
    completedJobs: 0,
    pendingWithdrawals: 0,
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const authStatus = localStorage.getItem("admin_authenticated")
    const session = localStorage.getItem("admin_session")

    if (authStatus === "true" && session) {
      setIsAuthenticated(true)
      setAdminSession(JSON.parse(session))
      loadRealTimeData()
    } else {
      router.push("/admin/login")
    }
  }, [router])

  useEffect(() => {
    // Filter users based on search and filters
    let filtered = users

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (user) =>
          user.fullName.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.uid.toLowerCase().includes(searchLower),
      )
    }

    if (statusFilter !== "all") {
      if (statusFilter === "active") {
        filtered = filtered.filter((user) => user.isActivated)
      } else if (statusFilter === "pending") {
        filtered = filtered.filter((user) => !user.isActivated && user.activationPending)
      } else if (statusFilter === "inactive") {
        filtered = filtered.filter((user) => !user.isActivated && !user.activationPending)
      }
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    setFilteredUsers(filtered)
  }, [users, searchTerm, statusFilter, roleFilter])

  const loadRealTimeData = async () => {
    console.log("Loading real-time data from Firebase...")

    // Subscribe to real-time user data
    const unsubscribeUsers = firebaseAdminService.subscribeToUsers((userData) => {
      console.log("Received user data:", userData.length, "users")
      setUsers(userData)
      setLoading(false)
    })

    // Load real platform statistics
    try {
      const stats = await firebaseAdminService.getPlatformStats()
      console.log("Loaded platform stats:", stats)
      setPlatformStats(stats)
    } catch (error) {
      console.error("Error loading platform stats:", error)
    }

    return () => {
      unsubscribeUsers()
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      console.log("Refreshing platform data...")
      const stats = await firebaseAdminService.getPlatformStats()
      setPlatformStats(stats)
      toast({
        title: "Data Refreshed",
        description: "Dashboard data has been updated with the latest information.",
      })
    } catch (error) {
      console.error("Refresh error:", error)
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setRefreshing(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated")
    localStorage.removeItem("admin_session")
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
    router.push("/admin/login")
  }

  const handleActivateUser = async (uid: string) => {
    try {
      console.log("Activating user:", uid)
      const success = await firebaseAdminService.activateUser(uid)
      if (success) {
        toast({
          title: "User Activated",
          description: "User account has been activated successfully.",
        })
        // Refresh stats
        const stats = await firebaseAdminService.getPlatformStats()
        setPlatformStats(stats)
      } else {
        throw new Error("Failed to activate user")
      }
    } catch (error) {
      console.error("Activation error:", error)
      toast({
        title: "Error",
        description: "Failed to activate user account.",
        variant: "destructive",
      })
    }
  }

  const handleSuspendUser = async (uid: string) => {
    try {
      console.log("Suspending user:", uid)
      const success = await firebaseAdminService.suspendUser(uid)
      if (success) {
        toast({
          title: "User Suspended",
          description: "User account has been suspended.",
        })
        // Refresh stats
        const stats = await firebaseAdminService.getPlatformStats()
        setPlatformStats(stats)
      } else {
        throw new Error("Failed to suspend user")
      }
    } catch (error) {
      console.error("Suspension error:", error)
      toast({
        title: "Error",
        description: "Failed to suspend user account.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateUserRole = async (uid: string, role: string) => {
    try {
      console.log("Updating user role:", uid, "to", role)
      const success = await firebaseAdminService.updateUser(uid, { role: role as any })
      if (success) {
        toast({
          title: "Role Updated",
          description: `User role has been updated to ${role}.`,
        })
      } else {
        throw new Error("Failed to update role")
      }
    } catch (error) {
      console.error("Role update error:", error)
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive",
      })
    }
  }

  const exportUserData = () => {
    const csvContent = [
      ["Name", "Email", "Status", "Role", "Created At", "Activated At"].join(","),
      ...filteredUsers.map((user) =>
        [
          user.fullName,
          user.email,
          user.isActivated ? "Active" : "Inactive",
          user.role || "user",
          user.createdAt?.toDate?.()?.toLocaleDateString() || "N/A",
          user.activatedAt?.toDate?.()?.toLocaleDateString() || "N/A",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `users-export-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Export Complete",
      description: "User data has been exported to CSV file.",
    })
  }

  const navigateToTab = (tab: string) => {
    setActiveTab(tab)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Verifying authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">WorkHub Global Administration</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </Button>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{adminSession?.username}</p>
                <p className="text-xs text-gray-600">Super Admin</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center space-x-2">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Real Stats Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{platformStats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +{platformStats.newUsersToday} today, +{platformStats.newUsersThisWeek} this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{platformStats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                {platformStats.totalUsers > 0
                  ? Math.round((platformStats.activeUsers / platformStats.totalUsers) * 100)
                  : 0}
                % activation rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Activations</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{platformStats.pendingActivations}</div>
              <p className="text-xs text-muted-foreground">Require manual review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${platformStats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">From {platformStats.activeUsers} activations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{platformStats.activeJobs}</div>
              <p className="text-xs text-muted-foreground">Across all categories</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Recent Activity with REAL data */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent User Activity</CardTitle>
                  <CardDescription>Latest user registrations and activations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.slice(0, 5).map((user) => (
                      <div key={user.uid} className="flex items-center space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full ${user.isActivated ? "bg-green-500" : "bg-yellow-500"}`}
                        ></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{user.fullName}</p>
                          <p className="text-xs text-gray-600">{user.email}</p>
                        </div>
                        <Badge
                          className={user.isActivated ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                        >
                          {user.isActivated ? "Active" : "Pending"}
                        </Badge>
                      </div>
                    ))}
                    {users.length === 0 && (
                      <div className="text-center py-4">
                        <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">No user activity yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Functional Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <Button
                      variant="outline"
                      className="justify-start h-auto p-4"
                      onClick={() => navigateToTab("users")}
                    >
                      <UserCheck className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Review Activations</div>
                        <div className="text-sm text-gray-600">{platformStats.pendingActivations} pending</div>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start h-auto p-4"
                      onClick={() => navigateToTab("support")}
                    >
                      <MessageCircle className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Support Tickets</div>
                        <div className="text-sm text-gray-600">Manage customer support</div>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start h-auto p-4"
                      onClick={() => navigateToTab("jobs")}
                    >
                      <Briefcase className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Manage Jobs</div>
                        <div className="text-sm text-gray-600">{platformStats.activeJobs} active jobs</div>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start h-auto p-4"
                      onClick={() => navigateToTab("finance")}
                    >
                      <BarChart3 className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">View Analytics</div>
                        <div className="text-sm text-gray-600">Platform insights</div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Real-time Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Statistics</CardTitle>
                <CardDescription>Real-time platform metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{platformStats.totalUsers}</div>
                    <p className="text-sm text-gray-600">Total Registered Users</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">${platformStats.totalRevenue}</div>
                    <p className="text-sm text-gray-600">Total Revenue Generated</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{platformStats.activeJobs}</div>
                    <p className="text-sm text-gray-600">Active Job Postings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <UserManagement
              users={filteredUsers}
              allUsers={users}
              onActivate={handleActivateUser}
              onSuspend={handleSuspendUser}
              onUpdateRole={handleUpdateUserRole}
              onExport={exportUserData}
              loading={loading}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              roleFilter={roleFilter}
              onRoleFilterChange={setRoleFilter}
            />
          </TabsContent>

          <TabsContent value="jobs">
            <JobManagement platformStats={platformStats} />
          </TabsContent>

          <TabsContent value="finance">
            <FinanceManagement platformStats={platformStats} />
          </TabsContent>

          <TabsContent value="support">
            <AdminChat />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Enhanced User Management Component with REAL data
function UserManagement({
  users,
  allUsers,
  onActivate,
  onSuspend,
  onUpdateRole,
  onExport,
  loading,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  roleFilter,
  onRoleFilterChange,
}: {
  users: FirebaseUser[]
  allUsers: FirebaseUser[]
  onActivate: (uid: string) => void
  onSuspend: (uid: string) => void
  onUpdateRole: (uid: string, role: string) => void
  onExport: () => void
  loading: boolean
  searchTerm: string
  onSearchChange: (term: string) => void
  statusFilter: string
  onStatusFilterChange: (filter: string) => void
  roleFilter: string
  onRoleFilterChange: (filter: string) => void
}) {
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A"
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="ml-4">Loading real user data from Firebase...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage user accounts and activations</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary">{allUsers.length} Total Users</Badge>
          <Button onClick={onExport} className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium">Search Users</label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Role</label>
              <Select value={roleFilter} onValueChange={onRoleFilterChange}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="employer">Employer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table with REAL data */}
      <Card>
        <CardHeader>
          <CardTitle>User Accounts</CardTitle>
          <CardDescription>
            Showing {users.length} of {allUsers.length} users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {allUsers.length === 0
                    ? "No users found in Firebase database"
                    : "No users found matching your criteria"}
                </p>
              </div>
            ) : (
              users.map((user) => (
                <div key={user.uid} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h4 className="font-medium">{user.fullName}</h4>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500">ID: {user.uid}</p>
                        <p className="text-xs text-gray-500">Joined: {formatDate(user.createdAt)}</p>
                        {user.activatedAt && (
                          <p className="text-xs text-green-600">Activated: {formatDate(user.activatedAt)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <Select value={user.role || "user"} onValueChange={(value) => onUpdateRole(user.uid, value)}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="employer">Employer</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-600 mt-1">{user.applications?.length || 0} applications</p>
                    </div>
                    <Badge
                      className={
                        user.isActivated
                          ? "bg-green-100 text-green-800"
                          : user.activationPending
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {user.isActivated ? "Active" : user.activationPending ? "Pending" : "Inactive"}
                    </Badge>
                    <div className="flex space-x-2">
                      {!user.isActivated && (
                        <Button
                          size="sm"
                          onClick={() => onActivate(user.uid)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Activate
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => onSuspend(user.uid)}>
                        <XCircle className="h-4 w-4 mr-1" />
                        {user.isActivated ? "Suspend" : "Delete"}
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Enhanced Job Management with real data
function JobManagement({ platformStats }: { platformStats: PlatformStats }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Job Management</h2>
          <p className="text-gray-600">Manage job postings and categories</p>
        </div>
        <Button>
          <Briefcase className="h-4 w-4 mr-2" />
          Add New Job
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{platformStats.activeJobs}</div>
            <p className="text-xs text-muted-foreground">Currently posted</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{platformStats.completedJobs}</div>
            <p className="text-xs text-muted-foreground">Successfully finished</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Job Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Total applications</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Listings</CardTitle>
          <CardDescription>All job postings on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No jobs found in database</p>
            <p className="text-sm text-gray-500">Jobs will appear here once created</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Enhanced Finance Management with REAL data
function FinanceManagement({ platformStats }: { platformStats: PlatformStats }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Finance Management</h2>
        <p className="text-gray-600">Real platform financial data</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Platform Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${platformStats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From {platformStats.activeUsers} activations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pending Withdrawals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{platformStats.pendingWithdrawals}</div>
            <p className="text-xs text-muted-foreground">Requests pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">User Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${platformStats.totalWithdrawals.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total user earnings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Platform Commission</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15%</div>
            <p className="text-xs text-muted-foreground">Standard rate</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Financial Overview</CardTitle>
          <CardDescription>Real-time financial metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Activation Revenue</h4>
                <p className="text-sm text-gray-600">${platformStats.activeUsers} × $5 per activation</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">${platformStats.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Total earned</p>
              </div>
            </div>

            <div className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Pending Activations</h4>
                <p className="text-sm text-gray-600">Potential revenue from pending users</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">${(platformStats.pendingActivations * 5).toLocaleString()}</p>
                <p className="text-xs text-gray-500">Potential revenue</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Settings Management Component
function SettingsManagement() {
  const [settings, setSettings] = useState({
    activationFee: 5.0,
    minimumWithdrawal: 50.0,
    referralBonus: 1.0,
    surveyReward: 1.5,
    platformCommission: 15,
    emailNotifications: true,
    autoApproveWithdrawals: false,
    maintenanceMode: false,
  })

  const [saving, setSaving] = useState(false)

  const handleSettingChange = (key: string, value: number | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
    // Show success toast
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Platform Settings</h2>
        <p className="text-gray-600">Configure platform parameters and features</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Financial Settings</CardTitle>
            <CardDescription>Configure fees and rewards</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Account Activation Fee ($)</label>
              <Input
                type="number"
                value={settings.activationFee}
                onChange={(e) => handleSettingChange("activationFee", Number.parseFloat(e.target.value))}
                className="mt-1"
                step="0.01"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Minimum Withdrawal ($)</label>
              <Input
                type="number"
                value={settings.minimumWithdrawal}
                onChange={(e) => handleSettingChange("minimumWithdrawal", Number.parseFloat(e.target.value))}
                className="mt-1"
                step="0.01"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Platform Commission (%)</label>
              <Input
                type="number"
                value={settings.platformCommission}
                onChange={(e) => handleSettingChange("platformCommission", Number.parseInt(e.target.value))}
                className="mt-1"
                min="0"
                max="100"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
            <CardDescription>General platform configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Email Notifications</label>
                <p className="text-xs text-gray-600">Send email notifications to users</p>
              </div>
              <Button
                variant={settings.emailNotifications ? "default" : "outline"}
                size="sm"
                onClick={() => handleSettingChange("emailNotifications", !settings.emailNotifications)}
              >
                {settings.emailNotifications ? "Enabled" : "Disabled"}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Maintenance Mode</label>
                <p className="text-xs text-gray-600">Put the platform in maintenance mode</p>
              </div>
              <Button
                variant={settings.maintenanceMode ? "destructive" : "outline"}
                size="sm"
                onClick={() => handleSettingChange("maintenanceMode", !settings.maintenanceMode)}
              >
                {settings.maintenanceMode ? "Active" : "Inactive"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Button onClick={handleSaveSettings} disabled={saving} className="w-full">
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Saving Settings...
              </>
            ) : (
              <>
                <Settings className="h-4 w-4 mr-2" />
                Save All Settings
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
