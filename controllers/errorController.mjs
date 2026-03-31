const httpErrorMessages = new Map([
    [400, "Bad Request"],
    [401, "Unauthorized"],
    [403, "Forbidden"],
    [404, "Not Found"],
    [409, "Conflict"],
    [422, "Unprocessable Entity"],
    [500, "Internal Server Error"]
]);


/**
 * Retourne une erreur 404 au client, avec un message défini par l'application si besoin.
 *
 * @param {*} err L'objet d'erreur ou prendre le message, s'il y a lieu.
 * @param {*} req La requête pour laquelle il y a eu une erreur 404.
 * @param {*} res La réponse à retourner au client.
 * @param {*} next Le prochain middleware à appeler, si l'erreur n'est pas
 * une erreur 404.
 */
export const get404 = (err, req, res, next) => {
    if (err.statusCode === 404) {
        res.status(404).json({
            error: "Not Found",
            message: err.message ?? `Route non trouvée`,
            status: 404,
            path: req.path,
            timestamp: new Date().toISOString()
        });
    }
    else {
        next(err);
    }
}


/**
 * Gère la gestion de toutes les autres erreurs que l'erreur 404.
 *
 * @param {*} err L'objet d'erreur.
 * @param {*} req La requête pour laquelle il y a eu une erreur.
 * @param {*} res La réponse à retourner au client.
 * @param {*} next Le prochain middleware à appeler, en cas d'erreur.
 */
export const getErrors = (err, req, res, next) => {
    if (err.kind === "ObjectId" && err.name === "CastError") {
        err.statusCode = 400;
        err.message = "L'id n'a pas un format valide.";
    }

    if (err.name === "ValidationError") {
        err.message = `Erreur de validation: ${err.message}`;
        err.statusCode = 400;
    }

    if (err.code === 11000) {
        err.statusCode = 400;
        const field = Object.keys(err.keyPattern)[0];
        err.message = `${field} déjà existant`;
    }

    if (!err.statusCode) {
        err.statusCode = 500;
    }

    res.status(err.statusCode).json({
        error: httpErrorMessages[err.statusCode] ?? "error",
        message: err.message,
        status: err.statusCode,
        path: req.path,
        timestamp: new Date().toISOString()
    })
}