"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

export default function PinEntry() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pin, setPin] = useState("")
  const [attempts, setAttempts] = useState(0)
  const [error, setError] = useState("")
  const [isLocked, setIsLocked] = useState(false)

  const payTag = searchParams.get("payTag")
  const amount = searchParams.get("amount")
  const memo = searchParams.get("memo")

  const correctPin = "123456" // Mock PIN

  const handlePinInput = (digit: string) => {
    if (pin.length < 6 && !isLocked) {
      setPin((prev) => prev + digit)
    }
  }

  const handlePinDelete = () => {
    setPin((prev) => prev.slice(0, -1))
    setError("")
  }

  const handlePinClear = () => {
    setPin("")
    setError("")
  }

  useEffect(() => {
    if (pin.length === 6) {
      if (pin === correctPin) {
        // Generate transaction ID and redirect to success
        const transactionId = "TXN" + Date.now().toString().slice(-9)
        router.push(
          `/send/success?transactionId=${transactionId}&payTag=${encodeURIComponent(payTag || "")}&amount=${amount}&memo=${encodeURIComponent(memo || "")}`,
        )
      } else {
        const newAttempts = attempts + 1
        setAttempts(newAttempts)
        setError(`Incorrect PIN. ${3 - newAttempts} attempts remaining.`)
        setPin("")

        if (newAttempts >= 3) {
          setIsLocked(true)
          setError("Too many incorrect attempts. Transfer capability temporarily locked.")
        }
      }
    }
  }, [pin, attempts, correctPin, router, payTag, amount, memo])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 pt-8 pb-4">
          <Link href="/send">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Authorize Transfer</h1>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle>Enter Your PIN</CardTitle>
            <p className="text-gray-600">Enter your 6-digit PIN to authorize this transfer</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Transfer Summary */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">To:</span>
                <span className="font-medium">{payTag}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-bold">${amount}</span>
              </div>
              {memo && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Memo:</span>
                  <span className="text-sm">{memo}</span>
                </div>
              )}
            </div>

            {/* PIN Display */}
            <div className="flex justify-center gap-2">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center ${
                    i < pin.length ? "border-blue-600 bg-blue-50" : "border-gray-300 bg-white"
                  }`}
                >
                  {i < pin.length && <div className="w-3 h-3 bg-blue-600 rounded-full"></div>}
                </div>
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            {/* PIN Keypad */}
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                <Button
                  key={digit}
                  variant="outline"
                  size="lg"
                  onClick={() => handlePinInput(digit.toString())}
                  disabled={isLocked}
                  className="h-14 text-lg font-semibold"
                >
                  {digit}
                </Button>
              ))}
              <Button
                variant="outline"
                size="lg"
                onClick={handlePinClear}
                disabled={isLocked}
                className="h-14 bg-transparent"
              >
                Clear
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => handlePinInput("0")}
                disabled={isLocked}
                className="h-14 text-lg font-semibold"
              >
                0
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handlePinDelete}
                disabled={isLocked}
                className="h-14 bg-transparent"
              >
                ⌫
              </Button>
            </div>

            {isLocked && (
              <div className="text-center">
                <p className="text-sm text-gray-600">Please contact customer support or try again later.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
