"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Briefcase, AlertCircle, Shield, LogOut, BarChart3, UserCheck, MessageCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { firebaseAdminService, type FirebaseUser } from "@/lib/firebase-admin"
import { AdminChat } from "@/components/admin-chat"

export default function AdminDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminSession, setAdminSession] = useState<any>(null)
  const [users, setUsers] = useState<FirebaseUser[]>([])
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingActivations: 0,
    newUsersToday: 0,
    newUsersThisWeek: 0,
  })
  const [loading, setLoading] = useState(true)

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

  const loadRealTimeData = () => {
    // Subscribe to real-time user data
    const unsubscribeUsers = firebaseAdminService.subscribeToUsers((userData) => {
      setUsers(userData)
      setLoading(false)
    })

    // Load user statistics
    firebaseAdminService.getUserStats().then(setUserStats)

    return () => {
      unsubscribeUsers()
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
    const success = await firebaseAdminService.activateUser(uid)
    if (success) {
      toast({
        title: "User Activated",
        description: "User account has been activated successfully.",
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to activate user account.",
        variant: "destructive",
      })
    }
  }

  const handleSuspendUser = async (uid: string) => {
    const success = await firebaseAdminService.suspendUser(uid)
    if (success) {
      toast({
        title: "User Suspended",
        description: "User account has been suspended.",
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to suspend user account.",
        variant: "destructive",
      })
    }
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
      <header className="bg-white shadow-sm border-b">
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
        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{userStats.activeUsers} active users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Users Today</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.newUsersToday}</div>
              <p className="text-xs text-muted-foreground">{userStats.newUsersThisWeek} this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Across all categories</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.pendingActivations}</div>
              <p className="text-xs text-muted-foreground">Account activations</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
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
              {/* Recent Activity */}
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
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <Button variant="outline" className="justify-start h-auto p-4">
                      <UserCheck className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Review Activations</div>
                        <div className="text-sm text-gray-600">{userStats.pendingActivations} pending</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-auto p-4">
                      <MessageCircle className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Support Tickets</div>
                        <div className="text-sm text-gray-600">Manage customer support</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-auto p-4">
                      <Briefcase className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Manage Jobs</div>
                        <div className="text-sm text-gray-600">12 active jobs</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-auto p-4">
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
          </TabsContent>

          <TabsContent value="users">
            <UserManagement
              users={users}
              onActivate={handleActivateUser}
              onSuspend={handleSuspendUser}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="jobs">
            <JobManagement />
          </TabsContent>

          <TabsContent value="finance">
            <FinanceManagement />
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

