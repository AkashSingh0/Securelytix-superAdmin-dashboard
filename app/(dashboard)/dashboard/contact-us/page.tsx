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
import { SearchFilter } from "@/components/search-filter"
import { TablePagination } from "@/components/table-pagination"

const mockContacts = [
  { 
    id: 1, 
    name: "Sarah Connor", 
    email: "sarah@example.com", 
    company: "Tech Solutions", 
    status: "Active",
    phone: "+1 (555) 111-2222",
    subject: "Product Inquiry",
    createdAt: "2024-01-15",
  },
  { 
    id: 2, 
    name: "Mike Johnson", 
    email: "mike@example.com", 
    company: "Digital Agency", 
    status: "Pending",
    phone: "+1 (555) 333-4444",
    subject: "Support Request",
    createdAt: "2024-01-14",
  },
  { 
    id: 3, 
    name: "Emily Davis", 
    email: "emily@example.com", 
    company: "Creative Studio", 
    status: "Resolved",
    phone: "+1 (555) 555-6666",
    subject: "Billing Question",
    createdAt: "2024-01-13",
  },
  { 
    id: 4, 
    name: "David Wilson", 
    email: "david@example.com", 
    company: "Marketing Pro", 
    status: "Active",
    phone: "+1 (555) 777-8888",
    subject: "Feature Request",
    createdAt: "2024-01-12",
  },
  { 
    id: 5, 
    name: "Lisa Anderson", 
    email: "lisa@example.com", 
    company: "Consulting Group", 
    status: "Pending",
    phone: "+1 (555) 999-0000",
    subject: "General Inquiry",
    createdAt: "2024-01-11",
  },
]

export default function ContactUsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const filteredContacts = mockContacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.status.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(filteredContacts.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const paginatedContacts = filteredContacts.slice(startIndex, endIndex)

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  return (
    <div className="space-y-6">
      {/* Search and Filter - Above Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Contact Us Lead</h1>
        <SearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Search contacts..."
          showFilter={true}
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
            {paginatedContacts.length > 0 ? (
              paginatedContacts.map((contact) => (
              <TableRow
                key={contact.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => router.push(`/dashboard/contact-us/${contact.id}`)}
              >
                <TableCell className="font-medium">{contact.name}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.company}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {contact.status}
                  </span>
                </TableCell>
                <TableCell>{contact.phone}</TableCell>
                <TableCell>{contact.createdAt}</TableCell>
              </TableRow>
            ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No contacts found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          totalItems={filteredContacts.length}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={setRowsPerPage}
        />
      </Card>
    </div>
  )
}
