import { User } from "../types/user.type"
import { createContext } from "react"

interface AppContextInterface {
    isAuthenticated: boolean
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
    loadingPage: boolean
    setLoadingPage: React.Dispatch<React.SetStateAction<boolean>>
    profile: User | null
    setProfile: React.Dispatch<React.SetStateAction<User | null>>
    handleLogout: () => void
}


const initialAppContext: AppContextInterface = {
    isAuthenticated: Boolean(false),
    setIsAuthenticated: () => null,
    loadingPage: false,
    setLoadingPage: () => null,
    profile: null,
    setProfile: () => null,
    handleLogout: () => null
}

export const AppContext = createContext<AppContextInterface>(initialAppContext)



