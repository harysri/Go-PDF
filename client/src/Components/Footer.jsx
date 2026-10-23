import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-sand bg-cream px-6 lg:px-10">
      <div className="mx-auto max-w-[1132px]">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-10 py-16 md:grid-cols-4">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h2 className="mb-4 text-[22px] font-medium leading-none tracking-heading text-ink">
              <span className="rounded-lg bg-accent px-2 text-ink">Go</span>
              <span className="ml-0.5 text-ink">PDF</span>
            </h2>
            <p className="mb-6 max-w-md text-body">
              Transform Your PDFs Into Smart Summaries and ask questions about
              their contents with AI-powered tools.
            </p>
            <div className="flex space-x-5">
              <a
                href="#"
                aria-label="GitHub"
                className="text-muted hover:text-ink transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-medium uppercase tracking-[0.12em] text-ink">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-muted hover:text-ink transition-colors duration-200"
                >
                  Features
                </a>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-muted hover:text-ink transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-muted hover:text-ink transition-colors duration-200"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/Signup"
                  className="text-muted hover:text-ink transition-colors duration-200"
                >
                  Signup
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted hover:text-ink transition-colors duration-200"
                >
                  Documentation
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-sand py-7">
          <div className="flex flex-col items-start justify-between gap-3 md:flex-row">
            <p className="text-caption text-muted">
              © {new Date().getFullYear()} Go PDF. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
