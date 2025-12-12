"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lock, Loader2, AlertCircle, ArrowLeft, LayoutGrid } from "lucide-react"
import { UnifiedSearchFilter } from "@/components/unified-search-filter"
import { useSearchFilter } from "@/contexts/search-filter-context"
import { 
  fetchWorkspaceDetail, 
  fetchWorkspaceVaults, 
  type WorkspaceDetail, 
  type VaultItem 
} from "@/lib/api/workspace"

export default function WorkspaceVaultsPage() {
  const params = useParams()
  const router = useRouter()
  const { state } = useSearchFilter()
  const workspaceId = params.workspaceId as string

  const [workspace, setWorkspace] = useState<WorkspaceDetail | null>(null)
  const [vaults, setVaults] = useState<VaultItem[]>([])
  const [totalVaults, setTotalVaults] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingVaults, setIsLoadingVaults] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [vaultError, setVaultError] = useState<string | null>(null)

  // Fetch workspace details
  useEffect(() => {
    const loadWorkspaceDetails = async () => {
      if (!workspaceId) return

      setIsLoading(true)
      setError(null)

      try {
        const response = await fetchWorkspaceDetail(workspaceId)

        if (response.success && response.data) {
          setWorkspace(response.data)
        } else {
          setError(response.error || "Failed to load workspace details")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    loadWorkspaceDetails()
  }, [workspaceId])

  // Fetch vaults for this workspace
  useEffect(() => {
    const loadVaults = async () => {
      if (!workspaceId) return

      setIsLoadingVaults(true)
      setVaultError(null)

      try {
        const response = await fetchWorkspaceVaults(workspaceId, 0, 100)

        if (response.success) {
          setVaults(response.data || [])
          setTotalVaults(response.total_vaults || 0)
        } else {
          setVaultError(response.error || "Failed to load vaults")
          setVaults([])
        }
      } catch (err) {
        setVaultError(err instanceof Error ? err.message : "An unexpected error occurred")
        setVaults([])
      } finally {
        setIsLoadingVaults(false)
      }
    }

    loadVaults()
  }, [workspaceId])

  // Filter vaults based on search query (Vault ID, Vault Name, Merchant ID)
  const filteredVaults = vaults.filter((vault) => {
    const query = state.searchQuery.toLowerCase()
    if (!query) return true

    return (
      (vault.vault_id || "").toLowerCase().includes(query) ||
      (vault.vault_name || "").toLowerCase().includes(query) ||
      (vault.merchant_id || "").toLowerCase().includes(query)
    )
  })

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return dateString
    }
  }

  // Format last accessed
  const formatLastAccessed = (dateString: string | null) => {
    if (!dateString) return "Never"
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)

      if (diffMins < 1) return "Just now"
      if (diffMins < 60) return `${diffMins} min ago`
      if (diffHours < 24) return `${diffHours} hours ago`
      if (diffDays < 7) return `${diffDays} days ago`
      return formatDate(dateString)
    } catch {
      return dateString
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading workspace...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Workspaces
        </Button>
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Button and Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{workspace?.workspaceName || "Workspace Vaults"}</h1>
            <p className="text-sm text-muted-foreground">
              {workspace?.merchantId} • {workspace?.region || "No region"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <UnifiedSearchFilter
            placeholder="Search vaults..."
            alignRight={false}
          />
        </div>
      </div>

      {/* Workspace Info Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <LayoutGrid className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Workspace ID</p>
                <p className="font-mono text-xs truncate" title={workspace?.workspaceId}>{workspace?.workspaceId}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Merchant Email</p>
                <p className="text-sm">{workspace?.merchantEmail || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge variant={workspace?.status === "active" ? "default" : "secondary"}>
                  {workspace?.status || "unknown"}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Vaults</p>
                <p className="text-lg font-bold">{totalVaults}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading Vaults */}
      {isLoadingVaults && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading vaults...</span>
        </div>
      )}

      {/* Vault Error */}
      {vaultError && !isLoadingVaults && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <span>{vaultError}</span>
          </div>
        </div>
      )}

      {/* Empty Vaults */}
      {!isLoadingVaults && !vaultError && filteredVaults.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center text-muted-foreground">
            <Lock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No vaults found</p>
            {state.searchQuery ? (
              <p className="text-sm mt-1">Try adjusting your search query</p>
            ) : (
              <p className="text-sm mt-1">This workspace has no vaults yet</p>
            )}
          </div>
        </div>
      )}

      {/* Vault List */}
      {!isLoadingVaults && !vaultError && filteredVaults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVaults.map((vault) => (
            <Card key={vault.vault_id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${vault.status === "active" ? "bg-primary/10" : "bg-orange-100"}`}>
                      <Lock className={`h-5 w-5 ${vault.status === "active" ? "text-primary" : "text-orange-600"}`} />
                    </div>
                    <CardTitle className="text-lg truncate" title={vault.vault_name}>
                      {vault.vault_name || "Unnamed Vault"}
                    </CardTitle>
                  </div>
                  <Badge variant={vault.status === "active" ? "default" : "secondary"}>
                    {vault.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Vault ID</span>
                    <span className="font-medium text-foreground font-mono text-xs truncate max-w-[150px]" title={vault.vault_id}>
                      {vault.vault_id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Merchant ID</span>
                    <span className="font-medium text-foreground font-mono text-xs truncate max-w-[150px]" title={vault.merchant_id || "—"}>
                      {vault.merchant_id || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Records</span>
                    <span className="font-medium text-foreground">{vault.total_records.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Accessed</span>
                    <span className="font-medium text-foreground">{formatLastAccessed(vault.last_accessed)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Created At</span>
                    <span className="font-medium text-foreground text-xs">{formatDate(vault.created_at)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Total Count */}
      {!isLoadingVaults && !vaultError && totalVaults > 0 && (
        <div className="text-sm text-muted-foreground text-center">
          Showing {filteredVaults.length} of {totalVaults} vaults
        </div>
      )}
    </div>
  )
}
