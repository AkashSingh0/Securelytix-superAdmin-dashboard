"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Shield, Key } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { UnifiedSearchFilter } from "@/components/unified-search-filter"

export default function VaultPage() {
  const vaults = [
    { id: 1, name: "Customer Data Vault", status: "active", records: 15420, lastAccess: "2 hours ago" },
    { id: 2, name: "Payment Vault", status: "active", records: 8934, lastAccess: "30 min ago" },
    { id: 3, name: "Credentials Vault", status: "locked", records: 2341, lastAccess: "1 day ago" },
    { id: 4, name: "API Keys Vault", status: "active", records: 156, lastAccess: "5 hours ago" },
    { id: 5, name: "Compliance Vault", status: "active", records: 4521, lastAccess: "3 hours ago" },
    { id: 6, name: "Archive Vault", status: "locked", records: 89432, lastAccess: "1 week ago" },
  ]

  return (
    <div className="space-y-6">
      {/* Header with Title and Search */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Vault</h1>
        <div className="flex items-center gap-4">
          <UnifiedSearchFilter
            placeholder="Search by name, email, compa..."
            alignRight={false}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">6</p>
                <p className="text-xs text-muted-foreground">Total Vaults</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/20 rounded-lg">
                <Shield className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">4</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Key className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-xs text-muted-foreground">Locked</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary/20 rounded-lg">
                <Lock className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">120k+</p>
                <p className="text-xs text-muted-foreground">Total Records</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vault List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vaults.map((vault) => (
          <Card key={vault.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${vault.status === "active" ? "bg-primary/10" : "bg-orange-100"}`}>
                    <Lock className={`h-5 w-5 ${vault.status === "active" ? "text-primary" : "text-orange-600"}`} />
                  </div>
                  <CardTitle className="text-lg">{vault.name}</CardTitle>
                </div>
                <Badge variant={vault.status === "active" ? "default" : "secondary"}>
                  {vault.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Records</span>
                  <span className="font-medium text-foreground">{vault.records.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Access</span>
                  <span className="font-medium text-foreground">{vault.lastAccess}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
