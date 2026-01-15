"use client"

import { Suspense } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, UserCog, ChevronDown, X, Database, TableIcon, Key, Shield, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface OrganizationData {
  id: string
  name: string
  email: string
  merchantId: string
  status: string
}

interface RoleData {
  id: string
  name: string
  permissions: string[]
  vaults?: string[]
  tables?: string[]
  fields?: string[]
  policies?: string[]
}

// Multi-select dropdown component
function MultiSelect({
  label,
  placeholder,
  options,
  selected,
  onSelect,
  onRemove,
  helperText,
  icon: Icon,
}: {
  label: string
  placeholder: string
  options: string[]
  selected: string[]
  onSelect: (value: string) => void
  onRemove: (value: string) => void
  helperText?: string
  icon?: React.ElementType
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        {label}
      </Label>
      <div className="relative">
        <div
          className="flex items-center justify-between w-full min-h-11 px-4 py-2 border border-input rounded-lg cursor-pointer bg-background hover:bg-muted/30 hover:border-blue-300 transition-all"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-sm text-muted-foreground">{placeholder}</span>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </div>
        {isOpen && (
          <div className="absolute z-10 w-full mt-2 bg-popover border rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {options.length > 0 ? (
              options
                .filter((opt) => !selected.includes(opt))
                .map((option) => (
                  <div
                    key={option}
                    className="px-4 py-2.5 text-sm cursor-pointer hover:bg-blue-50 transition-colors"
                    onClick={() => {
                      onSelect(option)
                      setIsOpen(false)
                    }}
                  >
                    {option}
                  </div>
                ))
            ) : (
              <div className="px-4 py-3 text-sm text-muted-foreground">No options available</div>
            )}
          </div>
        )}
      </div>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selected.map((item) => (
            <Badge key={item} className="bg-blue-100 text-blue-700 hover:bg-blue-100 px-3 py-1 flex items-center gap-1.5">
              {item}
              <button onClick={() => onRemove(item)} className="hover:text-blue-900 transition-colors">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      {helperText && <p className="text-xs text-muted-foreground mt-1">{helperText}</p>}
    </div>
  )
}

