import {Navigate, Outlet, useRoutes} from 'react-router-dom'
import mainPath from './constants/path'
import MainLayout from './layouts/MainLayouts/MainLayouts'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import LoadingPage from './components/LoadingPage'
import { Suspense, useContext } from 'react'
import { AppContext } from './contexts/app.context'
import BuyPage from './pages/BuyPage'
import HistoryBuyPage from './pages/HistoryBuyPage'



function RejectedRoute() {
  const { isAuthenticated, loadingPage } = useContext(AppContext);

  if (loadingPage) {
    return <LoadingPage />; // Hiển thị trang loading trong khi đang tải
  }

  return isAuthenticated ? (
    <Suspense fallback={<LoadingPage />}>
      <Outlet />
    </Suspense>
  ) : (
    <Navigate to={mainPath.login} /> // Điều hướng đến trang đăng nhập nếu chưa xác thực
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
            path: mainPath.info,
            element: (
              <MainLayout>
                <BuyPage />
              </MainLayout>
            ),
          },
        ],
      },
    ]);
  
    return routeElements
  }