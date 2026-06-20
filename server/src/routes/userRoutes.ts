import express from 'express';
import { getAllUsers } from '../services/userService';

const userRoutes = express.Router();

userRoutes.get("/", getAllUsers);

export default userRoutes;