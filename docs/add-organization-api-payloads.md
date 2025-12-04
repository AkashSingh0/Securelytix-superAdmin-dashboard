## Add New Organization – API Payload Specification

This document describes the suggested API payload structure for the **Add New Organization** flow.
The UI is split into 5 steps; each step maps to a logical section in the API.

**Note:** All document upload fields accept **PDF format only** (max 2MB per file).

---

## API Endpoints

### Main Endpoints

- **Get Organization:** `GET /api/v1/organizations/{organization_id}`
- **List Organizations:** `GET /api/v1/organizations`
- **Upload File:** `POST /api/v1/files/upload` (returns `file_id` for PDF documents)

### Step-wise Endpoints

- **Step 1 - Basic Information:** `POST /api/v1/basic-info`
- **Step 2 - Compliance:** `POST /api/v1/compliance`
- **Step 3 - Technical:** `POST /api/v1/technical`
- **Step 4 - Use Case:** `POST /api/v1/usecase`
- **Step 5 - Authorization:** `POST /api/v1/authorization`

---

## 1. Organization Basic Information (Step 1)

### API Endpoint
- **Create/Update:** `POST /api/v1/basic-info`
- **Request Method:** POST
- **Content-Type:** application/json

### Purpose
Captures core identification and registration details of the organization.

### Suggested JSON Structure

```json
{
  "organization_basic_information": {
    "organization_id": "ORG_ABC12345",
    "legal_entity_name": "Acme Payments Pvt. Ltd.",
    "registered_address": "123, Business Park, Mumbai, India",
    "business_type": "Payment Aggregator",
    "registration_certificate_file_id": "file_reg_cert.pdf",
    "pan_tax_id_file_id": "file_pan.pdf",
    "gst_vat_certificate_file_id": "file_gst.pdf",
    "authorized_signatory_id_proof_file_ids": [
      "file_sign_id_001.pdf",
      "file_sign_id_002.pdf"
    ]
  }
}
```

### Field Details

- **organization_id** (`string`)
  - Generated on the frontend (e.g. `ORG_xxxxx`).
  - Comes from `basicDetails.merchantId`.

- **legal_entity_name** (`string`)
  - Legal name of the organization.
  - From `businessDetails.legalEntityName`.

- **registered_address** (`string`)
  - Full registered address of the entity.
  - From `businessDetails.registeredAddress`.

- **business_type** (`string`)
  - Organization type / category (e.g. Payment Aggregator, NBFC, etc.).
  - From `businessDetails.businessType`.

- **registration_certificate_file_id** (`string`, PDF)
  - File reference for Registration Certificate PDF.
  - From `businessDetails.registrationCertificate`.
  - **Format:** PDF (max 2MB)

- **pan_tax_id_file_id** (`string`, PDF)
  - File reference for PAN / Tax ID PDF.
  - From `businessDetails.panTaxId`.
  - **Format:** PDF (max 2MB)

- **gst_vat_certificate_file_id** (`string`, PDF)
  - File reference for GST / VAT certificate PDF.
  - From `businessDetails.gstVatCertificate`.
  - **Format:** PDF (max 2MB)

- **authorized_signatory_id_proof_file_ids** (`string[]`, PDF)
  - Multiple ID proof documents for the authorized signatory (PDF format).
  - From `businessDetails.authorizedSignatoryIdProof[]`.
  - **Format:** PDF (max 2MB per file)

> Note: In the UI these are `File` objects. For the API, typically files are uploaded separately
> and the API receives `file_id`/URL references as shown above. All document fields accept **PDF format only**.

---

## 2. Compliance & Regulatory Documents (Step 2)

### API Endpoint
- **Create/Update:** `POST /api/v1/compliance`
- **Request Method:** POST
- **Content-Type:** application/json

### Purpose
Stores mandatory compliance and regulatory documentation for the organization.

### Suggested JSON Structure

```json
{
  "compliance_and_regulatory": {
    "kyc_documents_directors_owners_file_ids": [
      "file_kyc_dir_001.pdf",
      "file_kyc_dir_002.pdf"
    ],
    "data_privacy_policy_file_id": "file_dp.pdf",
    "data_privacy_policy_website": "https://acme.com/privacy-policy",
    "information_security_policy_file_id": "file_infosec.pdf"
  }
}
```

### Field Details

