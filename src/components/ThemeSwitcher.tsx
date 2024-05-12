"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
} from "@nextui-org/react"
export default function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => setMounted(true), [])

    if (!mounted) return null

    return (
        <Dropdown backdrop="blur">
            <DropdownTrigger>
                <Button variant="ghost" color="primary">
                    Change Theme
                </Button>
            </DropdownTrigger>
            <DropdownMenu variant="faded" aria-label="Static Actions">
                <DropdownItem onClick={() => setTheme("light")}>
                    Light
                </DropdownItem>
                <DropdownItem onClick={() => setTheme("dark")}>
                    Dark
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
}
