import useRouteElements from "./useRouterElement"
import { ToastContainer } from "react-toastify"
import LoadingPage from "./components/LoadingPage"
import { useContext, useEffect } from "react"
import { AppContext } from "./contexts/app.context"
import axios from "axios"
export default function App() {

  const loadingPage = useContext(AppContext)
  const routeElements = useRouteElements()
  // const email = localStorage.getItem('email');
  // const password = localStorage.getItem('password');
  // const { setIsAuthenticated, setProfile } = useContext(AppContext);

  // const login = async ()=>{
  //   const response = await axios.post(
  //     "http://localhost:8080/api/v1/auth/login",
  //     {
  //       email,
  //       password,
  //     }
  //   );
  //   setIsAuthenticated(true);
  //   setProfile({
  //     _id: response.data.id,
  //     name: `${response.data.firstName} ${response.data.lastName}`,
  //     email: response.data.email,
  //     role: response.data.roles[0]?.id || 0,
  //     jwtToken: response.data.jwtToken
  //   });
  // }
  // useEffect(()=>{
  //   login();
  // },[])

  return (
    <div className='flex flex-col justify-between h-full min-h-full text-darkText bg-mainBg' style={{minHeight: 'inherit'}}>
      {routeElements}
      <ToastContainer limit={3} />
      {!loadingPage && <LoadingPage />}
    </div>
  )
}

