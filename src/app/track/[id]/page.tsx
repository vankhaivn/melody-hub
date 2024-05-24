"use client"
import { get_rcm_tracks, get_track_by_id } from "@/api/tracks"
import { formatDuration } from "@/utils/format"
import {
    Spinner,
    Image,
    Popover,
    PopoverTrigger,
    PopoverContent,
    Button,
    Select,
    SelectItem,
    Tooltip,
    Table,
    TableHeader,
    TableBody,
    TableCell,
    TableRow,
    TableColumn,
    Avatar,
} from "@nextui-org/react"
import { PlayIcon } from "@/components/icons"
import useSWR, { mutate } from "swr"
import { useEffect, useState } from "react"
import { useMusicPlayer } from "@/context/MusicPlayerContext"
import { add_track_to_playlist, get_all_playlist } from "@/api/playlist"
import { toast } from "react-toastify"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { is_created_track_by_me, remove_my_created_track } from "@/api/creator"

export default function DetailTrackPage({
    params,
}: {
    params: { id: string }
}) {
    const { isLoggedIn } = useAuth()
    const router = useRouter()
    const { showPlayer } = useMusicPlayer()
    const trackFetcher = () => get_track_by_id(params.id)
    const {
        data: track,
        error: trackError,
        isValidating: isTrackValidating,
    } = useSWR<ITrack | null>(`track_${params.id}`, trackFetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    })

    const [isCreatedTrack, setIsCreatedTrack] = useState(false)
    const [isRemovingTrack, setIsRemovingTrack] = useState(false)

    useEffect(() => {
        const isCreatedTrackByMe = async () => {
            const response = await is_created_track_by_me(params.id)
            if (response) {
                setIsCreatedTrack(true)
            }
        }
        isCreatedTrackByMe()
    }, [])

    if (trackError) {
        return <div>Track not found!</div>
    }

    if (isTrackValidating) {
        return (
            <div className="p-4">
                <Spinner />
            </div>
        )
    }

    const handlePlay = (track: ITrack) => {
        const trackData = { ...track }
        showPlayer([trackData])
    }

    const handleRemoveTrack = async () => {
        if (!window.confirm("Are you sure to remove this track?")) {
            return null
        }
        try {
            setIsRemovingTrack(true)
            const response = await remove_my_created_track(params.id)
            if (response) {
                setIsCreatedTrack(false)
                toast.success("Track removed successfully!")
                mutate(`track_${params.id}`)
                router.push("/creator")
            } else {
                toast.error("Failed to remove track!")
            }
        } catch (error) {
            console.error(error)
            toast.error("Failed to remove track!")
        } finally {
            setIsRemovingTrack(false)
        }
    }

    return (
        <div className="py-8 px-16">
            <div className="flex gap-x-6 bg-content1 p-6 rounded-t-xl">
                <Image
                    src={track?.image_url}
                    isBlurred
                    isZoomed
                    className="w-48 h-48 cursor-pointer"
                    loading="eager"
                />
                <div className="flex flex-col justify-between">
                    <p className="text-xl font-semibold text-success-500">
                        Track -{" "}
                        <span className="font-bold text-medium">
                            {track?.genres_name}
                        </span>
                    </p>
                    <h1 className="text-7xl font-bold">{track?.track_name}</h1>
                    <div className="text-xl font-semibold flex gap-x-2">
                        <div>By</div>
                        <Tooltip
                            content="Click to go to this artist page"
                            size="lg"
                            color="success"
                            className="font-bold"
                        >
                            <Link
                                className="text-success-500 font-bold cursor-pointer"
                                href={`/artist/${track?.artist_id}`}
                            >
                                {track?.artist_name}
                            </Link>
                        </Tooltip>
                        <div>- {track?.release_year} -</div>
                        <div>{formatDuration(track?.duration || 0)}</div>
                    </div>
                </div>
            </div>
            <div
                className="mt-0 flex gap-x-6 p-4 rounded-b-xl items-center relative"
                style={{
                    backgroundColor: "var(--gray-1)",
                }}
            >
                <div onClick={() => track && handlePlay(track)}>
                    <PlayIcon
                        size={80}
                        color="var(--primary)"
                        className="hover:scale-110 transition-transform duration-300 cursor-pointer"
                    />
                </div>

                <div>
                    <Popover placement="right-end" showArrow={true} size="lg">
                        <PopoverTrigger>
                            {isLoggedIn ? (
                                <Button
                                    variant="flat"
                                    size="lg"
                                    color="primary"
                                    className="font-bold text-lg"
                                >
                                    Add to your playlist
                                </Button>
                            ) : (
                                <Tooltip
                                    content="You need to login!"
                                    size="lg"
                                    color="danger"
                                >
                                    <Button
                                        variant="flat"
                                        size="lg"
                                        color="primary"
                                        className="font-bold text-lg"
                                    >
                                        Add to your playlist
                                    </Button>
                                </Tooltip>
                            )}
                        </PopoverTrigger>
                        <AddTrackToPlaylist trackId={params.id} />
                    </Popover>
                    {isCreatedTrack && (
                        <Tooltip
                            content="Others and you will not see this track!"
                            size="lg"
                            color="danger"
                        >
                            <Button
                                color="danger"
                                variant="flat"
                                className="absolute right-8 font-bold text-large"
                                size="lg"
                                isLoading={isRemovingTrack}
                                onClick={handleRemoveTrack}
                            >
                                Remove
                            </Button>
                        </Tooltip>
                    )}
                </div>
            </div>
            <div className="mt-4">
                <RecommendTrack trackId={params.id} handlePlay={handlePlay} />
            </div>
        </div>
    )
}

