"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"

function AddOrganizationPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const mode = searchParams.get("mode")
    const redirectPath = mode === "edit" 
      ? "/dashboard/organization/add/basic-info?mode=edit"
      : "/dashboard/organization/add/basic-info"
    router.replace(redirectPath)
  }, [router, searchParams])

  return null
}

export default function AddOrganizationPage() {
  return (
    <Suspense fallback={null}>
      <AddOrganizationPageContent />
    </Suspense>
  )
}
