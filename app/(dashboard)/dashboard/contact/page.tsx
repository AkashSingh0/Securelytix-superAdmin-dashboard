import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const mockContacts = [
  { id: 1, name: "Sarah Connor", email: "sarah@example.com", phone: "+1 (555) 111-2222", company: "Tech Solutions" },
  { id: 2, name: "Mike Johnson", email: "mike@example.com", phone: "+1 (555) 333-4444", company: "Digital Agency" },
  { id: 3, name: "Emily Davis", email: "emily@example.com", phone: "+1 (555) 555-6666", company: "Creative Studio" },
  { id: 4, name: "David Wilson", email: "david@example.com", phone: "+1 (555) 777-8888", company: "Marketing Pro" },
  { id: 5, name: "Lisa Anderson", email: "lisa@example.com", phone: "+1 (555) 999-0000", company: "Consulting Group" },
]

export default function ContactPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Contact</h1>
        <p className="text-muted-foreground">View and manage your contacts</p>
      </div>
      <div className="grid gap-4">
        {mockContacts.map((contact) => (
          <Card key={contact.id}>
            <CardHeader>
              <CardTitle>{contact.name}</CardTitle>
              <CardDescription>{contact.company}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Email:</span> {contact.email}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Phone:</span> {contact.phone}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

