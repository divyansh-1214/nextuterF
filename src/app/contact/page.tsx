"use client"

import { motion } from "framer-motion"
import { Mail, MessageSquare } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl"
        >
          <h1 className="mb-6 text-4xl font-bold text-center">Get in Touch</h1>
          <p className="mb-8 text-center text-lg text-muted-foreground">
            Have questions or feedback? We'd love to hear from you.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Email Us</h3>
              <p className="mb-4 text-sm text-muted-foreground">Send us an email and we'll respond within 24 hours</p>
              <Button variant="outline" className="w-full bg-transparent">
                support@interviewprecoach.com
              </Button>
            </Card>

            <Card className="p-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Live Chat</h3>
              <p className="mb-4 text-sm text-muted-foreground">Chat with our support team in real-time</p>
              <Button className="w-full">Start Chat</Button>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
