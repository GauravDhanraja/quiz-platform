"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [quizId, setQuizId] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleJoinQuiz = () => {
    if (quizId && password) {
      window.location.href = `/quiz/${quizId}?password=${password}`;
    }
  };

  return (
    <div className="grid grid-cols-4 items-center justify-items-center min-h-screen bg-slate-200">
      <main className="flex flex-col col-start-2 col-span-2 w-full items-center justify-items-center">
        {isLoggedIn ? (
          <div className="flex flex-col space-y-8 justify-items-center">
            <Link href="/create-quiz" className="flex justify-center">
              <button className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-semibold">
                Create a Quiz
              </button>
            </Link>
            <div className="flex flex-col space-y-4">
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
          <div className="grid grid-cols-2 gap-8 justify-center items-center">
            <div className="col-span-1 flex items-center justify-center py-3 px-4 bg-blue-500 rounded-3xl">
              <Link href="/login" className="text-white text-xl font-semibold">
                Login
              </Link>
            </div>
            <div className="col-span-1 flex items-center justify-center py-3 px-4 bg-blue-500 rounded-3xl">
              <Link
                href="/register"
                className="text-white text-xl font-semibold"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
