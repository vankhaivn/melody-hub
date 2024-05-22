"use client"
import React, { useState, useRef, useEffect } from "react"
import {
    Navbar,
    NavbarContent,
    NavbarItem,
    Input,
    DropdownItem,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    Avatar,
    Spinner,
} from "@nextui-org/react"
import Link from "next/link"

import { SearchIcon } from "@/components/icons"
import { get_user_information } from "@/api/account"
import useSWR from "swr"
import { useAuth } from "@/context/AuthContext"
import { get_all_tracks_basic_info } from "@/api/tracks"
import { formatDuration } from "@/utils/format"

export default function AppHeader() {
    const { isLoggedIn, logoutContext, isCreator } = useAuth()
    const [isSearching, setIsSearching] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const searchModalRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLDivElement>(null)
    const [inputPosition, setInputPosition] = useState<{
        top: number
        left: number
    }>({ top: 0, left: 0 })

    const tracksBasicInfoFetcher = () => get_all_tracks_basic_info()
    const {
        data: tracksBasicInfo,
        error: tracksBasicInfoError,
        isValidating: isTracksBasicInfoValidating,
    } = useSWR<ITrackBasicInfo[]>("tracksBasicInfo", tracksBasicInfoFetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    })

    const userBasicInfoFetcher = () => get_user_information()
    const {
        data: userBasicInfo,
        error: userBasicInfoError,
        isValidating: isUserBasicInfoValidating,
    } = useSWR<IAccount | null>("userBasicInfo", userBasicInfoFetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    })

    const email = userBasicInfo?.email
    const avatar = userBasicInfo?.avatar_image

    const filteredTracks = tracksBasicInfo?.filter(
        (track) =>
            track.track_name
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            track.artist_name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    useEffect(() => {
        if (inputRef.current) {
            const rect = inputRef.current.getBoundingClientRect()
            setInputPosition({
                top: rect.bottom + window.scrollY + 4,
                left: rect.left + window.scrollX,
            })
        }
    }, [isSearching])

    const handleMouseDown = (e: any) => {
        if (
            searchModalRef.current &&
            searchModalRef.current.contains(e.target)
        ) {
            e.preventDefault()
        }
    }

    return (
        <>
            <Navbar
                isBordered
                maxWidth="full"
                height="4.6rem"
                classNames={{
                    item: [
                        "flex",
                        "relative",
                        "h-full",
                        "items-center",
                        "data-[active=true]:after:content-['']",
                        "data-[active=true]:after:absolute",
                        "data-[active=true]:after:bottom-0",
                        "data-[active=true]:after:left-0",
                        "data-[active=true]:after:right-0",
                        "data-[active=true]:after:h-[2px]",
                        "data-[active=true]:after:rounded-[2px]",
                        "data-[active=true]:after:bg-success-500",
                    ],
                }}
            >
                <NavbarContent
                    as="div"
                    className="items-center"
                    justify="start"
                >
                    <div ref={inputRef}>
                        <Input
                            classNames={{
                                base: "w-[20rem] h-12",
                                mainWrapper: "h-full",
                                input: "text-small",
                                inputWrapper:
                                    "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20 rounded-2xl",
                            }}
                            placeholder="Search songs, artists, albums..."
                            size="md"
                            startContent={<SearchIcon size={24} />}
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearching(true)}
                            onBlur={() => setIsSearching(false)}
                        />
                    </div>
                </NavbarContent>
                <NavbarContent className="hidden sm:flex" justify="start">
                    <NavbarItem isActive>
                        <Link href="#" color="success">
                            Trending
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link href="#" color="foreground">
                            Genres
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link color="foreground" href="#">
                            Mood
                        </Link>
                    </NavbarItem>
                </NavbarContent>
                <NavbarContent className="hidden sm:flex" justify="end">
                    {!isLoggedIn ? (
                        <div className="hidden">None</div>
                    ) : (
                        <Dropdown placement="bottom-end">
                            <DropdownTrigger>
                                <Avatar
                                    isBordered
                                    as="button"
                                    className="transition-transform"
                                    size="md"
                                    src={avatar}
                                />
                            </DropdownTrigger>
                            <DropdownMenu
                                aria-label="Profile Actions"
                                variant="flat"
                            >
                                <DropdownItem
                                    key="profile"
                                    className="h-14 gap-2"
                                >
                                    <p className="font-semibold">
                                        Signed in as
                                    </p>
                                    <p className="font-semibold">{email}</p>
                                </DropdownItem>
                                <DropdownItem key="profile1">
                                    <Link href="/profile">My Profile</Link>
                                </DropdownItem>
                                {isCreator ? (
                                    <DropdownItem key="creator">
                                        <Link href="/creator">
                                            Creator Zone
                                        </Link>
                                    </DropdownItem>
                                ) : (
                                    <DropdownItem key="none" className="hidden">
                                        None
                                    </DropdownItem>
                                )}
                                <DropdownItem key="help_and_feedback">
                                    Help & Feedback
                                </DropdownItem>
                                <DropdownItem
                                    key="logout"
                                    color="danger"
                                    onClick={logoutContext}
                                >
                                    Log Out
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    )}
                </NavbarContent>
            </Navbar>

            {isSearching && searchQuery && (
                <div
                    className={`transition-all duration-300 ease-in-out absolute z-50`}
                    style={{
                        top: inputPosition.top,
                        left: inputPosition.left,
                        width: "28rem",
                    }}
                    onMouseDown={handleMouseDown}
                    ref={searchModalRef}
                >
                    <SearchModal
                        tracksBasicInfo={filteredTracks}
                        isTracksBasicInfoValidating={
                            isTracksBasicInfoValidating
                        }
                    />
                </div>
            )}
        </>
    )
}

const SearchModal = ({
    tracksBasicInfo,
    isTracksBasicInfoValidating,
}: {
    tracksBasicInfo?: ITrackBasicInfo[]
    isTracksBasicInfoValidating: boolean
}) => {
    return (
        <div className="rounded-xl bg-content2 shadow-lg py-4 px-2 w-full max-h-[32rem] overflow-y-auto">
            <h2 className="text-xl font-bold mb-2 px-2">Top Results</h2>
            {isTracksBasicInfoValidating ? (
                <div className="flex gap-x-2 mt-4">
                    <Spinner />
                    <p className="text-medium text-foreground-500">
                        The initial search may take a few seconds!
                    </p>
                </div>
            ) : tracksBasicInfo && tracksBasicInfo.length > 0 ? (
                <ul>
                    {tracksBasicInfo.map((track) => (
                        <li
                            key={track.track_id}
                            className="py-2 px-3 rounded-lg cursor-pointer hover:bg-content1 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Link href={`/track/${track.track_id}`}>
                                        <Avatar
                                            radius="sm"
                                            src={track.image_url}
                                        />
                                    </Link>
                                    <div className="ml-3 font-bold flex flex-col justify-between">
                                        <Link
                                            href={`/track/${track.track_id}`}
                                            className="hover:underline"
                                        >
                                            {track.track_name}
                                        </Link>
                                        <Link
                                            href={`/artist/${track.artist_id}`}
                                            className="text-small text-foreground-500 hover:underline"
                                        >
                                            {track.artist_name}
                                        </Link>
                                    </div>
                                </div>
                                <p className="text-small font-bold">
                                    {formatDuration(track.duration)}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No results found.</p>
            )}
        </div>
    )
}
