"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownLeft, Send, History, Eye, CreditCard, PiggyBank, LogOut } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { getUserTransactions } from "@/lib/transactions"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const { user, profile, loading, signOut } = useAuth()
  const router = useRouter()
  const [transactions, setTransactions] = useState<any[]>([])
  const [loadingTransactions, setLoadingTransactions] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
      return
    }

    if (user && profile) {
      loadTransactions()
    }
  }, [user, profile, loading, router])

  const loadTransactions = async () => {
    if (!user) return

    try {
      const data = await getUserTransactions(user.id)
      const formattedTransactions = data.map((tx) => ({
        id: tx.id,
        type: tx.sender_id === user.id ? "outgoing" : "incoming",
        recipient: tx.recipient?.full_name,
        sender: tx.sender?.full_name,
        payTag: tx.sender_id === user.id ? tx.recipient?.pay_tag : tx.sender?.pay_tag,
        amount: tx.amount,
        memo: tx.memo || "",
        date: new Date(tx.created_at).toLocaleDateString(),
        time: new Date(tx.created_at).toLocaleTimeString(),
        status: tx.status,
      }))
      setTransactions(formattedTransactions)
    } catch (error) {
      console.error("Error loading transactions:", error)
    } finally {
      setLoadingTransactions(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/auth/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
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
        <div className="flex items-center justify-between pt-8 pb-4">
          <div className="text-center flex-1">
            <h1 className="text-2xl font-bold text-gray-900">PayWise Banking</h1>
            <p className="text-gray-600 mt-1">Welcome back, {profile.full_name.split(" ")[0]}!</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>

        {/* Balance Card */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${profile.balance.toFixed(2)}</div>
            <div className="flex items-center gap-2 mt-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                <Eye className="w-3 h-3 mr-1" />
                {profile.pay_tag}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/send">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <Send className="w-6 h-6 text-green-600" />
                </div>
                <span className="font-medium text-gray-900">Send Money</span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/history">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <History className="w-6 h-6 text-blue-600" />
                </div>
                <span className="font-medium text-gray-900">History</span>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <Link href="/history">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingTransactions ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No transactions yet</p>
                <p className="text-sm">Start by sending money to someone!</p>
              </div>
            ) : (
              transactions.slice(0, 3).map((transaction) => (
                <Link key={transaction.id} href={`/transaction/${transaction.id}`}>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === "outgoing" ? "bg-red-100" : "bg-green-100"
                      }`}
                    >
                      {transaction.type === "outgoing" ? (
                        <ArrowUpRight className="w-5 h-5 text-red-600" />
                      ) : (
                        <ArrowDownLeft className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">
                          {transaction.type === "outgoing" ? transaction.recipient : transaction.sender}
                        </p>
                        <p
                          className={`font-semibold ${
                            transaction.type === "outgoing" ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {transaction.type === "outgoing" ? "-" : "+"}${transaction.amount.toFixed(2)}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">
                        {transaction.payTag} • {transaction.memo}
                      </p>
                      <p className="text-xs text-gray-400">
                        {transaction.date} at {transaction.time}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        {/* Additional Services */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">More Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                <CreditCard className="w-6 h-6" />
                <span className="text-sm">Cards</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                <PiggyBank className="w-6 h-6" />
                <span className="text-sm">Savings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
