"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Edit3, Info, Loader2 } from "lucide-react"
import { TablePagination } from "@/components/table-pagination"
import { UnifiedSearchFilter } from "@/components/unified-search-filter"
import { useSearchFilter } from "@/contexts/search-filter-context"
import { getFilterConfigForPath } from "@/config/page-filter-configs"
import { fetchOrganizations, type OrganizationListItem } from "@/lib/api/organization"

export default function AllMerchantsPage() {
  const router = useRouter()
  const pathname = usePathname()
  const { state, setConfig } = useSearchFilter()
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [organizations, setOrganizations] = useState<OrganizationListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Set filter config for this page
  useEffect(() => {
    const config = getFilterConfigForPath(pathname || "")
    setConfig(config)
    return () => setConfig(null) // Cleanup on unmount
  }, [pathname, setConfig])

  // Load organizations from API
  useEffect(() => {
    const loadOrganizations = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await fetchOrganizations()
        
        if (response.success && response.data) {
          setOrganizations(response.data)
        } else {
          setError(response.error || "Failed to load organizations")
          setOrganizations([])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred")
        setOrganizations([])
      } finally {
        setIsLoading(false)
      }
    }

    loadOrganizations()
  }, [])

  const filteredMerchants = organizations.filter((org) => {
    const name = (org.organization_name || "").toLowerCase()
    const email = (org.email || "").toLowerCase()
    const orgId = (org.id || "").toLowerCase()
    const query = state.searchQuery.toLowerCase()

    return name.includes(query) || email.includes(query) || orgId.includes(query)
  })

  const totalPages = Math.ceil(filteredMerchants.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const paginatedMerchants = filteredMerchants.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [state.searchQuery])

  const handleExportToCSV = () => {
    // Prepare CSV headers
    const headers = ["Organization Name", "Email", "Organization ID", "Status"]
    
    // Convert filtered organizations data to CSV rows
    const csvRows = [
      headers.join(","), // Header row
      ...filteredMerchants.map((org) => {
        const displayName = org.organization_name || ""
        const displayEmail = org.email || ""
        const displayOrgId = org.id

        return [`"${displayName}"`, `"${displayEmail}"`, `"${displayOrgId}"`, `"${org.status}"`].join(",")
      }),
    ]

    // Create CSV content
    const csvContent = csvRows.join("\n")

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    
    link.setAttribute("href", url)
    link.setAttribute("download", `organizations_export_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleEditOrganization = (org: OrganizationListItem) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "selectedOrganization",
        JSON.stringify({
          id: org.id,
          name: org.organization_name || "",
          email: org.email || "",
          merchantId: org.id,
          productStatus: org.status,
        }),
      )
    }
    router.push("/dashboard/organization/add?mode=edit")
  }

  return (
    <div className="space-y-6">
      {/* Title, Search, Filter, and Add Organization Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">All Organizations</h1>
        <div className="flex items-center gap-4">
          <UnifiedSearchFilter
            placeholder="Search by name, email, company..."
            alignRight={false}
          />
          <Button onClick={() => router.push("/dashboard/organization/add")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Organization
          </Button>
        </div>
      </div>

      {/* Table (scrollable rows inside card) */}
      <Card>
        <div className="max-h-[580px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow className="h-14">
                <TableHead>Organization Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                   Organization ID
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Edit Account</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-muted-foreground">Loading organizations...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-destructive">
                    {error}
                  </TableCell>
                </TableRow>
              ) : paginatedMerchants.length > 0 ? (
                paginatedMerchants.map((org) => {
                  const displayName = org.organization_name || "—"
                  const displayEmail = org.email || "—"
                  const displayOrgId = org.id

                  return (
                    <TableRow key={org.id} className="h-16">
                      <TableCell className="font-medium">{displayName}</TableCell>
                      <TableCell>{displayEmail}</TableCell>
                      <TableCell className="font-mono text-xs">{displayOrgId}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-orange-600 border-orange-600">
                        {org.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-xs"
                        onClick={() => handleEditOrganization(org)}
                      >
                        <Edit3 className="h-3 w-3" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No organizations found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          totalItems={filteredMerchants.length}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={setRowsPerPage}
          rowsPerPageOptions={[10, 20, 30, 50, 100]}
        />
      </Card>
    </div>
  )
}

