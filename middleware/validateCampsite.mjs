import * as utils from "../utils/utils.mjs";

/**
 * Valide les informations d'un site de campement, et retourne le prochain middleware à exécuter s'il y a une erreur.
 *
 * @param {*} req La requête envoyée par le client.
 * @param {*} res La réponse à retourner au client.
 * @param {*} next Le prochain middleware à exécuter.
 * @returns {*} Le prochain middleware à exécuter.
 */
export const validateCampsite = (req, res, next) => {
    const { name, location, type, pricePerNight, capacity, maxVehicleLength } = req.body;

    if (!utils.validateFieldsNotEmpty([name, location, type]) || pricePerNight == null || capacity == null) {
        const error = new Error(`Le nom, la localisation, le type, le prix par nuit et la capacité du site de campement sont requis.`);
        error.statusCode = 400;
        return next(error);
    }

    if (utils.stringVide(name) || utils.stringVide(location) || utils.stringVide(type)) {
        const error = new Error(`Le nom, la localisation et le type du site de campement sont requis.`);
        error.statusCode = 422;
        return next(error);
    }

    if (!utils.validateCampsiteType(type.toLowerCase())) {
        const error = new Error("Un type de site de campement devrait avoir une de ces valeurs: tente, rv, chalet, glamping, arrière-pays ou autre.");
        error.statusCode = 422;
        return next(error);
    }

    if (pricePerNight <= 0) {
        const error = new Error("Le prix par nuit du site de campement doit être supérieur à 0.");
        error.statusCode = 422;
        return next(error);
    }

    if (type.toLowerCase() === "rv" && maxVehicleLength == null) {
        const error = new Error("Un site de campement de type rv doit avoir une longueur maximale de véhicule.");
        error.statusCode = 400;
        return next(error);
    }

    if (type.toLowerCase() === "rv" && (maxVehicleLength <= 0)) {
        const error = new Error("Un site de campement de type rv doit avoir une longueur maximale de véhicule supérieure à 0.");
        error.statusCode = 422;
        return next(error);
    }

    if (capacity <= 0) {
        const error = new Error("La capacité du site de campement doit être un nombre positif.");
        error.statusCode = 422;
        return next(error);
    }

    next();
}