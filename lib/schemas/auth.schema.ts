import { z } from "zod"

// ============================================
// Registration Schema
// ============================================
export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number"),

  role: z
    .string()
    .min(1, "Role is required"),

  token: z
    .string()
    .min(1, "Registration token is required"),
})

// TypeScript type inferred from schema
export type RegisterFormData = z.infer<typeof registerSchema>

// Default values for registration form
export const registerFormDefaults: RegisterFormData = {
  name: "",
  email: "",
  password: "",
  role: "",
  token: "",
}

// ============================================
// Login Schema
// ============================================
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
})

// TypeScript type inferred from schema
export type LoginFormData = z.infer<typeof loginSchema>

// Default values for login form
export const loginFormDefaults: LoginFormData = {
  email: "",
  password: "",
}

// ============================================
// Role Options
// ============================================
export const roleOptions = [
  { value: "superadmin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
] as const

