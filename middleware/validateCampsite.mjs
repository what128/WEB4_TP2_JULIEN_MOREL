import * as utils from "../utils/utils.mjs";



export const validateCampsite = (req, res, next) => {
 const {name, location, description, type, pricePerNight, capacity, maxVehicleLength, amenities} = req.body;

 // pricepernight = null et capacity = null

if (!utils.validateFieldsNotEmpty([name, location, type]) || pricePerNight == null || capacity == null){
    const error = new Error(`Le nom, la localisation, le type, le prix par nuit et la capacité du site de campement sont requis.`);
    error.statusCode = 400;
    return next(error);
}

if (utils.stringVide(name) || utils.stringVide(location) || utils.stringVide(type)){
     const error = new Error(`Le nom, la localisation et le type du site de campement sont requis.`);
    error.statusCode = 422;
    return next(error);
}

const typesDeSites = ["tente", "rv", "chalet", "glamping", "arrière-pays", "autre"];
if (!typesDeSites.includes(type.toLowerCase())){
    const error = new Error("Le type de site de campement n'est pas parmi les valeurs autorisées.");
    error.statusCode = 422;
    return next(error);
}

if (pricePerNight <= 0){
    const error = new Error("Le prix par nuit du site de campement doit être supérieur à 0.");
    error.statusCode = 422;
    return next(error);
}

if (type.toLowerCase() === "rv" && maxVehicleLength == null){
    const error = new Error("Un site de campement de type rv doit avoir une longueur maximale de véhicule.");
    error.statusCode = 400;
    return next(error);
}

if (type.toLowerCase() === "rv" && (maxVehicleLength <= 0)){
    const error = new Error("Un site de campement de type rv doit avoir une longueur maximale de véhicule supérieure à 0.");
    error.statusCode = 422;
    return next(error);
}

if (capacity <= 0){
    const error = new Error("La capacité du site de campement doit être un nombre positif.");
    error.statusCode = 422;
    return next(error);
}

next();
}