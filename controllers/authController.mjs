import User from "../models/user.mjs";

import bcrypt from "bcrypt";

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
        
        console.log('creation du nouveau user');
        await unUtilisateur.save();

        const aUser = unUtilisateur.toObject();
        delete aUser.password;

        res.location(`/api/reservations/${unUtilisateur._id}`);
        res.status(201).json({
            status: 201,
            message: "Utilisateur créé",
            data:{
                user: aUser
            },
            path: `/api/auth/register`,
            timestamp: new Date().toISOString()
    })
    }
    catch(err){
        next(err);
    }
}