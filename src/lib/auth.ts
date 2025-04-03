import { NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { NextHandler } from "next-connect";
import { AuthenticatedRequest } from "@/types/User";

export function authenticateToken(
  req: AuthenticatedRequest,
  res: NextApiResponse,
  next: NextHandler,
) {
  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", authHeader);
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied, no token provided" });
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT secret is missing in environment variables");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token expired" });
    }
    console.error("JWT Verification Error:", error);
    res.status(403).json({ message: "Invalid token" });
  }
}
