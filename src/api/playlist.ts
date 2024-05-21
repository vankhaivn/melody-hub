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
        const response = await axios.post(
            url,
            {
                playlist_name: playlist_name,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
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

export const delete_playlist = async (playlist_id: string) => {
    const token = Cookies.get("token")
    if (!token) {
        console.log("Token is not found")
        return false
    }
    try {
        const url = `${baseUrl}/playlist/remove-my-playlist`
        const response = await axios.post(
            url,
            {
                playlist_id: playlist_id,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
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
    const token = Cookies.get("token")
    if (!token) {
        console.log("Token is not found")
        return []
    }
    try {
        const url = `${baseUrl}/playlist/get-tracks-by-playlist-id?playlist_id=${playlist_id}`
        const headers = {
            Authorization: `Bearer ${token}`,
        }
        const response = await axios.get(url, { headers: headers })

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
    const token = Cookies.get("token")
    if (!token) {
        console.log("Token is not found")
        return []
    }
    try {
        const url = `${baseUrl}/playlist/get-tracks-recommend-by-playlist-id?playlist_id=${playlist_id}`
        const headers = {
            Authorization: `Bearer ${token}`,
        }
        const response = await axios.get(url, { headers: headers })

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

export const add_track_to_playlist = async ({
    track_id,
    playlist_id,
}: {
    track_id: string
    playlist_id: string
}) => {
    const token = Cookies.get("token")
    if (!token) {
        console.log("Token is not found")
        return false
    }
    try {
        const url = `${baseUrl}/playlist/add-track-to-my-playlist`
        const response = await axios.post(
            url,
            {
                track_id: track_id,
                playlist_id: playlist_id,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

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

export const remove_track_from_playlist = async ({
    track_id,
    playlist_id,
}: {
    track_id: string
    playlist_id: string
}) => {
    const token = Cookies.get("token")
    if (!token) {
        console.log("Token is not found")
        return false
    }
    try {
        const url = `${baseUrl}/playlist/remove-track-from-my-playlist`
        const response = await axios.post(
            url,
            {
                track_id: track_id,
                playlist_id: playlist_id,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

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
