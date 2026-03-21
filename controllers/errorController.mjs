import { STATUS_CODES } from "http";

export const get404 = (err, req, res, next) => {
    console.log("DANS LE 404");
    if (err.statusCode === 404)
    {
            res.status(404).json({
                error: "Not Found",
                message: `Route ${req.originalURL} non trouvée`,
                status: 404,
                path: req.path,
                timestamp: new Date().toISOString()
            });
    }
    else
    {
        next(err);
    }
}


export const getErrors = (err, req, res, next) =>{
    if (err.kind === "ObjectId" && err.name === "CastError"){
        err.statusCode = 400;
        err.message = "L'id n'a pas un format valide.";
    }

    if (err.name === "ValidationError"){
        err.message = `Erreur de validation: ${err.message}`;
        err.statusCode = 400;
    }

    if (!err.statusCode){
        err.statusCode = 500;
    }

    res.status(err.statusCode).json({
        error: STATUS_CODES[err.statusCode],
        message: err.message,
        status: err.statusCode,
        path: req.path,
        timestamp: new Date().toISOString()
    })
}