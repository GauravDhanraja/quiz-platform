import { JwtPayload } from "jsonwebtoken";
import { NextApiRequest } from "next";

export interface AuthenticatedRequest extends NextApiRequest {
  user?: JwtPayload & { userId: string };
}
