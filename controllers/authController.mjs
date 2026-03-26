import User from "../models/user.mjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

export async function createUser(req, res, next){
    const {firstName, lastName, email, phone, password, role} = req.body;

    try{
        let hashedPassword = await bcrypt.hash(password, 15);
        let unUtilisateur = null;
        if (!phone){
            unUtilisateur = new User({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hashedPassword,
                role: role
            });
        }
        else
        {
             unUtilisateur = new User({
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone,
                password: hashedPassword,
                role: role
            });
        }
        
        await unUtilisateur.save();

        const userResponse = unUtilisateur.toObject();
        delete userResponse.password;

        res.location(`/api/reservations/${unUtilisateur._id}`);
        res.status(201).json({
            status: 201,
            message: "Utilisateur créé",
            data:{
                user: userResponse
            },
            path: `/api/auth/register`,
            timestamp: new Date().toISOString()
    })
    }
    catch(err){
        next(err);
    }
}

export async function loginUser(req, res, next){
    const {email, password} = req.body;
    try{
        
        const user = await User.findOne({email: email}).select("+password");

        console.log("user found: ", user);
        if(!user){
            const error = new Error(`Courriel ou mot de passe invalide.`);
            error.statusCode = 401;
            throw error;
        }

        const isEqual = await bcrypt.compare(password, user.password);

        if(!isEqual){
            const error = new Error(`Courriel ou mot de passe invalide.`);
            error.statusCode = 401;
            throw error;
        }

        const userResponse = user.toObject();

        delete userResponse.password;

        console.log("user object ", userResponse);

        console.log("avant signature token");
        
        const token = jwt.sign({
            email: user.email,
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        });

        console.log("apres signature token");

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        res.status(200).json({
            status: 200,
            message: "Utilisateur authentifié avec succès",
            data: {
                user: userResponse,
                token: token
            },
            path: `/api/auth/login`,
            timestamp: new Date().toISOString()
        });
    }
    catch(err){
        next(err);
    }
}

export async function getProfileInfo(req, res, next){
    const authHeader = req.get("Authorization");

    if(!authHeader){
        return res.status(401).json({
            error: "Non authentifié",
        });
    }

    const token = authHeader.split(" ")[1];

    let decodedToken;

    try{
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decodedToken;

        const user = await User.findOne({email: req.user.email});

        if(!user){
            const error = new Error(`Non Authentifié.`);
            error.statusCode = 401;
            throw error;
        }

        res.status(200).json({
            status: 200,
            data: user,
            message: "Informations du profil récupérés avec succès.",
            path: `/api/auth/profile`,
            timestamp: new Date().toISOString()
        });


        console.log("req.user", req.user);
        next();
    }
    catch(err){
        err.statusCode = 401;
        return next(err);
    }
}

function replaceUserObject(user, req){
    const {firstName, lastName, phone, role} = req.body;

    user.firstName = firstName;
    user.lastName = lastName;
    if (phone){
        user.phone = phone;
    }
    if(role){
        user.role = role;
    }
    return user;
}

export async function replaceProfileInfo(req, res, next){
    const authHeader = req.get("Authorization");

    if(!authHeader){
        return res.status(401).json({
            error: "Non authentifié",
        });
    }

    const token = authHeader.split(" ")[1];

    let decodedToken;

    try{
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decodedToken;

        let user = await User.findOne({email: req.user.email});

        if(!user){
            const error = new Error(`Non Authentifié.`);
            error.statusCode = 401;
            throw error;
        }

        user = replaceUserObject(user, req);

        await user.save();

        res.status(200).json({
            status: 200,
            data: user,
            message: "Informations du profil mises à jour avec succès.",
            path: `/api/auth/profile`,
            timestamp: new Date().toISOString()
        });

        next();
    }
    catch(err){
        err.statusCode = 401;
        return next(err);
    }
}

export async function changePassword(req, res, next){
    const {currentPassword, newPassword} = req.body;

    try{
        if (!currentPassword || !newPassword){
            const error = new Error(`Le nouveau et l'ancien mot de passe sont requis.`);
            error.statusCode = 400;
            throw error;
        }
    
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
        if (!passwordRegex.test(newPassword)){
            const error = new Error(`Le mot de passe doit contenir 8 caractères, dont au moins 1 majuscule, minuscule, caractère spécial et chiffre.`);
            error.statusCode = 422;
            return next(error);
        }
    
        let user = await User.findOne({email: req.user.email}).select("+password");
    
        if(!user){
                const error = new Error(`Mot de passe courant invalide.`);
                error.statusCode = 401;
                throw error;
        }
    
        const isEqual = await bcrypt.compare(currentPassword, user.password);
    
        if(!isEqual){
            const error = new Error(`L'ancien mot de passe est invalide.`);
            error.statusCode = 401;
            throw error;
        }

        let hashedPassword = await bcrypt.hash(newPassword, 15);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            status: 200,
            data: user,
            message: "Mot de passe du profil mis à jour avec succès.",
            path: `/api/auth/profile`,
            timestamp: new Date().toISOString()
        });


    }
    catch(err){
        next(err);
    }
    


    
}