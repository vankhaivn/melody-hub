import { toast } from "react-toastify"

export const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
}

export const registerValidation = (
    email: string,
    fullname: string,
    password: string,
    confirmPassword: string
) => {
    if (!email || !fullname || !password || !confirmPassword) {
        toast.error("All fields are required")
        return false
    }

    if (!validateEmail(email)) {
        toast.error("Invalid email")
        return false
    }

    if (password.length < 6) {
        toast.error("Password must be at least 6 characters")
        return false
    }

    if (password !== confirmPassword) {
        toast.error("Password does not match")
        return false
    }

    return true
}

export const loginValidation = (email: string, password: string) => {
    if (!email || !password) {
        toast.error("All fields are required")
        return false
    }

    if (!validateEmail(email)) {
        toast.error("Invalid email")
        return false
    }

    if (password.length < 6) {
        toast.error("Password must be at least 6 characters")
        return false
    }

    return true
}

export const updatePasswordValidation = (
    old_password: string,
    new_password: string,
    confirm_password: string
) => {
    if (!old_password || !new_password || !confirm_password) {
        toast.error("All fields are required")
        return false
    }

    if (old_password === new_password) {
        toast.error("New password must be different from the old password")
        return false
    }

    if (
        new_password.length < 6 ||
        confirm_password.length < 6 ||
        old_password.length < 6
    ) {
        toast.error("Password must be at least 6 characters")
        return false
    }

    if (new_password !== confirm_password) {
        toast.error("Password does not match")
        return false
    }

    return true
}
