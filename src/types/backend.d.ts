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
    artist_id: string
    genres_name: string
    genres_id: string
}

interface ITrackBasicInfo {
    track_id: string
    track_name: string
    artist_name: string
    artist_id: string
    image_url: string
    duration: number
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

interface IAccount {
    user_id: string
    email: string
    role: string
    fullname: string
    avatar_image: string
}

interface ICreateTrackParams {
    track_name: string
    artist_id: string
    genres_id: string
    release_year: number
    duration: number
    track_file: File
    track_image: File
}

interface IGenres {
    genre_id: string
    genre_name: string
}
