"use client"
import { Avatar, Button, Input, Tooltip } from "@nextui-org/react"
import { mutate } from "swr"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"

export default function ProfilePage() {
    const getUserInfo = () => {
        const userInfo = Cookies.get("user_info")
        if (userInfo) {
            return JSON.parse(userInfo)
        }
        return null
    }

    const userInfo = getUserInfo()
    const [email, setEmail] = useState(userInfo ? userInfo.email : "")
    const [fullname, setFullname] = useState(userInfo ? userInfo.fullname : "")

    useEffect(() => {
        const userInfo = getUserInfo()
        if (userInfo) {
            setEmail(userInfo.email)
            setFullname(userInfo.fullname)
        }
    }, [])

    return (
        <div className="py-6 px-48">
            <div className="bg-content1 h-80 px-6 py-8 rounded-xl">
                <h1 className="text-3xl font-bold mb-6">Account Details</h1>
                <div className="flex gap-x-4 items-center">
                    <Avatar
                        isBordered
                        src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                        className="w-16 h-16"
                    />
                    <div>
                        <h2 className="text-xl font-bold">{fullname}</h2>
                        <p className="text-lg text-foreground-500 font-semibold">
                            {email}
                        </p>
                    </div>
                </div>
                <div className="mt-4 text-lg text-foreground-500">
                    The photo will be used for your profile, and will be visible
                    to other users of the platform.
                </div>
                <div className="mt-4">
                    <div className="flex gap-x-6">
                        <Tooltip
                            content="You can't change your email!"
                            color="danger"
                            placement="top-end"
                            size="lg"
                        >
                            <Input
                                type="email"
                                label="Email"
                                value={email}
                                disabled
                                size="lg"
                            />
                        </Tooltip>
                        <Input
                            label="Fullname"
                            value={fullname}
                            size="lg"
                            onChange={(e) => setFullname(e.target.value)}
                        />
                        <Button
                            onClick={() => {
                                mutate("userInfo")
                            }}
                        >
                            Fetch
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
