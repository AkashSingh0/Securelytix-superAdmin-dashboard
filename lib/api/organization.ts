// API base URL - import from shared config
import { API_BASE_URL } from "./config"

export interface OrganizationListItem {
  id: string
  // Backend may return both organization_id and organization_name
  // organization_id: external ID like ORG_ABC123
  // organization_name: legal entity name (Akash PVT LTD)
  organization_id?: string | null
  organization_name?: string | null
  email?: string | null
  status: string
  created_at: string
  updated_at: string
}

export interface FetchOrganizationsResponse {
  success: boolean
  data?: OrganizationListItem[]
  error?: string
  message?: string
}

export async function fetchOrganizations(): Promise<FetchOrganizationsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/organizations`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.detail || "Failed to fetch organizations",
        message: data.message || "Unknown error",
      }
    }

    return {
      success: true,
      data: Array.isArray(data) ? data : [],
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error occurred",
    }
  }
}

export interface OrganizationDetails {
  id: string
  organization_id?: string
  organization_name?: string
  email?: string
  status?: string
  // Step 1: Basic Info
  legal_entity_name?: string
  registered_address?: string
  business_type?: string
  registration_certificate_file_id?: string | null
  pan_tax_id_file_id?: string | null
  gst_vat_certificate_file_id?: string | null
  authorized_signatory_id_proof_file_ids?: string[]
  // Step 2: Compliance
  kyc_documents_directors_owners_file_ids?: string[]
  data_privacy_policy_file_id?: string | null
  data_privacy_policy_website?: string | null
  information_security_policy_file_id?: string | null
  // Step 3: Technical
  api_integration_details_file_id?: string | null
  data_schema_field_mapping_file_id?: string | null
  data_flow_diagram_file_id?: string | null
  expected_transaction_volume_file_id?: string | null
  infrastructure_overview?: {
    cloud_provider?: string
    server_region?: string
    ip_whitelisting?: string[]
  }
  technical_spoc_contacts?: Array<{
    name: string
    email: string
    phone: string
    designation: string
  }>
  // Step 4: Use Case
  business_use_case_file_id?: string | null
  data_residency_requirement_file_id?: string | null
  iam_details_file_id?: string | null
  access_roles_matrix?: Array<{
    name: string
    email: string
    phone: string
    role: string
  }>
  downstream_data_usage_file_id?: string | null
  // Step 5: Authorization
  authorized_signatory_letter_file_id?: string | null
  nda_data_protection_agreement_file_id?: string | null
  escalation_contacts?: Array<{
    name: string
    email: string
    phone: string
    designation: string
  }>
}

export interface FetchOrganizationDetailsResponse {
  success: boolean
  data?: OrganizationDetails
  error?: string
  message?: string
}

export async function fetchOrganizationDetails(organizationId: string): Promise<FetchOrganizationDetailsResponse> {
  try {
    // The API endpoint expects organization_id (e.g., ORG_ABC123), not MongoDB id
    // If the provided ID doesn't start with ORG_, it might be a MongoDB id
    // In that case, we might need to use a different endpoint or handle it differently
    const response = await fetch(`${API_BASE_URL}/organizations/${organizationId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.detail || "Failed to fetch organization details",
        message: data.message || "Unknown error",
      }
    }

    return {
      success: true,
      data: data,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error occurred",
    }
  }
}

export interface BasicInfoRequest {
  organization_id: string
  legal_entity_name: string
  registered_address: string
  business_type: string
  registration_certificate_file_id?: string | null
  pan_tax_id_file_id?: string | null
  gst_vat_certificate_file_id?: string | null
  authorized_signatory_id_proof_file_ids?: string[]
}

export interface BasicInfoResponse {
  success: boolean
  message: string
  data?: {
    organization_id: string
    registration_certificate_file_id?: string
    pan_tax_id_file_id?: string
    gst_vat_certificate_file_id?: string
    authorized_signatory_id_proof_file_ids?: string[]
  }
  error?: string
}

export interface ComplianceResponse {
  success: boolean
  message: string
  data?: {
    organization_id: string
    kyc_documents_directors_owners_file_ids?: string[]
    data_privacy_policy_file_id?: string | null
    data_privacy_policy_website?: string | null
    information_security_policy_file_id?: string | null
    remarks?: string | null
  }
  error?: string
}

export interface TechnicalResponse {
  success: boolean
  message: string
  data?: {
    organization_id: string
    api_integration_details_file_id?: string | null
    data_schema_field_mapping_file_id?: string | null
    data_flow_diagram_file_id?: string | null
    expected_transaction_volume_file_id?: string | null
    infrastructure_overview: {
      cloud_provider: string
      server_region: string
      ip_whitelisting: string[]
    }
    technical_spoc_contacts?: {
      name: string
      email: string
      phone: string
      designation: string
    }[]
    remarks?: string | null
  }
  error?: string
}

