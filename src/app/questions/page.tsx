"use client"

import { useState } from "react"
import { CheckSquare, Filter, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function QuestionPractice() {
  const [difficulty, setDifficulty] = useState("all")
  const [topic, setTopic] = useState("all")
  const [solvingQuestion, setSolvingQuestion] = useState<number | null>(null)
  const [code, setCode] = useState("")

  const questions = [
    {
      id: 1,
      title: "Two Sum Problem",
      difficulty: "Easy",
      topic: "Programming",
      solved: 1250,
      description:
        "Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.",
    },
    {
      id: 2,
      title: "Binary Search Tree Traversal",
      difficulty: "Medium",
      topic: "Data Structures",
      solved: 850,
      description: "Implement inorder, preorder, and postorder traversal of a binary search tree.",
    },
    {
      id: 3,
      title: "Longest Common Subsequence",
      difficulty: "Hard",
      topic: "Algorithms",
      solved: 320,
      description: "Find the length of the longest subsequence common to two strings.",
    },
    {
      id: 4,
      title: "Array Rotation",
      difficulty: "Easy",
      topic: "Programming",
      solved: 2100,
      description: "Rotate an array to the right by k steps.",
    },
  ]

  const filteredQuestions = questions.filter((q) => {
    const difficultyMatch = difficulty === "all" || q.difficulty === difficulty
    const topicMatch = topic === "all" || q.topic === topic
    return difficultyMatch && topicMatch
  })

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Easy":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
      case "Hard":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const handleSubmitSolution = () => {
    if (code.trim()) {
      console.log("[v0] Solution submitted for question", solvingQuestion, ":", code)
      setCode("")
      setSolvingQuestion(null)
    }
  }

  const currentQuestion = questions.find((q) => q.id === solvingQuestion)

  if (solvingQuestion && currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{currentQuestion.title}</CardTitle>
                <CardDescription className="mt-2">{currentQuestion.description}</CardDescription>
              </div>
              <button onClick={() => setSolvingQuestion(null)} className="text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Solution</label>
              <textarea
                placeholder="Write your code here..."
                className="w-full p-3 border border-input rounded-md font-mono text-sm resize-none"
                rows={10}
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setSolvingQuestion(null)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSubmitSolution} className="flex-1">
                Submit Solution
              </Button>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Write your solution in any programming language. Our system will check for correctness.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CheckSquare className="w-6 h-6 text-primary" />
            <h1 className="text-4xl font-bold">Question Practice</h1>
          </div>
          <p className="text-muted-foreground">Practice coding questions tailored to your skill level.</p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 w-full sm:w-auto bg-transparent">
                <Filter className="w-4 h-4" />
                Difficulty: {difficulty === "all" ? "All" : difficulty}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setDifficulty("all")}>All Levels</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDifficulty("Easy")}>Easy</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDifficulty("Medium")}>Medium</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDifficulty("Hard")}>Hard</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 w-full sm:w-auto bg-transparent">
                <Filter className="w-4 h-4" />
                Topic: {topic === "all" ? "All" : topic}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setTopic("all")}>All Topics</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTopic("Programming")}>Programming</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTopic("Data Structures")}>Data Structures</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTopic("Algorithms")}>Algorithms</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Questions List */}
        <div className="grid gap-4">
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((question) => (
              <Card key={question.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{question.title}</CardTitle>
                      <CardDescription>{question.solved.toLocaleString()} people solved this</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getDifficultyColor(question.difficulty)}`}
                      >
                        {question.difficulty}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground whitespace-nowrap">
                        {question.topic}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button className="w-full sm:w-auto gap-2" onClick={() => setSolvingQuestion(question.id)}>
                    <Play className="w-4 h-4" />
                    Solve Problem
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No questions match your filters. Try adjusting them.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
