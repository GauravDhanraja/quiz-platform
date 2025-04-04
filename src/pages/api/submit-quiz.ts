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

    const { answers, quizId } = req.body;
    console.log(req.body);

    if (!answers || Object.keys(answers).length === 0) {
      return res.status(400).json({ message: "Answers are required" });
    }

    // Check if the user has already submitted this quiz
    const [existingSubmission] = await pool.query(
      "SELECT * FROM submission WHERE userId = ? AND quizId = ?",
      [userId, quizId],
    );

    if (existingSubmission.length > 0) {
      return res
        .status(400)
        .json({ message: "You have already submitted this quiz." });
    }

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const submissionPromises = Object.entries(answers).map(
        async ([questionId, optionId]) => {
          const submissionId = uuidv4();

          await connection.query(
            "INSERT INTO submission (id, userId, quizId, questionId, optionId) VALUES (?, ?, ?, ?, ?)",
            [submissionId, userId, quizId, questionId, optionId],
          );
        },
      );

      await Promise.all(submissionPromises);

      await connection.commit();
      res.status(200).json({ message: "Submission successful!" });
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
