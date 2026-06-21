import { z } from "zod";

export const UserSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string()
});

export const UserLoginSchema = z.object({
  email: z.string(),
  password: z.string()
});