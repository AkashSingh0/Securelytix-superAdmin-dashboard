"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Rocket } from "lucide-react"

export default function MiscellaneousPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Rocket className="h-16 w-16 text-primary" />
            </div>
            <CardTitle className="text-3xl mb-2">Miscellaneous</CardTitle>
            <CardDescription className="text-lg">
              We&apos;re working hard to bring you this feature.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-2xl font-semibold text-primary">
              🚀 Stay tuned — this page is coming soon!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

