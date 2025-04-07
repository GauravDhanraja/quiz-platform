import type { NextApiRequest, NextApiResponse } from "next";
import { authenticateToken } from "@/lib/auth";
import pool from "@/lib/db";
import { AuthenticatedRequest } from "@/types/User";
import { RowDataPacket } from "mysql2/promise";

interface QuizRow extends RowDataPacket {
  quizId: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await new Promise<void>((resolve, reject) => {
      authenticateToken(
        req as AuthenticatedRequest,
        res,
        (err?: Error | undefined) => {
          if (err) return reject(err);
          resolve();
        },
      );
    });
  } catch {
    return;
  }

  const userId = (req as AuthenticatedRequest).user?.userId;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [rows] = (await connection.query(
      "SELECT quizId FROM quiz WHERE userId = ?",
      [userId],
    )) as unknown as [QuizRow[]];

    if (!rows.length) {
      return res.status(404).json({ message: "No quiz to delete" });
    }

    const quizId = rows[0].quizId;

    await connection.query(
      "DELETE FROM options WHERE questionId IN (SELECT id FROM questions WHERE quizId = ?)",
      [quizId],
    );
    await connection.query("DELETE FROM questions WHERE quizId = ?", [quizId]);
    await connection.query("DELETE FROM quiz WHERE quizId = ?", [quizId]);

    await connection.commit();
    res.status(200).json({ message: "Quiz deleted" });
  } catch (err) {
    await connection.rollback();
    console.error("Error deleting quiz:", err);
    res.status(500).json({ message: "Failed to delete quiz" });
  } finally {
    connection.release();
  }
}
