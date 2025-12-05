"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle2, Loader2, Eye, EyeOff } from "lucide-react"
import { API_BASE_URL } from "@/lib/api/config"

interface RegisterResponse {
  message?: string
  token?: string
  user?: {
    id?: string
    name: string
    email: string
    role: string
    created_at?: string
  }
  error?: string
}


export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState("")
  const [token, setToken] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  
  const REQUIRED_TOKEN = "productionTokenForSignUpPage"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate inputs
    if (!name.trim() || !email.trim() || !password.trim() || !role.trim() || !token.trim()) {
      setError("All fields are required")
      return
    }

    // Validate token
    if (token.trim() !== REQUIRED_TOKEN) {
      setError("Invalid registration token. Please enter the correct token.")
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    // Validate password
    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }
    if (!/(?=.*[a-z])/.test(password)) {
      setError("Password must contain at least one lowercase letter")
      return
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      setError("Password must contain at least one uppercase letter")
      return
    }
    if (!/(?=.*\d)/.test(password)) {
      setError("Password must contain at least one number")
      return
    }

    setLoading(true)
    try {
      // Call registration API
      const response = await fetch(`${API_BASE_URL}/superadmin/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password: password,
          role: role,
          token: token.trim(),
        }),
      })

      const data: RegisterResponse = await response.json()

      if (!response.ok) {
        // Handle API errors
        const errorMessage = data.error || data.message || `Registration failed: ${response.statusText}`
        
        // Check if email is already registered
        const errorLower = errorMessage.toLowerCase()
        if (
          errorLower.includes("already") ||
          errorLower.includes("exists") ||
          errorLower.includes("registered") ||
          response.status === 409 || // Conflict status code
          response.status === 400
        ) {
          setError("Email is already registered")
        } else {
          setError(errorMessage)
        }
        return
      }

      // Registration successful
      // Store authentication token if provided
      if (data.token) {
        localStorage.setItem("authToken", data.token)
      }

      // Store user information
      if (data.user) {
        localStorage.setItem("userEmail", data.user.email)
        localStorage.setItem("userName", data.user.name)
        localStorage.setItem("userRole", data.user.role)
        if (data.user.id) {
          localStorage.setItem("userId", data.user.id)
        }
        // Optionally save user info for reference
        localStorage.setItem("registeredUserInfo", JSON.stringify({
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
        }))
      }

      // Clear all form fields
      setName("")
      setEmail("")
      setPassword("")
      setRole("")
      setToken("")

      // Show success dialog
      setShowSuccessDialog(true)
    } catch (err) {
      console.error("Registration error:", err)
      setError(
        err instanceof Error
          ? `Network error: ${err.message}`
          : "Failed to register. Please check your connection and try again."
      )
    } finally {
      setLoading(false)
    }
  }

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false)
    // Redirect to login page
    router.push("/login")
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50 p-4">
        <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Image
              src="/securelytix-logo.svg"
              alt="Securelytix Logo"
              width={200}
              height={60}
              className="h-auto"
              priority
            />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Create Account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your information to create a new account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                Password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={loading}
                >
                  {showPassword ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Must be at least 6 characters with uppercase, lowercase, and number
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">
                Role <span className="text-destructive">*</span>
              </Label>
              <Input
                id="role"
                type="text"
                placeholder="Enter your role (e.g., admin, user, superadmin)"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="token">
                Registration Token <span className="text-destructive">*</span>
              </Label>
              <Input
                id="token"
                type="text"
                placeholder="Enter registration token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                Please enter the registration token provided to you
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register Now"
              )}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>

    {/* Success Dialog */}
    <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-accent" />
          </div>
          <DialogTitle className="text-center text-xl">
            Registration Successful!
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            Your registration has been successfully completed. You can now log in with your credentials.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Button onClick={handleSuccessDialogClose} className="w-full sm:w-auto">
            Continue to Sign In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}

