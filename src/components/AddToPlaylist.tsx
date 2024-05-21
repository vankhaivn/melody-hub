import React, { useState } from "react"
import { Select, SelectItem, Button } from "@nextui-org/react"
import { useAddToPlaylistContext } from "@/context/AddToPlaylistContext"

const AddToPlaylist = ({
    playlists,
    position,
}: {
    playlists: ISmallPlaylist[]
    position: { x: number; y: number }
}) => {
    const { isVisible, hideModal, trackId } = useAddToPlaylistContext()
    const [value, setValue] = useState("")

    const handleSelectionChange = (e: any) => {
        setValue(e.target.value)
    }

    if (!isVisible) return null

    return (
        <div
            className="absolute z-50 bg-content1 p-4 shadow-lg rounded-2xl w-80"
            style={{ top: `${position.y}px`, left: `${position.x}px` }}
        >
            <Select
                label="Select a playlist"
                selectedKeys={[value]}
                className="w-full"
                onChange={handleSelectionChange}
            >
                {playlists.map((playlist) => (
                    <SelectItem
                        key={playlist.playlist_id}
                        value={playlist.playlist_id}
                    >
                        {playlist.playlist_name}
                    </SelectItem>
                ))}
            </Select>
            <div className="flex items-center justify-between mt-4">
                <Button onClick={hideModal}>Close</Button>
                <Button>Add</Button>
            </div>
        </div>
    )
}

export default AddToPlaylist
