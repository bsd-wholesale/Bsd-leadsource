"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { isAuthenticated } from "@/lib/auth"
import { getAllValidatedLeads, type ValidatedLead } from "@/lib/jobManager"

interface LeadWithDate extends ValidatedLead {
  createdAt: string
}

export default function LeadsPage() {
  const router = useRouter()
  const [leads, setLeads] = useState<LeadWithDate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth")
    }
  }, [router])

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const validatedLeads = await getAllValidatedLeads()
        // Add mock dates for now since getAllValidatedLeads doesn't return dates
        const leadsWithDates: LeadWithDate[] = validatedLeads.map((lead, index) => ({
          ...lead,
          createdAt: lead.createdAt || new Date(Date.now() - index * 86400000).toISOString(),
        }))
        setLeads(leadsWithDates)
      } catch (error) {
        console.error("Error fetching leads:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchLeads()
  }, [])

  if (!isAuthenticated()) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Leads</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">WhatsApp Validated Brazil/Paraguay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads.length}</div>
            <Badge className="mt-2">Priority</Badge>
            <p className="text-xs text-gray-500 mt-2">All leads are WhatsApp-validated from target countries</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Validated Leads</CardTitle>
          <CardDescription>Brazil, Nicaragua, Paraguay - WhatsApp validated contacts</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-gray-600">Loading leads...</p>
          ) : leads.length === 0 ? (
            <p className="text-sm text-gray-600">No validated leads found yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>WhatsApp Number</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Date Added</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{lead.username}</TableCell>
                    <TableCell>
                      <a href={`tel:${lead.whatsapp}`} className="text-blue-600 hover:underline">
                        {lead.whatsapp}
                      </a>
                    </TableCell>
                    <TableCell>
                      <Badge>{lead.country}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
