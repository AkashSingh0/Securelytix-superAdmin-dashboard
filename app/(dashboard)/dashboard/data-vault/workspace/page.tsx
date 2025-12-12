"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutGrid, Loader2, AlertCircle } from "lucide-react"
import { UnifiedSearchFilter } from "@/components/unified-search-filter"
import { useSearchFilter } from "@/contexts/search-filter-context"
import { fetchWorkspaces, fetchWorkspaceDetail, type WorkspaceListItem } from "@/lib/api/workspace"

export default function WorkspacePage() {
  const router = useRouter()
  const { state } = useSearchFilter()
  const [workspaces, setWorkspaces] = useState<WorkspaceListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  // Fetch workspaces from API and then fetch details for workspace names
  useEffect(() => {
    const loadWorkspaces = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // First, fetch the list of workspaces
        const response = await fetchWorkspaces(0, 100)

        if (response.success && response.data) {
          const workspaceList = response.data
          setTotal(response.total || 0)

          // Fetch workspace details for each workspace to get the name
          const workspacesWithNames = await Promise.all(
            workspaceList.map(async (workspace) => {
              try {
                const detailResponse = await fetchWorkspaceDetail(workspace.workspaceId)
                if (detailResponse.success && detailResponse.data) {
                  return {
                    ...workspace,
                    workspaceName: detailResponse.data.workspaceName,
                  }
                }
                return workspace
              } catch {
                // If detail fetch fails, return workspace without name
                return workspace
              }
            })
          )

          setWorkspaces(workspacesWithNames)
        } else {
          setError(response.error || "Failed to load workspaces")
          setWorkspaces([])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred")
        setWorkspaces([])
      } finally {
        setIsLoading(false)
      }
    }

    loadWorkspaces()
  }, [])

  // Filter workspaces based on search query (Workspace ID, Merchant ID, Merchant Email)
  const filteredWorkspaces = workspaces.filter((workspace) => {
    const query = state.searchQuery.toLowerCase()
    if (!query) return true

    const workspaceId = (workspace.workspaceId || "").toLowerCase()
    const merchantId = (workspace.merchantId || "").toLowerCase()
    const merchantEmail = (workspace.merchantEmail || "").toLowerCase()

    return (
      workspaceId.includes(query) ||
      merchantId.includes(query) ||
      merchantEmail.includes(query)
    )
  })

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Title and Search */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Workspace</h1>
        <div className="flex items-center gap-4">
          <UnifiedSearchFilter
            placeholder="Search by name, email, compa..."
            alignRight={false}
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading workspaces...</span>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredWorkspaces.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center text-muted-foreground">
            <LayoutGrid className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No workspaces found</p>
            {state.searchQuery && (
              <p className="text-sm mt-1">Try adjusting your search query</p>
            )}
          </div>
        </div>
      )}

      {/* Workspace Cards */}
      {!isLoading && !error && filteredWorkspaces.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkspaces.map((workspace) => (
            <Card 
              key={workspace.workspaceId} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/dashboard/data-vault/workspace/${workspace.workspaceId}`)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <LayoutGrid className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg truncate" title={workspace.workspaceName || workspace.workspaceId}>
                    {workspace.workspaceName || "Unnamed Workspace"}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Workspace ID</span>
                    <span className="font-medium text-foreground font-mono text-xs truncate max-w-[180px]" title={workspace.workspaceId}>
                      {workspace.workspaceId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Merchant ID</span>
                    <span className="font-medium text-foreground font-mono text-xs truncate max-w-[180px]" title={workspace.merchantId}>
                      {workspace.merchantId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Merchant Email</span>
                    <span className="font-medium text-foreground text-xs truncate max-w-[180px]" title={workspace.merchantEmail || "—"}>
                      {workspace.merchantEmail || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vaults</span>
                    <span className="font-medium text-foreground">{workspace.vaults}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Created At</span>
                    <span className="font-medium text-foreground">{formatDate(workspace.createdAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Total Count */}
      {!isLoading && !error && total > 0 && (
        <div className="text-sm text-muted-foreground text-center">
          Showing {filteredWorkspaces.length} of {total} workspaces
        </div>
      )}
    </div>
  )
}
