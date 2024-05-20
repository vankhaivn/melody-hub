import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useCallback,
} from "react"

interface AddToPlaylistContextType {
    isVisible: boolean
    showModal: (trackId: string) => void
    hideModal: () => void
    trackId: string | null
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

    const showModal = useCallback((trackId: string) => {
        setTrackId(trackId)
        setIsVisible(true)
    }, [])

    const hideModal = useCallback(() => {
        setTrackId(null)
        setIsVisible(false)
    }, [])

    return (
        <AddToPlaylistContext.Provider
            value={{ isVisible, showModal, hideModal, trackId }}
        >
            {children}
        </AddToPlaylistContext.Provider>
    )
}

export const useAddToPlaylistContext = () => {
    const context = useContext(AddToPlaylistContext)
    if (context === undefined) {
        throw new Error(
            "useAddToPlaylistContext must be used within a ModalProvider"
        )
    }
    return context
}
