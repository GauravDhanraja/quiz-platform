"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  userId: string;
  email: string;
}

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setEmail(decoded.email);
      } catch (error) {
        console.error("Invalid token", error);
        setIsLoggedIn(false);
      }
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <nav className="absolute w-full bg-blue-500 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-3xl font-bold">
          QuizVerse
        </Link>
        <div className="hidden md:flex space-x-6">
          {isLoggedIn && (
            <div className="flex flex-row items-center gap-x-6">
              <p className="text-lg text-white font-semibold">{email}</p>
              <button
                onClick={handleSignOut}
                className="bg-red-500 font-semibold px-4 py-2 rounded-xl cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
