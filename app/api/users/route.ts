import { type NextRequest, NextResponse } from "next/server"
import { firebaseAdminService } from "@/lib/firebase-admin"

export async function GET(request: NextRequest) {
  try {
    const users = await firebaseAdminService.getAllUsers()
    return NextResponse.json({ success: true, users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { uid, ...updateData } = await request.json()

    if (!uid) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 })
    }

    const success = await firebaseAdminService.updateUser(uid, updateData)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 })
  }
}
