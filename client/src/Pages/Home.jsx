// import React from "react";
// import { Link } from "react-router-dom";

// const features = [
//   {
//     title: "Lightning Fast",
//     body: "Get comprehensive summaries of your PDFs in seconds, not hours. Our advanced AI processes documents at incredible speed.",
//     icon: (
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={1.6}
//         d="M13 10V3L4 14h7v7l9-11h-7z"
//       />
//     ),
//   },
//   {
//     title: "Highly Accurate",
//     body: "Our AI understands context and extracts the most important information, ensuring your summaries are precise and meaningful.",
//     icon: (
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={1.6}
//         d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//       />
//     ),
//   },
//   {
//     title: "Secure & Private",
//     body: "Your documents are processed securely with end-to-end encryption. We never store your files permanently.",
//     icon: (
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={1.6}
//         d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
//       />
//     ),
//   },
// ];

// const steps = [
//   {
//     number: "1",
//     title: "Upload PDF",
//     body: "Simply drag and drop your PDF file or click to browse. Supports files up to 50MB.",
//   },
//   {
//     number: "2",
//     title: "AI Processing",
//     body: "Our advanced AI analyzes your document, understanding context and identifying key information.",
//   },
//   {
//     number: "3",
//     title: "Get Summary",
//     body: "Receive a concise, well-structured summary highlighting the most important points from your document.",
//   },
// ];

// const stats = [
//   { value: "10K+", label: "Documents Processed" },
//   { value: "95%", label: "Accuracy Rate" },
//   { value: "30s", label: "Average Processing Time" },
//   { value: "24/7", label: "Available" },
// ];

// const Home = () => {
//   return (
//     <div className="min-h-screen bg-cream">
//       {/* Hero Section */}
//       <section className="px-6 pb-24 pt-24 lg:px-10 lg:pt-28">
//         <div className="mx-auto max-w-[1132px] text-center">
//           <h1 className="mx-auto max-w-5xl text-[44px] font-medium leading-[0.95] tracking-heading text-ink sm:text-[64px] sm:tracking-[-2px] lg:text-[84px] lg:leading-[0.86] lg:tracking-display">
//             <span className="rounded-2xl bg-accent px-3">Transform</span> Your PDFs
//             <br />
//             Into Smart Summaries
//           </h1>

//           <p className="mx-auto mt-8 max-w-2xl text-body-lg text-body">
//             Upload any PDF document and get intelligent, concise summaries
//             powered by AI. Save time and extract key insights from lengthy
//             documents instantly.
//           </p>

//           <div className="mt-10 flex justify-center">
//             <Link to="/signup" className="btn-accent w-full sm:w-auto">
//               Get Started Free
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="border-y border-sand bg-sand px-6 py-24 lg:px-10">
//         <div className="mx-auto max-w-[1132px]">
//           <div className="mb-16 max-w-2xl">
//             <h2 className="text-[36px] font-medium leading-[1.02] tracking-heading text-ink sm:text-[48px] lg:text-heading-2 lg:tracking-display">
//               Why Choose <span className="rounded-2xl bg-accent px-2">Go PDF</span>?
//             </h2>
//             <p className="mt-6 text-body-lg text-body">
//               Experience the power of AI-driven PDF summarization with
//               enterprise-grade security and accuracy.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
//             {features.map((feature) => (
//               <div
//                 key={feature.title}
//                 className="rounded-3xl border border-sand bg-paper p-8 transition-colors duration-300 hover:border-ink"
//               >
//                 <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-ink">
//                   <svg
//                     className="h-6 w-6"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     {feature.icon}
//                   </svg>
//                 </div>
//                 <h3 className="text-[26px] font-medium tracking-heading text-ink">
//                   {feature.title}
//                 </h3>
//                 <p className="mt-3 text-base text-body">{feature.body}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* How It Works Section */}
//       <section className="px-6 py-24 lg:px-10">
//         <div className="mx-auto max-w-[1132px]">
//           <div className="mb-16 text-center">
//             <h2 className="text-[36px] font-medium leading-[1.02] tracking-heading text-ink sm:text-[48px] lg:text-heading-2 lg:tracking-display">
//               How It Works
//             </h2>
//             <p className="mx-auto mt-6 max-w-xl text-body-lg text-body">
//               Simple, fast, and effective PDF summarization in three steps
//             </p>
//           </div>

