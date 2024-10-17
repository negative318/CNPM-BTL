import {useRoutes} from 'react-router-dom'
import mainPath from './constants/path'
import MainLayout from './layouts/MainLayouts/MainLayouts'
import HomePage from './pages/HomePage'
import Wallet from './pages/Wallet'

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
            index: true,
            path: mainPath.wallet,
            element: (
                <MainLayout>
                    <Wallet />
                </MainLayout>
            )
        },
    ])

    return routeElements
}