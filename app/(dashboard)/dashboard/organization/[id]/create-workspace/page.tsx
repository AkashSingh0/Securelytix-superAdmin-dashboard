"use client"

import { Suspense } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Layers, FileText, MapPin, Server, Loader2 } from "lucide-react"

interface OrganizationData {
  id: string
  name: string
  email: string
  merchantId: string
  status: string
}

interface WorkspaceData {
  id: string
  name: string
  description: string
  region: string
  status: string
  vaults: number
}

// Region - only Mumbai available
const defaultRegion = { value: "mumbai", label: "Mumbai", flag: "🇮🇳" }

function CreateWorkspaceContent() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const orgId = params.id as string
  const isEditMode = searchParams.get("edit") === "true"

  const [organization, setOrganization] = useState<OrganizationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingWorkspace, setEditingWorkspace] = useState<WorkspaceData | null>(null)

  // Form state
  const [workspaceName, setWorkspaceName] = useState("")
  const [workspaceDescription, setWorkspaceDescription] = useState("")
  const [region] = useState(defaultRegion.value)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
        const editData = sessionStorage.getItem("editWorkspace")
        if (editData) {
          try {
            const workspace = JSON.parse(editData) as WorkspaceData
            setEditingWorkspace(workspace)
            setWorkspaceName(workspace.name)
            setWorkspaceDescription(workspace.description || "")
            // Clear the edit data from sessionStorage after loading
            sessionStorage.removeItem("editWorkspace")
          } catch (err) {
            console.error("Error loading edit data:", err)
          }
        }
      }

      setLoading(false)
    }
  }, [orgId, isEditMode])

  const handleSubmit = async () => {
    if (!workspaceName.trim()) {
      alert("Please enter a workspace name")
      return
    }
    if (!region) {
      alert("Please select a region")
      return
    }

    setIsSubmitting(true)
    try {
      if (isEditMode && editingWorkspace) {
        console.log("Updating workspace:", {
          id: editingWorkspace.id,
          workspaceName,
          workspaceDescription,
          region,
          organizationId: organization?.merchantId || orgId,
        })
      } else {
        console.log("Creating workspace:", {
          workspaceName,
          workspaceDescription,
          region,
          organizationId: organization?.merchantId || orgId,
        })
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))
      router.push(`/dashboard/organization/${orgId}/workspaces`)
    } catch (error) {
      console.error("Error saving workspace:", error)
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
        onClick={() => router.push(`/dashboard/organization/${orgId}/workspaces`)}
        className="border-2 border-black text-black bg-transparent hover:bg-black hover:text-white rounded-full transition-all gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Workspaces
      </Button>

      {/* Header Card */}
      <Card className="border-0 bg-gradient-to-r from-violet-500/10 via-violet-400/5 to-transparent">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-violet-500/20 flex items-center justify-center shadow-sm">
              <Layers className="h-7 w-7 text-violet-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {isEditMode ? "Edit Workspace" : "Create Workspace"}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {isEditMode 
                  ? `Update workspace settings for ${organization?.name || "your organization"}`
                  : `Set up a new environment for ${organization?.name || "your organization"}`
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
            <Server className="h-5 w-5 text-violet-600" />
            <h2 className="text-lg font-semibold">Workspace Details</h2>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-5">
          {/* Workspace Name */}
          <div className="space-y-2">
            <Label htmlFor="workspaceName" className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-muted-foreground" />
              Workspace Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="workspaceName"
              placeholder="e.g., Production, Development, Staging"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="h-11"
            />
          </div>

          {/* Workspace Description */}
          <div className="space-y-2">
            <Label htmlFor="workspaceDescription" className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Description
            </Label>
            <Textarea
              id="workspaceDescription"
              placeholder="Describe the purpose of this workspace..."
              value={workspaceDescription}
              onChange={(e) => setWorkspaceDescription(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Region Card */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Region
            </Label>
            <div className="rounded-lg border-2 border-violet-200 bg-violet-50/50 p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center text-xl shadow-sm">
                  {defaultRegion.flag}
                </div>
                <div>
                  <p className="font-medium">{defaultRegion.label}</p>
                  <p className="text-xs text-muted-foreground">Data will be stored in this region</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/organization/${orgId}/workspaces`)}
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
                : (isEditMode ? "Update Workspace" : "Create Workspace")
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function CreateWorkspaceLoading() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}

export default function CreateWorkspacePage() {
  return (
    <Suspense fallback={<CreateWorkspaceLoading />}>
      <CreateWorkspaceContent />
    </Suspense>
  )
}
