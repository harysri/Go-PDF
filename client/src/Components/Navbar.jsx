import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const isLoggedIn = localStorage.getItem("token");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the avatar menu on navigation or when clicking outside of it
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const handlePointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

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
    setMenuOpen(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("You have been signed out");
    navigate("/login");
  };

  // Auth links are only shown on the public pages; protected/target pages hide them
  const authLinkPages = ["/", "/login", "/signup"];
  const showAuthLinks =
    !isLoggedIn && authLinkPages.includes(location.pathname.toLowerCase());

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
        title="Profile menu"
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
      <div
        className={`mx-auto max-w-[1132px] px-6 lg:px-10 ${
          isLoggedIn ? "pr-20 sm:pr-24 lg:pr-24" : ""
        }`}
      >
        <div className="flex h-[80px] items-center justify-between gap-4">
          {/* Logo / Project Title */}
          <Link
            to="/"
            className="flex items-baseline text-[28px] font-medium leading-none tracking-heading text-ink"
          >
            <span className="rounded-lg bg-accent px-2 py-0.5 text-ink">
              Go
            </span>
            <span className="ml-1 text-ink">PDF</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
            <Link to="/" className={navLinkClass("/")}>
              Home
            </Link>

            {showAuthLinks && (
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
          </div>
        </div>
      </div>
      {isLoggedIn && (
        <div
          ref={menuRef}
          className="absolute right-4 top-2"
          onMouseEnter={() => setMenuOpen(true)}
          onMouseLeave={() => setMenuOpen(false)}
        >
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex items-center rounded-pill p-1 transition-colors duration-200 hover:bg-cloud/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/20"
          >
            <UserAvatar
              firstName={user?.firstName}
              lastName={user?.lastName}
              email={user?.email}
            />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full z-50 pt-3">
              <div
                role="menu"
                className="w-56 overflow-hidden rounded-2xl border border-sand bg-paper py-1.5 shadow-[0_16px_40px_rgba(29,29,29,0.12)]"
              >
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
                  role="menuitem"
                  className="block px-4 py-2.5 text-sm text-body transition-colors hover:bg-cloud hover:text-ink"
                >
                  Profile Settings
                </Link>
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="block w-full px-4 py-2.5 text-left text-sm text-body transition-colors hover:bg-cloud hover:text-ink"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
