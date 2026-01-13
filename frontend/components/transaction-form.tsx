"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"

interface TransactionFormProps {
  onSubmit: (data: {
    transactionAmount: number
    usualAmount: number
    deviceChanged: boolean
    locationChanged: boolean
    rapidTransactions: boolean
  }) => void
  isLoading: boolean
  error: string | null
}

export function TransactionForm({ onSubmit, isLoading, error }: TransactionFormProps) {
  const [transactionAmount, setTransactionAmount] = useState("")
  const [usualAmount, setUsualAmount] = useState("")
  const [deviceChanged, setDeviceChanged] = useState(false)
  const [locationChanged, setLocationChanged] = useState(false)
  const [rapidTransactions, setRapidTransactions] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      transactionAmount: Number.parseFloat(transactionAmount) || 0,
      usualAmount: Number.parseFloat(usualAmount) || 0,
      deviceChanged,
      locationChanged,
      rapidTransactions,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Transaction Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="transactionAmount">Transaction Amount (₹)</Label>
            <Input
              id="transactionAmount"
              type="number"
              placeholder="Enter amount"
              value={transactionAmount}
              onChange={(e) => setTransactionAmount(e.target.value)}
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="usualAmount">Usual / Average Amount (₹)</Label>
            <Input
              id="usualAmount"
              type="number"
              placeholder="Your typical transaction amount"
              value={usualAmount}
              onChange={(e) => setUsualAmount(e.target.value)}
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="space-y-4 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="deviceChanged" className="cursor-pointer">
                Device Changed?
              </Label>
              <Switch id="deviceChanged" checked={deviceChanged} onCheckedChange={setDeviceChanged} />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="locationChanged" className="cursor-pointer">
                Location Changed?
              </Label>
              <Switch id="locationChanged" checked={locationChanged} onCheckedChange={setLocationChanged} />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="rapidTransactions" className="cursor-pointer">
                Rapid Transactions?
              </Label>
              <Switch id="rapidTransactions" checked={rapidTransactions} onCheckedChange={setRapidTransactions} />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Transaction"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
