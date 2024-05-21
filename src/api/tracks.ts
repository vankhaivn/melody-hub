import axios from "axios"
import { baseUrl } from "@/utils/request"

export const get_track_by_id = async (track_id: string) => {
    try {
        const url = `${baseUrl}/track/get-track-by-id?track_id=${track_id}`
        const response = await axios.get(url)
        const track: ITrack = response.data
        return track
    } catch (error) {
        console.error("Error fetching tracks:", error)
        return null
    }
}

export const get_all_tracks = async () => {
    try {
        const url = `${baseUrl}/track/get-all-tracks`
        const response = await axios.get(url)
        const tracks: ITrack[] = response.data
        return tracks.slice(0, 12)
    } catch (error) {
        console.error("Error fetching tracks:", error)
        return []
    }
}

export const get_top_trending_tracks = async (limit: number) => {
    try {
        const url = `${baseUrl}/track/get-top-trending-tracks?limit=${limit}`
        const response = await axios.get(url)
        const tracks: ITrack[] = response.data
        return tracks
    } catch (error) {
        console.error("Error fetching tracks:", error)
        return []
    }
}

export const get_tracks_by_artist_id = async (artistId: string) => {
    try {
        const url = `${baseUrl}/track/get-tracks-by-artist-id?artist_id=${artistId}`
        const response = await axios.get(url)
        const tracks: ITrack[] = response.data
        return tracks
    } catch (error) {
        console.error("Error fetching artists:", error)
        return []
    }
}

export const get_shuffle_tracks = async (limit: number) => {
    try {
        const url = `${baseUrl}/track/get-shuffled-tracks?limit=${limit}`
        const response = await axios.get(url)
        const tracks: ITrack[] = response.data
        return tracks
    } catch (error) {
        console.error("Error fetching tracks:", error)
        return []
    }
}

export const get_rcm_tracks = async (track_id: string) => {
    try {
        const url = `${baseUrl}/track/get-recommended-tracks?track_id=${track_id}`
        const response = await axios.get(url)
        const tracks: ITrack[] = response.data
        return tracks
    } catch (error) {
        console.error("Error fetching tracks:", error)
        return []
    }
}