- **kyc_documents_directors_owners_file_ids** (`string[]`, PDF)
  - Multiple KYC documents for directors/owners (PDF format).
  - From `businessDetails.kycDocumentsDirectorsOwners[]`.
  - **Format:** PDF (max 2MB per file)

- **data_privacy_policy_file_id** (`string`, PDF, optional)
  - File reference to uploaded Data Privacy Policy PDF.
  - From `businessDetails.dataPrivacyPolicy`.
  - **Format:** PDF (max 2MB)
  - Either PDF **or** website link can be supplied (backend should validate rules).

- **data_privacy_policy_website** (`string`, optional)
  - URL to the Data Privacy Policy page.
  - From `businessDetails.dataPrivacyPolicyWebsite`.
  - Either PDF **or** website link can be supplied (backend should validate rules).

- **information_security_policy_file_id** (`string`, PDF)
  - File reference for Information Security Policy PDF.
  - From `businessDetails.informationSecurityPolicy`.
  - **Format:** PDF (max 2MB)

---

## 3. Technical & Integration Details (Step 3)

### API Endpoint
- **Create/Update:** `POST /api/v1/technical`
- **Request Method:** POST
- **Content-Type:** application/json

### Purpose
Defines technical documentation, infrastructure setup, and technical points of contact.

### Suggested JSON Structure

```json
{
  "technical_and_integration_details": {
    "api_integration_details_file_id": "file_api.pdf",
    "data_schema_field_mapping_file_id": "file_schema.pdf",
    "data_flow_diagram_file_id": "file_dfd.pdf",
    "expected_transaction_volume_file_id": "file_volume.pdf",
    "infrastructure_overview": {
      "cloud_provider": "AWS",
      "server_region": "India",
      "ip_whitelisting": [
        "10.0.0.1",
        "10.0.0.2"
      ]
    },
    "technical_spoc_contacts": [
      {
        "name": "Rahul Sharma",
        "email": "rahul.sharma@acme.com",
        "phone": "+91-9876543210",
        "designation": "Engineering Manager"
      },
      {
        "name": "Priya Gupta",
        "email": "priya.gupta@acme.com",
        "phone": "+91-9876500000",
        "designation": "Tech Lead"
      }
    ]
  }
}
```

### Field Details

- **api_integration_details_file_id** (`string`, PDF)
  - API integration details PDF.
  - From `businessDetails.apiIntegrationDetails`.
  - **Format:** PDF (max 2MB)

- **data_schema_field_mapping_file_id** (`string`, PDF)
  - Data schema / field mapping PDF.
  - From `businessDetails.dataSchemaFieldMapping`.
  - **Format:** PDF (max 2MB)

- **data_flow_diagram_file_id** (`string`, PDF)
  - Data flow / architecture diagram PDF.
  - From `businessDetails.dataFlowDiagram`.
  - **Format:** PDF (max 2MB)

- **expected_transaction_volume_file_id** (`string`, PDF)
  - Expected transaction volume PDF.
  - From `businessDetails.expectedTransactionVolume`.
  - **Format:** PDF (max 2MB)

- **infrastructure_overview.cloud_provider** (`string`)
  - Cloud provider name (e.g. AWS, GCP, Azure, On-Prem).
  - From `businessDetails.infrastructureOverview.cloudProvider`.

- **infrastructure_overview.server_region** (`string`)
  - Selected region from the dropdown (e.g. India, EU, US, etc.).
  - From `businessDetails.infrastructureOverview.serverRegion`.

- **infrastructure_overview.ip_whitelisting** (`string[]`)
  - Up to 3 IP addresses that must be whitelisted.
  - From `businessDetails.infrastructureOverview.ipWhitelisting`.

- **technical_spoc_contacts** (`array`, max 10)
  - Technical Single Point of Contact details, from `businessDetails.technicalSPOCContacts`.
  - Each object:
    - **name** (`string`)
    - **email** (`string`)
    - **phone** (`string`)
    - **designation** (`string`)

---

## 4. Use Case & Access Control (Step 4)

### API Endpoint
- **Create/Update:** `POST /api/v1/usecase`
- **Request Method:** POST
- **Content-Type:** application/json

### Purpose
Captures business use case documentation, IAM details, and configured access roles.

### Suggested JSON Structure

