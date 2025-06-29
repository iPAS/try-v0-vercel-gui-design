"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Download, Share, Home } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function TransferSuccess() {
  const searchParams = useSearchParams()
  const transactionId = searchParams.get("transactionId")
  const payTag = searchParams.get("payTag")
  const amount = searchParams.get("amount")
  const memo = searchParams.get("memo")

  const currentDate = new Date()
  const dateStr = currentDate.toLocaleDateString()
  const timeStr = currentDate.toLocaleTimeString()

  const handleDownloadReceipt = () => {
    // Mock receipt download
    const receiptData = {
      transactionId,
      payTag,
      amount,
      memo,
      date: dateStr,
      time: timeStr,
      sender: "John Doe (@john_d)",
      status: "Completed",
    }

    // In a real app, this would generate and download a PDF or image
    console.log("Downloading receipt:", receiptData)
    alert("Receipt downloaded successfully!")
  }

  const handleShareReceipt = () => {
    if (navigator.share) {
      navigator.share({
        title: "PayWise Transfer Receipt",
        text: `Transfer of $${amount} to ${payTag} completed successfully. Transaction ID: ${transactionId}`,
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(
        `Transfer of $${amount} to ${payTag} completed successfully. Transaction ID: ${transactionId}`,
      )
      alert("Receipt details copied to clipboard!")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Success Animation */}
        <div className="text-center pt-8 pb-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Transfer Successful!</h1>
          <p className="text-gray-600 mt-2">Your money has been sent successfully</p>
        </div>

        {/* Receipt Card */}
        <Card>
          <CardHeader className="text-center border-b">
            <CardTitle className="text-lg">Digital Receipt (E-Slip)</CardTitle>
            <p className="text-sm text-gray-500">Transaction ID: {transactionId}</p>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">From:</span>
                <span className="font-medium">John Doe (@john_d)</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">To:</span>
                <span className="font-medium">{payTag}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Amount:</span>
                <span className="font-bold text-lg text-green-600">${amount}</span>
              </div>

              {memo && (
                <div className="flex justify-between items-start">
                  <span className="text-gray-600">Memo:</span>
                  <span className="text-right max-w-48">{memo}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Date:</span>
                <span>{dateStr}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Time:</span>
                <span>{timeStr}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <span className="text-green-600 font-medium">Completed</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleDownloadReceipt} className="flex-1 bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" onClick={handleShareReceipt} className="flex-1 bg-transparent">
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link href="/">
            <Button className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <Link href="/send">
            <Button variant="outline" className="w-full bg-transparent">
              Send Another Transfer
            </Button>
          </Link>
        </div>

        {/* Additional Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> The recipient will be notified of this transfer immediately. Funds are typically
              available within minutes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
