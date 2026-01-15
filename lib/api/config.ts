// Shared API configuration

// Main backend API (organizations, workspaces, etc.)
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://website-backend.securelytix.tech/api/v1"

// Identity/Auth API (registration, login)
export const AUTH_API_BASE_URL =
  process.env.NEXT_PUBLIC_AUTH_API_URL || "https://developidentity.securelytix.tech/api/v1"

