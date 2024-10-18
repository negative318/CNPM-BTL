import {Navigate, Outlet, useRoutes} from 'react-router-dom'
import mainPath from './constants/path'
import MainLayout from './layouts/MainLayouts/MainLayouts'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import LoadingPage from './components/LoadingPage'
import { Suspense, useContext } from 'react'
import { AppContext } from './contexts/app.context'



function RejectedRoute() {
    const { isAuthenticated } = useContext(AppContext)
    return !isAuthenticated ? (
      <Suspense fallback={<LoadingPage />}>
        <Outlet />
      </Suspense>
    ) : (
      <Navigate to={mainPath.home} />
    )
  }



export default function useRouteElements(){
    const routeElements = useRoutes([
        {
            index: true,
            path: mainPath.home,
            element: (
                <MainLayout>
                    <HomePage />
                </MainLayout>
            )
        },
        {
            path: '',
            element: <RejectedRoute />,
            children: [{ path: mainPath.login, element: <LoginPage /> }]
          },
    ])

    return routeElements
}