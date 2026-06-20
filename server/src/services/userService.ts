import type { RequestHandler } from "express";

import { db } from "../config/db";

export const getAllUsers: RequestHandler = async (_req, res, next) => {
  try {
    const users = await db.user.findMany();
    res.json(users);
  } catch (e: unknown) {
    if (e instanceof Error) {
      next(e);
    }
  }
};