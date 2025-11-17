"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SearchFilter } from "@/components/search-filter"
import { TablePagination } from "@/components/table-pagination"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const mockOrganizations = [
  { 
    id: 1, 
    name: "Acme Corporation", 
    email: "contact@acme.com", 
    industry: "Technology", 
    employees: "500-1000",
    status: "Active",
    location: "San Francisco, CA",
    createdAt: "2024-01-15",
  },
  { 
    id: 2, 
    name: "Tech Solutions Inc", 
    email: "info@techsolutions.com", 
    industry: "Software", 
    employees: "100-500",
    status: "Active",
    location: "New York, NY",
    createdAt: "2024-01-14",
  },
  { 
    id: 3, 
    name: "Digital Agency Pro", 
    email: "hello@digitalagency.com", 
    industry: "Marketing", 
    employees: "50-100",
    status: "Pending",
    location: "Los Angeles, CA",
    createdAt: "2024-01-13",
  },
  { 
    id: 4, 
    name: "StartupXYZ", 
    email: "contact@startupxyz.com", 
    industry: "Fintech", 
    employees: "10-50",
    status: "Active",
    location: "Austin, TX",
    createdAt: "2024-01-12",
  },
  { 
    id: 5, 
    name: "BigCo Industries", 
    email: "info@bigco.com", 
    industry: "Manufacturing", 
    employees: "1000+",
    status: "Active",
    location: "Chicago, IL",
    createdAt: "2024-01-11",
  },
]

export default function OrganizationPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const filteredOrganizations = mockOrganizations.filter((org) =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.industry.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(filteredOrganizations.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const paginatedOrganizations = filteredOrganizations.slice(startIndex, endIndex)

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const handleAddOrganization = () => {
    router.push("/dashboard/organization/add")
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter - Above Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Organization</h1>
        <div className="flex items-center gap-4">
          <SearchFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            placeholder="Search organizations..."
            showVoiceIcon={true}
            showFilter={true}
            alignRight={false}
          />
          <Button onClick={handleAddOrganization}>
            <Plus className="h-4 w-4 mr-2" />
            Add Organization
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Employees</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrganizations.length > 0 ? (
              paginatedOrganizations.map((org) => (
                <TableRow
                  key={org.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/dashboard/organization/${org.id}`)}
                >
                  <TableCell className="font-medium">{org.name}</TableCell>
                  <TableCell>{org.email}</TableCell>
                  <TableCell>{org.industry}</TableCell>
                  <TableCell>{org.employees}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      {org.status}
                    </span>
                  </TableCell>
                  <TableCell>{org.location}</TableCell>
                  <TableCell>{org.createdAt}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No organizations found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          totalItems={filteredOrganizations.length}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={setRowsPerPage}
        />
      </Card>
    </div>
  )
}
