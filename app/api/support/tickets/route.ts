import { type NextRequest, NextResponse } from "next/server"

// Mock data for preview environment
const mockTickets = [
  {
    id: "ticket-1",
    userId: "preview-user-id",
    subject: "Account Activation Help",
    status: "open",
    priority: "medium",
    createdAt: new Date(),
    updatedAt: new Date(),
    messageCount: 1,
    lastMessageAt: new Date(),
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  try {
    // In preview mode, return mock data
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json({
        success: true,
        tickets: mockTickets.filter((ticket) => ticket.userId === userId),
      })
    }

    // In production, this would fetch from Firebase
    // For now, return empty array
    return NextResponse.json({ success: true, tickets: [] })
  } catch (error) {
    console.error("Error fetching tickets:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch tickets" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, subject, userEmail, userName, initialMessage } = await request.json()

    if (!userId || !userName || !userEmail || !subject) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const newTicket = {
      id: `ticket-${Date.now()}`,
      userId,
      subject,
      status: "open",
      priority: "medium",
      createdAt: new Date(),
      updatedAt: new Date(),
      messageCount: initialMessage ? 1 : 0,
      lastMessageAt: new Date(),
    }

    // In preview mode, just return success
    if (process.env.NODE_ENV !== "production") {
      mockTickets.push(newTicket)
      return NextResponse.json({
        success: true,
        ticket: newTicket,
      })
    }

    // In production, this would save to Firebase
    return NextResponse.json({ success: true, ticketId: newTicket.id })
  } catch (error) {
    console.error("Error creating support ticket:", error)
    return NextResponse.json({ success: false, error: "Failed to create support ticket" }, { status: 500 })
  }
}
