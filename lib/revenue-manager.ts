"use client"

export interface FeeStructure {
  // Platform fees
  platformCommission: number // Percentage taken from job payments
  withdrawalFee: number // Fixed fee for withdrawals
  withdrawalFeePercentage: number // Percentage fee for withdrawals
  minimumWithdrawal: number // Minimum withdrawal amount

  // Job posting fees
  jobPostingFee: number // Fixed fee to post a job
  featuredJobFee: number // Additional fee for featured listings
  urgentJobFee: number // Fee for urgent/priority jobs

  // Payment processing
  paymentProcessingFee: number // Percentage for payment processing

  // Subscription fees (for premium features)
  employerPremiumMonthly: number
  workerPremiumMonthly: number
}

export interface TransactionRecord {
  id: string
  type: "job_payment" | "withdrawal" | "job_posting" | "subscription" | "refund"
  userId: string
  amount: number
  fees: number
  netAmount: number
  status: "pending" | "completed" | "failed" | "cancelled"
  createdAt: string
  completedAt?: string
  description: string
  jobId?: string
  metadata?: Record<string, any>
}

export interface UserEarnings {
  userId: string
  totalEarned: number
  availableBalance: number
  pendingBalance: number
  totalWithdrawn: number
  totalFeesPaid: number
  lastUpdated: string
}

export interface PlatformRevenue {
  totalRevenue: number
  commissionRevenue: number
  withdrawalFeeRevenue: number
  jobPostingRevenue: number
  subscriptionRevenue: number
  paymentProcessingRevenue: number
  monthlyRevenue: Record<string, number>
  dailyRevenue: Record<string, number>
}

class RevenueManager {
  private static instance: RevenueManager
  private feeStructure: FeeStructure
  private transactions: TransactionRecord[] = []
  private userEarnings: Map<string, UserEarnings> = new Map()
  private platformRevenue: PlatformRevenue
  private listeners: Array<() => void> = []

  private constructor() {
    this.feeStructure = {
      platformCommission: 15, // 15% commission on job payments
      withdrawalFee: 2.5, // $2.50 fixed withdrawal fee
      withdrawalFeePercentage: 2, // 2% of withdrawal amount
      minimumWithdrawal: 25.0, // $25 minimum withdrawal
      jobPostingFee: 5.0, // $5 to post a job
      featuredJobFee: 15.0, // Additional $15 for featured listing
      urgentJobFee: 10.0, // $10 for urgent priority
      paymentProcessingFee: 2.9, // 2.9% payment processing
      employerPremiumMonthly: 29.99, // $29.99/month for employer premium
      workerPremiumMonthly: 9.99, // $9.99/month for worker premium
    }

    this.platformRevenue = {
      totalRevenue: 0,
      commissionRevenue: 0,
      withdrawalFeeRevenue: 0,
      jobPostingRevenue: 0,
      subscriptionRevenue: 0,
      paymentProcessingRevenue: 0,
      monthlyRevenue: {},
      dailyRevenue: {},
    }

    this.loadData()
  }

  static getInstance(): RevenueManager {
    if (!RevenueManager.instance) {
      RevenueManager.instance = new RevenueManager()
    }
    return RevenueManager.instance
  }

  private loadData(): void {
    if (typeof window !== "undefined") {
      // Load transactions
      const storedTransactions = localStorage.getItem("workhub_transactions")
      if (storedTransactions) {
        try {
          this.transactions = JSON.parse(storedTransactions)
        } catch (error) {
          console.error("Error loading transactions:", error)
        }
      }

      // Load user earnings
      const storedEarnings = localStorage.getItem("workhub_earnings")
      if (storedEarnings) {
        try {
          const earnings = JSON.parse(storedEarnings)
          this.userEarnings = new Map(Object.entries(earnings))
        } catch (error) {
          console.error("Error loading earnings:", error)
        }
      }

      // Load platform revenue
      const storedRevenue = localStorage.getItem("workhub_revenue")
      if (storedRevenue) {
        try {
          this.platformRevenue = { ...this.platformRevenue, ...JSON.parse(storedRevenue) }
        } catch (error) {
          console.error("Error loading revenue:", error)
        }
      }
    }
  }

