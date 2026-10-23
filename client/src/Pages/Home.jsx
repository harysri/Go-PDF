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
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const features = [
  {
    title: "Lightning Fast RAG",
    body: "Get comprehensive summaries and search answers in seconds. Our hybrid search blends dense vector embeddings with BM25 keywords.",
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
    title: "Precise Page Citations",
    body: "Never second-guess an AI answer. Every insight links directly to exact page numbers, snippets, and extracted figures.",
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
    title: "Enterprise Security",
    body: "Your documents are processed securely with end-to-end encryption. We adhere to strict privacy standards and never store files permanently.",
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

const useCases = [
  {
    title: "Legal & Contracts",
    description:
      "Scan multi-page agreements, clauses, and compliance guidelines instantly to find liabilities or obligations.",
    badge: "Contract Analysis",
  },
  {
    title: "Financial Reports",
    description:
      "Extract quarterly revenue numbers, P&L statements, and image figures across complex balance sheets.",
    badge: "Earnings & SEC",
  },
  {
    title: "Academic Research",
    description:
      "Synthesize research papers, translate findings into 20+ languages, and cross-reference citations effortlessly.",
    badge: "Multi-PDF RAG",
  },
];

const steps = [
  {
    number: "1",
    title: "Upload PDF",
    body: "Drag and drop your file or browse. Supports document uploads up to 50MB.",
  },
  {
    number: "2",
    title: "AI Processing",
    body: "Go PDF extracts text, renders figures, and builds a hybrid index with BM25 keywords & vectors.",
  },
  {
    number: "3",
    title: "Summarize & Chat",
    body: "Receive structured summaries, translate into target languages, extract images, or start asking questions.",
  },
];

const stats = [
  { value: "10K+", label: "Documents Processed" },
  { value: "95%", label: "Accuracy Rate" },
  { value: "30s", label: "Average Processing Time" },
  { value: "24/7", label: "Available" },
];

const languageOptions = [
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "ja", name: "Japanese" },
  { code: "hi", name: "Hindi" },
];

// Mock Extracted Images for Preview
const mockExtractedImages = [
  {
    id: 1,
    title: "Figure 1: Quarterly Revenue Breakdown",
    page: 4,
    type: "Bar Chart",
  },
  {
    id: 2,
    title: "Figure 2: Architecture & RAG Pipeline",
    page: 9,
    type: "Diagram",
  },
  {
    id: 3,
    title: "Table 3: Regional Compliance Matrix",
    page: 15,
    type: "Data Table",
  },
];

const heroStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const sectionReveal = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

// Preview playground tabs. They advance on their own, and a manual click
// restarts the countdown for the newly selected tab.
const previewTabs = ["summary", "translation", "images", "chat"];
const previewRotationMs = 2000;

const Home = () => {
  // Live Demo Preview State
  const [activeTab, setActiveTab] = useState("summary"); // "summary" | "translation" | "images" | "chat"
  const [isPreviewPaused, setIsPreviewPaused] = useState(false);
  const [previewRotationKey, setPreviewRotationKey] = useState(0);
  const [targetLanguage, setTargetLanguage] = useState("es");
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState("");

  // Interactive Chat State for Hero Preview
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I have indexed **financial_report_2024.pdf** (18 pages, 42 chunks). Ask me anything!",
      sources: [],
    },
    {
      role: "user",
      content:
        "What are the primary revenue drivers and profit margins mentioned?",
    },
    {
      role: "assistant",
      content:
        "The document highlights three core revenue streams: Enterprise subscriptions (+34%), usage API licensing (+22%), and custom professional services.",
      sources: [
        {
          page: 12,
          snippet:
            "Enterprise subscriptions grew by 34% YoY with an ARR net expansion rate of 118%...",
          score: 0.98,
        },
        {
          page: 14,
          snippet:
            "API licensing generated $4.2M, maintaining gross margins above 82%...",
          score: 0.94,
        },
      ],
    },
  ]);

  // Picks a preview tab and restarts the auto-rotation countdown, even when
  // the clicked tab is already the active one.
  const selectPreviewTab = (tab) => {
    setActiveTab(tab);
    setPreviewRotationKey((key) => key + 1);
  };

  // Cycle the preview tabs. Any change to activeTab (auto or manual) restarts
  // the timer, so a clicked tab stays put for a full interval.
  useEffect(() => {
    if (isPreviewPaused) return undefined;

    const timer = setTimeout(() => {
      setActiveTab((current) => {
        const nextIndex =
          (previewTabs.indexOf(current) + 1) % previewTabs.length;
        return previewTabs[nextIndex];
      });
    }, previewRotationMs);

    return () => clearTimeout(timer);
  }, [activeTab, isPreviewPaused, previewRotationKey]);

  const handleTranslateDemo = () => {
    setIsTranslating(true);
    setTimeout(() => {
      if (targetLanguage === "es") {
        setTranslatedText(
          "Este documento detalla la estrategia de crecimiento del año fiscal, destacando una expansión del 34% en los ingresos de infraestructura en la nube y la optimización operativa.",
        );
      } else if (targetLanguage === "fr") {
        setTranslatedText(
          "Ce document détaille la stratégie de croissance pour l'exercice financier, soulignant une expansion de 34% des revenus des infrastructures cloud et une rationalisation opérationnelle.",
        );
      } else if (targetLanguage === "de") {
        setTranslatedText(
          "Dieses Dokument beschreibt die Wachstumsstrategie für das Geschäftsjahr und hebt eine 34%ige Expansion der Einnahmen aus der Cloud-Infrastruktur hervor.",
        );
      } else {
        setTranslatedText(
          "This document details fiscal year growth strategy, highlighting a 34% expansion in cloud infrastructure revenue.",
        );
      }
      setIsTranslating(false);
    }, 500);
  };

  const handleAskQuestion = (e) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;

    const userQ = chatInput;
    setMessages((prev) => [...prev, { role: "user", content: userQ }]);
    setChatInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Based on hybrid RAG search for "${userQ}", Section 3 specifies key operational guidelines and performance targets.`,
          sources: [
            {
              page: 6,
              snippet:
                "Operational targets mandate a minimum uptime SLA of 99.99% across primary regions...",
              score: 0.96,
            },
          ],
        },
      ]);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-cream text-ink">
      {/* Hero Section */}
      <section className="px-6 pb-20 pt-24 lg:px-10 lg:pt-28">
        <motion.div
          className="mx-auto max-w-[1132px] text-center"
          variants={heroStagger}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-sand bg-sand px-4 py-1.5 text-caption font-medium text-body mb-6"
          >
            <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
            AI Summaries • Translations • Image Extraction • Hybrid RAG
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mx-auto max-w-5xl text-[44px] font-medium leading-[0.95] tracking-heading text-ink sm:text-[64px] sm:tracking-[-2px] lg:text-[84px] lg:leading-[0.86] lg:tracking-display"
          >
            <span className="rounded-2xl bg-accent px-3">Transform</span> Your
            PDFs
            <br />
            Into Smart Intelligence
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-8 max-w-2xl text-body-lg text-body"
          >
            Upload any PDF document to generate smart summaries, translate
            across 10+ languages, extract figures & diagrams, or chat with
            hybrid vector RAG.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              to="/signup"
              className="btn-accent w-full sm:w-auto shadow-sm"
            >
              Get Started Free
            </Link>
            <Link
              to="/AskPDF"
              className="w-full rounded-2xl border border-ink bg-paper px-6 py-3.5 text-center text-base font-medium text-ink transition-colors duration-300 hover:bg-ink hover:text-cream sm:w-auto flex items-center justify-center gap-2"
            >
              <span>Try Ask PDF Engine</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </motion.div>

          {/* Interactive Multi-Feature Playground Preview */}
          <motion.div
            variants={fadeUp}
            onMouseEnter={() => setIsPreviewPaused(true)}
            onMouseLeave={() => setIsPreviewPaused(false)}
            className="mt-16 rounded-3xl border border-sand bg-paper p-4 sm:p-8 shadow-xl text-left max-w-4xl mx-auto"
          >
            {/* Header Tabs Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-sand pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-400 inline-block" />
                <span className="ml-2 text-xs font-mono text-muted">
                  financial_report_2024.pdf
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 bg-sand p-1 rounded-2xl">
                <button
                  onClick={() => selectPreviewTab("summary")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${activeTab === "summary" ? "bg-accent text-ink" : "text-body hover:text-ink"}`}
                >
                  Summary
                </button>
                <button
                  onClick={() => selectPreviewTab("translation")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${activeTab === "translation" ? "bg-accent text-ink" : "text-body hover:text-ink"}`}
                >
                  Translate
                </button>
                <button
                  onClick={() => selectPreviewTab("images")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${activeTab === "images" ? "bg-accent text-ink" : "text-body hover:text-ink"}`}
                >
                  Extracted Images
                </button>
                <button
                  onClick={() => selectPreviewTab("chat")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${activeTab === "chat" ? "bg-accent text-ink" : "text-body hover:text-ink"}`}
                >
                  Ask PDF
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {/* TAB 1: Summary Output Preview */}
              {activeTab === "summary" && (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-medium text-ink">
                      Summary Output
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        className="rounded-full p-2 bg-cream hover:bg-sand transition-colors"
                        title="Copy"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                      <button
                        className="rounded-full p-2 bg-accent transition-colors"
                        title="Download"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-4-4m4 4l4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="bg-cream p-5 rounded-2xl border border-sand">
                    <p className="text-body text-sm sm:text-base leading-relaxed">
                      This document details the fiscal year growth strategy,
                      highlighting a{" "}
                      <strong className="text-ink">34% expansion</strong> in
                      cloud infrastructure revenue and operational streamlining.
                      Key risks involve supply chain constraints and localized
                      regulatory hurdles across global markets.
                    </p>

                    <div className="mt-4 pt-4 border-t border-sand space-y-1">
                      <div className="flex flex-wrap justify-between text-xs text-muted">
                        <span>Words: 48</span>
                        <span>Characters: 312</span>
                        <span>Reading Time: ~1 min</span>
                      </div>
                      <div className="flex flex-wrap justify-between text-xs text-muted pt-1">
                        <span>Pages: 18 &middot; Sections: 4</span>
                        <span>
                          42 chunks &middot; 2 reduce levels &middot; 1,420 in /
                          180 out tokens
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: Translation Section Preview */}
              {activeTab === "translation" && (
                <motion.div
                  key="translation"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-medium text-ink">
                      Translation Output
                    </h3>
                  </div>

                  <div className="space-y-4 bg-sand p-5 rounded-2xl border border-sand">
                    <div>
                      <label className="block text-xs font-medium text-body mb-2">
                        Target Language
                      </label>
                      <select
                        value={targetLanguage}
                        onChange={(e) => setTargetLanguage(e.target.value)}
                        className="w-full px-3 py-2 bg-paper border border-sand rounded-xl text-ink text-sm focus:outline-none"
                      >
                        {languageOptions.map((lang) => (
                          <option key={lang.code} value={lang.code}>
                            {lang.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={handleTranslateDemo}
                      disabled={isTranslating}
                      className="w-full rounded-2xl py-2.5 px-4 font-medium bg-accent text-ink text-sm hover:opacity-90 transition-all flex items-center justify-center space-x-2"
                    >
                      {isTranslating ? (
                        <span>Translating...</span>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                            />
                          </svg>
                          <span>Translate Summary</span>
                        </>
                      )}
                    </button>

                    {translatedText ? (
                      <div className="bg-paper p-4 rounded-xl border border-sand text-sm leading-relaxed text-ink animate-fadeIn">
                        <p className="font-semibold text-xs text-muted mb-1">
                          Result (
                          {
                            languageOptions.find(
                              (l) => l.code === targetLanguage,
                            )?.name
                          }
                          ):
                        </p>
                        {translatedText}
                      </div>
                    ) : (
                      <p className="text-xs text-muted text-center py-2">
                        Select target language and click translate to view
                        preview.
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* TAB 3: Extracted Images Preview */}
              {activeTab === "images" && (
                <motion.div
                  key="images"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-medium text-ink">
                      Extracted Document Images
                    </h3>
                    <span className="text-xs bg-accent px-2.5 py-1 rounded-full font-medium">
                      3 Figures Found
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {mockExtractedImages.map((img) => (
                      <div
                        key={img.id}
                        className="bg-cream rounded-2xl border border-sand p-3 flex flex-col justify-between"
                      >
                        <div className="h-28 bg-sand rounded-xl flex items-center justify-center border border-sand/50">
                          <svg
                            className="w-8 h-8 text-muted"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div className="mt-3">
                          <span className="text-[10px] font-semibold uppercase text-muted bg-sand px-2 py-0.5 rounded-md">
                            {img.type}
                          </span>
                          <p className="text-xs font-medium text-ink mt-1 truncate">
                            {img.title}
                          </p>
                          <p className="text-[11px] text-muted">
                            Found on Page {img.page}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* TAB 4: Ask PDF (RAG) Preview */}
              {activeTab === "chat" && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="space-y-4 flex flex-col h-[320px]"
                >
                  <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                    {messages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${msg.role === "user" ? "bg-ink text-cream rounded-br-xs" : "bg-cream text-ink border border-sand rounded-bl-xs"}`}
                        >
                          <p>{msg.content}</p>
                          {msg.sources && msg.sources.length > 0 && (
                            <div className="mt-2 space-y-1 border-t border-sand/60 pt-2">
                              {msg.sources.map((s, j) => (
                                <div
                                  key={j}
                                  className="flex items-center gap-2 text-xs"
                                >
                                  <span className="rounded bg-accent px-1.5 py-0.5 text-[10px] font-medium text-ink">
                                    p. {s.page}
                                  </span>
                                  <span className="text-[11px] text-muted truncate">
                                    {s.snippet}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <form
                    onSubmit={handleAskQuestion}
                    className="flex gap-2 pt-2 border-t border-sand"
                  >
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask anything about your PDF…..."
                      className="flex-1 bg-cream border border-sand rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-ink"
                    />
                    <button
                      type="submit"
                      className="btn-accent px-4 py-2 text-sm rounded-xl"
                    >
                      Send
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="border-y border-sand bg-sand px-6 py-24 lg:px-10">
        <motion.div className="mx-auto max-w-[1132px]" {...sectionReveal}>
          <div className="mb-16 max-w-2xl">
            <h2 className="text-[36px] font-medium leading-[1.02] tracking-heading text-ink sm:text-[48px] lg:text-heading-2">
              Why Choose{" "}
              <span className="rounded-2xl bg-accent px-2">Go PDF</span>?
            </h2>
            <p className="mt-6 text-body-lg text-body">
              Experience the power of AI-driven PDF summarization, image
              extraction, and translation with enterprise-grade security and
              accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-3xl border border-sand bg-paper p-8 transition-all duration-300 hover:border-ink"
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
        </motion.div>
      </section>

      {/* Use Cases Section */}
      <section className="px-6 py-24 lg:px-10">
        <motion.div className="mx-auto max-w-[1132px]" {...sectionReveal}>
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <h2 className="text-[36px] font-medium leading-[1.02] tracking-heading text-ink sm:text-[48px] lg:text-heading-2">
              Designed For Enterprise Workflows
            </h2>
            <p className="mt-4 text-body-lg text-body">
              Tailored for legal teams, financial analysts, researchers, and
              students who need instant document clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {useCases.map((uc) => (
              <div
                key={uc.title}
                className="rounded-3xl border border-sand bg-paper p-8 flex flex-col justify-between hover:border-ink transition-colors"
              >
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-accent text-caption font-semibold text-ink mb-6">
                    {uc.badge}
                  </span>
                  <h3 className="text-[24px] font-medium tracking-heading text-ink mb-3">
                    {uc.title}
                  </h3>
                  <p className="text-body text-base">{uc.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="border-y border-sand bg-sand px-6 py-24 lg:px-10">
        <motion.div className="mx-auto max-w-[1132px]" {...sectionReveal}>
          <div className="mb-16 text-center">
            <h2 className="text-[36px] font-medium leading-[1.02] tracking-heading text-ink sm:text-[48px] lg:text-heading-2">
              How It Works
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-body-lg text-body">
              Simple, fast, and effective PDF processing in three steps
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="text-center bg-paper p-8 rounded-3xl border border-sand"
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-2xl font-medium text-ink">
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
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-20 lg:px-10">
        <motion.div
          className="mx-auto grid max-w-[1132px] grid-cols-2 gap-12 text-center md:grid-cols-4 bg-paper border border-sand rounded-3xl p-10"
          {...sectionReveal}
        >
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
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="px-6 pb-24 lg:px-10">
        <motion.div className="mx-auto max-w-[1132px]" {...sectionReveal}>
          <div className="rounded-3xl border border-sand bg-paper px-6 py-20 text-center sm:px-16">
            <h2 className="mx-auto max-w-3xl text-[36px] font-medium leading-[1.02] tracking-heading text-ink sm:text-[48px] lg:text-heading-2">
              Ready to{" "}
              <span className="rounded-2xl bg-accent px-2">
                Summarize & Chat
              </span>{" "}
              Smarter?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-body-lg text-body">
              Join thousands of professionals who save hours every day with Go
              PDF. Start analyzing your documents today.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup" className="btn-accent">
                Start Free Trial
              </Link>
              <Link
                to="/AskPDF"
                className="rounded-2xl border border-ink px-6 py-3.5 text-center text-base font-medium text-ink hover:bg-ink hover:text-cream transition-colors"
              >
                Launch Ask PDF
              </Link>
            </div>
            <p className="mt-6 text-caption text-muted">
              No credit card required • Free trial available
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
