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
    ScrollShadow,
} from "@nextui-org/react"
import {
    Modal,
    ModalContent,
    ModalBody,
    useDisclosure,
} from "@nextui-org/react"
import { PlayIcon, DeleteIcon, EditIcon } from "@/components/icons"
import React, { useMemo, useState } from "react"
import { useMusicPlayer } from "@/components/MusicPlayer/MusicPlayerContext"

const test_playlist = [
    {
        playlist_id: "1",
        playlist_name: "Playlist 1",
        tracks: [
            {
                track_name: "Cruel summer",
                track_url:
                    "https://firebasestorage.googleapis.com/v0/b/melodyhub-e6e1a.appspot.com/o/tracks%2FCruel%20Summer.mp3?alt=media&token=b88a2cde-d008-4133-b062-ce6b074f0cdd",
                image_url:
                    "https://firebasestorage.googleapis.com/v0/b/melodyhub-e6e1a.appspot.com/o/track_image%2FCruel%20summer.jpg?alt=media&token=ab759a1c-64fe-4b91-bfc6-4737efef5e9c",
                view: 2085811901,
                release_year: 2019,
                duration: 84,
                artist_name: "Taylor Swift",
                genres_name: "Mix",
            },
            {
                track_name: "One Of The Girls",
                track_url:
                    "https://firebasestorage.googleapis.com/v0/b/melodyhub-e6e1a.appspot.com/o/tracks%2FOne%20Of%20The%20Girls%20(with%20JENNIE%2C%20Lily%20Rose%20Depp).mp3?alt=media&token=6c2146ea-8f80-46ec-923f-0180add5b64e",
                image_url:
                    "https://firebasestorage.googleapis.com/v0/b/melodyhub-e6e1a.appspot.com/o/track_image%2FOne%20Of%20The%20Girls.jpg?alt=media&token=13c2d563-0fa7-47b4-9b68-f128e28288a5",
                view: 681090666,
                release_year: 2023,
                duration: 244,
                artist_name: "Jennie",
                genres_name: "Pop",
            },
            {
                track_name: "SOLO",
                track_url:
                    "https://firebasestorage.googleapis.com/v0/b/melodyhub-e6e1a.appspot.com/o/tracks%2FSOLO%20-%20JENNIE.mp3?alt=media&token=dad293b1-1b53-4cca-9221-94f4756d8dd6",
                image_url:
                    "https://firebasestorage.googleapis.com/v0/b/melodyhub-e6e1a.appspot.com/o/track_image%2FSOLO.jpg?alt=media&token=84811288-c12d-4f83-ab1b-f74c791ddc70",
                view: 598905847,
                release_year: 2018,
                duration: 169,
                artist_name: "Jennie",
                genres_name: "Pop",
            },
            {
                track_name: "Standing Next to You",
                track_url:
                    "https://firebasestorage.googleapis.com/v0/b/melodyhub-e6e1a.appspot.com/o/tracks%2FStanding%20Next%20to%20You.mp3?alt=media&token=20933539-ea85-43d2-a82f-e4d96e46bd71",
                image_url:
                    "https://firebasestorage.googleapis.com/v0/b/melodyhub-e6e1a.appspot.com/o/track_image%2FStanding%20Next%20to%20You.jpg?alt=media&token=fc15a45a-7c1c-4c31-be9f-c24020facd18",
                view: 515732253,
                release_year: 2023,
                duration: 206,
                artist_name: "Jung Kook",
                genres_name: "Dance",
            },
        ],
        total_duration: 100,
    },
    {
        playlist_id: "2",
        playlist_name: "Playlist 2",
        tracks: [
            {
                track_name: "Cruel summer",
                track_url:
                    "https://firebasestorage.googleapis.com/v0/b/melodyhub-e6e1a.appspot.com/o/tracks%2FCruel%20Summer.mp3?alt=media&token=b88a2cde-d008-4133-b062-ce6b074f0cdd",
                image_url:
                    "https://firebasestorage.googleapis.com/v0/b/melodyhub-e6e1a.appspot.com/o/track_image%2FCruel%20summer.jpg?alt=media&token=ab759a1c-64fe-4b91-bfc6-4737efef5e9c",
                view: 2085811901,
                release_year: 2019,
                duration: 84,
                artist_name: "Taylor Swift",
                genres_name: "Mix",
            },
            {
                track_name: "One Of The Girls",
                track_url:
                    "https://firebasestorage.googleapis.com/v0/b/melodyhub-e6e1a.appspot.com/o/tracks%2FOne%20Of%20The%20Girls%20(with%20JENNIE%2C%20Lily%20Rose%20Depp).mp3?alt=media&token=6c2146ea-8f80-46ec-923f-0180add5b64e",
                image_url:
                    "https://firebasestorage.googleapis.com/v0/b/melodyhub-e6e1a.appspot.com/o/track_image%2FOne%20Of%20The%20Girls.jpg?alt=media&token=13c2d563-0fa7-47b4-9b68-f128e28288a5",
                view: 681090666,
                release_year: 2023,
                duration: 244,
                artist_name: "Jennie",
                genres_name: "Pop",
            },
            {
                track_name: "SOLO",
                track_url:
                    "https://firebasestorage.googleapis.com/v0/b/melodyhub-e6e1a.appspot.com/o/tracks%2FSOLO%20-%20JENNIE.mp3?alt=media&token=dad293b1-1b53-4cca-9221-94f4756d8dd6",
                image_url:
                    "https://firebasestorage.googleapis.com/v0/b/melodyhub-e6e1a.appspot.com/o/track_image%2FSOLO.jpg?alt=media&token=84811288-c12d-4f83-ab1b-f74c791ddc70",
                view: 598905847,
                release_year: 2018,
                duration: 169,
                artist_name: "Jennie",
                genres_name: "Pop",
            },
            {
                track_name: "Standing Next to You",
                track_url:
                    "https://firebasestorage.googleapis.com/v0/b/melodyhub-e6e1a.appspot.com/o/tracks%2FStanding%20Next%20to%20You.mp3?alt=media&token=20933539-ea85-43d2-a82f-e4d96e46bd71",
                image_url:
                    "https://firebasestorage.googleapis.com/v0/b/melodyhub-e6e1a.appspot.com/o/track_image%2FStanding%20Next%20to%20You.jpg?alt=media&token=fc15a45a-7c1c-4c31-be9f-c24020facd18",
                view: 515732253,
                release_year: 2023,
                duration: 206,
                artist_name: "Jung Kook",
                genres_name: "Dance",
            },
        ],
        total_duration: 200,
    },
    {
        playlist_id: "3",
        playlist_name: "Playlist 3",
        tracks: [
            {
                track_name: "Cruel summer",
                track_url:
                    "https://firebasestorage.googleapis.com/v0/b/melodyhub-e6e1a.appspot.com/o/tracks%2FCruel%20Summer.mp3?alt=media&token=b88a2cde-d008-4133-b062-ce6b074f0cdd",
                image_url:
                    "https://firebasestorage.googleapis.com/v0/b/melodyhub-e6e1a.appspot.com/o/track_image%2FCruel%20summer.jpg?alt=media&token=ab759a1c-64fe-4b91-bfc6-4737efef5e9c",
                view: 2085811901,
                release_year: 2019,
                duration: 84,
                artist_name: "Taylor Swift",
                genres_name: "Mix",
            },
            {
                track_name: "One Of The Girls",
                track_url:
                    "https://firebasestorage.googleapis.com/v0/b/melodyhub-e6e1a.appspot.com/o/tracks%2FOne%20Of%20The%20Girls%20(with%20JENNIE%2C%20Lily%20Rose%20Depp).mp3?alt=media&token=6c2146ea-8f80-46ec-923f-0180add5b64e",
                image_url:
                    "https://firebasestorage.googleapis.com/v0/b/melodyhub-e6e1a.appspot.com/o/track_image%2FOne%20Of%20The%20Girls.jpg?alt=media&token=13c2d563-0fa7-47b4-9b68-f128e28288a5",
                view: 681090666,
                release_year: 2023,
                duration: 244,
                artist_name: "Jennie",
                genres_name: "Pop",
            },
            {
                track_name: "SOLO",
                track_url:
                    "https://firebasestorage.googleapis.com/v0/b/melodyhub-e6e1a.appspot.com/o/tracks%2FSOLO%20-%20JENNIE.mp3?alt=media&token=dad293b1-1b53-4cca-9221-94f4756d8dd6",
                image_url:
                    "https://firebasestorage.googleapis.com/v0/b/melodyhub-e6e1a.appspot.com/o/track_image%2FSOLO.jpg?alt=media&token=84811288-c12d-4f83-ab1b-f74c791ddc70",
                view: 598905847,
                release_year: 2018,
                duration: 169,
                artist_name: "Jennie",
                genres_name: "Pop",
            },
            {
                track_name: "Standing Next to You",
                track_url:
                    "https://firebasestorage.googleapis.com/v0/b/melodyhub-e6e1a.appspot.com/o/tracks%2FStanding%20Next%20to%20You.mp3?alt=media&token=20933539-ea85-43d2-a82f-e4d96e46bd71",
                image_url:
                    "https://firebasestorage.googleapis.com/v0/b/melodyhub-e6e1a.appspot.com/o/track_image%2FStanding%20Next%20to%20You.jpg?alt=media&token=fc15a45a-7c1c-4c31-be9f-c24020facd18",
                view: 515732253,
                release_year: 2023,
                duration: 206,
                artist_name: "Jung Kook",
                genres_name: "Dance",
            },
        ],
        total_duration: 300,
    },
]

