import axios from "axios"
import { baseUrl } from "@/utils/request"

export const get_all_tracks = async () => {
    try {
        const url = `${baseUrl}/tracks/get-all-tracks`
        const response = await axios.get(url)
        const artists: IArtist[] = response.data
        return artists
    } catch (error) {
        console.error("Error fetching artists:", error)
        return []
    }
}

export const get_top_trending_tracks = async (limit: number) => {
    try {
        const url = `${baseUrl}/tracks/get-top-trending-tracks?limit=${limit}`
        const response = await axios.get(url)
        const artists: IArtist[] = response.data
        return artists
    } catch (error) {
        console.error("Error fetching artists:", error)
        return []
    }
}
