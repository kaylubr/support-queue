import type { RequestHandler } from "express";
import { hash, compare } from "bcrypt-ts";
import jwt from "jsonwebtoken";

import { UserSchema, UserLoginSchema } from "../schema";
import { db } from "../config/db";

export const getAllUsers: RequestHandler = async (_req, res, next) => {
  try {
    const users = await db.user.findMany({
      omit: {
        passwordHash: true
      }
    });
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
      },
      omit: {
        passwordHash: true
      }
    });

    res.status(201).json({ success: true, newUser });
  } catch (e: unknown) {
    next(e);
  }
};

export const loginUser: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = UserLoginSchema.parse(req.body);

    const requestedUser = await db.user.findUnique({
      where: { email }
    });

    if (!requestedUser) {
      throw new Error('User with this email does not exist.');
    }

    const isPasswordCorrect = await compare(password, requestedUser.passwordHash);

    if (!isPasswordCorrect) {
      throw new Error('Password does not match.');
    }

    const JWT_SECRET = process.env.JWT_SECRET;

    const token = jwt.sign({
      userId: requestedUser.id,
      isAdmin: requestedUser.isAdmin
    }, JWT_SECRET!);


    res.json({ 
      success: true,
      token,
      name: requestedUser.name,
      email: requestedUser.email,
      createdAt: requestedUser.createdAt
    });
  } catch (e) {
    next(e);
  }
};