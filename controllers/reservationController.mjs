import Reservation from "../models/reservation.mjs";
import Campsite from "../models/campsite.mjs";
import * as utils from "../utils/utils.mjs";

/**
 * Retrouve une réservation par son identifiant dans la base de données.
 *
 * @export
 * @async
 * @param {*} req La requête envoyée par le client.
 * @param {*} res La réponse à retourner au client.
 * @param {*} next Le prochain middleware à appeler, en cas d'erreur.
 * @returns {*} Cette fonction ne retoune rien.
 */
export async function getReservationById(req, res, next) {
    const id = req.params.id;
    try {
        const uneReservation = await Reservation.findById(id);

        if (uneReservation) {

            if (uneReservation.user != req.user.id && !utils.validateRoleAdmin(req.user.role)) {
                const error = new Error(`Vous n'avez pas accès à cette réservation.`);
                error.statusCode = 403;
                throw error;
            }

            res.status(200).json({
                status: 200,
                message: "Réservation récupérée avec succès",
                data: uneReservation,
                path: `/api/reservations/${id}`,
                timestamp: new Date().toISOString()
            });
        }
        else {
            const error = new Error(`La réservation avec l'id ${id} est introuvable.`);
            error.statusCode = 404;
            throw error;
        }
    } catch (err) {
        next(err);
    }
}


/**
 * Retrouve les réservations d'un utilisateur par son état.
 *
 * @export
 * @async
 * @param {*} req La requête envoyée par l'utilisateur.
 * @param {*} res La réponse à retourner à l'utilisateur.
 * @param {*} next Le prochain middleware à appeler, en cas d'erreur.
 * @returns {*} Cette fonction ne retourne rien.
 */
export async function getMyReservationsByStatus(req, res, next) {
    const statusRequete = req.query.status;
    try {
        if (!utils.validateReservationsStatus(statusRequete)) {
            let error = new Error(`Le statut ${statusRequete} n'est pas valide.`);
            error.statusCode = 422;
            throw error;
        }
        const reservations = await Reservation.find(
            {
                status: statusRequete,
                user: { $eq: req.user.id }
            }
        );
        if (reservations.length >= 0) {
            res.status(200).json({
                status: 200,
                message: `Réservations correspondant au statut ${statusRequete} récupérés avec succès.`,
                data: reservations,
                path: `/api/reservations/?status=${statusRequete}`,
                timestamp: new Date().toISOString()
            })
        }
    }
    catch (err) {
        next(err);
    }
}


/**
 * Remplace une réservation dans la base de données par les nouvelles propriétés définies dans la requête du client.
 *
 * @export
 * @async
 * @param {*} req La requête envoyée par le client.
 * @param {*} res La réponse à retourner au client.
 * @param {*} next Le prochain middleware à appeler, en cas d'erreur.
 * @returns {*} Cette fonction ne retourne rien.
 */
export async function replaceReservation(req, res, next) {
    const id = req.params.id;
    try {
        let uneReservation = await Reservation.findById(id);

        if (uneReservation) {
            const parametresRecherche = {
                _id: { $ne: id },
                campsite: req.body.campsite,
                user: req.body.user,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                guests: req.body.guests,
                totalPrice: req.body.totalPrice,
                status: req.body.status
            };

            const doublon = await Reservation.findOne(parametresRecherche);

            if (doublon != null) {
                const error = new Error("Une réservation identique existe déjà.");
                error.statusCode = 409;
                throw error;
            }

            uneReservation = await creerOuRemplacerObjetReservation(req, uneReservation);
            await uneReservation.save();

            res.status(200).json({
                status: 200,
                message: "La réservation a été remplaçée avec succès.",
                data: uneReservation,
                path: `/api/reservations/${uneReservation._id}`,
                timestamp: new Date().toISOString()
            })
        }
        else {
            const error = new Error(`La réservation avec l'id ${id} est introuvable.`);
            error.statusCode = 404;
            throw error;
        }
    } catch (err) {
        next(err);
    }
}


/**
 * Créée ou remplace une réservation dans la base de données en fonction de la requête du client.
 *
 * @async
 * @param {*} req La requête envoyée par le client
 * @param {*} [uneReservationExistante=null] Une réservation existante, si le but est de la remplacer.
 * @returns {unknown} L'objet reservation qui a été créé ou modifié
 */
