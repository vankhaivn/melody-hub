import axios from "axios"
import { baseUrl } from "@/utils/request"

export const get_all_genres = async () => {
    try {
        const url = `${baseUrl}/genre/get-all-genres`
        const response = await axios.get(url)
        const genres: IGenres[] = response.data
        return genres
    } catch (error) {
        console.error("Error fetching genres:", error)
        return []
    }
}
