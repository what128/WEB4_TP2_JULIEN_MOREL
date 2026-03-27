import express from "express";
import * as reservationController from "../controllers/reservationController.mjs";
import { validateReservation } from "../middleware/validateReservation.mjs";
import {isAuth} from "../middleware/isAuth.mjs";

const router = express.Router();

router.get("/:id", reservationController.getReservationById);
router.get("/", isAuth, reservationController.getReservations);

router.post("/", isAuth, validateReservation, reservationController.createReservation);

router.put("/:id", isAuth, validateReservation, reservationController.replaceReservation);

console.log(reservationController.getReservationById);

export default router;