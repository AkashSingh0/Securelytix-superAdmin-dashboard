"use client"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { SearchFilterProvider } from "@/contexts/search-filter-context"
import { 
  ChevronDown, 
  ChevronRight, 
  Users, 
  UserPlus, 
  Mail, 
  FileText, 
  Folder, 
  Building2, 
  Database, 
  CreditCard, 
  HelpCircle, 
  Eye, 
  ScrollText,
  LayoutGrid,
  Lock
} from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { label: "Billing", path: "/dashboard/billing", icon: CreditCard },
    { label: "Support", path: "/dashboard/support", icon: HelpCircle },
    { label: "Observibility", path: "/dashboard/observibility", icon: Eye },
    { label: "Logs", path: "/dashboard/logs", icon: ScrollText },
  ]

  const leadsSubItems = [
    { label: "Registrations", path: "/dashboard/registrations", icon: UserPlus },
    { label: "Contact Us", path: "/dashboard/contact-us", icon: Mail },
    { label: "Resources", path: "/dashboard/resources", icon: FileText },
    { label: "Miscellaneous", path: "/dashboard/miscellaneous", icon: Folder },
  ]

  const dataVaultSubItems = [
    { label: "Workspace", path: "/dashboard/data-vault/workspace", icon: LayoutGrid },
    // { label: "Vault", path: "/dashboard/data-vault/vault", icon: Lock },
  ]

  const [isLeadsExpanded, setIsLeadsExpanded] = useState(false)
  const [isDataVaultExpanded, setIsDataVaultExpanded] = useState(false)
  
  // Close leads submenu when navigating away from leads submenu pages
  useEffect(() => {
    if (pathname !== "/dashboard/leads" && 
        !pathname?.startsWith("/dashboard/leads/") &&
        pathname !== "/dashboard/registrations" &&
        !pathname?.startsWith("/dashboard/registrations/") &&
        pathname !== "/dashboard/contact-us" &&
        !pathname?.startsWith("/dashboard/contact-us/") &&
        pathname !== "/dashboard/resources" &&
        pathname !== "/dashboard/miscellaneous") {
      setIsLeadsExpanded(false)
    } else {
      // Keep submenu open when on any leads submenu pages
      setIsLeadsExpanded(true)
    }
  }, [pathname])

  // Close data vault submenu when navigating away from data vault pages
  useEffect(() => {
    if (pathname !== "/dashboard/data-vault" && 
        !pathname?.startsWith("/dashboard/data-vault/")) {
      setIsDataVaultExpanded(false)
    } else {
      // Keep submenu open when on any data vault pages
      setIsDataVaultExpanded(true)
    }
  }, [pathname])

  // Get user email from localStorage (set during login)
  const [userEmail, setUserEmail] = useState("user@example.com")
  
  // Load email from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("userEmail")
      if (storedEmail) {
        setUserEmail(storedEmail)
      }
    }
  }, [])

  return (
    <SearchFilterProvider>
      <div className="flex flex-col h-screen bg-background">
        {/* Header */}
        <DashboardHeader userEmail={userEmail} />

        <div className="flex flex-1 overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-64 border-r bg-card overflow-hidden">
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="p-6 border-b">
            <Link href="/dashboard" className="text-xl font-bold hover:underline">
              Dashboard
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {/* Leads with Toggle */}
            <div className="space-y-1">
              <Button
                variant={pathname === "/dashboard/leads" ? "default" : "ghost"}
                className="w-full justify-between"
                onClick={() => {
                  router.push("/dashboard/leads")
                  setIsLeadsExpanded(true)
                }}
              >
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Leads</span>
                </div>
                {isLeadsExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
              {isLeadsExpanded && (
                <div className="pl-4 space-y-1">
                  {leadsSubItems.map((item) => {
                    const isActive = pathname === item.path || pathname?.startsWith(`${item.path}/`)
                    const Icon = item.icon
                    return (
                      <Button
                        key={item.label}
                        variant={isActive ? "default" : "ghost"}
                        className="w-full justify-start text-xs"
                        onClick={() => router.push(item.path)}
                      >
                        <Icon className="h-3 w-3 mr-2" />
                        {item.label}
                      </Button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Organization (links directly to organization page) */}
            <div className="space-y-1">
              <Button
                variant={
                  pathname === "/dashboard/organization" ||
                  pathname?.startsWith("/dashboard/organization/")
                    ? "default"
                    : "ghost"
                }
                className="w-full justify-start"
                onClick={() => {
                  router.push("/dashboard/organization")
                }}
              >
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Organization</span>
                </div>
              </Button>
            </div>

            {/* Data Vault with Toggle */}
            <div className="space-y-1">
              <Button
                variant={pathname === "/dashboard/data-vault" ? "default" : "ghost"}
                className="w-full justify-between"
                onClick={() => {
                  router.push("/dashboard/data-vault")
                  setIsDataVaultExpanded(true)
                }}
              >
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  <span>Data Vault</span>
                </div>
                {isDataVaultExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
              {isDataVaultExpanded && (
                <div className="pl-4 space-y-1">
                  {dataVaultSubItems.map((item) => {
                    const isActive = pathname === item.path || pathname?.startsWith(`${item.path}/`)
                    const Icon = item.icon
                    return (
                      <Button
                        key={item.label}
                        variant={isActive ? "default" : "ghost"}
                        className="w-full justify-start text-xs"
                        onClick={() => router.push(item.path)}
                      >
                        <Icon className="h-3 w-3 mr-2" />
                        {item.label}
                      </Button>
                    )
                  })}
                </div>
              )}
            </div>
            
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.path}
                  variant={pathname === item.path ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => router.push(item.path)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 ${pathname?.startsWith("/dashboard/leads/") || pathname?.startsWith("/dashboard/contact-us/") || pathname?.startsWith("/dashboard/registrations/") || pathname?.startsWith("/dashboard/organization/") ? "overflow-hidden" : "overflow-y-auto p-6"}`}>
        {pathname?.startsWith("/dashboard/leads/") || pathname?.startsWith("/dashboard/contact-us/") || pathname?.startsWith("/dashboard/registrations/") || pathname?.startsWith("/dashboard/organization/") ? (
          <div className="h-full p-6 overflow-y-auto">
            {children}
          </div>
        ) : (
          children
        )}
      </main>
      </div>
    </div>
    </SearchFilterProvider>
  )
}

