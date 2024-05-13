import axios from "axios"
import { baseUrl } from "@/utils/request"

export const get_all_artists = async () => {
    try {
        const url = `${baseUrl}/artist/get-all-artists`
        const response = await axios.get(url)
        const artists: IArtist[] = response.data
        return artists
    } catch (error) {
        console.error("Error fetching artists:", error)
        return []
    }
}
