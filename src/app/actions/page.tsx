import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ActionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Actions</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Send Email</CardTitle>
            <CardDescription>Send email to a lead</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-semibold">To</label>
              <Input placeholder="email@example.com" />
            </div>
            <div>
              <label className="text-sm font-semibold">Subject</label>
              <Input placeholder="Email subject" />
            </div>
            <div>
              <label className="text-sm font-semibold">Message</label>
              <Textarea placeholder="Your message" rows={4} />
            </div>
            <Button className="w-full">Send Email</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generate Invoice</CardTitle>
            <CardDescription>Create an invoice for a lead</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-semibold">Lead Name</label>
              <Input placeholder="Lead name" />
            </div>
            <div>
              <label className="text-sm font-semibold">Amount</label>
              <Input placeholder="Amount" type="number" />
            </div>
            <div>
              <label className="text-sm font-semibold">Description</label>
              <Textarea placeholder="Invoice description" rows={3} />
            </div>
            <Button className="w-full">Generate Invoice</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Send WhatsApp Message</CardTitle>
            <CardDescription>Send WhatsApp message to a lead</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-semibold">Phone Number</label>
              <Input placeholder="+5511987654321" />
            </div>
            <div>
              <label className="text-sm font-semibold">Message</label>
              <Textarea placeholder="Your WhatsApp message" rows={4} />
            </div>
            <Button className="w-full">Send WhatsApp</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Update Lead Status</CardTitle>
            <CardDescription>Update lead status in database</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-semibold">Lead ID</label>
              <Input placeholder="Lead ID" />
            </div>
            <div>
              <label className="text-sm font-semibold">Status</label>
              <Input placeholder="Contacted, No Answer, Not Interested" />
            </div>
            <Button className="w-full">Update Status</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
