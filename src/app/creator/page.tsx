"use client"
import { useState, useMemo } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Pagination,
    Spinner,
    Avatar,
    Button,
    Select,
    SelectItem,
    Input,
} from "@nextui-org/react"
import useSWR, { mutate } from "swr"
import { get_all_artists } from "@/api/artists"
import { get_all_genres } from "@/api/genres"
import { useAuth } from "@/context/AuthContext"
import { create_track, get_all_my_created_tracks } from "@/api/creator"
import { toast } from "react-toastify"
import { formatDuration, formatView } from "@/utils/format"
import { PlayIcon } from "@/components/icons"
import { useMusicPlayer } from "@/context/MusicPlayerContext"
import Link from "next/link"

export default function CreatorPage() {
    const { isCreator } = useAuth()

    // All hooks should be defined at the top level of the component
    const allArtistFetcher = () => get_all_artists()
    const allGenresFetcher = () => get_all_genres()

    const {
        data: allArtists,
        error: allArtistError,
        isValidating: isAllArtistValidating,
    } = useSWR("allArtist", allArtistFetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    })

    const {
        data: allGenres,
        error: allGenresError,
        isValidating: isAllGenresValidating,
    } = useSWR("allGenres", allGenresFetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    })

    const [trackName, setTrackName] = useState("")
    const [selectedArtist, setSelectedArtist] = useState("")
    const [selectedGenre, setSelectedGenre] = useState("")
    const [releaseYear, setReleaseYear] = useState(2020)
    const [duration, setDuration] = useState(0)
    const [trackFile, setTrackFile] = useState<File | null>(null)
    const [trackImage, setTrackImage] = useState<File | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (!isCreator) {
        return (
            <div className="py-6 px-48">
                <h1 className="text-danger-500 text-4xl font-bold">
                    Access Denied
                </h1>
                <h1 className="text-danger-500 text-2xl font-semibold">
                    You need to be a creator to view this page.
                </h1>
            </div>
        )
    }

    const handleArtistSelectionChange = (e: any) => {
        setSelectedArtist(e.target.value)
    }

    const handleGenreSelectionChange = (e: any) => {
        setSelectedGenre(e.target.value)
    }

    const handleTrackFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0]
            setTrackFile(file)
            const audio = new Audio(URL.createObjectURL(file))
            audio.onloadedmetadata = () => {
                setDuration(Math.floor(audio.duration))
            }
        }
    }

    const handleTrackImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setTrackImage(e.target.files[0])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (trackName.length < 3) {
            toast.error("Track name must be at least 3 characters long")
            return
        }

        if (!selectedArtist || !selectedGenre) {
            toast.error("Artist and Genre are required")
            return
        }

        if (!trackFile || !trackImage) {
            toast.error("Track file and image are required")
            return
        }

        if (duration < 5) {
            toast.error("Duration (s) must be greater than 10")
            return
        }
        setIsSubmitting(true)
        const trackData: ICreateTrackParams = {
            track_name: trackName,
            artist_id: selectedArtist,
            genres_id: selectedGenre,
            release_year: releaseYear,
            duration: duration,
            track_file: trackFile,
            track_image: trackImage,
        }

        const response = await create_track(trackData)
        if (response) {
            toast.success("Track created successfully", response)
            mutate("tracksBasicInfo")
            mutate("allOwnerTracks")
        } else {
            toast.error("Failed to create track")
        }
        setIsSubmitting(false)
    }

    if (isAllArtistValidating || isAllGenresValidating) {
        return (
            <div className="py-8 px-16">
                <Spinner />
            </div>
        )
    }

    if (allArtistError || allGenresError) {
        return (
            <div className="py-8 px-16">
                <p className="text-danger-500">Failed to load data</p>
            </div>
        )
    }

    return (
        <div className="py-8 px-16">
            <div className="bg-content1 p-6 rounded-xl">
                <h1 className="mb-8 font-bold text-3xl">Create a new track</h1>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-y-4 pb-2"
                >
                    <div className="flex gap-x-4">
                        <label className="bg-content2 rounded-xl p-4">
                            <div className="font-semibold text-medium">
                                Choose your audio file (mp3){" "}
                            </div>
                            <input
                                type="file"
                                accept=".mp3"
                                onChange={handleTrackFileChange}
                                required
                            />
                        </label>
                        <label className="bg-content2 rounded-xl p-4">
                            <div className="font-semibold text-medium">
                                Choose your track image file (jpg){" "}
                            </div>
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                onChange={handleTrackImageChange}
                                required
                            />
                        </label>
                    </div>
                    <div className="flex gap-x-4 justify-between">
                        <Input
                            label="Track Name"
                            value={trackName}
                            onChange={(e) => setTrackName(e.target.value)}
                            required
                            className="w-[24rem]"
                            size="lg"
                        />
                        <Input
                            label="Release Year"
                            type="number"
                            value={releaseYear.toString()}
                            onChange={(e) =>
                                setReleaseYear(Number(e.target.value))
                            }
                            required
                            className="w-[24rem]"
                            size="lg"
                        />
                        <Input
                            label="Duration (seconds)"
                            type="number"
                            value={duration.toString()}
                            onChange={(e) =>
                                setDuration(Number(e.target.value))
                            }
                            required
                            readOnly
                            className="w-[24rem]"
                            size="lg"
                        />
                    </div>
                    <div className="flex gap-x-4 justify-start items-center">
                        <Select
                            label="Select Artist"
                            variant="flat"
                            placeholder="Select an artist"
                            selectedKeys={[selectedArtist]}
                            className="w-[22.4rem]"
                            onChange={handleArtistSelectionChange}
                            required
                            size="lg"
                        >
                            {(allArtists ?? []).map((artist) => (
                                <SelectItem
                                    key={artist.artist_id}
                                    value={artist.artist_id}
                                >
                                    {artist.artist_name}
                                </SelectItem>
                            ))}
                        </Select>
                        <Select
                            label="Select Genre"
                            variant="flat"
                            placeholder="Select a genre"
                            selectedKeys={[selectedGenre]}
                            className="w-[22.4rem]"
                            onChange={handleGenreSelectionChange}
                            required
                            size="lg"
                        >
                            {(allGenres ?? []).map((genre) => (
                                <SelectItem
                                    key={genre.genre_id}
                                    value={genre.genre_id}
                                >
                                    {genre.genre_name}
                                </SelectItem>
                            ))}
                        </Select>
                        <Button
                            type="submit"
                            isLoading={isSubmitting}
                            color="success"
                            variant="shadow"
                            size="lg"
                            className="font-bold"
                        >
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
            <div className="bg-content1 p-6 rounded-xl mt-4">
                <OwnerTrack />
            </div>
        </div>
    )
}

