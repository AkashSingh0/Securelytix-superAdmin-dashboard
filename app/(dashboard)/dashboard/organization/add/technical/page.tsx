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
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Upload, FileText, XCircle, X } from "lucide-react"
import { useOrganizationForm } from "../context"

export default function TechnicalPage() {
  const {
    businessDetails,
    handleBusinessDetailsChange,
    handleFileUpload,
    handleInfrastructureChange,
    handleAddIpWhitelist,
    handleRemoveIpWhitelist,
    handleRemoveTechnicalSPOCContact,
    handleAddTechnicalSPOC,
    isSPOCDialogOpen,
    setIsSPOCDialogOpen,
    newTechnicalSPOC,
    setNewTechnicalSPOC,
    setBusinessDetails,
  } = useOrganizationForm()

  return (
    <div className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Technical & Integration Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="apiIntegrationDetails">API Integration Details</Label>
            <div className="space-y-2">
              {businessDetails.apiIntegrationDetails ? (
                <div className="flex items-center gap-2 p-3 border rounded-md bg-background">
                  <FileText className="h-4 w-4 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{businessDetails.apiIntegrationDetails.name}</p>
                    <p className="text-xs text-muted-foreground">{(businessDetails.apiIntegrationDetails.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleFileUpload("apiIntegrationDetails", null)}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label htmlFor="apiIntegrationDetails">
                  <div className="flex items-center justify-between w-full h-10 px-3 border border-input rounded-md cursor-pointer hover:bg-muted/50 transition-colors bg-background">
                    <span className="text-xs text-muted-foreground">Click to upload PDF (max 2MB)</span>
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                </label>
              )}
              <Input
                id="apiIntegrationDetails"
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  handleFileUpload("apiIntegrationDetails", file)
                }}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground">This should include API endpoints, OpenAPI Swagger Doc, authentication method, and Test Environment (if applicable).</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataSchemaFieldMapping">Data Schema / Field Mapping</Label>
            <div className="space-y-2">
              {businessDetails.dataSchemaFieldMapping ? (
                <div className="flex items-center gap-2 p-3 border rounded-md bg-background">
                  <FileText className="h-4 w-4 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{businessDetails.dataSchemaFieldMapping.name}</p>
                    <p className="text-xs text-muted-foreground">{(businessDetails.dataSchemaFieldMapping.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleFileUpload("dataSchemaFieldMapping", null)}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label htmlFor="dataSchemaFieldMapping">
                  <div className="flex items-center justify-between w-full h-10 px-3 border border-input rounded-md cursor-pointer hover:bg-muted/50 transition-colors bg-background">
                    <span className="text-xs text-muted-foreground">Click to upload PDF (max 2MB)</span>
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                </label>
              )}
              <Input
                id="dataSchemaFieldMapping"
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  handleFileUpload("dataSchemaFieldMapping", file)
                }}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground">This specifies what data fields will be vaulted (e.g., PAN, email, mobile).</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataFlowDiagram">Data Flow Diagram</Label>
            <div className="space-y-2">
              {businessDetails.dataFlowDiagram ? (
                <div className="flex items-center gap-2 p-3 border rounded-md bg-background">
                  <FileText className="h-4 w-4 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{businessDetails.dataFlowDiagram.name}</p>
                    <p className="text-xs text-muted-foreground">{(businessDetails.dataFlowDiagram.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleFileUpload("dataFlowDiagram", null)}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label htmlFor="dataFlowDiagram">
                  <div className="flex items-center justify-between w-full h-10 px-3 border border-input rounded-md cursor-pointer hover:bg-muted/50 transition-colors bg-background">
                    <span className="text-xs text-muted-foreground">Click to upload PDF (max 2MB)</span>
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                </label>
              )}
              <Input
                id="dataFlowDiagram"
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  handleFileUpload("dataFlowDiagram", file)
                }}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground">This is a diagram showing data capture, vault storage, and access points.</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedTransactionVolume">Expected Transaction Volume</Label>
            <div className="space-y-2">
              {businessDetails.expectedTransactionVolume ? (
                <div className="flex items-center gap-2 p-3 border rounded-md bg-background">
                  <FileText className="h-4 w-4 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{businessDetails.expectedTransactionVolume.name}</p>
                    <p className="text-xs text-muted-foreground">{(businessDetails.expectedTransactionVolume.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleFileUpload("expectedTransactionVolume", null)}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label htmlFor="expectedTransactionVolume">
                  <div className="flex items-center justify-between w-full h-10 px-3 border border-input rounded-md cursor-pointer hover:bg-muted/50 transition-colors bg-background">
                    <span className="text-xs text-muted-foreground">Click to upload PDF (max 2MB)</span>
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                </label>
              )}
              <Input
                id="expectedTransactionVolume"
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  handleFileUpload("expectedTransactionVolume", file)
                }}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground">This refers to estimated daily/monthly API or data records.</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Infrastructure Overview</Label>
            <div className="space-y-3 p-4 border rounded-md bg-background">
              <div className="space-y-1">
                <Label htmlFor="cloudProvider" className="text-xs">
                  Cloud provider <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="cloudProvider"
                  placeholder="e.g. AWS, Azure, GCP"
                  className="text-xs h-9"
                  value={businessDetails.infrastructureOverview.cloudProvider}
                  onChange={(e) =>
                    handleInfrastructureChange("cloudProvider", e.target.value)
                  }
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="serverRegion" className="text-xs">
                  Server region <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={businessDetails.infrastructureOverview.serverRegion}
                  onValueChange={(value) => handleInfrastructureChange("serverRegion", value)}
                >
                  <SelectTrigger id="serverRegion" className="text-xs h-9">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="india">India</SelectItem>
                    <SelectItem value="uae">UAE</SelectItem>
                    <SelectItem value="singapore">Singapore</SelectItem>
                    <SelectItem value="us-east">US East</SelectItem>
                    <SelectItem value="us-west">US West</SelectItem>
                    <SelectItem value="europe-west">Europe West</SelectItem>
                    <SelectItem value="europe-north">Europe North</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="australia">Australia</SelectItem>
                    <SelectItem value="japan">Japan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ipWhitelistingInput" className="text-xs">
                  IP whitelisting (max 3) <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="ipWhitelistingInput"
                    placeholder="Enter IP address and press Enter"
                    className="text-xs h-9"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        const target = e.target as HTMLInputElement
                        const value = target.value.trim()
                        if (value) {
                          handleAddIpWhitelist(value)
                          target.value = ""
                        }
                      }
                    }}
                  />
                </div>
                {businessDetails.infrastructureOverview.ipWhitelisting.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {businessDetails.infrastructureOverview.ipWhitelisting.map((ip) => (
                      <Badge
                        key={ip}
                        variant="outline"
                        className="flex items-center gap-1 text-xs"
                      >
                        {ip}
                        <button
                          type="button"
                          onClick={() => handleRemoveIpWhitelist(ip)}
                          className="ml-1 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Specify cloud provider, hosting region, and up to 3 IPs to whitelist.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Technical SPOC Details</Label>
            <Dialog open={isSPOCDialogOpen} onOpenChange={setIsSPOCDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-10 justify-start text-left font-normal"
                >
                  {businessDetails.technicalSPOCContacts.length > 0 &&
                  (businessDetails.technicalSPOCContacts[0].name ||
                    businessDetails.technicalSPOCContacts[0].email ||
                    businessDetails.technicalSPOCContacts[0].phone ||
                    businessDetails.technicalSPOCContacts[0].designation)
                    ? `${businessDetails.technicalSPOCContacts[0].name || "N/A"} | ${
                        businessDetails.technicalSPOCContacts[0].email || "N/A"
                      } | ${businessDetails.technicalSPOCContacts[0].phone || "N/A"} | ${
                        businessDetails.technicalSPOCContacts[0].designation || "N/A"
                      }`
                    : "Click to add Technical SPOC Details"}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Technical SPOC Details</DialogTitle>
                  <DialogDescription>
                    Enter the name, email, phone, and designation of technical contact.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-3">
                    <Label className="text-sm">Add technical contact</Label>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label htmlFor="new-spoc-name" className="text-xs">
                          Name
                        </Label>
                        <Input
                          id="new-spoc-name"
                          placeholder="Enter name"
                          className="text-xs h-9"
                          value={newTechnicalSPOC.name}
                          onChange={(e) =>
                            setNewTechnicalSPOC({ ...newTechnicalSPOC, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="new-spoc-email" className="text-xs">
                          Email
                        </Label>
                        <Input
                          id="new-spoc-email"
                          type="email"
                          placeholder="Enter email"
                          className="text-xs h-9"
                          value={newTechnicalSPOC.email}
                          onChange={(e) =>
                            setNewTechnicalSPOC({ ...newTechnicalSPOC, email: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="new-spoc-phone" className="text-xs">
                          Phone
                        </Label>
                        <Input
                          id="new-spoc-phone"
                          type="tel"
                          placeholder="Enter phone"
                          className="text-xs h-9"
                          value={newTechnicalSPOC.phone}
                          onChange={(e) =>
                            setNewTechnicalSPOC({ ...newTechnicalSPOC, phone: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="new-spoc-designation" className="text-xs">
                          Designation
                        </Label>
                        <Input
                          id="new-spoc-designation"
                          placeholder="Enter designation"
                          className="text-xs h-9"
                          value={newTechnicalSPOC.designation}
                          onChange={(e) =>
                            setNewTechnicalSPOC({
                              ...newTechnicalSPOC,
                              designation: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                    {businessDetails.technicalSPOCContacts.map((contact, index) => (
                      <div
                        key={index}
                        className="relative border rounded-md p-3 bg-background space-y-2"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold">L{index + 1}</span>
                          <button
                            type="button"
                            className="text-destructive hover:text-destructive/80"
                            onClick={() => handleRemoveTechnicalSPOCContact(index)}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs">
                          <div>
                            <div className="font-medium">Name</div>
                            <div className="text-muted-foreground break-words">
                              {contact.name || "N/A"}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">Email</div>
                            <div className="text-muted-foreground break-words">
                              {contact.email || "N/A"}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">Phone</div>
                            <div className="text-muted-foreground break-words">
                              {contact.phone || "N/A"}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">Designation</div>
                            <div className="text-muted-foreground break-words">
                              {contact.designation || "N/A"}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsSPOCDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      handleAddTechnicalSPOC()
                      setIsSPOCDialogOpen(false)
                    }}
                    disabled={businessDetails.technicalSPOCContacts.length >= 10}
                  >
                    Add
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <p className="text-xs text-muted-foreground">Name, email, and phone of technical contact</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

