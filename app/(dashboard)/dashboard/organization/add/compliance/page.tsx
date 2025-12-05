"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, XCircle } from "lucide-react"
import { useOrganizationForm } from "../context"

export default function CompliancePage() {
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
          <CardTitle>Compliance & Regulatory Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="kycDocumentsDirectorsOwners">
              KYC Documents of Directors/Owners (One)
            </Label>
            <div className="space-y-2">
              {businessDetails.kycDocumentsDirectorsOwners.length > 0 && (
                <div className="space-y-2">
                  {businessDetails.kycDocumentsDirectorsOwners.map((file, index) => (
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
                            const updated = [...prev.kycDocumentsDirectorsOwners]
                            updated.splice(index, 1)
                            return { ...prev, kycDocumentsDirectorsOwners: updated }
                          })
                        }}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <label htmlFor="kycDocumentsDirectorsOwners">
                <div className="flex items-center justify-between w-full h-10 px-3 border border-input rounded-md cursor-pointer hover:bg-muted/50 transition-colors bg-background">
                  <span className="text-xs text-muted-foreground">
                    Click to upload PDF (max 2MB)
                  </span>
                  <Upload className="h-4 w-4 text-muted-foreground" />
                </div>
              </label>

              <Input
                id="kycDocumentsDirectorsOwners"
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  handleFileUpload("kycDocumentsDirectorsOwners", file)
                }}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground">
                PAN, Aadhaar, or Passport copies. You may upload multiple documents.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataPrivacyPolicy">
              Data Privacy Policy <span className="text-destructive">*</span>
            </Label>
            <p className="text-xs text-muted-foreground">
              Provide your data privacy policy as a PDF document <span className="font-semibold">or</span> a
              website link.
            </p>
            <div className="space-y-4">
              {/* Option 1: Upload PDF */}
              <div className="space-y-2">
                {businessDetails.dataPrivacyPolicy ? (
                  <div className="flex items-center gap-2 p-3 border rounded-md bg-background">
                    <FileText className="h-4 w-4 text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {businessDetails.dataPrivacyPolicy.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(businessDetails.dataPrivacyPolicy.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleFileUpload("dataPrivacyPolicy", null)}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label htmlFor="dataPrivacyPolicy">
                    <div className="flex items-center justify-between w-full h-10 px-3 border border-input rounded-md cursor-pointer hover:bg-muted/50 transition-colors bg-background">
                      <span className="text-xs text-muted-foreground">
                        Click to upload PDF (max 2MB)
                      </span>
                      <Upload className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </label>
                )}
                <Input
                  id="dataPrivacyPolicy"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    handleFileUpload("dataPrivacyPolicy", file)
                  }}
                  className="hidden"
                />
              </div>

              {/* OR divider */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex-1 border-t border-border" />
                <span>OR</span>
                <div className="flex-1 border-t border-border" />
              </div>

              {/* Option 2: Website link */}
              <div className="space-y-2">
                <Label htmlFor="dataPrivacyPolicyWebsite" className="text-xs">
                  Data Privacy Policy Website Link
                </Label>
                <Input
                  id="dataPrivacyPolicyWebsite"
                  type="url"
                  placeholder="https://example.com/privacy-policy"
                  value={businessDetails.dataPrivacyPolicyWebsite}
                  onChange={(e) =>
                    handleBusinessDetailsChange("dataPrivacyPolicyWebsite", e.target.value)
                  }
                  className="text-xs h-9"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="informationSecurityPolicy">
              Information Security Policy <span className="text-destructive">*</span>
            </Label>
            <div className="space-y-2">
              {businessDetails.informationSecurityPolicy ? (
                <div className="flex items-center gap-2 p-3 border rounded-md bg-background">
                  <FileText className="h-4 w-4 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{businessDetails.informationSecurityPolicy.name}</p>
                    <p className="text-xs text-muted-foreground">{(businessDetails.informationSecurityPolicy.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleFileUpload("informationSecurityPolicy", null)}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label htmlFor="informationSecurityPolicy">
                  <div className="flex items-center justify-between w-full h-10 px-3 border border-input rounded-md cursor-pointer hover:bg-muted/50 transition-colors bg-background">
                    <span className="text-xs text-muted-foreground">Click to upload PDF (max 2MB)</span>
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                </label>
              )}
              <Input
                id="informationSecurityPolicy"
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  handleFileUpload("informationSecurityPolicy", file)
                }}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground">Summary of internal data protection controls required. Checklist</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

