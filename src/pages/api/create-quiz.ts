import { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { title, password } = req.body;

  if (!title || !password) {
    return res.status(400).json({ message: "Title and password are required" });
  }

  try {
    const quizId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO quizzes (id, title, password) VALUES (?, ?, ?)",
      [quizId, title, hashedPassword],
    );

    res.status(201).json({ message: "Quiz created successfully", quizId });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Database error", error: (error as Error).message });
  }
}
