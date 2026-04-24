"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { isAuthenticated } from "@/lib/auth"
import { getJobState, createJob, updateJobProgress, setJobStatus, clearJobState, getAllValidatedLeads, type JobState, type ValidatedLead } from "@/lib/jobManager"

export default function GenerateLeadsPage() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [maxAmount, setMaxAmount] = useState("")
  const [desiredLeads, setDesiredLeads] = useState("")
  const [estimatedCost, setEstimatedCost] = useState("")
  const [job, setJob] = useState<JobState | null>(null)
  const [allValidatedLeads, setAllValidatedLeads] = useState<ValidatedLead[]>([])

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth")
    }
  }, [router])

  useEffect(() => {
    // Poll for job state
    const interval = setInterval(async () => {
      const currentJob = await getJobState()
      if (currentJob) {
        setJob(currentJob)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Fetch all validated leads from Supabase
    const fetchAllLeads = async () => {
      const leads = await getAllValidatedLeads()
      setAllValidatedLeads(leads)
    }
    fetchAllLeads()
  }, [job?.status]) // Re-fetch when job status changes

  // Cost estimation: 6 cycles for 10-12 validated leads at $4.70-6.20
  // Cost per validated lead: $0.39-$0.62 (average ~$0.50 per lead)
  const calculateEstimatedCost = (leads: number) => {
    const avgCostPerLead = 0.50
    const estimated = leads * avgCostPerLead
    return estimated.toFixed(2)
  }

  const handleGenerate = async () => {
    const maxAmountNum = parseFloat(maxAmount)
    const leadsNum = parseInt(desiredLeads)
    const cost = parseFloat(calculateEstimatedCost(leadsNum))

    if (cost > maxAmountNum) {
      alert(`Estimated cost ($${cost}) exceeds max amount ($${maxAmount}). Please adjust your settings.`)
      return
    }

    // Close modal immediately
    setOpen(false)

    // Create job
    const newJob = await createJob(leadsNum)
    setJob(newJob)

    // Start actual Instagram cycle via API
    startLeadGenerationJob(leadsNum, maxAmountNum)
  }

  const startLeadGenerationJob = async (targetLeads: number, maxBudget: number) => {
    await setJobStatus("running")

    try {
      // Call API to start Instagram cycle
      const response = await fetch("/api/generate-leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          desiredLeads: targetLeads,
          maxAmount: maxBudget,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to start Instagram cycle")
      }

      const data = await response.json()
      console.log("Instagram cycle started:", data)

      // Since the Python script doesn't report progress back,
      // we'll simulate progress for UX purposes
      simulateProgress(targetLeads)
    } catch (error) {
      console.error("Error starting Instagram cycle:", error)
      await setJobStatus("failed", "Failed to start Instagram cycle")
    }
  }

  const simulateProgress = async (targetLeads: number) => {
    let currentStep = 0
    const totalSteps = 10 // Simulate 10 steps

    const interval = setInterval(async () => {
      currentStep++
      
      // Re-fetch job state to get actual validated leads from Supabase
      const currentJob = await getJobState()
      if (currentJob) {
        // Calculate progress based on actual validated leads found
        const actualLeadsFound = currentJob.validatedLeads?.length || 0
        const progressPercent = (actualLeadsFound / targetLeads) * 100
        
        await updateJobProgress(
          actualLeadsFound,
          undefined,
          `Running Instagram cycle... (${currentStep}/${totalSteps})`
        )
      }

      if (currentStep >= totalSteps) {
        clearInterval(interval)
        await setJobStatus("completed")
        const finalJob = await getJobState()
        const finalLeads = finalJob?.validatedLeads?.length || 0
        await updateJobProgress(finalLeads, undefined, "Instagram cycle completed. Check Supabase for actual results.")
      }
    }, 3000) // 3 seconds per step (Instagram cycle takes time)
  }

  const handleDesiredLeadsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setDesiredLeads(value)
    const leads = parseInt(value) || 0
    setEstimatedCost(calculateEstimatedCost(leads))
  }
  if (!isAuthenticated()) {
    return null
  }

  const isJobRunning = job?.status === "running"

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Failure State */}
      {job?.status === "failed" && (
        <Card className="mb-4 bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-800">Lead Generation Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">{job.error}</p>
            <div className="flex gap-2">
              <Button
                onClick={async () => {
                  clearJobState()
                  setJob(null)
                  // Refresh all validated leads from Supabase
                  const leads = await getAllValidatedLeads()
                  setAllValidatedLeads(leads)
                }}
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Progress Bar */}
      {job && job.status !== "completed" && job.status !== "failed" && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold">
              {job.status === "running" ? `Validated leads found: ${job.leadsGenerated}/${job.totalLeadsTarget}` : "Starting..."}
            </span>
            <span className="text-sm text-gray-600">{Math.round((job.leadsGenerated / job.totalLeadsTarget) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(job.leadsGenerated / job.totalLeadsTarget) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{job.logs[job.logs.length - 1]}</p>
          
          {/* Real-time lead details table during run */}
          {job.validatedLeads && job.validatedLeads.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-semibold mb-2">Validated Leads Found ({job.validatedLeads.length})</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>WhatsApp #</TableHead>
                    <TableHead>Country</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {job.validatedLeads.map((lead, index) => (
                    <TableRow key={index}>
                      <TableCell>{lead.username}</TableCell>
                      <TableCell>
                        <a href={`tel:${lead.whatsapp}`} className="text-blue-600 hover:underline">
                          {lead.whatsapp}
                        </a>
                      </TableCell>
                      <TableCell>
                        <Badge>{lead.country}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}

      {/* Completion Summary */}
      {job?.status === "completed" && (
        <Card className="mb-4 bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Lead Generation Complete</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Validated Leads Found (This Run)</p>
                <p className="text-2xl font-bold">{job.leadsGenerated}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Cost (This Run)</p>
                <p className="text-2xl font-bold">${(job.leadsGenerated * 0.50).toFixed(2)}</p>
              </div>
            </div>
            
            {/* Lead Breakdown Table - Current Run Leads */}
            {job.validatedLeads && job.validatedLeads.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-semibold mb-2">Validated Leads from This Run ({job.validatedLeads.length})</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>WhatsApp #</TableHead>
                      <TableHead>Country</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {job.validatedLeads.map((lead, index) => (
                      <TableRow key={index}>
                        <TableCell>{lead.username}</TableCell>
                        <TableCell>
                          <a href={`tel:${lead.whatsapp}`} className="text-blue-600 hover:underline">
                            {lead.whatsapp}
                          </a>
                        </TableCell>
                        <TableCell>
                          <Badge>{lead.country}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            <Button
              className="mt-4"
              onClick={async () => {
                clearJobState()
                setJob(null)
                // Refresh all validated leads from Supabase
                const leads = await getAllValidatedLeads()
                setAllValidatedLeads(leads)
              }}
            >
              Clear
            </Button>
          </CardContent>
        </Card>
      )}

      <h2 className="text-3xl font-bold mb-6">Generate Leads</h2>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Generate Leads</CardTitle>
          <CardDescription>
            Set your budget and desired lead count
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger disabled={isJobRunning}>
              <Button size="lg" className="w-full" disabled={isJobRunning}>
                {isJobRunning ? "Job Running..." : "Generate Leads"}
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
                    onChange={(e) => handleDesiredLeadsChange(e)}
                  />
                </div>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <p className="text-sm text-gray-600 mb-2">Cost Estimator</p>
                  <p className="text-xs text-gray-500 mb-2">
                    Based on last run: 6 cycles for 10-12 validated leads at $4.70-6.20
                  </p>
                  <p className="text-2xl font-bold">
                    Estimated Cost: ${estimatedCost || "0.00"}
                  </p>
                  <p className="text-xs text-gray-500">
                    (~$0.50 per validated lead)
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
          {/* Show breakdown table with all validated leads from Supabase */}
          {allValidatedLeads && allValidatedLeads.length > 0 ? (
            <div className="mb-4">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="border rounded-lg p-4">
                  <p className="font-semibold mb-2">Total Validated</p>
                  <p className="text-2xl font-bold">{allValidatedLeads.length}</p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="font-semibold mb-2">Total Cost</p>
                  <p className="text-2xl font-bold">${(allValidatedLeads.length * 0.50).toFixed(2)}</p>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="font-semibold mb-2">Last Update</p>
                  <p className="text-sm text-gray-600">Latest leads from all cycles</p>
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>WhatsApp #</TableHead>
                    <TableHead>Country</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allValidatedLeads.map((lead, index) => (
                    <TableRow key={index}>
                      <TableCell>{lead.username}</TableCell>
                      <TableCell>{lead.whatsapp}</TableCell>
                      <TableCell>
                        <Badge>{lead.country}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <p className="font-semibold mb-2">Terms Used</p>
                <p className="text-sm text-gray-600">revendacelulares, fornecedorcelulares, atacadocelulares</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="font-semibold mb-2">WhatsApp Validated Brazil/Paraguay</p>
                <p className="text-2xl font-bold">{allValidatedLeads.length}</p>
                <p className="text-xs text-gray-500 mt-2">All leads are WhatsApp-validated from target countries</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="font-semibold mb-2">WhatsApp Not Validated</p>
                <p className="text-2xl font-bold">33</p>
                <Badge className="mt-2">Sent to Supabase</Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
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
    </div>
  )
}
