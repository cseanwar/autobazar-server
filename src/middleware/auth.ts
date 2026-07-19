import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { createAuth } from "../lib/auth.js";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const auth = createAuth();
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    (req as any).userId = session.user.id;
    (req as any).session = session;
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: "Unauthorized" });
  }
}
