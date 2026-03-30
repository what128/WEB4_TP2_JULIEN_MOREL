
/**
 * Valide qu'un champ n'est pas null
 *
 * @param {*} field Le champ en question
 * @returns {boolean} Vrai si le champ n'est pas null, faux autrement.
 */
export const validateFieldNotEmpty = (field) => {
    return field != null;
}

/**
 * Valide qu'aucun élément dans une liste de champs est null.
 * @param {*} fields La liste de champs à valider.
 * @returns Vrai si tous les éléments de la liste ont une valeur, faux autrement.
 */
export const validateFieldsNotEmpty = (fields) => {
    let i = 0;
    let valid = true;
    while (valid && i < fields.length){
        valid = validateFieldNotEmpty(fields[i]);
        i++;
    }
    return valid;
}


/**
 * Valide qu'au moins un champ dans la liste a une valeur non-null.
 *
 * @param {*} fields La liste ce champs à valider.
 * @returns {boolean} 
 */
export const validateAtLeastOneFieldExists = (fields) => {
    let i = 0;
    let atLeastOneElementValid = false;
    while (!atLeastOneElementValid && i < fields.length){
        if (validateFieldNotEmpty(fields[i])) {
            atLeastOneElementValid = true;
        }
        i++;
    }
    return atLeastOneElementValid;
}

/**
 * Valide que le format d'un courriel est valide.
 * @param {*} email Le courriel à valider.
 * @returns Vrai si la chaîne de caractères correspond à un courriel, faux autrement.
 */
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)){
        return false;
    }
    return true;
}


/**
 * Valide qu'un mot de passe respecte les exigences de sécurité.
 *
 * @param {*} password Le mot de passe à valider.
 * @returns {boolean} Vrai si le mot de passe est considéré comme sécuritaire, faux autrement.
 */
export const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(password)){
        return false;
    }
    return true;
}


/**
 * Valide que la format d'un numéro de téléphone est valide (10 chiffres)
 *
 * @param {*} phone Le numéro de téléphone à valider.
 * @returns {boolean} Vrai si le numéro de téléphone est valide, faux autrement.
 */
export const validatePhone = (phone) => {
    const phoneRegex = /^[\d]{10}$/;
    if (phone != null && !phoneRegex.test(phone)){
       return false;
    }
    return true;
}

/**
 * Valide si le rôle utilisateur correspond à un rôle valide.
 *
 * @param {*} role Le rôle à valider.
 * @returns {boolean} Vrai si le rôle est un rôle valide, faux autrement.
 */
export const validateRole = (role) => {
const allowedRoles = ["user", "admin"];

    if (!allowedRoles.includes(role.toLowerCase())){
        return false;
    }
    return true;
}

/**
 * Valide si le rôle d'un utilisateur correspond à celui d'un administrateur.
 * @param {*} role Le rôle à valider.
 * @returns Vrai si le rôle correspond à un administrateur, faux autrement.
 */
export const validateRoleAdmin = (role) => {
    return validateRole(role) && role.toLowerCase() === "admin";
}

/**
 * Vérifie si une chaîne de caractères est vide.
 * @param {*} str Le chaîne de caractères à valider.
 * @returns Vrai si la chaîne est vide, faux autrement.
 */
export const stringVide = (str) => {
    return (!str || str.trim() === "");
}

/**
 * Valide si le statut d'une réservation correspond à un statut valide.
 *
 * @param {*} status Le statut d'une réservation à valider.
 * @returns {*} Vrai si le statut est valide, faux autrement.
 */
export const validateReservationsStatus = (status) => {
    const possibleStatusValues = ["pending", "confirmed", "cancelled"];

    return (status != null && possibleStatusValues.includes(status.toLowerCase()));
}

/**
 * Valide si le type de site de campement correspond à un type valide.
 * @param {*} type Le type de site de campement à valider.
 * @returns Vrai si le type de site de campement est valide, faux autrement.
 */
export const validateCampsiteType = (type) => {
    const typesDeSites = ["tente", "rv", "chalet", "glamping", "arrière-pays", "autre"];
    if (!typesDeSites.includes(type.toLowerCase())){
        return false;
    }
    return true;
}