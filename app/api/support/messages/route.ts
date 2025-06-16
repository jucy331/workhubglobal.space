import { type NextRequest, NextResponse } from "next/server"
import { firebaseAdminService } from "@/lib/firebase-admin"

export async function POST(request: NextRequest) {
  try {
    const { ticketId, message } = await request.json()

    // In preview mode, just return success
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json({
        success: true,
        message: "Message sent successfully",
      })
    }

    // In production, this would save to Firebase
    // TODO: Implement Firebase message saving

    const { isFromAdmin, userId, userName, userEmail, adminId, adminName } = await request.json()

    if (!ticketId || !message) {
      return NextResponse.json({ success: false, error: "Ticket ID and message are required" }, { status: 400 })
    }

    const success = await firebaseAdminService.sendMessage(
      ticketId,
      message,
      isFromAdmin,
      userId,
      userName,
      userEmail,
      adminId,
      adminName,
    )

    if (success) {
      return NextResponse.json({
        success: true,
        message: "Message sent successfully",
      })
    } else {
      return NextResponse.json({ success: false, error: "Failed to send message" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ success: false, error: "Failed to send message" }, { status: 500 })
  }
}
