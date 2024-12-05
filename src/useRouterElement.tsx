import {Navigate, Outlet, useRoutes} from 'react-router-dom'
import mainPath from './constants/path'
import MainLayout from './layouts/MainLayouts/MainLayouts'
import HomePage from './pages/HomePage'
import Wallet from './pages/Wallet'
import { ModifyPrinter } from './pages/SPSO/Modify_printer'
import { PrinterManagement } from './pages/SPSO/PrinterManagement'
import { PrintingHistory } from './pages/SPSO/PrintingHistory'
import LoginPage from './pages/LoginPage'
import LoadingPage from './components/LoadingPage'
import { Suspense, useContext } from 'react'
import { AppContext } from './contexts/app.context'
import PrintingPage from './pages/PrintingPage'
import BuyPage from './pages/BuyPage'
import HistoryBuyPage from './pages/HistoryBuyPage'
import HistoryPrintPage from './pages/HistoryPrintPage'



function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext);

  return isAuthenticated ? (
    <Suspense fallback={<LoadingPage />}>
      <Outlet />
    </Suspense>
  ) : (
    <Navigate to={mainPath.home} />
  );
}



  export default function useRouteElements() {
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
        path: mainPath.login,
        element: <LoginPage />,
      },
      {
        path: '',
        element: <RejectedRoute />,
        children: [
          {
            path: mainPath.buypage,
            element: (
              <MainLayout>
                <BuyPage />
              </MainLayout>
            ),
          },
          {
            path: mainPath.historyBuyPage,
            element: (
              <MainLayout>
                <HistoryBuyPage />
              </MainLayout>
            ),
          },
          {
            path: mainPath.printing,
            element: (
              <MainLayout>
                <PrintingPage />
              </MainLayout>
            ),
          },
          {
            path: mainPath.info,
            element: (
              <MainLayout>
                <BuyPage />
              </MainLayout>
            ),
          },
        {
            path: mainPath.wallet,
            element: (
                <MainLayout>
                    <Wallet />
                </MainLayout>
            )
        },
        {
            path: mainPath.modifyPrinter,
            element: (
                <MainLayout>
                    <ModifyPrinter />
                </MainLayout>
            )
        },
        {
            path: mainPath.printerManagement,
            element: (
                <MainLayout>
                    <PrinterManagement />
                </MainLayout>
            )
        },
        {
            path: mainPath.printingHistory,
            element: (
                <MainLayout>
                    <PrintingHistory />
                </MainLayout>
            )
        },
        {
          path: mainPath.historyprintpage,
          element: (
              <MainLayout>
                  <HistoryPrintPage />
              </MainLayout>
          )
        },
        ],
      },
    ]);
 
    return routeElements
  }