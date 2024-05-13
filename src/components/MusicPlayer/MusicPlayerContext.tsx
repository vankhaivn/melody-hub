import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode,
} from "react"
import MusicPlayer from "./MusicPlayer"

interface MusicPlayerContextType {
    showPlayer: (url: string) => void
    hidePlayer: () => void
    trackUrl: string
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

    const showPlayer = useCallback((url: string) => {
        setTrackUrl(url)
        setIsVisible(true)
    }, [])

    const hidePlayer = useCallback(() => {
        setIsVisible(false)
        setTrackUrl("")
    }, [])

    const value = {
        showPlayer,
        hidePlayer,
        trackUrl,
        isVisible,
    }

    return (
        <MusicPlayerContext.Provider value={value}>
            {children}
            {<MusicPlayer audioUrl={trackUrl} />}
        </MusicPlayerContext.Provider>
    )
}
