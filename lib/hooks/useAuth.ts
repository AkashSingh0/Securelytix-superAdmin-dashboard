"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  isAuthenticated,
  isTokenExpired,
  getCurrentUser,
  clearAuthData,
  getAuthToken,
  type AuthUser,
} from "@/lib/api/auth"

// ============================================
// Auth Check Interval (1 minute)
// ============================================
const AUTH_CHECK_INTERVAL = 60000

// ============================================
// useAuth Hook
// ============================================
export function useAuth() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check authentication status
  const checkAuth = useCallback(() => {
    const authenticated = isAuthenticated()
    setIsLoggedIn(authenticated)

    if (authenticated) {
      const currentUser = getCurrentUser()
      setUser(currentUser)
    } else {
      setUser(null)
    }

    return authenticated
  }, [])

  // Logout function
  const logout = useCallback(() => {
    clearAuthData()
    
    // Clear cookies for middleware
    document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    document.cookie = "tokenExpiresAt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    
    setUser(null)
    setIsLoggedIn(false)
    router.push("/login")
  }, [router])

  // Handle session expiry
  const handleSessionExpiry = useCallback(() => {
    if (isTokenExpired() && isLoggedIn) {
      console.warn("Session expired, logging out...")
      logout()
    }
  }, [isLoggedIn, logout])

  // Initial auth check
  useEffect(() => {
    const authenticated = checkAuth()
    setIsLoading(false)

    // Set cookies for middleware to read (since middleware can't access localStorage)
    if (authenticated) {
      const token = getAuthToken()
      const expiresAt = localStorage.getItem("tokenExpiresAt")
      
      if (token) {
        document.cookie = `authToken=${token}; path=/; SameSite=Strict`
      }
      if (expiresAt) {
        document.cookie = `tokenExpiresAt=${expiresAt}; path=/; SameSite=Strict`
      }
    }
  }, [checkAuth])

  // Periodic auth check for token expiry
  useEffect(() => {
    if (!isLoggedIn) return

    // Check immediately
    handleSessionExpiry()

    // Set up interval for periodic checks
    const interval = setInterval(handleSessionExpiry, AUTH_CHECK_INTERVAL)

    return () => clearInterval(interval)
  }, [isLoggedIn, handleSessionExpiry])

  // Listen for storage changes (logout from another tab)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "authToken" && !event.newValue) {
        // Token was removed (logout from another tab)
        setUser(null)
        setIsLoggedIn(false)
        router.push("/login")
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [router])

  // Check auth on visibility change (user returns to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        handleSessionExpiry()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [handleSessionExpiry])

  return {
    user,
    isLoading,
    isLoggedIn,
    logout,
    checkAuth,
  }
}

// ============================================
// useRequireAuth Hook (for protected pages)
// ============================================
export function useRequireAuth() {
  const { user, isLoading, isLoggedIn, logout, checkAuth } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      // Redirect to login with return URL
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [isLoading, isLoggedIn, router, pathname])

  return {
    user,
    isLoading,
    isLoggedIn,
    logout,
    checkAuth,
  }
}

// ============================================
// useRedirectIfAuthenticated Hook (for auth pages)
// ============================================
export function useRedirectIfAuthenticated(redirectTo = "/dashboard") {
  const { isLoading, isLoggedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      router.push(redirectTo)
    }
  }, [isLoading, isLoggedIn, router, redirectTo])

  return { isLoading, isLoggedIn }
}

