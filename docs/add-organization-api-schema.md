## Add New Organization – API Data Schema

This document describes the **data schema** for the Create / Update Organization APIs,
based on the 5-step “Add New Organization” flow.

The examples below use an **OpenAPI-style** schema (YAML-like), but you can adapt them to
JSON Schema or any backend framework.

---

## 1. Top-level Request Schema

### `OrganizationPayload`

```yaml
OrganizationPayload:
  type: object
  required:
    - organizationId
    - organizationBasicInformation
    - complianceAndRegulatory
    - technicalAndIntegrationDetails
    - useCaseAndAccessControl
    - authorization
  properties:
    organizationId:
      type: string
      description: Frontend-generated organization ID (e.g. ORG_XXXXXX) or server-generated
    organizationBasicInformation:
      $ref: '#/components/schemas/OrganizationBasicInformation'
    complianceAndRegulatory:
      $ref: '#/components/schemas/ComplianceAndRegulatory'
    technicalAndIntegrationDetails:
      $ref: '#/components/schemas/TechnicalAndIntegrationDetails'
    useCaseAndAccessControl:
      $ref: '#/components/schemas/UseCaseAndAccessControl'
    authorization:
      $ref: '#/components/schemas/Authorization'
```

---

## 2. Organization Basic Information (Step 1)

### Schema: `OrganizationBasicInformation`

```yaml
OrganizationBasicInformation:
  type: object
  required:
    - legalEntityName
    - registeredAddress
    - businessType
  properties:
    organizationId:
      type: string
      description: Optional if generated server side; otherwise matches top-level organizationId
    legalEntityName:
      type: string
      description: Legal name of the organization
    registeredAddress:
      type: string
      description: Full registered address of the entity
    businessType:
      type: string
      description: Business category (e.g. Payment Aggregator, NBFC, etc.)
    registrationCertificateFileId:
      type: string
      nullable: true
      description: File ID for Registration Certificate PDF
    panTaxIdFileId:
      type: string
      nullable: true
      description: File ID for PAN / Tax ID PDF
    gstVatCertificateFileId:
      type: string
      nullable: true
      description: File ID for GST / VAT certificate PDF
    authorizedSignatoryIdProofFileIds:
      type: array
      description: IDs of uploaded signatory ID proof documents
      items:
        type: string
```

---

## 3. Compliance & Regulatory Documents (Step 2)

### Schema: `ComplianceAndRegulatory`

```yaml
ComplianceAndRegulatory:
  type: object
  properties:
    kycDocumentsDirectorsOwnersFileIds:
      type: array
      description: KYC docs for each director/owner
      items:
        type: string
    dataPrivacyPolicyFileId:
      type: string
      nullable: true
      description: PDF file ID (optional if website is used)
    dataPrivacyPolicyWebsite:
      type: string
      format: uri
      nullable: true
      description: Website link for privacy policy
    informationSecurityPolicyFileId:
      type: string
      nullable: true
      description: File ID for Information Security Policy PDF
```

> Business rule suggestion: enforce at least one of `dataPrivacyPolicyFileId` or
> `dataPrivacyPolicyWebsite` on the backend.

---

## 4. Technical & Integration Details (Step 3)

### Schema: `TechnicalAndIntegrationDetails`

```yaml
TechnicalAndIntegrationDetails:
  type: object
  properties:
    apiIntegrationDetailsFileId:
      type: string
      nullable: true
      description: API integration details PDF
    dataSchemaFieldMappingFileId:
      type: string
      nullable: true
      description: Data schema / field mapping PDF
    dataFlowDiagramFileId:
      type: string
      nullable: true
      description: Data flow / architecture diagram PDF
    expectedTransactionVolumeFileId:
      type: string
      nullable: true
      description: Expected transaction volume PDF
    infrastructureOverview:
      $ref: '#/components/schemas/InfrastructureOverview'
    technicalSPOCContacts:
      type: array
      maxItems: 10
      description: List of technical Single Points of Contact (max 10)
      items:
        $ref: '#/components/schemas/TechnicalSPOCContact'
```

### Schema: `InfrastructureOverview`

```yaml
InfrastructureOverview:
  type: object
  required:
    - cloudProvider
    - serverRegion
  properties:
    cloudProvider:
      type: string
      description: Cloud provider name (AWS, GCP, Azure, On-Prem, etc.)
    serverRegion:
      type: string
      description: Selected hosting region (India, EU, US, etc.)
    ipWhitelisting:
      type: array
      maxItems: 3
      description: IP addresses to whitelist (max 3)
      items:
        type: string
        pattern: '^([0-9]{1,3}\.){3}[0-9]{1,3}$'
        description: IPv4 address
```

### Schema: `TechnicalSPOCContact`

```yaml
TechnicalSPOCContact:
  type: object
  required:
    - name
    - email
  properties:
    name:
      type: string
    email:
      type: string
      format: email
    phone:
      type: string
    designation:
      type: string
```

---

## 5. Use Case & Access Control (Step 4)

### Schema: `UseCaseAndAccessControl`

```yaml
UseCaseAndAccessControl:
  type: object
  properties:
    businessUseCaseFileId:
      type: string
      nullable: true
      description: Business use case PDF
    dataResidencyRequirementFileId:
      type: string
      nullable: true
      description: Data residency / localization requirements PDF
    iamDetailsFileId:
      type: string
      nullable: true
      description: IAM (Identity and Access Management) details PDF
    accessRolesMatrix:
      type: array
      maxItems: 1
      description: Configured access role (currently single Superadmin)
      items:
        $ref: '#/components/schemas/AccessRoleEntry'
    downstreamDataUsageFileId:
      type: string
      nullable: true
      description: Downstream data usage PDF
```

### Schema: `AccessRoleEntry`

```yaml
AccessRoleEntry:
  type: object
  required:
    - name
    - email
    - role
  properties:
    name:
      type: string
    email:
      type: string
      format: email
    phone:
      type: string
    role:
      type: string
      enum: [superadmin]
      description: Currently only Superadmin is supported
```

---

## 6. Authorization (Step 5)

### Schema: `Authorization`

```yaml
Authorization:
  type: object
  properties:
    authorizedSignatoryLetterFileId:
      type: string
      nullable: true
      description: File ID for the Authorized Signatory Letter PDF
    ndaDataProtectionAgreementFileId:
      type: string
      nullable: true
      description: File ID for NDA / Data Protection Agreement PDF
    escalationContacts:
      type: array
      maxItems: 10
      description: Escalation matrix contacts (L1, L2, etc.)
      items:
        $ref: '#/components/schemas/EscalationContact'
```

### Schema: `EscalationContact`

```yaml
EscalationContact:
  type: object
  required:
    - name
    - email
  properties:
    name:
      type: string
    email:
      type: string
      format: email
    phone:
      type: string
    designation:
      type: string
```

---

## 7. Example OpenAPI Request Body Definition

You can wire the schemas above into an OpenAPI path like this:

```yaml
paths:
  /organizations:
    post:
      summary: Create organization
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/OrganizationPayload'
      responses:
        '201':
          description: Organization created
```

---

## 8. How to Export This Schema as PDF

1. Open `docs/add-organization-api-schema.md` in your editor or markdown viewer.
2. Use **Print** / **Export as PDF** (for example, in VS Code: "Open Preview" → right-click → "Print" → **Save as PDF**).
3. Share the generated PDF with backend engineers as the **data contract** for the Add / Edit Organization APIs.


