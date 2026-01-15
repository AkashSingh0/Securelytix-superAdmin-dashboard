"use client"

import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Vault, Globe, FileText, Layers, MapPin, Database } from "lucide-react"

interface OrganizationData {
  id: string
  name: string
  email: string
  merchantId: string
  status: string
}

interface VaultData {
  id: string
  name: string
  domain: string
  description: string
  workspace: string
  region: string
  status: string
}

export default function CreateVaultPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const orgId = params.id as string
  const isEditMode = searchParams.get("edit") === "true"

  const [organization, setOrganization] = useState<OrganizationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingVault, setEditingVault] = useState<VaultData | null>(null)

  // Form state
  const [vaultName, setVaultName] = useState("")
  const [domainName, setDomainName] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock workspace data - in real app, this would come from API or be selected
  const workspaceInfo = {
    name: "Production Workspace",
    region: "Mumbai",
    flag: "🇮🇳",
  }

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
        const editData = sessionStorage.getItem("editVault")
        if (editData) {
          try {
            const vault = JSON.parse(editData) as VaultData
            setEditingVault(vault)
            setVaultName(vault.name)
            setDomainName(vault.domain || "")
            setDescription(vault.description || "")
            // Clear the edit data from sessionStorage after loading
            sessionStorage.removeItem("editVault")
          } catch (err) {
            console.error("Error loading edit data:", err)
          }
        }
      }

      setLoading(false)
    }
  }, [orgId, isEditMode])

  const handleSubmit = async () => {
    if (!vaultName.trim()) {
      alert("Please enter a vault name")
      return
    }
    if (!domainName.trim()) {
      alert("Please enter a domain name")
      return
    }

    setIsSubmitting(true)
    try {
      if (isEditMode && editingVault) {
        console.log("Updating vault:", {
          id: editingVault.id,
          vaultName,
          domainName,
          description,
          workspace: workspaceInfo,
          organizationId: organization?.merchantId || orgId,
        })
      } else {
        console.log("Creating vault:", {
          vaultName,
          domainName,
          description,
          workspace: workspaceInfo,
          organizationId: organization?.merchantId || orgId,
        })
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))
      router.push(`/dashboard/organization/${orgId}/vaults`)
    } catch (error) {
      console.error("Error saving vault:", error)
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
    <div className="space-y-6 max-w-xl">
      {/* Back Button */}
      <Button 
        variant="outline"
        onClick={() => router.push(`/dashboard/organization/${orgId}/vaults`)}
        className="border-2 border-black text-black bg-transparent hover:bg-black hover:text-white rounded-full transition-all gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Vaults
      </Button>

      {/* Header Card */}
      <Card className="border-0 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-amber-500/20 flex items-center justify-center shadow-sm">
              <Vault className="h-7 w-7 text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {isEditMode ? "Edit Vault" : "Create New Vault"}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {isEditMode 
                  ? `Update vault settings for ${organization?.name || "your organization"}`
                  : `Secure data storage for ${organization?.name || "your organization"}`
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
            <Database className="h-5 w-5 text-amber-600" />
            <h2 className="text-lg font-semibold">Vault Configuration</h2>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-5">
          {/* Vault Name */}
          <div className="space-y-2">
            <Label htmlFor="vaultName" className="flex items-center gap-2">
              <Vault className="h-4 w-4 text-muted-foreground" />
              Vault Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="vaultName"
              placeholder="e.g., Customer Data Vault, Payment Vault"
              value={vaultName}
              onChange={(e) => setVaultName(e.target.value)}
              className="h-11"
            />
          </div>

          {/* Domain Name */}
          <div className="space-y-2">
            <Label htmlFor="domainName" className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              Domain Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="domainName"
              placeholder="e.g., customer, profile, transaction"
              value={domainName}
              onChange={(e) => setDomainName(e.target.value)}
              className="h-11"
            />
            <p className="text-xs text-muted-foreground">
              Domain represents the type of data stored in this vault
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe what data will be stored in this vault..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Workspace Info Card */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Target Workspace</Label>
            <div className="rounded-lg border-2 border-amber-200 bg-amber-50/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                    <Layers className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium">{workspaceInfo.name}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{workspaceInfo.flag} {workspaceInfo.region}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/organization/${orgId}/vaults`)}
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
                ? (isEditMode ? "Updating..." : "Creating...") 
                : (isEditMode ? "Update Vault" : "Create Vault")
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
