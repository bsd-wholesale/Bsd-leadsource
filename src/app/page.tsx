"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { isAuthenticated, logout } from "@/lib/auth"

export default function Dashboard() {
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth")
    }
  }, [router])

  const handleLogout = () => {
    logout()
    router.push("/auth")
  }

  if (!isAuthenticated()) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-gray-900">
          Logout
        </button>
      </div>
      
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
            <CardTitle>Leads Left to Contact</CardTitle>
            <CardDescription>Leads not yet contacted</CardDescription>
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

        <Link href="/leads?category=validated" className="cursor-pointer">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>WhatsApp Validated Brazil/Paraguay</CardTitle>
              <CardDescription>Validated WhatsApp leads</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">35</div>
              <Badge className="mt-2">Valid</Badge>
            </CardContent>
          </Card>
        </Link>

        <Link href="/leads?category=not-validated" className="cursor-pointer">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>WhatsApp Not Validated</CardTitle>
              <CardDescription>Non-validated WhatsApp leads</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">0</div>
              <Badge variant="secondary" className="mt-2">Pending</Badge>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
