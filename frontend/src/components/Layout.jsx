import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout() {
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const hideChrome = location.pathname === "/login" || location.pathname === "/signup";

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "brutal";
    document.documentElement.setAttribute("data-theme", storedTheme);
    if (!localStorage.getItem("theme")) {
      localStorage.setItem("theme", storedTheme);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem("last_active", new Date().toISOString());
    }
  }, [isAuthenticated, location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      {!hideChrome && <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!hideChrome && <Footer />}
    </div>
  );
}

export default Layout;
