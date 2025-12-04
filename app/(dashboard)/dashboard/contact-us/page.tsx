"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
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
import { TablePagination } from "@/components/table-pagination"
import { ArrowUp, ArrowDown, Loader2 } from "lucide-react"
import { useSearchFilter } from "@/contexts/search-filter-context"
import { getFilterConfigForPath } from "@/config/page-filter-configs"

// API base URL
const API_BASE_URL = "https://website-backend.securelytix.tech/api/v1"

interface Contact {
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

interface ContactsResponse {
  message: string
  data: Contact[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
    has_next: boolean
    has_prev: boolean
  }
}

export default function ContactUsPage() {
  const router = useRouter()
  const pathname = usePathname()
  const { state, setConfig } = useSearchFilter()
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    total: 0,
    total_pages: 1,
    has_next: false,
    has_prev: false,
  })

  // Set filter config for this page
  useEffect(() => {
    const config = getFilterConfigForPath(pathname || "")
    setConfig(config)
    return () => setConfig(null) // Cleanup on unmount
  }, [pathname, setConfig])

  // Fetch contacts from API
  const fetchContacts = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      params.append("page", currentPage.toString())
      params.append("limit", rowsPerPage.toString())
      params.append("sort_by", state.sortBy)
      params.append("sort_order", state.sortOrder)
      
      // Add search parameter (when search is provided, email and company_name filters are ignored)
      if (state.searchQuery.trim()) {
        params.append("search", state.searchQuery.trim())
      } else {
        // Only add email and company_name filters when search is NOT provided
        if (state.filters.email.trim()) {
          params.append("email", state.filters.email.trim())
        }
        if (state.filters.company_name.trim()) {
          params.append("company_name", state.filters.company_name.trim())
        }
      }
      
      // Add other filters (always work, can be combined)
      if (state.filters.country_code) {
        params.append("country_code", state.filters.country_code)
      }
      if (state.filters.date_from) {
        params.append("date_from", state.filters.date_from)
      }
      if (state.filters.date_to) {
        params.append("date_to", state.filters.date_to)
      }

      const url = `${API_BASE_URL}/leads?${params.toString()}`
      console.log("Fetching contacts from:", url)
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        mode: "cors",
      })
      
      console.log("Response status:", response.status)
      console.log("Response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API Error Response:", errorText)
        throw new Error(`HTTP error! status: ${response.status} - ${errorText || response.statusText}`)
      }

      const responseText = await response.text()
      console.log("API Response Text:", responseText)
      
      // Check for webpack HMR response (indicates request was intercepted)
      if (responseText.includes('"c":["webpack"]') || responseText.includes('webpack')) {
        console.error("Received webpack response - request may have been intercepted")
        throw new Error("API request was intercepted. Please check your network configuration or CORS settings.")
      }
      
      // Check if response is valid JSON
      let data: ContactsResponse
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError)
        console.error("Response text:", responseText)
        throw new Error(`Invalid JSON response from API: ${responseText.substring(0, 100)}`)
      }

      // Validate response structure
      if (!data || typeof data !== 'object') {
        throw new Error("Invalid response format from API")
      }

      // Check if it's an error response from the API
      if ('detail' in data && !('data' in data)) {
        throw new Error(`API Error: ${(data as any).detail || 'Unknown error'}`)
      }

      if (!Array.isArray(data.data)) {
        console.error("Invalid data format:", data)
        throw new Error("API response does not contain valid contacts data")
      }

      setContacts(data.data)
      setPagination({
        total: data.pagination?.total || 0,
        total_pages: data.pagination?.total_pages || 1,
        has_next: data.pagination?.has_next || false,
        has_prev: data.pagination?.has_prev || false,
      })
    } catch (err) {
      console.error("Error fetching contacts:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch contacts")
      setContacts([])
      setPagination({
        total: 0,
        total_pages: 1,
        has_next: false,
        has_prev: false,
      })
    } finally {
      setLoading(false)
    }
  }

  // Reset to page 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1)
  }, [state.searchQuery, state.filters, state.sortBy, state.sortOrder])

  // Fetch contacts when any parameter changes
  useEffect(() => {
    fetchContacts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, rowsPerPage, state.searchQuery, state.filters, state.sortBy, state.sortOrder])

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
  const getFullName = (contact: Contact) => {
    return contact.last_name 
      ? `${contact.first_name} ${contact.last_name}` 
      : contact.first_name
  }

  // Get full phone number
  const getFullPhone = (contact: Contact) => {
    return `${contact.country_code} ${contact.contact_number}`
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter - Above Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Contact Us Lead</h1>
        <UnifiedSearchFilter
          placeholder="Search by name, email, company..."
          alignRight={false}
        />
      </div>
      <Card>
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-4" />
            Loading contacts...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-destructive">
            Error: {error}
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      Name
                      {state.sortBy === "first_name" && (
                        state.sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      Email
                      {state.sortBy === "email" && (
                        state.sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      Company
                      {state.sortBy === "company_name" && (
                        state.sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      Created At
                      {state.sortBy === "created_at" && (
                        state.sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.length > 0 ? (
                  contacts.map((contact) => (
                    <TableRow
                      key={contact.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => router.push(`/dashboard/contact-us/${contact.id}`)}
                    >
                      <TableCell className="font-medium">
                        {getFullName(contact)}
                      </TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.company_name}</TableCell>
                      <TableCell>{getFullPhone(contact)}</TableCell>
                      <TableCell>{formatDate(contact.created_at)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No contacts found
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
