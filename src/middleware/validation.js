import {
    validateUser,
    validateUserUpdate,
    validateUserLogin,
    validateUserPassword,
    validateUserEmail,
    validateUserById,
    validateUserByUserName
} from '../utils/userValidating.js';

const validationMiddleware = (validationFunction, source = 'body') => async (req, res, next) => {
    try {
        await validationFunction(req[source]);
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const userValidation = validationMiddleware(validateUser, 'body');
export const userByIdValidation = validationMiddleware(validateUserById, 'params');
export const userByUserNameValidation = validationMiddleware(validateUserByUserName, 'params');
export const userUpdateValidation = validationMiddleware(validateUserUpdate, 'body');
export const userLoginValidation = validationMiddleware(validateUserLogin, 'body');
export const userPasswordValidation = validationMiddleware(validateUserPassword, 'body');
export const userEmailValidation = validationMiddleware(validateUserEmail, 'body');
