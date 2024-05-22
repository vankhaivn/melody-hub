"use client"
import { get_all_artists, get_all_artist_country } from "@/api/artists"
import { get_tracks_by_artist_id } from "@/api/tracks"
import { Divider, Avatar, Skeleton, Tabs, Tab, Image } from "@nextui-org/react"
import {
    Modal,
    ModalContent,
    ModalBody,
    useDisclosure,
} from "@nextui-org/react"
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Pagination,
    Spinner,
} from "@nextui-org/react"
import { PlayIcon } from "@/components/icons"
import { useMusicPlayer } from "@/context/MusicPlayerContext"
import useSWR from "swr"
import { useState, useMemo } from "react"
import { formatView, formatDuration } from "@/utils/format"
import Link from "next/link"

export default function ArtistPage() {
    const artistFetcher = () => get_all_artists()
    const countryFetcher = () => get_all_artist_country()

    const {
        data: artists,
        error: artistError,
        isValidating: artistsValidating,
    } = useSWR<IArtist[]>("all_artists", artistFetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    })

    const {
        data: countries,
        error: countryError,
        isValidating: countriesValidating,
    } = useSWR<string[]>("all_countries", countryFetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    })

    if (artistError || countryError) {
        return <div>Error loading data</div>
    }

    const [selectedArtist, setSelectedArtist] = useState<IArtist | null>(null)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const openModal = (artist: IArtist) => {
        setSelectedArtist(artist)
        onOpen()
    }

    return (
        <div className="px-4">
            <div className="mt-8">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold">Top Popular Artists</h1>
                    <p className="text-large text-default-400">
                        Listen to the popular artists from different countries.
                    </p>
                </div>
                <Divider className="my-4" />
                {artistsValidating || countriesValidating ? (
                    <LoadingSpacer />
                ) : (
                    <TabList
                        countries={countries || []}
                        artists={artists}
                        openModal={openModal}
                    />
                )}
                {selectedArtist && (
                    <RenderModal
                        isOpen={isOpen}
                        onClose={onClose}
                        artist={selectedArtist}
                    />
                )}
            </div>
        </div>
    )
}

const TabList = ({
    countries,
    artists,
    openModal,
}: {
    countries: string[]
    artists: IArtist[] | undefined
    openModal: (artist: IArtist) => void
}) => {
    const filteredArtists = (country: string): IArtist[] => {
        return artists?.filter((artist) => artist.country === country) || []
    }

    return (
        <Tabs color="success" size="lg">
            {countries.map((country) => (
                <Tab key={country} title={country}>
                    {filteredArtists(country).length > 0 ? (
                        AvatarList({
                            artists: filteredArtists(country),
                            openModal,
                        })
                    ) : (
                        <LoadingSpacer />
                    )}
                </Tab>
            ))}
        </Tabs>
    )
}

const AvatarList = ({
    artists,
    openModal,
}: {
    artists: IArtist[]
    openModal: (artist: IArtist) => void
}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 px-4">
            {artists.map((artist) => (
                <div
                    className="flex flex-col justify-center items-center p-4 cursor-pointer rounded-lg hover:bg-zinc-900 duration-500 relative group"
                    key={artist.artist_id}
                    onClick={() => openModal(artist)}
                >
                    <div className="relative">
                        <Avatar
                            isBordered
                            color="default"
                            src={artist.artist_image}
                            className="w-36 h-36 hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute bottom-0 -right-4 translate-y-8 opacity-0 group-hover:opacity-100 group-hover:translate-y-4 transition-all duration-500 ease-out">
                            <PlayIcon color="var(--primary)" size={48} />
                        </div>
                    </div>
                    <div className="w-full mt-2">
                        <p className="text-medium font-semibold">
                            {artist.artist_name}
                        </p>
                        <p className="text-default-400">{artist.country}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

const LoadingSpacer = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 px-4">
            {Array.from({ length: 6 }).map((_, index) => (
                <div
                    className="flex flex-col justify-center items-center p-4 cursor-pointer rounded-lg hover:bg-zinc-900 duration-500"
                    key={index}
                >
                    <div className="w-full">
                        <Skeleton className="rounded-full w-36 h-36"></Skeleton>
                        <Skeleton className="rounded-sm w-36 h-6 mt-2"></Skeleton>
                        <Skeleton className="rounded-sm w-28 h-6 mt-2"></Skeleton>
                    </div>
                </div>
            ))}
        </div>
    )
}

const RenderModal = ({
    isOpen,
    onClose,
    artist,
}: {
    isOpen: any
    onClose: any
    artist: IArtist
}) => {
    const tracksFetcher = () => get_tracks_by_artist_id(artist.artist_id)
    const { showPlayer } = useMusicPlayer()
    const {
        data: tracks,
        error: tracksError,
        isValidating: tracksValidating,
    } = useSWR<ITrack[]>(
        `tracks_by_artist_id_${artist.artist_id}`,
        tracksFetcher,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    )

    const [page, setPage] = useState(1)
    const rowsPerPage = 4

    const pages = tracks ? Math.ceil(tracks.length / rowsPerPage) : 0
    const loadingState =
        tracksValidating || tracks?.length === 0 ? "loading" : "idle"

    const items = useMemo(() => {
        if (tracks) {
            const start = (page - 1) * rowsPerPage
            const end = start + rowsPerPage
            return tracks.slice(start, end).map((track, index) => ({
                ...track,
                rowIndex: start + index + 1,
            }))
        }
        return []
    }, [page, tracks])

    return (
        <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} size="5xl">
            <ModalContent>
                <ModalBody className="py-8 flex flex-row">
                    <Image
                        isBlurred
                        width={240}
                        src={artist.artist_image}
                        alt="Artist Cover"
                        className="flex-1"
                    />
                    <div className="flex-1 px-2">
                        <div className="px-2">
                            <p className="text-6xl font-bold">
                                {artist.artist_name}
                            </p>
                            <p className="text-2xl font-medium">
                                {artist.country}
                            </p>
                            <p className="text-3xl font-bold text-center mb-4 text-success-400 uppercase">
                                Top Popular Tracks
                            </p>
                        </div>
                        <Table
                            aria-label="Example table with client side pagination"
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
                                <TableColumn key="duration">
                                    DURATION
                                </TableColumn>
                                <TableColumn key="year">
                                    RELEASE YEAR
                                </TableColumn>
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
                                        <TableCell className="group-hover:text-success-500 transition-colors duration-400">
                                            <Link
                                                className="flex items-center font-semibold"
                                                href={`/track/${item.track_id}`}
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
                                        <TableCell
                                            onClick={() => {
                                                showPlayer([item])
                                                onClose()
                                            }}
                                        >
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
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
