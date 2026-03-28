import mongoose from "mongoose";
import Campsite from "../models/campsite.mjs";
import Reservation from "../models/reservation.mjs";
import User from "../models/user.mjs";
import * as utils from "../utils/utils.mjs";


export const validateReservation = async (req, res, next) => {
const id = req.params.id;
const {campsite, startDate, endDate, guests, totalPrice, status} = req.body;

if (!campsite || !startDate || !endDate){
    const error = new Error("Le site de campement, ainsi que la date de début et de fin sont requis pour une réservation.");
    error.statusCode = 400;
    return next(error);
}

const unCampSite = await Campsite.findById(campsite);
console.log(unCampSite);
if (!unCampSite){
     const error = new Error("Le site de campement sélectionné pour la réservation n'existe pas.");
    error.statusCode = 404;
    return next(error);
}

const unUtilisateur = await User.findById(req.user.id);
if (!unUtilisateur){
     const error = new Error("L'utilisateur sélectionné pour la réservation n'existe pas.");
    error.statusCode = 404;
    return next(error);
}

let dateDebut = new Date(startDate);
let dateFin = new Date(endDate);

if (dateFin <= dateDebut){
    const error = new Error("La date de début doit être avant la date de fin.");
    error.statusCode = 422;
    return next(error);
}

if (guests != null && guests <= 0){
    const error = new Error("Le nombre d'invités doit être supérieur à 0.");
    error.statusCode = 422;
    return next(error);
}

if (guests != null && guests > unCampSite.capacity)
{
    const error = new Error("Le nombre d'invités dépasse la capacité maximale du site de campement.");
    error.statusCode = 400;
    return next(error);
}

const possibleStatusValues = ["pending", "confirmed", "cancelled"];

if (status != null && !possibleStatusValues.include(status.toLowerCase())){
    const error = new Error("Le statut de la réservation est invalide.");
    error.statusCode = 400;
    return next(error); 
}

next();
}

export const validatePutPatchReservation = async (req, res, next) => {
    const id = req.params.id;

    const reservationCourante = await Reservation.findById(id);

    if (reservationCourante == null)
    {
        const error = new Error(`Réservation avec l'id ${id} introuvable.`);
        error.statusCode = 404;
        return next(error); 
    }

    if (req.method.toLowerCase() == "patch" || req.method.toLowerCase() == "PUT")
    {
        const owner = reservationCourante.user;
        if (req.user.id != owner && !utils.validateRoleAdmin(req.user.role))
        {
            const error = new Error(`Réservation introuvable.`);
            error.statusCode = 404;
            return next(error); 
        }
}

if (req.method.toLowerCase() == "patch")
{
    if (!utils.validateReservationsStatus(req.body.status)){
        const error = new Error("Le statut de la réservation est invalide.");
        error.statusCode = 422;
        return next(error);
    }
    if (!utils.validateRoleAdmin(req.user.role))
    {
        console.log("user pas admin");
        if (reservationCourante.status != 'pending' && reservationCourante.status != 'confirmed'){
            const error = new Error("Impossible de modifier une réservation n'ayant pas le statut pending ou confirmed.");
            error.statusCode = 400;
            return next(error);
        }
        if (reservationCourante.status == 'confirmed' && req.body.status.toLowerCase() != "cancelled"){
            const error = new Error("Impossible de revenir en arrière sur une réservation confirmée.");
            error.statusCode = 400;
            return next(error);
        }
        if (reservationCourante.status == "cancelled")
        {
            const error = new Error("Impossible de revenir en arrière sur une réservation annulée.");
            error.statusCode = 400;
            return next(error);
        }
    }
}
next();
}
