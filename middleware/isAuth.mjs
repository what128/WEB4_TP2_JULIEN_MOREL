import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.mjs";

dotenv.config();

function return401(res, req){
    return res.status(401).json({
            error: "Non authentifié",
            message: "Non authentifié",
            status: 401,
            path: req.originalUrl,
            timestamp: new Date().toISOString()
        });
}

export const isAuth = (req, res, next) => {
    const authHeader = req.get("Authorization");

    if(!authHeader){
        return return401(res, req);
    }

    const token = authHeader.split(" ")[1];

    let decodedToken;

    try{
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decodedToken;

        next();
    }
    catch(err){
        err.statusCode = 401;
        return next(err);
    }
}

export const isAdmin = async (req, res, next) => {
const token = req.user;

if (!token){
     return return401(res, req);
}

const role = token.role;

if (!role){
      return return401(res, req);
}




}