import { type NextRequest, NextResponse } from "next/server"
import { revenueManager } from "@/lib/revenue-manager"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (userId) {
      // Get user-specific revenue data
      const earnings = revenueManager.getUserEarnings(userId)
      const transactions = revenueManager.getUserTransactions(userId)

      return NextResponse.json({
        success: true,
        earnings,
        transactions,
      })
    } else {
      // Get platform revenue data (admin only)
      const platformRevenue = revenueManager.getPlatformRevenue()
      const allTransactions = revenueManager.getAllTransactions()

      return NextResponse.json({
        success: true,
        platformRevenue,
        transactions: allTransactions,
      })
    }
  } catch (error) {
    console.error("Error fetching revenue data:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch revenue data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, ...data } = await request.json()

    switch (type) {
      case "job_payment":
        const paymentResult = revenueManager.processJobPayment(data.workerId, data.jobId, data.amount, data.description)
        return NextResponse.json({ success: paymentResult.success, ...paymentResult })

      case "withdrawal":
        const withdrawalResult = revenueManager.processWithdrawal(data.userId, data.amount, data.method)
        return NextResponse.json({ success: withdrawalResult.success, ...withdrawalResult })

      case "job_posting":
        const jobPostingResult = revenueManager.processJobPosting(data.employerId, data.jobData, data.jobId)
        return NextResponse.json({ success: jobPostingResult.success, ...jobPostingResult })

      default:
        return NextResponse.json({ success: false, error: "Invalid transaction type" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error processing revenue transaction:", error)
    return NextResponse.json({ success: false, error: "Failed to process transaction" }, { status: 500 })
  }
}
