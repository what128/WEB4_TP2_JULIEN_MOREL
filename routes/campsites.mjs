import express from "express";
import * as campsiteController from "../controllers/campsiteController.mjs";
import { validateCampsite } from "../middleware/validateCampsite.mjs";
import {isAuth} from "../middleware/isAuth.mjs";

const router = express.Router();

router.get("/:id", campsiteController.getCampsiteById);
router.get("/", campsiteController.getAllCampsites);

router.post("/", isAuth, validateCampsite, campsiteController.createCampsite);

router.put("/:id", isAuth, validateCampsite, campsiteController.replaceCampsite);

router.delete("/:id", isAuth, campsiteController.deleteCampsite);

export default router;