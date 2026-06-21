import express from 'express';
import { getAllUsers, createUser, loginUser } from '../services/userService';

const userRoutes = express.Router();

userRoutes.get("/", getAllUsers);
userRoutes.post("/register", createUser);
userRoutes.post("/login", loginUser);

export default userRoutes;