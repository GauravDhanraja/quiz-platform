import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid"; // Import UUID package
import bcrypt from "bcryptjs";
import pool from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const userId = uuidv4(); // Generate a UUID
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (id, email, password, name) VALUES (?, ?, ?, ?)",
      [userId, email, hashedPassword, name || null]
    );

    res.status(201).json({ message: "User registered successfully", userId });
  } catch (error) {
    res.status(500).json({ message: "Database error", error: (error as Error).message });
  }
}
