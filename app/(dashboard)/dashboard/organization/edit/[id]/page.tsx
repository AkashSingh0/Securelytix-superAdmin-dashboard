"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { OrganizationForm } from "@/components/forms/organization-form"
import type { OrganizationEditData } from "@/lib/schemas/organization.schema"

export default function EditOrganizationPage() {
  const params = useParams()
  const router = useRouter()
  const organizationId = params.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [initialData, setInitialData] = useState<Partial<OrganizationEditData>>({})
  const [existingFiles, setExistingFiles] = useState<{
    gstVat?: string | null
    panTax?: string | null
    authLetter?: string | null
  }>({})

  useEffect(() => {
    const loadOrganizationData = () => {
      if (!organizationId) {
        setLoadError("Organization ID is missing")
        setIsLoading(false)
        return
      }

      // Load from sessionStorage (set by the list page)
      if (typeof window !== "undefined") {
        const stored = sessionStorage.getItem("editOrganization")
        if (stored) {
          try {
            const data = JSON.parse(stored)

            // Pre-fill from stored data
            setInitialData({
              legalEntityName: data.organization_name || "",
              legalEmail: data.email || "",
              // Other fields will be empty - user can fill them
              legalType: "",
              firstName: "",
              lastName: "",
              companyWebsite: "",
              cloudProvider: "",
              serverRegion: "",
              ipWhitelisting: [],
            })
          } catch (error) {
            console.error("Error parsing stored organization data:", error)
          }
        }
      }

      setIsLoading(false)
    }

    loadOrganizationData()
  }, [organizationId])

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading organization details...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (loadError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold">Failed to Load Organization</h3>
                <p className="text-sm text-muted-foreground mt-1">{loadError}</p>
              </div>
              <Button
                onClick={() => router.push("/dashboard/organization")}
                variant="outline"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Organizations
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <OrganizationForm
      mode="edit"
      organizationId={organizationId}
      initialData={initialData}
      existingFiles={existingFiles}
    />
  )
}
