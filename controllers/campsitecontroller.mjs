import Campsite from "../models/campsite.mjs";
import Reservation from "../models/reservation.mjs";
import * as utils from "../utils/utils.mjs";



/**
 * Retrouve un site de campement par son id.
 *
 * @export
 * @async
 * @param {*} req La requête envoyée par le client
 * @param {*} res La réponse à retourner au client
 * @param {*} next Le prochain middleware à exécuter, s'il y a une erreur.
 * @returns {*} 
 */
export async function getCampsiteById(req, res, next){
    const id = req.params.id;
    try {
        const unCampSite = await Campsite.findById(id);

        if (unCampSite) {
            res.status(200).json({
                status: 200,
                message: "Site de campement récupéré avec succès",
                data: unCampSite,
                path: `/api/campsites/${id}`,
                timestamp: new Date().toISOString()
            });
        } 
        else
        {
            const error = new Error(`Le site de campement avec l'id ${id} est introuvable.`);
            error.statusCode = 404;
            throw error;
        }
    } catch(err) {
        next(err);
    }
}


/**
 * Créée un objet campsite à partir de la requête envoyée par le client.
 *
 * @param {*} req La requête envoyée par le client, contenant les informations du site de campement.
 * @returns {*} L'objet campsite à rajouter dans la base de données.
 */
function creerObjetCampsite(req){
const {name, location, description, type, pricePerNight, capacity, maxVehicleLength, amenities} = req.body;
    let campsite = null;

    if (!maxVehicleLength){
        if (!amenities){
            campsite = new Campsite({
            name,
            location,
            description,
            type,
            pricePerNight,
            capacity
        });
        }
        else
        {
            campsite = new Campsite({
                name,
                location,
                description,
                type,
                pricePerNight,
                capacity,
                amenities
            });
        }
    }
    else
    {
        if(!amenities)
        {
            campsite = new Campsite({
            name,
            location,
            description,
            type,
            pricePerNight,
            capacity,
            maxVehicleLength
        });
        }
        else
        {
            campsite = new Campsite({
            name,
            location,
            description,
            type,
            pricePerNight,
            capacity,
            maxVehicleLength,
            amenities
        });
        } 
    }
    return campsite;
}


/**
 * Remplace les propriétés d'un objet campsite par les propriétés dans la requête du client
 *
 * @param {*} campsite Le site de campement à remplacer.
 * @param {*} req La requête envoyée par le client.
 * @returns {*} Le site de campement avec ses propriété mises à jour.
 */
function remplacerObjetCampsite(campsite, req) {
    const { name, location, description, type, pricePerNight, capacity, maxVehicleLength, amenities } = req.body;

    campsite.name = name;
    campsite.location = location;
    campsite.type = type;
    campsite.pricePerNight = pricePerNight;
    campsite.capacity = capacity;

    if (maxVehicleLength != null) {
        campsite.maxVehicleLength = maxVehicleLength;
    }

    if (description != null) {
        campsite.description = description;
    }

    if (amenities != null) {
        campsite.amenities = amenities;
    }

    return campsite;
}


/**
 * Ajoute un objet campsite dans la base de données à partir d'une requête.
 *
 * @export
 * @async
 * @param {*} req La requête envoyée par le client.
 * @param {*} res La réponse à retourner au client.
 * @param {*} next Le prochain middleware à appeler, s'il y a une erreur.
 * @returns {*} Cette fonction ne retourne rien.
 */
export async function createCampsite(req, res, next){
   let campsite = creerObjetCampsite(req);

    try{
        const parametresRecherche = {
            name: campsite.name,
            location: campsite.location
        };

        const doublon = await Campsite.findOne(parametresRecherche);

        if (doublon){
            const error = new Error("Un site de camping identique existe déjà.");
            error.statusCode = 409;
            throw error;
        }

        await campsite.save();
        res.location(`/api/campsites/${campsite._id}`);
        res.status(201).json({
        status: 201,
        message: "Site de campement ajouté",
        data: campsite,
        path: `/api/campsites/${campsite._id}`,
        timestamp: new Date().toISOString()
    });
    }
    catch(err){
       next(err);
    }
}


/**
 * Remplace un objet campsite dans la base de données à partir d'une requête.
 *
 * @export
 * @async
 * @param {*} req La requête envoyée par le client
 * @param {*} res La réponse à retourner au client.
 * @param {*} next Le prochain middleware à appeler, en cas d'erreur.
 * @returns {*} Cette fonction ne retourne rien.
 */
