"use client"
import {
    change_fullname,
    change_password,
    change_role,
    get_user_information,
    change_avatar,
} from "@/api/account"
import { useAuth } from "@/context/AuthContext"
import { updatePasswordValidation } from "@/utils/valid"
import { Avatar, Button, Input, Spinner, Tooltip } from "@nextui-org/react"
import { Switch } from "@nextui-org/react"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import useSWR, { mutate } from "swr"

export default function ProfilePage() {
    const { isLoggedIn, logoutContext } = useAuth()

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

    const [fullname, setFullname] = useState("")
    const [isSelected, setIsSelected] = useState(false)
    const email = userInfo?.email || ""
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [isChangeFullnameLoading, setIsChangeFullnameLoading] =
        useState(false)
    const [isChangeRoleLoading, setIsChangeRoleLoading] = useState(false)
    const [isChangePasswordLoading, setIsChangePasswordLoading] =
        useState(false)
    const [isChangeAvatarLoading, setIsChangeAvatarLoading] = useState(false)

    useEffect(() => {
        if (userInfo) {
            setFullname(userInfo.fullname)
            setIsSelected(userInfo.role === "creator")
        }
    }, [userInfo])

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

    const handleChangeRole = async (isCreator: boolean) => {
        if (!window.confirm("Are you sure you want to change your role?")) {
            return
        }
        try {
            setIsChangeRoleLoading(true)
            const newRole = isCreator ? "creator" : "user"
            const response = await change_role(newRole)
            if (response) {
                setIsSelected(isCreator)
                logoutContext()
            }
        } catch (error) {
            console.error("Error:", error)
            toast.error("Failed to change role!")
        } finally {
            setIsChangeRoleLoading(false)
        }
    }

    const handleChangePassword = async () => {
        if (
            !updatePasswordValidation(oldPassword, newPassword, confirmPassword)
        ) {
            return
        }
        try {
            setIsChangePasswordLoading(true)
            const response = await change_password({
                new_password: newPassword,
                old_password: oldPassword,
            })
            if (response) {
                toast.success("Password has been updated!")
            } else {
                toast.error("Old password is incorrect!")
            }
        } catch (error) {
            console.error("Error:", error)
            toast.error("Failed to update password!")
        } finally {
            setIsChangePasswordLoading(false)
            setOldPassword("")
            setNewPassword("")
            setConfirmPassword("")
        }
    }

    const handleChangeAvatar = async (event: any) => {
        const file = event.target.files[0]
        if (!file) {
            toast.warning("Please select an image file!")
            return
        }
        try {
            setIsChangeAvatarLoading(true)
            const response = await change_avatar(file)
            if (response) {
                toast.success("Avatar has been updated!")
                mutate("userInfo")
                mutate("userBasicInfo")
            } else {
                toast.error("Failed to update avatar!")
            }
        } catch (error) {
            console.error("Error:", error)
            toast.error("Failed to update avatar!")
        } finally {
            setIsChangeAvatarLoading(false)
        }
    }

    if (!isLoggedIn) {
        return (
            <div className="py-6 px-48">
                <h1 className="text-danger-500 text-4xl font-bold">
                    Access Denied
                </h1>
                <h1 className="text-danger-500 text-2xl font-semibold">
                    Please login to use this features
                </h1>
            </div>
        )
    }

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

    return (
        <div className="py-6 px-40">
            <div className="bg-content1 h-full px-6 py-8 rounded-xl">
                <h1 className="text-3xl font-bold mb-6">Account Details</h1>
                <div className="flex gap-x-4 items-center">
                    <label className="cursor-pointer">
                        {isChangeAvatarLoading ? (
                            <Spinner className="border-2 border-gray-700 w-16 h-16 rounded-full" />
                        ) : (
                            <Avatar
                                isBordered
                                src={userInfo?.avatar_image}
                                className="w-16 h-16"
                            />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleChangeAvatar}
                            style={{ display: "none" }}
                        />
                    </label>
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
                    <Tooltip
                        content="You will be logged out when you change your role."
                        size="lg"
                        color="danger"
                    >
                        <div className="mt-8 flex gap-x-2 justify-between items-center">
                            <div
                                className={`relative transition-colors flex bg-content2 p-4 justify-between rounded-lg cursor-pointer border-2  ${
                                    isSelected
                                        ? "border-success"
                                        : "border-transparent"
                                }`}
                            >
                                <div className="flex flex-col gap-1">
                                    <p className="text-large font-semibold">
                                        Current Role:{" "}
                                        <span className="uppercase font-bold">
                                            {userInfo?.role}
                                        </span>
                                    </p>
                                    <p className="text-medium text-default-500 font-semibold">
                                        Wanna upload your own tracks? Change
                                        your role
                                    </p>
                                </div>
                                <Switch
                                    className="ml-4"
                                    isSelected={isSelected}
                                    onChange={(e) =>
                                        handleChangeRole(e.target.checked)
                                    }
                                    size="lg"
                                    color="success"
                                ></Switch>
                                {isChangeRoleLoading && (
                                    <Spinner className="absolute" />
                                )}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">
                                    Change Role
                                </h2>
                                <p className="text-lg text-foreground-500 font-semibold">
                                    Change your role to access different
                                    features.{" "}
                                </p>
                            </div>
                        </div>
                    </Tooltip>
                    <div className="mt-12">
                        <div className="mb-4">
                            <h2 className="text-2xl font-bold mt-6">
                                Update Password
                            </h2>
                            <p className="text-lg text-foreground-500 font-semibold">
                                Change your password to keep your account
                                secure.
                            </p>
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <Input
                                type="password"
                                label="Old Password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                size="lg"
                                className="w-1/2"
                            />
                            <Input
                                type="password"
                                label="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                size="lg"
                                className="w-1/2"
                            />
                            <div className="flex items-end">
                                <Input
                                    type="password"
                                    label="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    size="lg"
                                    className="w-1/2"
                                />
                                <Button
                                    color="success"
                                    variant="flat"
                                    size="lg"
                                    className="font-bold text-large ml-4"
                                    onClick={() => handleChangePassword()}
                                    isLoading={isChangePasswordLoading}
                                >
                                    Save
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
