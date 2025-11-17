"use client"

import { Card, CardContent } from "@/components/ui/card"

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

interface LeadsSummaryProps {
  registrations?: number
  contactUs?: number
  resources?: number
  miscellaneous?: number
}

export function LeadsSummary({
  registrations = 450,
  contactUs = 200,
  resources = 450,
  miscellaneous = 0,
}: LeadsSummaryProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Leads Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard value={registrations} label="Registrations" />
        <SummaryCard value={contactUs} label="Contact Us" />
        <SummaryCard value={resources} label="Resources" />
        <SummaryCard value={miscellaneous} label="Miscellaneous" />
      </div>
    </div>
  )
}

