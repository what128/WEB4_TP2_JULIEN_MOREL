import mongoose from "mongoose";
import User from "../models/user.mjs";
import * as utils from "../utils/utils.mjs";

export const validateUser = async (req, res, next) => {
    const {firstName, lastName, email, phone, password, role} = req.body;
    console.log("start validate user");

    if (!utils.validateFieldsNotEmpty([firstName, lastName, email, password, role])){
        const error = new Error(`Le nom complet, le courriel, le mot de passe et le rôle de l'utilisateur sont requis.`);
        error.statusCode = 400;
        return next(error);  
    }
    console.log("start validate first name");

    if (utils.stringVide(firstName)){
        const error = new Error(`Le prénom est invalide.`);
        error.statusCode = 422;
        return next(error);  
    }

    if (utils.stringVide(lastName)){
        const error = new Error(`Le nom est invalide.`);
        error.statusCode = 422;
        return next(error); 
    }

    if (!utils.validateEmail(email)){
        const error = new Error(`Le courriel n'a pas un format valide.`);
        error.statusCode = 422;
        return next(error); 
    }

    if (!utils.validatePassword(password)){
        const error = new Error(`Le mot de passe doit contenir 8 caractères, dont au moins 1 majuscule, minuscule, caractère spécial et chiffre.`);
        error.statusCode = 422;
        return next(error);
    }

    console.log("start finding user");
    const unUtilisateur = await User.findOne({ email: email });

    if (unUtilisateur != null){
        const error = new Error(`Un utilisateur avec ce même courriel existe déjà.`);
        error.statusCode = 409;
        return next(error); 
    }

    if (utils.validateFieldNotEmpty(phone) && !utils.validatePhone(phone)){
        const error = new Error(`Le numéro de téléphone doit être composé de 10 chiffres s'il est présent.`);
        error.statusCode = 422;
        return next(error); 
    }

    if (!utils.validateRole(role)){
        const error = new Error(`Le rôle de l'utilisateur est invalide.`);
        error.statusCode = 422;
        return next(error);
    }

    next();
}

export const validateUserBasic = async (req, res, next) => {
    const {email, password} = req.body;

    if (!email || !password){
        const error = new Error(`Le courriel et le mot de passe sont requis.`);
        error.statusCode = 400;
        return next(error);  
    }

    if (utils.stringVide(email)){
        const error = new Error(`Le courriel est vide.`);
        error.statusCode = 422;
        return next(error);  
    }

    if(utils.stringVide(password)){
        const error = new Error(`Le mot de passe vide.`);
        error.statusCode = 422;
        return next(error); 
    }

    next();
}

export const validateUserReplacement = async (req, res, next) => {
    const {firstName, lastName, phone, role} = req.body;

    if (!firstName || !lastName){
        const error = new Error(`Le nom complet est requis.`);
        error.statusCode = 400;
        return next(error);  
    }

     if (utils.stringVide(firstName) || utils.stringVide(lastName)){
        const error = new Error(`Le nom complet est requis.`);
        error.statusCode = 422;
        return next(error);  
    }

    const phoneRegex = /^[\d]{10}$/;

    if (phone != null && !phoneRegex.test(phone)){
        const error = new Error(`Le numéro de téléphone doit être composé de 10 chiffres s'il est présent.`);
        error.statusCode = 422;
        return next(error); 
    }

    const allowedRoles = ["user", "admin"];

    if (role != null && !allowedRoles.includes(role)){
        const error = new Error(`Le rôle de l'utilisateur est invalide.`);
        error.statusCode = 422;
        return next(error);
    }
    next();
}