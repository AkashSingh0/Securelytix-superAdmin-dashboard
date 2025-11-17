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
import { LeadsSummary } from "@/components/leads-summary"
import { SearchFilter } from "@/components/search-filter"
import { TablePagination } from "@/components/table-pagination"

// API base URLs - try the one from documentation first
const API_BASE_URL = "https://website-backend.securelytix.tech/api/v1"
// Alternative: "https://securelytix-website-backend.onrender.com/api/v1"

interface Lead {
  id: string
  first_name: string
  last_name: string | null
  email: string
  company_name: string
  country_code: string
  contact_number: string
  description: string
  terms_accepted: boolean
  created_at: string
  updated_at: string
}

interface LeadsResponse {
  message: string
  data: Lead[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
    has_next: boolean
    has_prev: boolean
  }
}

export default function LeadsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    total: 0,
    total_pages: 1,
    has_next: false,
    has_prev: false,
  })
  const [useMockData, setUseMockData] = useState(false)

  // Fetch leads from API
  const fetchLeads = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      params.append("page", currentPage.toString())
      params.append("limit", rowsPerPage.toString())
      params.append("sort_by", "created_at")
      params.append("sort_order", "desc")
      
      // Add search filters
      if (searchQuery.trim()) {
        // If search contains @, filter by email, otherwise filter by company_name
        if (searchQuery.includes("@")) {
          params.append("email", searchQuery.trim())
        } else {
          params.append("company_name", searchQuery.trim())
        }
      }

      const url = `${API_BASE_URL}/leads?${params.toString()}`
      console.log("Fetching leads from:", url)
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API Error Response:", errorText)
        throw new Error(`HTTP error! status: ${response.status} - ${errorText || response.statusText}`)
      }

      const data: LeadsResponse = await response.json()
      setLeads(data.data)
      setPagination({
        total: data.pagination.total,
        total_pages: data.pagination.total_pages,
        has_next: data.pagination.has_next,
        has_prev: data.pagination.has_prev,
      })
      setUseMockData(false)
    } catch (err) {
      console.error("Error fetching leads:", err)
      // If API fails, use mock data as fallback
      if (!useMockData) {
        console.warn("API unavailable, using mock data")
        setUseMockData(true)
        // Use mock data with pagination
        const mockLeadsData: Lead[] = [
          {
            id: "1",
            first_name: "John",
            last_name: "Doe",
            email: "john@example.com",
            company_name: "Acme Corp",
            country_code: "+1",
            contact_number: "5551234567",
            description: "Interested in enterprise plan.",
            terms_accepted: true,
            created_at: "2024-01-15T10:30:00Z",
            updated_at: "2024-01-15T10:30:00Z",
          },
          {
            id: "2",
            first_name: "Jane",
            last_name: "Smith",
            email: "jane@example.com",
            company_name: "Tech Inc",
            country_code: "+1",
            contact_number: "5552345678",
            description: "Very responsive. Scheduled demo.",
            terms_accepted: true,
            created_at: "2024-01-14T10:30:00Z",
            updated_at: "2024-01-14T10:30:00Z",
          },
          {
            id: "3",
            first_name: "Bob",
            last_name: "Johnson",
            email: "bob@example.com",
            company_name: "StartupXYZ",
            country_code: "+1",
            contact_number: "5553456789",
            description: "Qualified lead. Ready for proposal.",
            terms_accepted: true,
            created_at: "2024-01-13T10:30:00Z",
            updated_at: "2024-01-13T10:30:00Z",
          },
          {
            id: "4",
            first_name: "Alice",
            last_name: "Williams",
            email: "alice@example.com",
            company_name: "BigCo",
            country_code: "+1",
            contact_number: "5554567890",
            description: "Initial contact made.",
            terms_accepted: true,
            created_at: "2024-01-12T10:30:00Z",
            updated_at: "2024-01-12T10:30:00Z",
          },
          {
            id: "5",
            first_name: "Charlie",
            last_name: "Brown",
            email: "charlie@example.com",
            company_name: "SmallBiz",
            country_code: "+1",
            contact_number: "5555678901",
            description: "Follow up required.",
            terms_accepted: true,
            created_at: "2024-01-11T10:30:00Z",
            updated_at: "2024-01-11T10:30:00Z",
          },
        ]
        
        // Apply search filter to mock data
        let filteredMock = mockLeadsData
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase()
          filteredMock = mockLeadsData.filter(
            (lead) =>
              lead.email.toLowerCase().includes(query) ||
              lead.company_name.toLowerCase().includes(query) ||
              `${lead.first_name} ${lead.last_name}`.toLowerCase().includes(query)
          )
        }
        
        // Apply pagination to mock data
        const startIndex = (currentPage - 1) * rowsPerPage
        const endIndex = startIndex + rowsPerPage
        const paginatedMock = filteredMock.slice(startIndex, endIndex)
        
        setLeads(paginatedMock)
        setPagination({
          total: filteredMock.length,
          total_pages: Math.ceil(filteredMock.length / rowsPerPage),
          has_next: endIndex < filteredMock.length,
          has_prev: currentPage > 1,
        })
        setError("API unavailable - showing mock data")
      } else {
        setError(err instanceof Error ? err.message : "Failed to fetch leads")
      }
    } finally {
      setLoading(false)
    }
  }

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  // Fetch leads when page, rowsPerPage, or searchQuery changes
  useEffect(() => {
    fetchLeads()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, rowsPerPage, searchQuery])

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Get full name
  const getFullName = (lead: Lead) => {
    return lead.last_name 
      ? `${lead.first_name} ${lead.last_name}` 
      : lead.first_name
  }

  // Get full phone number
  const getFullPhone = (lead: Lead) => {
    return `${lead.country_code} ${lead.contact_number}`
  }

  return (
    <div className="space-y-6">
      <LeadsSummary />
      {/* Search and Filter - Above Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Leads</h1>
        <SearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Search by email or company..."
          showFilter={true}
          alignRight={false}
        />
      </div>
      {useMockData && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md">
          <p className="text-sm">
            ⚠️ API unavailable - displaying mock data. Please check the API endpoint configuration.
          </p>
        </div>
      )}
      <Card>
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">
            Loading leads...
          </div>
        ) : error && !useMockData ? (
          <div className="p-8 text-center text-destructive">
            Error: {error}
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.length > 0 ? (
                  leads.map((lead) => (
                    <TableRow
                      key={lead.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => router.push(`/dashboard/leads/${lead.id}`)}
                    >
                      <TableCell className="font-medium">
                        {getFullName(lead)}
                      </TableCell>
                      <TableCell>{lead.email}</TableCell>
                      <TableCell>{lead.company_name}</TableCell>
                      <TableCell>{getFullPhone(lead)}</TableCell>
                      <TableCell>{formatDate(lead.created_at)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No leads found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              currentPage={currentPage}
              totalPages={pagination.total_pages}
              rowsPerPage={rowsPerPage}
              totalItems={pagination.total}
              onPageChange={setCurrentPage}
              onRowsPerPageChange={setRowsPerPage}
            />
          </>
        )}
      </Card>
    </div>
  )
}
