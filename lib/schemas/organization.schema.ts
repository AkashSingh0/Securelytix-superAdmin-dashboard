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
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/,
      "Password must contain uppercase, lowercase, number, and special character (@$!%*?&#)"
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

// Legal type options (values match API expectations)
export const legalTypeOptions = [
  { value: "Private Limited Company", label: "Private Limited Company" },
  { value: "Public Limited Company", label: "Public Limited Company" },
  { value: "Limited Liability Partnership", label: "Limited Liability Partnership (LLP)" },
  { value: "Sole Proprietorship", label: "Sole Proprietorship" },
  { value: "Partnership Firm", label: "Partnership Firm" },
  { value: "One Person Company", label: "One Person Company (OPC)" },
  { value: "Non-Profit Organization", label: "Non-Profit / NGO" },
  { value: "Trust", label: "Trust" },
  { value: "Society", label: "Society" },
  { value: "Cooperative Society", label: "Cooperative Society" },
  { value: "Government Organization", label: "Government Entity" },
  { value: "Franchise", label: "Franchise" },
  { value: "Subsidiary Company", label: "Subsidiary Company" },
  { value: "Joint Venture", label: "Joint Venture" },
  { value: "MSME", label: "MSME / Small Business" },
  { value: "Startup", label: "Startup (DPIIT Registered)" },
  { value: "Other", label: "Other" },
] as const

// Cloud provider options (values match API expectations)
export const cloudProviderOptions = [
  { value: "AWS", label: "Amazon Web Services (AWS)" },
  { value: "GCP", label: "Google Cloud Platform (GCP)" },
  { value: "Azure", label: "Microsoft Azure" },
  { value: "DigitalOcean", label: "DigitalOcean" },
  { value: "Alibaba Cloud", label: "Alibaba Cloud" },
  { value: "Oracle Cloud", label: "Oracle Cloud" },
  { value: "IBM Cloud", label: "IBM Cloud" },
  { value: "On-Premise", label: "On-Premise" },
  { value: "Hybrid", label: "Hybrid" },
  { value: "Other", label: "Other" },
] as const

// Server region options (AWS region codes for API compatibility)
export const serverRegionOptions = [
  { value: "ap-south-1", label: "Asia Pacific - Mumbai (ap-south-1)" },
  { value: "ap-south-2", label: "Asia Pacific - Hyderabad (ap-south-2)" },
  { value: "ap-southeast-1", label: "Asia Pacific - Singapore (ap-southeast-1)" },
  { value: "ap-southeast-2", label: "Asia Pacific - Sydney (ap-southeast-2)" },
  { value: "ap-northeast-1", label: "Asia Pacific - Tokyo (ap-northeast-1)" },
  { value: "us-east-1", label: "US East - N. Virginia (us-east-1)" },
  { value: "us-east-2", label: "US East - Ohio (us-east-2)" },
  { value: "us-west-1", label: "US West - N. California (us-west-1)" },
  { value: "us-west-2", label: "US West - Oregon (us-west-2)" },
  { value: "eu-west-1", label: "Europe - Ireland (eu-west-1)" },
  { value: "eu-west-2", label: "Europe - London (eu-west-2)" },
  { value: "eu-central-1", label: "Europe - Frankfurt (eu-central-1)" },
  { value: "me-south-1", label: "Middle East - Bahrain (me-south-1)" },
  { value: "me-central-1", label: "Middle East - UAE (me-central-1)" },
  { value: "sa-east-1", label: "South America - São Paulo (sa-east-1)" },
  { value: "ca-central-1", label: "Canada - Central (ca-central-1)" },
  { value: "other", label: "Other Region" },
] as const

