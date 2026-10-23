import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";

const pageStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, y: -12, scale: 0.98, transition: { duration: 0.2 } },
};

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success(`Welcome back, ${data.user?.firstName || "there"}!`);
      // Returns the user to the protected page that sent them here, if any.
      navigate(location.state?.from || "/summarize", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotMessage(""); // Clear previous messages

    if (!forgotEmail) {
      setForgotMessage("Please enter your email address");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: forgotEmail }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        // Show success message regardless of whether email exists (for security)
        setForgotMessage(
          "If this email exists in our system, you will receive password reset instructions",
        );
        setShowForgotPassword(false);
        setForgotEmail(""); // Clear the email field
      } else {
        setForgotMessage(data.message || "Failed to send reset email");
      }
    } catch (err) {
      setForgotMessage("Failed to send reset email. Please try again later.");
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-cream flex items-center justify-center px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <motion.div
        className="max-w-md w-full space-y-8"
        variants={pageStagger}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="text-center">
          <h1 className="text-[28px] font-medium tracking-heading text-ink mb-1">
            <span className="rounded-lg bg-accent px-2 text-ink">Go</span>
            <span className="ml-1 text-ink">PDF</span>
          </h1>
          <h2 className="text-[32px] font-medium tracking-heading text-ink mb-2">
            {showForgotPassword ? "Reset Password" : "Welcome Back"}
          </h2>
          <p className="text-muted">
            {showForgotPassword
              ? "Enter your email to reset password"
              : "Sign in to your account to continue"}
          </p>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              key="login-error"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="border border-error/40 bg-error/10 p-3 rounded-xl text-sm text-error"
            >
              {error}
            </motion.div>
          )}

          {forgotMessage && (
            <motion.div
              key="forgot-message"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={`p-3 rounded-xl ${
                forgotMessage.includes("Failed")
                  ? "border border-error/40 bg-error/10 text-error"
                  : "border border-mint/40 bg-mint/10 text-ink"
              }`}
            >
              {forgotMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
        {showForgotPassword ? (
          /* Forgot Password Form */
          <motion.div
            key="forgot-password"
            variants={cardVariants}
            className="bg-sand p-8 sm:p-10 rounded-3xl border border-sand"
          >
            <form className="space-y-6" onSubmit={handleForgotPassword}>
              <div>
                <label
                  htmlFor="forgotEmail"
                  className="block text-sm font-medium text-body mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-muted"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  <input
                    id="forgotEmail"
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-paper border border-mist rounded-xl text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 rounded-pill bg-accent hover:bg-accent-hover text-ink py-3.5 px-4 font-medium transition-colors duration-200"
                >
                  Send Reset Link
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotMessage("");
                    setForgotEmail("");
                  }}
                  className="flex-1 rounded-pill border border-mist bg-sand hover:bg-cloud text-ink py-3.5 px-4 font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          /* Login Form */
          <motion.div
            key="login-form"
            variants={cardVariants}
            className="bg-sand p-8 sm:p-10 rounded-3xl border border-sand"
          >
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-body mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-muted"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-3 bg-paper border border-mist rounded-xl text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-body mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-muted"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 bg-paper border border-mist rounded-xl text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-ink"
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.757 6.757M9.878 9.878a3 3 0 105.303 5.303m0-5.303l2.121-2.122M15.121 15.121L18.243 18.243m-4.242-4.242L15.121 15.121m-1.878-6.364A9.964 9.964 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-1.172 2.228"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 bg-paper border border-mist rounded-lg focus:ring-2 focus:ring-accent text-ink"
                  />
                  <span className="ml-2 text-sm text-body">
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-ink hover:text-ink transition-colors duration-200"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-pill bg-accent hover:bg-accent-hover text-ink py-3.5 px-4 font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-cream disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-muted">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-ink hover:text-ink font-medium transition-colors duration-200"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Login;
