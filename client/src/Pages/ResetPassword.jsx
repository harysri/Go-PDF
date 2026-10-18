import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [tokenValid, setTokenValid] = useState(null);
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Verify token when component mounts
    const verifyToken = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/auth/verify-reset-token/${token}`
        );
        const data = await response.json();

        if (data.valid) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
          setError(data.message);
        }
      } catch (err) {
        setTokenValid(false);
        setError("Failed to verify reset token");
      }
    };

    if (token) {
      verifyToken();
    } else {
      setTokenValid(false);
      setError("No reset token provided");
    }
  }, [token]);

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
    setSuccess("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Password reset failed");
      }

      setSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (tokenValid === null) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-sand p-8 sm:p-10 rounded-3xl border border-sand text-center">
            <p className="text-ink">Verifying reset token...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-sand p-8 sm:p-10 rounded-3xl border border-sand">
            <div className="text-center">
              <h1 className="text-[28px] font-medium tracking-heading text-ink mb-1">
                <span className="rounded-lg bg-accent px-2 text-ink">Go</span>
                <span className="ml-1 text-ink">PDF</span>
              </h1>
              <h2 className="text-2xl font-medium text-ink mb-4">
                Invalid Reset Link
              </h2>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-error/40 bg-error/10 p-3 text-sm text-error">
                {error}
              </div>
            )}

            <p className="text-body mb-6">
              This password reset link is invalid or has expired. Please request
              a new one.
            </p>

            <div className="text-center">
              <Link
                to="/login"
                className="inline-block rounded-pill bg-accent hover:bg-accent-hover text-ink py-2.5 px-6 font-medium transition-colors duration-200"
              >
                Return to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-[28px] font-medium tracking-heading text-ink mb-1">
            <span className="rounded-lg bg-accent px-2 text-ink">Go</span>
            <span className="ml-1 text-ink">PDF</span>
          </h1>
          <h2 className="text-[32px] font-medium tracking-heading text-ink mb-2">
            Reset Your Password
          </h2>
          <p className="text-muted">Enter your new password below</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-xl border border-error/40 bg-error/10 p-3 text-sm text-error">{error}</div>
        )}

        {/* Success Message */}
        {success && (
          <div className="rounded-xl border border-mint/40 bg-mint/10 p-3 text-sm text-ink">
            {success}
          </div>
        )}

        {/* Reset Password Form */}
        <div className="bg-sand p-8 sm:p-10 rounded-3xl border border-sand">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-body mb-2"
              >
                New Password
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
                  placeholder="Enter your new password"
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

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-body mb-2"
              >
                Confirm New Password
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
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 bg-paper border border-mist rounded-xl text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                  placeholder="Confirm your new password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-pill bg-accent hover:bg-accent-hover text-ink py-3.5 px-4 font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-cream disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="mt-6 text-center">
            <p className="text-muted">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-ink hover:text-ink font-medium transition-colors duration-200"
              >
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
