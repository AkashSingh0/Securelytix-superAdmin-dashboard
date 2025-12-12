import { FilterConfig } from "@/contexts/search-filter-context"

// Re-export FilterConfig for convenience
export type { FilterConfig }

export const pageFilterConfigs: Record<string, FilterConfig> = {
  "/dashboard/leads": {
    country_code: true,
    date_from: true,
    date_to: true,
    email: true,
    company_name: true,
    sortFields: [
      { value: "created_at", label: "Created At" },
      { value: "updated_at", label: "Updated At" },
      { value: "email", label: "Email" },
      { value: "company_name", label: "Company Name" },
      { value: "first_name", label: "First Name" },
    ],
  },
  "/dashboard/registrations": {
    country_code: true,
    date_from: true,
    date_to: true,
    email: true,
    company_name: true,
    status: true,
    sortFields: [
      { value: "created_at", label: "Created At" },
      { value: "updated_at", label: "Updated At" },
      { value: "email", label: "Email" },
      { value: "company_name", label: "Company Name" },
      { value: "name", label: "Name" },
    ],
  },
  "/dashboard/contact-us": {
    country_code: true,
    date_from: true,
    date_to: true,
    email: true,
    company_name: true,
    status: true,
    sortFields: [
      { value: "created_at", label: "Created At" },
      { value: "updated_at", label: "Updated At" },
      { value: "email", label: "Email" },
      { value: "company_name", label: "Company Name" },
      { value: "name", label: "Name" },
    ],
  },
  "/dashboard/organization": {
    country_code: true,
    date_from: true,
    date_to: true,
    email: true,
    company_name: true,
    organization_type: true,
    sortFields: [
      { value: "created_at", label: "Created At" },
      { value: "updated_at", label: "Updated At" },
      { value: "email", label: "Email" },
      { value: "company_name", label: "Company Name" },
      { value: "name", label: "Name" },
    ],
  },
  "/dashboard/billing": {
    country_code: true,
    date_from: true,
    date_to: true,
    organization_type: true,
    account_type: true,
    billing_type: true,
    sortFields: [
      { value: "created_at", label: "Created At" },
      { value: "billing_date", label: "Billing Date" },
      { value: "organization_name", label: "Organization Name" },
      { value: "charges", label: "Charges" },
    ],
  },
  "/dashboard/data-vault/workspace": {
    date_from: true,
    date_to: true,
    status: true,
    sortFields: [
      { value: "created_at", label: "Created At" },
      { value: "updated_at", label: "Updated At" },
      { value: "name", label: "Name" },
    ],
  },
  "/dashboard/data-vault/vault": {
    date_from: true,
    date_to: true,
    status: true,
    sortFields: [
      { value: "created_at", label: "Created At" },
      { value: "updated_at", label: "Updated At" },
      { value: "name", label: "Name" },
      { value: "records", label: "Records" },
    ],
  },
}

export function getFilterConfigForPath(pathname: string): FilterConfig | null {
  // Check exact match first
  if (pageFilterConfigs[pathname]) {
    return pageFilterConfigs[pathname]
  }
  
  // Check if path starts with any configured path
  for (const [configPath, config] of Object.entries(pageFilterConfigs)) {
    if (pathname.startsWith(configPath)) {
      return config
    }
  }
  
  return null
}

