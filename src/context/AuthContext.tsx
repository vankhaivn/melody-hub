import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react"
import Cookies from "js-cookie"
import { validateToken, validateCreator } from "@/api/auth"

interface AuthContextType {
    isLoggedIn: boolean | null
    loginContext: () => void
    logoutContext: () => void
    isCreator: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
    const [isCreator, setIsCreator] = useState<boolean>(false)

    useEffect(() => {
        const checkAuth = async () => {
            const isValidToken = await validateToken()
            setIsLoggedIn(!!isValidToken)
            if (isValidToken) {
                const isValidCreator = await validateCreator()
                setIsCreator(!!isValidCreator)
            } else {
                Cookies.remove("token")
            }
        }

        checkAuth()
    }, [])

    const loginContext = () => {
        setIsLoggedIn(true)
        window.location.reload()
    }

    const logoutContext = () => {
        Cookies.remove("token")
        setIsLoggedIn(false)
        window.location.reload()
    }

    return (
        <AuthContext.Provider
            value={{ isLoggedIn, loginContext, logoutContext, isCreator }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
