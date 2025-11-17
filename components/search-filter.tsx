"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, Mic } from "lucide-react"

interface SearchFilterProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  placeholder?: string
  showVoiceIcon?: boolean
  showFilter?: boolean
  onFilterClick?: () => void
  searchWidth?: string
  alignRight?: boolean
}

export function SearchFilter({
  searchQuery,
  onSearchChange,
  placeholder = "Search...",
  showVoiceIcon = false,
  showFilter = false,
  onFilterClick,
  searchWidth = "w-64",
  alignRight = true,
}: SearchFilterProps) {
  return (
    <div className={`flex items-center gap-4 ${alignRight ? "justify-end" : "justify-between"}`}>
      <div className={`relative ${searchWidth}`}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={showVoiceIcon ? "pl-10 pr-10" : "pl-10"}
        />
        {showVoiceIcon && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
            onClick={() => {
              // TODO: Implement voice search functionality
              console.log("Voice search clicked")
            }}
          >
            <Mic className="h-4 w-4 text-muted-foreground" />
          </Button>
        )}
      </div>
      {showFilter && (
        <Button variant="outline" size="icon" onClick={onFilterClick}>
          <Filter className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

