import express from "express";
import * as reservationController from "../controllers/reservationController.mjs";

const router = express.Router();

router.get("/api/reservations/:id", reservationController.getReservationById);



export default router;