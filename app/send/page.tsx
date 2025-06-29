"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Search, User, DollarSign } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { findUserByPayTag } from "@/lib/auth"

export default function SendMoney() {
  const router = useRouter()
  const { user, profile, loading } = useAuth()
  const [step, setStep] = useState(1)
  const [payTag, setPayTag] = useState("")
  const [amount, setAmount] = useState("")
  const [memo, setMemo] = useState("")
  const [recipient, setRecipient] = useState<any>(null)
  const [error, setError] = useState("")
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  const handlePayTagSearch = async () => {
    setError("")
    setSearching(true)

    if (!payTag.startsWith("@")) {
      setError("PayTag must start with @")
      setSearching(false)
      return
    }

    if (payTag === profile?.pay_tag) {
      setError("You cannot send money to yourself")
      setSearching(false)
      return
    }

    try {
      const user = await findUserByPayTag(payTag)
      if (!user) {
        setError("User not found")
        setSearching(false)
        return
      }

      setRecipient(user)
      setStep(2)
    } catch (err) {
      setError("User not found")
    } finally {
      setSearching(false)
    }
  }

  const handleAmountNext = () => {
    setError("")
    const amountNum = Number.parseFloat(amount)
    if (!amount || amountNum <= 0) {
      setError("Amount must be greater than zero")
      return
    }
    if (amountNum > (profile?.balance || 0)) {
      setError("Amount exceeds available balance")
      return
    }
    setStep(3)
  }

  const handleConfirm = () => {
    router.push(`/send/pin?recipientId=${recipient.id}&amount=${amount}&memo=${encodeURIComponent(memo)}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 pt-8 pb-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Send Money</h1>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                i <= step ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              {i}
            </div>
          ))}
        </div>

        {/* Step 1: Recipient Selection */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Find Recipient
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="payTag">Enter PayTag</Label>
                <div className="relative">
                  <Input
                    id="payTag"
                    placeholder="@username"
                    value={payTag}
                    onChange={(e) => setPayTag(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                </div>
              </div>

              {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

              <Button onClick={handlePayTagSearch} className="w-full" disabled={searching}>
                {searching ? "Searching..." : "Find User"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Amount Entry */}
        {step === 2 && recipient && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Enter Amount
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Recipient Info */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">{recipient.full_name}</p>
                  <p className="text-sm text-gray-500">{recipient.pay_tag}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  step="0.01"
                  min="0"
                />
                <p className="text-xs text-gray-500">Available balance: ${profile.balance.toFixed(2)}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="memo">Memo (Optional)</Label>
                <Textarea
                  id="memo"
                  placeholder="What's this for?"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  rows={3}
                />
              </div>

              {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleAmountNext} className="flex-1">
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && recipient && (
          <Card>
            <CardHeader>
              <CardTitle>Review Transfer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">To:</span>
                  <div className="text-right">
                    <p className="font-medium">{recipient.full_name}</p>
                    <p className="text-sm text-gray-500">{recipient.pay_tag}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-bold text-lg">${Number.parseFloat(amount).toFixed(2)}</span>
                </div>

                {memo && (
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Memo:</span>
                    <span className="text-right max-w-48">{memo}</span>
                  </div>
                )}

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">From:</span>
                  <span>{profile.pay_tag}</span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Security Notice:</strong> You'll be asked to enter your 6-digit PIN to authorize this
                  transfer.
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleConfirm} className="flex-1">
                  Authorize Transfer
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
