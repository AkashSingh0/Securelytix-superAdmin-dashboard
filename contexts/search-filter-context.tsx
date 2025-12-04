"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export interface FilterConfig {
  country_code?: boolean
  date_from?: boolean
  date_to?: boolean
  email?: boolean
  company_name?: boolean
  status?: boolean
  organization_type?: boolean
  account_type?: boolean
  billing_type?: boolean
  sortFields?: Array<{ value: string; label: string }>
}

export interface SearchFilterState {
  searchQuery: string
  filters: {
    country_code: string
    date_from: string
    date_to: string
    email: string
    company_name: string
    status: string
    organization_type: string
    account_type: string
    billing_type: string
  }
  sortBy: string
  sortOrder: "asc" | "desc"
}

interface SearchFilterContextType {
  state: SearchFilterState
  setSearchQuery: (query: string) => void
  setFilters: (filters: Partial<SearchFilterState["filters"]>) => void
  setSortBy: (sortBy: string) => void
  setSortOrder: (sortOrder: "asc" | "desc") => void
  clearAll: () => void
  config: FilterConfig | null
  setConfig: (config: FilterConfig | null) => void
}

const initialState: SearchFilterState = {
  searchQuery: "",
  filters: {
    country_code: "",
    date_from: "",
    date_to: "",
    email: "",
    company_name: "",
    status: "",
    organization_type: "",
    account_type: "",
    billing_type: "",
  },
  sortBy: "created_at",
  sortOrder: "desc",
}

const SearchFilterContext = createContext<SearchFilterContextType | undefined>(undefined)

export function SearchFilterProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SearchFilterState>(initialState)
  const [config, setConfig] = useState<FilterConfig | null>(null)

  const setSearchQuery = (query: string) => {
    setState((prev) => ({ ...prev, searchQuery: query }))
  }

  const setFilters = (newFilters: Partial<SearchFilterState["filters"]>) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters },
    }))
  }

  const setSortBy = (sortBy: string) => {
    setState((prev) => ({ ...prev, sortBy }))
  }

  const setSortOrder = (sortOrder: "asc" | "desc") => {
    setState((prev) => ({ ...prev, sortOrder }))
  }

  const clearAll = () => {
    setState(initialState)
  }

  return (
    <SearchFilterContext.Provider
      value={{
        state,
        setSearchQuery,
        setFilters,
        setSortBy,
        setSortOrder,
        clearAll,
        config,
        setConfig,
      }}
    >
      {children}
    </SearchFilterContext.Provider>
  )
}

export function useSearchFilter() {
  const context = useContext(SearchFilterContext)
  if (context === undefined) {
    throw new Error("useSearchFilter must be used within a SearchFilterProvider")
  }
  return context
}

