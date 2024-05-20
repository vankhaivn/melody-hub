"use client"
import { Divider, Avatar, Skeleton, Switch, Tooltip } from "@nextui-org/react"
import { PlayIcon, ShuffleIcon, AddIcon } from "@/components/icons"
import { get_shuffle_tracks } from "@/api/tracks"
import { useMusicPlayer } from "@/context/MusicPlayerContext"
import { formatDuration, formatTrackName, formatView } from "@/utils/format"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import useSWR from "swr"
import { faClock, faEye, faUserPen } from "@fortawesome/free-solid-svg-icons"

export default function TrackPage() {
    const [isShuffle, setIsShuffle] = useState(false)

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4 h-24 px-8">
                <div
                    className={`transition-opacity duration-500 ease-in-out transform ${
                        isShuffle ? "opacity-0" : "opacity-100"
                    }`}
                >
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold">
                            Top Popular Tracks
                        </h1>
                        <p className="text-large text-default-400">
                            Listen to the most popular tracks of the week.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <Switch
                        defaultSelected
                        isSelected={isShuffle}
                        onValueChange={setIsShuffle}
                        size="lg"
                        color="secondary"
                        startContent={<ShuffleIcon size={16} />}
                        endContent={<PlayIcon size={16} />}
                    />
                    {isShuffle ? (
                        <p className="text-large text-secondary-400 mt-2 font-semibold">
                            Discover Top Tracks
                        </p>
                    ) : (
                        <p className="text-large text-default-400 mt-2 font-semibold">
                            Shuffle It Up
                        </p>
                    )}
                </div>
                <div
                    className={`transition-opacity duration-500 ease-in-out transform ${
                        isShuffle ? "opacity-100" : "opacity-0"
                    }`}
                >
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-secondary-400">
                            Shuffle Time!
                        </h1>
                        <p className="text-large text-default-400">
                            Dive into a sonic adventure – every listen is a
                            surprise.
                        </p>
                    </div>
                </div>
            </div>
            <Divider />
            {isShuffle ? <ShuffleTracks /> : <PopularTracks />}
        </div>
    )
}

const ShuffleTracks = () => {
    const shuffleTracksFetcher = () => get_shuffle_tracks(12)
    const {
        data: shuffleTracks,
        error: shuffleTracksError,
        isValidating: isShuffleTracksValidating,
    } = useSWR<ITrack[] | undefined>("shuffle_tracks", shuffleTracksFetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    })

    if (shuffleTracksError) {
        return <div>Error loading data</div>
    }

    if (isShuffleTracksValidating || !shuffleTracks) {
        return <LoadingSpacer />
    }

    const { showPlayer } = useMusicPlayer()

    return (
        <div className="grid grid-cols-6">
            {shuffleTracks.map((track, index) => (
                <Tooltip
                    showArrow={true}
                    content={
                        <SubInfo
                            view={track.view}
                            artist={track.artist_name}
                            duration={track.duration}
                        />
                    }
                    color="success"
                >
                    <div
                        key={index}
                        className="flex flex-col justify-center items-center p-4 cursor-pointer rounded-lg hover:bg-zinc-900 duration-500 relative group"
                        onClick={() =>
                            showPlayer({
                                trackUrl: track.track_url,
                                trackName: track.track_name,
                                imageUrl: track.image_url,
                                artistName: track.artist_name,
                            })
                        }
                    >
                        <div className="relative">
                            <Avatar
                                radius="sm"
                                src={track.image_url}
                                className="w-40 h-40 hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute bottom-0 -right-4 translate-y-8 opacity-0 group-hover:opacity-100 group-hover:translate-y-4 transition-all duration-500 ease-out">
                                <PlayIcon color="var(--primary)" size={48} />
                            </div>
                        </div>
                        <div className="w-full mt-2 px-2">
                            <p className="text-medium font-semibold">
                                {formatTrackName({
                                    trackName: track.track_name,
                                    characters: 18,
                                })}
                            </p>
                            <p className="text-default-400 text-sm">
                                {track.artist_name}
                            </p>
                        </div>
                    </div>
                </Tooltip>
            ))}
        </div>
    )
}

const PopularTracks = () => {
    const popularTracksFetcher = () => get_shuffle_tracks(12)
    const {
        data: popularTracks,
        error: popularTracksError,
        isValidating: isPopularTracksValidating,
    } = useSWR<ITrack[] | undefined>("popular_tracks", popularTracksFetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    })

    if (popularTracksError) {
        return <div>Error loading data</div>
    }

    if (isPopularTracksValidating || !popularTracks) {
        return <LoadingSpacer />
    }

    const { showPlayer } = useMusicPlayer()

    return (
        <div className="grid grid-cols-6">
            {popularTracks.map((track, index) => (
                <Tooltip
                    showArrow={true}
                    content={
                        <SubInfo
                            view={track.view}
                            artist={track.artist_name}
                            duration={track.duration}
                        />
                    }
                    color="success"
                >
                    <div
                        key={index}
                        className="flex flex-col justify-center items-center p-4 cursor-pointer rounded-lg hover:bg-zinc-900 duration-500 relative group"
                        onClick={() =>
                            showPlayer({
                                trackUrl: track.track_url,
                                trackName: track.track_name,
                                imageUrl: track.image_url,
                                artistName: track.artist_name,
                            })
                        }
                    >
                        <div className="relative">
                            <Avatar
                                radius="sm"
                                src={track.image_url}
                                className="w-40 h-40 hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute bottom-0 -right-4 translate-y-8 opacity-0 group-hover:opacity-100 group-hover:translate-y-4 transition-all duration-500 ease-out">
                                <PlayIcon color="var(--primary)" size={48} />
                            </div>
                        </div>
                        <div className="w-full mt-2 px-2">
                            <p className="text-medium font-semibold">
                                {formatTrackName({
                                    trackName: track.track_name,
                                    characters: 18,
                                })}
                            </p>
                            <p className="text-default-400 text-sm">
                                {track.artist_name}
                            </p>
                        </div>
                    </div>
                </Tooltip>
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
                        <Skeleton className="rounded-md w-36 h-36"></Skeleton>
                        <Skeleton className="rounded-sm w-36 h-6 mt-2"></Skeleton>
                        <Skeleton className="rounded-sm w-28 h-6 mt-2"></Skeleton>
                    </div>
                </div>
            ))}
        </div>
    )
}

const SubInfo = ({
    view,
    duration,
    artist,
}: {
    view: number
    duration: number
    artist: string
}) => {
    return (
        <div className="p-2">
            <div className="text-large font-bold">
                <div>
                    <FontAwesomeIcon icon={faEye} />
                    <span className="ml-2">{formatView(view)}</span>
                </div>
                <div>
                    <FontAwesomeIcon icon={faClock} />
                    <span className="ml-2">{formatDuration(duration)}</span>
                </div>
                <div>
                    <FontAwesomeIcon icon={faUserPen} />
                    <span className="ml-1">{artist}</span>
                </div>
            </div>
        </div>
    )
}
