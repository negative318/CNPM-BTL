import { useContext } from "react";
import { AppContext } from "../../contexts/app.context";
import HomePageBeforeLogin from "./HomePageBeforeLogin";
import HomePageAfterLogin from "./HomePageAfterLogin";

export default function HomePage() {
  const { isAuthenticated } = useContext(AppContext);

  return (
    <div>
      {isAuthenticated ? <HomePageAfterLogin /> : <HomePageBeforeLogin />}
    </div>
  );
}
