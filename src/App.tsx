import AppRoutes from "./configs/routes";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./configs/ScrollToTop";
import { AuthProvider } from "./configs/adminConfigs/AuthContext";
import ConcertsProvider from "./context/ConcertsProvider";
import { BrowserRouter } from "react-router";
import { useRouteConfig } from "./customHooks/useRouteConfig";

function App() {
  const { hideHeaderFooter, isAdminLoginPage } = useRouteConfig();

  return (
    <AuthProvider>
      {!isAdminLoginPage && (
        <ConcertsProvider>
          <Header />
        </ConcertsProvider>
      )}
      <AppRoutes />
      {!hideHeaderFooter && <Footer />}
    </AuthProvider>
  );
}

function Root() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <App />
    </BrowserRouter>
  );
}

export default Root;
