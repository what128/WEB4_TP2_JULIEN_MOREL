import express from "express";
import * as reservationController from "../controllers/reservationController.mjs";
import { validateReservation } from "../middleware/validateReservation.mjs";

const router = express.Router();

router.get("/:id", reservationController.getReservationById);
router.get("/", reservationController.getReservations);

router.post("/", validateReservation, reservationController.createReservation);

router.put("/:id", validateReservation, reservationController.replaceReservation);

console.log(reservationController.getReservationById);

export default router;