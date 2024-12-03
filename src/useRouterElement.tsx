import {useRoutes} from 'react-router-dom'
import mainPath from './constants/path'
import MainLayout from './layouts/MainLayouts/MainLayouts'
import HomePage from './pages/HomePage'
import Wallet from './pages/Wallet'

import { ModifyPrinter } from './pages/SPSO/Modify_printer'
import { PrinterManagement } from './pages/SPSO/PrinterManagement'
import { PrintingHistory } from './pages/SPSO/PrintingHistory'

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
        {
            index: true,
            path: mainPath.modifyPrinter,
            element: (
                <MainLayout>
                    <ModifyPrinter />
                </MainLayout>
            )
        },
        {
            index: true,
            path: mainPath.printerManagement,
            element: (
                <MainLayout>
                    <PrinterManagement />
                </MainLayout>
            )
        },
        {
            index: true,
            path: mainPath.printingHistory,
            element: (
                <MainLayout>
                    <PrintingHistory />
                </MainLayout>
            )
        },
    ])

    return routeElements
}