import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode,
} from "react"
import MusicPlayer from "@/components/MusicPlayer"

interface MusicPlayerContextType {
    showPlayer: ({
        trackUrl,
        trackName,
        imageUrl,
        artistName,
    }: {
        trackUrl: string
        trackName: string
        imageUrl: string
        artistName: string
    }) => void
    hidePlayer: () => void
    trackUrl: string
    trackName: string
    imageUrl: string
    artistName: string
    isVisible: boolean
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
    const [trackUrl, setTrackUrl] = useState("")
    const [trackName, setTrackName] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const [artistName, setArtistName] = useState("")

    const showPlayer = useCallback(
        ({
            trackUrl,
            trackName,
            imageUrl,
            artistName,
        }: {
            trackUrl: string
            trackName: string
            imageUrl: string
            artistName: string
        }) => {
            setTrackUrl(trackUrl)
            setTrackName(trackName)
            setImageUrl(imageUrl)
            setArtistName(artistName)
            setIsVisible(true)
        },
        []
    )

    const hidePlayer = useCallback(() => {
        setIsVisible(false)
        setTrackUrl("")
        setTrackName("")
        setImageUrl("")
        setArtistName("")
    }, [])

    const value = {
        showPlayer,
        hidePlayer,
        trackUrl,
        trackName,
        imageUrl,
        artistName,
        isVisible,
    }

    return (
        <MusicPlayerContext.Provider value={value}>
            {children}
            {
                <MusicPlayer
                    trackUrl={trackUrl}
                    artistName={artistName}
                    imageUrl={imageUrl}
                    trackName={trackName}
                />
            }
        </MusicPlayerContext.Provider>
    )
}
