import Reservation from "../models/reservation.mjs";

export async function getReservationById(req, res, next){
    const id = req.params.id;
    try {
        const uneReservation = await Reservation.findById(id);

        if (uneReservation) {
            res.status(200).json({
                status: 200,
                message: "Réservation récupérée avec succès",
                data: uneReservation,
                path: `/api/reservations/${id}`,
                timestamp: new Date().toISOString()
            });
        } 
        else
        {
            const error = new Error(`La réservation avec l'id ${id} est introuvable.`);
            error.statusCode = 404;
            throw error;
        }
    } catch(err) {
        next(err);
    }
}

export async function getReservationsByStatus(req, res, next){
    const statusRequete = req.query.status;
    const possibleStatusValues = ["pending", "confirmed", "cancelled"];
    try{
            if (!possibleStatusValues.includes(statusRequete)){
                let error = new Error(`Le statut ${statusRequete} n'est pas valide.`);
                error.statusCode = 422;
                throw error;
            }
            const reservations = await Reservation.find(
                {
                    status: statusRequete
                }
            );
            if (reservations.length >= 0){
                res.status(200).json({
                    status: 200,
                    message: `Réservations correspondant au statut ${statusRequete} récupérés avec succès.`,
                    data: reservations,
                    path: `/api/reservations/?status=${statusRequete}`,
                    timestamp: new Date().toISOString()
                })
            }
    }
    catch(err){
        next(err);
    }
}

function remplacerObjetReservation(reservation, req) {
   const {campsite, user, startDate, endDate, guests, totalPrice, status} = req.body;

    reservation.campsite = campsite;
    reservation.user = user;
    reservation.startDate = startDate;
    reservation.endDate = endDate;
    reservation.guests = guests;
    reservation.totalPrice = totalPrice;
    reservation.status = status;

    return reservation;
}

export async function replaceReservation(req, res, next){
  const id = req.params.id;
    try {
        let uneReservation = await Reservation.findById(id);

        if (uneReservation) {
            const parametresRecherche = {
            _id: {$ne: id},
            campsite: req.body.campsite,
            user: req.body.user,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            guests: req.body.guests,
            totalPrice: req.body.totalPrice,
            status: req.body.status
        };

        const doublon = await Reservation.findOne(parametresRecherche);

        if (doublon) {
            const error = new Error("Une réservation identique existe déjà.");
            error.statusCode = 409;
            throw error;
        }

        uneReservation = remplacerObjetReservation(uneReservation, req);
        await uneReservation.save();

        res.status(200).json({
            status: 200,
            message: "La réservation a été remplaçée avec succès.",
            data: uneReservation,
            path: `/api/reservations/${uneReservation._id}`,
            timestamp: new Date().toISOString()
        })
        } 
        else
        {
            const error = new Error(`La réservation avec l'id ${id} est introuvable.`);
            error.statusCode = 404;
            throw error;
        }
    } catch(err) {
        next(err);
    }  
}

function creerObjetReservation(req, id = -1){
const {campsite, user, startDate, endDate, guests, totalPrice, status} = req.body;
    let uneReservation = new Reservation({
        campsite,
        user,
        startDate,
        endDate,
        guests,
        totalPrice,
        status
    });    
    return uneReservation;
}

export async function createReservation(req, res, next){
   let uneReservation = creerObjetReservation(req);

    try{
        await uneReservation.save();
        res.location(`/api/reservations/${reservation._id}`);
        res.status(201).json({
        status: 201,
        message: "Réservation ajoutée",
        data: uneReservation,
        path: `/api/reservations/${uneReservation._id}`,
        timestamp: new Date().toISOString()
    })
    }
    catch(err){
       next(err);
    }
}

export async function getReservations(req, res, next){
    const status = req.query.status;
    if (status != null){
        getReservationsByStatus(req, res, next);
        return;
    }
    try{
        const reservations = await Reservation.find();
        if (reservations.length >= 0){
            res.status(200).json({
                status: 200,
                message: "Réservations récupérés avec succès.",
                data: reservations,
                path: `/api/reservations/`,
                timestamp: new Date().toISOString()
            });
        }
    }
    catch(err){
        next(err);
    }
}