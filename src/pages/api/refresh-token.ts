import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { parse } from "cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const cookies = parse(req.headers.cookie || "");
  const refreshToken = cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    if (!process.env.JWT_REFRESH_SECRET) {
      throw new Error("JWT refresh secret is missing");
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
    ) as { userId: string };

    console.log("Decoded Refresh Token:", decoded);

    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" },
    );

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.log(error);
    return res.status(403).json({ message: "Invalid refresh token" });
  }
}
