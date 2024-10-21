import { useRoutes } from "react-router-dom";
import mainPath from "./constants/path";
import MainLayout from "./layouts/MainLayouts/MainLayouts";
import HomePage from "./pages/HomePage";
import AccountSettingView from "./pages/Account/layouts/AccountSettingView";
import ProfileView from "./pages/Account/layouts/ProfileView";

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      index: true,
      path: mainPath.home,
      element: (
        <MainLayout>
          <HomePage />
        </MainLayout>
      ),
    },
    {
      index: true,
      path: mainPath.accountSetting,
      element: (
        <MainLayout>
          <AccountSettingView />
        </MainLayout>
      ),
    },
    {
      index: true,
      path: mainPath.profile,
      element: (
        <MainLayout>
          <ProfileView />
        </MainLayout>
      ),
    }
  ]);
  return routeElements;
}