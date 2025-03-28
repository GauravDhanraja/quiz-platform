import { NextApiRequest, NextApiResponse } from "next";
import pool from "@/lib/db";
import User from "@/types/User";
import { RowDataPacket } from "mysql2";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const [rows] = await pool.query<User[] & RowDataPacket[]>(
      "SELECT * FROM users",
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
