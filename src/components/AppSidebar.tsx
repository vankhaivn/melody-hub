"use client"
import { AcmeLogo } from "@/components/icons/AcmeLogo"
import { AlbumIcon } from "@/components/icons/AlbumIcon"
import { HomeIcon } from "@/components/icons/HomeIcon"
import { MusicIcon } from "@/components/icons/MusicIcon"
import { usePathname } from "next/navigation"
import Link from "next/link"

export default function AppSidebar() {
    const currentPath = usePathname()
    const getLinkClassName = (path: string) => {
        return `flex items-center py-3 px-4 ${
            currentPath === path ? "bg-success-300" : "hover:bg-success-300"
        } transition-colors duration-600 cursor-pointer rounded-xl`
    }
    return (
        <div className="fixed h-full w-1/6 border-r-small border-divider pt-2 top-0 left-0">
            <Logo />
            <ul className="px-4 py-4 gap-y-2 flex flex-col">
                <li>
                    <Link href="/" className={getLinkClassName("/")}>
                        <HomeIcon />
                        <p className="text-xl ml-3 font-semibold">Home</p>
                    </Link>
                </li>
                <li className="flex items-center py-3 px-4 hover:bg-success-300 transition-colors duration-600 cursor-pointer rounded-xl">
                    <AlbumIcon />
                    <p className="text-xl ml-3 font-semibold">Album</p>
                </li>
                <li>
                    <Link href="/track" className={getLinkClassName("/track")}>
                        <MusicIcon />
                        <p className="text-xl ml-3 font-semibold">Track</p>
                    </Link>
                </li>
                <li>
                    <Link
                        href="/artist"
                        className={getLinkClassName("/artist")}
                    >
                        <MusicIcon />
                        <p className="text-xl ml-3 font-semibold">Artist</p>
                    </Link>
                </li>
            </ul>
        </div>
    )
}
const Logo = () => (
    <Link href="/" className="flex items-center ml-6 cursor-pointer">
        <AcmeLogo size={60} />
        <p className="hidden sm:block font-bold text-inherit text-xl">
            <span style={{ color: "var(--primary)" }}>MELODY</span> HUB
        </p>
    </Link>
)