// Updated User Management Component with real data
function UserManagement({
  users,
  onActivate,
  onSuspend,
  loading,
}: {
  users: FirebaseUser[]
  onActivate: (uid: string) => void
  onSuspend: (uid: string) => void
  loading: boolean
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
        <Badge variant="secondary">{users.length} Total Users</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Accounts</CardTitle>
          <CardDescription>All registered users and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.uid} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h4 className="font-medium">{user.fullName}</h4>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500">Joined: {formatDate(user.createdAt)}</p>
                      {user.activatedAt && (
                        <p className="text-xs text-green-600">Activated: {formatDate(user.activatedAt)}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{user.role || "user"}</p>
                    <p className="text-xs text-gray-600">{user.applications?.length || 0} applications</p>
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
                        Activate
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => onSuspend(user.uid)}>
                      {user.isActivated ? "Suspend" : "Delete"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Keep existing components for Jobs, Finance, and Settings
function JobManagement() {
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Product Feedback Survey Specialist",
      category: "Surveys & Market Research",
      payRange: "$3-$100 per survey",
      status: "active",
      applications: 45,
      featured: true,
    },
    {
      id: 2,
      title: "AI Chatbot Conversation Trainer",
      category: "AI & Machine Learning",
      payRange: "$14-$25 per hour",
      status: "active",
      applications: 32,
      featured: true,
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Job Management</h2>
          <p className="text-gray-600">Manage job postings and categories</p>
        </div>
        <Button>Add New Job</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Jobs</CardTitle>
          <CardDescription>All job postings on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h4 className="font-medium">{job.title}</h4>
                      <p className="text-sm text-gray-600">{job.category}</p>
                      <p className="text-xs text-gray-500">{job.payRange}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{job.applications} applications</p>
                    {job.featured && <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>}
                  </div>
                  <Badge className="bg-green-100 text-green-800">{job.status}</Badge>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      Pause
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function FinanceManagement() {
  const [withdrawals, setWithdrawals] = useState([
    {
      id: 1,
      user: "John Doe",
      amount: 75.0,
      method: "PayPal",
      status: "pending",
      requestDate: "2024-01-20",
    },
    {
      id: 2,
      user: "Sarah Wilson",
      amount: 125.5,
      method: "Bank Transfer",
      status: "completed",
      requestDate: "2024-01-18",
    },
  ])

  const handleApproveWithdrawal = (id: number) => {
    setWithdrawals((prev) => prev.map((w) => (w.id === id ? { ...w, status: "approved" } : w)))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Finance Management</h2>
        <p className="text-gray-600">Manage payments and withdrawals</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Platform Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$15,420.50</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pending Withdrawals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$275.00</div>
            <p className="text-xs text-muted-foreground">8 requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">User Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$8,945.25</div>
            <p className="text-xs text-muted-foreground">Total paid out</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Withdrawal Requests</CardTitle>
          <CardDescription>Pending and completed withdrawal requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {withdrawals.map((withdrawal) => (
              <div key={withdrawal.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{withdrawal.user}</h4>
                  <p className="text-sm text-gray-600">{withdrawal.method}</p>
                  <p className="text-xs text-gray-500">Requested: {withdrawal.requestDate}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-lg font-bold">${withdrawal.amount.toFixed(2)}</p>
                  </div>
                  <Badge
                    className={
                      withdrawal.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : withdrawal.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                    }
                  >
                    {withdrawal.status}
                  </Badge>
                  {withdrawal.status === "pending" && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleApproveWithdrawal(withdrawal.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Approve
                      </Button>
                      <Button size="sm" variant="outline">
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SettingsManagement() {
  const [settings, setSettings] = useState({
    activationFee: 5.0,
    minimumWithdrawal: 50.0,
    referralBonus: 1.0,
    surveyReward: 1.5,
    platformCommission: 10,
  })

  const handleSettingChange = (key: string, value: number) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Platform Settings</h2>
        <p className="text-gray-600">Configure platform parameters and fees</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Financial Settings</CardTitle>
            <CardDescription>Configure fees and rewards</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Account Activation Fee</label>
              <div className="flex items-center space-x-2 mt-1">
                <span>$</span>
                <input
                  type="number"
                  value={settings.activationFee}
                  onChange={(e) => handleSettingChange("activationFee", Number.parseFloat(e.target.value))}
                  className="flex-1 px-3 py-2 border rounded-md"
                  step="0.01"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Minimum Withdrawal</label>
              <div className="flex items-center space-x-2 mt-1">
                <span>$</span>
                <input
                  type="number"
                  value={settings.minimumWithdrawal}
                  onChange={(e) => handleSettingChange("minimumWithdrawal", Number.parseFloat(e.target.value))}
                  className="flex-1 px-3 py-2 border rounded-md"
                  step="0.01"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Referral Bonus</label>
              <div className="flex items-center space-x-2 mt-1">
                <span>$</span>
                <input
                  type="number"
                  value={settings.referralBonus}
                  onChange={(e) => handleSettingChange("referralBonus", Number.parseFloat(e.target.value))}
                  className="flex-1 px-3 py-2 border rounded-md"
                  step="0.01"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Survey Reward</label>
              <div className="flex items-center space-x-2 mt-1">
                <span>$</span>
                <input
                  type="number"
                  value={settings.surveyReward}
                  onChange={(e) => handleSettingChange("surveyReward", Number.parseFloat(e.target.value))}
                  className="flex-1 px-3 py-2 border rounded-md"
                  step="0.01"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Configuration</CardTitle>
            <CardDescription>General platform settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Platform Commission (%)</label>
              <input
                type="number"
                value={settings.platformCommission}
                onChange={(e) => handleSettingChange("platformCommission", Number.parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-md mt-1"
                min="0"
                max="100"
              />
            </div>
            <div className="pt-4">
              <Button className="w-full">Save Settings</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
