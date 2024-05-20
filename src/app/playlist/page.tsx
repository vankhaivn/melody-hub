"use client"
import { formatDuration, formatTrackName, formatView } from "@/utils/format"
import { Tab, Tabs, Card, CardBody, Button, Divider } from "@nextui-org/react"
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Pagination,
    Spinner,
    Avatar,
    Image,
    ScrollShadow,
} from "@nextui-org/react"
import {
    Modal,
    ModalContent,
    ModalBody,
    useDisclosure,
} from "@nextui-org/react"
import { PlayIcon, DeleteIcon, EditIcon } from "@/components/icons"
import React, { useEffect, useMemo, useState } from "react"
import { useMusicPlayer } from "@/context/MusicPlayerContext"
import { useAuth } from "@/context/AuthContext"
import {
    create_playlist,
    get_all_playlist,
    get_tracks_by_playlist_id,
    get_recommend_tracks_by_playlist_id,
} from "@/api/playlist"
import useSWR from "swr"

export default function PlaylistPage() {
    const { isLoggedIn } = useAuth()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [selectedPlaylist, setSelectedPlaylist] = useState<IPlaylist | null>(
        null
    )

    const openModal = (playlist: IPlaylist) => {
        setSelectedPlaylist(playlist)
        onOpen()
    }

    if (isLoggedIn === false) {
        return (
            <div className="p-4">
                <h1 className="text-4xl font-bold text-danger-500">
                    Access Denied
                </h1>
                <p className="text-2xl font-semibold text-danger-500">
                    Please login to access this page
                </p>
            </div>
        )
    }

    if (isLoggedIn === null) {
        return (
            <div className="p-4">
                <Spinner />
            </div>
        )
    }

    return (
        <div className="p-4">
            <TabList openModal={openModal} />
            {selectedPlaylist && (
                <PlaylistModal
                    playlist={selectedPlaylist}
                    isOpen={isOpen}
                    onClose={onClose}
                />
            )}
        </div>
    )
}

const TabList = ({
    openModal,
}: {
    openModal: (playlist: IPlaylist) => void
}) => {
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

    if (playlistsError) {
        return <div>Error loading data</div>
    }

    if (playlistsValidating) {
        return (
            <div className="p-4">
                <Spinner />
            </div>
        )
    }
    return (
        <Tabs color="success" size="lg">
            <Tab title="All Playlist">
                <Playlists playlists={playlists} openModal={openModal} />
            </Tab>
            <Tab title="My Playlist">
                <Playlists playlists={playlists} openModal={openModal} />
            </Tab>
            <Tab title="MelodyHub Playlist">
                {/* <Playlists playlists={test_playlist} openModal={openModal} /> */}
            </Tab>
        </Tabs>
    )
}

