"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { isAuthenticated } from "@/lib/auth"

export default function LeadsPage() {
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth")
    }
  }, [router])

  if (!isAuthenticated()) {
    return null
  }

  // Mock data - will be replaced with Supabase data
  const leads = [
    { id: 1, username: "mi.atacado.brasil", whatsapp: "+5511999999999", country: "Brazil" },
    { id: 2, username: "phoneexpress.ofc", whatsapp: "+5521970565738", country: "Brazil" },
    { id: 3, username: "cli.ckparaguay", whatsapp: "+595991500359", country: "Paraguay" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Leads</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Validated Valid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">35</div>
            <Badge className="mt-2">Priority</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Non-Validated Valid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Validated Non-Valid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Non-Validated Non-Valid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Validated Valid Leads (Priority)</CardTitle>
          <CardDescription>Brazil, Nicaragua, Paraguay</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>WhatsApp/Phone</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>{lead.username}</TableCell>
                  <TableCell>{lead.whatsapp}</TableCell>
                  <TableCell>
                    <Badge>{lead.country}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">Open</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
