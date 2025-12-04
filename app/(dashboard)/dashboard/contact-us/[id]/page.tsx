"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Trash2, ArrowLeft, Loader2 } from "lucide-react"

// API base URL
const API_BASE_URL = "https://website-backend.securelytix.tech/api/v1" // Production API

interface Note {
  content: string
  created_at?: string
  created_by?: string
  created_by_name?: string
}

interface StatusHistory {
  status: string
  changed_at: string
}

interface Contact {
  id: string
  first_name: string
  last_name: string | null
  email: string
  company_name: string
  country_code: string
  contact_number: string
  description: string
  terms_accepted: boolean
  status: string
  status_history: StatusHistory[]
  notes: Note[]
  created_at: string
  updated_at: string
}

const STATUS_OPTIONS = ["new", "pending", "contacted", "completed"]

export default function ContactDetailPage() {
  const params = useParams()
  const router = useRouter()
  const contactId = params.id as string
  
  const [contact, setContact] = useState<Contact | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newNote, setNewNote] = useState("")
  const [addingNote, setAddingNote] = useState(false)
  const [updatingNotes, setUpdatingNotes] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [statusUpdateMessage, setStatusUpdateMessage] = useState<{ type: "success" | "error"; message: string } | null>(null)

  // Fetch contact data from API
  useEffect(() => {
    const fetchContact = async () => {
      if (!contactId) return

      setLoading(true)
      setError(null)

      try {
        const url = `${API_BASE_URL}/leads/${contactId}`
        console.log("Fetching contact from:", url)
        
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          mode: "cors",
        })

        console.log("Response status:", response.status)

        if (!response.ok) {
          const errorText = await response.text()
          console.error("API Error Response:", errorText)
          let errorData
          try {
            errorData = JSON.parse(errorText)
          } catch {
            errorData = { detail: errorText || response.statusText }
          }
          throw new Error(errorData.detail || `Failed to fetch contact: ${response.statusText}`)
        }

        const responseText = await response.text()
        console.log("API Response Text:", responseText)
        
        let data: Contact
        try {
          data = JSON.parse(responseText)
        } catch (parseError) {
          console.error("Failed to parse JSON response:", parseError)
          throw new Error(`Invalid JSON response from API: ${responseText.substring(0, 100)}`)
        }
        // Ensure notes array exists
        if (!data.notes) {
          data.notes = []
        }
        // Ensure status_history array exists
        if (!data.status_history) {
          data.status_history = []
        }
        setContact(data)
        setSelectedStatus(data.status || "new")
      } catch (err) {
        console.error("Error fetching contact:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch contact")
      } finally {
        setLoading(false)
      }
    }

    fetchContact()
  }, [contactId])

  // Update status via API
  const handleStatusUpdate = async () => {
    if (!contact || !selectedStatus || selectedStatus === contact.status) return

    setUpdatingStatus(true)
    setError(null)
    setStatusUpdateMessage(null)

    try {
      const url = `${API_BASE_URL}/leads/${contactId}/status`
      console.log("Updating status at:", url)
      console.log("New status:", selectedStatus)
      
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({
          status: selectedStatus,
        }),
      })

      console.log("Status update response status:", response.status)
      const responseText = await response.text()
      console.log("Status update response:", responseText)

      if (!response.ok) {
        let errorData
        try {
          errorData = JSON.parse(responseText)
        } catch {
          errorData = { detail: responseText || response.statusText }
        }

        // Handle different error status codes
        if (response.status === 400) {
          const errorMessage = errorData.detail || "Invalid request. Please check the status value."
          setStatusUpdateMessage({ type: "error", message: errorMessage })
          throw new Error(errorMessage)
        } else if (response.status === 404) {
          const errorMessage = errorData.detail || "Lead not found."
          setStatusUpdateMessage({ type: "error", message: errorMessage })
          throw new Error(errorMessage)
        } else if (response.status === 500) {
          const errorMessage = errorData.detail || "Server error. Please try again later."
          setStatusUpdateMessage({ type: "error", message: errorMessage })
          throw new Error(errorMessage)
        } else {
          const errorMessage = errorData.detail || `Failed to update status: ${response.statusText}`
          setStatusUpdateMessage({ type: "error", message: errorMessage })
          throw new Error(errorMessage)
        }
      }

      // Parse success response
      let data
      try {
        data = JSON.parse(responseText)
      } catch {
        data = {}
      }

      // Show success message
      setStatusUpdateMessage({ 
        type: "success", 
        message: data.message || "Status updated successfully!" 
      })

      // Clear success message after 3 seconds
      setTimeout(() => {
        setStatusUpdateMessage(null)
      }, 3000)
      
      // Refresh contact data from production API to get updated status and status_history
      const refreshUrl = `${API_BASE_URL}/leads/${contactId}`
      console.log("Refreshing contact data from:", refreshUrl)
      
      const refreshResponse = await fetch(refreshUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        mode: "cors",
      })

      if (refreshResponse.ok) {
        const refreshText = await refreshResponse.text()
        let refreshedData: Contact
        try {
          refreshedData = JSON.parse(refreshText)
        } catch {
          console.error("Failed to parse refresh response")
          return
        }
        
        // Ensure arrays exist
        if (!refreshedData.notes) {
          refreshedData.notes = []
        }
        if (!refreshedData.status_history) {
          refreshedData.status_history = []
        }
        setContact(refreshedData)
        // Update selected status to match the updated contact
        setSelectedStatus(refreshedData.status || "new")
      }
    } catch (err) {
      console.error("Error updating status:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to update status"
      setError(errorMessage)
      // Revert status selection on error
      if (contact) {
        setSelectedStatus(contact.status || "new")
      }
    } finally {
      setUpdatingStatus(false)
    }
  }

  // Update notes via API
  const handleAddNote = async () => {
    if (!newNote.trim() || !contact) return

    setAddingNote(true)
    setError(null)
    try {
      // Get auth token and user info from localStorage
      const authToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
      const userEmail = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null
      const userName = typeof window !== "undefined" ? localStorage.getItem("userName") : null
      
      // Validate that user email exists (required for created_by field)
      if (!userEmail) {
        throw new Error("User email is required to add notes. Please log in again.")
      }

      // Use production API for notes
      const url = `${API_BASE_URL}/leads/${contactId}/notes`
      console.log("Adding note at:", url)

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        "Accept": "application/json",
      }

      // Add Authorization header if token exists
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`
      }

      // Prepare payload with ONLY the new note (not all existing notes)
      // Always include created_by_name - use userName if available, otherwise use userEmail as fallback
      const notesPayload = [
        {
          content: newNote.trim(),
          created_by: userEmail,
          created_by_name: userName || userEmail,
        },
      ]

      // Call API to add only the new note
      const response = await fetch(url, {
        method: "POST",
        headers,
        mode: "cors",
        body: JSON.stringify({
          notes: notesPayload,
        }),
      })

      console.log("Add note response status:", response.status)
      const responseText = await response.text()
      console.log("Add note response:", responseText)

      if (!response.ok) {
        let errorData
        try {
          errorData = JSON.parse(responseText)
        } catch {
          errorData = { detail: responseText || response.statusText }
        }
        throw new Error(errorData.detail || `Failed to update notes: ${response.statusText}`)
      }

      let data
      try {
        data = JSON.parse(responseText)
      } catch {
        data = {}
      }
      
      // Update local state with API response
      if (data.data) {
        const updatedContact = data.data
        // Ensure notes array exists
        if (!updatedContact.notes) {
          updatedContact.notes = []
        }
        if (!updatedContact.status_history) {
          updatedContact.status_history = []
        }
        setContact(updatedContact)
      } else {
        // If response doesn't include data, refresh from API
        const refreshUrl = `${API_BASE_URL}/leads/${contactId}`
        const refreshResponse = await fetch(refreshUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          mode: "cors",
        })

        if (refreshResponse.ok) {
          const refreshText = await refreshResponse.text()
          let refreshedData: Contact
          try {
            refreshedData = JSON.parse(refreshText)
          } catch {
            console.error("Failed to parse refresh response")
            return
          }
          
          if (!refreshedData.notes) {
            refreshedData.notes = []
          }
          if (!refreshedData.status_history) {
            refreshedData.status_history = []
          }
          setContact(refreshedData)
        }
      }

      setNewNote("")
    } catch (err) {
      console.error("Error adding note:", err)
      setError(err instanceof Error ? err.message : "Failed to add note")
    } finally {
      setAddingNote(false)
    }
  }

  // Delete note - fetch updated notes from API after deletion
  const handleDeleteNote = async (noteIndex: number) => {
    if (!contact) return

    setUpdatingNotes(true)
    setError(null)
    try {
      // Get auth token from localStorage
      const authToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
      
      // Note: The API doesn't have a DELETE endpoint, so we need to send all remaining notes
      // Remove the note at the specified index
      const updatedNotes = (contact.notes || []).filter((_, index) => index !== noteIndex)

      // Use production API for notes
      const url = `${API_BASE_URL}/leads/${contactId}/notes`
      console.log("Deleting note at:", url)

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        "Accept": "application/json",
      }

      // Add Authorization header if token exists
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`
      }

      // Prepare notes payload with all remaining notes (created_by is required for ALL notes)
      const userEmail = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null
      if (!userEmail) {
        throw new Error("User email is required. Please log in again.")
      }

      const notesPayload = updatedNotes.map(note => {
        const payload: { content: string; created_by: string; created_by_name?: string } = {
          content: note.content,
          // created_by is required - use note's created_by if exists, otherwise use current user's email as fallback
          created_by: note.created_by || userEmail,
        }
        // Include created_by_name if available
        if (note.created_by_name) {
          payload.created_by_name = note.created_by_name
        }
        return payload
      })

      // Call API to update notes (send all remaining notes)
      const response = await fetch(url, {
        method: "POST",
        headers,
        mode: "cors",
        body: JSON.stringify({
          notes: notesPayload,
        }),
      })

      console.log("Delete note response status:", response.status)
      const responseText = await response.text()
      console.log("Delete note response:", responseText)

      if (!response.ok) {
        let errorData
        try {
          errorData = JSON.parse(responseText)
        } catch {
          errorData = { detail: responseText || response.statusText }
        }
        throw new Error(errorData.detail || `Failed to update notes: ${response.statusText}`)
      }

      let data
      try {
        data = JSON.parse(responseText)
      } catch {
        data = {}
      }
      
      // Update local state with API response
      if (data.data) {
        const updatedContact = data.data
        // Ensure notes array exists
        if (!updatedContact.notes) {
          updatedContact.notes = []
        }
        if (!updatedContact.status_history) {
          updatedContact.status_history = []
        }
        setContact(updatedContact)
      } else {
        // If response doesn't include data, refresh from API
        const refreshUrl = `${API_BASE_URL}/leads/${contactId}`
        const refreshResponse = await fetch(refreshUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          mode: "cors",
        })

        if (refreshResponse.ok) {
          const refreshText = await refreshResponse.text()
          let refreshedData: Contact
          try {
            refreshedData = JSON.parse(refreshText)
          } catch {
            console.error("Failed to parse refresh response")
            return
          }
          
          if (!refreshedData.notes) {
            refreshedData.notes = []
          }
          if (!refreshedData.status_history) {
            refreshedData.status_history = []
          }
          setContact(refreshedData)
        }
      }
    } catch (err) {
      console.error("Error deleting note:", err)
      setError(err instanceof Error ? err.message : "Failed to delete note")
    } finally {
      setUpdatingNotes(false)
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Get full name
  const getFullName = (contact: Contact) => {
    return contact.last_name 
      ? `${contact.first_name} ${contact.last_name}` 
      : contact.first_name
  }

  // Get full phone number
  const getFullPhone = (contact: Contact) => {
    return `${contact.country_code} ${contact.contact_number}`
  }

  // Get status badge color
  const getStatusColor = (status: string | undefined | null) => {
    if (!status) {
      return "bg-gray-100 text-gray-800"
    }
    switch (status.toLowerCase()) {
      case "new":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "contacted":
        return "bg-purple-100 text-purple-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get status display label
  const getStatusLabel = (status: string | undefined | null) => {
    if (!status) return "Unknown"
    switch (status.toLowerCase()) {
      case "new":
        return "New"
      case "pending":
        return "Pending"
      case "contacted":
        return "Contacted"
      case "completed":
        return "Completed"
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading contact details...</p>
        </div>
      </div>
    )
  }

  if (error || !contact) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.push("/dashboard/contact-us")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Contact Us
        </Button>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-destructive">{error || "Contact not found"}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-full flex gap-6">
      {/* Left Side - Contact Information */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/dashboard/contact-us")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Contact Us
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{getFullName(contact)}</CardTitle>
            <CardDescription>{contact.company_name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-sm">{contact.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p className="text-sm">{getFullPhone(contact)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Company</p>
                <p className="text-sm">{contact.company_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(contact.status)}`}>
                    {getStatusLabel(contact.status)}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Update Status</p>
                <div className="flex items-center gap-2">
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                    disabled={updatingStatus}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((status) => {
                        // Map API values to display labels
                        const displayLabel = status === "new" ? "New" 
                          : status === "pending" ? "Pending"
                          : status === "contacted" ? "Contacted"
                          : status === "completed" ? "Completed"
                          : status.charAt(0).toUpperCase() + status.slice(1)
                        return (
                          <SelectItem key={status} value={status}>
                            {displayLabel}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    onClick={handleStatusUpdate}
                    disabled={updatingStatus || selectedStatus === contact.status || !selectedStatus}
                  >
                    {updatingStatus ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update"
                    )}
                  </Button>
                </div>
                {statusUpdateMessage && (
                  <div className={`mt-2 text-xs p-2 rounded-md ${
                    statusUpdateMessage.type === "success" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {statusUpdateMessage.message}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Terms Accepted</p>
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  contact.terms_accepted 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {contact.terms_accepted ? "Yes" : "No"}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created At</p>
                <p className="text-sm">{formatDate(contact.created_at)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Updated At</p>
                <p className="text-sm">{formatDate(contact.updated_at)}</p>
              </div>
            </div>
            {contact.description && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                <p className="text-sm bg-muted p-3 rounded-md">{contact.description}</p>
              </div>
            )}
            {contact.status_history && contact.status_history.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Status History</p>
                <div className="space-y-2">
                  {contact.status_history.map((history, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${getStatusColor(history.status)}`}>
                        {getStatusLabel(history.status)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(history.changed_at)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Side - Notes Section */}
      <div className="w-80 border-l pl-6 flex flex-col">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Notes</h3>
          <p className="text-sm text-muted-foreground">for {getFullName(contact)}</p>
          {contact.status && (
            <div className="mt-2">
              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(contact.status)}`}>
                Status: {getStatusLabel(contact.status)}
              </span>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 bg-destructive/10 text-destructive text-sm p-3 rounded-md">
            {error}
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {contact.notes && contact.notes.length > 0 ? (
            contact.notes.map((note, index) => (
              <Card key={index} className="p-3 relative group">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-muted-foreground">{note.created_at ? formatDate(note.created_at) : "N/A"}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium text-green-600">
                      {note.created_by_name || note.created_by || "Unknown"}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteNote(index)}
                      disabled={updatingNotes}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm whitespace-pre-wrap">{note.content}</p>
              </Card>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No notes yet. Add your first note below.
            </p>
          )}
        </div>

        <div className="space-y-2 border-t pt-4">
          <Textarea
            placeholder="Add a note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={3}
            className="resize-none"
            disabled={addingNote}
          />
          <Button
            onClick={handleAddNote}
            className="w-full"
            size="sm"
            disabled={addingNote || !newNote.trim()}
          >
            {addingNote ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Note
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