const Playlists = ({
    playlists,
    openModal,
}: {
    playlists: IPlaylist[] | undefined
    openModal: (playlist: IPlaylist) => void
}) => {
    if (!playlists) {
        return <div>No playlist found</div>
    }
    return (
        <div className="flex flex-col gap-y-2 w-1/2">
            {playlists.map((playlist) => (
                <Card
                    key={playlist.playlist_id}
                    className="hover:translate-x-1 hover:bg-zinc-800 cursor-pointer"
                >
                    <CardBody onClick={() => openModal(playlist)}>
                        <div className="flex items-center">
                            <Image
                                removeWrapper
                                alt="Playlist Image"
                                className="z-0 w-16 h-16 object-cover"
                                src={playlist.image_url}
                            />
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold">
                                    {playlist.playlist_name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {formatDuration(playlist.total_duration)}
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            ))}
        </div>
    )
}

const PlaylistModal = ({
    playlist,
    isOpen,
    onClose,
}: {
    playlist: IPlaylist
    isOpen: any
    onClose: any
}) => {
    const tracksFetcher = () => get_tracks_by_playlist_id(playlist.playlist_id)
    const {
        data: tracks,
        error: tracksError,
        isValidating: tracksValidating,
    } = useSWR<ITrack[]>(
        `all_tracks_in_${playlist.playlist_id}`,
        tracksFetcher,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    )
    if (tracksError) {
        return <div>Error loading data</div>
    }
    const countTracks = tracks ? tracks.length : 0

    const tracksRecommendFetcher = () =>
        get_recommend_tracks_by_playlist_id(playlist.playlist_id)
    const {
        data: tracksRecommend,
        error: tracksRecommendError,
        isValidating: tracksRecommendValidating,
    } = useSWR<ITrack[]>(
        `all_track_recommend_in_${playlist.playlist_id}`,
        tracksRecommendFetcher,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    )
    if (tracksRecommendError) {
        return <div>Error loading data</div>
    }
    const countTracksRecommend = tracksRecommend ? tracksRecommend.length : 0
    return (
        <Modal
            backdrop="blur"
            isOpen={isOpen}
            onClose={onClose}
            size="5xl"
            hideCloseButton
        >
            <ModalContent className="h-4/5">
                <ScrollShadow size={80}>
                    <ModalBody className="flex p-6">
                        <div className="flex justify-between">
                            <div className="flex">
                                <Image
                                    removeWrapper
                                    alt="Playlist Image"
                                    className="z-0 w-32 h-32 object-cover"
                                    src={playlist.image_url}
                                />
                                <div className="ml-6 flex justify-between flex-col">
                                    <h3 className="text-xl font-semibold">
                                        Playlist
                                    </h3>
                                    <h3 className="text-6xl font-semibold">
                                        {playlist.playlist_name}
                                    </h3>
                                    <p className="text-md text-gray-500 font-semibold">
                                        {countTracks} tracks,{" "}
                                        {formatDuration(
                                            playlist.total_duration
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <PlayIcon
                                    size={64}
                                    color="var(--primary)"
                                    className="hover:scale-110 transition-transform cursor-pointer"
                                />
                                <EditIcon
                                    size={24}
                                    color="var(--blue)"
                                    className="ml-8 mb-1 cursor-pointer hover:scale-125 transition-transform"
                                />
                                <DeleteIcon
                                    size={24}
                                    color="var(--danger)"
                                    className="ml-8 mb-1 cursor-pointer hover:scale-125 transition-transform"
                                />
                            </div>
                        </div>
                        <Divider />
                        <div className="flex flex-col gap-y-4">
                            <TracksTable
                                tracks={tracks}
                                onClose={onClose}
                                tracksValidating={tracksValidating}
                            />
                            <RecommendPlaylist
                                tracksRecommend={tracksRecommend}
                                tracksRecommendValidating={
                                    tracksRecommendValidating
                                }
                            />
                        </div>
                    </ModalBody>
                </ScrollShadow>
            </ModalContent>
        </Modal>
    )
}

const TracksTable = ({
    tracks,
    onClose,
    tracksValidating,
}: {
    tracks: ITrack[] | [] | undefined
    onClose: any
    tracksValidating: boolean
}) => {
    const { showPlayer } = useMusicPlayer()
    const [page, setPage] = useState(1)
    const rowsPerPage = 4
    const pages = tracks ? Math.ceil(tracks.length / rowsPerPage) : 0

    const loadingState = false || tracksValidating == true ? "loading" : "idle"

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
                <TableColumn key="role">VIEW</TableColumn>
                <TableColumn key="role">DURATION</TableColumn>
                <TableColumn key="status">GENRES</TableColumn>
                <TableColumn key="action"> </TableColumn>
            </TableHeader>

            <TableBody
                items={items}
                loadingContent={<Spinner />}
                loadingState={loadingState}
                emptyContent={"No tracks to display."}
            >
                {(item) => (
                    <TableRow
                        key={item.track_name}
                        className="cursor-pointer hover:bg-zinc-800 transition-colors"
                    >
                        <TableCell className="font-semibold group-hover:text-success-500 transition-colors duration-400">
                            {item.rowIndex}
                        </TableCell>
                        <TableCell className="flex items-center font-semibold group-hover:text-success-500 transition-colors duration-400">
                            <Avatar
                                isBordered
                                radius="md"
                                src={item.image_url}
                                className="mr-4"
                            />
                            <div>
                                <p>
                                    {formatTrackName({
                                        trackName: item.track_name,
                                        characters: 32,
                                    })}
                                </p>
                                <p className="text-sm text-gray-500 group-hover:text-success-500 transition-colors duration-400">
                                    {item.artist_name}
                                </p>
                            </div>
                        </TableCell>
                        <TableCell className="font-semibold group-hover:text-success-500 transition-colors duration-400">
                            {formatView(item.view)}
                        </TableCell>
                        <TableCell className="font-semibold group-hover:text-success-500 transition-colors duration-400">
                            {formatDuration(item.duration)}
                        </TableCell>
                        <TableCell className="font-semibold group-hover:text-success-500 transition-colors duration-400">
                            {item.genres_name}
                        </TableCell>
                        <TableCell className="flex items-center">
                            <div
                                onClick={() => {
                                    showPlayer({
                                        trackName: item.track_name,
                                        imageUrl: item.image_url,
                                        artistName: item.artist_name,
                                        trackUrl: item.track_url,
                                    })
                                    onClose()
                                }}
                            >
                                <PlayIcon
                                    color="var(--primary)"
                                    size={32}
                                    className="mb-1 group-hover:scale-125 transition-transform duration-400 cursor-pointer"
                                />
                            </div>
                            <DeleteIcon
                                size={16}
                                color="var(--danger)"
                                className="ml-8 mb-1 group-hover:scale-125 transition-transform duration-400 cursor-pointer"
                            />
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}

const RecommendPlaylist = ({
    tracksRecommend,
    tracksRecommendValidating,
}: {
    tracksRecommend: ITrack[] | undefined
    tracksRecommendValidating: boolean
}) => {
    const loadingState = tracksRecommendValidating ? "loading" : "idle"

    return (
        <div className="mt-12 pb-4">
            <div className="mb-8">
                <h3 className="text-2xl font-extrabold">Recommended</h3>
                <p>Based on what's in this playlist</p>
            </div>
            <Table aria-label="Example static collection table">
                <TableHeader>
                    <TableColumn key="name">NAME</TableColumn>
                    <TableColumn key="role">VIEW</TableColumn>
                    <TableColumn key="role">DURATION</TableColumn>
                    <TableColumn key="status">GENRES</TableColumn>
                    <TableColumn key="status">{""}</TableColumn>
                </TableHeader>
                <TableBody
                    loadingContent={<Spinner />}
                    loadingState={loadingState}
                    emptyContent={"No tracks to display."}
                >
                    {tracksRecommend && tracksRecommend.length > 0
                        ? tracksRecommend.map((track) => (
                              <TableRow
                                  key={track.track_name}
                                  className="cursor-pointer hover:bg-zinc-800 transition-colors"
                              >
                                  <TableCell className="flex items-center font-semibold group-hover:text-success-500 transition-colors duration-400">
                                      <Avatar
                                          isBordered
                                          radius="md"
                                          src={track.image_url}
                                          className="mr-4"
                                      />
                                      <div>
                                          <p>
                                              {formatTrackName({
                                                  trackName: track.track_name,
                                                  characters: 32,
                                              })}
                                          </p>
                                          <p className="text-sm text-gray-500 group-hover:text-success-500 transition-colors duration-400">
                                              {track.artist_name}
                                          </p>
                                      </div>
                                  </TableCell>
                                  <TableCell className="font-semibold group-hover:text-success-500 transition-colors duration-400">
                                      {formatView(track.view)}
                                  </TableCell>
                                  <TableCell className="font-semibold group-hover:text-success-500 transition-colors duration-400">
                                      {formatDuration(track.duration)}
                                  </TableCell>
                                  <TableCell className="font-semibold group-hover:text-success-500 transition-colors duration-400">
                                      {track.genres_name}
                                  </TableCell>
                                  <TableCell>
                                      <Button
                                          variant="flat"
                                          color="success"
                                          className="font-semibold"
                                      >
                                          Add
                                      </Button>
                                  </TableCell>
                              </TableRow>
                          ))
                        : []}
                </TableBody>
            </Table>
            <Button
                className="mt-4 float-end text-large font-bold"
                variant="light"
                color="primary"
                size="lg"
            >
                Refresh
            </Button>
        </div>
    )
}
