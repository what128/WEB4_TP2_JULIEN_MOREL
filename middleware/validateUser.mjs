import User from "../models/user.mjs";
import * as utils from "../utils/utils.mjs";


/**
 * Valide les information de l'utilisateur avant de passer au prochain middleware.
 *
 * @async
 * @param {*} req La requête envoyée par l'utilisateur.
 * @param {*} res La réponse à retourner à l'utilisateur.
 * @param {*} next Le prochain middleware à exécuter.
 * @returns {unknown} Le prochain middleware à exécuter.
 */
export const validateUser = async (req, res, next) => {
    const { firstName, lastName, email, phone, password, role } = req.body;

    if (!utils.validateFieldsNotEmpty([firstName, lastName, email, password, role])) {
        const error = new Error(`Le nom complet, le courriel, le mot de passe et le rôle de l'utilisateur sont requis.`);
        error.statusCode = 400;
        return next(error);
    }

    if (utils.stringVide(firstName)) {
        const error = new Error(`Le prénom n'est pas présent.`);
        error.statusCode = 422;
        return next(error);
    }

    if (utils.stringVide(lastName)) {
        const error = new Error(`Le nom n'est pas présent.`);
        error.statusCode = 422;
        return next(error);
    }

    if (!utils.validateEmail(email)) {
        const error = new Error(`Le courriel n'a pas le format attendu.`);
        error.statusCode = 422;
        return next(error);
    }

    if (!utils.validatePassword(password)) {
        const error = new Error(`Le mot de passe doit contenir 8 caractères, dont au moins 1 majuscule, minuscule, caractère spécial et chiffre.`);
        error.statusCode = 422;
        return next(error);
    }

    const unUtilisateur = await User.findOne({ email: email });

    if (unUtilisateur != null) {
        const error = new Error(`Un utilisateur avec ce même courriel existe déjà.`);
        error.statusCode = 409;
        return next(error);
    }

    if (utils.validateFieldNotEmpty(phone) && !utils.validatePhone(phone)) {
        const error = new Error(`Le numéro de téléphone doit être composé de 10 chiffres s'il est présent.`);
        error.statusCode = 422;
        return next(error);
    }

    if (!utils.validateRole(role)) {
        const error = new Error(`Le rôle de l'utilisateur doit être user ou admin.`);
        error.statusCode = 422;
        return next(error);
    }
    next();
}


/**
 * Valide les informations de base de l'utilisateur avant de passer à la connexion.
 *
 * @async
 * @param {*} req La requête envoyée par l'utilisateur.
 * @param {*} res La réponse à retourner à l'utilisateur.
 * @param {*} next Le prochain middleware à exécuter.
 * @returns {unknown} Le prochain middleware à exécuter.
 */
export const validateUserBasic = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        const error = new Error(`Le courriel et le mot de passe sont requis.`);
        error.statusCode = 400;
        return next(error);
    }

    if (utils.stringVide(email)) {
        const error = new Error(`Le courriel est vide.`);
        error.statusCode = 422;
        return next(error);
    }

    if (utils.stringVide(password)) {
        const error = new Error(`Le mot de passe est vide.`);
        error.statusCode = 422;
        return next(error);
    }
    next();
}


/**
 * Valide les informations de base de l'utilisateur pour le remplacement de ses informations.
 *
 * @async
 * @param {*} req La requête envoyée par l'utilisateur.
 * @param {*} res La réponse à retourner à l'utilisateur.
 * @param {*} next Le prochain middleware à exécuter.
 * @returns {unknown} Le prochain middleware à exécuter.
 */
export const validateUserReplacement = async (req, res, next) => {
    const { firstName, lastName, phone, role } = req.body;

    if (!firstName || !lastName) {
        const error = new Error(`Le nom complet (prénom et nom) est requis.`);
        error.statusCode = 400;
        return next(error);
    }

    if (utils.stringVide(firstName) || utils.stringVide(lastName)) {
        const error = new Error(`Le nom complet est requis.`);
        error.statusCode = 422;
        return next(error);
    }

    if (phone != null && !utils.validatePhone(phone)) {
        const error = new Error(`Le numéro de téléphone doit être composé de 10 chiffres s'il est présent.`);
        error.statusCode = 422;
        return next(error);
    }

    if (role != null && !utils.validateRole(role)) {
        const error = new Error(`Le rôle de l'utilisateur doit être user ou admin.`);
        error.statusCode = 422;
        return next(error);
    }
    next();
}