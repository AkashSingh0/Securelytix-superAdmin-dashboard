"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, ArrowLeft } from "lucide-react"

const mockContacts = [
  { 
    id: 1, 
    name: "Sarah Connor", 
    email: "sarah@example.com", 
    company: "Tech Solutions", 
    status: "Active",
    phone: "+1 (555) 111-2222",
    subject: "Product Inquiry",
    message: "I'm interested in learning more about your enterprise solutions.",
    createdAt: "2024-01-15",
  },
  { 
    id: 2, 
    name: "Mike Johnson", 
    email: "mike@example.com", 
    company: "Digital Agency", 
    status: "Pending",
    phone: "+1 (555) 333-4444",
    subject: "Support Request",
    message: "Need help with account setup and configuration.",
    createdAt: "2024-01-14",
  },
  { 
    id: 3, 
    name: "Emily Davis", 
    email: "emily@example.com", 
    company: "Creative Studio", 
    status: "Resolved",
    phone: "+1 (555) 555-6666",
    subject: "Billing Question",
    message: "Question about invoice #12345 and payment terms.",
    createdAt: "2024-01-13",
  },
  { 
    id: 4, 
    name: "David Wilson", 
    email: "david@example.com", 
    company: "Marketing Pro", 
    status: "Active",
    phone: "+1 (555) 777-8888",
    subject: "Feature Request",
    message: "Would like to request a new feature for analytics dashboard.",
    createdAt: "2024-01-12",
  },
  { 
    id: 5, 
    name: "Lisa Anderson", 
    email: "lisa@example.com", 
    company: "Consulting Group", 
    status: "Pending",
    phone: "+1 (555) 999-0000",
    subject: "General Inquiry",
    message: "General questions about pricing and plans.",
    createdAt: "2024-01-11",
  },
]

type Note = {
  id: number
  text: string
  timestamp: string
}

export default function ContactDetailPage() {
  const params = useParams()
  const router = useRouter()
  const contactId = parseInt(params.id as string)
  
  const [contactNotes, setContactNotes] = useState<Record<number, Note[]>>({
    1: [{ id: 1, text: "Initial inquiry received. Very interested.", timestamp: new Date().toLocaleString() }],
    2: [{ id: 1, text: "Follow up scheduled for next week.", timestamp: new Date().toLocaleString() }],
  })
  const [newNote, setNewNote] = useState("")

  const contact = mockContacts.find(c => c.id === contactId)
  const currentNotes = contactNotes[contactId] || []

  if (!contact) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.push("/dashboard/contact-us")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Contact Us
        </Button>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Contact not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleAddNote = () => {
    if (newNote.trim()) {
      setContactNotes({
        ...contactNotes,
        [contactId]: [
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
    setContactNotes({
      ...contactNotes,
      [contactId]: currentNotes.filter(note => note.id !== noteId)
    })
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
            <CardTitle>{contact.name}</CardTitle>
            <CardDescription>{contact.company}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-sm">{contact.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p className="text-sm">{contact.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  {contact.status}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Subject</p>
                <p className="text-sm">{contact.subject}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created At</p>
                <p className="text-sm">{contact.createdAt}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Message</p>
              <p className="text-sm bg-muted p-3 rounded-md">{contact.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Side - Notes Section */}
      <div className="w-80 border-l pl-6 flex flex-col">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Notes</h3>
          <p className="text-sm text-muted-foreground">for {contact.name}</p>
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

