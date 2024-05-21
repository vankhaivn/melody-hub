import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode,
} from "react"
import MusicPlayer from "@/components/MusicPlayer"

interface MusicPlayerContextType {
    showPlayer: (tracks: ITrack[]) => void
    hidePlayer: () => void
    currentTrack: ITrack
    isVisible: boolean
    nextTrack: () => void
    prevTrack: () => void
    setCurrentTrackById: (id: string) => void
}

const MusicPlayerContext = createContext<MusicPlayerContextType | null>(null)

export const useMusicPlayer = () => {
    const context = useContext(MusicPlayerContext)
    if (!context) {
        throw new Error(
            "useMusicPlayer must be used within a MusicPlayerProvider"
        )
    }
    return context
}

interface MusicPlayerProviderProps {
    children: ReactNode
}

export const MusicPlayerProvider = ({ children }: MusicPlayerProviderProps) => {
    const [isVisible, setIsVisible] = useState(false)
    const [tracks, setTracks] = useState<ITrack[]>([])
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0)

    const showPlayer = useCallback((tracks: ITrack[]) => {
        setTracks(tracks)
        setCurrentTrackIndex(0)
        setIsVisible(true)
    }, [])

    const hidePlayer = useCallback(() => {
        setIsVisible(false)
        setTracks([])
        setCurrentTrackIndex(0)
    }, [])

    const nextTrack = useCallback(() => {
        setCurrentTrackIndex((prevIndex) =>
            prevIndex < tracks.length - 1 ? prevIndex + 1 : 0
        )
    }, [tracks.length])

    const prevTrack = useCallback(() => {
        setCurrentTrackIndex((prevIndex) =>
            prevIndex > 0 ? prevIndex - 1 : tracks.length - 1
        )
    }, [tracks.length])

    const setCurrentTrackById = useCallback(
        (id: string) => {
            const index = tracks.findIndex((track) => track.track_id === id)
            if (index !== -1) {
                setCurrentTrackIndex(index)
            }
        },
        [tracks]
    )

    const value = {
        showPlayer,
        hidePlayer,
        currentTrack: tracks[currentTrackIndex],
        isVisible,
        nextTrack,
        prevTrack,
        setCurrentTrackById,
    }

    return (
        <MusicPlayerContext.Provider value={value}>
            {children}
            {isVisible && <MusicPlayer tracks={tracks} />}
        </MusicPlayerContext.Provider>
    )
}
