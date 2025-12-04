"use client"

import { LeadsSummary } from "@/components/leads-summary"

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      {/* Leads Summary */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Leads Summary</h2>
        <LeadsSummary />
      </div>
    </div>
  )
}
