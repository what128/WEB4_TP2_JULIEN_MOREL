import express from "express";
import * as campsiteController from "../controllers/campsiteController.mjs";
import { validateCampsite } from "../middleware/validateCampsite.mjs";

const router = express.Router();

router.get("/:id", campsiteController.getCampsiteById);
router.get("/", campsiteController.getAllCampsites);

router.post("/", validateCampsite, campsiteController.createCampsite);

router.put("/:id", validateCampsite, campsiteController.replaceCampsite);

router.delete("/:id", campsiteController.deleteCampsite);

export default router;