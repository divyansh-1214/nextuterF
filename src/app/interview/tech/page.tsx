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
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getTQ`, {
                jd,
                limit: 5,
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
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Generate Tech Interview Questions</h1>

                <Card>
                    <CardHeader>
                        <CardTitle>Job Description Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            fetchQuestions();
                        }}>
                            <label htmlFor="jd" className="block text-sm font-medium mb-2">
                                Paste the job description (JD)
                            </label>
                            <Textarea
                                id="jd"
                                value={jd}
                                onChange={(e) => setJd(e.target.value)}
                                rows={8}
                                placeholder="Paste the job description here..."
                                className="mb-4"
                            />

                            <div className="flex gap-3">
                                <Button type="submit" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {loading ? "Generating..." : "Generate Questions"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setJd("");
                                        setQuestions([]);
                                        setError(null);
                                    }}
                                    disabled={loading}
                                >
                                    Clear
                                </Button>
                            </div>
                        </form>

                        {error && (
                            <p className="text-destructive mt-4 font-medium">{error}</p>
                        )}
                    </CardContent>
                </Card>

                <div className="mt-8 space-y-4">
                    {questions.length === 0 && !loading && (
                        <p className="text-muted-foreground text-center py-8">
                            No questions yet — paste a JD and click Generate.
                        </p>
                    )}

                    {questions.map((q, i) => (
                        <Card
                            key={i}
                            className={`transition-all duration-200 ${q.link ? 'hover:border-primary cursor-pointer' : ''}`}
                            onClick={() => {
                                if (q.link) {
                                    window.open(q.link, "_blank");
                                }
                            }}
                        >
                            <CardContent className="py-4">
                                <h3 className="text-lg font-semibold">{q.name ?? `Question ${i + 1}`}</h3>
                            </CardContent>
                        </Card>
                    ))}
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

