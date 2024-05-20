import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react"
import Cookies from "js-cookie"
import { toast } from "react-toastify"
import { validateToken } from "@/api/auth"

interface AuthContextType {
    isLoggedIn: boolean | null
    loginContext: (token: string) => void
    logoutContext: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

    useEffect(() => {
        const checkToken = async () => {
            const isValid = await validateToken()
            setIsLoggedIn(!!isValid)
            if (!isValid) {
                Cookies.remove("token")
            }
        }

        checkToken()
    }, [])

    const loginContext = () => {
        setIsLoggedIn(true)
    }

    const logoutContext = () => {
        Cookies.remove("token")
        setIsLoggedIn(false)
        toast.success("Logout successfully")
    }

    return (
        <AuthContext.Provider
            value={{ isLoggedIn, loginContext, logoutContext }}
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
