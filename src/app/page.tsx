"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Target, Zap, TrendingUp } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">

      <main className="container mx-auto px-4 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm text-primary"
          >
            <Sparkles className="h-4 w-4" />
            <span>Your personal AI Interview Coach</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-6 text-5xl font-bold leading-tight tracking-tight text-balance md:text-6xl lg:text-7xl"
          >
            Ace Your Next Interview with{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AI-Powered</span>{" "}
            Preparation
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-10 text-lg text-muted-foreground text-balance md:text-xl"
          >
            Upload your resume and practice with personalized AI-generated questions tailored to your skills and
            experience. Get instant feedback and improve your interview performance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button asChild size="lg" className="min-w-[200px]">
              <Link href="/auth">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="min-w-[200px] bg-transparent">
              <Link href="/about">Learn More</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mx-auto mt-32 grid max-w-5xl gap-8 md:grid-cols-3"
        >
          <div className="rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/50">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Personalized Questions</h3>
            <p className="text-muted-foreground leading-relaxed">
              AI analyzes your resume to generate relevant interview questions based on your unique skills and
              experience.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/50">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Real-Time Practice</h3>
            <p className="text-muted-foreground leading-relaxed">
              Practice answering questions in a realistic interview environment with voice or text input.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/50">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Instant Feedback</h3>
            <p className="text-muted-foreground leading-relaxed">
              Receive detailed feedback on your answers and actionable insights to improve your performance.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
