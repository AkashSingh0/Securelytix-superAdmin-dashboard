"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, Filter, X, ArrowUp, ArrowDown } from "lucide-react"
import { useSearchFilter } from "@/contexts/search-filter-context"
import { getFilterConfigForPath, FilterConfig } from "@/config/page-filter-configs"

interface UnifiedSearchFilterProps {
  placeholder?: string
  searchWidth?: string
  alignRight?: boolean
  showFilterButton?: boolean
}

export function UnifiedSearchFilter({
  placeholder = "Search...",
  searchWidth = "w-64",
  alignRight = true,
  showFilterButton = true,
}: UnifiedSearchFilterProps) {
  const pathname = usePathname()
  const { state, setSearchQuery, setFilters, setSortBy, setSortOrder, setConfig } = useSearchFilter()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [tempFilters, setTempFilters] = useState(state.filters)
  const [tempSortBy, setTempSortBy] = useState(state.sortBy)
  const [tempSortOrder, setTempSortOrder] = useState<"asc" | "desc">(state.sortOrder)
  const [config, setLocalConfig] = useState<FilterConfig | null>(null)

  // Auto-detect page and set config
  useEffect(() => {
    const pageConfig = getFilterConfigForPath(pathname || "")
    setLocalConfig(pageConfig)
    setConfig(pageConfig)
    return () => setConfig(null)
  }, [pathname, setConfig])

  // Initialize temp values when dialog opens
  useEffect(() => {
    if (isFilterOpen) {
      setTempFilters(state.filters)
      setTempSortBy(state.sortBy)
      setTempSortOrder(state.sortOrder)
    }
  }, [isFilterOpen, state.filters, state.sortBy, state.sortOrder])

  const applyFilters = () => {
    setFilters(tempFilters)
    setSortBy(tempSortBy)
    setSortOrder(tempSortOrder)
    setIsFilterOpen(false)
  }

  const clearTempFilters = () => {
    setTempFilters({
      country_code: "",
      date_from: "",
      date_to: "",
      email: "",
      company_name: "",
      status: "",
      organization_type: "",
      account_type: "",
      billing_type: "",
    })
    setTempSortBy("created_at")
    setTempSortOrder("desc")
  }

  const hasActiveFilters =
    state.searchQuery !== "" ||
    Object.values(state.filters).some((v) => v !== "")

  const activeFilterCount = [
    state.searchQuery,
    ...Object.values(state.filters),
  ].filter(Boolean).length

  if (!config) {
    // If no config, show only search (no filter button)
    return (
      <div
        className={`flex items-center gap-4 ${
          alignRight ? "justify-end" : "justify-between"
        }`}
      >
        <div className={`relative ${searchWidth}`}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={placeholder}
            value={state.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
    )
  }

  const defaultSortFields = [
    { value: "created_at", label: "Created At" },
    { value: "updated_at", label: "Updated At" },
    { value: "email", label: "Email" },
    { value: "company_name", label: "Company Name" },
    { value: "first_name", label: "First Name" },
  ]

  const sortFields = config.sortFields || defaultSortFields

  return (
    <>
      <div
        className={`flex items-center gap-4 ${
          alignRight ? "justify-end" : "justify-between"
        }`}
      >
        <div className={`relative ${searchWidth}`}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={placeholder}
            value={state.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        {showFilterButton && (
          <Button
            variant="outline"
            size="icon"
            className="relative"
            onClick={() => setIsFilterOpen(true)}
          >
            <Filter className="h-4 w-4" />
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
        )}
      </div>

      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Filters & Sorting</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Sort By */}
            {sortFields.length > 0 && (
              <div className="space-y-2">
                <Label>Sort By</Label>
                <Select value={tempSortBy} onValueChange={setTempSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select field to sort" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortFields.map((field) => (
                      <SelectItem key={field.value} value={field.value}>
                        {field.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Sort Order */}
            <div className="space-y-2">
              <Label>Sort Order</Label>
              <Select
                value={tempSortOrder}
                onValueChange={(value: "asc" | "desc") => setTempSortOrder(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Descending (Newest First)</SelectItem>
                  <SelectItem value="asc">Ascending (Oldest First)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Country Code Filter */}
            {config.country_code && (
              <div className="space-y-2">
                <Label>Country Code</Label>
                <Select
                  value={tempFilters.country_code || "all"}
                  onValueChange={(value) =>
                    setTempFilters({
                      ...tempFilters,
                      country_code: value === "all" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country code" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    <SelectItem value="+1">USA (+1)</SelectItem>
                    <SelectItem value="+91">India (+91)</SelectItem>
                    <SelectItem value="+44">UK (+44)</SelectItem>
                    <SelectItem value="+86">China (+86)</SelectItem>
                    <SelectItem value="+81">Japan (+81)</SelectItem>
                    <SelectItem value="+49">Germany (+49)</SelectItem>
                    <SelectItem value="+33">France (+33)</SelectItem>
                    <SelectItem value="+61">Australia (+61)</SelectItem>
                    <SelectItem value="+55">Brazil (+55)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Date Range Filters */}
            {(config.date_from || config.date_to) && (
              <div className="grid grid-cols-2 gap-4">
                {config.date_from && (
                  <div className="space-y-2">
                    <Label>Date From</Label>
                    <Input
                      type="date"
                      value={tempFilters.date_from}
                      onChange={(e) =>
                        setTempFilters({ ...tempFilters, date_from: e.target.value })
                      }
                    />
                  </div>
                )}
                {config.date_to && (
                  <div className="space-y-2">
                    <Label>Date To</Label>
                    <Input
                      type="date"
                      value={tempFilters.date_to}
                      onChange={(e) =>
                        setTempFilters({ ...tempFilters, date_to: e.target.value })
                      }
                    />
                  </div>
                )}
              </div>
            )}

            {/* Email Filter */}
            {config.email && (
              <div className="space-y-2">
                <Label>Email Filter</Label>
                <Input
                  type="text"
                  placeholder="Filter by email..."
                  value={tempFilters.email}
                  onChange={(e) =>
                    setTempFilters({ ...tempFilters, email: e.target.value })
                  }
                />
                {state.searchQuery && (
                  <p className="text-xs text-muted-foreground">
                    Only works when search is not used
                  </p>
                )}
              </div>
            )}

            {/* Company Name Filter */}
            {config.company_name && (
              <div className="space-y-2">
                <Label>Company Name Filter</Label>
                <Input
                  type="text"
                  placeholder="Filter by company name..."
                  value={tempFilters.company_name}
                  onChange={(e) =>
                    setTempFilters({ ...tempFilters, company_name: e.target.value })
                  }
                />
                {state.searchQuery && (
                  <p className="text-xs text-muted-foreground">
                    Only works when search is not used
                  </p>
                )}
              </div>
            )}

            {/* Status Filter */}
            {config.status && (
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={tempFilters.status || "all"}
                  onValueChange={(value) =>
                    setTempFilters({
                      ...tempFilters,
                      status: value === "all" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Registered">Registered</SelectItem>
                    <SelectItem value="Verified">Verified</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Organization Type Filter */}
            {config.organization_type && (
              <div className="space-y-2">
                <Label>Organization Type</Label>
                <Select
                  value={tempFilters.organization_type || "all"}
                  onValueChange={(value) =>
                    setTempFilters({
                      ...tempFilters,
                      organization_type: value === "all" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select organization type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Startup">Startup</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                    <SelectItem value="SMB">SMB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Account Type Filter */}
            {config.account_type && (
              <div className="space-y-2">
                <Label>Account Type</Label>
                <Select
                  value={tempFilters.account_type || "all"}
                  onValueChange={(value) =>
                    setTempFilters({
                      ...tempFilters,
                      account_type: value === "all" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Free">Free</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Billing Type Filter */}
            {config.billing_type && (
              <div className="space-y-2">
                <Label>Billing Type</Label>
                <Select
                  value={tempFilters.billing_type || "all"}
                  onValueChange={(value) =>
                    setTempFilters({
                      ...tempFilters,
                      billing_type: value === "all" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select billing type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="License">License</SelectItem>
                    <SelectItem value="Use Basis">Use Basis</SelectItem>
                    <SelectItem value="Freemium">Freemium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={clearTempFilters}
                className="flex-1"
              >
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
              <Button onClick={applyFilters} className="flex-1">
                Apply Filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

