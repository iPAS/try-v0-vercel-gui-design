"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Search } from "lucide-react"
import Link from "next/link"

export default function TransactionHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all") // all, incoming, outgoing

  const transactions = [
    {
      id: "TXN001234567",
      type: "outgoing",
      recipient: "Sarah Johnson",
      payTag: "@sarah_j",
      amount: 25.0,
      memo: "Coffee split",
      date: "2024-01-15",
      time: "14:30",
      status: "completed",
    },
    {
      id: "TXN001234566",
      type: "incoming",
      sender: "Mike Chen",
      payTag: "@mike_c",
      amount: 150.0,
      memo: "Rent contribution",
      date: "2024-01-15",
      time: "09:15",
      status: "completed",
    },
    {
      id: "TXN001234565",
      type: "outgoing",
      recipient: "Alex Rivera",
      payTag: "@alex_r",
      amount: 45.75,
      memo: "Dinner last night",
      date: "2024-01-14",
      time: "20:45",
      status: "completed",
    },
    {
      id: "TXN001234564",
      type: "incoming",
      sender: "Emma Wilson",
      payTag: "@emma_w",
      amount: 75.5,
      memo: "Movie tickets refund",
      date: "2024-01-14",
      time: "16:20",
      status: "completed",
    },
    {
      id: "TXN001234563",
      type: "outgoing",
      recipient: "David Kim",
      payTag: "@david_k",
      amount: 120.0,
      memo: "Birthday gift contribution",
      date: "2024-01-13",
      time: "11:45",
      status: "completed",
    },
    {
      id: "TXN001234562",
      type: "incoming",
      sender: "Lisa Park",
      payTag: "@lisa_p",
      amount: 30.25,
      memo: "Lunch split",
      date: "2024-01-13",
      time: "13:30",
      status: "completed",
    },
    {
      id: "TXN001234561",
      type: "outgoing",
      recipient: "Tom Wilson",
      payTag: "@tom_w",
      amount: 85.0,
      memo: "Gym membership share",
      date: "2024-01-12",
      time: "19:15",
      status: "completed",
    },
    {
      id: "TXN001234560",
      type: "incoming",
      sender: "Rachel Green",
      payTag: "@rachel_g",
      amount: 200.0,
      memo: "Freelance payment",
      date: "2024-01-12",
      time: "10:00",
      status: "completed",
    },
  ]

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.payTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.recipient && transaction.recipient.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (transaction.sender && transaction.sender.toLowerCase().includes(searchTerm.toLowerCase())) ||
      transaction.memo.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filter === "all" || transaction.type === filter

    return matchesSearch && matchesFilter
  })

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
          <h1 className="text-xl font-bold text-gray-900">Transaction History</h1>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
                All
              </Button>
              <Button
                variant={filter === "incoming" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("incoming")}
              >
                Received
              </Button>
              <Button
                variant={filter === "outgoing" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("outgoing")}
              >
                Sent
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transaction List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Transactions</span>
              <Badge variant="secondary">{filteredTransactions.length} results</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No transactions found</p>
                <p className="text-sm">Try adjusting your search or filter</p>
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <Link key={transaction.id} href={`/transaction/${transaction.id}`}>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
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
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900 truncate">
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
                      <p className="text-sm text-gray-500 truncate">
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

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                +$
                {transactions
                  .filter((t) => t.type === "incoming")
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">Total Received</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-red-600">
                -$
                {transactions
                  .filter((t) => t.type === "outgoing")
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">Total Sent</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
