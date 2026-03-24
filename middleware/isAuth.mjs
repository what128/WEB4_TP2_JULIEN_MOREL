import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const isAuth = (req, res, next) => {
    const authHeader = req.get("Authorization");

    if(!authHeader){
        return res.status(401).json({
            error: "Non authentifié",
            message: "Non authentifié",
            status: 401,
            path: req.path,
            timestamp: new Date().toISOString()
        });
    }

    const token = authHeader.split(" ")[1];


    console.log("token ", token);
    let decodedToken;

    try{
        decodedToken = jwt.verify(token, process.env.SECRET_JWT);

        req.user = decodedToken;

        console.log("req.user", req.user);
        next();
    }
    catch(err){
        err.statusCode = 401;
        return next(err);
    }
}