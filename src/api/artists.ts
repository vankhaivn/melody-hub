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

export const get_artists_by_country = async (country: string) => {
    try {
        const url = `${baseUrl}/artist/get-artists-by-country?country=${country}`
        const response = await axios.get(url)
        const artists: IArtist[] = response.data
        return artists
    } catch (error) {
        console.error("Error fetching artists:", error)
        return []
    }
}

export const get_all_artist_country = async () => {
    try {
        const url = `${baseUrl}/artist/get-all-artist-country`
        const response = await axios.get(url)
        const countries: string[] = response.data
        return countries
    } catch (error) {
        console.error("Error fetching countries:", error)
        return []
    }
}
