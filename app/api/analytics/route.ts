import { type NextRequest, NextResponse } from "next/server"
import { firebaseAdminService } from "@/lib/firebase-admin"
import { jobManager } from "@/lib/job-manager"
import { revenueManager } from "@/lib/revenue-manager"

export async function GET(request: NextRequest) {
  try {
    // Get comprehensive analytics data
    const userStats = await firebaseAdminService.getUserStats()
    const jobStats = jobManager.getJobStats()
    const revenueStats = revenueManager.getPlatformRevenue()

    const analytics = {
      users: userStats,
      jobs: jobStats,
      revenue: revenueStats,
      summary: {
        totalUsers: userStats.totalUsers,
        activeJobs: jobStats.activeJobs,
        totalRevenue: revenueStats.totalRevenue,
        growthRate: calculateGrowthRate(userStats.newUsersThisWeek, userStats.newUsersToday),
      },
    }

    return NextResponse.json({ success: true, analytics })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch analytics" }, { status: 500 })
  }
}

function calculateGrowthRate(weeklyUsers: number, dailyUsers: number): number {
  if (weeklyUsers === 0) return 0
  return Math.round((dailyUsers / (weeklyUsers / 7)) * 100)
}
