"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, DollarSign, TrendingUp, Download, CreditCard, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { useRevenue } from "@/lib/revenue-manager"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function EarningsPage() {
  const router = useRouter()
  const { userProfile, loading } = useAuth()
  const { revenueManager: rm } = useRevenue()
  const { toast } = useToast()
  const [withdrawalAmount, setWithdrawalAmount] = useState("")
  const [withdrawalMethod, setWithdrawalMethod] = useState("")
  const [isWithdrawing, setIsWithdrawing] = useState(false)

  const userId = userProfile?.uid || "preview-user-id"
  const earnings = rm.getUserEarnings(userId)
  const transactions = rm.getUserTransactions(userId)
  const feeStructure = rm.getFeeStructure()

  useEffect(() => {
    if (!loading && !userProfile) {
      router.push("/login?redirect=/earnings")
    }
  }, [userProfile, loading, router])

  const handleWithdrawal = async () => {
    if (!withdrawalAmount || !withdrawalMethod) {
      toast({
        title: "Missing Information",
        description: "Please enter withdrawal amount and select a method.",
        variant: "destructive",
      })
      return
    }

    const amount = Number.parseFloat(withdrawalAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount.",
        variant: "destructive",
      })
      return
    }

    setIsWithdrawing(true)

    try {
      const result = rm.processWithdrawal(userId, amount, withdrawalMethod)

      if (result.success) {
        toast({
          title: "Withdrawal Initiated",
          description: `Your withdrawal of $${amount.toFixed(2)} has been initiated. You'll receive $${result.transaction?.netAmount.toFixed(2)} after fees.`,
        })
        setWithdrawalAmount("")
        setWithdrawalMethod("")
      } else {
        toast({
          title: "Withdrawal Failed",
          description: result.error || "Unable to process withdrawal.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsWithdrawing(false)
    }
  }

  const withdrawalFeePreview = withdrawalAmount
    ? rm.calculateWithdrawalFees(Number.parseFloat(withdrawalAmount) || 0)
    : null

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading earnings information...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/dashboard" className="inline-flex items-center text-sm mb-4 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">My Earnings</h1>
        <p className="text-gray-600 mt-2">Track your income and manage withdrawals</p>
      </div>

      {/* Earnings Overview */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${earnings.availableBalance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Ready for withdrawal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${earnings.totalEarned.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Lifetime earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Withdrawn</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${earnings.totalWithdrawn.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Successfully withdrawn</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fees Paid</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${earnings.totalFeesPaid.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Platform & withdrawal fees</p>
          </CardContent>
        </Card>
      </div>

      {/* Withdrawal Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Download className="h-5 w-5 mr-2" />
            Withdraw Earnings
          </CardTitle>
          <CardDescription>
            Minimum withdrawal: ${feeStructure.minimumWithdrawal.toFixed(2)} | Withdrawal fee: $
            {feeStructure.withdrawalFee.toFixed(2)} + {feeStructure.withdrawalFeePercentage}%
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Withdrawal Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min={feeStructure.minimumWithdrawal}
                  max={earnings.availableBalance}
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  placeholder={`Min: $${feeStructure.minimumWithdrawal}`}
                />
              </div>

              <div>
                <Label htmlFor="method">Withdrawal Method</Label>
                <Select value={withdrawalMethod} onValueChange={setWithdrawalMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select withdrawal method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="crypto">Cryptocurrency</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="w-full"
                    disabled={
                      !withdrawalAmount ||
                      !withdrawalMethod ||
                      Number.parseFloat(withdrawalAmount || "0") < feeStructure.minimumWithdrawal
                    }
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Withdraw Funds
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Withdrawal</DialogTitle>
                    <DialogDescription>Please review your withdrawal details before confirming.</DialogDescription>
                  </DialogHeader>

                  {withdrawalFeePreview && (
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <div className="flex justify-between">
                          <span>Withdrawal Amount:</span>
                          <span className="font-medium">${Number.parseFloat(withdrawalAmount || "0").toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Fixed Fee:</span>
                          <span>${withdrawalFeePreview.fixedFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Percentage Fee ({feeStructure.withdrawalFeePercentage}%):</span>
                          <span>${withdrawalFeePreview.percentageFee.toFixed(2)}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-medium">
                          <span>You'll Receive:</span>
                          <span className="text-green-600">${withdrawalFeePreview.netAmount.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2 text-sm text-gray-600">
                        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <p>
                          Withdrawals typically process within 1-3 business days. You'll receive an email confirmation
                          once processed.
                        </p>
                      </div>

                      <Button
                        onClick={handleWithdrawal}
                        disabled={isWithdrawing || !withdrawalFeePreview.canWithdraw}
                        className="w-full"
                      >
                        {isWithdrawing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Confirm Withdrawal
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Fee Structure</h4>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex justify-between">
                  <span>Platform Commission:</span>
                  <span>{feeStructure.platformCommission}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Withdrawal Fee:</span>
                  <span>
                    ${feeStructure.withdrawalFee} + {feeStructure.withdrawalFeePercentage}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Minimum Withdrawal:</span>
                  <span>${feeStructure.minimumWithdrawal}</span>
                </div>
              </div>
              <p className="text-xs text-blue-700 mt-3">
                Our transparent fee structure ensures fair compensation for all parties while maintaining platform
                sustainability.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>All your financial transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionList transactions={transactions} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="earnings">
          <Card>
            <CardHeader>
              <CardTitle>Earnings History</CardTitle>
              <CardDescription>Payments received for completed jobs</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionList transactions={transactions.filter((t) => t.type === "job_payment")} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdrawals">
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal History</CardTitle>
              <CardDescription>Your withdrawal requests and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionList transactions={transactions.filter((t) => t.type === "withdrawal")} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees">
          <Card>
            <CardHeader>
              <CardTitle>Fee Breakdown</CardTitle>
              <CardDescription>Detailed breakdown of all fees paid</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions
                  .filter((t) => t.fees > 0)
                  .map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-600">{new Date(transaction.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-red-600">${transaction.fees.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">
                          {transaction.type === "job_payment" ? "Platform Commission" : "Withdrawal Fee"}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function TransactionList({ transactions }: { transactions: any[] }) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No transactions found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <div
                className={`w-2 h-2 rounded-full ${
                  transaction.status === "completed"
                    ? "bg-green-500"
                    : transaction.status === "pending"
                      ? "bg-yellow-500"
                      : transaction.status === "failed"
                        ? "bg-red-500"
                        : "bg-gray-500"
                }`}
              />
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-sm text-gray-600">
                  {new Date(transaction.createdAt).toLocaleDateString()} •
                  <Badge
                    className="ml-2"
                    variant={
                      transaction.status === "completed"
                        ? "default"
                        : transaction.status === "pending"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {transaction.status}
                  </Badge>
                </p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p
              className={`font-medium ${
                transaction.type === "job_payment"
                  ? "text-green-600"
                  : transaction.type === "withdrawal"
                    ? "text-blue-600"
                    : "text-gray-600"
              }`}
            >
              {transaction.type === "withdrawal" ? "-" : "+"}${transaction.netAmount.toFixed(2)}
            </p>
            {transaction.fees > 0 && <p className="text-sm text-gray-500">Fee: ${transaction.fees.toFixed(2)}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}
