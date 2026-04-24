import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Leads</CardTitle>
            <CardDescription>Leads generated today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>This Week's Leads</CardTitle>
            <CardDescription>Leads generated this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leads Sent/Invoiced</CardTitle>
            <CardDescription>Closed deals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leads Contacted</CardTitle>
            <CardDescription>Leads began contact</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>No Answer/NG</CardTitle>
            <CardDescription>Leads not interested</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Validated</CardTitle>
            <CardDescription>Validated WhatsApp leads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">35</div>
            <Badge className="mt-2">Valid</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
