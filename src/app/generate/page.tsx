import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function GenerateLeadsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Generate Leads</h2>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Auto-Ranking System</CardTitle>
          <CardDescription>
            Hashtags and terms are automatically ranked monthly based on performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Current Seed Base</p>
                <p className="text-sm text-gray-600">Auto-updates monthly based on performance</p>
              </div>
              <Badge>Active</Badge>
            </div>
            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-2">Top Performing Hashtags:</p>
              <div className="flex gap-2 flex-wrap">
                <Badge>revendacelulares</Badge>
                <Badge>fornecedorcelulares</Badge>
                <Badge>atacadocelulares</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Generate Leads</CardTitle>
          <CardDescription>
            Press the button to generate Instagram leads automatically
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button size="lg" className="w-full">
            Generate Leads
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Last Generation Results</CardTitle>
          <CardDescription>Breakdown of extracted leads</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <p className="font-semibold mb-2">Terms Used</p>
              <p className="text-sm text-gray-600">revendacelulares, fornecedorcelulares, atacadocelulares</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="font-semibold mb-2">URL Used</p>
              <p className="text-sm text-gray-600">instagram.com/hashtags</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="font-semibold mb-2">Validated Valid Leads</p>
              <p className="text-2xl font-bold">35</p>
              <Badge className="mt-2">Shown</Badge>
            </div>
            <div className="border rounded-lg p-4">
              <p className="font-semibold mb-2">Validated Non-Valid Leads</p>
              <p className="text-2xl font-bold">0</p>
              <Badge className="mt-2">Shown</Badge>
            </div>
            <div className="border rounded-lg p-4">
              <p className="font-semibold mb-2">Non-Validated Leads</p>
              <p className="text-2xl font-bold">33</p>
              <Badge className="mt-2">Sent to Supabase</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
