import { User } from "../types/user.type"
import { createContext, useEffect, useState } from "react"
// interface PrintConfig{
//     pagesize:number
// }

interface AppContextInterface {
    isAuthenticated: boolean
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
    loadingPage: boolean
    setLoadingPage: React.Dispatch<React.SetStateAction<boolean>>
    profile: User | null
    setProfile: React.Dispatch<React.SetStateAction<User | null>>
    handleLogout: () => void
    // printConfig: PrintConfig
    // setPrintConfig: ()=>void
}

const initialAppContext: AppContextInterface = {
    isAuthenticated: Boolean(false),
    setIsAuthenticated: () => null,
    loadingPage: false,
    setLoadingPage: () => null,
    profile: null,
    setProfile: () => null,
    handleLogout: () => null,
    // printConfig: {pagesize:1},
    // setPrintConfig: () => null,
}

export const AppContext = createContext<AppContextInterface>(initialAppContext)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [loadingPage, setLoadingPage] = useState<boolean>(false)
    const [profile, setProfile] = useState<User | null>(null)
    // const [printConfig, setPrintConfig] = useState<PrintConfig | null>(null)
  
    const handleLogout = () => {
      setIsAuthenticated(false);
      setProfile(null);
      localStorage.removeItem("userProfile");
      localStorage.removeItem("jwtToken");
    };


    useEffect(() => {
      const storedProfile = localStorage.getItem("userProfile");
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile);
        setProfile(parsedProfile);
        setIsAuthenticated(true);
      }
      setLoadingPage(false);
    }, []);


  
    return (
      <AppContext.Provider
        value={{
          isAuthenticated,
          setIsAuthenticated,
          loadingPage,
          setLoadingPage,
          profile,
          setProfile,
          handleLogout,
        }}
      >
        {children}
      </AppContext.Provider>
    )
  }

