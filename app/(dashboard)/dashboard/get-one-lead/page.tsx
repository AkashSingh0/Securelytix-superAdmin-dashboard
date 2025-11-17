import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const mockLead = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  phone: "+1 (555) 123-4567",
  company: "Acme Corp",
  position: "CEO",
  status: "Qualified",
  source: "Website",
  createdAt: "2024-01-15",
  notes: "Interested in enterprise plan. Follow up next week.",
}

export default function GetOneLeadPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Get One Lead</h1>
        <p className="text-muted-foreground">Detailed information about a specific lead</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{mockLead.name}</CardTitle>
          <CardDescription>{mockLead.company} • {mockLead.position}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-sm">{mockLead.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p className="text-sm">{mockLead.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                {mockLead.status}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Source</p>
              <p className="text-sm">{mockLead.source}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created At</p>
              <p className="text-sm">{mockLead.createdAt}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Notes</p>
            <p className="text-sm bg-muted p-3 rounded-md">{mockLead.notes}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

