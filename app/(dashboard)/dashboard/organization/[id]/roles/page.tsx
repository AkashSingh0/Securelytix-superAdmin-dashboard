"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { ArrowLeft, Users, Plus, Edit3, Trash2, UserCog, Database, TableIcon, Key } from "lucide-react"

interface OrganizationData {
  id: string
  name: string
  email: string
  merchantId: string
  status: string
}

interface Role {
  id: string
  name: string
  vaults: string[]
  tables: string[]
  fields: string[]
  policies: string[]
  createdAt: string
}

// Mock data - replace with API call
const mockRoles: Role[] = [
  {
    id: "1",
    name: "Admin",
    vaults: ["vault_001", "vault_002", "vault_003", "vault_004", "vault_005"],
    tables: ["customers", "transactions", "orders", "products", "invoices"],
    fields: ["email", "phone", "name"],
    policies: ["read_write", "admin"],
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Analyst",
    vaults: ["vault_001", "vault_002", "vault_003", "vault_004", "vault_005"],
    tables: ["customers"],
    fields: ["email", "name"],
    policies: ["read_only"],
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    name: "Developer",
    vaults: ["vault_002"],
    tables: ["transactions"],
    fields: ["email", "phone"],
    policies: ["read_write", "tokenize"],
    createdAt: "2024-02-01",
  },
]

export default function RolesListPage() {
  const params = useParams()
  const router = useRouter()
  const orgId = params.id as string

  const [organization, setOrganization] = useState<OrganizationData | null>(null)
  const [roles, setRoles] = useState<Role[]>(mockRoles)
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null)
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

  const handleEdit = (role: Role) => {
    // Store role data in sessionStorage for editing
    if (typeof window !== "undefined") {
      sessionStorage.setItem("editRole", JSON.stringify(role))
    }
    router.push(`/dashboard/organization/${orgId}/add-role?edit=true`)
  }

  const handleDeleteClick = (role: Role) => {
    setRoleToDelete(role)
    setDeleteConfirmText("")
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (roleToDelete) {
      setRoles(roles.filter((r) => r.id !== roleToDelete.id))
      console.log("Deleted role:", roleToDelete)
    }
    setDeleteDialogOpen(false)
    setRoleToDelete(null)
  }

  const getPolicyBadgeColor = (policy: string) => {
    switch (policy.toLowerCase()) {
      case "admin":
        return "bg-red-100 text-red-700 border-red-200"
      case "read_write":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "read_only":
        return "bg-green-100 text-green-700 border-green-200"
      case "tokenize":
        return "bg-purple-100 text-purple-700 border-purple-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
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
        <Card className="border-0 bg-gradient-to-r from-blue-500/10 via-blue-400/5 to-transparent">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-blue-500/20 flex items-center justify-center shadow-sm">
                  <UserCog className="h-7 w-7 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Roles & Permissions</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Manage access control for {organization?.name || "your organization"}
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => router.push(`/dashboard/organization/${orgId}/add-role`)}
                className="shadow-sm hover:shadow-md transition-all"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Role
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-900">{roles.length}</p>
                  <p className="text-xs text-blue-600/70">Total Roles</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Database className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-900">
                    {roles.reduce((acc, r) => acc + r.vaults.length, 0)}
                  </p>
                  <p className="text-xs text-purple-600/70">Vault Access</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Key className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-900">
                    {new Set(roles.flatMap((r) => r.policies)).size}
                  </p>
                  <p className="text-xs text-emerald-600/70">Unique Policies</p>
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
                <TableHead className="font-semibold">Role Name</TableHead>
                <TableHead className="font-semibold">Vaults</TableHead>
                <TableHead className="font-semibold">Tables</TableHead>
                <TableHead className="font-semibold">Policies</TableHead>
                <TableHead className="font-semibold">Created</TableHead>
                <TableHead className="font-semibold text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.length > 0 ? (
                roles.map((role, index) => (
                  <TableRow 
                    key={role.id} 
                    className="group transition-colors hover:bg-blue-50/50"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                          <UserCog className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-medium">{role.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        {role.vaults.slice(0, 2).map((vault) => (
                          <Badge
                            key={vault}
                            variant="outline"
                            className="text-xs font-medium bg-blue-50 text-blue-700 border-blue-200"
                          >
                            <Database className="h-3 w-3 mr-1" />
                            {vault}
                          </Badge>
                        ))}
                        {role.vaults.length > 2 && (
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                              <span className="inline-flex">
                                <Badge
                                  variant="outline"
                                  className="text-xs font-medium bg-gray-100 text-gray-700 border-gray-300 cursor-pointer hover:bg-gray-200"
                                >
                                  +{role.vaults.length - 2} more
                                </Badge>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <div className="flex flex-wrap gap-1.5">
                                {role.vaults.slice(2).map((vault) => (
                                  <Badge
                                    key={vault}
                                    variant="outline"
                                    className="text-xs font-medium bg-blue-50 text-blue-700 border-blue-200"
                                  >
                                    <Database className="h-3 w-3 mr-1" />
                                    {vault}
                                  </Badge>
                                ))}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        {role.tables.slice(0, 2).map((table) => (
                          <Badge
                            key={table}
                            variant="outline"
                            className="text-xs font-medium bg-violet-50 text-violet-700 border-violet-200"
                          >
                            <TableIcon className="h-3 w-3 mr-1" />
                            {table}
                          </Badge>
                        ))}
                        {role.tables.length > 2 && (
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                              <span className="inline-flex">
                                <Badge
                                  variant="outline"
                                  className="text-xs font-medium bg-gray-100 text-gray-700 border-gray-300 cursor-pointer hover:bg-gray-200"
                                >
                                  +{role.tables.length - 2} more
                                </Badge>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <div className="flex flex-wrap gap-1.5">
                                {role.tables.slice(2).map((table) => (
                                  <Badge
                                    key={table}
                                    variant="outline"
                                    className="text-xs font-medium bg-violet-50 text-violet-700 border-violet-200"
                                  >
                                    <TableIcon className="h-3 w-3 mr-1" />
                                    {table}
                                  </Badge>
                                ))}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        {role.policies.map((policy) => (
                          <Badge
                            key={policy}
                            variant="outline"
                            className={`text-xs font-medium ${getPolicyBadgeColor(policy)}`}
                          >
                            {policy.replace("_", " ")}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(role.createdAt).toLocaleDateString("en-US", {
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
                              className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-100"
                              onClick={() => handleEdit(role)}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit role</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-100"
                              onClick={() => handleDeleteClick(role)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete role</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-48">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                        <UserCog className="h-8 w-8 text-blue-400" />
                      </div>
                      <h3 className="font-medium text-lg mb-1">No roles yet</h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        Create your first role to define access permissions
                      </p>
                      <Button 
                        onClick={() => router.push(`/dashboard/organization/${orgId}/add-role`)}
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Role
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
                <DialogTitle>Delete Role</DialogTitle>
              </div>
              <DialogDescription className="text-left">
                Are you sure you want to delete <span className="font-medium text-foreground">&quot;{roleToDelete?.name}&quot;</span>? 
                This will remove all associated permissions. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Type <span className="font-bold">{roleToDelete?.name}</span> to confirm:
              </label>
              <Input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder={`Type "${roleToDelete?.name}" to confirm`}
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
                disabled={deleteConfirmText !== roleToDelete?.name}
              >
                Delete Role
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}
