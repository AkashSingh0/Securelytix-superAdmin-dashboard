"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Upload, FileText, XCircle } from "lucide-react"
import { useOrganizationForm } from "../context"

export default function BasicInfoPage() {
  const {
    businessDetails,
    handleBusinessDetailsChange,
    handleFileUpload,
    setBusinessDetails,
  } = useOrganizationForm()

  return (
    <div className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Organization Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="legalEntityName">
              Legal Entity Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="legalEntityName"
              placeholder="Registered name as per business registration"
              value={businessDetails.legalEntityName}
              onChange={(e) => handleBusinessDetailsChange("legalEntityName", e.target.value)}
              className="text-xs h-9"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="registeredAddress">
              Registered Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="registeredAddress"
              placeholder="Full office address (with PIN/ZIP code)"
              value={businessDetails.registeredAddress}
              onChange={(e) => handleBusinessDetailsChange("registeredAddress", e.target.value)}
              className="text-xs h-9"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessType">
              Business Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={businessDetails.businessType}
              onValueChange={(value) => handleBusinessDetailsChange("businessType", value)}
            >
              <SelectTrigger className="text-xs h-9">
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pvt-ltd">Pvt Ltd</SelectItem>
                <SelectItem value="llp">LLP</SelectItem>
                <SelectItem value="sole-proprietor">Sole Proprietor</SelectItem>
                <SelectItem value="partnership">Partnership</SelectItem>
                <SelectItem value="proprietor-firm">Proprietor Firm</SelectItem>
                <SelectItem value="franchise">Franchise</SelectItem>
                <SelectItem value="subsidiary-company">Subsidiary Company</SelectItem>
                <SelectItem value="government-organization">Government Organization</SelectItem>
                <SelectItem value="msme">MSME / Small Business</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="registrationCertificate">Registration Certificate / Incorporation Proof</Label>
            <div className="space-y-2">
              {businessDetails.registrationCertificate ? (
                <div className="flex items-center gap-2 p-3 border rounded-md bg-background">
                  <FileText className="h-4 w-4 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{businessDetails.registrationCertificate.name}</p>
                    <p className="text-xs text-muted-foreground">{(businessDetails.registrationCertificate.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleFileUpload("registrationCertificate", null)}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label htmlFor="registrationCertificate">
                  <div className="flex items-center justify-between w-full h-10 px-3 border border-input rounded-md cursor-pointer hover:bg-muted/50 transition-colors bg-background">
                    <span className="text-xs text-muted-foreground">Click to upload PDF (max 2MB)</span>
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                </label>
              )}
              <Input
                id="registrationCertificate"
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  handleFileUpload("registrationCertificate", file)
                }}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground">Govt-issued document (ROC Certificate, MOA, etc.)</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="panTaxId">PAN / Tax ID</Label>
            <div className="space-y-2">
              {businessDetails.panTaxId ? (
                <div className="flex items-center gap-2 p-3 border rounded-md bg-background">
                  <FileText className="h-4 w-4 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{businessDetails.panTaxId.name}</p>
                    <p className="text-xs text-muted-foreground">{(businessDetails.panTaxId.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleFileUpload("panTaxId", null)}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label htmlFor="panTaxId">
                  <div className="flex items-center justify-between w-full h-10 px-3 border border-input rounded-md cursor-pointer hover:bg-muted/50 transition-colors bg-background">
                    <span className="text-xs text-muted-foreground">Click to upload PDF (max 2MB)</span>
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                </label>
              )}
              <Input
                id="panTaxId"
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  handleFileUpload("panTaxId", file)
                }}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground">For tax verification (PAN in India, EIN/VAT abroad)</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gstVatCertificate">GST / VAT Certificate</Label>
            <div className="space-y-2">
              {businessDetails.gstVatCertificate ? (
                <div className="flex items-center gap-2 p-3 border rounded-md bg-background">
                  <FileText className="h-4 w-4 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{businessDetails.gstVatCertificate.name}</p>
                    <p className="text-xs text-muted-foreground">{(businessDetails.gstVatCertificate.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleFileUpload("gstVatCertificate", null)}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label htmlFor="gstVatCertificate">
                  <div className="flex items-center justify-between w-full h-10 px-3 border border-input rounded-md cursor-pointer hover:bg-muted/50 transition-colors bg-background">
                    <span className="text-xs text-muted-foreground">Click to upload PDF (max 2MB)</span>
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                </label>
              )}
              <Input
                id="gstVatCertificate"
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  handleFileUpload("gstVatCertificate", file)
                }}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground">For invoicing and compliance</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="authorizedSignatoryIdProof">Authorized Signatory ID Proof</Label>
            <div className="space-y-2">
              {businessDetails.authorizedSignatoryIdProof.length > 0 && (
                <div className="space-y-2">
                  {businessDetails.authorizedSignatoryIdProof.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 border rounded-md bg-background"
                    >
                      <FileText className="h-4 w-4 text-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setBusinessDetails((prev) => {
                            const updated = [...prev.authorizedSignatoryIdProof]
                            updated.splice(index, 1)
                            return { ...prev, authorizedSignatoryIdProof: updated }
                          })
                        }}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <label htmlFor="authorizedSignatoryIdProof">
                <div className="flex items-center justify-between w-full h-10 px-3 border border-input rounded-md cursor-pointer hover:bg-muted/50 transition-colors bg-background">
                  <span className="text-xs text-muted-foreground">
                    Click to upload PDF (max 2MB)
                  </span>
                  <Upload className="h-4 w-4 text-muted-foreground" />
                </div>
              </label>

              <Input
                id="authorizedSignatoryIdProof"
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  handleFileUpload("authorizedSignatoryIdProof", file)
                }}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground">
                Passport / Aadhaar / Government ID. You may upload multiple documents.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

