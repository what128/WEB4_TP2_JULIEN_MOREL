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
        console.log("isEqual ", isEqual);

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