"use client"
import { useState, useRef, useEffect } from "react"
import { Card, Image, Button, Slider, Tooltip } from "@nextui-org/react"
import {
    PauseCircleIcon,
    NextIcon,
    PreviousIcon,
    PlayIcon,
    VolumeHighIcon,
    VolumeLowIcon,
    DownloadIcon,
    CloseIcon,
} from "@/components/icons"
import { Select, SelectItem } from "@nextui-org/react"
import { useMusicPlayer } from "@/context/MusicPlayerContext"

export default function MusicPlayer({ tracks }: { tracks: ITrack[] }) {
    const {
        hidePlayer,
        isVisible,
        currentTrack,
        nextTrack,
        prevTrack,
        setCurrentTrackById,
    } = useMusicPlayer()

    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [isPlaying, setIsPlaying] = useState(true)
    const audioRef = useRef<HTMLAudioElement>(null)
    const [value, setValue] = useState(75)
    const [selectedTrackId, setSelectedTrackId] = useState(
        new Set([currentTrack.track_id])
    )

    const handleVolumeChange = (value: number | number[]) => {
        const newValue = Array.isArray(value) ? value[0] : value
        setValue(newValue)
    }

    const handlePlayPause = () => {
        if (audioRef.current) {
            if (audioRef.current.paused) {
                audioRef.current.play()
                setIsPlaying(true)
            } else {
                audioRef.current.pause()
                setIsPlaying(false)
            }
        }
    }

    const handleTimeChange = (value: number | number[]) => {
        const newValue = Array.isArray(value) ? value[0] : value
        if (audioRef.current) {
            audioRef.current.currentTime = (newValue / 100) * duration
            setCurrentTime(audioRef.current.currentTime)
        }
    }

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = value / 100
        }
    }, [value])

    useEffect(() => {
        const audio = audioRef.current
        if (audio) {
            const setAudioData = () => {
                setDuration(audio.duration)
                if (isPlaying) {
                    audio
                        .play()
                        .catch((err) =>
                            console.error("Error playing audio:", err)
                        )
                }
            }

            const updateAudioTime = () => {
                setCurrentTime(audio.currentTime)
            }

            const handleEnded = () => {
                nextTrack()
            }

            audio.addEventListener("loadeddata", setAudioData)
            audio.addEventListener("timeupdate", updateAudioTime)
            audio.addEventListener("ended", handleEnded)

            return () => {
                audio.removeEventListener("loadeddata", setAudioData)
                audio.removeEventListener("timeupdate", updateAudioTime)
                audio.removeEventListener("ended", handleEnded)
            }
        }
    }, [isPlaying, nextTrack])

    useEffect(() => {
        setSelectedTrackId(new Set([currentTrack.track_id]))
    }, [currentTrack.track_id])

    const handleTrackChange = (selectedKeys: Set<string>) => {
        const selectedTrackId = Array.from(selectedKeys)[0]
        setCurrentTrackById(selectedTrackId)
        setSelectedTrackId(selectedKeys)
    }

    return (
        <Card
            isBlurred
            className={`border-none bg-background/60 dark:bg-default-100/50 fixed bottom-0 left-0 w-full px-2 pb-2 z-50 transition-transform duration-500 ${
                isVisible ? "translate-y-0" : "translate-y-full"
            }`}
            shadow="sm"
        >
            <Slider
                aria-label="Music progress"
                classNames={{
                    track: "bg-default-500/30",
                    thumb: "w-2 h-2 after:w-2 after:h-2 after:bg-foreground",
                }}
                color="foreground"
                value={(currentTime / duration) * 100 || 0}
                onChange={handleTimeChange}
                size="sm"
            />
            <div className="px-8 grid grid-cols-8 items-center">
                <div className="flex items-center col-span-2">
                    <Image
                        alt="Album cover"
                        className="object-cover"
                        shadow="md"
                        src={currentTrack.image_url}
                        height="52px"
                        width="52px"
                    />
                    <p className="ml-4 font-bold">
                        {currentTrack.track_name}{" "}
                        <span className="text-success">by</span>{" "}
                        {currentTrack.artist_name}
                    </p>
                </div>
                <div className="col-span-1">
                    <SelectPlaylist
                        tracks={tracks}
                        setCurrentTrackById={setCurrentTrackById}
                        currentTrack={currentTrack}
                    />
                </div>
                <div className="flex justify-between ml-12 items-center col-span-2">
                    <p className="text-small">
                        {new Date(currentTime * 1000)
                            .toISOString()
                            .substr(14, 5)}
                    </p>
                    <div className="flex w-full items-center justify-center">
                        <Button
                            isIconOnly
                            className="data-[hover]:bg-foreground/10"
                            radius="full"
                            variant="light"
                            onPress={prevTrack}
                        >
                            <PreviousIcon />
                        </Button>
                        <Button
                            isIconOnly
                            className="w-auto h-auto data-[hover]:bg-foreground/10"
                            radius="full"
                            variant="light"
                            onPress={handlePlayPause}
                        >
                            {isPlaying ? (
                                <PauseCircleIcon size={54} />
                            ) : (
                                <PlayIcon size={54} />
                            )}
                        </Button>
                        <Button
                            isIconOnly
                            className="data-[hover]:bg-foreground/10"
                            radius="full"
                            variant="light"
                            onPress={nextTrack}
                        >
                            <NextIcon />
                        </Button>

                        <audio ref={audioRef} src={currentTrack.track_url} />
                    </div>
                    <p className="text-small text-foreground/50">
                        {new Date(duration * 1000).toISOString().substr(14, 5)}
                    </p>
                </div>
                <div className="flex gap-2 items-start justify-center pl-4 col-span-3 ml-8">
                    <Slider
                        aria-label="Volume"
                        size="md"
                        color="success"
                        value={value}
                        onChange={handleVolumeChange}
                        startContent={
                            <Button
                                isIconOnly
                                radius="full"
                                variant="light"
                                onPress={() =>
                                    setValue((prev) =>
                                        prev >= 10 ? prev - 10 : 0
                                    )
                                }
                            >
                                <VolumeLowIcon size={24} />
                            </Button>
                        }
                        endContent={
                            <Button
                                isIconOnly
                                radius="full"
                                variant="light"
                                onPress={() =>
                                    setValue((prev) =>
                                        prev <= 90 ? prev + 10 : 100
                                    )
                                }
                            >
                                <VolumeHighIcon size={24} />
                            </Button>
                        }
                    />
                    <Tooltip content="Download this track" color="primary">
                        <Button
                            variant="flat"
                            color="primary"
                            className="font-bold ml-4"
                            onClick={() => {
                                window.open(currentTrack.track_url, "_blank")
                            }}
                        >
                            <DownloadIcon size={24} />
                        </Button>
                    </Tooltip>
                    <Button
                        variant="flat"
                        color="danger"
                        className="font-bold ml-4"
                        onClick={hidePlayer}
                    >
                        <CloseIcon size={24} />
                    </Button>
                </div>
            </div>
        </Card>
    )
}

const SelectPlaylist = ({
    tracks,
    setCurrentTrackById,
    currentTrack,
}: {
    tracks: ITrack[]
    setCurrentTrackById: (id: string) => void
    currentTrack: ITrack
}) => {
    const handleSelectionChange = (e: any) => {
        setCurrentTrackById(e.target.value)
    }

    return (
        <div className="w-50">
            <Select
                label="Playing"
                className="max-w-xs"
                selectedKeys={new Set([currentTrack.track_id])}
                onChange={handleSelectionChange}
            >
                {tracks.map((track) => (
                    <SelectItem key={track.track_id} value={track.track_id}>
                        {track.track_name}
                    </SelectItem>
                ))}
            </Select>
        </div>
    )
}
