"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Send, Mic, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import axios from "axios";
interface Message {
  id: string;
  role: "ai" | "user";
  content: string;
}

const SAMPLE_QUESTIONS = [
  "Tell me about your experience with React and Next.js.",
  "How do you handle state management in large applications?",
  "Describe a challenging project you've worked on and how you overcame obstacles.",
  "What's your approach to writing clean, maintainable code?",
  "How do you stay updated with the latest web development trends?",
];

export default function InterviewPage() {
  const [questions, setQuestions] = useState<string[] | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "ai", content: SAMPLE_QUESTIONS[0] },
  ]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const router = useRouter();
  const handleSendAnswer = () => {
    if (!currentAnswer.trim()) return;
    // Add user's answer
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: currentAnswer,
    };
    setMessages((prev) => [...prev, userMessage]);
    setCurrentAnswer("");

    // Move to next question or finish
    setTimeout(() => {
      if (currentQuestionIndex < SAMPLE_QUESTIONS.length - 1) {
        const nextQuestion: Message = {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: SAMPLE_QUESTIONS[currentQuestionIndex + 1],
        };
        setMessages((prev) => [...prev, nextQuestion]);
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        router.push("/results");
      }
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendAnswer();
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Interview Practice</h1>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {SAMPLE_QUESTIONS.length}
              </p>
            </div>
            <div className="flex gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              <span className="text-sm text-muted-foreground">In Progress</span>
            </div>
          </div>
          <Card className="mb-4 flex h-[500px] flex-col">
            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-3 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "ai" && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 ${
                        message.role === "ai"
                          ? "bg-muted text-foreground"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      <p className="leading-relaxed">{message.content}</p>
                    </div>
                    {message.role === "user" && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                        <User className="h-5 w-5 text-primary-foreground" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Input Area */}
            <div className="border-t border-border p-4">
              <div className="flex gap-2">
                <Textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your answer here..."
                  className="min-h-[60px] resize-none"
                  rows={2}
                />
                <div className="flex flex-col gap-2">
                  <Button
                    size="icon"
                    variant={isRecording ? "destructive" : "outline"}
                    onClick={() => setIsRecording(!isRecording)}
                    title="Voice input"
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    onClick={handleSendAnswer}
                    disabled={!currentAnswer.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/upload")}>
              Back to Upload
            </Button>
            <Button variant="outline" onClick={() => router.push("/results")}>
              Skip to Results
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
