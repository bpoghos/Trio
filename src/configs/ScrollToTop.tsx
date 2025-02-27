import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    document.documentElement.scrollTop = 0;  // ✅ Works for most browsers
    document.body.scrollTop = 0;  // ✅ Ensures compatibility
  }, [pathname]);

  return null;
};

export default ScrollToTop;
