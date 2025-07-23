import * as yup from 'yup';



export const validateUser = (user) => {
    const userSchema = yup.object({
        userName: yup.string().required(),
        email: yup.string().email().required(),
        password: yup.string().min(6).required(),
        role: yup.string().oneOf(["admin", "user"]).default("user"),
        isVerified: yup.boolean().default(false),
        status: yup.string().oneOf(["active", "inactive"]).default("active"),
    });
    return userSchema.validate(user);
};

export const validateUserUpdate = (user) => {
    const updateSchema = yup.object({
        userName: yup.string(),
        email: yup.string().email(),
        password: yup.string().min(6),
        role: yup.string().oneOf(["admin", "user"])
    });

    return updateSchema.validate(user);
};


export  const validateUserById = (user) => {
    const userIdSchema = yup.object({
        id: yup.string().required()
    });

    return userIdSchema.validate(user);
} 

export const validateUserByUserName = (user) => {
    const userNameSchema = yup.object({
        userName: yup.string().required()
    });

    return userNameSchema.validate(user);
}
export const validateUserLogin = (user) => {
    const loginSchema = yup.object({
        email: yup.string().email().required(),
        password: yup.string().min(6).required()
    });

    return loginSchema.validate(user);
};

export const validateUserPassword = (user) => {
    const passwordSchema = yup.object({
        password: yup.string().min(6).required(),
        confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required()
    });

    return passwordSchema.validate(user);
}

export const validateUserEmail = (user) => {
    const emailSchema = yup.object({
        email: yup.string().email().required()
    });

    return emailSchema.validate(user);
};