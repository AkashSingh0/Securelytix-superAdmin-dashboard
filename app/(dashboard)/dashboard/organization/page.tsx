"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit3, Info, Loader2, ChevronRight } from "lucide-react";
import { TablePagination } from "@/components/table-pagination";
import { UnifiedSearchFilter } from "@/components/unified-search-filter";
import { useSearchFilter } from "@/contexts/search-filter-context";
import { getFilterConfigForPath } from "@/config/page-filter-configs";
import {
  fetchOrganizations,
  type OrganizationListItem,
} from "@/lib/api/organization";

export default function AllMerchantsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { state, setConfig } = useSearchFilter();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [organizations, setOrganizations] = useState<OrganizationListItem[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set filter config for this page
  useEffect(() => {
    const config = getFilterConfigForPath(pathname || "");
    setConfig(config);
    return () => setConfig(null); // Cleanup on unmount
  }, [pathname, setConfig]);

  // Load organizations from API and merge with localStorage
  const loadOrganizations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchOrganizations();
      let apiOrganizations: OrganizationListItem[] = [];

      if (response.success && response.data) {
        apiOrganizations = response.data;
      }

      // Get organizations from localStorage
      let localOrganizations: OrganizationListItem[] = [];
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("organizations");
        if (stored) {
          try {
            localOrganizations = JSON.parse(stored);
          } catch {
            localOrganizations = [];
          }
        }
      }

      // Helper to get email from org (API may return email or legal_email)
      const getEmail = (org: OrganizationListItem) => org.email || org.legal_email || "";

      // Improved deduplication: match by name OR email OR organization_id
      const isDuplicate = (localOrg: OrganizationListItem, apiOrgs: OrganizationListItem[]) => {
        const localName = (localOrg.organization_name || "").toLowerCase().trim();
        const localEmail = getEmail(localOrg).toLowerCase().trim();
        const localOrgId = (localOrg.organization_id || "").toLowerCase().trim();

        return apiOrgs.some(apiOrg => {
          const apiName = (apiOrg.organization_name || "").toLowerCase().trim();
          const apiEmail = getEmail(apiOrg).toLowerCase().trim();
          const apiOrgId = (apiOrg.organization_id || "").toLowerCase().trim();

          // Match if name matches (and name is not empty)
          if (localName && apiName && localName === apiName) return true;
          
          // Match if email matches (and email is not empty)
          if (localEmail && apiEmail && localEmail === apiEmail) return true;
          
          // Match if organization_id matches (and org_id is not empty)
          if (localOrgId && apiOrgId && localOrgId === apiOrgId) return true;

          return false;
        });
      };

      // Filter out localStorage orgs that exist in API
      const uniqueLocalOrgs = localOrganizations.filter(
        localOrg => !isDuplicate(localOrg, apiOrganizations)
      );

      // Also filter out orphaned entries (no name AND no proper org_id)
      const validLocalOrgs = uniqueLocalOrgs.filter(org => {
        const hasName = (org.organization_name || "").trim() !== "";
        const hasValidOrgId = (org.organization_id || "").startsWith("ORG_");
        return hasName || hasValidOrgId;
      });

      // Combine: API organizations first, then valid unique local ones
      const mergedOrganizations = [...apiOrganizations, ...validLocalOrgs];
      setOrganizations(mergedOrganizations);

      // Clean up localStorage - remove orphaned/duplicate entries
      if (localOrganizations.length > 0) {
        if (validLocalOrgs.length === 0) {
          localStorage.removeItem("organizations");
        } else if (validLocalOrgs.length !== localOrganizations.length) {
          localStorage.setItem("organizations", JSON.stringify(validLocalOrgs));
        }
      }

      if (!response.success && localOrganizations.length === 0) {
        setError(response.error || "Failed to load organizations");
      }
    } catch (err) {
      // If API fails, try to load from localStorage
      let localOrganizations: OrganizationListItem[] = [];
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("organizations");
        if (stored) {
          try {
            localOrganizations = JSON.parse(stored);
          } catch {
            localOrganizations = [];
          }
        }
      }

      if (localOrganizations.length > 0) {
        setOrganizations(localOrganizations);
      } else {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
        setOrganizations([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadOrganizations();
  }, [loadOrganizations]);

  // Refresh data when page becomes visible (after navigation back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadOrganizations();
      }
    };

    const handleFocus = () => {
      loadOrganizations();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [loadOrganizations]);

  // Helper to get email from org (API may return email or legal_email)
  const getOrgEmail = (org: OrganizationListItem) => org.email || org.legal_email || "";

  const filteredMerchants = organizations.filter((org) => {
    const name = (org.organization_name || "").toLowerCase();
    const email = getOrgEmail(org).toLowerCase();
    const orgId = String(org.id || "").toLowerCase();
    const organizationId = String(org.organization_id || "").toLowerCase();
    const query = state.searchQuery.toLowerCase();

    return (
      name.includes(query) || email.includes(query) || orgId.includes(query) || organizationId.includes(query)
    );
  });

  const totalPages = Math.ceil(filteredMerchants.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedMerchants = filteredMerchants.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [state.searchQuery]);

  const handleExportToCSV = () => {
    // Prepare CSV headers
    const headers = ["Organization Name", "Email", "Organization ID", "Status"];

    // Convert filtered organizations data to CSV rows
    const csvRows = [
      headers.join(","), // Header row
      ...filteredMerchants.map((org) => {
        const displayName = org.organization_name || "";
        const displayEmail = getOrgEmail(org);
        const displayOrgId = org.organization_id || String(org.id);

        return [
          `"${displayName}"`,
          `"${displayEmail}"`,
          `"${displayOrgId}"`,
          `"${org.status}"`,
        ].join(",");
      }),
    ];

    // Create CSV content
    const csvContent = csvRows.join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `organizations_export_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEditOrganization = (org: OrganizationListItem) => {
    // Store organization data for edit page (API doesn't have a details endpoint)
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "editOrganization",
        JSON.stringify({
          id: org.id,
          organization_id: org.organization_id,
          organization_name: org.organization_name || "",
          email: getOrgEmail(org),
          status: org.status,
        })
      );
    }
    // Navigate to the edit page
    const organizationId = org.organization_id || org.id;
    router.push(`/dashboard/organization/edit/${organizationId}`);
  };

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Title, Search, Filter, and Add Organization Button */}
      <div className="flex items-center justify-between flex-shrink-0">
        <h1 className="text-2xl font-bold">All Organizations</h1>
        <div className="flex items-center gap-4">
          <UnifiedSearchFilter
            placeholder="Search by name, email, company..."
            alignRight={false}
          />
          <Button onClick={() => router.push("/dashboard/organization/add")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Organization
          </Button>
        </div>
      </div>

      {/* Table (scrollable rows inside card) */}
      <Card className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <div className="flex-1 min-h-0 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow className="h-14">
                <TableHead>Organization Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    MID
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Edit</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-muted-foreground">
                        Loading organizations...
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-destructive"
                  >
                    {error}
                  </TableCell>
                </TableRow>
              ) : paginatedMerchants.length > 0 ? (
                paginatedMerchants.map((org) => {
                  const displayName = org.organization_name || "—";
                  const displayEmail = getOrgEmail(org) || "—";
                  const displayOrgId = org.organization_id || String(org.id);

                  return (
                    <TableRow key={String(org.id)} className="h-16">
                      <TableCell className="font-medium">
                        {displayName}
                      </TableCell>
                      <TableCell>{displayEmail}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {displayOrgId}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-orange-600 border-orange-600"
                        >
                          {org.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 text-xs"
                          onClick={() => handleEditOrganization(org)}
                        >
                          <Edit3 className="h-3 w-3" />
                          Edit
                        </Button>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          size="sm"
                          className="gap-1 text-xs"
                          onClick={() => {
                            if (typeof window !== "undefined") {
                              sessionStorage.setItem(
                                "setupOrganization",
                                JSON.stringify({
                                  id: org.id,
                                  name: org.organization_name || "",
                                  email: getOrgEmail(org),
                                  merchantId: org.organization_id || org.id,
                                  status: org.status,
                                })
                              );
                            }
                            router.push(`/dashboard/organization/${org.id}`);
                          }}
                        >
                          Continue Setup
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No organizations found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          totalItems={filteredMerchants.length}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={setRowsPerPage}
          rowsPerPageOptions={[10, 20, 30, 50, 100]}
        />
      </Card>
    </div>
  );
}
