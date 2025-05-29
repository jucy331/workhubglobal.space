"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  DollarSign,
  Briefcase,
  AlertCircle,
  Shield,
  LogOut,
  BarChart3,
  UserCheck,
  CreditCard,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminSession, setAdminSession] = useState<any>(null)
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingActivations: 0,
    totalEarnings: 0,
    totalJobs: 0,
    completedSurveys: 0,
    pendingWithdrawals: 0,
    totalReferrals: 0,
  })

  useEffect(() => {
    const authStatus = localStorage.getItem("admin_authenticated")
    const session = localStorage.getItem("admin_session")

    if (authStatus === "true" && session) {
      setIsAuthenticated(true)
      setAdminSession(JSON.parse(session))
      loadAdminStats()
    } else {
      router.push("/admin/login")
    }
  }, [router])

  const loadAdminStats = () => {
    // Simulate loading admin statistics
    const mockStats = {
      totalUsers: 1247,
      activeUsers: 892,
      pendingActivations: 23,
      totalEarnings: 15420.5,
      totalJobs: 12,
      completedSurveys: 456,
      pendingWithdrawals: 8,
      totalReferrals: 234,
    }
    setStats(mockStats)
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
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{stats.activeUsers} active users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{stats.pendingWithdrawals} pending withdrawals</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalJobs}</div>
              <p className="text-xs text-muted-foreground">Across all categories</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingActivations}</div>
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
            <TabsTrigger value="surveys">Surveys</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest platform activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New user registration</p>
                        <p className="text-xs text-gray-600">john.doe@email.com - 2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Account activation</p>
                        <p className="text-xs text-gray-600">sarah.wilson@email.com - 15 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Survey completed</p>
                        <p className="text-xs text-gray-600">Welcome Survey - 1 hour ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Withdrawal request</p>
                        <p className="text-xs text-gray-600">$75.00 - 2 hours ago</p>
                      </div>
                    </div>
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
                        <div className="text-sm text-gray-600">{stats.pendingActivations} pending</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-auto p-4">
                      <CreditCard className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Process Withdrawals</div>
                        <div className="text-sm text-gray-600">{stats.pendingWithdrawals} pending</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-auto p-4">
                      <Briefcase className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Manage Jobs</div>
                        <div className="text-sm text-gray-600">{stats.totalJobs} active jobs</div>
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
            <UserManagement />
          </TabsContent>

          <TabsContent value="jobs">
            <JobManagement />
          </TabsContent>

          <TabsContent value="finance">
            <FinanceManagement />
          </TabsContent>

          <TabsContent value="surveys">
            <SurveyManagement />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// User Management Component
function UserManagement() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@email.com",
      status: "active",
      joinDate: "2024-01-15",
      earnings: 125.5,
      referrals: 3,
      activationStatus: "activated",
    },
    {
      id: 2,
      name: "Sarah Wilson",
      email: "sarah.wilson@email.com",
      status: "pending",
      joinDate: "2024-01-20",
      earnings: 0,
      referrals: 0,
      activationStatus: "pending",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@email.com",
      status: "active",
      joinDate: "2024-01-18",
      earnings: 89.25,
      referrals: 1,
      activationStatus: "activated",
    },
  ])

  const handleActivateUser = (userId: number) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, status: "active", activationStatus: "activated" } : user)),
    )
  }

  const handleSuspendUser = (userId: number) => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, status: "suspended" } : user)))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage user accounts and activations</p>
        </div>
        <Button>Add New User</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Accounts</CardTitle>
          <CardDescription>All registered users and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h4 className="font-medium">{user.name}</h4>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500">Joined: {user.joinDate}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">${user.earnings.toFixed(2)}</p>
                    <p className="text-xs text-gray-600">{user.referrals} referrals</p>
                  </div>
                  <Badge
                    className={
                      user.status === "active"
                        ? "bg-green-100 text-green-800"
                        : user.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }
                  >
                    {user.status}
                  </Badge>
                  <div className="flex space-x-2">
                    {user.activationStatus === "pending" && (
                      <Button
                        size="sm"
                        onClick={() => handleActivateUser(user.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Activate
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => handleSuspendUser(user.id)}>
                      Suspend
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

// Job Management Component
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

// Finance Management Component
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

// Survey Management Component
function SurveyManagement() {
  const surveyStats = {
    totalResponses: 456,
    completionRate: 87,
    averageTime: "2.3 minutes",
    topCategories: [
      { name: "Surveys & Market Research", interest: 78 },
      { name: "Data Entry", interest: 65 },
      { name: "Virtual Assistance", interest: 52 },
    ],
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Survey Management</h2>
        <p className="text-gray-600">Welcome survey analytics and responses</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{surveyStats.totalResponses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{surveyStats.completionRate}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Average Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{surveyStats.averageTime}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Survey Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(surveyStats.totalResponses * 1.5).toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Popular Job Categories</CardTitle>
          <CardDescription>Based on survey responses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {surveyStats.topCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="font-medium">{category.name}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${category.interest}%` }}></div>
                  </div>
                  <span className="text-sm font-medium">{category.interest}%</span>
                </div>
              </div>
            ))}
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