```json
{
  "use_case_and_access_control": {
    "business_use_case_file_id": "file_usecase.pdf",
    "data_residency_requirement_file_id": "file_residency.pdf",
    "iam_details_file_id": "file_iam.pdf",
    "access_roles_matrix": [
      {
        "name": "Admin User",
        "email": "admin@acme.com",
        "phone": "+91-9000000000",
        "role": "superadmin"
      }
    ],
    "downstream_data_usage_file_id": "file_downstream.pdf"
  }
}
```

### Field Details

- **business_use_case_file_id** (`string`, PDF)
  - PDF describing primary business use cases.
  - From `businessDetails.businessUseCase`.
  - **Format:** PDF (max 2MB)

- **data_residency_requirement_file_id** (`string`, PDF)
  - PDF for data residency / localization requirements.
  - From `businessDetails.dataResidencyRequirement`.
  - **Format:** PDF (max 2MB)

- **iam_details_file_id** (`string`, PDF)
  - IAM (Identity and Access Management) details PDF.
  - From `businessDetails.iamDetails`.
  - **Format:** PDF (max 2MB)

- **access_roles_matrix** (`array`, currently single entry)
  - Configured access-role mapping for the organization.
  - Comes from the Access Roles Matrix dialog: `businessDetails.accessRolesMatrix`.
  - Each object:
    - **name** (`string`)
    - **email** (`string`)
    - **phone** (`string`)
    - **role** (`string`) – currently restricted to `"superadmin"` in UI.

- **downstream_data_usage_file_id** (`string`, PDF)
  - PDF describing all downstream data usage (partners, systems, etc.).
  - From `businessDetails.downstreamDataUsage`.
  - **Format:** PDF (max 2MB)

---

## 5. Authorization (Step 5)

### API Endpoint
- **Create/Update:** `POST /api/v1/authorization`
- **Request Method:** POST
- **Content-Type:** application/json

### Purpose
Defines final legal authorization documents and escalation matrix contacts.

### Suggested JSON Structure

```json
{
  "authorization": {
    "authorized_signatory_letter_file_id": "file_auth_letter.pdf",
    "nda_data_protection_agreement_file_id": "file_nda.pdf",
    "escalation_contacts": [
      {
        "name": "Support L1",
        "email": "support.l1@acme.com",
        "phone": "+91-9999000001",
        "designation": "Support Engineer"
      },
      {
        "name": "Support L2",
        "email": "support.l2@acme.com",
        "phone": "+91-9999000002",
        "designation": "Support Manager"
      }
    ]
  }
}
```

### Field Details

- **authorized_signatory_letter_file_id** (`string`, PDF)
  - File reference for the Authorized Signatory Letter PDF.
  - From `businessDetails.authorizedSignatoryLetter`.
  - **Format:** PDF (max 2MB)

- **nda_data_protection_agreement_file_id** (`string`, PDF)
  - File reference for NDA / Data Protection Agreement PDF.
  - From `businessDetails.ndaDataProtectionAgreement`.
  - **Format:** PDF (max 2MB)

- **escalation_contacts** (`array`, max 10)
  - Business/technical escalation contacts from `businessDetails.escalationContacts`.
  - Each object:
    - **name** (`string`)
    - **email** (`string`)
    - **phone** (`string`)
    - **designation** (`string`)

---

## Combined Payload (Create / Update Organization)

### API Endpoints

- **Create Organization:** `POST /api/v1/organizations`
- **Update Organization:** `PUT /api/v1/organizations/{organization_id}`

The backend exposes a single API endpoint that accepts all sections together:

**Request Body:**

```json
{
  "organization_id": "ORG_ABC12345",
  "organization_basic_information": { },
  "compliance_and_regulatory": { },
  "technical_and_integration_details": { },
  "use_case_and_access_control": { },
  "authorization": { }
}
```

Each inner object follows the structures defined in Sections 1–5 above.

**Response:**

```json
{
  "success": true,
  "message": "Organization created successfully",
  "data": {
    "organization_id": "ORG_ABC12345",
    "status": "pending"
  }
}
```

**Important Notes:**
- All document upload fields accept **PDF format only** (max 2MB per file).
- File IDs are returned after uploading files to a separate file upload endpoint.
- All field names use **snake_case** for backend compatibility.

---

## How to Generate a PDF

1. Open this markdown file (`docs/add-organization-api-payloads.md`) in your editor or a markdown viewer.
2. Use the editor or browser's **Print** / **Export as PDF** option to generate a PDF
   that you can share with backend or stakeholders.
