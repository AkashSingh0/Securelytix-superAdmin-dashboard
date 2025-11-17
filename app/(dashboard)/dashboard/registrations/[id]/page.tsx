"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, ArrowLeft } from "lucide-react"

const mockRegistrations = [
  { 
    id: 1, 
    name: "John Doe", 
    email: "john@example.com", 
    company: "Acme Corp", 
    status: "New",
    phone: "+1 (555) 123-4567",
    position: "CEO",
    source: "Website",
    createdAt: "2024-01-15",
    registrationDate: "2024-01-15",
    eventType: "Webinar",
  },
  { 
    id: 2, 
    name: "Jane Smith", 
    email: "jane@example.com", 
    company: "Tech Inc", 
    status: "Registered",
    phone: "+1 (555) 234-5678",
    position: "CTO",
    source: "Referral",
    createdAt: "2024-01-14",
    registrationDate: "2024-01-14",
    eventType: "Conference",
  },
  { 
    id: 3, 
    name: "Bob Johnson", 
    email: "bob@example.com", 
    company: "StartupXYZ", 
    status: "Verified",
    phone: "+1 (555) 345-6789",
    position: "Founder",
    source: "LinkedIn",
    createdAt: "2024-01-13",
    registrationDate: "2024-01-13",
    eventType: "Workshop",
  },
  { 
    id: 4, 
    name: "Alice Williams", 
    email: "alice@example.com", 
    company: "BigCo", 
    status: "New",
    phone: "+1 (555) 456-7890",
    position: "VP Sales",
    source: "Website",
    createdAt: "2024-01-12",
    registrationDate: "2024-01-12",
    eventType: "Webinar",
  },
  { 
    id: 5, 
    name: "Charlie Brown", 
    email: "charlie@example.com", 
    company: "SmallBiz", 
    status: "Registered",
    phone: "+1 (555) 567-8901",
    position: "Owner",
    source: "Email Campaign",
    createdAt: "2024-01-11",
    registrationDate: "2024-01-11",
    eventType: "Conference",
  },
]

type Note = {
  id: number
  text: string
  timestamp: string
}

export default function RegistrationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const registrationId = parseInt(params.id as string)
  
  const [registrationNotes, setRegistrationNotes] = useState<Record<number, Note[]>>({
    1: [{ id: 1, text: "Initial registration completed. Very interested.", timestamp: new Date().toLocaleString() }],
    2: [{ id: 1, text: "Follow up scheduled for next week.", timestamp: new Date().toLocaleString() }],
  })
  const [newNote, setNewNote] = useState("")

  const registration = mockRegistrations.find(r => r.id === registrationId)
  const currentNotes = registrationNotes[registrationId] || []

  if (!registration) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.push("/dashboard/registrations")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Registrations
        </Button>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Registration not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleAddNote = () => {
    if (newNote.trim()) {
      setRegistrationNotes({
        ...registrationNotes,
        [registrationId]: [
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
    setRegistrationNotes({
      ...registrationNotes,
      [registrationId]: currentNotes.filter(note => note.id !== noteId)
    })
  }

  return (
    <div className="h-full flex gap-6">
      {/* Left Side - Registration Information */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/dashboard/registrations")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Registrations
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{registration.name}</CardTitle>
            <CardDescription>{registration.company} • {registration.position}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-sm">{registration.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p className="text-sm">{registration.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  {registration.status}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Source</p>
                <p className="text-sm">{registration.source}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Registration Date</p>
                <p className="text-sm">{registration.registrationDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Event Type</p>
                <p className="text-sm">{registration.eventType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created At</p>
                <p className="text-sm">{registration.createdAt}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Side - Notes Section */}
      <div className="w-80 border-l pl-6 flex flex-col">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Notes</h3>
          <p className="text-sm text-muted-foreground">for {registration.name}</p>
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
    </div>
  )
}

