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

export default function UseCasePage() {
  const {
    businessDetails,
    handleFileUpload,
    handleAddAccessRole,
    handleRemoveAccessRole,
    isAccessRolesDialogOpen,
    setIsAccessRolesDialogOpen,
    newAccessRole,
    setNewAccessRole,
  } = useOrganizationForm()

  return (
    <div className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Use Case & Access Control</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="businessUseCase">Business Use Case</Label>
            <div className="space-y-2">
              {businessDetails.businessUseCase ? (
                <div className="flex items-center gap-2 p-3 border rounded-md bg-background">
                  <FileText className="h-4 w-4 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{businessDetails.businessUseCase.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(businessDetails.businessUseCase.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleFileUpload("businessUseCase", null)}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label htmlFor="businessUseCase">
                  <div className="flex items-center justify-between w-full h-10 px-3 border border-input rounded-md cursor-pointer hover:bg-muted/50 transition-colors bg-background">
                    <span className="text-xs text-muted-foreground">Click to upload PDF (max 2MB)</span>
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                </label>
              )}
              <Input
                id="businessUseCase"
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  handleFileUpload("businessUseCase", file)
                }}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground">
                Describe how the Vault will be used (e.g., store PII, tokenize PANs) or Customer Journey for
                protection.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataResidencyRequirement">Data Residency Requirement</Label>
            <div className="space-y-2">
              {businessDetails.dataResidencyRequirement ? (
                <div className="flex items-center gap-2 p-3 border rounded-md bg-background">
                  <FileText className="h-4 w-4 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{businessDetails.dataResidencyRequirement.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(businessDetails.dataResidencyRequirement.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleFileUpload("dataResidencyRequirement", null)}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label htmlFor="dataResidencyRequirement">
                  <div className="flex items-center justify-between w-full h-10 px-3 border border-input rounded-md cursor-pointer hover:bg-muted/50 transition-colors bg-background">
                    <span className="text-xs text-muted-foreground">Click to upload PDF (max 2MB)</span>
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                </label>
              )}
              <Input
                id="dataResidencyRequirement"
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  handleFileUpload("dataResidencyRequirement", file)
                }}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground">
                If data must be stored in a specific region (e.g., India, UAE).
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="iamDetails">IAM Details</Label>
            <div className="space-y-2">
              {businessDetails.iamDetails ? (
                <div className="flex items-center gap-2 p-3 border rounded-md bg-background">
                  <FileText className="h-4 w-4 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{businessDetails.iamDetails.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(businessDetails.iamDetails.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleFileUpload("iamDetails", null)}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label htmlFor="iamDetails">
                  <div className="flex items-center justify-between w-full h-10 px-3 border border-input rounded-md cursor-pointer hover:bg-muted/50 transition-colors bg-background">
                    <span className="text-xs text-muted-foreground">Click to upload PDF (max 2MB)</span>
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                </label>
              )}
              <Input
                id="iamDetails"
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  handleFileUpload("iamDetails", file)
                }}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground">
                GCP, AWS, Azure etc and service account details for Securelytix.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accessRolesMatrix">Access Roles Matrix</Label>
            <Dialog open={isAccessRolesDialogOpen} onOpenChange={setIsAccessRolesDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-10 justify-start text-left font-normal"
                >
                  {businessDetails.accessRolesMatrix.length > 0
                    ? "Role matrix is added"
                    : "Click to configure access role"}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Access Roles Matrix</DialogTitle>
                  <DialogDescription>
                    Add contacts and assign their access role for this organization.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-3">
                    <Label className="text-sm">Add access role</Label>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label htmlFor="new-access-role-name" className="text-xs">
                          Name
                        </Label>
                        <Input
                          id="new-access-role-name"
                          placeholder="Enter name"
                          className="text-xs h-9"
                          value={newAccessRole.name}
                          onChange={(e) =>
                            setNewAccessRole({ ...newAccessRole, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="new-access-role-email" className="text-xs">
                          Email
                        </Label>
                        <Input
                          id="new-access-role-email"
                          type="email"
                          placeholder="Enter email"
                          className="text-xs h-9"
                          value={newAccessRole.email}
                          onChange={(e) =>
                            setNewAccessRole({
                              ...newAccessRole,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="new-access-role-phone" className="text-xs">
                          Phone
                        </Label>
                        <Input
                          id="new-access-role-phone"
                          type="tel"
                          placeholder="Enter phone"
                          className="text-xs h-9"
                          value={newAccessRole.phone}
                          onChange={(e) =>
                            setNewAccessRole({
                              ...newAccessRole,
                              phone: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="new-access-role-role" className="text-xs">
                          Role
                        </Label>
                        <Select
                          value={newAccessRole.role}
                          onValueChange={(value) =>
                            setNewAccessRole({ ...newAccessRole, role: value })
                          }
                        >
                          <SelectTrigger
                            id="new-access-role-role"
                            className="text-xs h-9"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="superadmin">Superadmin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                    {businessDetails.accessRolesMatrix.map((roleEntry, index) => (
                      <div
                        key={index}
                        className="relative border rounded-md p-3 bg-background space-y-2"
                      >
                        <div className="flex items-center justify-end">
                          <button
                            type="button"
                            className="text-destructive hover:text-destructive/80"
                            onClick={handleRemoveAccessRole}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs">
                          <div className="md:col-span-1">
                            <span className="font-medium">Name:</span> {roleEntry.name || "—"}
                          </div>
                          <div className="md:col-span-1 break-words">
                            <span className="font-medium">Email:</span>{" "}
                            {roleEntry.email || "—"}
                          </div>
                          <div className="md:col-span-1">
                            <span className="font-medium">Phone:</span>{" "}
                            {roleEntry.phone || "—"}
                          </div>
                          <div className="md:col-span-1">
                            <span className="font-medium">Role:</span>{" "}
                            {roleEntry.role || "superadmin"}
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
                    onClick={() => setIsAccessRolesDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      handleAddAccessRole()
                      setIsAccessRolesDialogOpen(false)
                    }}
                  >
                    Add
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <p className="text-xs text-muted-foreground">
              Define who can access what data and their role (currently only Superadmin is
              available).
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="downstreamDataUsage">Downstream Data Usage</Label>
            <div className="space-y-2">
              {businessDetails.downstreamDataUsage ? (
                <div className="flex items-center gap-2 p-3 border rounded-md bg-background">
                  <FileText className="h-4 w-4 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{businessDetails.downstreamDataUsage.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(businessDetails.downstreamDataUsage.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleFileUpload("downstreamDataUsage", null)}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label htmlFor="downstreamDataUsage">
                  <div className="flex items-center justify-between w-full h-10 px-3 border border-input rounded-md cursor-pointer hover:bg-muted/50 transition-colors bg-background">
                    <span className="text-xs text-muted-foreground">Click to upload PDF (max 2MB)</span>
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                </label>
              )}
              <Input
                id="downstreamDataUsage"
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  handleFileUpload("downstreamDataUsage", file)
                }}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground">
                List of third-party systems or partners that will consume tokenized data and will perform
                detokenization.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

