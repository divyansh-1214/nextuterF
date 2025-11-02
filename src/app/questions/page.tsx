"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

type Question = {
    "name": string,
    "link": string
};

export default function TechInterviewPage() {
    const router = useRouter();
    const [jd, setJd] = useState<string>("");
    const [limit, setLimit] = useState<number>(5);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchQuestions = async () => {
        if (!jd.trim()) {
            setError("Please paste a job description before generating questions.");
            return;
        }

        setLoading(true);
        setError(null);
        console.log(process.env.NEXT_PUBLIC_BACKEND_URL);
        
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getTQ`, {
                jd,
                limit,
            });
            // Expecting an array of questions. Be defensive about response shape.
            const payload = res.data;
            console.log(payload);

            let items: Question[] = [];
            if (Array.isArray(payload)) {
                items = payload;
            } else if (Array.isArray(payload?.questions)) {
                items = payload.questions;
            } else if (Array.isArray(payload?.Question)) {
                // some backends use "Question" key
                items = payload.Question;
            } else if (Array.isArray(payload?.data)) {
                items = payload.data;
            }

            setQuestions(items);
        } catch (err: any) {
            console.error(err);
            setError(err?.message ?? "Failed to fetch questions");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">practice the Question Generator</h1>
                    <p className="text-muted-foreground">Generate practice questions based on job descriptions</p>
                </div>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Generate Questions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            fetchQuestions();
                        }}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="jd" className="block text-sm font-medium mb-2">
                                        Job Description *
                                    </label>
                                    <Textarea
                                        id="jd"
                                        value={jd}
                                        onChange={(e) => setJd(e.target.value)}
                                        rows={8}
                                        placeholder="Paste the complete job description here..."
                                        className="mb-2"
                                    />
                                    <p className="text-xs text-muted-foreground">Provide detailed job requirements, responsibilities, and qualifications</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="limit" className="block text-sm font-medium mb-2">
                                            Number of Questions
                                        </label>
                                        <input
                                            id="limit"
                                            type="number"
                                            min="1"
                                            max="20"
                                            value={limit}
                                            onChange={(e) => setLimit(Math.max(1, parseInt(e.target.value) || 5))}
                                            className="w-full px-3 py-2 border border-input rounded-md text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {loading ? "Generating..." : "Generate Questions"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setJd("");
                                            setLimit(5);
                                            setQuestions([]);
                                            setError(null);
                                        }}
                                        disabled={loading}
                                        className="w-full sm:w-auto"
                                    >
                                        Clear
                                    </Button>
                                </div>
                            </div>
                        </form>

                        {error && (
                            <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm font-medium">
                                {error}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="mt-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">
                            Practice Questions {questions.length > 0 && <span className="text-lg text-muted-foreground">({questions.length})</span>}
                        </h2>
                    </div>

                    {questions.length === 0 && !loading && (
                        <Card>
                            <CardContent className="py-12">
                                <p className="text-center text-muted-foreground">
                                    No questions yet — paste a job description and click Generate to get started.
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    <div className="space-y-3">
                        {questions.map((q, i) => (
                            <Card
                                key={i}
                                className={`transition-all duration-200 ${q.link ? 'hover:border-primary hover:shadow-md cursor-pointer' : ''}`}
                                onClick={() => {
                                    if (q.link) {
                                        window.open(q.link, "_blank");
                                    }
                                }}
                            >
                                <CardContent className="py-4 px-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="inline-flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm font-semibold">
                                                    {i + 1}
                                                </span>
                                                <h3 className="text-lg font-semibold">{q.name ?? `Question ${i + 1}`}</h3>
                                            </div>
                                            {q.link && (
                                                <p className="text-xs text-muted-foreground mt-2">Click to practice →</p>
                                            )}
                                        </div>
                                        {q.link && (
                                            <div className="text-primary">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/*
Assumptions & notes:
- Backend API endpoint: POST /api/getTQ -> returns JSON array of { id, title, description, starterCode? }.
- If you prefer a richer editor (Monaco, CodeMirror) we can wire it in later.
*/

