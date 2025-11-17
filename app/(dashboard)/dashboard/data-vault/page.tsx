"use client"

import { Card, CardContent } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

interface SummaryCardProps {
  value: string | number
  label: string
}

function SummaryCard({ value, label }: SummaryCardProps) {
  return (
    <Card className="rounded-lg border">
      <CardContent className="p-6">
        <div className="text-xl font-bold mb-2">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  )
}

export default function DataVaultPage() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold">Data Vaults</h1>
      </div>

      {/* Top Row - Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard value={500} label="Organizations" />
        <SummaryCard value={600} label="Agents" />
        <SummaryCard value={1200} label="Vaults" />
        <SummaryCard value="1.2m" label="PII Protected" />
      </div>

      {/* Middle Row - Data Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Wide */}
        <Card className="lg:col-span-2">
          <CardContent className="p-12 flex items-center justify-center min-h-[300px]">
            <BarChart3 className="h-12 w-12 text-muted-foreground" />
          </CardContent>
        </Card>

        {/* Right Panel - Square */}
        <Card>
          <CardContent className="p-12 flex items-center justify-center min-h-[300px]">
            <BarChart3 className="h-12 w-12 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row - Large Data Panel */}
      <Card>
        <CardContent className="p-12 flex items-center justify-center min-h-[400px]">
          <BarChart3 className="h-12 w-12 text-muted-foreground" />
        </CardContent>
      </Card>
    </div>
  )
}
