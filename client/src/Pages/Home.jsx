import React from "react";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Lightning Fast",
    body: "Get comprehensive summaries of your PDFs in seconds, not hours. Our advanced AI processes documents at incredible speed.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.6}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    ),
  },
  {
    title: "Highly Accurate",
    body: "Our AI understands context and extracts the most important information, ensuring your summaries are precise and meaningful.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.6}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
  {
    title: "Secure & Private",
    body: "Your documents are processed securely with end-to-end encryption. We never store your files permanently.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.6}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    ),
  },
];

const steps = [
  {
    number: "1",
    title: "Upload PDF",
    body: "Simply drag and drop your PDF file or click to browse. Supports files up to 50MB.",
  },
  {
    number: "2",
    title: "AI Processing",
    body: "Our advanced AI analyzes your document, understanding context and identifying key information.",
  },
  {
    number: "3",
    title: "Get Summary",
    body: "Receive a concise, well-structured summary highlighting the most important points from your document.",
  },
];

const stats = [
  { value: "10K+", label: "Documents Processed" },
  { value: "95%", label: "Accuracy Rate" },
  { value: "30s", label: "Average Processing Time" },
  { value: "24/7", label: "Available" },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="px-6 pb-24 pt-24 lg:px-10 lg:pt-28">
        <div className="mx-auto max-w-[1132px] text-center">
          <h1 className="mx-auto max-w-5xl text-[44px] font-medium leading-[0.95] tracking-heading text-ink sm:text-[64px] sm:tracking-[-2px] lg:text-[84px] lg:leading-[0.86] lg:tracking-display">
            <span className="rounded-2xl bg-accent px-3">Transform</span> Your PDFs
            <br />
            Into Smart Summaries
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-body-lg text-body">
            Upload any PDF document and get intelligent, concise summaries
            powered by AI. Save time and extract key insights from lengthy
            documents instantly.
          </p>

          <div className="mt-10 flex justify-center">
            <Link to="/signup" className="btn-accent w-full sm:w-auto">
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-y border-sand bg-sand px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-[1132px]">
          <div className="mb-16 max-w-2xl">
            <h2 className="text-[36px] font-medium leading-[1.02] tracking-heading text-ink sm:text-[48px] lg:text-heading-2 lg:tracking-display">
              Why Choose <span className="rounded-2xl bg-accent px-2">Go PDF</span>?
            </h2>
            <p className="mt-6 text-body-lg text-body">
              Experience the power of AI-driven PDF summarization with
              enterprise-grade security and accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-3xl border border-sand bg-paper p-8 transition-colors duration-300 hover:border-ink"
              >
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-ink">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="text-[26px] font-medium tracking-heading text-ink">
                  {feature.title}
                </h3>
                <p className="mt-3 text-base text-body">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-[1132px]">
          <div className="mb-16 text-center">
            <h2 className="text-[36px] font-medium leading-[1.02] tracking-heading text-ink sm:text-[48px] lg:text-heading-2 lg:tracking-display">
              How It Works
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-body-lg text-body">
              Simple, fast, and effective PDF summarization in three steps
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-2xl font-medium text-ink">
                  {step.number}
                </div>
                <h3 className="text-[26px] font-medium tracking-heading text-ink">
                  {step.title}
                </h3>
                <p className="mx-auto mt-3 max-w-xs text-base text-body">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-sand bg-sand px-6 py-20 lg:px-10">
        <div className="mx-auto grid max-w-[1132px] grid-cols-2 gap-12 text-center md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-[44px] font-medium leading-none tracking-display text-ink sm:text-[56px]">
                {stat.value}
              </div>
              <div className="mt-3 text-caption text-body sm:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-[1132px]">
          <div className="rounded-3xl border border-sand bg-paper px-6 py-20 text-center sm:px-16">
            <h2 className="mx-auto max-w-3xl text-[36px] font-medium leading-[1.02] tracking-heading text-ink sm:text-[48px] lg:text-heading-2 lg:tracking-display">
              Ready to <span className="rounded-2xl bg-accent px-2">Summarize</span>{" "}
              Smarter?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-body-lg text-body">
              Join thousands of professionals who save hours every day with Go
              PDF. Start summarizing your documents today.
            </p>
            <div className="mt-10 flex justify-center">
              <Link to="/signup" className="btn-accent">
                Start Free Trial
              </Link>
            </div>
            <p className="mt-6 text-caption text-muted">
              No credit card required • Free 14-day trial
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
