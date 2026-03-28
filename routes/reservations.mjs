import express from "express";
import * as reservationController from "../controllers/reservationController.mjs";
import { validateReservation, validatePutPatchReservation } from "../middleware/validateReservation.mjs";
import {isAuth} from "../middleware/isAuth.mjs";

const router = express.Router();

router.get("/:id", isAuth, reservationController.getReservationById);
router.get("/", isAuth, reservationController.getMyReservations);

router.post("/", isAuth, validateReservation, reservationController.createReservation);

router.put("/:id", isAuth, validatePutPatchReservation, reservationController.replaceReservation);

router.patch("/:id", isAuth, validatePutPatchReservation, reservationController.changeStatusReservation)

console.log(reservationController.getReservationById);

export default router;