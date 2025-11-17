import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const mockContact = {
  id: 1,
  name: "Sarah Connor",
  email: "sarah@example.com",
  phone: "+1 (555) 111-2222",
  mobile: "+1 (555) 111-2223",
  company: "Tech Solutions",
  position: "CTO",
  address: "123 Main St, San Francisco, CA 94102",
  website: "https://techsolutions.com",
  tags: ["VIP", "Enterprise"],
  lastContacted: "2024-01-20",
  notes: "Very interested in our premium features. Scheduled demo for next month.",
}

export default function GetOneContactPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Get One Contact</h1>
        <p className="text-muted-foreground">Detailed information about a specific contact</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{mockContact.name}</CardTitle>
          <CardDescription>{mockContact.company} • {mockContact.position}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-sm">{mockContact.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p className="text-sm">{mockContact.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Mobile</p>
              <p className="text-sm">{mockContact.mobile}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Website</p>
              <p className="text-sm text-primary hover:underline">
                <a href={mockContact.website} target="_blank" rel="noopener noreferrer">
                  {mockContact.website}
                </a>
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Address</p>
              <p className="text-sm">{mockContact.address}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Contacted</p>
              <p className="text-sm">{mockContact.lastContacted}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tags</p>
              <div className="flex gap-2 mt-1">
                {mockContact.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Notes</p>
            <p className="text-sm bg-muted p-3 rounded-md">{mockContact.notes}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

