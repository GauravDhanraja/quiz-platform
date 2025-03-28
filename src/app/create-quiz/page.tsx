"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateQuiz() {
  const [title, setTitle] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleCreateQuiz = async () => {
    if (!title || !password) {
      setMessage("Please enter both title and password.");
      return;
    }

    const res = await fetch("/api/create-quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, password }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Quiz created successfully!");
      router.push(`/quiz/${data.quizId}`);
    } else {
      setMessage(data.message || "Failed to create quiz.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-200">
      <div className="bg-slate-300 p-6 rounded-lg shadow-xl w-96">
        <h2 className="text-4xl font-bold text-black text-center mb-4">Create a Quiz</h2>
        {message && <p className="text-red-500 text-center">{message}</p>}
        <input
          type="text"
          placeholder="Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-black text-black rounded-md mb-4"
        />
        <input
          type="password"
          placeholder="Set Quiz Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-black text-black rounded-md mb-4"
        />
        <button
          onClick={handleCreateQuiz}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Create Quiz
        </button>
      </div>
    </div>
  );
}
