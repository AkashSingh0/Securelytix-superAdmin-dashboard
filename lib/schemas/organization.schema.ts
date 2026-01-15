import { z } from "zod"

// File validation helper
const fileSchema = z.instanceof(File).nullable().optional()

const requiredFileSchema = z.instanceof(File, {
  message: "Please upload a file",
})

// IP Address validation
const ipAddressSchema = z.string().regex(
  /^(\d{1,3}\.){3}\d{1,3}$/,
  "Please enter a valid IP address (e.g., 192.168.1.1)"
)

// Organization form validation schema
export const organizationFormSchema = z.object({
  // Organization Details
  legalEntityName: z
    .string()
    .min(1, "Legal entity name is required")
    .min(2, "Legal entity name must be at least 2 characters")
    .max(200, "Legal entity name must be less than 200 characters"),
  
  legalType: z
    .string()
    .min(1, "Legal type is required"),
  
  legalEmail: z
    .string()
    .min(1, "Legal email is required")
    .email("Please enter a valid email address"),
  
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  
  maxWorkspace: z
    .string()
    .min(1, "Max workspace is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Max workspace must be a positive number",
    }),
  
  maxVault: z
    .string()
    .min(1, "Max vault is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Max vault must be a positive number",
    }),
  
  // Contact Information
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  
  lastName: z
    .string()
    .max(50, "Last name must be less than 50 characters")
    .optional()
    .or(z.literal("")),
  
  companyWebsite: z
    .string()
    .url("Please enter a valid URL (e.g., https://example.com)")
    .optional()
    .or(z.literal("")),
  
  // Documents
  gstVatCertificate: requiredFileSchema,
  panTaxId: requiredFileSchema,
  authorizationSignatureLetter: requiredFileSchema,
  
  // Infrastructure
  cloudProvider: z
    .string()
    .min(1, "Cloud provider is required"),
  
  serverRegion: z
    .string()
    .min(1, "Server region is required"),
  
  ipWhitelisting: z
    .array(ipAddressSchema)
    .max(5, "Maximum 5 IP addresses allowed")
    .optional()
    .default([]),
})

// Schema for edit mode (documents are optional)
export const organizationEditSchema = organizationFormSchema.extend({
  // Make documents optional in edit mode
  gstVatCertificate: fileSchema,
  panTaxId: fileSchema,
  authorizationSignatureLetter: fileSchema,
  // Password optional in edit mode
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .optional()
    .or(z.literal("")),
  // Max workspace/vault optional in edit
  maxWorkspace: z.string().optional().or(z.literal("")),
  maxVault: z.string().optional().or(z.literal("")),
})

// TypeScript types inferred from schemas
export type OrganizationFormData = z.infer<typeof organizationFormSchema>
export type OrganizationEditData = z.infer<typeof organizationEditSchema>

// Default values for the form
export const organizationFormDefaults: Partial<OrganizationFormData> = {
  legalEntityName: "",
  legalType: "",
  legalEmail: "",
  password: "",
  maxWorkspace: "",
  maxVault: "",
  firstName: "",
  lastName: "",
  companyWebsite: "",
  cloudProvider: "",
  serverRegion: "",
  ipWhitelisting: [],
}

// Legal type options
export const legalTypeOptions = [
  { value: "pvt-ltd", label: "Private Limited (Pvt Ltd)" },
  { value: "llp", label: "Limited Liability Partnership (LLP)" },
  { value: "public-ltd", label: "Public Limited Company" },
  { value: "sole-proprietor", label: "Sole Proprietorship" },
  { value: "partnership", label: "Partnership Firm" },
  { value: "opc", label: "One Person Company (OPC)" },
  { value: "ngo", label: "Non-Profit / NGO" },
  { value: "trust", label: "Trust" },
  { value: "cooperative", label: "Cooperative Society" },
  { value: "government", label: "Government Entity" },
  { value: "franchise", label: "Franchise" },
  { value: "subsidiary", label: "Subsidiary Company" },
  { value: "joint-venture", label: "Joint Venture" },
  { value: "msme", label: "MSME / Small Business" },
  { value: "startup", label: "Startup (DPIIT Registered)" },
  { value: "other", label: "Other" },
] as const

// Cloud provider options
export const cloudProviderOptions = [
  { value: "aws", label: "Amazon Web Services (AWS)" },
  { value: "gcp", label: "Google Cloud Platform (GCP)" },
  { value: "azure", label: "Microsoft Azure" },
  { value: "digitalocean", label: "DigitalOcean" },
  { value: "alibaba", label: "Alibaba Cloud" },
  { value: "oracle", label: "Oracle Cloud" },
  { value: "ibm", label: "IBM Cloud" },
  { value: "on-premise", label: "On-Premise" },
  { value: "hybrid", label: "Hybrid" },
  { value: "other", label: "Other" },
] as const

// Server region options
export const serverRegionOptions = [
  { value: "in-mumbai", label: "India - Mumbai" },
  { value: "in-hyderabad", label: "India - Hyderabad" },
  { value: "in-delhi", label: "India - Delhi NCR" },
  { value: "us-east", label: "United States - East (Virginia)" },
  { value: "us-west", label: "United States - West (California)" },
  { value: "eu-west", label: "Europe - West (Ireland)" },
  { value: "eu-central", label: "Europe - Central (Frankfurt)" },
  { value: "uk-london", label: "United Kingdom - London" },
  { value: "uae-dubai", label: "UAE - Dubai" },
  { value: "sg-singapore", label: "Singapore" },
  { value: "jp-tokyo", label: "Japan - Tokyo" },
  { value: "au-sydney", label: "Australia - Sydney" },
  { value: "br-saopaulo", label: "Brazil - São Paulo" },
  { value: "ca-central", label: "Canada - Central" },
  { value: "other", label: "Other" },
] as const

