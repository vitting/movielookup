import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { set } from "lodash";

dotenv.config();

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const auth = req.headers.authorization;

  if (!auth) {
    res.status(404).json({ error: "Missing authorization header" });
    return;
  }

  const token = auth.split(" ")[1];

  if (!token) {
    return res.status(404).json({ error: "Missing token" });
  }

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, {
      algorithms: ["HS256"],
    });

    set(req, "auth", payload);
    
  } catch (error) {
    return res.status(401).json({ error: "Token not valid" });
  }

  next();
}