function AddRoleContent() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const orgId = params.id as string
  const isEditMode = searchParams.get("edit") === "true"

  const [organization, setOrganization] = useState<OrganizationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingRole, setEditingRole] = useState<RoleData | null>(null)

  // Form state
  const [roleName, setRoleName] = useState("")
  const [selectedVaults, setSelectedVaults] = useState<string[]>([])
  const [selectedTables, setSelectedTables] = useState<string[]>([])
  const [selectedFields, setSelectedFields] = useState<string[]>([])
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock options - in real app, these would come from API
  const vaultOptions = ["vault_001", "vault_002", "vault_003", "vault_004"]
  const tableOptions = ["customers", "transactions", "profiles", "orders"]
  const fieldOptions = ["email", "phone", "name", "address", "pan", "aadhaar"]
  const policyOptions = ["read_only", "read_write", "admin", "tokenize", "detokenize"]

  // Load organization data and edit data from sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("setupOrganization")
      if (stored) {
        try {
          const org = JSON.parse(stored)
          setOrganization(org)
        } catch (err) {
          console.error("Error loading organization data:", err)
        }
      }

      // Load edit data if in edit mode
      if (isEditMode) {
        const editData = sessionStorage.getItem("editRole")
        if (editData) {
          try {
            const role = JSON.parse(editData) as RoleData
            setEditingRole(role)
            setRoleName(role.name)
            // Pre-fill with permissions mapped to policies
            setSelectedPolicies(role.permissions || [])
            // Pre-fill other fields if available
            if (role.vaults) setSelectedVaults(role.vaults)
            if (role.tables) setSelectedTables(role.tables)
            if (role.fields) setSelectedFields(role.fields)
            // Clear the edit data from sessionStorage after loading
            sessionStorage.removeItem("editRole")
          } catch (err) {
            console.error("Error loading edit data:", err)
          }
        }
      }

      setLoading(false)
    }
  }, [orgId, isEditMode])

  const handleSubmit = async () => {
    if (!roleName.trim()) {
      alert("Please enter a role name")
      return
    }

    setIsSubmitting(true)
    try {
      if (isEditMode && editingRole) {
        console.log("Updating role:", {
          id: editingRole.id,
          roleName,
          vaults: selectedVaults,
          tables: selectedTables,
          fields: selectedFields,
          policies: selectedPolicies,
          organizationId: organization?.merchantId || orgId,
        })
      } else {
        console.log("Creating role:", {
          roleName,
          vaults: selectedVaults,
          tables: selectedTables,
          fields: selectedFields,
          policies: selectedPolicies,
          organizationId: organization?.merchantId || orgId,
        })
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))
      router.push(`/dashboard/organization/${orgId}/roles`)
    } catch (error) {
      console.error("Error saving role:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Back Button */}
      <Button 
        variant="outline"
        onClick={() => router.push(`/dashboard/organization/${orgId}/roles`)}
        className="border-2 border-black text-black bg-transparent hover:bg-black hover:text-white rounded-full transition-all gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Roles
      </Button>

      {/* Header Card */}
      <Card className="border-0 bg-gradient-to-r from-blue-500/10 via-blue-400/5 to-transparent">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-blue-500/20 flex items-center justify-center shadow-sm">
              <UserCog className="h-7 w-7 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {isEditMode ? "Edit Role" : "Add New Role"}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {isEditMode 
                  ? `Update role settings for ${organization?.name || "your organization"}`
                  : `Define permissions for ${organization?.name || "your organization"}`
                }
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Form Card */}
      <Card className="shadow-sm">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Role Configuration</h2>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Role Name */}
          <div className="space-y-2">
            <Label htmlFor="roleName" className="text-sm font-medium">
              Role Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="roleName"
              placeholder="e.g., analyst, developer, admin"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="h-11"
            />
          </div>

          {/* Scope Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Database className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-semibold uppercase text-muted-foreground tracking-wide">Access Scope</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <MultiSelect
                label="Vault ID(s)"
                placeholder="Select vaults..."
                options={vaultOptions}
                selected={selectedVaults}
                onSelect={(v) => setSelectedVaults([...selectedVaults, v])}
                onRemove={(v) => setSelectedVaults(selectedVaults.filter((x) => x !== v))}
                helperText="Select one or more vaults"
                icon={Database}
              />

              <MultiSelect
                label="Table name(s)"
                placeholder="Select tables..."
                options={tableOptions}
                selected={selectedTables}
                onSelect={(v) => setSelectedTables([...selectedTables, v])}
                onRemove={(v) => setSelectedTables(selectedTables.filter((x) => x !== v))}
                helperText="Select one or more tables"
                icon={TableIcon}
              />
            </div>

            <MultiSelect
              label="Field name(s)"
              placeholder="Select fields..."
              options={fieldOptions}
              selected={selectedFields}
              onSelect={(v) => setSelectedFields([...selectedFields, v])}
              onRemove={(v) => setSelectedFields(selectedFields.filter((x) => x !== v))}
              helperText="Select one or more fields"
            />
          </div>

          {/* Policies Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Key className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-semibold uppercase text-muted-foreground tracking-wide">Policies</h3>
            </div>

            <MultiSelect
              label="Assigned Policies"
              placeholder="Select policies..."
              options={policyOptions}
              selected={selectedPolicies}
              onSelect={(v) => setSelectedPolicies([...selectedPolicies, v])}
              onRemove={(v) => setSelectedPolicies(selectedPolicies.filter((x) => x !== v))}
              icon={Key}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/organization/${orgId}/roles`)}
              disabled={isSubmitting}
              className="px-6"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="px-6 shadow-sm hover:shadow-md transition-all"
            >
              {isSubmitting 
                ? (isEditMode ? "Updating..." : "Adding Role...") 
                : (isEditMode ? "Update Role" : "Add Role")
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AddRoleLoading() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}

export default function AddRolePage() {
  return (
    <Suspense fallback={<AddRoleLoading />}>
      <AddRoleContent />
    </Suspense>
  )
}
