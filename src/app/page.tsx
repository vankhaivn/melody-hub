"use client"
import {
    Card,
    CardHeader,
    Image,
    CardFooter,
    Button,
    Divider,
} from "@nextui-org/react"
import { AcmeLogo } from "@/components/icons/components/AcmeLogo"
import { toast } from "react-toastify"
import { useMusicPlayer } from "@/context/MusicPlayerContext"
import { get_all_artists } from "@/api/artists"
import Link from "next/link"

export default function Home() {
    const { showPlayer, hidePlayer } = useMusicPlayer()
    const fetchArtists = async () => {
        const artists = await get_all_artists()
        console.log(artists)
        toast.success("Artists fetched successfully!")
    }
    return (
        <div className="p-4">
            <Card
                isFooterBlurred
                className="w-full h-[300px] col-span-12 sm:col-span-7"
            >
                <CardHeader className="absolute z-10 top-1 flex-col items-start">
                    <p className="text-tiny text-white/60 uppercase font-bold">
                        Your day your way
                    </p>
                    <h4 className="text-white/90 font-bold text-2xl">
                        Your music for a better day
                    </h4>
                </CardHeader>
                <Image
                    removeWrapper
                    alt="Relaxing app background"
                    className="z-0 w-full h-full object-cover cursor-pointer hover:scale-110 duration-700"
                    src="/bg.jpg"
                />
                <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
                    <div className="flex flex-grow gap-2 items-center">
                        <div className="h-10 w-10 bg-black rounded-md flex justify-center items-center">
                            <AcmeLogo size={36} />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-tiny text-white/60">
                                Melody Hub App
                            </p>
                            <p className="text-tiny text-white/60">
                                Available on App Store
                            </p>
                        </div>
                    </div>
                    <Button
                        radius="full"
                        size="md"
                        variant="shadow"
                        color="primary"
                        className="font-bold"
                    >
                        Get App
                    </Button>
                </CardFooter>
            </Card>
            <div className="w-100 my-12">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold">Trending Songs</h1>
                    <p className="text-large text-default-400">
                        Listen to the latest hits.
                    </p>
                </div>
                <Divider className="my-4" />
            </div>
            <div className="gap-6 grid grid-cols-12 grid-rows-2">
                <Card className="col-span-12 sm:col-span-4 h-[300px]">
                    <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                        <p className="text-tiny text-white/60 uppercase font-bold">
                            Music
                        </p>
                        <h4 className="text-white font-medium text-large">
                            Immerse yourself in music
                        </h4>
                    </CardHeader>
                    <Link href="/track" className="w-full h-full">
                        <Image
                            removeWrapper
                            alt="Card background"
                            className="z-0 w-full h-full object-cover hover:scale-125 duration-700 cursor-pointer"
                            src="/img1.jpg"
                        />
                    </Link>
                </Card>
                <Card className="col-span-12 sm:col-span-4 h-[300px]">
                    <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                        <p className="text-tiny text-white/60 uppercase font-bold">
                            Artist
                        </p>
                        <h4 className="text-white font-medium text-large">
                            Top artists with their musical masterpieces
                        </h4>
                    </CardHeader>
                    <Link href="/artist" className="w-full h-full">
                        <Image
                            removeWrapper
                            alt="Card background"
                            className="z-0 w-full h-full object-cover hover:scale-125 duration-700 cursor-pointer"
                            src="/img2.jpg"
                        />
                    </Link>
                </Card>
                <Card className="col-span-12 sm:col-span-4 h-[300px]">
                    <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                        <p className="text-tiny text-white/60 uppercase font-bold">
                            Show
                        </p>
                        <h4 className="text-white font-medium text-large">
                            Top shows full of emotions
                        </h4>
                    </CardHeader>
                    <Image
                        removeWrapper
                        alt="Card background"
                        className="z-0 w-full h-full object-cover hover:scale-125 duration-700 cursor-pointer"
                        src="/img3.jpg"
                    />
                </Card>
                <Card className="col-span-12 sm:col-span-7 h-[300px]">
                    <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                        <p className="text-tiny text-white/60 uppercase font-bold">
                            Playlist
                        </p>
                        <h4 className="text-white font-medium text-large">
                            Create your own personalized music playlist
                        </h4>
                    </CardHeader>
                    <Link href="/playlist" className="w-full h-full">
                        <Image
                            removeWrapper
                            alt="Card background"
                            className="z-0 w-full h-full object-cover hover:scale-125 duration-700 cursor-pointer"
                            src="/img4.jpg"
                        />
                    </Link>
                </Card>
                <Card className="col-span-12 sm:col-span-5 h-[300px]">
                    <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                        <p className="text-tiny text-white/60 uppercase font-bold">
                            Creator
                        </p>
                        <h4 className="text-white font-medium text-large">
                            Upload music you want to share with the community
                        </h4>
                    </CardHeader>
                    <Link href="/creator" className="w-full h-full">
                        <Image
                            removeWrapper
                            alt="Card background"
                            className="z-0 w-full h-full object-cover hover:scale-125 duration-700 cursor-pointer"
                            src="/img5.jpg"
                        />
                    </Link>
                </Card>
            </div>
        </div>
    )
}
