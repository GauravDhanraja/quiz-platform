import { NextApiResponse } from "next";
import pool from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { authenticateToken } from "@/lib/auth";
import { AuthenticatedRequest } from "@/types/User";

export default async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  authenticateToken(req, res, async () => {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { title, password, startTime, endTime, questions } = req.body;

    if (!title || !password || !startTime || !endTime || !questions.length) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const connection = await pool.getConnection();

    try {
      const quizId = Math.floor(100000 + Math.random() * 900000);
      const hashedPassword = await bcrypt.hash(password, 10);

      await connection.beginTransaction();

      await connection.query(
        "INSERT INTO quiz (quizId, title, password, startTime, endTime, userId) VALUES (?, ?, ?, ?, ?, ?)",
        [quizId, title, hashedPassword, startTime, endTime, userId],
      );

      for (const question of questions) {
        const questionId = uuidv4();

        await connection.query(
          "INSERT INTO questions (id, quizId, question) VALUES (?, ?, ?)",
          [questionId, quizId, question.text],
        );

        for (let i = 0; i < question.options.length; i++) {
          await connection.query(
            "INSERT INTO options (id, questionId, optionText, optionIndex, isCorrect) VALUES (?, ?, ?, ?, ?)",
            [
              uuidv4(),
              questionId,
              question.options[i],
              i,
              question.answer === i,
            ],
          );
        }
      }

      await connection.commit();
      res.status(201).json({ message: "Quiz created successfully", quizId });
    } catch (error) {
      console.error(error);
      await connection.rollback();
      res.status(500).json({
        message: "Database error",
        error: (error as Error).message,
      });
    } finally {
      connection.release();
    }
  });
}
