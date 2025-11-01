"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl"
        >
          <h1 className="mb-6 text-4xl font-bold">About Interview Pre-Coach</h1>

          <Card className="p-8">
            <div className="prose prose-invert max-w-none">
              <p className="text-lg leading-relaxed text-muted-foreground">
                Interview Pre-Coach is an AI-powered platform designed to help job seekers prepare for interviews with
                confidence. By analyzing your resume, we generate personalized interview questions that match your
                skills and experience.
              </p>

              <h2 className="mt-8 mb-4 text-2xl font-semibold text-foreground">How It Works</h2>
              <ol className="space-y-3 text-muted-foreground">
                <li>Upload your resume in PDF format</li>
                <li>Our AI analyzes your skills and experience</li>
                <li>Practice with personalized interview questions</li>
                <li>Receive detailed feedback and improvement suggestions</li>
              </ol>

              <h2 className="mt-8 mb-4 text-2xl font-semibold text-foreground">Our Mission</h2>
              <p className="leading-relaxed text-muted-foreground">
                We believe everyone deserves the opportunity to showcase their best self in interviews. Our mission is
                to democratize interview preparation by providing accessible, AI-powered coaching to help you land your
                dream job.
              </p>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
