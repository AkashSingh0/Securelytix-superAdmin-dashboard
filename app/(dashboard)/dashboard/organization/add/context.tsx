"use client"

import { createContext, useContext } from "react"

export type Step = 1 | 2 | 3 | 4 | 5

export interface BasicDetails {
  merchantId: string
}

export interface BusinessDetails {
  legalEntityName: string
  registeredAddress: string
  businessType: string
  registrationCertificate: File | null
  panTaxId: File | null
  gstVatCertificate: File | null
  authorizedSignatoryIdProof: File[]
  kycDocumentsDirectorsOwners: File[]
  dataPrivacyPolicy: File | null
  dataPrivacyPolicyWebsite: string
  informationSecurityPolicy: File | null
  apiIntegrationDetails: File | null
  dataSchemaFieldMapping: File | null
  dataFlowDiagram: File | null
  expectedTransactionVolume: File | null
  businessUseCase: File | null
  dataResidencyRequirement: File | null
  iamDetails: File | null
  accessRolesMatrix: { name: string; email: string; phone: string; role: string }[]
  downstreamDataUsage: File | null
  authorizedSignatoryLetter: File | null
  ndaDataProtectionAgreement: File | null
  infrastructureOverview: {
    cloudProvider: string
    serverRegion: string
    ipWhitelisting: string[]
  }
  technicalSPOCContacts: { name: string; email: string; phone: string; designation: string }[]
  escalationContacts: { name: string; email: string; phone: string; designation: string }[]
}

export interface OrganizationContextValue {
  businessDetails: BusinessDetails
  isEditMode: boolean
  isSPOCDialogOpen: boolean
  isAccessRolesDialogOpen: boolean
  newAccessRole: { name: string; email: string; phone: string; role: string }
  newTechnicalSPOC: { name: string; email: string; phone: string; designation: string }
  setBusinessDetails: (updater: (prev: BusinessDetails) => BusinessDetails) => void
  setIsEditMode: (value: boolean) => void
  setIsSPOCDialogOpen: (value: boolean) => void
  setIsAccessRolesDialogOpen: (value: boolean) => void
  setNewAccessRole: (value: { name: string; email: string; phone: string; role: string }) => void
  setNewTechnicalSPOC: (value: { name: string; email: string; phone: string; designation: string }) => void
  handleBusinessDetailsChange: (field: string, value: string) => void
  handleInfrastructureChange: (field: "cloudProvider" | "serverRegion", value: string) => void
  handleAddIpWhitelist: (ip: string) => void
  handleRemoveIpWhitelist: (ip: string) => void
  handleRemoveTechnicalSPOCContact: (index: number) => void
  handleEscalationContactChange: (index: number, field: keyof BusinessDetails["escalationContacts"][number], value: string) => void
  handleAddEscalationContact: () => void
  handleAddAccessRole: () => void
  handleRemoveAccessRole: () => void
  handleRemoveEscalationContact: (index: number) => void
  handleAddTechnicalSPOC: () => void
  handleFileUpload: (field: string, file: File | null) => void
  handleProceed: () => void
  getCurrentStep: () => Step
}

export const OrganizationContext = createContext<OrganizationContextValue | null>(null)

export function useOrganizationForm() {
  const context = useContext(OrganizationContext)
  if (!context) {
    throw new Error("useOrganizationForm must be used within OrganizationFormProvider")
  }
  return context
}



