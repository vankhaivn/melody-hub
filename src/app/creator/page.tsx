"use client"
import React, { useState } from "react"
import {
    Select,
    SelectItem,
    Input,
    Spinner,
    Button,
    Avatar,
} from "@nextui-org/react"
import useSWR from "swr"
import { get_all_artists } from "@/api/artists"
import { get_all_genres } from "@/api/genres"
import { useAuth } from "@/context/AuthContext"
import { create_track } from "@/api/creator"
import { toast } from "react-toastify"

export default function CreatorPage() {
    const { isCreator } = useAuth()

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
    } = useSWR<IGenres[]>("allGenres", allGenresFetcher, {
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

        if (duration < 10) {
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
            <form onSubmit={handleSubmit}>
                <Input
                    label="Track Name"
                    value={trackName}
                    onChange={(e) => setTrackName(e.target.value)}
                    required
                />
                <div className="flex w-full max-w-xs flex-col gap-2 mt-4">
                    <Select
                        label="Select Artist"
                        variant="flat"
                        placeholder="Select an artist"
                        selectedKeys={[selectedArtist]}
                        className="max-w-xs"
                        onChange={handleArtistSelectionChange}
                        required
                    >
                        {(allArtists ?? []).map((artist) => (
                            <SelectItem
                                key={artist.artist_id}
                                value={artist.artist_id}
                            >
                                <div className="flex gap-2 items-center">
                                    <Avatar
                                        alt={artist.artist_name}
                                        className="flex-shrink-0"
                                        size="sm"
                                        src={artist.artist_image}
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-small">
                                            {artist.artist_name}
                                        </span>
                                        <span className="text-tiny text-default-400">
                                            {artist.country}
                                        </span>
                                    </div>
                                </div>
                            </SelectItem>
                        ))}
                    </Select>
                    <p className="text-small text-default-500">
                        Selected Artist: {selectedArtist}
                    </p>
                </div>
                <div className="flex w-full max-w-xs flex-col gap-2 mt-4">
                    <Select
                        label="Select Genre"
                        variant="flat"
                        placeholder="Select a genre"
                        selectedKeys={[selectedGenre]}
                        className="max-w-xs"
                        onChange={handleGenreSelectionChange}
                        required
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
                    <p className="text-small text-default-500">
                        Selected Genre: {selectedGenre}
                    </p>
                </div>
                <Input
                    label="Release Year"
                    type="number"
                    value={releaseYear.toString()}
                    onChange={(e) => setReleaseYear(Number(e.target.value))}
                    required
                />
                <Input
                    label="Duration (seconds)"
                    type="number"
                    value={duration.toString()}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    required
                    readOnly
                />
                <input
                    type="file"
                    accept=".mp3"
                    onChange={handleTrackFileChange}
                    required
                />
                <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleTrackImageChange}
                    required
                />
                <Button type="submit" className="mt-4" isLoading={isSubmitting}>
                    Submit
                </Button>
            </form>
        </div>
    )
}