export default function PlaylistPage() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [selectedPlaylist, setSelectedPlaylist] = useState<IPlaylist | null>(
        test_playlist[0]
    )

    const openModal = (playlist: IPlaylist) => {
        setSelectedPlaylist(playlist)
        onOpen()
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

const PlaylistImage = ({
    playlist,
    size = 6,
}: {
    playlist: IPlaylist
    size?: number
}) => {
    const listImage = playlist.tracks.map((track) => track.image_url)

    return (
        <div className="grid grid-cols-2 rounded-md overflow-hidden">
            {listImage.map((image, index) => (
                <img
                    key={index}
                    src={image}
                    alt="playlist"
                    className={`w-${size} h-${size} ${
                        index === 0 ? "rounded-tl-md" : ""
                    } ${index === 1 ? "rounded-tr-md" : ""} ${
                        index === 2 ? "rounded-bl-md" : ""
                    } ${index === 3 ? "rounded-br-md" : ""}`}
                />
            ))}
        </div>
    )
}

const TabList = ({
    openModal,
}: {
    openModal: (playlist: IPlaylist) => void
}) => {
    return (
        <Tabs color="success" size="lg">
            <Tab title="All Playlist">
                <Playlists playlists={test_playlist} openModal={openModal} />
            </Tab>
            <Tab title="My Playlist">
                <Playlists playlists={test_playlist} openModal={openModal} />
            </Tab>
            <Tab title="MelodyHub Playlist">
                <Playlists playlists={test_playlist} openModal={openModal} />
            </Tab>
        </Tabs>
    )
}

const Playlists = ({
    playlists,
    openModal,
}: {
    playlists: IPlaylist[]
    openModal: (playlist: IPlaylist) => void
}) => {
    return (
        <div className="flex flex-col gap-y-2 w-1/2">
            {playlists.map((playlist) => (
                <Card
                    key={playlist.playlist_id}
                    className="hover:translate-x-1 hover:bg-zinc-800 cursor-pointer"
                >
                    <CardBody onClick={() => openModal(playlist)}>
                        <div className="flex items-center">
                            <PlaylistImage playlist={playlist} />
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold">
                                    {playlist.playlist_name}{" "}
                                    <span className="text-medium text-gray-500">
                                        {playlist.tracks.length} tracks
                                    </span>
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
                                <PlaylistImage playlist={playlist} size={16} />
                                <div className="ml-6 flex justify-between flex-col">
                                    <h3 className="text-xl font-semibold">
                                        Playlist
                                    </h3>
                                    <h3 className="text-6xl font-semibold">
                                        {playlist.playlist_name}
                                    </h3>
                                    <p className="text-md text-gray-500 font-semibold">
                                        {playlist.tracks.length} tracks,{" "}
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
                                tracks={playlist.tracks}
                                onClose={onClose}
                            />
                            <RecommendPlaylist playlist={playlist} />
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
}: {
    tracks: ITrack[]
    onClose: any
}) => {
    const { showPlayer } = useMusicPlayer()
    const [page, setPage] = useState(1)
    const rowsPerPage = 4
    const pages = tracks ? Math.ceil(tracks.length / rowsPerPage) : 0

    const loadingState = false || tracks?.length === 0 ? "loading" : "idle"

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

const RecommendPlaylist = ({ playlist }: { playlist: IPlaylist }) => {
    // call api get recommend playlist
    const tracks = playlist.tracks
    return (
        <div className="mt-12 pb-4">
            <div className="mb-8">
                <h3 className="text-2xl font-extrabold">Recommended</h3>
                <p>Based on what's in this playlist</p>
            </div>
            <div>
                <Table aria-label="Example static collection table">
                    <TableHeader>
                        <TableColumn key="name">NAME</TableColumn>
                        <TableColumn key="role">VIEW</TableColumn>
                        <TableColumn key="role">DURATION</TableColumn>
                        <TableColumn key="status">GENRES</TableColumn>
                        <TableColumn key="status">{""}</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {tracks.map((track) => (
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
                        ))}
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
        </div>
    )
}
