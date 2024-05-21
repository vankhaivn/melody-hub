import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useCallback,
    useEffect,
} from "react"
import AddToPlaylist from "@/components/AddToPlaylist"
import useSWR from "swr"
import { get_all_playlist } from "@/api/playlist"

interface AddToPlaylistContextType {
    isVisible: boolean
    showModal: (trackId: string, position: { x: number; y: number }) => void
    hideModal: () => void
    trackId: string | null
    position: { x: number; y: number } | null
    playlists: IPlaylist[]
    fetchPlaylists: () => Promise<void>
}

const AddToPlaylistContext = createContext<
    AddToPlaylistContextType | undefined
>(undefined)

export const AddToPlaylistProvider = ({
    children,
}: {
    children: ReactNode
}) => {
    const [isVisible, setIsVisible] = useState(false)
    const [trackId, setTrackId] = useState<string | null>(null)
    const [position, setPosition] = useState<{ x: number; y: number } | null>(
        null
    )
    const {
        data: playlists,
        error,
        mutate: mutatePlaylists,
    } = useSWR("all_playlists", get_all_playlist)

    const showModal = useCallback(
        (trackId: string, position: { x: number; y: number }) => {
            setTrackId(trackId)
            setPosition(position)
            setIsVisible(true)
        },
        []
    )

    const hideModal = useCallback(() => {
        setTrackId(null)
        setPosition(null)
        setIsVisible(false)
    }, [])

    const fetchPlaylists = useCallback(async () => {
        await mutatePlaylists()
    }, [mutatePlaylists])

    useEffect(() => {
        fetchPlaylists()
    }, [fetchPlaylists])

    return (
        <AddToPlaylistContext.Provider
            value={{
                isVisible,
                showModal,
                hideModal,
                trackId,
                position,
                playlists: playlists || [],
                fetchPlaylists,
            }}
        >
            {children}
            {isVisible && position && (
                <AddToPlaylist
                    playlists={playlists || []}
                    position={position}
                />
            )}
        </AddToPlaylistContext.Provider>
    )
}

export const useAddToPlaylistContext = () => {
    const context = useContext(AddToPlaylistContext)
    if (context === undefined) {
        throw new Error(
            "useAddToPlaylistContext must be used within a AddToPlaylistProvider"
        )
    }
    return context
}
