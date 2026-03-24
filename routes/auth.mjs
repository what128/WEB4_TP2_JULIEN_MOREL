import express from "express";
import * as authController from "../controllers/authController.mjs";
import { validateUser } from "../middleware/validateUser.mjs";

const router = express.Router();

router.post("/register", validateUser, authController.createUser);

export default router;