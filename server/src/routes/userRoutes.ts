import express from 'express';
import { getAllUsers, createUser } from '../services/userService';

const userRoutes = express.Router();

userRoutes.get("/", getAllUsers);
userRoutes.post("/register", createUser);

export default userRoutes;