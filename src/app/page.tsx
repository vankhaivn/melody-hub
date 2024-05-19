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
import { useMusicPlayer } from "@/components/MusicPlayer/MusicPlayerContext"
import { get_all_artists } from "@/api/artists"

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
                    <Button radius="full" size="sm">
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
                            What to watch
                        </p>
                        <h4 className="text-white font-medium text-large">
                            Stream the Acme event
                        </h4>
                    </CardHeader>
                    <Image
                        removeWrapper
                        alt="Card background"
                        className="z-0 w-full h-full object-cover hover:scale-125 duration-700 cursor-pointer"
                        src="https://nextui.org/images/card-example-4.jpeg"
                    />
                </Card>
                <Card className="col-span-12 sm:col-span-4 h-[300px]">
                    <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                        <p className="text-tiny text-white/60 uppercase font-bold">
                            Plant a tree
                        </p>
                        <h4 className="text-white font-medium text-large">
                            Contribute to the planet
                        </h4>
                    </CardHeader>
                    <Image
                        removeWrapper
                        alt="Card background"
                        className="z-0 w-full h-full object-cover hover:scale-125 duration-700 cursor-pointer"
                        src="https://nextui.org/images/card-example-3.jpeg"
                    />
                </Card>
                <Card className="col-span-12 sm:col-span-4 h-[300px]">
                    <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                        <p className="text-tiny text-white/60 uppercase font-bold">
                            Supercharged
                        </p>
                        <h4 className="text-white font-medium text-large">
                            Creates beauty like a beast
                        </h4>
                    </CardHeader>
                    <Image
                        removeWrapper
                        alt="Card background"
                        className="z-0 w-full h-full object-cover hover:scale-125 duration-700 cursor-pointer"
                        src="https://nextui.org/images/card-example-2.jpeg"
                    />
                </Card>
                <Card className="col-span-12 sm:col-span-7 h-[300px]">
                    <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                        <p className="text-tiny text-white/60 uppercase font-bold">
                            Supercharged
                        </p>
                        <h4 className="text-white font-medium text-large">
                            Creates beauty like a beast
                        </h4>
                    </CardHeader>
                    <Image
                        removeWrapper
                        alt="Card background"
                        className="z-0 w-full h-full object-cover hover:scale-125 duration-700 cursor-pointer"
                        src="https://nextui.org/images/card-example-2.jpeg"
                    />
                </Card>
                <Card className="col-span-12 sm:col-span-5 h-[300px]">
                    <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                        <p className="text-tiny text-white/60 uppercase font-bold">
                            Supercharged
                        </p>
                        <h4 className="text-white font-medium text-large">
                            Creates beauty like a beast
                        </h4>
                    </CardHeader>
                    <Image
                        removeWrapper
                        alt="Card background"
                        className="z-0 w-full h-full object-cover hover:scale-125 duration-700 cursor-pointer"
                        src="https://nextui.org/images/card-example-3.jpeg"
                    />
                </Card>
            </div>
        </div>
    )
}
