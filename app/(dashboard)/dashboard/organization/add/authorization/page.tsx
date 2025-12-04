"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, XCircle, X } from "lucide-react"
import { useOrganizationForm } from "../context"

export default function AuthorizationPage() {
  const {
    businessDetails,
    handleFileUpload,
    handleEscalationContactChange,
    handleAddEscalationContact,
    handleRemoveEscalationContact,
  } = useOrganizationForm()

  return (
    <div className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Authorization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="authorizedSignatoryLetter">Authorized Signatory Letter</Label>
            <div className="space-y-2">
              {businessDetails.authorizedSignatoryLetter ? (
                <div className="flex items-center gap-2 p-3 border rounded-md bg-background">
                  <FileText className="h-4 w-4 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {businessDetails.authorizedSignatoryLetter.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(businessDetails.authorizedSignatoryLetter.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleFileUpload("authorizedSignatoryLetter", null)}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label htmlFor="authorizedSignatoryLetter">
                  <div className="flex items-center justify-between w-full h-10 px-3 border border-input rounded-md cursor-pointer hover:bg-muted/50 transition-colors bg-background">
                    <span className="text-xs text-muted-foreground">Click to upload PDF (max 2MB)</span>
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                </label>
              )}
              <Input
                id="authorizedSignatoryLetter"
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  handleFileUpload("authorizedSignatoryLetter", file)
                }}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground">
                On merchant letterhead confirming authorization.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ndaDataProtectionAgreement">NDA / Data Protection Agreement</Label>
            <div className="space-y-2">
              {businessDetails.ndaDataProtectionAgreement ? (
                <div className="flex items-center gap-2 p-3 border rounded-md bg-background">
                  <FileText className="h-4 w-4 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {businessDetails.ndaDataProtectionAgreement.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(businessDetails.ndaDataProtectionAgreement.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleFileUpload("ndaDataProtectionAgreement", null)}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label htmlFor="ndaDataProtectionAgreement">
                  <div className="flex items-center justify-between w-full h-10 px-3 border border-input rounded-md cursor-pointer hover:bg-muted/50 transition-colors bg-background">
                    <span className="text-xs text-muted-foreground">Click to upload PDF (max 2MB)</span>
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                </label>
              )}
              <Input
                id="ndaDataProtectionAgreement"
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  handleFileUpload("ndaDataProtectionAgreement", file)
                }}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground">
                Signed with Securelytix or partner.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Escalation Matrix</Label>
                <p className="text-xs text-muted-foreground">
                  List of business and technical contacts for escalation (max 10).
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={handleAddEscalationContact}
                disabled={businessDetails.escalationContacts.length >= 10}
              >
                Add contact
              </Button>
            </div>

            <div className="space-y-3">
              {businessDetails.escalationContacts.map((contact, index) => (
                <div
                  key={index}
                  className="relative border rounded-md p-3 bg-background space-y-3"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold">L{index + 1}</span>
                    <button
                      type="button"
                      className="text-destructive hover:text-destructive/80"
                      onClick={() => handleRemoveEscalationContact(index)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor={`escalation-name-${index}`} className="text-xs">
                        Name
                      </Label>
                      <Input
                        id={`escalation-name-${index}`}
                        placeholder="Enter name"
                        className="text-xs h-9"
                        value={contact.name}
                        onChange={(e) => handleEscalationContactChange(index, "name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`escalation-email-${index}`} className="text-xs">
                        Email
                      </Label>
                      <Input
                        id={`escalation-email-${index}`}
                        type="email"
                        placeholder="Enter email"
                        className="text-xs h-9"
                        value={contact.email}
                        onChange={(e) => handleEscalationContactChange(index, "email", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`escalation-phone-${index}`} className="text-xs">
                        Phone
                      </Label>
                      <Input
                        id={`escalation-phone-${index}`}
                        type="tel"
                        placeholder="Enter phone"
                        className="text-xs h-9"
                        value={contact.phone}
                        onChange={(e) => handleEscalationContactChange(index, "phone", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`escalation-designation-${index}`} className="text-xs">
                        Designation
                      </Label>
                      <Input
                        id={`escalation-designation-${index}`}
                        placeholder="Enter designation"
                        className="text-xs h-9"
                        value={contact.designation}
                        onChange={(e) =>
                          handleEscalationContactChange(index, "designation", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

