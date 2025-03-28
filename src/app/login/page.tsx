"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      setMessage("Login successful! Redirecting...");
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } else {
      setMessage(data.message);
    }
  };

  return (
    <div className="grid grid-cols-8 items-center justify-center h-screen bg-slate-200">
      <div className="flex flex-col col-span-2 col-start-4 items-center justify-center gap-4 py-4 px-16 bg-slate-300 shadow-xl rounded-4xl">
        <h1 className="text-5xl font-bold text-black my-5">Login</h1>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-black text-black text-xl p-2 m-2 rounded-2xl"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-black text-black text-xl p-2 m-2 rounded-2xl"
        />
        {message && <p className="my-2 text-xl text-red-500">{message}</p>}
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white text-xl font-semibold px-6 py-3 my-3 rounded-3xl cursor-pointer"
        >
          Login
        </button>
        <Link href="/register" className="text-xl font-medium text-blue-600">Register instead?</Link>
      </div>
    </div>
  );
}
