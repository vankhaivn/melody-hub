import Cookies from "js-cookie"
import { baseUrl } from "@/utils/request"
import axios from "axios"

export const create_playlist = async (playlist_name: string) => {
    const token = Cookies.get("token")
    if (!token) {
        console.log("Token is not found")
        return false
    }
    try {
        const url = `${baseUrl}/playlist/create-my-playlist`
        const response = await axios.post(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                playlist_name: playlist_name,
            },
        })
        if (response.data) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.error("Validate token error:", error)
        return false
    }
}

export const get_all_playlist = async () => {
    const token = Cookies.get("token")

    if (!token) {
        console.log("Token is not found")
        return []
    }
    try {
        const url = `${baseUrl}/playlist/get-my-playlist`
        const response = await axios.post(
            url,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        if (response.data) {
            const playlists: IPlaylist[] = response.data
            return playlists
        } else {
            return []
        }
    } catch (error) {
        console.error("Validate token error:", error)
        return []
    }
}

export const get_tracks_by_playlist_id = async (playlist_id: string) => {
    try {
        const url = `${baseUrl}/playlist/get-tracks-by-playlist-id?playlist_id=${playlist_id}`
        const response = await axios.get(url)

        if (response.data) {
            const tracks: ITrack[] = response.data
            return tracks
        } else {
            return []
        }
    } catch (error) {
        console.error("Validate token error:", error)
        return []
    }
}

export const get_recommend_tracks_by_playlist_id = async (
    playlist_id: string
) => {
    try {
        const url = `${baseUrl}/playlist/get-tracks-recommend-by-playlist-id?playlist_id=${playlist_id}`
        const response = await axios.get(url)

        if (response.data) {
            const tracks: ITrack[] = response.data
            return tracks
        } else {
            return []
        }
    } catch (error) {
        console.error("Validate token error:", error)
        return []
    }
}
