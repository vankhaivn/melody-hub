import { AcmeLogo } from "@/components/icons/AcmeLogo"
import { AlbumIcon } from "@/components/icons/AlbumIcon"
import { HomeIcon } from "@/components/icons/HomeIcon"
import { MusicIcon } from "@/components/icons/MusicIcon"
export default function AppSidebar() {
    return (
        <div className="fixed h-full w-1/5 border-r-small border-divider pt-2 top-0 left-0">
            <Logo />
            <ul className="px-6 py-4">
                <li className="flex items-center py-3 px-4 hover:bg-success-300 transition-colors duration-600 cursor-pointer rounded-xl">
                    <HomeIcon />
                    <p className="text-xl ml-3 font-semibold">Home</p>
                </li>
                <li className="flex items-center py-3 px-4 hover:bg-success-300 transition-colors duration-600 cursor-pointer rounded-xl">
                    <AlbumIcon />
                    <p className="text-xl ml-3 font-semibold">Album</p>
                </li>
                <li className="flex items-center py-3 px-4 hover:bg-success-300 transition-colors duration-600 cursor-pointer rounded-xl">
                    <MusicIcon />
                    <p className="text-xl ml-3 font-semibold">Music</p>
                </li>
            </ul>
        </div>
    )
}
const Logo = () => (
    <div className="flex items-center ml-8 cursor-pointer">
        <AcmeLogo size={60} />
        <p className="hidden sm:block font-bold text-inherit text-xl">
            <span style={{ color: "var(--primary)" }}>MELODY</span> HUB
        </p>
    </div>
)
