import axios from "axios"
import { baseUrl } from "@/utils/request"
import Cookies from "js-cookie"

export const create_track = async ({
    track_name,
    artist_id,
    genres_id,
    release_year,
    duration,
    track_file,
    track_image,
}: ICreateTrackParams): Promise<any> => {
    const token = Cookies.get("token")
    if (!token) {
        console.log("Token is not found")
        return null
    }

    try {
        const url = `${baseUrl}/creator/create-my-track`
        const formData = new FormData()

        formData.append("track_file", track_file)
        formData.append("track_image", track_image)
        formData.append("track_name", track_name)
        formData.append("artist_id", artist_id)
        formData.append("genres_id", genres_id)
        formData.append("release_year", release_year.toString())
        formData.append("duration", duration.toString())

        const response = await axios.post(url, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        })

        if (response.data) {
            return response.data
        } else {
            return null
        }
    } catch (error) {
        console.error("Error:", error)
        return null
    }
}
