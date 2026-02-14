import { NavLink, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Moon, Sun } from "lucide-react";
import { logoutUser } from "../authSlice";

function Navbar({ theme, onToggleTheme }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const initials = user?.firstName
    ? user.firstName.slice(0, 2).toUpperCase()
    : "U";

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const toggleTheme = () => {
    onToggleTheme?.();
  };

  return (
    <div className="navbar bg-base-100 shadow-lg px-4">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <NavLink to="/">Problems</NavLink>
            </li>
            {isAuthenticated && (
              <li>
                <NavLink to="/profile">Profile</NavLink>
              </li>
            )}
            {isAuthenticated && user?.role === "admin" && (
              <li>
                <NavLink to="/admin">Admin</NavLink>
              </li>
            )}
          </ul>
        </div>
        <NavLink to="/" className="btn btn-ghost text-xl">
          AlgoHub
        </NavLink>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <NavLink to="/">Problems</NavLink>
          </li>
          {isAuthenticated && (
            <li>
              <NavLink to="/profile">Profile</NavLink>
            </li>
          )}
          {isAuthenticated && user?.role === "admin" && (
            <li>
              <NavLink to="/admin">Admin</NavLink>
            </li>
          )}
        </ul>
      </div>

      <div className="navbar-end">
        <button
          className="theme-switch"
          data-checked={theme === "brutal-dark"}
          onClick={toggleTheme}
          aria-label="Toggle theme"
          aria-checked={theme === "brutal-dark"}
          role="switch"
          type="button"
        >
          <span className="theme-icon theme-icon-left">
            <Sun size={12} />
          </span>
          <span className="theme-icon theme-icon-right">
            <Moon size={12} />
          </span>
          <span className="theme-knob" />
        </button>
        {isAuthenticated ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="btn btn-ghost btn-circle avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-10">
                <span className="text-sm">{initials}</span>
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li className="px-3 py-2 text-xs uppercase opacity-60">
                Signed in as {user?.firstName || "User"}
              </li>
              <li>
                <NavLink to="/profile">Profile</NavLink>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2">
            <NavLink to="/login" className="btn btn-ghost btn-sm">
              Login
            </NavLink>
            <NavLink to="/signup" className="btn btn-primary btn-sm">
              Sign Up
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
