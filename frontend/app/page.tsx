"use client"

import { useState } from "react"
import { TransactionForm } from "@/components/transaction-form"
import { FraudResult } from "@/components/fraud-result"
import { Shield } from "lucide-react"

export interface AnalysisResult {
  fraudScore: number
  riskLevel: "Low" | "Medium" | "High"
  explanation: string[]
}

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async (data: {
    transactionAmount: number
    usualAmount: number
    deviceChanged: boolean
    locationChanged: boolean
    rapidTransactions: boolean
  }) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze transaction")
      }

      const analysisResult: AnalysisResult = await response.json()
      setResult(analysisResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setError(null)
  }

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-md">
        <header className="mb-6 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Fraud Guard</h1>
          </div>
          <p className="text-sm text-muted-foreground">AI-powered fraud detection for safe digital payments</p>
        </header>

        {result ? (
          <FraudResult result={result} onReset={handleReset} />
        ) : (
          <TransactionForm onSubmit={handleAnalyze} isLoading={isLoading} error={error} />
        )}
      </div>
    </main>
  )
}
