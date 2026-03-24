import mongoose from "mongoose";

export const validateUser = async (req, res, next) => {
    const {firstName, lastName, email, phone, password, role} = req.body;

    if (!firstName || !lastName || !email || !password || !role){
        const error = new Error(`Le nom complet, le courriel, le mot de passe et le rôle de l'utilisateur sont requis.`);
        error.statusCode = 400;
        return next(error);  
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)){
        const error = new Error(`Le courriel n'a pas un format valide.`);
        error.statusCode = 422;
        return next(error); 
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(password)){
        const error = new Error(`Le mot de passe doit contenir 8 caractères, dont au moins 1 majuscule, minuscule, caractère spécial et chiffre.`);
        error.statusCode = 422;
        return next(error);
    }

    const unUtilisateur = await mongoose.model("User").findOne({ email: email });

    if (unUtilisateur != null){
        const error = new Error(`Un utilisateur avec ce même courriel existe déjà.`);
        error.statusCode = 409;
        return next(error); 
    }

    const phoneRegex = /^[\d]{10}$/;
    if (phone != null && !phoneRegex.test(phone)){
        const error = new Error(`Le numéro de téléphone doit être composé de 10 chiffres s'il est présent.`);
        error.statusCode = 422;
        return next(error); 
    }

    const allowedRoles = ["user", "admin"];

    if (!allowedRoles.includes(role)){
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

     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)){
        const error = new Error(`Le courriel n'a pas un format valide.`);
        error.statusCode = 422;
        return next(error); 
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(password)){
        const error = new Error(`Le mot de passe doit contenir 8 caractères, dont au moins 1 majuscule, minuscule, caractère spécial et chiffre.`);
        error.statusCode = 422;
        return next(error);
    }

    next();
}