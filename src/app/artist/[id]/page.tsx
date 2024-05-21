"use client"
import { get_tracks_by_artist_id } from "@/api/tracks"
import { useMusicPlayer } from "@/context/MusicPlayerContext"
import { useMemo, useState } from "react"
import useSWR from "swr"
import {
    Avatar,
    Image,
    Pagination,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@nextui-org/react"
import { get_artists_by_id } from "@/api/artists"
import { formatDuration, formatView } from "@/utils/format"
import { PlayIcon } from "@/components/icons"
import Link from "next/link"

export default function DetailArtistPage({
    params,
}: {
    params: { id: string }
}) {
    const artistFetcher = () => get_artists_by_id(params.id)
    const {
        data: artist,
        error: artistError,
        isValidating: artistValidating,
    } = useSWR<IArtist | null>(
        `artist_by_artist_id_${params.id}`,
        artistFetcher,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    )

    const tracksFetcher = () => get_tracks_by_artist_id(params.id)
    const {
        data: tracks,
        error: tracksError,
        isValidating: tracksValidating,
    } = useSWR<ITrack[]>(`tracks_by_artist_id_${params.id}`, tracksFetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    })

    const { showPlayer } = useMusicPlayer()
    const [page, setPage] = useState(1)
    const rowsPerPage = 4

    const pages = tracks ? Math.ceil(tracks.length / rowsPerPage) : 0
    const loadingState = tracksValidating || !tracks ? "loading" : "idle"

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

    if (artistValidating) {
        return (
            <div className="p-4">
                <Spinner />
            </div>
        )
    }

    if (artistError || !artist) {
        return <div className="p-4">Artist not found</div>
    }

    return (
        <div className="p-4 h-96">
            <div className="flex flex-row gap-x-4 p-8 bg-content1 rounded-xl">
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
                        <p className="text-2xl font-medium mb-2 mt-2">
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
                                    <TableCell
                                        onClick={() => {
                                            showPlayer({
                                                trackName: item.track_name,
                                                imageUrl: item.image_url,
                                                artistName: artist.artist_name,
                                                trackUrl: item.track_url,
                                            })
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
            </div>
        </div>
    )
}
