"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

const PHONE_NUMBERS = [
  { id: "A", number: "917-724-6262" },
  { id: "B", number: "347-245-8058" },
  { id: "C", number: "347-369-1987" },
  { id: "D", number: "347-228-0631" },
]

export default function AuthPage() {
  const router = useRouter()
  const [selectedPhone, setSelectedPhone] = useState<string>("")
  const [code, setCode] = useState<string>("")
  const [step, setStep] = useState<"phone" | "code">("phone")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")

  const handlePhoneSelect = (phone: string) => {
    setSelectedPhone(phone)
    setError("")
  }

  const handleSendCode = async () => {
    if (!selectedPhone) {
      setError("Please select a phone number")
      return
    }

    setLoading(true)
    // Simulate sending SMS code
    setTimeout(() => {
      setStep("code")
      setLoading(false)
    }, 1000)
  }

  const handleVerifyCode = () => {
    setLoading(true)
    // Simple verification - accept any 4-digit code
    setTimeout(() => {
      if (code.length === 4) {
        // Store auth state in localStorage
        localStorage.setItem("auth", "true")
        router.push("/")
      } else {
        setError("Please enter a 4-digit code")
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
            {step === "phone" 
              ? "Select a phone number to receive verification code"
              : "Enter the 4-digit code sent to your phone"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === "phone" ? (
            <div className="space-y-3">
              {PHONE_NUMBERS.map((phone) => (
                <Button
                  key={phone.id}
                  variant={selectedPhone === phone.number ? "default" : "outline"}
                  className="w-full justify-start text-left"
                  onClick={() => handlePhoneSelect(phone.number)}
                >
                  <span className="font-semibold mr-2">{phone.id}.</span> {phone.number}
                </Button>
              ))}
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button 
                className="w-full" 
                onClick={handleSendCode}
                disabled={loading || !selectedPhone}
              >
                {loading ? "Sending..." : "Send Verification Code"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Code sent to: <span className="font-semibold">{selectedPhone}</span>
                </p>
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
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setStep("phone")
                  setCode("")
                  setError("")
                }}
              >
                Back
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
