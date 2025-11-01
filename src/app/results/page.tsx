"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Download, RotateCcw, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"

interface InterviewData {
  question: string;
  answer: string;
  feedback: string;
  score: number;
}

export default function ResultsPage() {
  const [data, setData] = useState<InterviewData []>([])
  const router = useRouter()
  
  useEffect(() => {
    const qaData = localStorage.getItem("qaData")
    const d = qaData ? JSON.parse(qaData) : null
    if (d) {
      console.log(d)
      setData(d)
    }
  }, [])


  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 pt-32 pb-16">
        {data && data.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl"
          >
            <div className="mb-8 text-center">
              <h1 className="mb-3 text-4xl font-bold">Interview Results</h1>
              <p className="text-lg text-muted-foreground">Here are your interview details ({data.length} questions)</p>
            </div>

            {/* Display all interview data */}
            {data.map((item, index) => (
              <Card key={index} className="mb-6 p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-semibold">Question {index + 1}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`text-2xl font-bold ${
                        item.score <= 3 ? 'text-red-500' : 
                        item.score <= 6 ? 'text-yellow-500' : 'text-green-500'
                      }`}>
                        {item.score}
                      </span>
                      <span className="text-lg text-muted-foreground">/10</span>
                    </div>
                  </div>
                  
                  {/* Question */}
                  <div>
                    <h4 className="mb-3 text-lg font-semibold text-primary">Question:</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.question}
                    </p>
                  </div>

                  {/* Answer */}
                  <div>
                    <h4 className="mb-3 text-lg font-semibold text-primary">Your Answer:</h4>
                    <div className="rounded-lg bg-muted/30 p-4">
                      <p className="text-muted-foreground italic">
                        "{item.answer}"
                      </p>
                    </div>
                  </div>

                  {/* Score with Progress Bar */}
                  <div>
                    <h4 className="mb-3 text-lg font-semibold text-primary">Score:</h4>
                    <Progress 
                      value={item.score * 10} 
                      className="mt-2 h-3" 
                    />
                  </div>

                  {/* Feedback */}
                  <div>
                    <h4 className="mb-3 text-lg font-semibold text-primary">Detailed Feedback:</h4>
                    <div className="rounded-lg bg-muted/50 p-4 border-l-4 border-primary">
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {item.feedback}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {/* Actions */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" onClick={() => router.push("/upload")}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Retake Interview
              </Button>
              <Button size="lg" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <AlertCircle className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No Interview Data Found</h2>
              <p className="text-muted-foreground mb-6">
                Complete an interview to see your results here.
              </p>
              <Button onClick={() => router.push("/upload")}>
                Start Interview
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
