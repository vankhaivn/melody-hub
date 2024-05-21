import axios from "axios"
import Cookies from "js-cookie"
import { baseUrl } from "@/utils/request"

export const get_user_information = async () => {
    const token = Cookies.get("token")

    if (!token) {
        console.log("Token is not found")
        return null
    }
    try {
        const url = `${baseUrl}/account/get-account-information`
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        if (response.data) {
            const account: IAccount = response.data
            return account
        } else {
            return null
        }
    } catch (error) {
        console.error("Error:", error)
        return null
    }
}
