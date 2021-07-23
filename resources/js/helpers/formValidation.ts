export const emailRules = {
    required: "Email is required",
    pattern: {
        value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: "Email is invalid",
    },
}

export const nameRules = {
    required: "Name is required",
}

export const passwordRules = {
    required: "Password is required",
    minLength: {
        value: 8,
        message:
            "password must be atleast 8 characters",
    },
}

export const confirmPasswordRules = {
    required: "Confirm password is required",
    minLength: {
        value: 8,
        message:
            "Confirm password must be atleast 8 characters",
    },
}
