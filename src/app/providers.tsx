"use client"
import * as React from "react"
import { NextUIProvider } from "@nextui-org/react"
import { ThemeProvider } from "next-themes"
import { MusicPlayerProvider } from "@/context/MusicPlayerContext"
import { AuthProvider } from "@/context/AuthContext"

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <MusicPlayerProvider>
                <NextUIProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        themes={["light", "dark"]}
                    >
                        {children}
                    </ThemeProvider>
                </NextUIProvider>
            </MusicPlayerProvider>
        </AuthProvider>
    )
}