export async function submitBasicInfo(
  organizationId: string,
  legalEntityName: string,
  registeredAddress: string,
  businessType: string,
  registrationCertificate: File | null,
  panTaxId: File | null,
  gstVatCertificate: File | null,
  authorizedSignatoryIdProof: File[]
): Promise<BasicInfoResponse> {
  try {
    // Always use FormData, even when no files
    const formData = new FormData()

    // Always send JSON as form field
    formData.append(
      "request_data",
      JSON.stringify({
        organization_basic_information: {
          organization_id: organizationId,
          legal_entity_name: legalEntityName,
          registered_address: registeredAddress,
          business_type: businessType,
          registration_certificate_file_id: null,
          pan_tax_id_file_id: null,
          gst_vat_certificate_file_id: null,
          authorized_signatory_id_proof_file_ids: [],
        },
      })
    )

    // Add files if present (can be null/undefined)
    if (registrationCertificate) {
      formData.append("registration_certificate", registrationCertificate)
    }
    if (panTaxId) {
      formData.append("pan_tax_id", panTaxId)
    }
    if (gstVatCertificate) {
      formData.append("gst_vat_certificate", gstVatCertificate)
    }
    if (authorizedSignatoryIdProof && authorizedSignatoryIdProof.length > 0) {
      authorizedSignatoryIdProof.forEach((file) => {
        formData.append("authorized_signatory_id_proof", file)
      })
    }

    // Make request - browser will set Content-Type automatically
    const response = await fetch(`${API_BASE_URL}/basic-info`, {
      method: "POST",
      body: formData,
      // DO NOT set Content-Type header - browser sets it with boundary
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.message || data.error || "Failed to submit basic information",
        error: data.error || data.detail || "Unknown error",
      }
    }

    return {
      success: true,
      message: data.message || "Basic information submitted successfully",
      data: data.data,
    }
  } catch (error) {
    return {
      success: false,
      message: "Network error occurred",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function submitTechnical(
  organizationId: string,
  apiIntegrationDetails: File | null,
  dataSchemaFieldMapping: File | null,
  dataFlowDiagram: File | null,
  expectedTransactionVolume: File | null,
  infrastructureOverview: {
    cloudProvider: string
    serverRegion: string
    ipWhitelisting: string[]
  },
  technicalSpocContacts: {
    name: string
    email: string
    phone: string
    designation: string
  }[],
): Promise<TechnicalResponse> {
  try {
    const formData = new FormData()

    // Always send JSON as form field
    formData.append(
      "request_data",
      JSON.stringify({
        organization_id: organizationId,
        technical_and_integration_details: {
          api_integration_details_file_id: null,
          data_schema_field_mapping_file_id: null,
          data_flow_diagram_file_id: null,
          expected_transaction_volume_file_id: null,
          infrastructure_overview: {
            cloud_provider: infrastructureOverview.cloudProvider,
            server_region: infrastructureOverview.serverRegion,
            ip_whitelisting: infrastructureOverview.ipWhitelisting,
          },
          technical_spoc_contacts: technicalSpocContacts,
        },
      }),
    )

    // Add files if present (can be null/undefined)
    if (apiIntegrationDetails) {
      formData.append("api_integration_details", apiIntegrationDetails)
    }
    if (dataSchemaFieldMapping) {
      formData.append("data_schema_field_mapping", dataSchemaFieldMapping)
    }
    if (dataFlowDiagram) {
      formData.append("data_flow_diagram", dataFlowDiagram)
    }
    if (expectedTransactionVolume) {
      formData.append("expected_transaction_volume", expectedTransactionVolume)
    }

    const response = await fetch(`${API_BASE_URL}/technical`, {
      method: "POST",
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.message || data.error || "Failed to submit technical information",
        error: data.error || data.detail || "Unknown error",
      }
    }

    return {
      success: true,
      message: data.message || "Technical information submitted successfully",
      data: data.data,
    }
  } catch (error) {
    return {
      success: false,
      message: "Network error occurred",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function submitCompliance(
  organizationId: string,
  kycDocuments: File[],
  dataPrivacyPolicyFile: File | null,
  dataPrivacyPolicyWebsite: string,
  informationSecurityPolicyFile: File | null
): Promise<ComplianceResponse> {
  try {
    // Always use FormData, even when no files
    const formData = new FormData()


    const trimmedWebsite = dataPrivacyPolicyWebsite?.trim() || ""
    const hasWebsite = trimmedWebsite.length > 0
    const hasPdfFile = !!dataPrivacyPolicyFile
    
    const complianceData: {
      kyc_documents_directors_owners_file_ids: string[]
      data_privacy_policy_file_id: string | null
      data_privacy_policy_website: string | null
      information_security_policy_file_id: string | null
    } = {
      kyc_documents_directors_owners_file_ids: [],
      data_privacy_policy_file_id: null,
      information_security_policy_file_id: null,
      data_privacy_policy_website: hasWebsite ? trimmedWebsite : (hasPdfFile ? "" : null),
    }

    formData.append(
      "request_data",
      JSON.stringify({
        organization_id: organizationId,
        compliance_and_regulatory: complianceData,
      }),
    )

    // Add files if present (can be null/undefined)
    if (kycDocuments && kycDocuments.length > 0) {
      kycDocuments.forEach((file) => {
        formData.append("kyc_documents_directors_owners", file)
      })
    }

    if (dataPrivacyPolicyFile) {
      formData.append("data_privacy_policy", dataPrivacyPolicyFile)
    }

    if (informationSecurityPolicyFile) {
      formData.append("information_security_policy", informationSecurityPolicyFile)
    }

    // Make request - browser will set Content-Type automatically
    const response = await fetch(`${API_BASE_URL}/compliance`, {
      method: "POST",
      body: formData,
      // DO NOT set Content-Type header - browser sets it with boundary
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.message || data.error || "Failed to submit compliance information",
        error: data.error || data.detail || "Unknown error",
      }
    }

    return {
      success: true,
      message: data.message || "Compliance information submitted successfully",
      data: data.data,
    }
  } catch (error) {
    return {
      success: false,
      message: "Network error occurred",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export interface UseCaseResponse {
  success: boolean
  message: string
  data?: {
    organization_id: string
    business_use_case_file_id?: string | null
    data_residency_requirement_file_id?: string | null
    iam_details_file_id?: string | null
    access_roles_matrix?: Array<{
      name: string
      email: string
      phone: string
      role: string
    }>
    downstream_data_usage_file_id?: string | null
    remarks?: string | null
  }
  error?: string
}

export async function submitUseCase(
  organizationId: string,
  businessUseCase: File | null,
  dataResidencyRequirement: File | null,
  iamDetails: File | null,
  accessRolesMatrix: Array<{
    name: string
    email: string
    phone: string
    role: string
  }>,
  downstreamDataUsage: File | null
): Promise<UseCaseResponse> {
  try {
    // Always use FormData, even when no files
    const formData = new FormData()

    // Build request_data exactly as backend expects
    formData.append(
      "request_data",
      JSON.stringify({
        organization_id: organizationId,
        use_case_and_access_control: {
          business_use_case_file_id: null,
          data_residency_requirement_file_id: null,
          iam_details_file_id: null,
          access_roles_matrix: accessRolesMatrix,
          downstream_data_usage_file_id: null,
        },
      }),
    )

    // Add files if present (can be null/undefined)
    if (businessUseCase) {
      formData.append("business_use_case", businessUseCase)
    }
    if (dataResidencyRequirement) {
      formData.append("data_residency_requirement", dataResidencyRequirement)
    }
    if (iamDetails) {
      formData.append("iam_details", iamDetails)
    }
    if (downstreamDataUsage) {
      formData.append("downstream_data_usage", downstreamDataUsage)
    }

    // Make request - browser will set Content-Type automatically
    const response = await fetch(`${API_BASE_URL}/usecase`, {
      method: "POST",
      body: formData,
      // DO NOT set Content-Type header - browser sets it with boundary
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.message || data.error || "Failed to submit use case information",
        error: data.error || data.detail || "Unknown error",
      }
    }

    return {
      success: true,
      message: data.message || "Use case information submitted successfully",
      data: data.data,
    }
  } catch (error) {
    return {
      success: false,
      message: "Network error occurred",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export interface AuthorizationResponse {
  success: boolean
  message: string
  data?: {
    organization_id: string
    authorized_signatory_letter_file_id?: string | null
    nda_data_protection_agreement_file_id?: string | null
    escalation_contacts?: Array<{
      name: string
      email: string
      phone: string
      designation: string
    }>
    remarks?: string | null
  }
  error?: string
}

export async function submitAuthorization(
  organizationId: string,
  authorizedSignatoryLetter: File | null,
  ndaDataProtectionAgreement: File | null,
  escalationContacts: Array<{
    name: string
    email: string
    phone: string
    designation: string
  }>
): Promise<AuthorizationResponse> {
  try {
    // Always use FormData, even when no files
    const formData = new FormData()

    // Build request_data exactly as backend expects
    formData.append(
      "request_data",
      JSON.stringify({
        organization_id: organizationId,
        authorization: {
          authorized_signatory_letter_file_id: null,
          nda_data_protection_agreement_file_id: null,
          escalation_contacts: escalationContacts,
        },
      }),
    )

    // Add files if present (can be null/undefined)
    if (authorizedSignatoryLetter) {
      formData.append("authorized_signatory_letter", authorizedSignatoryLetter)
    }
    if (ndaDataProtectionAgreement) {
      formData.append("nda_data_protection_agreement", ndaDataProtectionAgreement)
    }

    // Make request - browser will set Content-Type automatically
    const response = await fetch(`${API_BASE_URL}/authorization`, {
      method: "POST",
      body: formData,
      // DO NOT set Content-Type header - browser sets it with boundary
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.message || data.error || "Failed to submit authorization information",
        error: data.error || data.detail || "Unknown error",
      }
    }

    return {
      success: true,
      message: data.message || "Authorization information submitted successfully",
      data: data.data,
    }
  } catch (error) {
    return {
      success: false,
      message: "Network error occurred",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

