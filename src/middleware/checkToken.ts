import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { db } from "#db/db";
import { user } from "#db/schema";
import { eq } from "drizzle-orm";

interface JwtPayload {
  id: string;
  email: string;
}

export const checkToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const tokenType = authHeader.split(" ")[0];
  if (tokenType !== "Bearer") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.SECRET;

  if (!secret) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    (req as any).user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export const checkAdminRole = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const tokenType = authHeader.split(" ")[0];
  if (tokenType !== "Bearer") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.SECRET;

  if (!secret) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    
    const [foundUser] = await db
      .query.user.findMany({
        where: eq(user.id, decoded.id),
        with: { role: true },
        limit: 1,
      });

    if (!foundUser || !foundUser.role || foundUser.role.name !== "admin") {
      return res.status(403).json({ error: "Forbidden: Admin access required" });
    }

    (req as any).user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
};