async function creerOuRemplacerObjetReservation(req, uneReservationExistante = null) {
    const NB_MILLISECONDES_POUR_UNE_JOURNEE = 86400000;
    const { campsite, startDate, endDate, guests} = req.body;
    const status = "pending";
    const user = req.user.id;
    const unCampsite = await Campsite.findById(campsite);
    if (!unCampsite) {
        const error = new Error(`Le site de campement avec l'id ${campsite} est introuvable.`);
        error.statusCode = 404;
        throw error;
    }

    const dateDebut = new Date(startDate);
    const dateFin = new Date(endDate);

    const differenceEnJoursDates = (dateFin - dateDebut) / NB_MILLISECONDES_POUR_UNE_JOURNEE;
    const totalPrice = differenceEnJoursDates * unCampsite.pricePerNight;

    let uneReservation;

    if (uneReservationExistante != null) {
        uneReservationExistante.campsite = campsite;
        uneReservationExistante.user = user;
        uneReservationExistante.startDate = dateDebut;
        uneReservationExistante.endDate = dateFin;
        uneReservationExistante.guests = guests ?? null;
        uneReservationExistante.totalPrice = totalPrice;
        uneReservationExistante.status = status.toLowerCase();
    }
    else {
        uneReservation = new Reservation({
            campsite: campsite,
            user: user,
            startDate: dateDebut,
            endDate: dateFin,
            guests: guests ?? null,
            totalPrice: totalPrice,
            status: status.toLowerCase()
        });
    }

    return uneReservationExistante ?? uneReservation;
}


/**
 * Créée une réservation dans la base de données en fonction des paramètres fournis par le client.
 *
 * @export
 * @async
 * @param {*} req La requête envoyée par le client.
 * @param {*} res La réponse à retourner au client.
 * @param {*} next Le prochain middleware à appeler, s'il y a une erreur.
 * @returns {*} Cette fonction ne retourne rien.
 */
export async function createReservation(req, res, next) {
    let uneReservation = await creerOuRemplacerObjetReservation(req);

    try {
        await uneReservation.save();
        res.location(`/api/reservations/${uneReservation._id}`);
        res.status(201).json({
            status: 201,
            message: "Réservation ajoutée",
            data: uneReservation,
            path: `/api/reservations/${uneReservation._id}`,
            timestamp: new Date().toISOString()
        })
    }
    catch (err) {
        next(err);
    }
}


/**
 * Retrouve toutes les réservations d'un utilisateur dans la base de données.
 *
 * @export
 * @async
 * @param {*} req La requête envoyée par le client.
 * @param {*} res La réponse retournée au client.
 * @param {*} next Le prochain middleware à appeler, s'il y a une erreur.
 * @returns {*} Cette fonction ne retourne rien.
 */
export async function getMyReservations(req, res, next) {
    const status = req.query.status;
    if (status != null) {
        getMyReservationsByStatus(req, res, next);
        return;
    }
    try {
        const reservations = await Reservation.find({
            user: { $eq: req.user.id }
        });
        if (reservations.length >= 0) {
            res.status(200).json({
                status: 200,
                message: "Réservations récupérés avec succès.",
                data: reservations,
                path: `/api/reservations/`,
                timestamp: new Date().toISOString()
            });
        }
    }
    catch (err) {
        next(err);
    }
}


/**
 * Modifie le statut d'une réservation appratenant à l'utilisateur dans la base de données.
 *
 * @export
 * @async
 * @param {*} req La requête envoyée par l'utilisateur.
 * @param {*} res La réponse à retourner à l'utilisateur.
 * @param {*} next Le prochain middleware à appeler, en cas d'erreur.
 * @returns {*} Cette fonction ne retourne rien.
 */
export async function changeStatusReservation(req, res, next) {
    try {
        let uneReservation = await Reservation.findById(req.params.id);

        if (!uneReservation) {
            const error = new Error(`La réservation avec l'id ${id} est introuvable.`);
            error.statusCode = 404;
            throw error;
        }

        const status = req.body.status;
        if (!utils.validateReservationsStatus(status)) {
            const error = new Error(`Le nouveau statut de réservation est invalide.`);
            error.statusCode = 422;
            throw error;
        }

        uneReservation.status = status;

        await uneReservation.save();
        res.status(200).json({
            status: 200,
            message: `Statut de la réservation avec l'id ${req.params.id} modifié avec succès.`,
            data: uneReservation,
            path: `/api/reservations/${req.params.id}`,
            timestamp: new Date().toISOString()
        });
    }
    catch (err) {
        next(err);
    }
}