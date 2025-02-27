import { useLocation } from "react-router-dom";

export const useRouteConfig = () => {
  const location = useLocation();
  return {
    hideHeaderFooter: location.pathname.startsWith("/trio-admin"),
    isAdminLoginPage: location.pathname.startsWith("/trio-admin-login"),
  };
};
