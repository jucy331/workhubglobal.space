"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useRevenue } from "@/lib/revenue-manager"
import { DollarSign, TrendingUp, Briefcase, Download, BarChart3 } from "lucide-react"

export default function AdminRevenuePage() {
  const { revenueManager: rm } = useRevenue()
  const [timeRange, setTimeRange] = useState("30d")

  const platformRevenue = rm.getPlatformRevenue()
  const allTransactions = rm.getAllTransactions()
  const feeStructure = rm.getFeeStructure()

  // Calculate metrics
  const totalUsers = new Set(allTransactions.map((t) => t.userId)).size
  const totalJobs = allTransactions.filter((t) => t.type === "job_posting").length
  const avgTransactionValue =
    allTransactions.length > 0 ? allTransactions.reduce((sum, t) => sum + t.amount, 0) / allTransactions.length : 0

  const recentTransactions = allTransactions.slice(0, 10)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Revenue Dashboard</h1>
        <p className="text-gray-600 mt-2">Platform financial overview and analytics</p>
      </div>

      {/* Revenue Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${platformRevenue.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All-time platform earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${platformRevenue.commissionRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{feeStructure.platformCommission}% from job payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Job Posting Fees</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${platformRevenue.jobPostingRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">${feeStructure.jobPostingFee} per job</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Withdrawal Fees</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${platformRevenue.withdrawalFeeRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              ${feeStructure.withdrawalFee} + {feeStructure.withdrawalFeePercentage}%
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="fees">Fee Structure</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Revenue Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Sources of platform income</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Commission ({feeStructure.platformCommission}%)</span>
                    </div>
                    <span className="font-medium">${platformRevenue.commissionRevenue.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Job Posting Fees</span>
                    </div>
                    <span className="font-medium">${platformRevenue.jobPostingRevenue.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">Withdrawal Fees</span>
                    </div>
                    <span className="font-medium">${platformRevenue.withdrawalFeeRevenue.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-sm">Subscriptions</span>
                    </div>
                    <span className="font-medium">${platformRevenue.subscriptionRevenue.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Users</span>
                    <span className="font-medium">{totalUsers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Jobs Posted</span>
                    <span className="font-medium">{totalJobs}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Avg Transaction Value</span>
                    <span className="font-medium">${avgTransactionValue.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Transactions</span>
                    <span className="font-medium">{allTransactions.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest platform transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            transaction.status === "completed"
                              ? "bg-green-500"
                              : transaction.status === "pending"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                        />
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(transaction.createdAt).toLocaleDateString()} • User:{" "}
                            {transaction.userId.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${transaction.amount.toFixed(2)}</p>
                      <Badge
                        className={`text-xs ${
                          transaction.type === "job_payment"
                            ? "bg-blue-100 text-blue-800"
                            : transaction.type === "withdrawal"
                              ? "bg-red-100 text-red-800"
                              : transaction.type === "job_posting"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {transaction.type.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Current Fee Structure</CardTitle>
                <CardDescription>Platform fees and commissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Platform Commission</span>
                    <span className="text-lg font-bold text-blue-600">{feeStructure.platformCommission}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Job Posting Fee</span>
                    <span className="text-lg font-bold text-green-600">${feeStructure.jobPostingFee}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Withdrawal Fee</span>
                    <span className="text-lg font-bold text-purple-600">
                      ${feeStructure.withdrawalFee} + {feeStructure.withdrawalFeePercentage}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Minimum Withdrawal</span>
                    <span className="text-lg font-bold text-orange-600">${feeStructure.minimumWithdrawal}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Premium Subscriptions</CardTitle>
                <CardDescription>Monthly subscription pricing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Worker Premium</h4>
                      <span className="text-xl font-bold text-blue-600">${feeStructure.workerPremiumMonthly}/mo</span>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Priority job access</li>
                      <li>• Reduced withdrawal fees</li>
                      <li>• Advanced analytics</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Employer Premium</h4>
                      <span className="text-xl font-bold text-green-600">
                        ${feeStructure.employerPremiumMonthly}/mo
                      </span>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Featured job listings</li>
                      <li>• Advanced worker filtering</li>
                      <li>• Priority support</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analytics</CardTitle>
              <CardDescription>Financial performance insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Advanced analytics coming soon</p>
                <p className="text-sm">Charts and detailed financial reports will be available here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
