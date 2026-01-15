import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// ============================================
// Route Configuration
// ============================================

// Routes that require authentication
const PROTECTED_ROUTES = ["/dashboard"]

// Routes that should redirect to dashboard if already authenticated
const AUTH_ROUTES = ["/login", "/register"]

// Public routes that don't need any checks
const PUBLIC_ROUTES = ["/", "/api"]

// ============================================
// Auth Check Helper
// ============================================
function isAuthenticated(request: NextRequest): boolean {
  // Check for auth token in cookies or localStorage isn't accessible in middleware
  // We check for the token cookie that we'll set from the client
  const token = request.cookies.get("authToken")?.value

  if (!token) return false

  // Check token expiry from cookie
  const expiresAt = request.cookies.get("tokenExpiresAt")?.value
  if (expiresAt) {
    const expiryTime = new Date(expiresAt).getTime() - 30000 // 30s buffer
    if (Date.now() >= expiryTime) {
      return false
    }
  }

  return true
}

// ============================================
// Middleware Function
// ============================================
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // Static files like .css, .js, .ico
  ) {
    return NextResponse.next()
  }

  const authenticated = isAuthenticated(request)

  // Check if route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  // Check if route is an auth route (login/register)
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !authenticated) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated users from auth routes to dashboard
  if (isAuthRoute && authenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// ============================================
// Middleware Config
// ============================================
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)",
  ],
}

