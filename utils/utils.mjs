export const validateFieldNotEmpty = (field) => {
    return field != null;
}

export const validateFieldsNotEmpty = (fields) => {
    let i = 0;
    let valid = true;
    while (valid && i < fields.length){
        valid = validateFieldNotEmpty(fields[i]);
        i++;
    }
    return valid;
}

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)){
        return false;
    }
    return true;
}

export const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(password)){
        return false;
    }
    return true;
}

export const validatePhone = (phone) => {
    const phoneRegex = /^[\d]{10}$/;
    if (phone != null && !phoneRegex.test(phone)){
       return false;
    }
    return true;
}

export const validateRole = (role) => {
const allowedRoles = ["user", "admin"];

    if (!allowedRoles.includes(role.toLowerCase())){
        return false;
    }
    return true;
}

export const validateRoleAdmin = (role) => {
    return validateRole(role) && role.toLowerCase() === "admin";
}

export const stringVide = (str) => {
    return (!str || str.trim() === "");
}

export const validateReservationsStatus = (status) => {
    const possibleStatusValues = ["pending", "confirmed", "cancelled"];

    return (status != null && possibleStatusValues.includes(status.toLowerCase()));
}