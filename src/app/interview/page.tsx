"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { interviewScript, InterviewScriptType } from "@/lib/model";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Play, Pause, Volume2, VolumeX, Mic, Clock } from "lucide-react";

function Get() {
  const [key, setKey] = useState<number>(0);
  const [interviewScriptState, setInterviewScript] =
    useState<InterviewScriptType>(interviewScript);
  const [question, setQuestion] = useState<string[]>([]);
  const [q, setQ] = useState<string>();
  const [max, setMax] = useState(0);
  const [answer, setAnswer] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [followUpQuestions, setFollowUpQuestion] = useState<boolean>(false);
  const route = useRouter();
  const [url, setUrl] = useState<string | undefined>(
    "https://murf.ai/user-upload/one-day-temp/42ab325e-b8ba-4283-8b70-5f9eba231fd8.wav?response-cache-control=max-age%3D604801&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20251011T000000Z&X-Amz-SignedHeaders=host&X-Amz-Expires=259200&X-Amz-Credential=AKIA27M5532DYKBCJICE%2F20251011%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Signature=0c2da161912f9a2612de95d77bbd5556d103569ebfc61c6b1d4056fa108e77b5"
  );
  const [isVoiceLoading, setIsVoiceLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const getVoice = async () => {
    if (!q) return;
    console.log("voice call");

    setIsVoiceLoading(true);
    try {
      const response = await fetch("https://api.murf.ai/v1/speech/generate", {
        method: "POST",
        headers: {
          "api-key": `${process.env.NEXT_PUBLIC_MURF_API}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: `${q}`,
          voiceId: "en-US-natalie",
          pronunciationDictionary: {
            "2010": {
              pronunciation: "two thousand and ten",
              type: "SAY_AS",
            },
            live: {
              pronunciation: "laɪv",
              type: "IPA",
            },
          },
        }),
      });
      const body = await response.json();
      console.log(body.audioFile)
      if (body.audioFile) {
        setUrl(body.audioFile);
      }
    } catch (error) {
      console.error("Error generating voice:", error);
    } finally {
      setIsVoiceLoading(false);
    }
  };

  // Audio control functions
  const togglePlayPause = () => {
    if (audioRef) {
      if (isPlaying) {
        audioRef.pause();
      } else {
        audioRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef) {
      audioRef.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (q) {
      getVoice();
    }
  }, [q]);
  const fechQuestions = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get`,
        {
          params: {
            url: localStorage.getItem("url") || undefined,
          },
        }
      );
      const newInterviewScript = res.data.Question.interviewScript;
      console.log(newInterviewScript);
      setInterviewScript(newInterviewScript);
      const allQuestions = [
        ...newInterviewScript.openingRapportBuilding.map(
          (item: { question: string }) => item.question
        ),
        ...newInterviewScript.behavioralCulturalFit.map(
          (item: { question: string }) => item.question
        ),
        ...newInterviewScript.candidateMotivation.map(
          (item: { question: string }) => item.question
        ),
        ...newInterviewScript.resumeSpecificProbes.map(
          (item: { question: string }) => item.question
        ),
        ...newInterviewScript.skillCompetencyValidation.map(
          (item: { question: string }) => item.question
        ),
      ];

      setQuestion(allQuestions);
      setMax(allQuestions.length);
      setQ(allQuestions[0] || "");
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (!localStorage.getItem("url")) {
      route.push("/upload");
      return; // Prevent fetching questions if redirecting
    }
    fechQuestions();
  }, []);

  const saveResponse = (
    question: string,
    answer: string,
    feedback: string,
    score: number
  ) => {
    // Get existing array (if none, make empty)
    const stored = JSON.parse(localStorage.getItem("qaData") ?? "[]") || [];

    // Add new object
    const newEntry = { question, answer, feedback, score };
    console.log(newEntry);
    // Push to array
    stored.push(newEntry);

    // Store back
    localStorage.setItem("qaData", JSON.stringify(stored));
  };
  const fechMark = async () => {
    if (!q || !answer.trim()) return; // Prevent sending empty question/answer
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/mark`,
      {
        question: q,
        answer: answer,
      }
    );
    saveResponse(
      q,
      answer,
      res.data.result.feedbackAndAddons,
      res.data.result.score
    );
    console.log(res.data);
    return res.data;
  };
  const handleNext = async () => {
    setIsSubmitting(true);
    try {
      const res = await fechMark();
      console.log(res.result.score);
      let nextKey = key;
      if (!followUpQuestions) {
        console.log(question[nextKey]);
        console.log(res.result.followUpQuestions[0].question);
        question[nextKey] = res.result.followUpQuestions[0].question;
        console.log(question[nextKey]);
        setFollowUpQuestion(true);
      } else {
        setFollowUpQuestion(false);
        if (key < max - 1) {
          nextKey = key + 1;
        }
        setKey(nextKey);
      }
      if (question && question[nextKey]) {
        setQ(question[nextKey]);
      } else {
        setQ(""); // or handle end of questions
      }
      setAnswer("");
    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[500px]">
            <Card className="p-12 text-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-border border-t-primary mx-auto mb-6"></div>
                <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-primary/60 mx-auto animate-ping opacity-20"></div>
              </div>
              <h2 className="text-2xl font-bold text-card-foreground mb-2">
                Preparing Your Interview
              </h2>
              <p className="text-muted-foreground mb-4">
                We're analyzing your resume and generating personalized
                questions...
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>This may take a few moments</span>
              </div>
            </Card>
          </div>
        ) : (
          <Card className="rounded-2xl overflow-hidden">
            <div className="p-8 space-y-8">
              {q ? (
                <>
                  {/* Progress indicator */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary/20 px-3 py-1 rounded-full border border-primary/30">
                        <span className="text-sm font-medium text-primary">
                          Question {key + 1} of {max}
                        </span>
                      </div>
                      {followUpQuestions && (
                        <div className="bg-destructive/20 px-3 py-1 rounded-full border border-destructive/30">
                          <span className="text-sm font-medium text-destructive">
                            Follow-up
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="w-40 bg-muted rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${((key + 1) / max) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Voice Player Section */}
                  <div className="bg-secondary rounded-xl p-6 border border-border">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Mic className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium text-foreground">
                          Interview Question Audio
                        </span>
                      </div>
                      {isVoiceLoading && (
                        <div className="flex items-center space-x-2 text-primary">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                          <span className="text-sm">Generating voice...</span>
                        </div>
                      )}
                    </div>

                    {url && !isVoiceLoading ? (
                      <div className="space-y-4">
                        <audio
                          ref={(ref) => setAudioRef(ref)}
                          src={url}
                          onLoadedMetadata={(e) => {
                            const audio = e.target as HTMLAudioElement;
                            setAudioDuration(audio.duration);
                          }}
                          onTimeUpdate={(e) => {
                            const audio = e.target as HTMLAudioElement;
                            setCurrentTime(audio.currentTime);
                          }}
                          onPlay={() => setIsPlaying(true)}
                          onPause={() => setIsPlaying(false)}
                          onEnded={() => setIsPlaying(false)}
                          autoPlay={true}
                          className="hidden"
                        />
                        <div className="flex items-center justify-between bg-card rounded-lg p-4 shadow-sm border border-border">
                          <div className="flex items-center space-x-4">
                            <Button
                              onClick={togglePlayPause}
                              variant="outline"
                              size="icon"
                              className="rounded-full"
                            >
                              {isPlaying ? (
                                <Pause className="w-4 h-4" />
                              ) : (
                                <Play className="w-4 h-4 ml-0.5" />
                              )}
                            </Button>
                            <Button
                              onClick={toggleMute}
                              variant="ghost"
                              size="icon"
                              className="rounded-full"
                            >
                              {isMuted ? (
                                <VolumeX className="w-4 h-4" />
                              ) : (
                                <Volume2 className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatTime(currentTime)} /{" "}
                            {formatTime(audioDuration)}
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-150"
                            style={{
                              width:
                                audioDuration > 0
                                  ? `${(currentTime / audioDuration) * 100}%`
                                  : "0%",
                            }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                          <div className="animate-pulse bg-muted rounded-lg h-12 w-48 mb-2"></div>
                          <p className="text-sm text-muted-foreground">
                            Loading audio...
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Question */}
                  <div className="space-y-4">
                    <h1 className="text-3xl font-bold leading-relaxed text-foreground">
                      {q}
                    </h1>
                  </div>

                  {/* Answer input */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-lg font-semibold text-foreground">
                        Your Answer
                      </label>
                      <div className="text-sm text-muted-foreground">
                        {answer.trim().length > 0 && (
                          <span className="bg-secondary px-2 py-1 rounded-full border border-border">
                            {answer.trim().length} characters
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="relative">
                      <Textarea
                        placeholder="Share your thoughts and experiences in detail. Take your time to provide a comprehensive answer..."
                        className="min-h-[250px] w-full text-base leading-relaxed resize-none rounded-xl p-4 transition-all duration-200"
                        value={answer}
                        onChange={(e) => {
                          setAnswer(e.target.value);
                        }}
                        disabled={isSubmitting}
                        required
                      />
                      {isSubmitting && (
                        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm rounded-xl flex items-center justify-center">
                          <div className="bg-card border border-border rounded-lg p-4 shadow-lg flex items-center space-x-3">
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
                            <span className="text-foreground">
                              Analyzing your response...
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-6">
                    <div className="flex items-center space-x-4">
                      {answer.trim().length > 50 && (
                        <div className="flex items-center space-x-2 text-accent">
                          <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium">
                            Good length!
                          </span>
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={handleNext}
                      disabled={!answer.trim() || isSubmitting}
                      className="px-8 py-3 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
                      size="lg"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-foreground border-t-transparent mr-3"></div>
                          Analyzing Response...
                        </>
                      ) : key === max - 1 && !followUpQuestions ? (
                        "Complete Interview"
                      ) : (
                        "Next Question →"
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="mb-8">
                    <div className="text-8xl mb-6 animate-bounce">🎉</div>
                    <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-6"></div>
                  </div>
                  <h2 className="text-4xl font-bold text-foreground mb-4">
                    Interview Complete!
                  </h2>
                  <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Congratulations! You've successfully completed all interview
                    questions. Your responses have been recorded and analyzed.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={() => route.push("/results")}
                      className="px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                      size="lg"
                    >
                      View Results & Feedback
                    </Button>
                    <Button
                      onClick={() => route.push("/upload")}
                      variant="outline"
                      className="px-8 py-3 rounded-xl font-semibold transition-all duration-200"
                      size="lg"
                    >
                      Start New Interview
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default Get;
