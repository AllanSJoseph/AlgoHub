import { Outlet, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout() {
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const hideChrome = location.pathname === "/login" || location.pathname === "/signup";
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "brutal"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem("last_active", new Date().toISOString());
    }
  }, [isAuthenticated, location.pathname]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "brutal" ? "brutal-dark" : "brutal"));
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      {!hideChrome && <Navbar theme={theme} onToggleTheme={toggleTheme} />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!hideChrome && <Footer />}
    </div>
  );
}

export default Layout;
