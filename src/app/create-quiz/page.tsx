"use client";

import { useState } from "react";
import { fetchWithAuth } from "@/lib/api";

type Question = {
  text: string;
  options: string[];
  answer: number;
};

export default function CreateQuiz() {
  const [title, setTitle] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([
    { text: "", options: ["", "", "", ""], answer: 0 },
  ]);
  const [message, setMessage] = useState<string>("");

  const handleCreateQuiz = async () => {
    setMessage("");

    const res = await fetchWithAuth("/api/create-quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, password, startTime, endTime, questions }),
    });

    if (!res) {
      setMessage("Session expired. Please log in again.");
      return;
    }

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message || "Failed to create quiz.");
      return;
    }

    setMessage("Quiz created successfully!");
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { text: "", options: ["", "", "", ""], answer: 0 },
    ]);
  };

  const handleDeleteQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, text: value } : q)),
    );
  };

  const handleOptionChange = (
    qIndex: number,
    oIndex: number,
    value: string,
  ) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              options: q.options.map((opt, j) => (j === oIndex ? value : opt)),
            }
          : q,
      ),
    );
  };

  const handleCorrectAnswerChange = (qIndex: number, oIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === qIndex ? { ...q, answer: oIndex } : q)),
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-200">
      <div className="bg-white/80 p-6 rounded-3xl shadow-2xl w-3/6">
        <h2 className="text-4xl font-bold text-black text-center mb-6">
          Create a Quiz
        </h2>
        {message && <p className="text-red-500 text-center mb-4">{message}</p>}
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-1">
            <input
              type="text"
              placeholder="Quiz Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-400 rounded-md mb-4 text-black"
            />

            <input
              type="password"
              placeholder="Set Quiz Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-400 rounded-md mb-4 text-black"
            />

            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full p-2 border border-gray-400 rounded-md mb-4 text-black"
            />

            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full p-2 border border-gray-400 rounded-md mb-4 text-black"
            />
          </div>
          <div>
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="mb-4">
                <div className="flex items-center mb-2">
                  <input
                    type="text"
                    placeholder={`Question ${qIndex + 1}`}
                    value={q.text}
                    onChange={(e) =>
                      handleQuestionChange(qIndex, e.target.value)
                    }
                    className="w-full p-2 border border-gray-400 rounded-md text-black"
                  />
                  <button
                    onClick={() => handleDeleteQuestion(qIndex)}
                    className="ml-2 bg-red-500 text-white px-2 py-1 rounded-md"
                  >
                    Delete
                  </button>
                </div>
                {q.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex items-center mb-1">
                    <input
                      type="text"
                      placeholder={`Option ${oIndex + 1}`}
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(qIndex, oIndex, e.target.value)
                      }
                      className="w-full p-2 border border-gray-400 rounded-md text-black"
                    />
                    <input
                      type="checkbox"
                      checked={q.answer === oIndex}
                      onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                      className="ml-2"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center items-center gap-8">
          <button
            onClick={handleCreateQuiz}
            className="bg-green-500 text-white font-semibold px-4 py-2 rounded-md"
          >
            Create Quiz
          </button>
          <button
            onClick={handleAddQuestion}
            className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-md"
          >
            Add Question
          </button>
        </div>
      </div>
    </div>
  );
}
