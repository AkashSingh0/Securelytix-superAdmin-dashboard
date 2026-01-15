"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, UserPlus, Users, Layers, Vault, Building2, ChevronRight } from "lucide-react"

interface OrganizationData {
  id: string
  name: string
  email: string
  merchantId: string
  status: string
}

export default function OrganizationSetupPage() {
  const params = useParams()
  const router = useRouter()
  const orgId = params.id as string

  const [organization, setOrganization] = useState<OrganizationData | null>(null)
  const [loading, setLoading] = useState(true)

  // Load organization data from sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("setupOrganization")
      if (stored) {
        try {
          const org = JSON.parse(stored)
          setOrganization(org)
        } catch (err) {
          console.error("Error loading organization data:", err)
        }
      }
      setLoading(false)
    }
  }, [orgId])

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading organization...</p>
        </div>
      </div>
    )
  }

  if (!organization) {
    return (
      <div className="space-y-6">
        <Button 
          variant="outline"
          onClick={() => router.push("/dashboard/organization")}
          className="border-2 border-black text-black bg-transparent hover:bg-black hover:text-white rounded-full transition-all gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Organizations</span>
        </Button>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Organization not found. Please go back and try again.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const setupActions = [
    {
      title: "Role",
      description: "Define access roles and permissions for this organization",
      icon: Users,
      color: "bg-blue-500/10 text-blue-600 border-blue-200",
      hoverColor: "hover:bg-blue-500/20 hover:border-blue-300",
      onClick: () => {
        router.push(`/dashboard/organization/${orgId}/roles`)
      },
    },
    {
      title: "User",
      description: "Invite team members and assign them to roles",
      icon: UserPlus,
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
      hoverColor: "hover:bg-emerald-500/20 hover:border-emerald-300",
      onClick: () => {
        router.push(`/dashboard/organization/${orgId}/users`)
      },
    },
    {
      title: "Workspace",
      description: "Set up workspaces to organize your data and projects",
      icon: Layers,
      color: "bg-violet-500/10 text-violet-600 border-violet-200",
      hoverColor: "hover:bg-violet-500/20 hover:border-violet-300",
      onClick: () => {
        router.push(`/dashboard/organization/${orgId}/workspaces`)
      },
    },
    {
      title: "Vault",
      description: "Securely store and manage sensitive data in vaults",
      icon: Vault,
      color: "bg-amber-500/10 text-amber-600 border-amber-200",
      hoverColor: "hover:bg-amber-500/20 hover:border-amber-300",
      onClick: () => {
        router.push(`/dashboard/organization/${orgId}/vaults`)
      },
    },
  ]

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button 
        variant="outline"
        onClick={() => router.push("/dashboard/organization")}
        className="border-2 border-black text-black bg-transparent hover:bg-black hover:text-white rounded-full transition-all gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Organizations</span>
      </Button>

      {/* Header Card - matches list pages design */}
      <Card className="border-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-primary/20 flex items-center justify-center shadow-sm">
              <Building2 className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{organization.name || "Unnamed Organization"}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Complete the onboarding process for this organization
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Section Title */}
      <div>
        <h2 className="text-lg font-semibold mb-1">Setup Actions</h2>
        <p className="text-sm text-muted-foreground">
          Configure roles, invite users, set up workspaces, and create secure vaults to get started.
        </p>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {setupActions.map((action) => {
          const Icon = action.icon
          return (
            <Card
              key={action.title}
              className={`group cursor-pointer transition-all duration-200 border-2 ${action.color} ${action.hoverColor} hover:shadow-md`}
              onClick={action.onClick}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${action.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg font-semibold">{action.title}</CardTitle>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm leading-relaxed">
                  {action.description}
                </CardDescription>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}