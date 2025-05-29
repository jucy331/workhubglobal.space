import { type NextRequest, NextResponse } from "next/server"

// Replace the ADMIN_USERS array with your manual credentials
const ADMIN_USERS = [
  {
    id: 1,
    username: "Workadmin", // Change this to your desired username
    password: "160960", // Change this to your desired password
    role: "super_admin",
    email: "samuelgikenyi@gmail.com", // Change this to your email
  },
  // You can add more admin users here
  {
    id: 2,
    username: "manager",
    password: "ManagerPass456!",
    role: "admin",
    email: "manager@workhubglobal.com",
  },
]

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ success: false, message: "Username and password are required" }, { status: 400 })
    }

    // Find admin user with direct password comparison
    const adminUser = ADMIN_USERS.find((user) => user.username === username && user.password === password)

    if (!adminUser) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }

    // Generate session token
    const sessionToken = generateSessionToken()

    return NextResponse.json({
      success: true,
      message: "Login successful",
      role: adminUser.role,
      token: sessionToken,
      user: {
        id: adminUser.id,
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role,
      },
    })
  } catch (error) {
    console.error("Admin auth error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}
