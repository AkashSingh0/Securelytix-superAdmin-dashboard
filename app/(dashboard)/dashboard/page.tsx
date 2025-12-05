"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DollarSign, TrendingUp, TrendingDown, Users, GripVertical, Check, Star, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const kpiCards = [
  {
    title: "Total Revenue",
    value: "$1,250.00",
    change: "+12.5%",
    changeType: "increase",
    description: "Trending up this month",
    subtitle: "Visitors for the last 6 months",
  },
  {
    title: "New Customers",
    value: "1,234",
    change: "-20%",
    changeType: "decrease",
    description: "Down 20% this period",
    subtitle: "Acquisition needs attention",
  },
  {
    title: "Active Accounts",
    value: "45,678",
    change: "+12.5%",
    changeType: "increase",
    description: "Strong user retention",
    subtitle: "Engagement exceed targets",
  },
  {
    title: "Growth Rate",
    value: "4.5%",
    change: "+4.5%",
    changeType: "increase",
    description: "Steady performance increase",
    subtitle: "Meets growth projections",
  },
]

const tableData = [
  {
    id: 1,
    header: "Cover page",
    sectionType: "Cover page",
    status: "In Process",
    statusIcon: "star",
    target: "18",
    limit: "5",
    reviewer: "Eddie Lake",
  },
  {
    id: 2,
    header: "Table of contents",
    sectionType: "Table of contents",
    status: "Done",
    statusIcon: "check",
    target: "29",
    limit: "24",
    reviewer: "Eddie Lake",
  },
  {
    id: 3,
    header: "Executive summary",
    sectionType: "Narrative",
    status: "Done",
    statusIcon: "check",
    target: "10",
    limit: "13",
    reviewer: "Eddie Lake",
  },
  {
    id: 4,
    header: "Technical approach",
    sectionType: "Narrative",
    status: "Done",
    statusIcon: "check",
    target: "27",
    limit: "23",
    reviewer: "Jamik Tashpulatov",
  },
  {
    id: 5,
    header: "Design",
    sectionType: "Narrative",
    status: "In Process",
    statusIcon: "star",
    target: "2",
    limit: "16",
    reviewer: "Jamik Tashpulatov",
  },
  {
    id: 6,
    header: "Capabilities",
    sectionType: "Narrative",
    status: "In Process",
    statusIcon: "star",
    target: "20",
    limit: "8",
    reviewer: "Jamik Tashpulatov",
  },
  {
    id: 7,
    header: "Integration with existing systems",
    sectionType: "Narrative",
    status: "In Process",
    statusIcon: "star",
    target: "19",
    limit: "21",
    reviewer: "Jamik Tashpulatov",
  },
  {
    id: 8,
    header: "Innovation and Advantages",
    sectionType: "Narrative",
    status: "Done",
    statusIcon: "check",
    target: "25",
    limit: "26",
    reviewer: "Assign reviewer",
  },
  {
    id: 9,
    header: "Overview of EMR's Innovative Solutions",
    sectionType: "Technical content",
    status: "Done",
    statusIcon: "check",
    target: "7",
    limit: "23",
    reviewer: "Assign reviewer",
  },
  {
    id: 10,
    header: "Advanced Algorithms and Machine Learning",
    sectionType: "Narrative",
    status: "Done",
    statusIcon: "check",
    target: "30",
    limit: "28",
    reviewer: "Assign reviewer",
  },
]

const visitorData = [
  { date: "Jun 24", visitors: 1200 },
  { date: "Jun 25", visitors: 1900 },
  { date: "Jun 26", visitors: 3000 },
  { date: "Jun 27", visitors: 2780 },
  { date: "Jun 28", visitors: 1890 },
  { date: "Jun 29", visitors: 2390 },
  { date: "Jun 30", visitors: 3490 },
]

export default function DashboardPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("3months")
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  const toggleRowSelection = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    )
  }

  const toggleAllSelection = () => {
    if (selectedRows.length === tableData.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(tableData.map((row) => row.id))
    }
  }

  const totalPages = Math.ceil(tableData.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const currentData = tableData.slice(startIndex, endIndex)

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{kpi.value}</div>
              <div className="flex items-center gap-2 mb-1">
                {kpi.changeType === "increase" ? (
                  <TrendingUp className="h-4 w-4 text-accent" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span
                  className={`text-sm font-medium ${
                    kpi.changeType === "increase" ? "text-accent" : "text-red-600"
                  }`}
                >
                  {kpi.change}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{kpi.description}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Total Visitors Graph */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Total Visitors</CardTitle>
              <CardDescription>Total for the last 3 months</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedTimeRange === "3months" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTimeRange("3months")}
              >
                Last 3 months
              </Button>
              <Button
                variant={selectedTimeRange === "30days" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTimeRange("30days")}
              >
                Last 30 days
              </Button>
              <Button
                variant={selectedTimeRange === "7days" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTimeRange("7days")}
              >
                Last 7 days
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitorData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="visitors" 
                  stroke="#8884d8" 
                  fillOpacity={1} 
                  fill="url(#colorVisitors)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Table Section with Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Tabs defaultValue="outline" className="w-full">
              <TabsList>
                <TabsTrigger value="outline">Outline</TabsTrigger>
                <TabsTrigger value="past-performance">
                  Past Performance
                  <Badge variant="secondary" className="ml-2">
                    3
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="key-personnel">
                  Key Personnel
                  <Badge variant="secondary" className="ml-2">
                    2
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="focus-documents">Focus Documents</TabsTrigger>
              </TabsList>
              <TabsContent value="outline" className="mt-4">
                <div className="flex items-center justify-between mb-4">
                  <div></div>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="10">
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Customize Columns" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">Customize Columns</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm">
                      + Add Section
                    </Button>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={selectedRows.length === tableData.length}
                          onCheckedChange={toggleAllSelection}
                        />
                      </TableHead>
                      <TableHead>Header</TableHead>
                      <TableHead>Section Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Limit</TableHead>
                      <TableHead>Reviewer</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentData.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                            <Checkbox
                              checked={selectedRows.includes(row.id)}
                              onCheckedChange={() => toggleRowSelection(row.id)}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{row.header}</TableCell>
                        <TableCell>{row.sectionType}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {row.statusIcon === "check" ? (
                              <Check className="h-4 w-4 text-accent" />
                            ) : (
                              <Star className="h-4 w-4 text-yellow-600" />
                            )}
                            <span>{row.status}</span>
                          </div>
                        </TableCell>
                        <TableCell>{row.target}</TableCell>
                        <TableCell>{row.limit}</TableCell>
                        <TableCell>
                          {row.reviewer === "Assign reviewer" ? (
                            <Select>
                              <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Assign reviewer" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="eddie">Eddie Lake</SelectItem>
                                <SelectItem value="jamik">Jamik Tashpulatov</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            row.reviewer
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    {selectedRows.length} of {tableData.length} row(s) selected.
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={rowsPerPage.toString()}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="past-performance" className="mt-4">
                <p className="text-muted-foreground">Past Performance content coming soon</p>
              </TabsContent>
              <TabsContent value="key-personnel" className="mt-4">
                <p className="text-muted-foreground">Key Personnel content coming soon</p>
              </TabsContent>
              <TabsContent value="focus-documents" className="mt-4">
                <p className="text-muted-foreground">Focus Documents content coming soon</p>
              </TabsContent>
            </Tabs>
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}
