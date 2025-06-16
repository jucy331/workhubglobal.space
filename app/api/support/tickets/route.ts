import { type NextRequest, NextResponse } from "next/server"
import { firebaseAdminService } from "@/lib/firebase-admin"

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
    messages: [
      {
        id: "msg-1",
        text: "I need help activating my account. The payment didn't go through.",
        sender: "user",
        timestamp: new Date(),
        senderName: "Preview User",
      },
    ],
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  // In preview mode, return mock data
  if (process.env.NODE_ENV !== "production") {
    return NextResponse.json({
      success: true,
      tickets: mockTickets.filter((ticket) => ticket.userId === userId),
    })
  }

  // In production, this would fetch from Firebase
  try {
    if (userId) {
      const tickets = await firebaseAdminService.getUserTickets(userId)
      return NextResponse.json({ success: true, tickets })
    } else {
      // Admin endpoint - return all tickets
      return NextResponse.json({ success: true, tickets: [] })
    }
  } catch (error) {
    console.error("Error fetching tickets:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch tickets" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, subject, userEmail, userName } = await request.json()

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
      messages: [],
    }

    // In preview mode, just return the ticket
    if (process.env.NODE_ENV !== "production") {
      mockTickets.push(newTicket)
      return NextResponse.json({
        success: true,
        ticket: newTicket,
      })
    }

    const ticketId = await firebaseAdminService.createSupportTicket(userId, userName, userEmail, subject)

    if (ticketId) {
      return NextResponse.json({ success: true, ticketId })
    } else {
      return NextResponse.json({ success: false, error: "Failed to create ticket" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error creating support ticket:", error)
    return NextResponse.json({ success: false, error: "Failed to create support ticket" }, { status: 500 })
  }
}
