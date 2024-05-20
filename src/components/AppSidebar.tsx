"use client"
import {
    AcmeLogo,
    AlbumIcon,
    HomeIcon,
    MusicIcon,
    LogOutIcon,
    LogInIcon,
    MailIcon,
    LockIcon,
} from "@/components/icons"
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

import Cookies from "js-cookie"
import { useState, useEffect } from "react"
import Link from "next/link"
import { registerValidation, loginValidation } from "@/utils/valid"
import { toast } from "react-toastify"

import { register, login } from "@/api/auth"
import { isLogin as checkLogin } from "@/utils/auth"

export default function AppSidebar() {
    const currentPath = usePathname()
    const getLinkClassName = (path: string) => {
        return `flex items-center py-3 px-4 ${
            currentPath === path ? "bg-zinc-800" : "hover:bg-zinc-800"
        } transition-colors duration-600 cursor-pointer rounded-2xl`
    }

    const logout = () => {
        Cookies.remove("token")
        window.location.reload()
    }

    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        setIsLoggedIn(checkLogin())
    }, [])

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
                    <li>
                        <Link
                            href="/playlist"
                            className={getLinkClassName("/playlist")}
                        >
                            <AlbumIcon />
                            <p className="text-xl ml-3 font-semibold">
                                My Playlist
                            </p>
                        </Link>
                    </li>
                </ul>
                <ul className="px-4 py-4 gap-y-2 flex flex-col">
                    <Divider className="mb-2" />
                    {isLoggedIn ? (
                        <li
                            className="flex items-center py-3 px-4 hover:bg-zinc-800 transition-colors duration-600 cursor-pointer rounded-2xl"
                            onClick={logout}
                        >
                            <LogOutIcon />
                            <p className="text-xl ml-3 font-semibold">
                                Log Out
                            </p>
                        </li>
                    ) : (
                        <li
                            className="flex items-center py-3 px-4 hover:bg-zinc-800 transition-colors duration-600 cursor-pointer rounded-2xl"
                            onClick={onOpen}
                        >
                            <LogInIcon />
                            <p className="text-xl ml-3 font-semibold">Log In</p>
                        </li>
                    )}
                </ul>
            </div>
            <LoginModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                setIsLoggedIn={setIsLoggedIn}
            />
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
    setIsLoggedIn,
}: {
    isOpen: any
    onOpenChange: any
    setIsLoggedIn: any
}) => {
    const [modalMode, setModalMode] = useState<"login" | "register">("login")
    const [email, setEmail] = useState("")
    const [fullname, setFullname] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const registerSubmit = async (
        email: string,
        fullname: string,
        password: string,
        confirmPassword: string
    ) => {
        if (registerValidation(email, fullname, password, confirmPassword)) {
            try {
                setIsLoading(true)
                const response = await register(email, fullname, password)
                if (response) {
                    toast.success("Register successfully!")
                    onOpenChange()
                    setModalMode("login")
                }
            } catch (error) {
                toast.error("Register failed!")
                return null
            } finally {
                setIsLoading(false)
            }
        }
    }

    const loginSubmit = async (email: string, password: string) => {
        if (loginValidation(email, password)) {
            try {
                setIsLoading(true)
                const response = await login(email, password)
                if (response) {
                    toast.success("Login successfully!")
                    setIsLoggedIn(checkLogin())
                    onOpenChange()
                }
            } catch (error) {
                toast.error("Login failed!")
                return null
            } finally {
                setIsLoading(false)
            }
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            hideCloseButton
            placement="top-center"
            backdrop="blur"
            size="lg"
            className="py-2"
        >
            {modalMode === "login" ? (
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex justify-between">
                                <div className="text-2xl font-bold">Log in</div>
                                <div
                                    onClick={() => setModalMode("register")}
                                    className="text-primary font-bold text-xl cursor-pointer"
                                >
                                    Register
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                <Input
                                    autoFocus
                                    endContent={
                                        <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                    }
                                    label="Email"
                                    variant="bordered"
                                    size="lg"
                                    className="mb-2"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Input
                                    endContent={
                                        <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                    }
                                    label="Password"
                                    type="password"
                                    variant="bordered"
                                    size="lg"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
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
                                <Button
                                    color="primary"
                                    onPress={() => loginSubmit(email, password)}
                                    isLoading={isLoading}
                                >
                                    Sign in
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            ) : (
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex justify-between">
                                <div className="text-2xl font-bold">
                                    Register
                                </div>
                                <div
                                    onClick={() => setModalMode("login")}
                                    className="text-primary font-bold text-xl cursor-pointer"
                                >
                                    Login
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                <Input
                                    autoFocus
                                    endContent={
                                        <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                    }
                                    label="Email"
                                    variant="bordered"
                                    size="lg"
                                    className="mb-2"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Input
                                    autoFocus
                                    endContent={
                                        <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                    }
                                    label="Fullname"
                                    variant="bordered"
                                    size="lg"
                                    className="mb-2"
                                    type="string"
                                    value={fullname}
                                    onChange={(e) =>
                                        setFullname(e.target.value)
                                    }
                                />
                                <Input
                                    endContent={
                                        <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                    }
                                    label="Password"
                                    type="password"
                                    variant="bordered"
                                    size="lg"
                                    className="mb-2"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                                <Input
                                    endContent={
                                        <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                    }
                                    label="Confirm Password"
                                    type="password"
                                    variant="bordered"
                                    size="lg"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="flat"
                                    onPress={onClose}
                                >
                                    Close
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={() =>
                                        registerSubmit(
                                            email,
                                            fullname,
                                            password,
                                            confirmPassword
                                        )
                                    }
                                    isLoading={isLoading}
                                >
                                    Register
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            )}
        </Modal>
    )
}
