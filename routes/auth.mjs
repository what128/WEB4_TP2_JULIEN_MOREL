import express from "express";
import * as authController from "../controllers/authController.mjs";
import { validateUser, validateUserBasic, validateUserReplacement} from "../middleware/validateUser.mjs";
import {isAuth} from "../middleware/isAuth.mjs";

const router = express.Router();

router.post("/register", validateUser, authController.createUser);

router.post("/login", validateUserBasic, authController.loginUser);

router.get("/profile", isAuth, authController.getProfileInfo);

router.put("/profile", validateUserReplacement, isAuth, authController.replaceProfileInfo);

router.patch("/password", isAuth, authController.changePassword);

export default router;