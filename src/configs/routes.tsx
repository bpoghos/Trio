import { useRoutes, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import ConcertsPage from "../pages/ConcertsPage/ConcertsPage";
import AboutUsPage from "../pages/AboutUsPage/AboutUsPage";
import MediaPage from "../pages/MediaPage/MediaPage";
import Admin from "../pages/Admin/Admin";
import LoginPage from "./adminConfigs/LoginPage";
import { useAuth } from "./adminConfigs/AuthContext"; // Import Auth Context
import ConcertsProvider from "../context/ConcertsProvider";

const AppRoutes = () => {
  const { isLogin } = useAuth(); // ✅ Use global auth state

  const routes = [
    { path: "/", element: <ConcertsProvider><HomePage /></ConcertsProvider> },
    { path: "/concerts", element: <ConcertsProvider><ConcertsPage /></ConcertsProvider> },
    { path: "/about", element: <AboutUsPage /> },
    { path: "/media", element: <MediaPage /> },
    { path: "/trio-admin-login", element: <LoginPage /> },
    { 
      path: "/trio-admin", 
      element: isLogin ? <ConcertsProvider><Admin /></ConcertsProvider> : <Navigate to="/trio-admin-login" replace />
    } // ✅ Now properly checks global state
  ];

  return useRoutes(routes);
};

export default AppRoutes;
