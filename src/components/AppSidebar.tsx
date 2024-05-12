import { AcmeLogo } from "@/components/icons/AcmeLogo"

export default function AppSidebar() {
    return (
        <div className="w-full h-[100vh] border-r-small border-divider pt-2">
            <Logo />
        </div>
    )
}

const Logo = () => (
    <div className="flex items-center ml-8">
        <AcmeLogo size={60} />
        <p className="hidden sm:block font-bold text-inherit text-xl">
            <span style={{ color: "var(--primary)" }}>MELODY</span> HUB
        </p>
    </div>
)
