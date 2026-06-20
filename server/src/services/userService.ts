import type { RequestHandler } from "express";
import { hash } from "bcrypt-ts";

import { UserSchema } from "../schema";
import { db } from "../config/db";

export const getAllUsers: RequestHandler = async (_req, res, next) => {
  try {
    const users = await db.user.findMany();
    res.json(users);
  } catch (e: unknown) {
    next(e);
  }
};

export const createUser: RequestHandler = async (req, res, next) => {
  try {
    const { name, email, password } = UserSchema.parse(req.body);

    const saltRounds = 10;
    const passwordHash = await hash(password, saltRounds);

    const newUser = await db.user.create({
      data: {
        name, email, passwordHash
      }
    });

    res.json(newUser);
  } catch (e: unknown) {
    next(e);
  }
};