//           <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
//             {steps.map((step) => (
//               <div key={step.number} className="text-center">
//                 <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-2xl font-medium text-ink">
//                   {step.number}
//                 </div>
//                 <h3 className="text-[26px] font-medium tracking-heading text-ink">
//                   {step.title}
//                 </h3>
//                 <p className="mx-auto mt-3 max-w-xs text-base text-body">
//                   {step.body}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Stats Section */}
//       <section className="border-y border-sand bg-sand px-6 py-20 lg:px-10">
//         <div className="mx-auto grid max-w-[1132px] grid-cols-2 gap-12 text-center md:grid-cols-4">
//           {stats.map((stat) => (
//             <div key={stat.label}>
//               <div className="text-[44px] font-medium leading-none tracking-display text-ink sm:text-[56px]">
//                 {stat.value}
//               </div>
//               <div className="mt-3 text-caption text-body sm:text-base">
//                 {stat.label}
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="px-6 py-24 lg:px-10">
//         <div className="mx-auto max-w-[1132px]">
//           <div className="rounded-3xl border border-sand bg-paper px-6 py-20 text-center sm:px-16">
//             <h2 className="mx-auto max-w-3xl text-[36px] font-medium leading-[1.02] tracking-heading text-ink sm:text-[48px] lg:text-heading-2 lg:tracking-display">
//               Ready to <span className="rounded-2xl bg-accent px-2">Summarize</span>{" "}
//               Smarter?
//             </h2>
//             <p className="mx-auto mt-6 max-w-xl text-body-lg text-body">
//               Join thousands of professionals who save hours every day with Go
//               PDF. Start summarizing your documents today.
//             </p>
//             <div className="mt-10 flex justify-center">
//               <Link to="/signup" className="btn-accent">
//                 Start Free Trial
//               </Link>
//             </div>
//             <p className="mt-6 text-caption text-muted">
//               No credit card required • Free 14-day trial
//             </p>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Home;

//updated with ask padf features
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
            <span className="rounded-2xl bg-accent px-3">Transform</span> Your
            PDFs
            <br />
            Into Smart Summaries
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-body-lg text-body">
            Upload any PDF document and get intelligent, concise summaries
            powered by AI. Save time and extract key insights from lengthy
            documents instantly.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/signup" className="btn-accent w-full sm:w-auto">
              Get Started Free
            </Link>
            <Link
              to="/signup"
              className="w-full rounded-2xl border border-ink px-6 py-3 text-center text-base font-medium text-ink transition-colors duration-300 hover:bg-ink hover:text-cream sm:w-auto"
            >
              Try Ask PDF →
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-y border-sand bg-sand px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-[1132px]">
          <div className="mb-16 max-w-2xl">
            <h2 className="text-[36px] font-medium leading-[1.02] tracking-heading text-ink sm:text-[48px] lg:text-heading-2 lg:tracking-display">
              Why Choose{" "}
              <span className="rounded-2xl bg-accent px-2">Go PDF</span>?
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

      {/* Ask PDF Feature Section */}
      <section className="px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-[1132px]">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-block rounded-full border border-sand bg-sand px-4 py-1.5 text-caption font-medium text-body">
                New Feature
              </span>
              <h2 className="mt-6 text-[36px] font-medium leading-[1.02] tracking-heading text-ink sm:text-[48px] lg:text-heading-2 lg:tracking-display">
                Chat With Your Docs Using{" "}
                <span className="rounded-2xl bg-accent px-2">Ask PDF</span>
              </h2>
              <p className="mt-6 max-w-lg text-body-lg text-body">
                Go beyond summaries — ask questions in plain language and get
                precise, sourced answers. Our RAG pipeline with hybrid search
                combines semantic vector retrieval and keyword matching, so
                every answer cites the exact page it came from.
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  "Hybrid search: dense vectors + BM25 keywords",
                  "Retrieval-augmented generation with source citations",
                  "Follow-up questions with full conversation context",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-base text-body"
                  >
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-ink">
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <Link to="/AskPDF" className="btn-accent">
                  Open Ask PDF
                </Link>
              </div>
            </div>

            {/* Mini chat mockup */}
            <div className="rounded-3xl border border-sand bg-paper p-6 lg:p-8">
              <div className="space-y-5">
                <div className="flex justify-end">
                  <div className="max-w-[80%] rounded-3xl rounded-br-lg bg-ink px-5 py-3.5 text-base text-cream">
                    What are the key revenue drivers mentioned?
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-3xl rounded-bl-lg border border-sand bg-cream px-5 py-3.5 text-base text-ink">
                    The document identifies three primary drivers: enterprise
                    subscriptions (p. 12), usage-based API pricing (p. 14), and
                    annual licensing deals (p. 17)…
                    <div className="mt-3 flex flex-wrap gap-2 border-t border-sand pt-3">
                      {[12, 14, 17].map((p) => (
                        <span
                          key={p}
                          className="rounded-full bg-accent px-2.5 py-0.5 text-caption font-medium text-ink"
                        >
                          p. {p}
                        </span>
                      ))}
                      <span className="text-caption text-muted">
                        98% relevant
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-sand bg-cream px-4 py-3">
                  <span className="flex-1 text-base text-muted">
                    Ask a follow-up…
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-ink">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 19V5m0 0l-6 6m6-6l6 6"
                        transform="rotate(90 12 12)"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
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
              Ready to{" "}
              <span className="rounded-2xl bg-accent px-2">Summarize</span>{" "}
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
