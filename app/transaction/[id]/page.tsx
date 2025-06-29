"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Download, Share, Copy, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function TransactionDetails({ params }: { params: { id: string } }) {
  const [copied, setCopied] = useState(false)

  // Mock transaction data - in real app, this would be fetched based on params.id
  const transaction = {
    id: params.id,
    type: "outgoing",
    recipient: "Sarah Johnson",
    payTag: "@sarah_j",
    amount: 25.0,
    memo: "Coffee split",
    date: "2024-01-15",
    time: "14:30",
    status: "completed",
    fromAccount: "****1234",
    toAccount: "****5678",
  }

  const handleCopyTransactionId = () => {
    navigator.clipboard.writeText(transaction.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadReceipt = () => {
    // Mock receipt download
    alert("Receipt downloaded successfully!")
  }

  const handleShareReceipt = () => {
    if (navigator.share) {
      navigator.share({
        title: "PayWise Transaction Receipt",
        text: `Transaction ${transaction.id}: ${transaction.type === "outgoing" ? "Sent" : "Received"} $${transaction.amount} ${transaction.type === "outgoing" ? "to" : "from"} ${transaction.payTag}`,
      })
    } else {
      navigator.clipboard.writeText(
        `Transaction ${transaction.id}: ${transaction.type === "outgoing" ? "Sent" : "Received"} $${transaction.amount} ${transaction.type === "outgoing" ? "to" : "from"} ${transaction.payTag}`,
      )
      alert("Transaction details copied to clipboard!")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 pt-8 pb-4">
          <Link href="/history">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Transaction Details</h1>
        </div>

        {/* Transaction Status */}
        <Card>
          <CardContent className="p-6 text-center">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                transaction.type === "outgoing" ? "bg-red-100" : "bg-green-100"
              }`}
            >
              {transaction.type === "outgoing" ? (
                <ArrowUpRight className="w-8 h-8 text-red-600" />
              ) : (
                <ArrowDownLeft className="w-8 h-8 text-green-600" />
              )}
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {transaction.type === "outgoing" ? "-" : "+"}${transaction.amount.toFixed(2)}
            </h2>
            <p className="text-gray-600 mb-3">
              {transaction.type === "outgoing" ? "Sent to" : "Received from"} {transaction.recipient}
            </p>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </Badge>
          </CardContent>
        </Card>

        {/* Transaction Details */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Transaction ID:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{transaction.id}</span>
                  <Button variant="ghost" size="sm" onClick={handleCopyTransactionId} className="h-6 w-6 p-0">
                    {copied ? <CheckCircle className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                  </Button>
                </div>
              </div>

              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">{transaction.type === "outgoing" ? "To:" : "From:"}</span>
                <div className="text-right">
                  <p className="font-medium">{transaction.recipient}</p>
                  <p className="text-sm text-gray-500">{transaction.payTag}</p>
                </div>
              </div>

              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Amount:</span>
                <span className="font-bold text-lg">${transaction.amount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Memo:</span>
                <span>{transaction.memo}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Date:</span>
                <span>{transaction.date}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Time:</span>
                <span>{transaction.time}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">From Account:</span>
                <span>{transaction.fromAccount}</span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">To Account:</span>
                <span>{transaction.toAccount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" onClick={handleDownloadReceipt} className="w-full justify-start bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>

            <Button variant="outline" onClick={handleShareReceipt} className="w-full justify-start bg-transparent">
              <Share className="w-4 h-4 mr-2" />
              Share Transaction
            </Button>

            {transaction.type === "outgoing" && (
              <Link href={`/send?payTag=${transaction.payTag}`}>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  Send Again to {transaction.payTag}
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Support */}
        <Card className="bg-gray-50">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600 text-center">
              Need help with this transaction?{" "}
              <Link href="/support" className="text-blue-600 hover:underline">
                Contact Support
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
