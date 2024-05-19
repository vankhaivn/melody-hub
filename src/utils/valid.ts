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
