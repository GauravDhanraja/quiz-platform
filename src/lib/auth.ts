import { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextHandler } from "next-connect";

interface AuthenticatedRequest extends NextApiRequest {
  user?: JwtPayload | string;
}

export function authenticateToken(req: AuthenticatedRequest, res: NextApiResponse, next: NextHandler) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied, no token provided" });
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT secret is missing in environment variables");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    res.status(403).json({ message: "Invalid token" });
  }
}