const OwnerTrack = () => {
    const allOwnerTracksFetcher = () => get_all_my_created_tracks()
    const {
        data: allOwnerTracks,
        error: allOwnerTracksError,
        isValidating: isAllOwnerTracksValidating,
    } = useSWR("allOwnerTracks", allOwnerTracksFetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    })

    const { showPlayer } = useMusicPlayer()
    const [page, setPage] = useState(1)
    const rowsPerPage = 4

    const pages = Array.isArray(allOwnerTracks)
        ? Math.ceil(allOwnerTracks.length / rowsPerPage)
        : 0
    const loadingState =
        isAllOwnerTracksValidating || !Array.isArray(allOwnerTracks)
            ? "loading"
            : "idle"

    const items = useMemo(() => {
        if (Array.isArray(allOwnerTracks)) {
            const start = (page - 1) * rowsPerPage
            const end = start + rowsPerPage
            return allOwnerTracks.slice(start, end).map((track, index) => ({
                ...track,
                rowIndex: start + index + 1,
            }))
        }
        return []
    }, [page, allOwnerTracks])

    if (isAllOwnerTracksValidating) {
        return <Spinner />
    }
    if (allOwnerTracks?.length === 0) {
        return (
            <h1 className="mb-8 font-bold text-3xl">
                You have never uploaded any tracks
            </h1>
        )
    }

    return (
        <div>
            <h1 className="mb-8 font-bold text-3xl">Tracks uploaded by you</h1>
            <Table
                aria-label="Tracks uploaded by the user"
                bottomContent={
                    <div className="flex w-full justify-center">
                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            color="secondary"
                            page={page}
                            total={pages}
                            onChange={(page) => setPage(page)}
                        />
                    </div>
                }
                classNames={{
                    wrapper: "min-h-[222px]",
                }}
            >
                <TableHeader>
                    <TableColumn key="order">#</TableColumn>
                    <TableColumn key="name">NAME</TableColumn>
                    <TableColumn key="view">VIEW</TableColumn>
                    <TableColumn key="duration">DURATION</TableColumn>
                    <TableColumn key="year">RELEASE YEAR</TableColumn>
                    <TableColumn key="action"> </TableColumn>
                </TableHeader>

                <TableBody
                    items={items}
                    loadingContent={<Spinner />}
                    loadingState={loadingState}
                >
                    {(item) => (
                        <TableRow
                            key={item.track_name}
                            className="cursor-pointer"
                        >
                            <TableCell className="font-semibold group-hover:text-success-500 transition-colors duration-400">
                                {item.rowIndex}
                            </TableCell>
                            <TableCell className="font-semibold group-hover:text-success-500 transition-colors duration-400">
                                <Link
                                    href={`/track/${item.track_id}`}
                                    className="flex items-center"
                                >
                                    <Avatar
                                        isBordered
                                        radius="md"
                                        src={item.image_url}
                                        className="mr-4"
                                    />
                                    {item.track_name}
                                </Link>
                            </TableCell>
                            <TableCell className="font-semibold group-hover:text-success-500 transition-colors duration-400">
                                {formatView(item.view)}
                            </TableCell>
                            <TableCell className="font-semibold group-hover:text-success-500 transition-colors duration-400">
                                {formatDuration(item.duration)}
                            </TableCell>
                            <TableCell className="font-semibold group-hover:text-success-500 transition-colors duration-400">
                                {item.release_year}
                            </TableCell>
                            <TableCell onClick={() => showPlayer([item])}>
                                <PlayIcon
                                    color="var(--primary)"
                                    size={32}
                                    className="mb-1 group-hover:scale-125 transition-transform duration-400 cursor-pointer"
                                />
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
