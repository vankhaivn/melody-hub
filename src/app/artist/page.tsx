"use client"
import { get_all_artists } from "@/api/artists"
import { Divider, Avatar, Skeleton } from "@nextui-org/react"
import useSWR from "swr"

export default function ArtistPage() {
    const fetcher = () => get_all_artists()
    const { data, error, isLoading } = useSWR("get_all_artists", fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    })

    return (
        <div className="w-full px-4">
            <div className="w-full mt-8">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold">Top Popular Artists</h1>
                    <p className="text-large text-default-400">
                        Listen to the popular artists.
                    </p>
                </div>
                <Divider className="my-4" />
                {isLoading ? <LoadingSpacer /> : AvatarList(data)}
            </div>
        </div>
    )
}

const AvatarList = (artists: IArtist[] | undefined) => {
    if (!artists) {
        return null
    }
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 px-4">
            {artists.map((artist) => (
                <div className="flex flex-col justify-center items-center p-4 cursor-pointer rounded-lg hover:bg-zinc-900 duration-500">
                    <Avatar
                        isBordered
                        color="default"
                        src={artist.artist_image}
                        className="w-36 h-36"
                    />
                    <div className="w-full">
                        <p className="mt-2 text-medium font-semibold">
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
                <div className="flex flex-col justify-center items-center p-4 cursor-pointer rounded-lg hover:bg-zinc-900 duration-500">
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
