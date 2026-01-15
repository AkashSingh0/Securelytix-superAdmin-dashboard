"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ArrowLeft, UserPlus, Plus, Edit3, Trash2, Users, UserCheck, Clock, Mail, Phone } from "lucide-react"

interface OrganizationData {
  id: string
  name: string
  email: string
  merchantId: string
  status: string
}

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: string
  status: "active" | "inactive" | "pending"
  createdAt: string
}

// Mock data - replace with API call
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    role: "Admin",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1987654321",
    role: "Analyst",
    status: "active",
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    name: "Bob Wilson",
    email: "bob.wilson@example.com",
    phone: "+1122334455",
    role: "Developer",
    status: "pending",
    createdAt: "2024-02-01",
  },
]

export default function UsersListPage() {
  const params = useParams()
  const router = useRouter()
  const orgId = params.id as string

  const [organization, setOrganization] = useState<OrganizationData | null>(null)
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")

  // Load organization data from sessionStorage
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
      setLoading(false)
    }
  }, [orgId])

  const handleEdit = (user: User) => {
    // Store user data in sessionStorage for editing
    if (typeof window !== "undefined") {
      sessionStorage.setItem("editUser", JSON.stringify(user))
    }
    router.push(`/dashboard/organization/${orgId}/add-user?edit=true`)
  }

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user)
    setDeleteConfirmText("")
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      setUsers(users.filter((u) => u.id !== userToDelete.id))
      console.log("Deleted user:", userToDelete)
    }
    setDeleteDialogOpen(false)
    setUserToDelete(null)
  }

  const getStatusBadge = (status: User["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5" />
            Active
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="secondary" className="border">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-400 mr-1.5" />
            Inactive
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse" />
            Pending
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-blue-500",
      "bg-emerald-500",
      "bg-violet-500",
      "bg-amber-500",
      "bg-rose-500",
      "bg-cyan-500",
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
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

  const activeUsers = users.filter((u) => u.status === "active").length
  const pendingUsers = users.filter((u) => u.status === "pending").length

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Back Button */}
        <Button 
          variant="outline"
          onClick={() => router.push(`/dashboard/organization/${orgId}`)}
          className="border-2 border-black text-black bg-transparent hover:bg-black hover:text-white rounded-full transition-all gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Setup
        </Button>

        {/* Header Card */}
        <Card className="border-0 bg-gradient-to-r from-emerald-500/10 via-emerald-400/5 to-transparent">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-emerald-500/20 flex items-center justify-center shadow-sm">
                  <Users className="h-7 w-7 text-emerald-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Team Members</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Manage users for {organization?.name || "your organization"}
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => router.push(`/dashboard/organization/${orgId}/add-user`)}
                className="shadow-sm hover:shadow-md transition-all"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-900">{users.length}</p>
                  <p className="text-xs text-emerald-600/70">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-900">{activeUsers}</p>
                  <p className="text-xs text-blue-600/70">Active Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-900">{pendingUsers}</p>
                  <p className="text-xs text-amber-600/70">Pending Invites</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card className="shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-semibold">User</TableHead>
                <TableHead className="font-semibold">Contact</TableHead>
                <TableHead className="font-semibold">Role</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Joined</TableHead>
                <TableHead className="font-semibold text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <TableRow 
                    key={user.id} 
                    className="group transition-colors hover:bg-emerald-50/50"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className={`${getAvatarColor(user.name)} text-white text-sm font-medium`}>
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-3.5 w-3.5" />
                          <span>{user.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-100"
                              onClick={() => handleEdit(user)}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit user</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-100"
                              onClick={() => handleDeleteClick(user)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Remove user</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-48">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                        <UserPlus className="h-8 w-8 text-emerald-400" />
                      </div>
                      <h3 className="font-medium text-lg mb-1">No team members yet</h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        Invite your first team member to get started
                      </p>
                      <Button 
                        onClick={() => router.push(`/dashboard/organization/${orgId}/add-user`)}
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add User
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
                <DialogTitle>Remove User</DialogTitle>
              </div>
              <DialogDescription className="text-left">
                Are you sure you want to remove <span className="font-medium text-foreground">"{userToDelete?.name}"</span>? 
                They will lose access to this organization. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Type <span className="font-bold">{userToDelete?.name}</span> to confirm:
              </label>
              <Input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder={`Type "${userToDelete?.name}" to confirm`}
                className="w-full"
                autoComplete="off"
              />
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteConfirm}
                disabled={deleteConfirmText !== userToDelete?.name}
              >
                Remove User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}
