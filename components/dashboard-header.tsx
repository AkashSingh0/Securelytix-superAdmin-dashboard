"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut } from "lucide-react"

interface DashboardHeaderProps {
  userEmail?: string
}

export function DashboardHeader({ userEmail = "user@example.com" }: DashboardHeaderProps) {
  const [imageError, setImageError] = useState(false)
  const router = useRouter()

  // Get initials from email
  const getInitials = (email: string) => {
    const parts = email.split("@")[0]
    if (parts.length >= 2) {
      return parts.substring(0, 2).toUpperCase()
    }
    return email.substring(0, 2).toUpperCase()
  }

  const initials = getInitials(userEmail)

  const handleLogout = () => {
    // Clear localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("userEmail")
    }
    // Redirect to login page
    router.push("/login")
  }

  return (
    <header className="border-b bg-card">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left Side - Company Logo */}
        <div className="flex items-center h-full">
          {!imageError ? (
            <img
              src="/securelytix-logo.svg"
              alt="Securelytix Logo"
              className="h-10 w-auto object-contain"
              style={{ maxHeight: '38px' }}
              onError={() => setImageError(true)}
            />
          ) : (
            <h1 className="text-xl font-bold">Securelytix</h1>
          )}
        </div>

        {/* Right Side - Email Initial with Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="cursor-pointer">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userEmail}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

