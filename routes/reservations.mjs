import express from "express";
import * as reservationController from "../controllers/reservationController.mjs";

const router = express.Router();

router.get("/:id", reservationController.getReservationById);
console.log(reservationController.getReservationById);

export default router;