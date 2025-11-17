"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Database, User, DollarSign, Info, MessageCircle, Plus, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"

const mockOrganizations = [
  { 
    id: 1, 
    name: "Acme Corporation", 
    email: "contact@acme.com", 
    industry: "Technology", 
    employees: "500-1000",
    status: "Active",
    location: "San Francisco, CA",
    createdAt: "2024-01-15",
  },
  { 
    id: 2, 
    name: "Tech Solutions Inc", 
    email: "info@techsolutions.com", 
    industry: "Software", 
    employees: "100-500",
    status: "Active",
    location: "New York, NY",
    createdAt: "2024-01-14",
  },
  { 
    id: 3, 
    name: "Digital Agency Pro", 
    email: "hello@digitalagency.com", 
    industry: "Marketing", 
    employees: "50-100",
    status: "Pending",
    location: "Los Angeles, CA",
    createdAt: "2024-01-13",
  },
  { 
    id: 4, 
    name: "StartupXYZ", 
    email: "contact@startupxyz.com", 
    industry: "Fintech", 
    employees: "10-50",
    status: "Active",
    location: "Austin, TX",
    createdAt: "2024-01-12",
  },
  { 
    id: 5, 
    name: "BigCo Industries", 
    email: "info@bigco.com", 
    industry: "Manufacturing", 
    employees: "1000+",
    status: "Active",
    location: "Chicago, IL",
    createdAt: "2024-01-11",
  },
]

type Note = {
  id: number
  text: string
  timestamp: string
}

export default function OrganizationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const organizationId = parseInt(params.id as string)
  
  const [showNotes, setShowNotes] = useState(false)
  const [organizationNotes, setOrganizationNotes] = useState<Record<number, Note[]>>({
    1: [{ id: 1, text: "Initial organization setup completed.", timestamp: new Date().toLocaleString() }],
    2: [{ id: 1, text: "Follow up scheduled for next week.", timestamp: new Date().toLocaleString() }],
  })
  const [newNote, setNewNote] = useState("")

  const organization = mockOrganizations.find(org => org.id === organizationId)
  const currentNotes = organizationNotes[organizationId] || []

  if (!organization) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.push("/dashboard/organization")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Organizations
        </Button>
        <Card>
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Organization not found</p>
          </Card>
        </Card>
      </div>
    )
  }

  const handleAddNote = () => {
    if (newNote.trim()) {
      setOrganizationNotes({
        ...organizationNotes,
        [organizationId]: [
          ...currentNotes,
          {
            id: currentNotes.length + 1,
            text: newNote,
            timestamp: new Date().toLocaleString()
          }
        ]
      })
      setNewNote("")
    }
  }

  const handleDeleteNote = (noteId: number) => {
    setOrganizationNotes({
      ...organizationNotes,
      [organizationId]: currentNotes.filter(note => note.id !== noteId)
    })
  }

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Header with Breadcrumb and Icons */}
      <div className="flex items-center justify-between">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <Link href="/dashboard/organization" className="text-muted-foreground hover:text-foreground">
            Organization
          </Link>
          <span className="text-muted-foreground"> &gt; </span>
          <span className="font-medium">{organization.name}</span>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              // TODO: Handle database icon click
            }}
          >
            <Database className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              // TODO: Handle user icon click
            }}
          >
            <User className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              // TODO: Handle dollar icon click
            }}
          >
            <DollarSign className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              // TODO: Handle info icon click
            }}
          >
            <Info className="h-5 w-5" />
          </Button>
          <Button
            variant={showNotes ? "default" : "ghost"}
            size="icon"
            onClick={() => setShowNotes(!showNotes)}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Left Side - Main Content */}
        <div className={`flex-1 space-y-6 overflow-y-auto ${showNotes ? "" : ""}`}>
          {/* Centered Content */}
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <h2 className="text-2xl font-semibold">Organization Data Vaults</h2>
            <h2 className="text-2xl font-semibold">Other Information</h2>
          </div>

          {/* Footer Lines */}
          <div className="mt-auto pt-6 border-t space-y-2">
            <div className="h-px bg-border w-full"></div>
            <div className="h-px bg-border w-full"></div>
          </div>
        </div>

        {/* Right Side - Notes Panel */}
        {showNotes && (
          <div className="w-80 border-l pl-6 flex flex-col">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Notes</h3>
              <p className="text-sm text-muted-foreground">for {organization.name}</p>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {currentNotes.length > 0 ? (
                currentNotes.map((note) => (
                  <Card key={note.id} className="p-3 relative group">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-xs text-muted-foreground">{note.timestamp}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{note.text}</p>
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
              />
              <Button onClick={handleAddNote} className="w-full" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