const AddTrackToPlaylist = ({ trackId }: { trackId: string }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [value, setValue] = useState("")

    const playlistsFetcher = () => get_all_playlist()
    const {
        data: playlists,
        error: playlistsError,
        isValidating: playlistsValidating,
    } = useSWR<IPlaylist[]>("all_playlists", playlistsFetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    })
    if (playlistsValidating) {
        return (
            <PopoverContent className="p-4">
                <Spinner />
            </PopoverContent>
        )
    }

    if (playlistsError || !playlists) {
        return <PopoverContent>Failed to fetch playlists!</PopoverContent>
    }

    const handleSelectionChange = (e: any) => {
        setValue(e.target.value)
    }

    const handleAddTrack = async (playlist_id: string) => {
        if (value.length == 0 || !trackId) {
            return null
        }

        try {
            setIsLoading(true)
            const response = await add_track_to_playlist({
                playlist_id: playlist_id,
                track_id: trackId,
            })
            if (response) {
                toast.success("Track added to playlist successfully!")
                mutate("all_playlists")
            } else {
                toast.error("Track already exists in playlist!")
            }
        } catch (error) {
            toast.error("Failed to add track to playlist")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <PopoverContent className="py-6 px-6 flex flex-row w-80 gap-x-2">
            <Select
                label="Select a playlist"
                selectedKeys={[value]}
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
            <Button
                color="success"
                variant="ghost"
                onClick={() => handleAddTrack(value)}
                isLoading={isLoading}
            >
                Add
            </Button>
        </PopoverContent>
    )
}

const RecommendTrack = ({
    trackId,
    handlePlay,
}: {
    trackId: string
    handlePlay: (track: ITrack) => void
}) => {
    const router = useRouter()
    const rcmTracksFetcher = () => get_rcm_tracks(trackId)
    const {
        data: rcmTracks,
        error: rcmTracksError,
        isValidating: rcmTracksValidating,
    } = useSWR<ITrack[]>(`rcmTrack_${trackId}`, rcmTracksFetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    })

    if (rcmTracksValidating) {
        return (
            <div className="p-4">
                <Spinner />
            </div>
        )
    }

    if (rcmTracksError || !rcmTracks) {
        return <div>Failed to fetch rcmTracks!</div>
    }

    return (
        <div className="px-6 py-8 bg-content1 rounded-xl">
            <div className="mb-8">
                <h3 className="text-2xl font-extrabold">Recommended</h3>
                <p>Based on the artist, genre of this track</p>
            </div>
            <Table aria-label="Recommend">
                <TableHeader>
                    <TableColumn>NAME</TableColumn>
                    <TableColumn>ARTIST</TableColumn>
                    <TableColumn>GENRES</TableColumn>
                    <TableColumn>RELEASE YEAR</TableColumn>
                    <TableColumn>DURATION</TableColumn>
                    <TableColumn> </TableColumn>
                </TableHeader>
                <TableBody>
                    {rcmTracks.map((track) => (
                        <TableRow
                            key={track.track_id}
                            className="hover:bg-zinc-800 cursor-pointer duration-300 transition-colors"
                        >
                            <TableCell>
                                <div
                                    className="flex items-center hover:text-success-500 transition-color"
                                    onClick={() => {
                                        router.push(`/track/${track.track_id}`)
                                    }}
                                >
                                    <Avatar
                                        isBordered
                                        radius="md"
                                        src={track.image_url}
                                        className="mr-4"
                                    />
                                    {track.track_name}
                                </div>
                            </TableCell>
                            <TableCell>{track.artist_name}</TableCell>
                            <TableCell>{track.genres_name}</TableCell>
                            <TableCell>{track.release_year}</TableCell>
                            <TableCell>
                                {formatDuration(track.duration)}
                            </TableCell>
                            <TableCell>
                                <div
                                    className="hover:scale-125 duration-300 transition-transform flex items-center justify-center"
                                    onClick={() => handlePlay(track)}
                                >
                                    <PlayIcon
                                        color="var(--primary)"
                                        size={32}
                                    />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
