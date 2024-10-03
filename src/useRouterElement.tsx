import {useRoutes} from 'react-router-dom'
import mainPath from './constants/path'
import MainLayout from './layouts/MainLayouts/MainLayouts'
import HomePage from './pages/HomePage'

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
    ])

    return routeElements
}