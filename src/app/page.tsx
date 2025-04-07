"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [quizId, setQuizId] = useState("");
  const [password, setPassword] = useState("");
  const [hasQuiz, setHasQuiz] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    const storedQuizId = localStorage.getItem("quizId");
    setHasQuiz(!!storedQuizId);
  }, []);

  const handleJoinQuiz = () => {
    if (quizId && password) {
      const encodedPassword = encodeURIComponent(password);
      const url = `/${quizId}?password=${encodedPassword}`;
      router.push(url);
    } else {
      alert("Quiz ID and password are required");
    }
  };

  return (
    <div className="grid grid-cols-6 items-center justify-items-center min-h-screen bg-slate-200">
      <main className="flex flex-col col-start-3 col-span-2 w-full items-center justify-items-center py-8 px-14 rounded-4xl bg-white/80 shadow-2xl">
        {isLoggedIn ? (
          <div className="flex flex-col w-full space-y-8 justify-items-center">
            <Link href="/create-quiz" className="flex justify-center">
              <button className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-semibold">
                {hasQuiz ? "View Quiz" : "Create a Quiz"}
              </button>
            </Link>
            <div className="flex flex-col w-full space-y-4">
              <input
                type="text"
                placeholder="Enter Quiz ID"
                value={quizId}
                onChange={(e) => setQuizId(e.target.value)}
                className="p-2 border border-black rounded-md text-black"
              />
              <input
                type="password"
                placeholder="Enter Quiz Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-2 border border-black rounded-md text-black"
              />
              <button
                onClick={handleJoinQuiz}
                className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-semibold"
              >
                Join Quiz
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <h1 className="text-black text-4xl font-bold mb-4">
              Login to Create or Join Quiz
            </h1>
            <div className="grid grid-cols-2 gap-8 mt-4 justify-center items-center">
              <Link href="/login" className="text-white text-xl font-semibold">
                <div className="col-span-1 flex items-center justify-center py-3 px-4 bg-blue-500 rounded-3xl">
                  Login
                </div>
              </Link>
              <Link
                href="/register"
                className="text-white text-xl font-semibold"
              >
                <div className="col-span-1 flex items-center justify-center py-3 px-4 bg-blue-500 rounded-3xl">
                  Register
                </div>
              </Link>
            </div>
            <div></div>
          </div>
        )}
      </main>
    </div>
  );
}
