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
      "bg-blue-600",
      "bg-purple-600",
      "bg-green-600",
      "bg-red-600",
      "bg-yellow-600",
      "bg-indigo-600",
      "bg-pink-600",
      "bg-teal-600",
    ];
    const bgColor = colors[hash % colors.length];

    return (
      <div
        className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center text-white font-bold`}
        title={email ? `${firstName} ${lastName} (${email})` : "Guest"}
      >
        {initials}
      </div>
    );
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Project Title */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-white">
              <span className="text-blue-400">Go</span>
              <span className="text-white ml-1">PDF</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className={`text-gray-300 hover:text-white transition-colors duration-200 font-medium ${
                location.pathname === "/" ? "text-white font-semibold" : ""
              }`}
            >
              Home
            </Link>

            {!hideAuthLinks && !isLoggedIn && (
              <>
                <Link
                  to="/login"
                  className={`text-gray-300 hover:text-white transition-colors duration-200 font-medium ${
                    location.pathname === "/login"
                      ? "text-white font-semibold"
                      : ""
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className={`text-gray-300 hover:text-white transition-colors duration-200 font-medium ${
                    location.pathname === "/signup"
                      ? "text-white font-semibold"
                      : ""
                  }`}
                >
                  Sign Up
                </Link>
              </>
            )}

            {isLoggedIn && (
              <>
                <Link
                  to="/summarize"
                  className={`text-gray-300 hover:text-white transition-colors duration-200 font-medium ${
                    location.pathname === "/summarize"
                      ? "text-white font-semibold"
                      : ""
                  }`}
                >
                  Summarize
                </Link>
              </>
            )}

            {/* User Profile Section */}
            <div className="flex items-center space-x-4 ml-4">
              <div className="relative group">
                <div className="flex items-center space-x-2 cursor-pointer">
                  <UserAvatar
                    firstName={user?.firstName}
                    lastName={user?.lastName}
                    email={user?.email}
                  />
                  {isLoggedIn && (
                    <div className="hidden md:block text-right">
                      <p className="text-sm font-medium text-white">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-400 truncate max-w-[120px]">
                        {user?.email || ""}
                      </p>
                    </div>
                  )}
                </div>

                {/* Dropdown Menu */}
                {isLoggedIn && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50 hidden group-hover:block border border-gray-700">
                    <div className="px-4 py-2 border-b border-gray-700">
                      <p className="text-sm text-white">
                        {user?.username || "User"}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {user?.email || ""}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
