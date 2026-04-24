"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

const VERIFICATION_CODE = "6890"

export default function AuthPage() {
  const router = useRouter()
  const [code, setCode] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")

  const handleVerifyCode = () => {
    setLoading(true)
    setTimeout(() => {
      if (code === VERIFICATION_CODE) {
        localStorage.setItem("auth", "true")
        router.push("/")
      } else {
        setError("Invalid code")
        setLoading(false)
      }
    }, 500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
          <CardDescription>
            Enter the verification code to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Enter 4-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={4}
              className="text-center text-2xl tracking-widest"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button 
            className="w-full" 
            onClick={handleVerifyCode}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify Code"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
