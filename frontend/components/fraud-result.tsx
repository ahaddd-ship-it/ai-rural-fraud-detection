"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, XCircle, ArrowLeft } from "lucide-react"
import type { AnalysisResult } from "@/app/page"

interface FraudResultProps {
  result: AnalysisResult
  onReset: () => void
}

export function FraudResult({ result, onReset }: FraudResultProps) {
  const getRiskConfig = (level: string) => {
    switch (level) {
      case "Low":
        return {
          color: "bg-green-500",
          textColor: "text-green-700",
          bgLight: "bg-green-50",
          icon: CheckCircle,
          message: "This transaction looks safe!",
        }
      case "Medium":
        return {
          color: "bg-yellow-500",
          textColor: "text-yellow-700",
          bgLight: "bg-yellow-50",
          icon: AlertTriangle,
          message: "Please review this transaction carefully.",
        }
      case "High":
        return {
          color: "bg-red-500",
          textColor: "text-red-700",
          bgLight: "bg-red-50",
          icon: XCircle,
          message: "Warning! This may be fraudulent.",
        }
      default:
        return {
          color: "bg-gray-500",
          textColor: "text-gray-700",
          bgLight: "bg-gray-50",
          icon: CheckCircle,
          message: "Analysis complete.",
        }
    }
  }

  const config = getRiskConfig(result.riskLevel)
  const Icon = config.icon

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Analysis Result</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Risk Level Badge */}
        <div className={`rounded-lg p-4 text-center ${config.bgLight}`}>
          <Icon className={`mx-auto mb-2 h-10 w-10 ${config.textColor}`} />
          <Badge className={`${config.color} text-white text-base px-4 py-1`}>{result.riskLevel} Risk</Badge>
          <p className={`mt-2 text-sm font-medium ${config.textColor}`}>{config.message}</p>
        </div>

        {/* Fraud Score */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">Fraud Score</p>
          <div className="relative h-4 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full ${config.color} transition-all duration-500`}
              style={{ width: `${result.fraudScore}%` }}
            />
          </div>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {result.fraudScore}
            <span className="text-sm font-normal text-muted-foreground">/100</span>
          </p>
        </div>

        {/* Explanations */}
        {result.explanation.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">Why this score?</p>
            <ul className="space-y-2">
              {result.explanation.map((text, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 rounded-md bg-muted p-3 text-sm text-muted-foreground"
                >
                  <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Reset Button */}
        <Button onClick={onReset} variant="outline" className="w-full bg-transparent">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Analyze Another Transaction
        </Button>
      </CardContent>
    </Card>
  )
}
