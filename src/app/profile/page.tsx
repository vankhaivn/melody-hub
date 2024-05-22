"use client"
import { change_fullname, get_user_information } from "@/api/account"
import { Avatar, Button, Input, Spinner, Tooltip } from "@nextui-org/react"
import { Switch, cn } from "@nextui-org/react"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import useSWR, { mutate } from "swr"

export default function ProfilePage() {
    const userInfoFetcher = () => get_user_information()
    const {
        data: userInfo,
        error: userInfoError,
        isValidating: isUserInfoValidating,
    } = useSWR<IAccount | null>("userInfo", userInfoFetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    })

    const [avatarUrl, setAvatarUrl] = useState(
        "https://i.pravatar.cc/150?u=a042581f4e29026024d"
    )
    const [fullname, setFullname] = useState("")
    const [role, setRole] = useState("user")
    const [isSelected, setIsSelected] = useState(false)
    const email = userInfo?.email || ""

    const [isChangeFullnameLoading, setIsChangeFullnameLoading] =
        useState(false)

    useEffect(() => {
        console.log("userInfo", userInfo)

        if (userInfo) {
            setFullname(userInfo.fullname)
            setAvatarUrl(userInfo.avatar)
            setRole(userInfo.role)
            setIsSelected(userInfo.role === "creator")
        }
    }, [userInfo])

    if (isUserInfoValidating) {
        return (
            <div className="py-6 px-48">
                <Spinner />
            </div>
        )
    }

    if (userInfoError) {
        return <div>Failed to load</div>
    }

    const handleChangeFullname = async () => {
        if (!fullname) {
            toast.warning("Fullname is required!")
            return
        }

        try {
            setIsChangeFullnameLoading(true)
            const response = await change_fullname(fullname)
            if (response) {
                toast.success("Fullname has been updated!")
                mutate("userInfo")
            } else {
                toast.error("Failed to update fullname!")
            }
        } catch (error) {
            console.error("Error:", error)
            toast.error("Failed to update fullname!")
        } finally {
            setIsChangeFullnameLoading(false)
        }
    }

    const handleChangeRole = (isCreator: boolean) => {
        setIsSelected(isCreator)
        const newRole = isCreator ? "creator" : "user"
        setRole(newRole)
    }

    return (
        <div className="py-6 px-48">
            <div className="bg-content1 h-full px-6 py-8 rounded-xl">
                <h1 className="text-3xl font-bold mb-6">Account Details</h1>
                <div className="flex gap-x-4 items-center">
                    <Avatar isBordered src={avatarUrl} className="w-16 h-16" />
                    <div>
                        <h2 className="text-xl font-bold">
                            {userInfo?.fullname}
                        </h2>
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
                    <div className="flex gap-x-6 items-center">
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
                            size="lg"
                            className="font-bold text-large"
                            isLoading={isChangeFullnameLoading}
                            onClick={() => handleChangeFullname()}
                            color="success"
                            variant="flat"
                        >
                            Save
                        </Button>
                    </div>
                    <div className="mt-8">
                        <div className="mb-4">
                            <h2 className="text-2xl font-bold mt-6">
                                Change Role
                            </h2>
                            <p className="text-lg text-foreground-500 font-semibold">
                                Change your role to access different features.{" "}
                            </p>
                        </div>
                        <div className="flex bg-content2 w-2/3 p-4 justify-between rounded-lg cursor-pointer">
                            <div className="flex flex-col gap-1">
                                <p className="text-large font-semibold">
                                    Current Role:{" "}
                                    <span className="uppercase font-bold">
                                        {role}
                                    </span>
                                </p>
                                <p className="text-medium text-default-500 font-semibold">
                                    Wanna upload your own tracks? Change your
                                    role
                                </p>
                            </div>
                            <Switch
                                isSelected={isSelected}
                                onChange={(e) =>
                                    handleChangeRole(e.target.checked)
                                }
                                size="lg"
                                color="success"
                            ></Switch>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
