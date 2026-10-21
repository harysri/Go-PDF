import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import ScrollToTop from "./Components/ScrollToTop";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Summarization from "./Pages/Summarization";
import ResetPassword from "./Pages/ResetPassword";
import ProfilePage from "./Pages/Profile";
import AskPDF from "./Pages/AskPDF";
import { Toaster } from "react-hot-toast";

// MathChat pulls in the markdown + KaTeX renderer, so load it with the route.
const MathChat = lazy(() => import("./Pages/mathchat"));

/**
 * Layout route for pages that need a signed-in user. The token is what Navbar
 * uses to show the Summarize / Ask PDF links, so the same check keeps those
 * pages closed when someone opens the URL directly while signed out.
 *
 * /login reads `state.from` to send the user back after signing in.
 */
function RequireAuth() {
  const location = useLocation();

  if (!localStorage.getItem("token")) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1d1d1d",
            color: "#f1efe2",
            borderRadius: "100px",
            padding: "12px 20px",
            fontSize: "14px",
            fontWeight: 500,
            boxShadow: "none",
          },
          success: {
            iconTheme: { primary: "#d3fb43", secondary: "#1d1d1d" },
          },
          error: {
            iconTheme: { primary: "#a33a2b", secondary: "#f1efe2" },
          },
        }}
      />
      <div className="appearance-none">
        <Navbar />
        <Suspense
          fallback={
            <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted">
              Loading…
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/Signup" element={<Signup />} />
            <Route element={<RequireAuth />}>
              <Route path="/Summarize" element={<Summarization />} />
              <Route path="/AskPDF" element={<AskPDF />} />
            </Route>
            <Route path="/MathChat" element={<MathChat />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
        </Suspense>
        <Footer />
      </div>
    </Router>
  );
}
export default App;
