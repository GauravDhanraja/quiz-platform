import { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

interface QuizRow {
  quizId: number;
  title: string;
  password: string;
  startTime: string;
  endTime: string;
  userId: string;
}

interface QuestionRow {
  id: string;
  question: string;
}

interface OptionRow {
  id: string;
  optionText: string;
  optionIndex: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { quizId, password } = req.body;

  if (!quizId || !password) {
    return res
      .status(400)
      .json({ message: "Quiz ID and password are required." });
  }

  const connection = await pool.getConnection();

  try {
    const [quizRows] = await connection.query(
      "SELECT * FROM quiz WHERE quizId = ?",
      [quizId],
    );
    const quizList = quizRows as QuizRow[];

    if (quizList.length === 0) {
      return res.status(404).json({ message: "Quiz not found." });
    }

    const quiz = quizList[0];
    const passwordMatch = await bcrypt.compare(password, quiz.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid quiz password." });
    }

    const [questionRows] = await connection.query(
      "SELECT id, question FROM questions WHERE quizId = ?",
      [quizId],
    );
    const questionList = questionRows as QuestionRow[];

    const questionsWithOptions = [];

    for (const question of questionList) {
      const [optionRows] = await connection.query(
        "SELECT id, optionText, optionIndex FROM options WHERE questionId = ? ORDER BY optionIndex ASC",
        [question.id],
      );
      const options = optionRows as OptionRow[];

      questionsWithOptions.push({
        id: question.id,
        question: question.question,
        options,
      });
    }

    return res.status(200).json({
      title: quiz.title,
      questions: questionsWithOptions,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: (error as Error).message });
  } finally {
    connection.release();
  }
}