export async function replaceCampsite(req, res, next){
  const id = req.params.id;
    try {
        let unCampSite = await Campsite.findById(id);

        if (unCampSite) {
            const parametresRecherche = {
            _id: {$ne: id},
            name: req.body.name,
            location: req.body.location
        };

        const doublon = await Campsite.findOne(parametresRecherche);

        if (doublon) {
            const error = new Error("Un site de camping identique existe déjà.");
            error.statusCode = 409;
            throw error;
        }

        unCampSite = remplacerObjetCampsite(unCampSite, req);
        await unCampSite.save();

        res.status(200).json({
            status: 200,
            message: "Le site de campement a été remplaçé avec succès.",
            data: unCampSite,
            path: `/api/campsites/${unCampSite._id}`,
            timestamp: new Date().toISOString()
        })
        } 
        else
        {
            const error = new Error(`Le site de campement avec l'id ${id} est introuvable.`);
            error.statusCode = 404;
            throw error;
        }
    } catch(err) {
        next(err);
    }  
}


/**
 * Envoi au client la liste de tous les sites de campement, ou bien filtrés par type.
 *
 * @export
 * @async
 * @param {*} req La requête envoyée par le client.
 * @param {*} res La réponse à retourner au client.
 * @param {*} next le prochain middleware à appeler, s'il y a une erreur.
 * @returns {*} Cette fonction ne retourne rien.
 */
export async function getAllCampsites(req, res, next){
    try{
        const type = req.query.type;
        if (!utils.stringVide(type) && !utils.validateCampsiteType(type))
        {
            const error = new Error("Le type de site de camping n'est pas valide.");
            error.statusCode = 422;
            throw error;   
        }
        const campSites = !utils.stringVide(type) ? await Campsite.find({type: {$eq: type}}) : await Campsite.find();
        if (campSites.length >= 0){
            res.status(200).json({
                status: 200,
                message: "Sites de campement récupérés avec succès.",
                data: campSites,
                path: `/api/campsites/`,
                timestamp: new Date().toISOString()
            });
        }
    }
    catch(err){
        next(err);
    }
}


/**
 * Valide la date de début et la date de fin d'une période, et retourne une erreur si la validation échoue.
 *
 * @param {*} startDate La date de début de la période.
 * @param {*} endDate La date de fin de la période.
 * @returns {*} Un objet d'erreur si la validation échoue, null autrement.
 */
function validateDatesAndReturnError(startDate, endDate)
{
    if ((startDate && !endDate) || (endDate && !startDate))
        {
                const error = new Error("Lorsque vous utilisez des dates, ils doivent être une période.");
                error.statusCode = 400;
                return error; 
        }

        const dateDebut = new Date(startDate);
        const dateFin = new Date(endDate);

        if (dateFin <= dateDebut)
        {
                const error = new Error("La période à rechercher est invalide.");
                error.statusCode = 422;
                return error;
        }
        return null;
}


/**
 * Valide si au moins un paramètre de recherche est spécifié dans la recherche d'un site de campement, et retourne
 * une erreur si la validation échoue.
 *
 * @param {*} req La requête de recherche envoyée par le client.
 * @returns {*} Un objet d'erreur si la validation échoue, null autrement.
 */
function validateSearchFieldsAndReturnError(req)
{
    const {startDate, endDate, type, guests, vehicleLength} = req.query;

    if(!utils.validateAtLeastOneFieldExists([startDate, endDate, type, guests, vehicleLength])){
        const error = new Error("Vous n'avez spécifié aucun critère de recherche pour un site de campement.");
        error.statusCode = 400;
        return error;
    }  
}

/**
 * Valide le type de site de campement, et retourne une erreur si la validation échoue.
 *
 * @param {*} type Le type du site de campement recherché.
 * @returns {*} Un objet d'erreur si la validation échoue, null autrement.
 */
function validateTypeAndReturnError(type)
{
    if (utils.validateFieldNotEmpty(type) && !utils.validateCampsiteType(type)){
        const error = new Error("Le type de site que vous avez recherché est invalide.");
        error.statusCode = 422;
        return error;
    }
    return null;
}


