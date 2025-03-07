import { useState, useEffect } from "react";
import { BrowserRouter } from "react-router";
import ScrollToTop from "./configs/ScrollToTop";
import AppRoutes from "./configs/routes";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { AuthProvider } from "./configs/adminConfigs/AuthContext";
import ConcertsProvider from "./context/ConcertsProvider";
import { useRouteConfig } from "./customHooks/useRouteConfig";
import style from "./App.module.scss";

// Simulated backend request function
const fetchBackendData = async () => {
  return new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate 3s API request
};

// Loading component
function LoadingScreen({ fadeOut }: { fadeOut: boolean }) {
  const fullText = "Khachaturian Trio";
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    const typingSpeed = 100; // Faster typing (100ms per letter)

    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(interval);
    }, typingSpeed);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`${style.loadingScreen} ${fadeOut ? style.fadeOut : ""}`}>
      <span className={style.typing}>
        <span className={style.whiteText}>
          {displayedText.startsWith("Khachaturian") ? "Khachaturian" : displayedText}
        </span>
        {displayedText.length > 12 && (
          <span className={style.orangeText}>
            {displayedText.slice(12)}
          </span>
        )}
      </span>
    </div>
  );
}

// Main App Component
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

// Root Component with First-Time Loading & Transition
function Root() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    fetchBackendData().then(() => setIsDataLoaded(true));

    const timer = setTimeout(() => {
      setFadeOut(true); // Start fade-out transition
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className={`${style.appWrapper} ${fadeOut ? style.appVisible : ""}`}>
        <App />
      </div>
      <LoadingScreen fadeOut={fadeOut} />
    </BrowserRouter>
  );
}

export default Root;
