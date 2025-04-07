import { NextApiResponse } from "next";
import pool from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
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

    const { answers } = req.body;
    if (!answers || Object.keys(answers).length === 0) {
      return res.status(400).json({ message: "Answers are required" });
    }

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      let correctAnswers = 0;
      const totalQuestions = Object.keys(answers).length;

      const submissionPromises = Object.entries(answers).map(
        async ([questionId, optionId]) => {
          const submissionId = uuidv4();

          const [rows] = (await connection.query(
            "SELECT isCorrect FROM options WHERE id = ?",
            [optionId],
          )) as unknown as [Array<{ isCorrect: number }>];

          if (rows.length > 0 && rows[0].isCorrect) {
            correctAnswers++;
          }

          await connection.query(
            "INSERT INTO submission (id, userId, questionId, optionId) VALUES (?, ?, ?, ?)",
            [submissionId, userId, questionId, optionId],
          );
        },
      );

      await Promise.all(submissionPromises);
      await connection.commit();

      res.status(200).json({
        message: "Submission successful!",
        correctAnswers,
        totalQuestions,
      });
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
