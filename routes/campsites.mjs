import express from "express";
import * as campsiteController from "../controllers/campsiteController.mjs";
import { validateCampsite } from "../middleware/validateCampsite.mjs";
import {isAdmin, isAuth} from "../middleware/isAuth.mjs";

const router = express.Router();

router.get("/available", campsiteController.getAllAvailableCampsites);
router.get("/:id", campsiteController.getCampsiteById);
router.get("/", campsiteController.getAllCampsites);

router.post("/", isAuth, isAdmin, validateCampsite, campsiteController.createCampsite);

router.put("/:id", isAuth, isAdmin, validateCampsite, campsiteController.replaceCampsite);

router.delete("/:id", isAuth, isAdmin, campsiteController.deleteCampsite);

export default router;