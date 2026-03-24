import mongoose from "mongoose";

export const validateReservation = (req, res, next) => {
const id = req.params.id;
const {campsite, user, startDate, endDate, guests, totalPrice, status} = req.body;

if (!campsite || !user || !startDate || !endDate || guests == null || totalPrice == null || !status){
    const error = new Error("Le site de campement, l'utilisateur, la date de début et de fin, le nombre d'invités"
        + " ainsi que le prix total sont requis pour une réservation.");
    error.statusCode = 400;
    return next(error);
}

const unCampSite = mongoose.model("Campsite").findById(campsite);
console.log(unCampSite);
if (!unCampSite){
     const error = new Error("Le site de campement sélectionné pour la réservation n'existe pas.");
    error.statusCode = 404;
    return next(error);
}

const unUtilisateur = mongoose.model("Campsite").findById(user);
if (!unUtilisateur){
     const error = new Error("L'utilisateur sélectionné pour la réservation n'existe pas.");
    error.statusCode = 404;
    return next(error);
}


if (endDate <= startDate){
    const error = new Error("La date de début doit être avant la date de fin.");
    error.statusCode = 422;
    return next(error);
}

if (guests <= 0){
    const error = new Error("Le nombre d'invités doit être supérieur à 0.");
    error.statusCode = 422;
    return next(error);
}

if (totalPrice <= 0){
    const error = new Error("Le prix total doit être supérieur à 0.");
    error.statusCode = 422;
    return next(error);
}

const possibleStatusValues = ["pending", "confirmed", "cancelled"];

if (!possibleStatusValues.include(status)){
   const error = new Error("Le statut de la réservation est invalide.");
    error.statusCode = 400;
    return next(error); 
}

const reservationCourante = mongoose.model("Reservation").findById(id);

if (req.method == "PATCH")
{
    if (reservationCourante.status != 'pending'){
        const error = new Error("Impossible de modifier une réservation n'ayant pas le statut pending.");
        error.statusCode = 400;
        return next(error);
    }
}
}
