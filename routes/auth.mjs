import express from "express";
import * as authController from "../controllers/authController.mjs";
import { validateUser, validateUserBasic} from "../middleware/validateUser.mjs";

const router = express.Router();

router.post("/register", validateUser, authController.createUser);

router.post("/login", validateUserBasic, authController.loginUser);

export default router;