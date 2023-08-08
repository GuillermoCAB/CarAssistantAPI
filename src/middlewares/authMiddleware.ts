import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const authMiddleware: express.RequestHandler = async (
  req,
  res,
  next
) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("SENDGRID_API_KEY must be defined");
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const parts = authHeader.split(" ");

  if (!(parts.length === 2)) {
    return res.status(401).json({ message: "Token error" });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ message: "Token malformatted" });
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET!);
  if (typeof payload !== "string" && "userId" in payload) {
    const user = await User.findById(payload.userId);
    // @ts-ignore
    req.user = user;
    next();
  } else {
    res
      .sendStatus(403)
      .json({ message: "Token don't have access to this feature" });
  }
};
