import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check if the request is for admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Skip login page
    if (request.nextUrl.pathname === "/admin/login") {
      return NextResponse.next()
    }

    // For other admin routes, check authentication
    const adminAuth = request.cookies.get("admin_authenticated")

    if (!adminAuth || adminAuth.value !== "true") {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/admin/:path*",
}