  private saveData(): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("workhub_transactions", JSON.stringify(this.transactions))
      localStorage.setItem("workhub_earnings", JSON.stringify(Object.fromEntries(this.userEarnings)))
      localStorage.setItem("workhub_revenue", JSON.stringify(this.platformRevenue))
      this.notifyListeners()
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener())
  }

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener)
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  // Calculate job posting costs
  calculateJobPostingCost(jobData: {
    payAmount: number
    maxWorkers: number
    featured?: boolean
    urgent?: boolean
  }): {
    baseFee: number
    featuredFee: number
    urgentFee: number
    totalCost: number
    estimatedPlatformEarnings: number
  } {
    const baseFee = this.feeStructure.jobPostingFee
    const featuredFee = jobData.featured ? this.feeStructure.featuredJobFee : 0
    const urgentFee = jobData.urgent ? this.feeStructure.urgentJobFee : 0

    const totalJobValue = jobData.payAmount * jobData.maxWorkers
    const estimatedCommission = (totalJobValue * this.feeStructure.platformCommission) / 100

    return {
      baseFee,
      featuredFee,
      urgentFee,
      totalCost: baseFee + featuredFee + urgentFee,
      estimatedPlatformEarnings: baseFee + featuredFee + urgentFee + estimatedCommission,
    }
  }

  // Process job payment to worker
  processJobPayment(
    workerId: string,
    jobId: string,
    grossAmount: number,
    description: string,
  ): {
    success: boolean
    transaction?: TransactionRecord
    workerNet: number
    platformFee: number
    error?: string
  } {
    try {
      const platformFee = (grossAmount * this.feeStructure.platformCommission) / 100
      const workerNet = grossAmount - platformFee

      const transaction: TransactionRecord = {
        id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: "job_payment",
        userId: workerId,
        amount: grossAmount,
        fees: platformFee,
        netAmount: workerNet,
        status: "completed",
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        description,
        jobId,
      }

      this.transactions.push(transaction)
      this.updateUserEarnings(workerId, workerNet, platformFee)
      this.updatePlatformRevenue("commissionRevenue", platformFee)
      this.saveData()

      return {
        success: true,
        transaction,
        workerNet,
        platformFee,
      }
    } catch (error) {
      return {
        success: false,
        workerNet: 0,
        platformFee: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  // Calculate withdrawal fees and net amount
  calculateWithdrawalFees(amount: number): {
    canWithdraw: boolean
    fixedFee: number
    percentageFee: number
    totalFees: number
    netAmount: number
    error?: string
  } {
    if (amount < this.feeStructure.minimumWithdrawal) {
      return {
        canWithdraw: false,
        fixedFee: 0,
        percentageFee: 0,
        totalFees: 0,
        netAmount: 0,
        error: `Minimum withdrawal amount is $${this.feeStructure.minimumWithdrawal}`,
      }
    }

    const fixedFee = this.feeStructure.withdrawalFee
    const percentageFee = (amount * this.feeStructure.withdrawalFeePercentage) / 100
    const totalFees = fixedFee + percentageFee
    const netAmount = amount - totalFees

    if (netAmount <= 0) {
      return {
        canWithdraw: false,
        fixedFee,
        percentageFee,
        totalFees,
        netAmount: 0,
        error: "Withdrawal amount too small after fees",
      }
    }

    return {
      canWithdraw: true,
      fixedFee,
      percentageFee,
      totalFees,
      netAmount,
    }
  }

  // Process withdrawal
  processWithdrawal(
    userId: string,
    amount: number,
    method: string,
  ): {
    success: boolean
    transaction?: TransactionRecord
    error?: string
  } {
    try {
      const userEarnings = this.getUserEarnings(userId)

      if (userEarnings.availableBalance < amount) {
        return {
          success: false,
          error: "Insufficient balance",
        }
      }

      const feeCalculation = this.calculateWithdrawalFees(amount)

      if (!feeCalculation.canWithdraw) {
        return {
          success: false,
          error: feeCalculation.error,
        }
      }

      const transaction: TransactionRecord = {
        id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: "withdrawal",
        userId,
        amount,
        fees: feeCalculation.totalFees,
        netAmount: feeCalculation.netAmount,
        status: "pending",
        createdAt: new Date().toISOString(),
        description: `Withdrawal via ${method}`,
        metadata: { method, fixedFee: feeCalculation.fixedFee, percentageFee: feeCalculation.percentageFee },
      }

      this.transactions.push(transaction)
      this.updateUserEarnings(userId, -amount, -feeCalculation.totalFees)
      this.updatePlatformRevenue("withdrawalFeeRevenue", feeCalculation.totalFees)
      this.saveData()

      // Simulate processing delay
      setTimeout(() => {
        this.completeWithdrawal(transaction.id)
      }, 2000)

      return {
        success: true,
        transaction,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  private completeWithdrawal(transactionId: string): void {
    const transaction = this.transactions.find((t) => t.id === transactionId)
    if (transaction) {
      transaction.status = "completed"
      transaction.completedAt = new Date().toISOString()
      this.saveData()
    }
  }

  // Process job posting payment
  processJobPosting(
    employerId: string,
    jobData: {
      payAmount: number
      maxWorkers: number
      featured?: boolean
      urgent?: boolean
    },
    jobId: string,
  ): {
    success: boolean
    transaction?: TransactionRecord
    costs: ReturnType<typeof this.calculateJobPostingCost>
    error?: string
  } {
    try {
      const costs = this.calculateJobPostingCost(jobData)

      const transaction: TransactionRecord = {
        id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: "job_posting",
        userId: employerId,
        amount: costs.totalCost,
        fees: 0,
        netAmount: costs.totalCost,
        status: "completed",
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        description: "Job posting fee",
        jobId,
        metadata: {
          baseFee: costs.baseFee,
          featuredFee: costs.featuredFee,
          urgentFee: costs.urgentFee,
        },
      }

      this.transactions.push(transaction)
      this.updatePlatformRevenue("jobPostingRevenue", costs.totalCost)
      this.saveData()

      return {
        success: true,
        transaction,
        costs,
      }
    } catch (error) {
      return {
        success: false,
        costs: this.calculateJobPostingCost(jobData),
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  private updateUserEarnings(userId: string, netChange: number, feesChange: number): void {
    const current = this.userEarnings.get(userId) || {
      userId,
      totalEarned: 0,
      availableBalance: 0,
      pendingBalance: 0,
      totalWithdrawn: 0,
      totalFeesPaid: 0,
      lastUpdated: new Date().toISOString(),
    }

    if (netChange > 0) {
      current.totalEarned += netChange
      current.availableBalance += netChange
    } else {
      current.availableBalance += netChange
      if (netChange < 0) {
        current.totalWithdrawn += Math.abs(netChange)
      }
    }

    if (feesChange > 0) {
      current.totalFeesPaid += feesChange
    }

    current.lastUpdated = new Date().toISOString()
    this.userEarnings.set(userId, current)
  }

  private updatePlatformRevenue(type: keyof PlatformRevenue, amount: number): void {
    if (typeof this.platformRevenue[type] === "number") {
      ;(this.platformRevenue[type] as number) += amount
    }
    this.platformRevenue.totalRevenue += amount

    // Update monthly and daily revenue
    const now = new Date()
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
    const dayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`

    this.platformRevenue.monthlyRevenue[monthKey] = (this.platformRevenue.monthlyRevenue[monthKey] || 0) + amount
    this.platformRevenue.dailyRevenue[dayKey] = (this.platformRevenue.dailyRevenue[dayKey] || 0) + amount
  }

  // Public getters
  getFeeStructure(): FeeStructure {
    return { ...this.feeStructure }
  }

  getUserEarnings(userId: string): UserEarnings {
    return (
      this.userEarnings.get(userId) || {
        userId,
        totalEarned: 0,
        availableBalance: 0,
        pendingBalance: 0,
        totalWithdrawn: 0,
        totalFeesPaid: 0,
        lastUpdated: new Date().toISOString(),
      }
    )
  }

  getUserTransactions(userId: string): TransactionRecord[] {
    return this.transactions
      .filter((t) => t.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  getPlatformRevenue(): PlatformRevenue {
    return { ...this.platformRevenue }
  }

  getAllTransactions(): TransactionRecord[] {
    return [...this.transactions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  // Initialize with some sample data for demo
  initializeSampleData(): void {
    if (this.transactions.length === 0) {
      // Add some sample transactions
      const sampleTransactions: Omit<TransactionRecord, "id">[] = [
        {
          type: "job_payment",
          userId: "user_001",
          amount: 25.0,
          fees: 3.75,
          netAmount: 21.25,
          status: "completed",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          completedAt: new Date(Date.now() - 86400000).toISOString(),
          description: "Payment for Product Survey completion",
          jobId: "job_001",
        },
        {
          type: "withdrawal",
          userId: "user_001",
          amount: 50.0,
          fees: 3.5,
          netAmount: 46.5,
          status: "completed",
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          completedAt: new Date(Date.now() - 172800000).toISOString(),
          description: "Withdrawal via PayPal",
        },
      ]

      sampleTransactions.forEach((txn) => {
        const transaction: TransactionRecord = {
          ...txn,
          id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        }
        this.transactions.push(transaction)
      })

      // Initialize sample user earnings
      this.userEarnings.set("user_001", {
        userId: "user_001",
        totalEarned: 125.5,
        availableBalance: 75.25,
        pendingBalance: 0,
        totalWithdrawn: 50.0,
        totalFeesPaid: 7.25,
        lastUpdated: new Date().toISOString(),
      })

      // Initialize platform revenue
      this.platformRevenue = {
        totalRevenue: 156.75,
        commissionRevenue: 125.25,
        withdrawalFeeRevenue: 21.5,
        jobPostingRevenue: 10.0,
        subscriptionRevenue: 0,
        paymentProcessingRevenue: 0,
        monthlyRevenue: {
          "2024-01": 156.75,
        },
        dailyRevenue: {
          "2024-01-15": 156.75,
        },
      }

      this.saveData()
    }
  }
}

export const revenueManager = RevenueManager.getInstance()

// React hook for using revenue data
import React from "react"

export function useRevenue() {
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0)

  React.useEffect(() => {
    const unsubscribe = revenueManager.subscribe(() => {
      forceUpdate()
    })

    // Initialize sample data if needed
    revenueManager.initializeSampleData()

    return unsubscribe
  }, [])

  return { revenueManager }
}
