"use client"

import { ReactNode, useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { X, ChevronRight, Loader2 } from "lucide-react"
import { OrganizationContext, type BusinessDetails, type BasicDetails, type Step } from "./context"
import { submitBasicInfo, submitCompliance, submitTechnical, submitUseCase, submitAuthorization } from "@/lib/api/organization"

const stepRoutes: { step: Step; path: string; label: string }[] = [
  { step: 1, path: "basic-info", label: "Organization Basic Information" },
  { step: 2, path: "compliance", label: "Compliance & Regulatory Documents" },
  { step: 3, path: "technical", label: "Technical & Integration Details" },
  { step: 4, path: "usecase", label: "Use Case & Access Control" },
  { step: 5, path: "authorization", label: "Authorization" },
]

function createInitialBusinessDetails(): BusinessDetails {
  return {
    legalEntityName: "",
    registeredAddress: "",
    businessType: "",
    registrationCertificate: null,
    panTaxId: null,
    gstVatCertificate: null,
    authorizedSignatoryIdProof: [],
    kycDocumentsDirectorsOwners: [],
    dataPrivacyPolicy: null,
    dataPrivacyPolicyWebsite: "",
    informationSecurityPolicy: null,
    apiIntegrationDetails: null,
    dataSchemaFieldMapping: null,
    dataFlowDiagram: null,
    expectedTransactionVolume: null,
    businessUseCase: null,
    dataResidencyRequirement: null,
    iamDetails: null,
    accessRolesMatrix: [],
    downstreamDataUsage: null,
    authorizedSignatoryLetter: null,
    ndaDataProtectionAgreement: null,
    infrastructureOverview: {
      cloudProvider: "",
      serverRegion: "",
      ipWhitelisting: [],
    },
    technicalSPOCContacts: [
      { name: "", email: "", phone: "", designation: "" },
    ],
    escalationContacts: [
      { name: "", email: "", phone: "", designation: "" },
    ],
  }
}

function OrganizationAddLayoutContent({ children }: { children: ReactNode }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const [basicDetails, setBasicDetails] = useState<BasicDetails>({
    merchantId: "",
  })

  const [businessDetails, setBusinessDetails] = useState<BusinessDetails>(createInitialBusinessDetails())
  const [isEditMode, setIsEditMode] = useState(false)
  const [isSPOCDialogOpen, setIsSPOCDialogOpen] = useState(false)
  const [isAccessRolesDialogOpen, setIsAccessRolesDialogOpen] = useState(false)
  const [newAccessRole, setNewAccessRole] = useState({
    name: "",
    email: "",
    phone: "",
    role: "superadmin",
  })
  const [newTechnicalSPOC, setNewTechnicalSPOC] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)

  // Handle add vs edit mode and Organization ID
  useEffect(() => {
    if (typeof window === "undefined") return
    const mode = searchParams.get("mode")

    if (mode === "edit") {
      const stored = sessionStorage.getItem("selectedOrganization")
      if (stored) {
        try {
          const org = JSON.parse(stored)
          setBasicDetails((prev) => ({
            ...prev,
            merchantId: org.merchantId || prev.merchantId,
          }))
          setBusinessDetails((prev) => {
            // Populate Access Roles Matrix with email from organization
            const accessRoles = org.email
              ? [{ name: "", email: org.email || "", phone: "", role: "superadmin" }]
              : []
            return {
              ...prev,
              legalEntityName: org.name || prev.legalEntityName,
              accessRolesMatrix: accessRoles,
            }
          })
          setIsEditMode(true)
        } catch {
          // ignore parse errors
        }
      }
    } else {
      setIsEditMode(false)
      setBasicDetails((prev) => ({
        ...prev,
        merchantId: prev.merchantId || `ORG_${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
      }))
    }
  }, [searchParams])

  const handleBusinessDetailsChange = (field: string, value: string) => {
    setBusinessDetails((prev) => ({ ...prev, [field]: value }))
  }

  const handleInfrastructureChange = (field: "cloudProvider" | "serverRegion", value: string) => {
    setBusinessDetails((prev) => ({
      ...prev,
      infrastructureOverview: {
        ...prev.infrastructureOverview,
        [field]: value,
      },
    }))
  }

  const handleAddIpWhitelist = (ip: string) => {
    if (!ip) return
    setBusinessDetails((prev) => {
      const current = prev.infrastructureOverview.ipWhitelisting
      if (current.length >= 3 || current.includes(ip)) return prev
      return {
        ...prev,
        infrastructureOverview: {
          ...prev.infrastructureOverview,
          ipWhitelisting: [...current, ip],
        },
      }
    })
  }

  const handleRemoveIpWhitelist = (ip: string) => {
    setBusinessDetails((prev) => ({
      ...prev,
      infrastructureOverview: {
        ...prev.infrastructureOverview,
        ipWhitelisting: prev.infrastructureOverview.ipWhitelisting.filter((v) => v !== ip),
      },
    }))
  }

  const handleRemoveTechnicalSPOCContact = (index: number) => {
    setBusinessDetails((prev) => {
      const updated = [...prev.technicalSPOCContacts]
      updated.splice(index, 1)
      return {
        ...prev,
        technicalSPOCContacts: updated,
      }
    })
  }

  const handleEscalationContactChange = (
    index: number,
    field: keyof BusinessDetails["escalationContacts"][number],
    value: string,
  ) => {
    setBusinessDetails((prev) => {
      const updated = [...prev.escalationContacts]
      updated[index] = {
        ...updated[index],
        [field]: value,
      }
      return {
        ...prev,
        escalationContacts: updated,
      }
    })
  }

  const handleAddEscalationContact = () => {
    setBusinessDetails((prev) => {
      if (prev.escalationContacts.length >= 10) return prev
      return {
        ...prev,
        escalationContacts: [
          ...prev.escalationContacts,
          { name: "", email: "", phone: "", designation: "" },
        ],
      }
    })
  }

  const handleAddAccessRole = () => {
    setBusinessDetails((prev) => ({
      ...prev,
      accessRolesMatrix:
        !newAccessRole.name && !newAccessRole.email && !newAccessRole.phone
          ? []
          : [{ ...newAccessRole }],
    }))
  }

  const handleRemoveAccessRole = () => {
    setBusinessDetails((prev) => ({
      ...prev,
      accessRolesMatrix: [],
    }))
  }

  const handleRemoveEscalationContact = (index: number) => {
    setBusinessDetails((prev) => {
      const updated = [...prev.escalationContacts]
      if (updated.length <= 1) {
        return {
          ...prev,
          escalationContacts: [{ name: "", email: "", phone: "", designation: "" }],
        }
      }
      updated.splice(index, 1)
      return {
        ...prev,
        escalationContacts: updated,
      }
    })
  }

  const handleAddTechnicalSPOC = () => {
    if (
      !newTechnicalSPOC.name &&
      !newTechnicalSPOC.email &&
      !newTechnicalSPOC.phone &&
      !newTechnicalSPOC.designation
    ) {
      return
    }
    setBusinessDetails((prev) => {
      if (prev.technicalSPOCContacts.length >= 10) return prev
      return {
        ...prev,
        technicalSPOCContacts: [...prev.technicalSPOCContacts, { ...newTechnicalSPOC }],
      }
    })
    setNewTechnicalSPOC({
      name: "",
      email: "",
      phone: "",
      designation: "",
    })
  }

  const handleFileUpload = (field: string, file: File | null) => {
    if (file) {
      const maxSize = 2 * 1024 * 1024
      if (file.size > maxSize) {
        alert(`File size must be less than 2MB. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`)
        return
      }
      if (file.type !== "application/pdf") {
        alert("Please upload a PDF file")
        return
      }
    }

    const multiFileFields = new Set(["authorizedSignatoryIdProof", "kycDocumentsDirectorsOwners"])

    setBusinessDetails((prev) => {
      if (multiFileFields.has(field)) {
        const current = (prev as any)[field] as File[]
        if (!file) {
          return {
            ...prev,
            [field]: [],
          }
        }
        return {
          ...prev,
          [field]: [...current, file],
        }
      }

      return { ...prev, [field]: file }
    })
  }

  const getCurrentStep = (): Step => {
    const currentPath = pathname.split("/").pop() || "basic-info"
    const stepRoute = stepRoutes.find((sr) => sr.path === currentPath)
    return stepRoute?.step || 1
  }

  const handleProceed = async () => {
    const currentStep = getCurrentStep()
    
    // Step 1: Submit basic info to API
    if (currentStep === 1) {
      setIsSubmitting(true)
      setSubmitError(null)
      setSubmitSuccess(null)

      // Validate required fields
      if (!businessDetails.legalEntityName.trim()) {
        setSubmitError("Legal Entity Name is required")
        setIsSubmitting(false)
        return
      }
      if (!businessDetails.registeredAddress.trim()) {
        setSubmitError("Registered Address is required")
        setIsSubmitting(false)
        return
      }
      if (!businessDetails.businessType.trim()) {
        setSubmitError("Business Type is required")
        setIsSubmitting(false)
        return
      }
      if (!basicDetails.merchantId || !basicDetails.merchantId.startsWith("ORG_")) {
        setSubmitError("Valid Organization ID is required")
        setIsSubmitting(false)
        return
      }

      try {
        const response = await submitBasicInfo(
          basicDetails.merchantId,
          businessDetails.legalEntityName,
          businessDetails.registeredAddress,
          businessDetails.businessType,
          businessDetails.registrationCertificate,
          businessDetails.panTaxId,
          businessDetails.gstVatCertificate,
          businessDetails.authorizedSignatoryIdProof
        )

        if (response.success) {
          setSubmitSuccess(response.message || "Basic information submitted successfully")
          // Update file IDs if returned from API
          if (response.data) {
            setBusinessDetails((prev) => ({
              ...prev,
              registrationCertificate: response.data?.registration_certificate_file_id 
                ? { name: "uploaded.pdf", size: 0 } as File 
                : prev.registrationCertificate,
              panTaxId: response.data?.pan_tax_id_file_id 
                ? { name: "uploaded.pdf", size: 0 } as File 
                : prev.panTaxId,
              gstVatCertificate: response.data?.gst_vat_certificate_file_id 
                ? { name: "uploaded.pdf", size: 0 } as File 
                : prev.gstVatCertificate,
            }))
          }
          // Navigate to next step after a short delay
          setTimeout(() => {
            router.push(`/dashboard/organization/add/${stepRoutes[1].path}`)
          }, 1000)
        } else {
          setSubmitError(response.error || response.message || "Failed to submit basic information")
        }
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : "An unexpected error occurred")
      } finally {
        setIsSubmitting(false)
      }
      return
    }

    // Step 2: Submit compliance & regulatory documents
    if (currentStep === 2) {
      setIsSubmitting(true)
      setSubmitError(null)
      setSubmitSuccess(null)

      if (!basicDetails.merchantId || !basicDetails.merchantId.startsWith("ORG_")) {
        setSubmitError("Valid Organization ID is required")
        setIsSubmitting(false)
        return
      }

      // Data Privacy Policy: require at least PDF or website link
      if (
        !businessDetails.dataPrivacyPolicy &&
        (!businessDetails.dataPrivacyPolicyWebsite ||
          !businessDetails.dataPrivacyPolicyWebsite.trim())
      ) {
        setSubmitError("Data Privacy Policy PDF or website link is required")
        setIsSubmitting(false)
        return
      }

      // Information Security Policy: required (file)
      if (!businessDetails.informationSecurityPolicy) {
        setSubmitError("Information Security Policy PDF is required")
        setIsSubmitting(false)
        return
      }

      try {
        const response = await submitCompliance(
          basicDetails.merchantId,
          businessDetails.kycDocumentsDirectorsOwners,
          businessDetails.dataPrivacyPolicy,
          businessDetails.dataPrivacyPolicyWebsite,
          businessDetails.informationSecurityPolicy
        )

        if (response.success) {
          setSubmitSuccess(response.message || "Compliance information submitted successfully")
          // TODO: Optionally update state with returned file_ids from response.data

          // Navigate to next step (technical) after a short delay
          setTimeout(() => {
            router.push(`/dashboard/organization/add/${stepRoutes[2].path}`)
          }, 1000)
        } else {
          setSubmitError(response.error || response.message || "Failed to submit compliance information")
        }
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : "An unexpected error occurred")
      } finally {
        setIsSubmitting(false)
      }

      return
    }

    // Step 3: Submit technical & integration details
    if (currentStep === 3) {
      setIsSubmitting(true)
      setSubmitError(null)
      setSubmitSuccess(null)

      if (!basicDetails.merchantId || !basicDetails.merchantId.startsWith("ORG_")) {
        setSubmitError("Valid Organization ID is required")
        setIsSubmitting(false)
        return
      }

      // Infrastructure overview validation
      const infra = businessDetails.infrastructureOverview
      if (!infra.cloudProvider.trim()) {
        setSubmitError("Cloud provider is required")
        setIsSubmitting(false)
        return
      }
      if (!infra.serverRegion.trim()) {
        setSubmitError("Server region is required")
        setIsSubmitting(false)
        return
      }
      if (!infra.ipWhitelisting || infra.ipWhitelisting.length === 0) {
        setSubmitError("At least one IP address is required in IP whitelisting")
        setIsSubmitting(false)
        return
      }
      if (infra.ipWhitelisting.length > 3) {
        setSubmitError("You can add up to 3 IP addresses only")
        setIsSubmitting(false)
        return
      }

      // Filter out completely empty technical SPOC rows
      const technicalContacts = businessDetails.technicalSPOCContacts.filter(
        (c) => c.name || c.email || c.phone || c.designation,
      )

      try {
        const response = await submitTechnical(
          basicDetails.merchantId,
          businessDetails.apiIntegrationDetails,
          businessDetails.dataSchemaFieldMapping,
          businessDetails.dataFlowDiagram,
          businessDetails.expectedTransactionVolume,
          {
            cloudProvider: infra.cloudProvider,
            serverRegion: infra.serverRegion,
            ipWhitelisting: infra.ipWhitelisting,
          },
          technicalContacts,
        )

        if (response.success) {
          setSubmitSuccess(response.message || "Technical information submitted successfully")

          // Navigate to next step (use case) after a short delay
          setTimeout(() => {
            router.push(`/dashboard/organization/add/${stepRoutes[3].path}`)
          }, 1000)
        } else {
          setSubmitError(response.error || response.message || "Failed to submit technical information")
        }
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : "An unexpected error occurred")
      } finally {
        setIsSubmitting(false)
      }

      return
    }

    // Step 4: Submit use case & access control
    if (currentStep === 4) {
      setIsSubmitting(true)
      setSubmitError(null)
      setSubmitSuccess(null)

      if (!basicDetails.merchantId || !basicDetails.merchantId.startsWith("ORG_")) {
        setSubmitError("Valid Organization ID is required")
        setIsSubmitting(false)
        return
      }

      // Filter out completely empty access roles matrix entries
      const accessRoles = businessDetails.accessRolesMatrix.filter(
        (role) => role.name || role.email || role.phone || role.role,
      )

      try {
        const response = await submitUseCase(
          basicDetails.merchantId,
          businessDetails.businessUseCase,
          businessDetails.dataResidencyRequirement,
          businessDetails.iamDetails,
          accessRoles,
          businessDetails.downstreamDataUsage,
        )

        if (response.success) {
          setSubmitSuccess(response.message || "Use case information submitted successfully")

          // Navigate to next step (authorization) after a short delay
          setTimeout(() => {
            router.push(`/dashboard/organization/add/${stepRoutes[4].path}`)
          }, 1000)
        } else {
          setSubmitError(response.error || response.message || "Failed to submit use case information")
        }
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : "An unexpected error occurred")
      } finally {
        setIsSubmitting(false)
      }

      return
    }

    // Step 5: Final submission - Authorization
    if (currentStep === 5) {
      setIsSubmitting(true)
      setSubmitError(null)
      setSubmitSuccess(null)

      if (!basicDetails.merchantId || !basicDetails.merchantId.startsWith("ORG_")) {
        setSubmitError("Valid Organization ID is required")
        setIsSubmitting(false)
        return
      }

      // Filter out completely empty escalation contact rows
      const escalationContacts = businessDetails.escalationContacts.filter(
        (contact) => contact.name || contact.email || contact.phone || contact.designation,
      )

      try {
        const response = await submitAuthorization(
          basicDetails.merchantId,
          businessDetails.authorizedSignatoryLetter,
          businessDetails.ndaDataProtectionAgreement,
          escalationContacts,
        )

        if (response.success) {
          setSubmitSuccess(response.message || "Authorization information submitted successfully")

          // Save to localStorage and navigate after successful API submission
          if (typeof window !== "undefined") {
            const stored = localStorage.getItem("organizations")
            let organizations: any[] = []
            if (stored) {
              try {
                organizations = JSON.parse(stored)
              } catch {
                organizations = []
              }
            }

            const accessRolesEmail =
              businessDetails.accessRolesMatrix &&
              businessDetails.accessRolesMatrix.length > 0
                ? businessDetails.accessRolesMatrix[0].email
                : ""

            const baseOrg = {
              name: businessDetails.legalEntityName || "",
              email: accessRolesEmail,
              merchantId: basicDetails.merchantId,
              productStatus: "Pending",
            }

            if (isEditMode) {
              let updated = false
              organizations = organizations.map((org) => {
                if (org.merchantId === baseOrg.merchantId) {
                  updated = true
                  return { ...org, ...baseOrg }
                }
                return org
              })
              if (!updated) {
                organizations.push({
                  id: Date.now(),
                  ...baseOrg,
                })
              }
            } else {
              organizations.push({
                id: Date.now(),
                ...baseOrg,
              })
            }

            localStorage.setItem("organizations", JSON.stringify(organizations))
          }

          // Navigate to organizations list after a short delay
          setTimeout(() => {
            router.push("/dashboard/organization")
          }, 1000)
        } else {
          setSubmitError(response.error || response.message || "Failed to submit authorization information")
          setIsSubmitting(false)
        }
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : "An unexpected error occurred")
        setIsSubmitting(false)
      }

      return
    } else {
      // Navigate to next step
      const currentIndex = stepRoutes.findIndex((sr) => sr.path === pathname.split("/").pop())
      if (currentIndex < stepRoutes.length - 1) {
        router.push(`/dashboard/organization/add/${stepRoutes[currentIndex + 1].path}`)
      }
    }
  }

  const handlePrevious = () => {
    const currentIndex = stepRoutes.findIndex((sr) => sr.path === pathname.split("/").pop())
    if (currentIndex > 0) {
      router.push(`/dashboard/organization/add/${stepRoutes[currentIndex - 1].path}`)
    }
  }

  const currentStep = getCurrentStep()
  const isFirstStep = currentStep === 1
  const isLastStep = currentStep === 5

  const contextValue = {
    businessDetails,
    isEditMode,
    isSPOCDialogOpen,
    isAccessRolesDialogOpen,
    newAccessRole,
    newTechnicalSPOC,
    setBusinessDetails,
    setIsEditMode,
    setIsSPOCDialogOpen,
    setIsAccessRolesDialogOpen,
    setNewAccessRole,
    setNewTechnicalSPOC,
    handleBusinessDetailsChange,
    handleInfrastructureChange,
    handleAddIpWhitelist,
    handleRemoveIpWhitelist,
    handleRemoveTechnicalSPOCContact,
    handleEscalationContactChange,
    handleAddEscalationContact,
    handleAddAccessRole,
    handleRemoveAccessRole,
    handleRemoveEscalationContact,
    handleAddTechnicalSPOC,
    handleFileUpload,
    handleProceed,
    getCurrentStep,
  }

  return (
    <OrganizationContext.Provider value={contextValue}>
      <div className="relative h-full flex -m-6">
        {/* Left Sidebar - Steps Navigation */}
        <div className="w-85 border-r bg-card flex flex-col" style={{ height: 'calc(100% + 3rem)' }}>
          <div className="p-6 space-y-6 flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {isEditMode ? "Edit Organization" : "Add New Organization"}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/dashboard/organization")}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {stepRoutes.map(({ step, path, label }) => {
                const isActive = pathname.endsWith(path)
                const isCompleted = stepRoutes.findIndex((sr) => pathname.endsWith(sr.path)) > step - 1

                return (
                  <div key={step} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-3 w-3 rounded-full ${
                          isActive || isCompleted ? "bg-primary" : "bg-muted"
                        }`}
                      />
                      <span className={`font-semibold ${isActive ? "text-primary" : ""}`}>
                        {label}
                      </span>
                    </div>
                    {isActive && (
                      <div className="ml-5 h-12 w-0.5 bg-primary" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-8 pt-3" style={{ minHeight: 'calc(100vh - 8rem)' }}>
            {children}
          </div>

          {/* Action Buttons */}
          <div className="border-t px-6 pt-3 pb-1 space-y-2">
            {(submitError || submitSuccess) && (
              <div className={`p-3 rounded-md text-sm ${
                submitError 
                  ? "bg-destructive/10 text-destructive border border-destructive/20" 
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}>
                {submitError || submitSuccess}
              </div>
            )}
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={handlePrevious} disabled={isFirstStep || isSubmitting}>
                Previous
              </Button>
              <Button onClick={handleProceed} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    {isLastStep ? (isEditMode ? "Save" : "Add Organization") : "Proceed"}
                    {!isLastStep && <ChevronRight className="h-4 w-4 ml-2" />}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </OrganizationContext.Provider>
  )
}

export default function OrganizationAddLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <OrganizationAddLayoutContent>{children}</OrganizationAddLayoutContent>
    </Suspense>
  )
}

