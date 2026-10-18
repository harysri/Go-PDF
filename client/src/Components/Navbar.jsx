import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const isLoggedIn = localStorage.getItem("token");

  // Get initials from firstName and lastName
  const getAvatarInitials = (firstName, lastName) => {
    let initials = "";
    if (firstName && firstName.length > 0) {
      initials += firstName[0].toUpperCase();
    }
    if (lastName && lastName.length > 0) {
      initials += lastName[0].toUpperCase();
    }
    return initials || "👤"; // Fallback to emoji if no initials
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const hideAuthLinks = ["/login", "/signup", "/summarize"].includes(
    location.pathname.toLowerCase()
  );

  // Avatar component with color based on email hash
  const UserAvatar = ({ firstName, lastName, email }) => {
    const initials = getAvatarInitials(firstName, lastName);

    // Generate consistent color based on email (since all users have email)
    const hash = email
      ? Array.from(email).reduce((acc, char) => acc + char.charCodeAt(0), 0)
      : 0;

    const colors = [
      "bg-accent",
      "bg-mist",
      "bg-cloud",
      "bg-paper",
      "bg-stone",
      "bg-sand",
      "bg-accent-hover",
      "bg-[#e6e6e6]",
    ];
    const bgColor = colors[hash % colors.length];

    return (
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full ${bgColor} text-sm font-medium text-ink ring-1 ring-sand`}
        title={email ? `${firstName} ${lastName} (${email})` : "Guest"}
      >
        {initials}
      </div>
    );
  };

  const navLinkClass = (path) =>
    `rounded-pill px-4 py-3 text-sm font-medium transition-colors duration-200 ${
      location.pathname.toLowerCase() === path
        ? "bg-accent text-ink"
        : "text-body hover:text-ink"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-sand bg-cream/90 backdrop-blur-xl">
      <div className="mx-auto max-w-[1132px] px-6 lg:px-10">
        <div className="flex h-[80px] items-center justify-between gap-4">
          {/* Logo / Project Title */}
          <Link
            to="/"
            className="flex items-baseline text-[22px] font-medium leading-none tracking-heading text-ink"
          >
            <span className="rounded-lg bg-accent px-2 py-0.5 text-ink">Go</span>
            <span className="ml-1 text-ink">PDF</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
            <Link to="/" className={navLinkClass("/")}>
              Home
            </Link>

            {!hideAuthLinks && !isLoggedIn && (
              <>
                <Link to="/login" className={navLinkClass("/login")}>
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="ml-1 rounded-pill bg-ink px-5 py-3 text-sm font-medium text-cream transition-colors duration-200 hover:bg-body sm:px-6"
                >
                  Sign Up
                </Link>
              </>
            )}

            {isLoggedIn && (
              <>
                <Link to="/summarize" className={navLinkClass("/summarize")}>
                  Summarize
                </Link>
              </>
            )}

            {/* User Profile Section */}
            <div
              className={`group relative ml-1 ${
                isLoggedIn ? "" : "hidden sm:block"
              }`}
            >
              <div className="flex cursor-pointer items-center gap-3">
                <UserAvatar
                  firstName={user?.firstName}
                  lastName={user?.lastName}
                  email={user?.email}
                />
                {isLoggedIn && (
                  <div className="hidden text-right md:block">
                    <p className="text-sm font-medium leading-tight text-ink">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="max-w-[140px] truncate text-xs leading-tight text-muted">
                      {user?.email || ""}
                    </p>
                  </div>
                )}
              </div>

              {/* Dropdown Menu */}
              {isLoggedIn && (
                <div className="absolute right-0 z-50 mt-3 hidden w-52 overflow-hidden rounded-2xl border border-sand bg-paper py-1.5 group-hover:block">
                  <div className="border-b border-sand px-4 py-2.5">
                    <p className="text-sm text-ink">
                      {user?.username || user?.firstName || "User"}
                    </p>
                    <p className="truncate text-xs text-muted">
                      {user?.email || ""}
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2.5 text-sm text-body transition-colors hover:bg-cloud hover:text-ink"
                  >
                    Profile Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2.5 text-left text-sm text-body transition-colors hover:bg-cloud hover:text-ink"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
