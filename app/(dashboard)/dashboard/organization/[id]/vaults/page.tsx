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
import { ArrowLeft, Lock, Plus, Edit3, Trash2, Database, Globe, Vault, HardDrive, FileText } from "lucide-react"

interface OrganizationData {
  id: string
  name: string
  email: string
  merchantId: string
  status: string
}

interface Vault {
  id: string
  name: string
  domainName: string
  description: string
  workspace: string
  region: string
  status: "active" | "inactive" | "sealed"
  recordCount: number
  createdAt: string
}

// Mock data - replace with API call
const mockVaults: Vault[] = [
  {
    id: "1",
    name: "Customer Data Vault",
    domainName: "customers.vault.securelytix.io",
    description: "Secure storage for customer PII data",
    workspace: "Production Workspace",
    region: "Mumbai",
    status: "active",
    recordCount: 15420,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Payment Vault",
    domainName: "payments.vault.securelytix.io",
    description: "PCI-compliant payment data storage",
    workspace: "Production Workspace",
    region: "Mumbai",
    status: "active",
    recordCount: 8750,
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    name: "Test Vault",
    domainName: "test.vault.securelytix.io",
    description: "Development testing vault",
    workspace: "Development Workspace",
    region: "Mumbai",
    status: "sealed",
    recordCount: 0,
    createdAt: "2024-02-01",
  },
]

export default function VaultsListPage() {
  const params = useParams()
  const router = useRouter()
  const orgId = params.id as string

  const [organization, setOrganization] = useState<OrganizationData | null>(null)
  const [vaults, setVaults] = useState<Vault[]>(mockVaults)
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [vaultToDelete, setVaultToDelete] = useState<Vault | null>(null)
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

  const handleEdit = (vault: Vault) => {
    // Store vault data in sessionStorage for editing
    if (typeof window !== "undefined") {
      sessionStorage.setItem("editVault", JSON.stringify(vault))
    }
    router.push(`/dashboard/organization/${orgId}/create-vault?edit=true`)
  }

  const handleDeleteClick = (vault: Vault) => {
    setVaultToDelete(vault)
    setDeleteConfirmText("")
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (vaultToDelete) {
      setVaults(vaults.filter((v) => v.id !== vaultToDelete.id))
      console.log("Deleted vault:", vaultToDelete)
    }
    setDeleteDialogOpen(false)
    setVaultToDelete(null)
  }

  const getStatusBadge = (status: Vault["status"]) => {
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
      case "sealed":
        return (
          <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-1.5" />
            Sealed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatRecordCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
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

  const totalRecords = vaults.reduce((acc, v) => acc + v.recordCount, 0)
  const activeVaults = vaults.filter((v) => v.status === "active").length

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
        <Card className="border-0 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-amber-500/20 flex items-center justify-center shadow-sm">
                  <Vault className="h-7 w-7 text-amber-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Secure Vaults</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Encrypted data storage for {organization?.name || "your organization"}
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => router.push(`/dashboard/organization/${orgId}/create-vault`)}
                className="shadow-sm hover:shadow-md transition-all"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Vault
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-900">{vaults.length}</p>
                  <p className="text-xs text-amber-600/70">Total Vaults</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <HardDrive className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-900">{activeVaults}</p>
                  <p className="text-xs text-emerald-600/70">Active Vaults</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-900">{formatRecordCount(totalRecords)}</p>
                  <p className="text-xs text-blue-600/70">Total Records</p>
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
                <TableHead className="font-semibold">Vault</TableHead>
                <TableHead className="font-semibold">Domain</TableHead>
                <TableHead className="font-semibold">Workspace</TableHead>
                <TableHead className="font-semibold">Records</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Created</TableHead>
                <TableHead className="font-semibold text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vaults.length > 0 ? (
                vaults.map((vault, index) => (
                  <TableRow 
                    key={vault.id} 
                    className="group transition-colors hover:bg-amber-50/50"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                          <Vault className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-medium">{vault.name}</p>
                          <p className="text-xs text-muted-foreground">{vault.description}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                          <Globe className="h-3 w-3 text-blue-600" />
                        </div>
                        <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                          {vault.domainName}
                        </code>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {vault.workspace}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Database className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm font-semibold">{formatRecordCount(vault.recordCount)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(vault.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(vault.createdAt).toLocaleDateString("en-US", {
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
                              className="h-8 w-8 text-muted-foreground hover:text-amber-600 hover:bg-amber-100"
                              onClick={() => handleEdit(vault)}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit vault</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-100"
                              onClick={() => handleDeleteClick(vault)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete vault</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-48">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                        <Lock className="h-8 w-8 text-amber-400" />
                      </div>
                      <h3 className="font-medium text-lg mb-1">No vaults yet</h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        Create your first vault to securely store sensitive data
                      </p>
                      <Button 
                        onClick={() => router.push(`/dashboard/organization/${orgId}/create-vault`)}
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Vault
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
                <DialogTitle>Delete Vault</DialogTitle>
              </div>
              <DialogDescription className="text-left">
                Are you sure you want to delete <span className="font-medium text-foreground">&quot;{vaultToDelete?.name}&quot;</span>? 
                This will permanently remove all {formatRecordCount(vaultToDelete?.recordCount || 0)} records stored in this vault. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Type <span className="font-bold">{vaultToDelete?.name}</span> to confirm:
              </label>
              <Input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder={`Type "${vaultToDelete?.name}" to confirm`}
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
                disabled={deleteConfirmText !== vaultToDelete?.name}
              >
                Delete Vault
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}
