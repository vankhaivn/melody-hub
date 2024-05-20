interface IArtist {
    artist_id: string
    artist_image: string
    artist_name: string
    country: string
}

interface ITrack {
    track_id: string
    track_url: string
    track_name: string
    image_url: string
    view: number
    release_year: number
    duration: number
    artist_name: string
    genres_name: string
}

interface IPlaylist {
    playlist_id: string
    playlist_name: string
    tracks: ITrack[]
    total_duration: number
    image_url: string
}

interface ISmallPlaylist {
    playlist_id: string
    playlist_name: string
}
