"use client"
import { AcmeLogo } from "@/components/icons/AcmeLogo"
import { AlbumIcon } from "@/components/icons/AlbumIcon"
import { HomeIcon } from "@/components/icons/HomeIcon"
import { MusicIcon } from "@/components/icons/MusicIcon"
import { LogOutIcon } from "@/components/icons/LogOutIcon"
import { LogInIcon } from "@/components/icons/LogInIcon"
import { MailIcon } from "@/components/icons/MailIcon"
import { LockIcon } from "@/components/icons/LockIcon"
import { usePathname } from "next/navigation"
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Checkbox,
    Input,
    Divider,
} from "@nextui-org/react"

import Link from "next/link"

export default function AppSidebar() {
    const currentPath = usePathname()
    const getLinkClassName = (path: string) => {
        return `flex items-center py-3 px-4 ${
            currentPath === path ? "bg-zinc-800" : "hover:bg-zinc-800"
        } transition-colors duration-600 cursor-pointer rounded-2xl`
    }

    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    return (
        <div className="fixed h-full w-1/6 border-r-small border-divider pt-2 top-0 left-0 flex flex-col justify-between">
            <Logo />
            <div className="flex flex-col justify-between h-full">
                <ul className="px-4 py-4 gap-y-2 flex flex-col">
                    <li>
                        <Link href="/" className={getLinkClassName("/")}>
                            <HomeIcon />
                            <p className="text-xl ml-3 font-semibold">Home</p>
                        </Link>
                    </li>
                    <li className="flex items-center py-3 px-4 hover:bg-zinc-800 transition-colors duration-600 cursor-pointer rounded-2xl">
                        <AlbumIcon />
                        <p className="text-xl ml-3 font-semibold">Album</p>
                    </li>
                    <li>
                        <Link
                            href="/track"
                            className={getLinkClassName("/track")}
                        >
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
                <ul className="px-4 py-4 gap-y-2 flex flex-col">
                    <Divider className="mb-2" />
                    <li className="flex items-center py-3 px-4 hover:bg-zinc-800 transition-colors duration-600 cursor-pointer rounded-2xl">
                        <LogOutIcon />
                        <p className="text-xl ml-3 font-semibold">Log Out</p>
                    </li>
                    <li
                        className="flex items-center py-3 px-4 hover:bg-zinc-800 transition-colors duration-600 cursor-pointer rounded-2xl"
                        onClick={onOpen}
                    >
                        <LogInIcon />
                        <p className="text-xl ml-3 font-semibold">Log In</p>
                    </li>
                </ul>
            </div>
            <LoginModal isOpen={isOpen} onOpenChange={onOpenChange} />
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

const LoginModal = ({
    isOpen,
    onOpenChange,
}: {
    isOpen: any
    onOpenChange: any
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="top-center"
            backdrop="blur"
            size="lg"
            className="py-2"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="text-2xl font-bold">
                            Log in
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                autoFocus
                                endContent={
                                    <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                }
                                label="Email"
                                placeholder="Enter your email"
                                variant="bordered"
                                size="lg"
                                className="mb-2"
                            />
                            <Input
                                endContent={
                                    <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                }
                                label="Password"
                                placeholder="Enter your password"
                                type="password"
                                variant="bordered"
                                size="lg"
                            />
                            <div className="flex py-2 px-1 justify-between">
                                <Checkbox
                                    classNames={{
                                        label: "text-small",
                                    }}
                                >
                                    Remember me
                                </Checkbox>
                                <Link
                                    href="#"
                                    className="text-primary font-bold"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="flat"
                                onPress={onClose}
                            >
                                Close
                            </Button>
                            <Button color="primary" onPress={onClose}>
                                Sign in
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
