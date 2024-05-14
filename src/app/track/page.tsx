import { Divider, Avatar } from "@nextui-org/react"
import { PlayIcon } from "@/components/icons/PlayIcon"
export default function TrackPage() {
    return (
        <div className="p-4">
            <div className="space-y-1 mb-4">
                <h1 className="text-2xl font-bold">Shuffle Time!</h1>
                <p className="text-large text-default-400">
                    Dive into a sonic adventure – every listen is a surprise.
                </p>
            </div>
            <Divider />

            {renderTracks()}
        </div>
    )
}

const renderTracks = () => {
    const tracks = new Array(6).fill(null)
    return (
        <div className="grid grid-cols-6">
            {tracks.map((_, index) => (
                <div
                    key={index}
                    className="flex flex-col justify-center items-center p-4 cursor-pointer rounded-lg hover:bg-zinc-900 duration-500 relative group"
                >
                    <div className="relative">
                        <Avatar
                            radius="sm"
                            src="https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg"
                            className="w-40 h-40 hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute bottom-0 -right-4 translate-y-8 opacity-0 group-hover:opacity-100 group-hover:translate-y-4 transition-all duration-500 ease-out">
                            <PlayIcon color="var(--primary)" size={48} />
                        </div>
                    </div>
                    <div className="w-full mt-2 px-2">
                        <p className="text-medium font-semibold">Name</p>
                        <p className="text-default-400">Author</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
