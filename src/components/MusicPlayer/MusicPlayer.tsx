"use client"
import { useState, useRef, useEffect } from "react"
import { Card, Image, Button, Slider } from "@nextui-org/react"
import {
    PauseCircleIcon,
    NextIcon,
    PreviousIcon,
    RepeatOneIcon,
    ShuffleIcon,
    PlayIcon,
    VolumeHighIcon,
    VolumeLowIcon,
} from "@/components/icons"
import { useMusicPlayer } from "@/components/MusicPlayer/MusicPlayerContext"

export default function MusicPlayer({
    trackUrl,
    trackName,
    imageUrl,
    artistName,
}: {
    trackUrl: string
    trackName: string
    imageUrl: string
    artistName: string
}) {
    const { hidePlayer, isVisible } = useMusicPlayer()
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [isPlaying, setIsPlaying] = useState(true)
    const audioRef = useRef<HTMLAudioElement>(null)
    const [value, setValue] = useState(75)

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

            audio.addEventListener("loadeddata", setAudioData)
            audio.addEventListener("timeupdate", updateAudioTime)

            return () => {
                audio.removeEventListener("loadeddata", setAudioData)
                audio.removeEventListener("timeupdate", updateAudioTime)
            }
        }
    }, [isPlaying])

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
            <div className="px-8 grid grid-cols-3 items-center">
                <div className="flex items-center">
                    <Image
                        alt="Album cover"
                        className="object-cover"
                        shadow="md"
                        src={imageUrl}
                        height="52px"
                        width="52px"
                    />
                    <p className="ml-4 font-bold">
                        {trackName} <span className="text-success">by</span>{" "}
                        {artistName}
                    </p>
                </div>
                <div className="flex justify-between ml-12 items-center">
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
                        >
                            <RepeatOneIcon className="text-foreground/80" />
                        </Button>
                        <Button
                            isIconOnly
                            className="data-[hover]:bg-foreground/10"
                            radius="full"
                            variant="light"
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
                        >
                            <NextIcon />
                        </Button>
                        <Button
                            isIconOnly
                            className="data-[hover]:bg-foreground/10"
                            radius="full"
                            variant="light"
                        >
                            <ShuffleIcon className="text-foreground/80" />
                        </Button>
                        <audio ref={audioRef} src={trackUrl} />
                    </div>
                    <p className="text-small text-foreground/50">
                        {new Date(duration * 1000).toISOString().substr(14, 5)}
                    </p>
                </div>
                <div className="flex gap-2 items-start justify-center pl-12">
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
                        className="max-w-md"
                    />
                    <div
                        onClick={hidePlayer}
                        className="text-danger-500 text-2xl font-bold cursor-pointer hover:text-danger-300 transition-colors duration-300 mt-1 ml-4"
                    >
                        X
                    </div>
                </div>
            </div>
        </Card>
    )
}
