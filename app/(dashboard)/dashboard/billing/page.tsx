"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowUpDown, ArrowUp } from "lucide-react"
import { SearchFilter } from "@/components/search-filter"
import { TablePagination } from "@/components/table-pagination"

interface SummaryCardProps {
  value: string | number
  label: string
}

function SummaryCard({ value, label }: SummaryCardProps) {
  return (
    <Card className="rounded-lg border">
      <CardContent className="p-6">
        <div className="text-xl font-bold mb-2">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  )
}

const billingData = [
  {
    id: 1,
    customerId: "CUST-1001",
    organizationName: "NovaTech Labs",
    organizationType: "Startup",
    accountType: "Premium",
    billingType: "License",
    billingDate: "2025-11-01",
    charges: "$249",
  },
  {
    id: 2,
    customerId: "CUST-1002",
    organizationName: "CloudMatrix Inc.",
    organizationType: "Enterprise",
    accountType: "Business",
    billingType: "Use Basis",
    billingDate: "2025-11-05",
    charges: "$1",
  },
  {
    id: 3,
    customerId: "CUST-1003",
    organizationName: "PixelForge Studio",
    organizationType: "Startup",
    accountType: "Free",
    billingType: "Freemium",
    billingDate: "2025-11-03",
    charges: "$0.00",
  },
  {
    id: 4,
    customerId: "CUST-1004",
    organizationName: "Datapulse Systems",
    organizationType: "Enterprise",
    accountType: "Enterprise",
    billingType: "License",
    billingDate: "2025-11-10",
    charges: "$3499",
  },
  {
    id: 5,
    customerId: "CUST-1005",
    organizationName: "Finverse Analytics",
    organizationType: "SMB",
    accountType: "Business",
    billingType: "Use Basis",
    billingDate: "2025-11-07",
    charges: "$780.20",
  },
  {
    id: 6,
    customerId: "CUST-1006",
    organizationName: "GreenOrbit Solutions",
    organizationType: "Startup",
    accountType: "Free",
    billingType: "Freemium",
    billingDate: "2025-11-02",
    charges: "$0.00",
  },
  {
    id: 7,
    customerId: "CUST-1007",
    organizationName: "Securelytix Pvt. Ltd.",
    organizationType: "Enterprise",
    accountType: "Premium",
    billingType: "License",
    billingDate: "2025-11-11",
    charges: "$2250",
  },
  {
    id: 8,
    customerId: "CUST-1008",
    organizationName: "CodeZen Labs",
    organizationType: "Startup",
    accountType: "Business",
    billingType: "Use Basis",
    billingDate: "2025-11-08",
    charges: "$525.40",
  },
  {
    id: 9,
    customerId: "CUST-1009",
    organizationName: "OmniEdge Networks",
    organizationType: "Enterprise",
    accountType: "Enterprise",
    billingType: "License",
    billingDate: "2025-11-04",
    charges: "$499",
  },
]

export default function BillingPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const filteredData = billingData.filter((item) =>
    item.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.customerId.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(filteredData.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const paginatedData = filteredData.slice(startIndex, endIndex)

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  return (
    <div className="space-y-6">
      {/* Search and Filter - Above Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Billing</h1>
        <SearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="search"
          showFilter={true}
          alignRight={false}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard value={60} label="Freemium Vault" />
        <SummaryCard value={20} label="Enterprise" />
        <SummaryCard value={32} label="Paid Vault" />
        <SummaryCard value={0} label="Others" />
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">
                <div className="flex items-center gap-2">
                  S. No. (Customer ID)
                  <ArrowUp className="h-4 w-4 text-muted-foreground" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  Organization Name
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                </div>
              </TableHead>
              <TableHead>Organization Type</TableHead>
              <TableHead>Account Type</TableHead>
              <TableHead>Billing Type</TableHead>
              <TableHead>Billing Date</TableHead>
              <TableHead className="text-right">Charges</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  {item.id} ({item.customerId})
                </TableCell>
                <TableCell>{item.organizationName}</TableCell>
                <TableCell>{item.organizationType}</TableCell>
                <TableCell>{item.accountType}</TableCell>
                <TableCell>{item.billingType}</TableCell>
                <TableCell>{item.billingDate}</TableCell>
                <TableCell className="text-right">{item.charges}</TableCell>
              </TableRow>
            ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No billing data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          totalItems={filteredData.length}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={setRowsPerPage}
        />
      </Card>
    </div>
  )
}
