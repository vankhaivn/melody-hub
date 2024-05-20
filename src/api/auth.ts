import axios from "axios"
import { baseUrl } from "@/utils/request"
import Cookies from "js-cookie"

export const register = async (
    email: string,
    username: string,
    password: string
) => {
    try {
        const url = `${baseUrl}/account/signup`
        const response = await axios.post(url, {
            email,
            username,
            password,
        })
        return response.data
    } catch (error) {
        console.error("Register error:", error)
        return null
    }
}

export const login = async (email: string, password: string) => {
    try {
        const url = `${baseUrl}/account/login`
        const response = await axios.post(url, {
            email,
            password,
        })
        if (response.data.token) {
            Cookies.set("token", response.data.token, { expires: 7 })
        }
        return response.data
    } catch (error) {
        console.error("Login error:", error)
        return null
    }
}

export const validateToken = async () => {
    const token = Cookies.get("token")
    if (!token) {
        console.log("Token is not found")
        return false
    }
    try {
        const url = `${baseUrl}/account/validate-token`
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`,
            },
        })
        if (response.data) {
            console.log("Token is valid")
            return true
        } else {
            console.log("Token is invalid")
            return false
        }
        return response.data
    } catch (error) {
        console.error("Validate token error:", error)
        return false
    }
}
