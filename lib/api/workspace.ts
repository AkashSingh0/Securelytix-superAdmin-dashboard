// Workspace API service
import { API_BASE_URL } from "./config"

// Workspace list item (from GET /workspaces)
export interface WorkspaceListItem {
  workspaceId: string
  workspaceName?: string | null
  merchantId: string
  merchantEmail: string | null
  vaults: number
  createdAt: string
}

// Workspace detail (from GET /workspaces/{workspace_id})
export interface WorkspaceDetail {
  workspaceId: string
  workspaceName: string
  merchantId: string
  merchantEmail: string | null
  region: string | null
  vaults: number
  status: string
  createdAt: string
  updatedAt: string | null
}

export interface FetchWorkspacesResponse {
  success: boolean
  data?: WorkspaceListItem[]
  total?: number
  error?: string
}

export interface FetchWorkspaceDetailResponse {
  success: boolean
  data?: WorkspaceDetail
  error?: string
}

/**
 * Fetch all workspaces with optional pagination
 */
export async function fetchWorkspaces(
  skip: number = 0,
  limit: number = 100
): Promise<FetchWorkspacesResponse> {
  try {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
    })

    const response = await fetch(`${API_BASE_URL}/workspaces?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.detail || data.error || "Failed to fetch workspaces",
      }
    }

    return {
      success: true,
      data: data.workspaces || [],
      total: data.total || 0,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error occurred",
    }
  }
}

/**
 * Fetch single workspace details by ID
 */
export async function fetchWorkspaceDetail(
  workspaceId: string
): Promise<FetchWorkspaceDetailResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/workspaces/${workspaceId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.detail || data.error || "Workspace not found",
      }
    }

    return {
      success: true,
      data: data,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error occurred",
    }
  }
}

// ============== VAULT API ==============

// Vault item (from GET /workspaces/{workspace_id}/vaults)
export interface VaultItem {
  vault_id: string
  vault_name: string
  workspace_id: string
  merchant_id: string | null
  total_records: number
  last_accessed: string | null
  created_at: string | null
  status: string
}

export interface FetchVaultsResponse {
  success: boolean
  workspace_id?: string
  total_vaults?: number
  data?: VaultItem[]
  error?: string
}

export interface FetchVaultDetailResponse {
  success: boolean
  data?: VaultItem
  error?: string
}

/**
 * Fetch all vaults for a workspace
 */
export async function fetchWorkspaceVaults(
  workspaceId: string,
  skip: number = 0,
  limit: number = 100
): Promise<FetchVaultsResponse> {
  try {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
    })

    const response = await fetch(
      `${API_BASE_URL}/workspaces/${workspaceId}/vaults?${params}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.detail || data.error || "Failed to fetch vaults",
      }
    }

    return {
      success: true,
      workspace_id: data.workspace_id,
      total_vaults: data.total_vaults || 0,
      data: data.vaults || [],
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error occurred",
    }
  }
}

/**
 * Fetch single vault details
 */
export async function fetchVaultDetail(
  workspaceId: string,
  vaultId: string
): Promise<FetchVaultDetailResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/workspaces/${workspaceId}/vaults/${vaultId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.detail || data.error || "Vault not found",
      }
    }

    return {
      success: true,
      data: data,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error occurred",
    }
  }
}

