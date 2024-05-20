"use client"
import React, { useState } from "react"
import { Select, SelectItem, Button } from "@nextui-org/react"
import { useAddToPlaylistContext } from "@/context/AddToPlaylistContext"

const AddToPlaylist = ({ playlists }: { playlists: ISmallPlaylist[] }) => {
    const { isVisible, hideModal, trackId } = useAddToPlaylistContext()
    const [value, setValue] = useState("")

    const handleSelectionChange = (e: any) => {
        setValue(e.target.value)
    }

    if (!isVisible) return null

    return (
        <div className="flex w-full max-w-xs flex-col gap-2">
            <Select
                label="Select a playlist"
                selectedKeys={[value]}
                className="max-w-xs"
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
            <p className="text-small text-default-500">Selected: {value}</p>
            <Button onClick={hideModal}>Close</Button>
            <Button>Add</Button>
        </div>
    )
}

export default AddToPlaylist
