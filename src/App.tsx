import useRouteElements from "./useRouterElement"
import { ToastContainer } from "react-toastify"
import LoadingPage from "./components/LoadingPage"
import { useContext } from "react"
import { AppContext } from "./contexts/app.context"
export default function App() {

  const loadingPage = useContext(AppContext)
  const routeElements = useRouteElements()
  return (
    <div className='flex flex-col justify-between h-full min-h-full text-darkText bg-mainBg' style={{minHeight: 'inherit'}}>
      {routeElements}
      <ToastContainer limit={3} />
      {!loadingPage && <LoadingPage />}
    </div>
  )
}

