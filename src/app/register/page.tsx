"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    setMessage(data.message);

    if (res.ok) {
        window.location.href = "/login";
    }
  };

  return (
    <div className="grid grid-cols-8 items-center justify-center h-screen bg-slate-200">
      <div className="flex flex-col col-span-2 col-start-4 items-center justify-center gap-4 py-4 px-16 bg-slate-300 shadow-xl rounded-4xl">
        <h1 className="text-5xl font-bold text-black my-5">Register</h1>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-black text-black text-xl p-2 m-2 rounded-2xl"
        />
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
          onClick={handleRegister}
          className="bg-blue-500 text-white text-xl font-semibold px-6 py-3 my-3 rounded-3xl cursor-pointer"
        >
          Register
        </button>
        <Link href="/login" className="text-xl font-medium text-blue-600">Login instead?</Link>
      </div>
    </div>
  );
}
