"use client"

import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, UserPlus, Mail, Phone, User, Shield } from "lucide-react"

interface OrganizationData {
  id: string
  name: string
  email: string
  merchantId: string
  status: string
}

interface UserData {
  id: string
  name: string
  email: string
  phone: string
  role: string
  status: string
}

export default function AddUserPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const orgId = params.id as string
  const isEditMode = searchParams.get("edit") === "true"

  const [organization, setOrganization] = useState<OrganizationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<UserData | null>(null)

  // Form state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [role, setRole] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock roles - in real app, these would come from API based on created roles
  const roleOptions = [
    { value: "superadmin", label: "Super Admin" },
    { value: "admin", label: "Admin" },
    { value: "analyst", label: "Analyst" },
    { value: "viewer", label: "Viewer" },
  ]

  // Load organization data and edit data from sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("setupOrganization")
      if (stored) {
        try {
          const org = JSON.parse(stored)
          setOrganization(org)
        } catch (err) {
          console.error("Error loading organization data:", err)
        }
      }

      // Load edit data if in edit mode
      if (isEditMode) {
        const editData = sessionStorage.getItem("editUser")
        if (editData) {
          try {
            const user = JSON.parse(editData) as UserData
            setEditingUser(user)
            setName(user.name)
            setEmail(user.email)
            setPhone(user.phone)
            setRole(user.role.toLowerCase().replace(" ", ""))
            // Clear the edit data from sessionStorage after loading
            sessionStorage.removeItem("editUser")
          } catch (err) {
            console.error("Error loading edit data:", err)
          }
        }
      }

      setLoading(false)
    }
  }, [orgId, isEditMode])

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Please enter a name")
      return
    }
    if (!email.trim()) {
      alert("Please enter an email")
      return
    }
    if (!phone.trim()) {
      alert("Please enter a phone number")
      return
    }
    if (!role) {
      alert("Please select a role")
      return
    }

    setIsSubmitting(true)
    try {
      if (isEditMode && editingUser) {
        console.log("Updating user:", {
          id: editingUser.id,
          name,
          email,
          phone,
          role,
          organizationId: organization?.merchantId || orgId,
        })
      } else {
        console.log("Creating user:", {
          name,
          email,
          phone,
          role,
          organizationId: organization?.merchantId || orgId,
        })
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))
      router.push(`/dashboard/organization/${orgId}/users`)
    } catch (error) {
      console.error("Error saving user:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getInitials = (name: string) => {
    if (!name) return "?"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-xl">
      {/* Back Button */}
      <Button 
        variant="outline"
        onClick={() => router.push(`/dashboard/organization/${orgId}/users`)}
        className="border-2 border-black text-black bg-transparent hover:bg-black hover:text-white rounded-full transition-all gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Users
      </Button>

      {/* Header Card */}
      <Card className="border-0 bg-gradient-to-r from-emerald-500/10 via-emerald-400/5 to-transparent">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-emerald-500/20 flex items-center justify-center shadow-sm">
              <UserPlus className="h-7 w-7 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {isEditMode ? "Edit User" : "Add New User"}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {isEditMode 
                  ? `Update user details for ${organization?.name || "your organization"}`
                  : `Invite a team member to ${organization?.name || "your organization"}`
                }
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Form Card */}
      <Card className="shadow-sm">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-semibold">User Details</h2>
            </div>
            {/* Avatar Preview */}
            <Avatar className="h-12 w-12 border-2 border-emerald-200">
              <AvatarFallback className="bg-emerald-500 text-white font-medium">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Enter full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              Phone <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="e.g., +91 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-11"
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role" className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              Role <span className="text-destructive">*</span>
            </Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="role" className="h-11">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              The role determines what actions the user can perform
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/organization/${orgId}/users`)}
              disabled={isSubmitting}
              className="px-6"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="px-6 shadow-sm hover:shadow-md transition-all"
            >
              {isSubmitting 
                ? (isEditMode ? "Updating..." : "Adding User...") 
                : (isEditMode ? "Update User" : "Add User")
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
