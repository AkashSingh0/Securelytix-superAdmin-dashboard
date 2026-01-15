"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FileUpload } from "@/components/ui/file-upload"
import { Badge } from "@/components/ui/badge"
import {
  X,
  Plus,
  Building2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react"
import {
  organizationFormSchema,
  organizationEditSchema,
  organizationFormDefaults,
  legalTypeOptions,
  cloudProviderOptions,
  serverRegionOptions,
  type OrganizationFormData,
  type OrganizationEditData,
} from "@/lib/schemas/organization.schema"
import { createOrganization, updateOrganization } from "@/lib/api/organization"

interface OrganizationFormProps {
  mode: "create" | "edit"
  organizationId?: string
  initialData?: Partial<OrganizationEditData>
  existingFiles?: {
    gstVat?: string | null
    panTax?: string | null
    authLetter?: string | null
  }
}

export function OrganizationForm({
  mode,
  organizationId,
  initialData,
  existingFiles,
}: OrganizationFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [submitError, setSubmitError] = useState("")
  const [newIp, setNewIp] = useState("")
  const [ipError, setIpError] = useState("")

  const isEditMode = mode === "edit"
  const schema = isEditMode ? organizationEditSchema : organizationFormSchema

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OrganizationFormData | OrganizationEditData>({
    // @ts-expect-error - Conditional schema resolver types are incompatible
    resolver: zodResolver(schema),
    defaultValues: {
      ...organizationFormDefaults,
      ...initialData,
    },
  })

  const ipWhitelisting = watch("ipWhitelisting") || []

  const handleAddIp = () => {
    if (!newIp.trim()) return

    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/
    if (!ipPattern.test(newIp.trim())) {
      setIpError("Please enter a valid IP address")
      return
    }

    if (ipWhitelisting.includes(newIp.trim())) {
      setIpError("This IP address is already added")
      return
    }

    if (ipWhitelisting.length >= 5) {
      setIpError("Maximum 5 IP addresses allowed")
      return
    }

    setValue("ipWhitelisting", [...ipWhitelisting, newIp.trim()])
    setNewIp("")
    setIpError("")
  }

  const handleRemoveIp = (ip: string) => {
    setValue(
      "ipWhitelisting",
      ipWhitelisting.filter((i) => i !== ip)
    )
  }

  const onSubmit = async (data: OrganizationFormData | OrganizationEditData) => {
    setIsSubmitting(true)
    setSubmitError("")

    try {
      if (isEditMode && organizationId) {
        // Update existing organization
        const editData = data as OrganizationEditData
        const response = await updateOrganization({
          organizationId,
          legalEntityName: editData.legalEntityName,
          legalType: editData.legalType,
          legalEmail: editData.legalEmail || undefined,
          firstName: editData.firstName,
          lastName: editData.lastName || undefined,
          companyWebsite: editData.companyWebsite || undefined,
          cloudProvider: editData.cloudProvider,
          serverRegion: editData.serverRegion,
          ipWhitelisting: editData.ipWhitelisting,
          gstVatCertificate: editData.gstVatCertificate || undefined,
          panTaxId: editData.panTaxId || undefined,
          authorizationSignatureLetter: editData.authorizationSignatureLetter || undefined,
        })

        if (response.success) {
          setSuccessMessage("Organization updated successfully!")
          setTimeout(() => {
            router.push("/dashboard/organization")
          }, 1500)
        } else {
          setSubmitError(response.error || response.message || "Failed to update organization")
        }
      } else {
        // Create new organization
        const formData = data as OrganizationFormData
        const response = await createOrganization({
          legalEntityName: formData.legalEntityName,
          legalType: formData.legalType,
          legalEmail: formData.legalEmail,
          password: formData.password,
          maxWorkspace: parseInt(formData.maxWorkspace) || 1,
          maxVault: parseInt(formData.maxVault) || 1,
          firstName: formData.firstName,
          lastName: formData.lastName,
          companyWebsite: formData.companyWebsite,
          gstVatCertificate: formData.gstVatCertificate,
          panTaxId: formData.panTaxId,
          authorizationSignatureLetter: formData.authorizationSignatureLetter,
          cloudProvider: formData.cloudProvider,
          serverRegion: formData.serverRegion,
          ipWhitelisting: formData.ipWhitelisting || [],
        })

        if (response.success) {
          const orgId = response.data?.mid || response.data?.organization_id || response.data?.id
          setSuccessMessage(
            `Organization created successfully!${orgId ? ` MID: ${orgId}` : ""}`
          )
          setTimeout(() => {
            router.push("/dashboard/organization")
          }, 1500)
        } else {
          setSubmitError(response.error || response.message || "Failed to create organization")
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard/organization")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditMode ? "Edit Organization" : "Add Organization"}
          </h1>
          {isEditMode && organizationId && (
            <p className="text-sm text-muted-foreground">
              Organization ID: {organizationId}
            </p>
          )}
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <p className="text-green-800 font-medium">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-800">{submitError}</p>
        </div>
      )}

      {/* @ts-expect-error - Union type incompatibility with handleSubmit */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Organization Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Organization Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Legal Entity Name */}
              <div className="space-y-2">
                <Label>
                  Legal Entity Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register("legalEntityName")}
                  placeholder="Enter legal entity name"
                  className={errors.legalEntityName ? "border-red-500" : ""}
                />
                {errors.legalEntityName && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.legalEntityName.message}
                  </p>
                )}
              </div>

              {/* Legal Type */}
              <div className="space-y-2">
                <Label>
                  Legal Type <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="legalType"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={errors.legalType ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Select legal type" />
                      </SelectTrigger>
                      <SelectContent>
                        {legalTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.legalType && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.legalType.message}
                  </p>
                )}
              </div>

              {/* Legal Email */}
              <div className="space-y-2">
                <Label>
                  Legal Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register("legalEmail")}
                  type="email"
                  placeholder="Enter legal email"
                  className={errors.legalEmail ? "border-red-500" : ""}
                />
                {errors.legalEmail && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.legalEmail.message}
                  </p>
                )}
              </div>

              {/* Password - Only for create mode */}
              {!isEditMode && (
                <div className="space-y-2">
                  <Label>
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    {...register("password")}
                    type="password"
                    placeholder="Enter password"
                    className={errors.password ? "border-red-500" : ""}
                  />
                  {errors.password && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.password.message}
                    </p>
                  )}
                </div>
              )}

              {/* Max Workspace & Vault - Only for create mode */}
              {!isEditMode && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>
                      Max Workspace <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register("maxWorkspace")}
                      type="number"
                      min="1"
                      placeholder="e.g., 5"
                      className={errors.maxWorkspace ? "border-red-500" : ""}
                    />
                    {errors.maxWorkspace && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.maxWorkspace.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Max Vault <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register("maxVault")}
                      type="number"
                      min="1"
                      placeholder="e.g., 10"
                      className={errors.maxVault ? "border-red-500" : ""}
                    />
                    {errors.maxVault && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.maxVault.message}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    {...register("firstName")}
                    placeholder="First name"
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input {...register("lastName")} placeholder="Last name" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Company Website</Label>
                <Input
                  {...register("companyWebsite")}
                  placeholder="https://example.com"
                  className={errors.companyWebsite ? "border-red-500" : ""}
                />
                {errors.companyWebsite && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.companyWebsite.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Documents</CardTitle>
              {isEditMode && (
                <p className="text-xs text-muted-foreground">
                  Upload new documents to replace existing ones
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <Controller
                name="gstVatCertificate"
                control={control}
                render={({ field }) => (
                  <FileUpload
                    label="GST/VAT Certificate"
                    required={!isEditMode}
                    file={field.value as File | null}
                    existingFileName={existingFiles?.gstVat}
                    onFileChange={field.onChange}
                    error={errors.gstVatCertificate?.message}
                  />
                )}
              />

              <Controller
                name="panTaxId"
                control={control}
                render={({ field }) => (
                  <FileUpload
                    label="PAN/Tax ID"
                    required={!isEditMode}
                    file={field.value as File | null}
                    existingFileName={existingFiles?.panTax}
                    onFileChange={field.onChange}
                    error={errors.panTaxId?.message}
                  />
                )}
              />

              <Controller
                name="authorizationSignatureLetter"
                control={control}
                render={({ field }) => (
                  <FileUpload
                    label="Authorization Signature Letter"
                    required={!isEditMode}
                    file={field.value as File | null}
                    existingFileName={existingFiles?.authLetter}
                    onFileChange={field.onChange}
                    error={errors.authorizationSignatureLetter?.message}
                  />
                )}
              />
            </CardContent>
          </Card>

          {/* Infrastructure */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Infrastructure Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cloud Provider */}
              <div className="space-y-2">
                <Label>
                  Cloud Provider <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="cloudProvider"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={errors.cloudProvider ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Select cloud provider" />
                      </SelectTrigger>
                      <SelectContent>
                        {cloudProviderOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.cloudProvider && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.cloudProvider.message}
                  </p>
                )}
              </div>

              {/* Server Region */}
              <div className="space-y-2">
                <Label>
                  Server Region <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="serverRegion"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={errors.serverRegion ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Select server region" />
                      </SelectTrigger>
                      <SelectContent>
                        {serverRegionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.serverRegion && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.serverRegion.message}
                  </p>
                )}
              </div>

              {/* IP Whitelisting */}
              <div className="space-y-2">
                <Label>IP Whitelisting</Label>
                <div className="flex gap-2">
                  <Input
                    value={newIp}
                    onChange={(e) => setNewIp(e.target.value)}
                    placeholder="Enter IP address (e.g., 192.168.1.1)"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddIp()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={handleAddIp}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {ipError && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {ipError}
                  </p>
                )}
                {ipWhitelisting.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {ipWhitelisting.map((ip) => (
                      <Badge key={ip} variant="secondary" className="gap-1 pl-2">
                        {ip}
                        <button
                          type="button"
                          onClick={() => handleRemoveIp(ip)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/organization")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditMode ? "Updating..." : "Adding Organization..."}
              </>
            ) : isEditMode ? (
              "Update Organization"
            ) : (
              "Add Organization"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

