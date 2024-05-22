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

export const get_all_my_created_tracks = async () => {
    const token = Cookies.get("token")
    if (!token) {
        console.log("Token is not found")
        return null
    }
    try {
        const url = `${baseUrl}/creator/get-all-my-created-tracks`
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        if (response.data) {
            const tracks: ITrack[] = response.data
            return tracks
        } else {
            return null
        }
    } catch (error) {
        console.error("Error:", error)
        return null
    }
}

export const remove_my_created_track = async (track_id: string) => {
    const token = Cookies.get("token")
    if (!token) {
        console.log("Token is not found")
        return null
    }
    try {
        const url = `${baseUrl}/creator/remove-my-track`
        const response = await axios.post(
            url,
            { track_id },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

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

export const is_created_track_by_me = async (track_id: string) => {
    const token = Cookies.get("token")
    if (!token) {
        console.log("Token is not found")
        return false
    }
    try {
        const url = `${baseUrl}/creator/is-created-by`
        const response = await axios.post(
            url,
            { track_id },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        if (response.status === 200) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.error("Error:", error)
        return false
    }
}
