"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

interface Option {
  id: string;
  optionText: string;
  optionIndex: number;
}

interface Question {
  id: string;
  question: string;
  options: Option[];
}

export default function AttemptQuiz() {
  const { quizId } = useParams() as { quizId: string };
  const searchParams = useSearchParams();
  const password = searchParams!.get("password");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [score, setScore] = useState<{ correct: number; total: number } | null>(
    null,
  );

  useEffect(() => {
    if (!quizId || !password) return;

    const fetchQuiz = async () => {
      try {
        const res = await fetch("/api/join-quiz", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quizId,
            password,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Something went wrong");

        setTitle(data.title);
        setQuestions(data.questions);
        setSelectedAnswers(data.previousAnswers || {});
        setIsSubmitted(data.submitted);
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, password]);

  const handleAnswer = (questionId: string, optionId: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitted) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/submit-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          answers: selectedAnswers,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Unknown error");

      setIsSubmitted(true);
      setScore({ correct: data.correctAnswers, total: data.totalQuestions });
      alert("Submission successful!");
    } catch (err) {
      console.error("Error submitting quiz:", err);
      alert("Failed to submit quiz.");
    }
  };

  if (loading) return <div className="text-center mt-20">Loading quiz...</div>;
  if (error)
    return <div className="text-center mt-20 text-red-500">{error}</div>;

  return (
    <div className="flex justify-center p-6 w-full h-screen mx-auto bg-slate-200">
      <div className="w-4/6 mt-10">
        <h1 className="text-3xl font-bold my-6 text-black text-center">
          {title}
        </h1>

        {questions.map((q, idx) => (
          <div
            key={q.id}
            className="mb-6 p-4 rounded-3xl bg-white/80 shadow-xl"
          >
            <h2 className="text-lg text-black font-semibold mb-2">
              {idx + 1}. {q.question}
            </h2>
            <div className="space-y-2">
              {q.options.map((opt) => (
                <div
                  key={opt.id}
                  className="flex items-center text-black space-x-2"
                >
                  <input
                    type="radio"
                    name={q.id}
                    value={opt.id}
                    checked={selectedAnswers[q.id] === opt.id}
                    onChange={() => handleAnswer(q.id, opt.id)}
                    disabled={isSubmitted} // Disable after submission
                  />
                  <label>{opt.optionText}</label>
                </div>
              ))}
            </div>
          </div>
        ))}

        {!isSubmitted && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-md"
            >
              Submit Quiz
            </button>
          </div>
        )}

        {isSubmitted && score && (
          <div className="mt-8 text-center bg-slate-200 text-black">
            <h3 className="text-xl font-bold">
              Quiz Submitted Successfully! Score: {score.correct} /{" "}
              {score.total}
            </h3>
          </div>
        )}

        {isSubmitted && (
          <div className="mt-8 text-center bg-slate-200 text-green-600">
            <h3 className="text-xl font-bold">Quiz Submitted Successfully!</h3>
          </div>
        )}
      </div>
    </div>
  );
}
