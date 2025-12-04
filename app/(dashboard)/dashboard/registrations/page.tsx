"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { UnifiedSearchFilter } from "@/components/unified-search-filter"
import { useSearchFilter } from "@/contexts/search-filter-context"
import { TablePagination } from "@/components/table-pagination"

const mockRegistrations = [
  { 
    id: 1, 
    name: "John Doe", 
    email: "john@example.com", 
    company: "Acme Corp", 
    status: "New",
    phone: "+1 (555) 123-4567",
    createdAt: "2024-01-15",
  },
  { 
    id: 2, 
    name: "Jane Smith", 
    email: "jane@example.com", 
    company: "Tech Inc", 
    status: "Registered",
    phone: "+1 (555) 234-5678",
    createdAt: "2024-01-14",
  },
  { 
    id: 3, 
    name: "Bob Johnson", 
    email: "bob@example.com", 
    company: "StartupXYZ", 
    status: "Verified",
    phone: "+1 (555) 345-6789",
    createdAt: "2024-01-13",
  },
  { 
    id: 4, 
    name: "Alice Williams", 
    email: "alice@example.com", 
    company: "BigCo", 
    status: "New",
    phone: "+1 (555) 456-7890",
    createdAt: "2024-01-12",
  },
  { 
    id: 5, 
    name: "Charlie Brown", 
    email: "charlie@example.com", 
    company: "SmallBiz", 
    status: "Registered",
    phone: "+1 (555) 567-8901",
    createdAt: "2024-01-11",
  },
  { 
    id: 6, 
    name: "John Doe", 
    email: "john@example.com", 
    company: "Acme Corp", 
    status: "New",
    phone: "+1 (555) 123-4567",
    createdAt: "2024-01-15",
  },
  { 
    id: 7, 
    name: "Jane Smith", 
    email: "jane@example.com", 
    company: "Tech Inc", 
    status: "Registered",
    phone: "+1 (555) 234-5678",
    createdAt: "2024-01-14",
  },
  { 
    id: 8, 
    name: "Bob Johnson", 
    email: "bob@example.com", 
    company: "StartupXYZ", 
    status: "Verified",
    phone: "+1 (555) 345-6789",
    createdAt: "2024-01-13",
  },
  { 
    id: 9, 
    name: "Alice Williams", 
    email: "alice@example.com", 
    company: "BigCo", 
    status: "New",
    phone: "+1 (555) 456-7890",
    createdAt: "2024-01-12",
  },
  { 
    id: 10, 
    name: "Charlie Brown", 
    email: "charlie@example.com", 
    company: "SmallBiz", 
    status: "Registered",
    phone: "+1 (555) 567-8901",
    createdAt: "2024-01-11",
  },
  { 
    id: 11, 
    name: "Akash Singh", 
    email: "john@example.com", 
    company: "Acme Corp", 
    status: "New",
    phone: "+1 (555) 123-4567",
    createdAt: "2024-01-15",
  },
  { 
    id: 12, 
    name: "Jane Smith", 
    email: "jane@example.com", 
    company: "Tech Inc", 
    status: "Registered",
    phone: "+1 (555) 234-5678",
    createdAt: "2024-01-14",
  },
  { 
    id: 13, 
    name: "Bob Johnson", 
    email: "bob@example.com", 
    company: "StartupXYZ", 
    status: "Verified",
    phone: "+1 (555) 345-6789",
    createdAt: "2024-01-13",
  },
  { 
    id: 14, 
    name: "Alice Williams", 
    email: "alice@example.com", 
    company: "BigCo", 
    status: "New",
    phone: "+1 (555) 456-7890",
    createdAt: "2024-01-12",
  },
  { 
    id: 15, 
    name: "Charlie Brown", 
    email: "charlie@example.com", 
    company: "SmallBiz", 
    status: "Registered",
    phone: "+1 (555) 567-8901",
    createdAt: "2024-01-11",
  },
  { 
    id: 16, 
    name: "John Doe", 
    email: "john@example.com", 
    company: "Acme Corp", 
    status: "New",
    phone: "+1 (555) 123-4567",
    createdAt: "2024-01-15",
  },
  { 
    id: 17, 
    name: "Jane Smith", 
    email: "jane@example.com", 
    company: "Tech Inc", 
    status: "Registered",
    phone: "+1 (555) 234-5678",
    createdAt: "2024-01-14",
  },
  { 
    id: 18, 
    name: "Bob Johnson", 
    email: "bob@example.com", 
    company: "StartupXYZ", 
    status: "Verified",
    phone: "+1 (555) 345-6789",
    createdAt: "2024-01-13",
  },
  { 
    id: 19, 
    name: "Alice Williams", 
    email: "alice@example.com", 
    company: "BigCo", 
    status: "New",
    phone: "+1 (555) 456-7890",
    createdAt: "2024-01-12",
  },
  { 
    id: 20, 
    name: "Charlie Brown", 
    email: "charlie@example.com", 
    company: "SmallBiz", 
    status: "Registered",
    phone: "+1 (555) 567-8901",
    createdAt: "2024-01-11",
  }
]

export default function RegistrationsPage() {
  const router = useRouter()
  const { state } = useSearchFilter()
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const filteredRegistrations = mockRegistrations.filter((registration) => {
    const searchLower = state.searchQuery.toLowerCase()
    const statusFilter = state.filters.status ? state.filters.status.toLowerCase() : ""
    
    const matchesSearch = 
      registration.name.toLowerCase().includes(searchLower) ||
      registration.email.toLowerCase().includes(searchLower) ||
      registration.company.toLowerCase().includes(searchLower) ||
      registration.status.toLowerCase().includes(searchLower)
    
    const matchesStatus = !statusFilter || registration.status.toLowerCase() === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredRegistrations.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const paginatedRegistrations = filteredRegistrations.slice(startIndex, endIndex)

  // Reset to page 1 when search query or filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [state.searchQuery, state.filters])

  return (
    <div className="space-y-6">
      {/* Search and Filter - Above Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Register Lead</h1>
        <UnifiedSearchFilter
          placeholder="Search registrations..."
          alignRight={false}
        />
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRegistrations.length > 0 ? (
              paginatedRegistrations.map((registration) => (
              <TableRow
                key={registration.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => router.push(`/dashboard/registrations/${registration.id}`)}
              >
                <TableCell className="font-medium">{registration.name}</TableCell>
                <TableCell>{registration.email}</TableCell>
                <TableCell>{registration.company}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {registration.status}
                  </span>
                </TableCell>
                <TableCell>{registration.phone}</TableCell>
                <TableCell>{registration.createdAt}</TableCell>
              </TableRow>
            ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No registrations found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          totalItems={filteredRegistrations.length}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={setRowsPerPage}
        />
      </Card>
    </div>
  )
}

