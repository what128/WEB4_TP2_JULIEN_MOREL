import express from "express";
import * as campsiteController from "../controllers/campsiteController.mjs";

const router = express.Router();

router.get("/api/campsites/:id", campsiteController.getCampsiteById);

export default router;