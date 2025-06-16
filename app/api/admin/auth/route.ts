import { type NextRequest, NextResponse } from "next/server"

// Admin credentials - replace with your secure credentials
const ADMIN_USERS = [
  {
    id: 1,
    username: "Workadmin",
    password: "160960",
    role: "super_admin",
    email: "samuelgikenyi@gmail.com",
  },
  // You can add more admin users here if needed
]

export async function POST(request: NextRequest) {
  try {
    const { username, password, email } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ success: false, message: "Username and password are required" }, { status: 400 })
    }

    // Find admin user with direct credential comparison
    const adminUser = ADMIN_USERS.find(
      (user) => (user.username === username || user.email === username) && user.password === password,
    )

    if (!adminUser) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }

    // Generate session token
    const sessionToken = generateSessionToken()
    const sessionData = {
      id: adminUser.id,
      username: adminUser.username,
      email: adminUser.email,
      role: adminUser.role,
      loginTime: new Date().toISOString(),
      token: sessionToken,
    }

    return NextResponse.json({
      success: true,
      message: "Login successful",
      role: adminUser.role,
      token: sessionToken,
      user: sessionData,
    })
  } catch (error) {
    console.error("Admin auth error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}