/**
 * Valide que le nombre de personnes et/ou la longueur du véhicule pour la recherche d'un site de campement
 * `sont biens des nombres supérieurs à 0, et retourne une erreur si la validation échoue.
 *
 * @param {*} personnes Le nombre de personnes dans la recherche.
 * @param {*} longeurVehicule La longueur du véhicule minimale recherchée.
 * @returns {*} Un objet d'erreur si la validation échoue, null autrement.
 */
function validateNumberFieldsAndReturnError(personnes, longeurVehicule)
{
    if ((personnes != null && personnes <=0) && (longeurVehicule != null && longeurVehicule <= 0))
    {
        const error = new Error("Les nombres doivent être positifs dans cette recherche.");
        error.statusCode = 422;
        return error;
    }
    return null;
}


/**
 * Recherche des sites de campement disponibles selon certains critères spécifiés par l'utilisateur.
 *
 * @export
 * @async
 * @param {*} req La requête envoyée par le client.
 * @param {*} res La réponse à retourner au client.
 * @param {*} next Le prochain middleware à appeler, s'il y a un erreur.
 * @returns {*} Cette fonction ne retourne rien.
 */
export async function getAllAvailableCampsites(req, res, next){
    try{
        let errorFields = validateSearchFieldsAndReturnError(req);
        if (errorFields != null) throw errorFields;

        const {startDate, endDate, type, guests, vehicleLength} = req.query;

        let errorDate = validateDatesAndReturnError(startDate, endDate);
        if (errorDate != null) throw errorDate;

        const dateDebut = new Date(startDate);
        const dateFin = new Date(endDate);

        let errorType = validateTypeAndReturnError(type);
        if (errorType != null) throw errorType;

        let typeCampsite = null;

        const personnes = guests ? parseInt(guests) : null;
        const longeurVehicule = vehicleLength ? parseFloat(vehicleLength) : null;

        let errorNumberFields = validateNumberFieldsAndReturnError(personnes, longeurVehicule);
        if (errorNumberFields != null) throw errorNumberFields;        

       const parametresRechercheReservation = {};

        if (startDate && endDate) {
            parametresRechercheReservation.startDate = { $lt: dateFin };
            parametresRechercheReservation.endDate = { $gt: dateDebut };
        }

        const reservations = await Reservation.find(parametresRechercheReservation).select('campsite');

        const campsitesIndisponibles = reservations.map(r => r.campsite);

        const parametresRechercheCampsite = {};

        if (type) {
            typeCampsite = type.toLowerCase();
            parametresRechercheCampsite.type = { $eq: typeCampsite };
        }

        if (guests) {
            parametresRechercheCampsite.capacity = { $gte: personnes };
        }

        if (vehicleLength) {
            parametresRechercheCampsite.maxVehicleLength = { $gte: longeurVehicule };
        }

        if (campsitesIndisponibles.length > 0) {
            parametresRechercheCampsite._id = { $nin: campsitesIndisponibles };
        }

        const availableCampsites = await Campsite.find(parametresRechercheCampsite);

        res.status(200).json(
            {
                status: 200,
                message: "Sites de campement disponibles récupérés avec succès.",
                data: availableCampsites,
                path: `/api/campsites/available`,
                timestamp: new Date().toISOString()
            }
        )
    }
    catch(err){
        next(err);
    }
}


/**
 * Supprime un site de campement à partir de son id dans la base de données.
 *
 * @export
 * @async
 * @param {*} req La requête envoyée par l'utilisateur.
 * @param {*} res La réponse à retourner à l'utilisateur.
 * @param {*} next Le prochain middleware à appeler, s'il y a une erreur.
 * @returns {*} Cette fonction ne retourne rien.
 */
export async function deleteCampsite(req, res, next){
    const id = req.params.id;
    const today = Date.now();
    try{
        const reservationsDuCampsite = await Reservation.find(
        {
            $and: [{campsite: {$eq: id}}, {endDate : {$gte: today}}]
        });

        if (reservationsDuCampsite != null && reservationsDuCampsite.length > 0)
        {
            const error = new Error("Ce site de campement ne peut être supprimé, car il est en cours d'utilisation par une réservation.");
                error.statusCode = 409;
                throw error;
        }

       await Campsite.findByIdAndDelete(id);
        res.status(204).json({});
    }
    catch(err){
        next(err);
    }
}