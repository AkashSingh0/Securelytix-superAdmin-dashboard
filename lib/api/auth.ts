import { AUTH_API_BASE_URL } from "./config"
import type { RegisterFormData, LoginFormData } from "@/lib/schemas/auth.schema"

// ============================================
// Response Types
// ============================================
export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface TokenData {
  access_token: string
  token_type: string
  expires_in: number
  expires_at: string
  jwt_id: string
  user_id: string
  username: string
  refresh_token: string
  jwt_token_type: string
}

export interface RegisterResponse {
  success: boolean
  data?: AuthUser
  message?: string
  error?: string
}

export interface LoginResponse {
  success: boolean
  user?: AuthUser
  token?: TokenData
  message?: string
  error?: string
}

// ============================================
// Secure Headers for API Requests
// ============================================
const getSecureHeaders = (includeAuth = false): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest", // CSRF protection
  }

  if (includeAuth) {
    const token = getAuthToken()
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
  }

  return headers
}

// ============================================
// Register User
// ============================================
export async function registerUser(
  formData: RegisterFormData
): Promise<RegisterResponse> {
  try {
    const response = await fetch(`${AUTH_API_BASE_URL}/superadmin/register`, {
      method: "POST",
      headers: getSecureHeaders(),
      body: JSON.stringify({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
        token: formData.token.trim(),
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      const errorMessage = result.error || result.message || "Registration failed"
      const errorLower = errorMessage.toLowerCase()

      // Check for duplicate email - generic message to prevent enumeration
      if (
        errorLower.includes("already") ||
        errorLower.includes("exists") ||
        errorLower.includes("registered") ||
        errorLower.includes("duplicate") ||
        response.status === 409
      ) {
        return {
          success: false,
          error: "This email is already registered. Please use a different email or sign in.",
        }
      }

      // Check for invalid token
      if (
        errorLower.includes("token") ||
        errorLower.includes("invalid") ||
        errorLower.includes("unauthorized") ||
        response.status === 401
      ) {
        return {
          success: false,
          error: "Invalid registration token. Please check and try again.",
        }
      }

      return {
        success: false,
        error: errorMessage,
      }
    }

    return {
      success: true,
      data: result.data,
      message: result.message || "Registration successful",
    }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      success: false,
      error:
        error instanceof Error
          ? `Network error: ${error.message}`
          : "Failed to connect to server. Please check your internet connection.",
    }
  }
}

// ============================================
// Login User
// ============================================
export async function loginUser(
  formData: LoginFormData
): Promise<LoginResponse> {
  try {
    const response = await fetch(`${AUTH_API_BASE_URL}/superadmin/login`, {
      method: "POST",
      headers: getSecureHeaders(),
      body: JSON.stringify({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      // Generic error message to prevent user enumeration
      const errorMessage = result.error || result.message || "Login failed"
      const errorLower = errorMessage.toLowerCase()

      if (
        errorLower.includes("invalid") ||
        errorLower.includes("incorrect") ||
        errorLower.includes("wrong") ||
        errorLower.includes("not found") ||
        response.status === 401 ||
        response.status === 404
      ) {
        return {
          success: false,
          error: "Invalid email or password. Please try again.",
        }
      }

      if (
        errorLower.includes("disabled") ||
        errorLower.includes("inactive") ||
        errorLower.includes("blocked") ||
        response.status === 403
      ) {
        return {
          success: false,
          error: "Your account has been disabled. Please contact support.",
        }
      }

      return {
        success: false,
        error: errorMessage,
      }
    }

    // Extract user and token from API response structure
    // Response: { data: { superadmin: {...}, token: {...} }, message: "..." }
    const userData = result.data?.superadmin
    const tokenData = result.data?.token

    if (!userData || !tokenData?.access_token) {
      return {
        success: false,
        error: "Invalid response from server. Please try again.",
      }
    }

    return {
      success: true,
      user: userData,
      token: tokenData,
      message: result.message || "Login successful",
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      error:
        error instanceof Error
          ? `Network error: ${error.message}`
          : "Failed to connect to server. Please check your internet connection.",
    }
  }
}

// ============================================
// Auth Storage Keys (centralized for security)
// ============================================
const AUTH_KEYS = {
  TOKEN: "authToken",
  TOKEN_TYPE: "tokenType",
  EXPIRES_AT: "tokenExpiresAt",
  JWT_ID: "jwtId",
  USER_ID: "userId",
  USER_NAME: "userName",
  USER_EMAIL: "userEmail",
  USER_ROLE: "userRole",
  IS_ACTIVE: "userIsActive",
} as const

// ============================================
// Store Auth Data (after successful login)
// ============================================
export function storeAuthData(user: AuthUser, token: TokenData): void {
  if (typeof window === "undefined") return

  try {
    // Store token data
    localStorage.setItem(AUTH_KEYS.TOKEN, token.access_token)
    localStorage.setItem(AUTH_KEYS.TOKEN_TYPE, token.token_type)
    localStorage.setItem(AUTH_KEYS.EXPIRES_AT, token.expires_at)
    localStorage.setItem(AUTH_KEYS.JWT_ID, token.jwt_id)

    // Store user data
    localStorage.setItem(AUTH_KEYS.USER_ID, user.id)
    localStorage.setItem(AUTH_KEYS.USER_NAME, user.name)
    localStorage.setItem(AUTH_KEYS.USER_EMAIL, user.email)
    localStorage.setItem(AUTH_KEYS.USER_ROLE, user.role)
    localStorage.setItem(AUTH_KEYS.IS_ACTIVE, String(user.is_active ?? true))
  } catch (error) {
    console.error("Failed to store auth data:", error)
  }
}

// ============================================
// Clear Auth Data (on logout or session expiry)
// ============================================
export function clearAuthData(): void {
  if (typeof window === "undefined") return

  try {
    Object.values(AUTH_KEYS).forEach((key) => {
      localStorage.removeItem(key)
    })
  } catch (error) {
    console.error("Failed to clear auth data:", error)
  }
}

// ============================================
// Get Current Auth Token
// ============================================
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null

  try {
    return localStorage.getItem(AUTH_KEYS.TOKEN)
  } catch {
    return null
  }
}

// ============================================
// Check if Token is Expired
// ============================================
export function isTokenExpired(): boolean {
  if (typeof window === "undefined") return true

  try {
    const expiresAt = localStorage.getItem(AUTH_KEYS.EXPIRES_AT)
    if (!expiresAt) return true

    // Add 30 second buffer to account for network latency
    const expiryTime = new Date(expiresAt).getTime() - 30000
    return Date.now() >= expiryTime
  } catch {
    return true
  }
}

// ============================================
// Check if User is Authenticated
// ============================================
export function isAuthenticated(): boolean {
  const token = getAuthToken()
  if (!token) return false

  return !isTokenExpired()
}

// ============================================
// Get Current User Data
// ============================================
export function getCurrentUser(): AuthUser | null {
  if (typeof window === "undefined") return null

  try {
    const id = localStorage.getItem(AUTH_KEYS.USER_ID)
    const name = localStorage.getItem(AUTH_KEYS.USER_NAME)
    const email = localStorage.getItem(AUTH_KEYS.USER_EMAIL)
    const role = localStorage.getItem(AUTH_KEYS.USER_ROLE)
    const isActive = localStorage.getItem(AUTH_KEYS.IS_ACTIVE)

    if (!id || !email) return null

    return {
      id,
      name: name || "",
      email,
      role: role || "",
      is_active: isActive === "true",
    }
  } catch {
    return null
  }
}

// ============================================
// Logout User
// ============================================
export function logout(): void {
  clearAuthData()

  // Redirect to login (works in both client and edge contexts)
  if (typeof window !== "undefined") {
    window.location.href = "/login"
  }
}

// ============================================
// Get Auth Header for API Requests
// ============================================
export function getAuthHeader(): Record<string, string> {
  const token = getAuthToken()
  if (!token || isTokenExpired()) {
    return {}
  }
  return { Authorization: `Bearer ${token}` }
}

// ============================================
// Secure API Fetch Wrapper
// ============================================
export async function secureFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Check authentication before making request
  if (!isAuthenticated()) {
    logout()
    throw new Error("Session expired. Please login again.")
  }

  const headers = {
    ...getSecureHeaders(true),
    ...options.headers,
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  // Handle 401 Unauthorized - auto logout
  if (response.status === 401) {
    logout()
    throw new Error("Session expired. Please login again.")
  }

  return response
}
