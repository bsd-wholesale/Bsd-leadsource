"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { isAuthenticated } from "@/lib/auth"

export default function GenerateLeadsPage() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [maxAmount, setMaxAmount] = useState("")
  const [desiredLeads, setDesiredLeads] = useState("")
  const [estimatedCost, setEstimatedCost] = useState("")

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth")
    }
  }, [router])

  if (!isAuthenticated()) {
    return null
  }

  // Cost estimation: 6 cycles for 10-12 leads at $4.70-6.20
  // Average: ~$5.45 per validated lead
  const calculateEstimatedCost = () => {
    const leads = parseInt(desiredLeads) || 0
    const avgCostPerLead = 5.45
    const estimated = leads * avgCostPerLead
    return estimated.toFixed(2)
  }

  const handleGenerate = () => {
    const maxAmountNum = parseFloat(maxAmount)
    const leadsNum = parseInt(desiredLeads)
    const cost = parseFloat(calculateEstimatedCost())

    if (cost > maxAmountNum) {
      alert(`Estimated cost ($${cost}) exceeds max amount ($${maxAmount}). Please adjust your settings.`)
      return
    }

    alert(`Generating ${leadsNum} leads with max spend of $${maxAmountNum}...`)
    setOpen(false)
  }

  const handleDesiredLeadsChange = (value: string) => {
    setDesiredLeads(value)
    const leads = parseInt(value) || 0
    const avgCostPerLead = 5.45
    const estimated = leads * avgCostPerLead
    setEstimatedCost(estimated.toFixed(2))
  }
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
            Set your budget and desired lead count
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
              <Button size="lg" className="w-full">
                Generate Leads
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate Leads Settings</DialogTitle>
                <DialogDescription>
                  Set your budget and desired lead count. System will stop scraping once budget limit is reached.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold">Max Amount ($)</label>
                  <Input
                    type="number"
                    placeholder="Enter max amount"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold">Desired Validated Leads</label>
                  <Input
                    type="number"
                    placeholder="Enter desired lead count"
                    value={desiredLeads}
                    onChange={(e) => handleDesiredLeadsChange(e.target.value)}
                  />
                </div>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <p className="text-sm text-gray-600 mb-2">Cost Estimator</p>
                  <p className="text-xs text-gray-500 mb-2">
                    Based on last run: 6 cycles for 10-12 leads at $4.70-6.20
                  </p>
                  <p className="text-2xl font-bold">
                    Estimated Cost: ${estimatedCost || "0.00"}
                  </p>
                  <p className="text-xs text-gray-500">
                    (~$5.45 per validated lead)
                  </p>
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleGenerate}
                  disabled={!maxAmount || !desiredLeads}
                >
                  Generate Leads
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
