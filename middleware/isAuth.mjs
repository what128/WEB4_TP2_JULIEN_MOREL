import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import * as utils from "../utils/utils.mjs";

dotenv.config();


/**
 * Retourne une erreur spécifiant que l'utilisateur n'est pas authentifié.
 *
 * @param {*} res La réponse à retourner au client.
 * @param {*} req La requête envoyée par le client.
 * @returns {*} L'objet d'erreur avec le code 401.
 */
function return401(res, req) {
    return res.status(401).json({
        error: "Non authentifié",
        message: "Vous devez être authentifié pour effectuer cette opération",
        status: 401,
        path: req.originalUrl,
        timestamp: new Date().toISOString()
    });
}


/**
 * Retourne une erreur spécifiant que l'utilisateur n'a pas accès à la ressource spécifiée.
 *
 * @param {*} res La réponse à retourner au client.
 * @param {*} req La requête envoyée par le client.
 * @returns {*} L'objet d'erreur avec le code 403.
 */
function return403(res, req) {
    return res.status(403).json({
        error: "Accès refusé",
        message: "Vous n'avez pas l'autorisation d'accéder à cette ressource.",
        status: 403,
        path: req.originalUrl,
        timestamp: new Date().toISOString()
    });
}


/**
 * Vérifie si l'utilisateur est authentifié avant de passer au prochain middleware.
 *
 * @param {*} req La requête envoyée par l'utilisateur.
 * @param {*} res La réponse à retourner à l'utilisateur.
 * @param {*} next Le prochain middleware à exécuter.
 * @returns {*} Un objet d'erreur, si une erreur s'est produite.
 */
export const isAuth = (req, res, next) => {
    const authHeader = req.get("Authorization");

    if (!authHeader) {
        return return401(res, req);
    }

    const token = authHeader.split(" ")[1];

    let decodedToken;

    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decodedToken;

        next();
    }
    catch (err) {
        err.statusCode = 401;
        return next(err);
    }
}


/**
 * Vérifie si l'utilisateur est un administrateur avant de passer au prochain middleware.
 *
 * @async
 * @param {*} req La requête envoyée par l'utilisateur.
 * @param {*} res La réponse à retourner à l'utilisateur.
 * @param {*} next Le prochain middleware à exécuter.
 * @returns {unknown} Un objet d'erreur, si une erreur s'est produite.
 */
export const isAdmin = async (req, res, next) => {
    const token = req.user;

    if (!token) {
        return return401(res, req);
    }

    const role = token.role;

    if (!utils.validateRoleAdmin(role)) {
        return return403(res, req);
    }
    next();
}