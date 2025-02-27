import { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const expireTime = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

  // Retrieve login status and timestamp from localStorage
  const storedLogin = localStorage.getItem("isLogin") === "true";
  const storedTimestamp = localStorage.getItem("loginTimestamp");

  const [isLogin, setIsLogin] = useState<boolean>(storedLogin);

  useEffect(() => {
    const currentTime = new Date().getTime();

    // If there's a timestamp, check if 2 hours have passed
    if (storedTimestamp && currentTime - parseInt(storedTimestamp) > expireTime) {
      setIsLogin(false);
      localStorage.removeItem("isLogin");
      localStorage.removeItem("loginTimestamp");
    } else if (isLogin) {
      // Save login status & timestamp
      localStorage.setItem("isLogin", "true");
      localStorage.setItem("loginTimestamp", String(currentTime));

      // Set a timer to auto logout after 2 hours
      const timer = setTimeout(() => {
        setIsLogin(false);
        localStorage.removeItem("isLogin");
        localStorage.removeItem("loginTimestamp");
      }, expireTime);

      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [isLogin]);

  return <AuthContext.Provider value={{ isLogin, setIsLogin }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
