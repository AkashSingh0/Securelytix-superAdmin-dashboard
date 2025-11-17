"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Plus } from "lucide-react"

export default function AddOrganizationPage() {
  const router = useRouter()
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    barcode: "",
    description: "",
    basePrice: "",
    discountedPrice: "",
    chargeTax: false,
    inStock: true,
    status: "draft",
    category: "",
  })

  // Error state
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Validation
  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (formData.name.length < 2) {
      newErrors.name = "Organization name must be at least 2 characters."
    }

    if (!formData.basePrice) {
      newErrors.basePrice = "Required"
    } else if (isNaN(parseFloat(formData.basePrice)) || parseFloat(formData.basePrice) < 0) {
      newErrors.basePrice = "Please enter a valid price"
    }

    if (!formData.discountedPrice) {
      newErrors.discountedPrice = "Required"
    } else if (isNaN(parseFloat(formData.discountedPrice)) || parseFloat(formData.discountedPrice) < 0) {
      newErrors.discountedPrice = "Please enter a valid price"
    }

    if (!formData.status) {
      newErrors.status = "Required"
    }

    if (!formData.category) {
      newErrors.category = "Required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleDiscard = () => {
    if (confirm("Are you sure you want to discard changes?")) {
      router.push("/dashboard/organization")
    }
  }

  const handleSaveDraft = () => {
    if (validate()) {
      // TODO: Save draft to backend
      console.log("Saving draft:", formData)
      router.push("/dashboard/organization")
    }
  }

  const handlePublish = () => {
    if (validate()) {
      // TODO: Publish to backend
      console.log("Publishing:", formData)
      router.push("/dashboard/organization")
    }
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard/organization")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold">Add Organization</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleDiscard}>
            Discard
          </Button>
          <Button variant="outline" onClick={handleSaveDraft}>
            Save Draft
          </Button>
          <Button onClick={handlePublish}>
            Publish
          </Button>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Organization Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Organization Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => handleInputChange("sku", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input
                    id="barcode"
                    value={formData.barcode}
                    onChange={(e) => handleInputChange("barcode", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                  placeholder="Enter organization description..."
                />
                <p className="text-sm text-muted-foreground">
                  Set a description to the organization for better visibility.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Organization Images */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Organization Images</CardTitle>
                <Button variant="link" className="h-auto p-0">
                  Add media from URL
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6 text-muted-foreground"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-6.18-4.99l2.909 2.909m0 0l3.181 3.182M8.25 6.75l8.25 8.25"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-medium">Drop your images here</p>
                  <p className="text-xs text-muted-foreground">PNG or JPG (max. 5MB)</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Select images
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="basePrice">Base Price</Label>
                <Input
                  id="basePrice"
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) => handleInputChange("basePrice", e.target.value)}
                  className={errors.basePrice ? "border-destructive" : ""}
                  placeholder="0.00"
                />
                {errors.basePrice && (
                  <p className="text-sm text-destructive">{errors.basePrice}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountedPrice">Discounted Price</Label>
                <Input
                  id="discountedPrice"
                  type="number"
                  value={formData.discountedPrice}
                  onChange={(e) => handleInputChange("discountedPrice", e.target.value)}
                  className={errors.discountedPrice ? "border-destructive" : ""}
                  placeholder="0.00"
                />
                {errors.discountedPrice && (
                  <p className="text-sm text-destructive">{errors.discountedPrice}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="chargeTax"
                  checked={formData.chargeTax}
                  onCheckedChange={(checked) => handleInputChange("chargeTax", checked as boolean)}
                />
                <Label htmlFor="chargeTax" className="font-normal cursor-pointer">
                  Charge tax on this organization
                </Label>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="inStock" className="cursor-pointer">
                  In stock
                </Label>
                <Switch
                  id="inStock"
                  checked={formData.inStock}
                  onCheckedChange={(checked: boolean) => handleInputChange("inStock", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger className={errors.status ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-yellow-500" />
                        Draft
                      </div>
                    </SelectItem>
                    <SelectItem value="published">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        Published
                      </div>
                    </SelectItem>
                    <SelectItem value="archived">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-gray-500" />
                        Archived
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">Set the organization status.</p>
                {errors.status && (
                  <p className="text-sm text-destructive">{errors.status}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange("category", value)}
                  >
                    <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon" className="shrink-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
