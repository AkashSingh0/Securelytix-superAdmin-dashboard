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
import { ArrowLeft, Layers, Plus, Edit3, Trash2, MapPin, Database, Server, Activity } from "lucide-react"

interface OrganizationData {
  id: string
  name: string
  email: string
  merchantId: string
  status: string
}

interface Workspace {
  id: string
  name: string
  description: string
  region: string
  status: "active" | "inactive" | "provisioning"
  vaultCount: number
  createdAt: string
}

// Mock data - replace with API call
const mockWorkspaces: Workspace[] = [
  {
    id: "1",
    name: "Production Workspace",
    description: "Main production environment for live data",
    region: "Mumbai",
    status: "active",
    vaultCount: 3,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Development Workspace",
    description: "Development and testing environment",
    region: "Mumbai",
    status: "active",
    vaultCount: 2,
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    name: "Staging Workspace",
    description: "Pre-production staging environment",
    region: "Mumbai",
    status: "provisioning",
    vaultCount: 0,
    createdAt: "2024-02-01",
  },
]

export default function WorkspacesListPage() {
  const params = useParams()
  const router = useRouter()
  const orgId = params.id as string

  const [organization, setOrganization] = useState<OrganizationData | null>(null)
  const [workspaces, setWorkspaces] = useState<Workspace[]>(mockWorkspaces)
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [workspaceToDelete, setWorkspaceToDelete] = useState<Workspace | null>(null)
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

  const handleEdit = (workspace: Workspace) => {
    // Store workspace data in sessionStorage for editing
    if (typeof window !== "undefined") {
      sessionStorage.setItem("editWorkspace", JSON.stringify(workspace))
    }
    router.push(`/dashboard/organization/${orgId}/create-workspace?edit=true`)
  }

  const handleDeleteClick = (workspace: Workspace) => {
    setWorkspaceToDelete(workspace)
    setDeleteConfirmText("")
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (workspaceToDelete) {
      setWorkspaces(workspaces.filter((w) => w.id !== workspaceToDelete.id))
      console.log("Deleted workspace:", workspaceToDelete)
    }
    setDeleteDialogOpen(false)
    setWorkspaceToDelete(null)
  }

  const getStatusBadge = (status: Workspace["status"]) => {
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
      case "provisioning":
        return (
          <Badge className="bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-100">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-500 mr-1.5 animate-pulse" />
            Provisioning
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
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

  const totalVaults = workspaces.reduce((acc, w) => acc + w.vaultCount, 0)
  const activeWorkspaces = workspaces.filter((w) => w.status === "active").length

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
        <Card className="border-0 bg-gradient-to-r from-violet-500/10 via-violet-400/5 to-transparent">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-violet-500/20 flex items-center justify-center shadow-sm">
                  <Layers className="h-7 w-7 text-violet-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Workspaces</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Organize and manage environments for {organization?.name || "your organization"}
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => router.push(`/dashboard/organization/${orgId}/create-workspace`)}
                className="shadow-sm hover:shadow-md transition-all"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Workspace
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-violet-50 to-white border-violet-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
                  <Server className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-violet-900">{workspaces.length}</p>
                  <p className="text-xs text-violet-600/70">Total Workspaces</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-900">{activeWorkspaces}</p>
                  <p className="text-xs text-emerald-600/70">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Database className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-900">{totalVaults}</p>
                  <p className="text-xs text-amber-600/70">Total Vaults</p>
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
                <TableHead className="font-semibold">Workspace</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="font-semibold">Region</TableHead>
                <TableHead className="font-semibold">Vaults</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Created</TableHead>
                <TableHead className="font-semibold text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workspaces.length > 0 ? (
                workspaces.map((workspace, index) => (
                  <TableRow 
                    key={workspace.id} 
                    className="group transition-colors hover:bg-violet-50/50"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
                          <Layers className="h-5 w-5 text-violet-600" />
                        </div>
                        <span className="font-medium">{workspace.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <p className="text-sm text-muted-foreground truncate">{workspace.description}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center text-xs">
                          🇮🇳
                        </div>
                        <span className="text-sm">{workspace.region}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Database className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm font-medium">{workspace.vaultCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(workspace.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(workspace.createdAt).toLocaleDateString("en-US", {
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
                              className="h-8 w-8 text-muted-foreground hover:text-violet-600 hover:bg-violet-100"
                              onClick={() => handleEdit(workspace)}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit workspace</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-100"
                              onClick={() => handleDeleteClick(workspace)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete workspace</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-48">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="h-16 w-16 rounded-full bg-violet-100 flex items-center justify-center mb-4">
                        <Layers className="h-8 w-8 text-violet-400" />
                      </div>
                      <h3 className="font-medium text-lg mb-1">No workspaces yet</h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        Create your first workspace to organize your data
                      </p>
                      <Button 
                        onClick={() => router.push(`/dashboard/organization/${orgId}/create-workspace`)}
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Workspace
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
                <DialogTitle>Delete Workspace</DialogTitle>
              </div>
              <DialogDescription className="text-left">
                Are you sure you want to delete <span className="font-medium text-foreground">"{workspaceToDelete?.name}"</span>? 
                This will also remove all {workspaceToDelete?.vaultCount || 0} associated vault(s). This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Type <span className="font-bold">{workspaceToDelete?.name}</span> to confirm:
              </label>
              <Input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder={`Type "${workspaceToDelete?.name}" to confirm`}
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
                disabled={deleteConfirmText !== workspaceToDelete?.name}
              >
                Delete Workspace
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}
