// import React, { useState } from "react";

// const Summarization = () => {
//   const [dragActive, setDragActive] = useState(false);
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [summary, setSummary] = useState("");
//   const [summaryLength, setSummaryLength] = useState("medium");
//   const [summaryType, setSummaryType] = useState("general");
//   const [error, setError] = useState(null);

//   const handleDrag = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true);
//     } else if (e.type === "dragleave") {
//       setDragActive(false);
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
//     setError(null);

//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       const file = e.dataTransfer.files[0];
//       validateAndSetFile(file);
//     }
//   };

//   const handleFileSelect = (e) => {
//     setError(null);
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       validateAndSetFile(file);
//     }
//   };

//   const validateAndSetFile = (file) => {
//     if (file.type !== "application/pdf") {
//       setError("Please upload a PDF file only.");
//       return;
//     }

//     if (file.size > 50 * 1024 * 1024) {
//       // 50MB limit
//       setError("File size exceeds 50MB limit.");
//       return;
//     }

//     setUploadedFile(file);
//   };

//   const handleSummarize = async () => {
//     if (!uploadedFile) {
//       setError("Please upload a PDF file first.");
//       return;
//     }

//     setIsProcessing(true);
//     setError(null);
//     setSummary("");

//     const formData = new FormData();
//     formData.append("file", uploadedFile);
//     formData.append("summaryLength", summaryLength);
//     formData.append("summaryType", summaryType);

//     try {
//       const response = await fetch("http://localhost:5000/summarize", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to summarize document");
//       }

//       const data = await response.json();
//       setSummary(data.summary);
//     } catch (err) {
//       console.error("Summarization error:", err);
//       setError(
//         err.message || "An error occurred while summarizing the document"
//       );
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const removeFile = () => {
//     setUploadedFile(null);
//     setSummary("");
//     setError(null);
//   };

//   const downloadSummary = () => {
//     if (!summary) return;

//     const element = document.createElement("a");
//     const file = new Blob([summary], { type: "text/plain" });
//     element.href = URL.createObjectURL(file);
//     element.download = `${
//       uploadedFile?.name.replace(".pdf", "") || "document"
//     }_summary.txt`;
//     document.body.appendChild(element);
//     element.click();
//     document.body.removeChild(element);
//   };

//   const copySummary = async () => {
//     if (!summary) return;
//     try {
//       await navigator.clipboard.writeText(summary);
//       // Could add a toast notification here
//     } catch (err) {
//       console.error("Failed to copy text:", err);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-cream text-ink py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="mb-4 text-[32px] font-medium tracking-heading sm:text-[44px] lg:text-heading-2">
//             <span className="text-ink">PDF</span> Summarization
//           </h1>
//           <p className="mx-auto max-w-2xl text-body-lg text-muted">
//             Upload your PDF document and get an intelligent, concise summary in
//             seconds
//           </p>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="mb-6 p-4 bg-error/10 border border-error/40 rounded-xl">
//             <div className="flex items-center">
//               <svg
//                 className="w-5 h-5 mr-2 text-error"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//               <span className="text-error">{error}</span>
//             </div>
//           </div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Left Panel - Upload and Controls */}
//           <div className="space-y-6">
//             {/* Upload Area */}
//             <div className="bg-sand p-6 sm:p-8 rounded-3xl border border-sand">
//               <h2 className="text-2xl font-medium mb-4">Upload Document</h2>

//               <div
//                 className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
//                   dragActive
//                     ? "border-accent bg-accent/10"
//                     : uploadedFile
//                     ? "border-mint bg-mint/10"
//                     : "border-mist hover:border-accent"
//                 }`}
//                 onDragEnter={handleDrag}
//                 onDragLeave={handleDrag}
//                 onDragOver={handleDrag}
//                 onDrop={handleDrop}
//               >
//                 <input
//                   type="file"
//                   accept=".pdf"
//                   onChange={handleFileSelect}
//                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                 />

//                 {uploadedFile ? (
//                   <div className="space-y-4">
//                     <div className="w-16 h-16 rounded-full bg-mint flex items-center justify-center mx-auto">
//                       <svg
//                         className="w-8 h-8 text-ink"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                         />
//                       </svg>
//                     </div>
//                     <div>
//                       <p className="text-lg font-medium text-ink">
//                         File Uploaded Successfully
//                       </p>
//                       <p className="text-body">{uploadedFile.name}</p>
//                       <p className="text-sm text-muted">
//                         {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
//                       </p>
//                     </div>
//                     <button
//                       onClick={removeFile}
//                       className="text-error hover:text-error text-sm transition-colors duration-200"
//                     >
//                       Remove File
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     <div className="w-16 h-16 rounded-full bg-accent/15 text-ink ring-1 ring-inset ring-accent/30 flex items-center justify-center mx-auto">
//                       <svg
//                         className="w-8 h-8 text-ink"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
//                         />
//                       </svg>
//                     </div>
//                     <div>
//                       <p className="text-lg font-medium">
//                         Drag and drop your PDF here
//                       </p>
//                       <p className="text-muted">or click to browse files</p>
//                       <p className="text-sm text-muted mt-2">
//                         Maximum file size: 50MB
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Summarization Options */}
//             <div className="bg-sand p-6 sm:p-8 rounded-3xl border border-sand">
//               <h3 className="text-xl font-medium mb-4">
//                 Summarization Options
//               </h3>

//               <div className="space-y-4">
//                 {/* Summary Length */}
//                 <div>
//                   <label className="block text-sm font-medium text-body mb-2">
//                     Summary Length
//                   </label>
//                   <div className="grid grid-cols-3 gap-2">
//                     {["short", "medium", "detailed"].map((length) => (
//                       <button
//                         key={length}
//                         onClick={() => setSummaryLength(length)}
//                         className={`rounded-pill px-3 py-2 text-sm font-medium transition-all duration-200 ${
//                           summaryLength === length
//                             ? "bg-accent text-ink"
//                             : "bg-paper text-body hover:bg-cloud"
//                         }`}
//                       >
//                         {length.charAt(0).toUpperCase() + length.slice(1)}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Summary Type */}
//                 <div>
//                   <label className="block text-sm font-medium text-body mb-2">
//                     Summary Type
//                   </label>
//                   <select
//                     value={summaryType}
//                     onChange={(e) => setSummaryType(e.target.value)}
//                     className="w-full px-3 py-2 bg-paper border border-mist rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
//                   >
//                     <option value="general">General Summary</option>
//                     <option value="bullet">Bullet Points</option>
//                     <option value="academic">Academic Style</option>
//                     <option value="business">Business Overview</option>
//                     <option value="technical">Technical Summary</option>
//                   </select>
//                 </div>
//               </div>
//             </div>

//             {/* Action Button */}
//             <button
//               onClick={handleSummarize}
//               disabled={!uploadedFile || isProcessing}
//               className={`w-full rounded-pill py-4 px-6 font-medium text-lg transition-all duration-300 ${
//                 !uploadedFile || isProcessing
//                   ? "bg-paper text-muted cursor-not-allowed"
//                   : "bg-accent hover:bg-accent-hover text-ink transform hover:scale-105"
//               }`}
//             >
//               {isProcessing ? (
//                 <div className="flex items-center justify-center space-x-2">
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-ink"></div>
//                   <span>Processing Document...</span>
//                 </div>
//               ) : (
//                 "Generate Summary"
//               )}
//             </button>
//           </div>

//           {/* Right Panel - Summary Output */}
//           <div className="bg-sand p-6 sm:p-8 rounded-3xl border border-sand">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-2xl font-medium">Summary Output</h2>

//               {summary && (
//                 <div className="flex space-x-2">
//                   <button
//                     onClick={copySummary}
//                     className="rounded-full p-2 bg-paper hover:bg-cloud transition-colors duration-200"
//                     title="Copy to Clipboard"
//                   >
//                     <svg
//                       className="w-5 h-5"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
//                       />
//                     </svg>
//                   </button>
//                   <button
//                     onClick={downloadSummary}
//                     className="rounded-full p-2 bg-accent hover:bg-accent-hover transition-colors duration-200"
//                     title="Download Summary"
//                   >
//                     <svg
//                       className="w-5 h-5"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M12 10v6m0 0l-4-4m4 4l4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                       />
//                     </svg>
//                   </button>
//                 </div>
//               )}
//             </div>

//             <div
//               className={`min-h-[400px] ${
//                 summary ? "" : "flex items-center justify-center"
//               }`}
//             >
//               {summary ? (
//                 <div className="bg-paper p-4 rounded-xl">
//                   <div className="prose prose-invert max-w-none">
//                     <div className="text-ink leading-relaxed whitespace-pre-line">
//                       {summary}
//                     </div>
//                   </div>

//                   {/* Summary Stats */}
//                   <div className="mt-6 pt-4 border-t border-mist">
//                     <div className="flex justify-between text-sm text-muted">
//                       <span>Words: {summary.split(" ").length}</span>
//                       <span>Characters: {summary.length}</span>
//                       <span>
//                         Reading Time: ~
//                         {Math.ceil(summary.split(" ").length / 200)} min
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="text-center text-muted">
//                   <div className="w-24 h-24 bg-paper rounded-xl flex items-center justify-center mx-auto mb-4">
//                     <svg
//                       className="w-12 h-12"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                       />
//                     </svg>
//                   </div>
//                   <p className="text-lg">Your summary will appear here</p>
//                   <p className="text-sm">
//                     Upload a PDF and click "Generate Summary" to get started
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Document Statistics Section */}
//         {summary && (
//           <div className="mt-8 bg-sand p-6 sm:p-8 rounded-3xl border border-sand">
//             <h3 className="text-xl font-medium mb-4">Document Statistics</h3>
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               <div className="rounded-2xl border border-sand bg-cream p-4 text-center">
//                 <div className="text-2xl font-medium text-ink">
//                   {(uploadedFile.size / 1024 / 1024).toFixed(1)} MB
//                 </div>
//                 <div className="text-sm text-muted">File Size</div>
//               </div>
//               <div className="rounded-2xl border border-sand bg-cream p-4 text-center">
//                 <div className="text-2xl font-medium text-ink">
//                   {summary.split(" ").length}
//                 </div>
//                 <div className="text-sm text-muted">Summary Words</div>
//               </div>
//               <div className="rounded-2xl border border-sand bg-cream p-4 text-center">
//                 <div className="text-2xl font-medium text-ink">
//                   ~{Math.ceil(summary.split(" ").length / 200)}min
//                 </div>
//                 <div className="text-sm text-muted">Reading Time</div>
//               </div>
//               <div className="rounded-2xl border border-sand bg-cream p-4 text-center">
//                 <div className="text-2xl font-medium text-ink">
//                   {summaryType.charAt(0).toUpperCase() + summaryType.slice(1)}
//                 </div>
//                 <div className="text-sm text-muted">Summary Type</div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Summarization;

//worked one
// import React, { useState } from "react";

// const Summarization = () => {
//   const [dragActive, setDragActive] = useState(false);
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [summary, setSummary] = useState("");
//   const [summaryLength, setSummaryLength] = useState("medium");
//   const [summaryType, setSummaryType] = useState("general");
//   const [error, setError] = useState(null);

//   const handleDrag = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true);
//     } else if (e.type === "dragleave") {
//       setDragActive(false);
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
//     setError(null);

//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       const file = e.dataTransfer.files[0];
//       validateAndSetFile(file);
//     }
//   };

//   const handleFileSelect = (e) => {
//     setError(null);
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       validateAndSetFile(file);
//     }
//   };

//   const validateAndSetFile = (file) => {
//     if (file.type !== "application/pdf") {
//       setError("Please upload a PDF file only.");
//       return;
//     }

//     if (file.size > 50 * 1024 * 1024) {
//       setError("File size exceeds 50MB limit.");
//       return;
//     }

//     setUploadedFile(file);
//   };

//   const handleSummarize = async () => {
//     if (!uploadedFile) {
//       setError("Please upload a PDF file first.");
//       return;
//     }

//     setIsProcessing(true);
//     setError(null);
//     setSummary("");

//     const formData = new FormData();
//     formData.append("file", uploadedFile);
//     formData.append("summaryLength", summaryLength);
//     formData.append("summaryType", summaryType);

//     try {
//       const response = await fetch("http://localhost:5000/api/summarize", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to summarize document");
//       }

//       const data = await response.json();
//       setSummary(data.summary);
//     } catch (err) {
//       console.error("Summarization error:", err);
//       setError(
//         err.message || "An error occurred while summarizing the document"
//       );
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const removeFile = () => {
//     setUploadedFile(null);
//     setSummary("");
//     setError(null);
//   };

//   const downloadSummary = () => {
//     if (!summary) return;

//     const element = document.createElement("a");
//     const file = new Blob([summary], { type: "text/plain" });
//     element.href = URL.createObjectURL(file);
//     element.download = `${
//       uploadedFile?.name.replace(".pdf", "") || "document"
//     }_summary.txt`;
//     document.body.appendChild(element);
//     element.click();
//     document.body.removeChild(element);
//   };

//   const copySummary = async () => {
//     if (!summary) return;
//     try {
//       await navigator.clipboard.writeText(summary);
//       // Could add a toast notification here
//     } catch (err) {
//       console.error("Failed to copy text:", err);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-cream text-ink py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="mb-4 text-[32px] font-medium tracking-heading sm:text-[44px] lg:text-heading-2">
//             <span className="text-ink">PDF</span> Summarization
//           </h1>
//           <p className="mx-auto max-w-2xl text-body-lg text-muted">
//             Upload your PDF document and get an intelligent, concise summary in
//             seconds
//           </p>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="mb-6 p-4 bg-error/10 border border-error/40 rounded-xl">
//             <div className="flex items-center">
//               <svg
//                 className="w-5 h-5 mr-2 text-error"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//               <span className="text-error">{error}</span>
//             </div>
//           </div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Left Panel - Upload and Controls */}
//           <div className="space-y-6">
//             {/* Upload Area */}
//             <div className="bg-sand p-6 sm:p-8 rounded-3xl border border-sand">
//               <h2 className="text-2xl font-medium mb-4">Upload Document</h2>

//               <div
//                 className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
//                   dragActive
//                     ? "border-accent bg-accent/10"
//                     : uploadedFile
//                     ? "border-mint bg-mint/10"
//                     : "border-mist hover:border-accent"
//                 }`}
//                 onDragEnter={handleDrag}
//                 onDragLeave={handleDrag}
//                 onDragOver={handleDrag}
//                 onDrop={handleDrop}
//               >
//                 <input
//                   type="file"
//                   accept=".pdf"
//                   onChange={handleFileSelect}
//                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                 />

//                 {uploadedFile ? (
//                   <div className="space-y-4">
//                     <div className="w-16 h-16 rounded-full bg-mint flex items-center justify-center mx-auto">
//                       <svg
//                         className="w-8 h-8 text-ink"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                         />
//                       </svg>
//                     </div>
//                     <div>
//                       <p className="text-lg font-medium text-ink">
//                         File Uploaded Successfully
//                       </p>
//                       <p className="text-body">{uploadedFile.name}</p>
//                       <p className="text-sm text-muted">
//                         {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
//                       </p>
//                     </div>
//                     <button
//                       onClick={removeFile}
//                       className="text-error hover:text-error text-sm transition-colors duration-200"
//                     >
//                       Remove File
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     <div className="w-16 h-16 rounded-full bg-accent/15 text-ink ring-1 ring-inset ring-accent/30 flex items-center justify-center mx-auto">
//                       <svg
//                         className="w-8 h-8 text-ink"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
//                         />
//                       </svg>
//                     </div>
//                     <div>
//                       <p className="text-lg font-medium">
//                         Drag and drop your PDF here
//                       </p>
//                       <p className="text-muted">or click to browse files</p>
//                       <p className="text-sm text-muted mt-2">
//                         Maximum file size: 50MB
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Summarization Options */}
//             <div className="bg-sand p-6 sm:p-8 rounded-3xl border border-sand">
//               <h3 className="text-xl font-medium mb-4">
//                 Summarization Options
//               </h3>

//               <div className="space-y-4">
//                 {/* Summary Length */}
//                 <div>
//                   <label className="block text-sm font-medium text-body mb-2">
//                     Summary Length
//                   </label>
//                   <div className="grid grid-cols-3 gap-2">
//                     {["short", "medium", "detailed"].map((length) => (
//                       <button
//                         key={length}
//                         onClick={() => setSummaryLength(length)}
//                         className={`rounded-pill px-3 py-2 text-sm font-medium transition-all duration-200 ${
//                           summaryLength === length
//                             ? "bg-accent text-ink"
//                             : "bg-paper text-body hover:bg-cloud"
//                         }`}
//                       >
//                         {length.charAt(0).toUpperCase() + length.slice(1)}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Summary Type */}
//                 <div>
//                   <label className="block text-sm font-medium text-body mb-2">
//                     Summary Type
//                   </label>
//                   <select
//                     value={summaryType}
//                     onChange={(e) => setSummaryType(e.target.value)}
//                     className="w-full px-3 py-2 bg-paper border border-mist rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
//                   >
//                     <option value="general">General Summary</option>
//                     <option value="bullet">Bullet Points</option>
//                   </select>
//                 </div>
//               </div>
//             </div>

//             {/* Action Button */}
//             <button
//               onClick={handleSummarize}
//               disabled={!uploadedFile || isProcessing}
//               className={`w-full rounded-pill py-4 px-6 font-medium text-lg transition-all duration-300 ${
//                 !uploadedFile || isProcessing
//                   ? "bg-paper text-muted cursor-not-allowed"
//                   : "bg-accent hover:bg-accent-hover text-ink transform hover:scale-105"
//               }`}
//             >
//               {isProcessing ? (
//                 <div className="flex items-center justify-center space-x-2">
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-ink"></div>
//                   <span>Processing Document...</span>
//                 </div>
//               ) : (
//                 "Generate Summary"
//               )}
//             </button>
//           </div>

//           {/* Right Panel - Summary Output */}
//           <div className="bg-sand p-6 sm:p-8 rounded-3xl border border-sand">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-2xl font-medium">Summary Output</h2>

//               {summary && (
//                 <div className="flex space-x-2">
//                   <button
//                     onClick={copySummary}
//                     className="rounded-full p-2 bg-paper hover:bg-cloud transition-colors duration-200"
//                     title="Copy to Clipboard"
//                   >
//                     <svg
//                       className="w-5 h-5"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
//                       />
//                     </svg>
//                   </button>
//                   <button
//                     onClick={downloadSummary}
//                     className="rounded-full p-2 bg-accent hover:bg-accent-hover transition-colors duration-200"
//                     title="Download Summary"
//                   >
//                     <svg
//                       className="w-5 h-5"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M12 10v6m0 0l-4-4m4 4l4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                       />
//                     </svg>
//                   </button>
//                 </div>
//               )}
//             </div>

//             <div
//               className={`min-h-[400px] ${
//                 summary ? "" : "flex items-center justify-center"
//               }`}
//             >
//               {summary ? (
//                 <div className="bg-paper p-4 rounded-xl">
//                   <div className="prose prose-invert max-w-none">
//                     <div className="text-ink leading-relaxed whitespace-pre-line">
//                       {summary}
//                     </div>
//                   </div>

//                   {/* Summary Stats */}
//                   <div className="mt-6 pt-4 border-t border-mist">
//                     <div className="flex justify-between text-sm text-muted">
//                       <span>Words: {summary.split(" ").length}</span>
//                       <span>Characters: {summary.length}</span>
//                       <span>
//                         Reading Time: ~
//                         {Math.ceil(summary.split(" ").length / 200)} min
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="text-center text-muted">
//                   <div className="w-24 h-24 bg-paper rounded-xl flex items-center justify-center mx-auto mb-4">
//                     <svg
//                       className="w-12 h-12"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                       />
//                     </svg>
//                   </div>
//                   <p className="text-lg">Your summary will appear here</p>
//                   <p className="text-sm">
//                     Upload a PDF and click "Generate Summary" to get started
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Document Statistics Section */}
//         {summary && (
//           <div className="mt-8 bg-sand p-6 sm:p-8 rounded-3xl border border-sand">
//             <h3 className="text-xl font-medium mb-4">Document Statistics</h3>
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               <div className="rounded-2xl border border-sand bg-cream p-4 text-center">
//                 <div className="text-2xl font-medium text-ink">
//                   {(uploadedFile.size / 1024 / 1024).toFixed(1)} MB
//                 </div>
//                 <div className="text-sm text-muted">File Size</div>
//               </div>
//               <div className="rounded-2xl border border-sand bg-cream p-4 text-center">
//                 <div className="text-2xl font-medium text-ink">
//                   {summary.split(" ").length}
//                 </div>
//                 <div className="text-sm text-muted">Summary Words</div>
//               </div>
//               <div className="rounded-2xl border border-sand bg-cream p-4 text-center">
//                 <div className="text-2xl font-medium text-ink">
//                   ~{Math.ceil(summary.split(" ").length / 200)}min
//                 </div>
//                 <div className="text-sm text-muted">Reading Time</div>
//               </div>
//               <div className="rounded-2xl border border-sand bg-cream p-4 text-center">
//                 <div className="text-2xl font-medium text-ink">
//                   {summaryType.charAt(0).toUpperCase() + summaryType.slice(1)}
//                 </div>
//                 <div className="text-sm text-muted">Summary Type</div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//       {/* MathChat Section - Full Width and Centered */}
//       <section className="w-full min-h-[60vh] flex items-center justify-center py-20 px-2 sm:px-8 bg-gradient-to-br from-deep via-ink to-[#0a0514] mt-16">
//         <div className="w-full max-w-6xl mx-auto">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
//             {/* Left Content */}
//             <div className="flex flex-col justify-center h-full px-2 md:px-8">
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="rounded-full bg-accent p-3">
//                   <svg
//                     className="w-8 h-8 text-ink"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
//                     />
//                   </svg>
//                 </div>
//                 <span className="text-2xl font-medium text-ink">
//                   New Feature
//                 </span>
//               </div>

//               <h2 className="text-4xl md:text-5xl font-medium mb-6 leading-tight">
//                 <span className="text-ink">Math</span>Chat
//                 <br />
//                 <span className="text-ink">AI Assistant</span>
//               </h2>

//               <p className="text-lg md:text-xl text-body mb-8 max-w-xl">
//                 Solve complex mathematical problems with step-by-step
//                 explanations. From algebra to calculus, get instant help with
//                 detailed reasoning and visual solutions powered by advanced AI.
//               </p>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
//                 <div className="flex items-center gap-3">
//                   <div className="w-2 h-2 bg-accent rounded-full"></div>
//                   <span className="text-body">Algebra & Equations</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="w-2 h-2 bg-stone rounded-full"></div>
//                   <span className="text-body">Calculus Solutions</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="w-2 h-2 bg-accent rounded-full"></div>
//                   <span className="text-body">Geometry & Trigonometry</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="w-2 h-2 bg-stone rounded-full"></div>
//                   <span className="text-body">
//                     Statistics & Probability
//                   </span>
//                 </div>
//               </div>

//               <div className="flex flex-col sm:flex-row gap-4">
//                 <a href="/MathChat">
//                   <button className="rounded-pill bg-accent px-8 py-4 text-lg font-medium text-ink hover:bg-accent-hover transition-all duration-300 transform hover:scale-105">
//                     Try MathChat
//                   </button>
//                 </a>
//               </div>
//             </div>

//             {/* Right Visual */}
//             <div className="relative flex justify-center items-center h-full px-2 md:px-8">
//               <div className="bg-paper/80 backdrop-blur-md rounded-3xl p-8 border border-sand w-full max-w-md min-h-[420px] flex flex-col justify-between">
//                 {/* Mock Chat Interface */}
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="rounded-full bg-accent p-2 text-ink">
//                     <svg
//                       className="w-5 h-5 text-ink"
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                   </div>
//                   <div>
//                     <div className="text-sm font-medium">Math Assistant</div>
//                     <div className="text-xs text-muted">
//                       AI-powered solutions
//                     </div>
//                   </div>
//                 </div>

//                 {/* Sample Messages */}
//                 <div className="space-y-4">
//                   <div className="bg-accent text-ink rounded-3xl p-4 ml-8">
//                     <div className="text-sm">
//                       Find the derivative of f(x) = x³ + 2x² - 5x + 1
//                     </div>
//                   </div>

//                   <div className="bg-sand rounded-3xl p-4 mr-8">
//                     <div className="text-sm text-body">
//                       <div className="font-medium text-ink mb-2">
//                         Solution:
//                       </div>
//                       Using the power rule:
//                       <br />
//                       • d/dx(x³) = 3x²
//                       <br />
//                       • d/dx(2x²) = 4x
//                       <br />
//                       • d/dx(-5x) = -5
//                       <br />
//                       • d/dx(1) = 0<br />
//                       <br />
//                       <span className="text-ink font-medium">
//                         f'(x) = 3x² + 4x - 5
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Input Preview */}
//                 <div className="mt-6 flex gap-3">
//                   <div className="flex-1 rounded-pill border border-sand bg-sand px-4 py-3 text-sm text-muted min-w-0">
//                     Enter your math problem...
//                   </div>
//                   <div className="rounded-full bg-accent p-3 flex items-center justify-center text-ink">
//                     <svg
//                       className="w-5 h-5 text-ink"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
//                       />
//                     </svg>
//                   </div>
//                 </div>
//               </div>

//               {/* Floating Elements */}
//               <div className="absolute -top-4 -right-4 bg-accent px-3 py-1 rounded-full text-sm font-medium text-ink animate-pulse">
//                 Live
//               </div>
//               <div className="absolute -bottom-4 -left-4 bg-accent px-4 py-2 rounded-full text-ink text-sm font-medium">
//                 ∑ ∫ √ ∞
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Summarization;

import React, { useState, useEffect, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import FormatResponse from "../Components/FormatResponse";

const Summarization = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState("");
  const [summaryLength, setSummaryLength] = useState("medium");
  const [summaryType, setSummaryType] = useState("general");
  const [summaryMeta, setSummaryMeta] = useState(null);
  const [error, setError] = useState(null);

  // New states for translation
  const [translatedText, setTranslatedText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("eng_Latn");
  const [isTranslating, setIsTranslating] = useState(false);

  // New states for image extraction
  const [extractedImages, setExtractedImages] = useState([]);
  const [isExtractingImages, setIsExtractingImages] = useState(false);
  const [extractionStatus, setExtractionStatus] = useState("");

  // Text to speech (Kokoro, rendered by the backend)
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef(null);
  // Synthesis is slow, so the last rendered summary is kept for instant replay.
  const audioCacheRef = useRef({ text: "", url: null });

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsSpeaking(false);
  };

  const playAudio = async (url) => {
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.onended = () => stopAudio();
    audio.onerror = () => {
      stopAudio();
      setError("Could not play the generated audio.");
    };

    await audio.play();
    setIsSpeaking(true);
  };

  // Language options (Updated for Indian Regional Support)
  const languageOptions = [
    { code: "Spanish", name: "Spanish" },
    { code: "French", name: "French" },
    { code: "German", name: "German" },
    { code: "Italian", name: "Italian" },
    { code: "Portuguese", name: "Portuguese" },
    { code: "Russian", name: "Russian" },
    { code: "Arabic", name: "Arabic" },

    // Indian Languages
    { code: "Hindi", name: "Hindi" },
    { code: "Bengali", name: "Bengali" },
    { code: "Tamil", name: "Tamil" },
    { code: "Malayalam", name: "Malayalam" },
    { code: "Telugu", name: "Telugu" },
    { code: "Kannada", name: "Kannada" },
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileSelect = (e) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file) => {
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file only.");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError("File size exceeds 50MB limit.");
      return;
    }

    setUploadedFile(file);
    // Reset extracted images and translation when new file is uploaded
    setExtractedImages([]);
    setTranslatedText("");
  };

  const handleSummarize = async () => {
    if (!uploadedFile) {
      setError("Please upload a PDF file first.");
      return;
    }

    stopAudio();
    setIsProcessing(true);
    setError(null);
    setSummary("");
    setTranslatedText(""); // Clear previous translation

    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("summaryLength", summaryLength);
    formData.append("summaryType", summaryType);

    try {
      const response = await fetch("http://localhost:5000/api/summarize", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to summarize document");
      }

      const data = await response.json();
      setSummary(data.summary);
      setSummaryMeta(data.meta || null);
    } catch (err) {
      console.error("Summarization error:", err);
      setError(
        err.message || "An error occurred while summarizing the document",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to extract images from PDF
  const handleExtractImages = async () => {
    if (!uploadedFile) {
      setError("Please upload a PDF file first.");
      return;
    }

    setIsExtractingImages(true);
    setExtractionStatus("Loading PDF file...");
    setError(null);

    try {
      // Read the PDF file
      const arrayBuffer = await uploadedFile.arrayBuffer();
      setExtractionStatus("Parsing PDF document...");

      // Load PDF document
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      setExtractionStatus(`Processing ${pages.length} pages...`);

      const images = [];
      let imageIndex = 1;

      // Iterate through all pages
      for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
        const page = pages[pageIndex];

        // Extract embedded images
        const pageImages = page.node.context.enumerateIndirectObjects();

        for (const [ref, obj] of pageImages) {
          if (
            obj instanceof pdfDoc.context.obj.constructor &&
            obj.get("Subtype")?.value === "Image"
          ) {
            try {
              const image = await pdfDoc.embedPdf(obj);

              // Convert to PNG for display
              const pngBytes = await image.asPng();
              const blob = new Blob([pngBytes], { type: "image/png" });
              const imageUrl = URL.createObjectURL(blob);

              images.push({
                id: `page${pageIndex + 1}_img${imageIndex}`,
                page: pageIndex + 1,
                url: imageUrl,
                name: `page${pageIndex + 1}_image${imageIndex}.png`,
                blob: blob,
                size: blob.size,
              });

              imageIndex++;
              setExtractionStatus(`Found ${images.length} images so far...`);
            } catch (err) {
              console.warn(
                `Failed to extract image ${ref} from page ${pageIndex + 1}:`,
                err,
              );
            }
          }
        }
      }

      if (images.length === 0) {
        setExtractionStatus("No images found in the PDF.");
        setError("No extractable images found in this PDF file.");
      } else {
        setExtractionStatus(`Successfully extracted ${images.length} images.`);
        setExtractedImages(images);
      }
    } catch (err) {
      console.error("Image extraction error:", err);
      setError("Failed to extract images from PDF. Please try another file.");
      setExtractionStatus("Extraction failed.");
    } finally {
      setIsExtractingImages(false);
    }
  };

  // Function to translate summary
  const handleTranslate = async () => {
    if (!summary) {
      setError("Please generate a summary first.");
      return;
    }

    setIsTranslating(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: summary,
          target_lang: targetLanguage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to translate text");
      }

      const data = await response.json();
      setTranslatedText(data.translated_text);
    } catch (err) {
      console.error("Translation error:", err);
      setError(err.message || "An error occurred while translating");
    } finally {
      setIsTranslating(false);
    }
  };

  // Function to download individual image
  const downloadImage = (image) => {
    const link = document.createElement("a");
    link.href = image.url;
    link.download = image.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to download all images as ZIP
  const downloadAllImages = async () => {
    if (extractedImages.length === 0) return;

    // For simplicity, we'll download images one by one
    // In production, you might want to create a ZIP file on the server
    extractedImages.forEach((image, index) => {
      setTimeout(() => {
        downloadImage(image);
      }, index * 100);
    });
  };

  const removeFile = () => {
    stopAudio();
    setUploadedFile(null);
    setSummary("");
    setSummaryMeta(null);
    setTranslatedText("");
    setExtractedImages([]);
    setError(null);
  };

  const downloadSummary = () => {
    if (!summary) return;

    const element = document.createElement("a");
    const file = new Blob([summary], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${
      uploadedFile?.name.replace(".pdf", "") || "document"
    }_summary.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadTranslation = () => {
    if (!translatedText) return;

    const element = document.createElement("a");
    const file = new Blob([translatedText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${
      uploadedFile?.name.replace(".pdf", "") || "document"
    }_translated_${targetLanguage}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copySummary = async () => {
    if (!summary) return;
    try {
      await navigator.clipboard.writeText(summary);
      // Could add a toast notification here
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  // Convert the summary to speech and play it. A second click stops playback.
  const handleSpeak = async () => {
    if (!summary || isSynthesizing) return;

    if (audioRef.current) {
      stopAudio();
      return;
    }

    setError(null);

    // Replay the cached render instead of paying for synthesis again.
    const cache = audioCacheRef.current;
    if (cache.text === summary && cache.url) {
      try {
        await playAudio(cache.url);
      } catch (err) {
        console.error("Audio playback error:", err);
        setError("Could not play the generated audio.");
      }
      return;
    }

    setIsSynthesizing(true);

    try {
      const response = await fetch("http://localhost:5000/api/speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: summary }),
      });

      if (!response.ok) {
        let message = "Failed to generate audio";
        try {
          const errorData = await response.json();
          message = errorData.error || message;
        } catch {
          // Non-JSON error body: keep the generic message.
        }
        throw new Error(message);
      }

      const blob = await response.blob();
      stopAudio();

      if (audioCacheRef.current.url) {
        URL.revokeObjectURL(audioCacheRef.current.url);
      }

      const url = URL.createObjectURL(blob);
      audioCacheRef.current = { text: summary, url };

      await playAudio(url);
    } catch (err) {
      console.error("Text-to-speech error:", err);
      stopAudio();
      setError(err.message || "An error occurred while generating speech");
    } finally {
      setIsSynthesizing(false);
    }
  };

  const copyTranslation = async () => {
    if (!translatedText) return;
    try {
      await navigator.clipboard.writeText(translatedText);
      // Could add a toast notification here
    } catch (err) {
      console.error("Failed to copy translation:", err);
    }
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      extractedImages.forEach((image) => {
        URL.revokeObjectURL(image.url);
      });
    };
  }, [extractedImages]);

  // Stop playback and release the cached audio when leaving the page
  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
      if (audioCacheRef.current.url) {
        URL.revokeObjectURL(audioCacheRef.current.url);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-cream text-ink py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="mb-4 text-[32px] font-medium tracking-heading sm:text-[44px] lg:text-heading-2">
            <span className="text-ink">PDF</span> Summarization & Tools
          </h1>
          <p className="mx-auto max-w-2xl text-body-lg text-muted">
            Upload your PDF document to summarize, extract images, and translate
            content
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/40 rounded-xl">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-error"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-error">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Upload and Controls */}
          <div className="space-y-6">
            {/* Upload Area */}
            <div className="bg-sand p-6 sm:p-8 rounded-3xl border border-sand">
              <h2 className="text-2xl font-medium mb-4">Upload Document</h2>

              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  dragActive
                    ? "border-accent bg-accent/10"
                    : uploadedFile
                      ? "border-mint bg-mint/10"
                      : "border-mist hover:border-accent"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {uploadedFile ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-full bg-mint flex items-center justify-center mx-auto">
                      <svg
                        className="w-8 h-8 text-ink"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-medium text-ink">
                        File Uploaded Successfully
                      </p>
                      <p className="text-body">{uploadedFile.name}</p>
                      <p className="text-sm text-muted">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={removeFile}
                      className="text-error hover:text-error text-sm transition-colors duration-200"
                    >
                      Remove File
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-full bg-accent/15 text-ink ring-1 ring-inset ring-accent/30 flex items-center justify-center mx-auto">
                      <svg
                        className="w-8 h-8 text-ink"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-medium">
                        Drag and drop your PDF here
                      </p>
                      <p className="text-muted">or click to browse files</p>
                      <p className="text-sm text-muted mt-2">
                        Maximum file size: 50MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Summarization Options */}
            <div className="bg-sand p-6 sm:p-8 rounded-3xl border border-sand">
              <h3 className="text-xl font-medium mb-4">
                Summarization Options
              </h3>

              <div className="space-y-4">
                {/* Summary Length */}
                <div>
                  <label className="block text-sm font-medium text-body mb-2">
                    Summary Length
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["short", "medium", "detailed"].map((length) => (
                      <button
                        key={length}
                        onClick={() => setSummaryLength(length)}
                        className={`rounded-pill px-3 py-2 text-sm font-medium transition-all duration-200 ${
                          summaryLength === length
                            ? "bg-accent text-ink"
                            : "bg-paper text-body hover:bg-cloud"
                        }`}
                      >
                        {length.charAt(0).toUpperCase() + length.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary Type */}
                <div>
                  <label className="block text-sm font-medium text-body mb-2">
                    Summary Type
                  </label>
                  <select
                    value={summaryType}
                    onChange={(e) => setSummaryType(e.target.value)}
                    className="w-full px-3 py-2 bg-paper border border-mist rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    <option value="general">General Summary</option>
                    <option value="bullet">Bullet Points</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {/* Summarize Button */}
              <button
                onClick={handleSummarize}
                disabled={!uploadedFile || isProcessing}
                className={`w-full rounded-pill py-4 px-6 font-medium text-lg transition-all duration-300 ${
                  !uploadedFile || isProcessing
                    ? "bg-paper text-muted cursor-not-allowed"
                    : "bg-accent hover:bg-accent-hover text-ink transform hover:scale-105"
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-ink"></div>
                    <span>Processing Document...</span>
                  </div>
                ) : (
                  "Generate Summary"
                )}
              </button>

              {/* Extract Images Button */}
              <button
                onClick={handleExtractImages}
                disabled={!uploadedFile || isExtractingImages}
                className={`w-full rounded-pill py-3 px-6 font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                  !uploadedFile || isExtractingImages
                    ? "border border-mist bg-paper text-muted cursor-not-allowed"
                    : "border border-mist bg-transparent text-ink hover:border-ink hover:text-ink"
                }`}
              >
                {isExtractingImages ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-ink"></div>
                    <span>Extracting Images...</span>
                  </>
                ) : (
                  <>
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
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Extract Images from PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Panel - Summary Output */}
          <div className="space-y-6">
            {/* Summary Section */}
            <div className="bg-sand p-6 sm:p-8 rounded-3xl border border-sand">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-medium">Summary Output</h2>

                {summary && (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSpeak}
                      disabled={isSynthesizing}
                      className={`rounded-full p-2 transition-colors duration-200 ${
                        isSynthesizing
                          ? "bg-paper text-muted cursor-wait"
                          : isSpeaking
                            ? "bg-ink text-cream hover:bg-body"
                            : "bg-paper hover:bg-cloud"
                      }`}
                      title={isSpeaking ? "Stop audio" : "Listen to summary"}
                      aria-label={
                        isSpeaking ? "Stop audio" : "Listen to summary"
                      }
                    >
                      {isSynthesizing ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-ink"></div>
                      ) : isSpeaking ? (
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M6 6h12v12H6z" />
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
                            d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M11 5L6 9H3v6h3l5 4V5z"
                          />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={copySummary}
                      className="rounded-full p-2 bg-paper hover:bg-cloud transition-colors duration-200"
                      title="Copy to Clipboard"
                    >
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
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={downloadSummary}
                      className="rounded-full p-2 bg-accent hover:bg-accent-hover transition-colors duration-200"
                      title="Download Summary"
                    >
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
                          d="M12 10v6m0 0l-4-4m4 4l4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              <div
                className={`min-h-[200px] ${
                  summary ? "" : "flex items-center justify-center"
                }`}
              >
                {summary ? (
                  <div className="bg-paper p-4 rounded-xl">
                    <FormatResponse content={summary} />

                    {/* Summary Stats */}
                    <div className="mt-4 pt-4 border-t border-mist space-y-1">
                      <div className="flex justify-between text-sm text-muted">
                        <span>Words: {summary.split(" ").length}</span>
                        <span>Characters: {summary.length}</span>
                        <span>
                          Reading Time: ~
                          {Math.ceil(summary.split(" ").length / 200)} min
                        </span>
                      </div>
                      {summaryMeta && (
                        <div className="flex justify-between text-xs text-muted">
                          <span>
                            Pages: {summaryMeta.pages} &middot; Sections named:{" "}
                            {summaryMeta.notes}
                          </span>
                          <span>
                            {summaryMeta.chunks} chunks &middot;{" "}
                            {summaryMeta.reduceLevels > 0
                              ? `${summaryMeta.reduceLevels} reduce level(s)`
                              : "direct reduce"}{" "}
                            &middot; {summaryMeta.inputTokens} in /{" "}
                            {summaryMeta.outputTokens} out tokens
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted">
                    <div className="w-16 h-16 rounded-full bg-paper flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-lg">Your summary will appear here</p>
                    <p className="text-sm">
                      Upload a PDF and click "Generate Summary" to get started
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Translation Section */}
            {summary && (
              <div className="bg-sand p-6 sm:p-8 rounded-3xl border border-sand">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-medium">Translation</h2>
                  {translatedText && (
                    <div className="flex space-x-2">
                      <button
                        onClick={copyTranslation}
                        className="rounded-full p-2 bg-paper hover:bg-cloud transition-colors duration-200"
                        title="Copy Translation"
                      >
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
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={downloadTranslation}
                        className="rounded-full p-2 bg-mint hover:bg-mint/80 transition-colors duration-200"
                        title="Download Translation"
                      >
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
                            d="M12 10v6m0 0l-4-4m4 4l4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-body mb-2">
                      Target Language
                    </label>
                    <select
                      value={targetLanguage}
                      onChange={(e) => setTargetLanguage(e.target.value)}
                      className="w-full px-3 py-2 bg-paper border border-mist rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-mint focus:border-transparent"
                    >
                      {languageOptions.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleTranslate}
                    disabled={!summary || isTranslating}
                    className={`w-full rounded-pill py-3 px-6 font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                      !summary || isTranslating
                        ? "bg-paper text-muted cursor-not-allowed"
                        : "bg-mint hover:bg-mint/80 text-ink transform hover:scale-105"
                    }`}
                  >
                    {isTranslating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-ink"></div>
                        <span>Translating...</span>
                      </>
                    ) : (
                      <>
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
                            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                          />
                        </svg>
                        <span>Translate Summary</span>
                      </>
                    )}
                  </button>

                  <FormatResponse content={translatedText} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Extracted Images Section */}
        {extractedImages.length > 0 && (
          <div className="mt-8 bg-sand p-6 sm:p-8 rounded-3xl border border-sand">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-medium">Extracted Images</h3>
                <p className="text-muted mt-1">
                  {extractedImages.length} image(s) found in the PDF
                </p>
              </div>
              <button
                onClick={downloadAllImages}
                className="rounded-pill px-5 py-2.5 bg-accent hover:bg-accent-hover text-ink font-medium transition-colors duration-200 flex items-center space-x-2"
              >
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
                    d="M12 10v6m0 0l-4-4m4 4l4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Download All</span>
              </button>
            </div>

            {extractionStatus && (
              <div className="mb-4 p-3 bg-paper rounded-xl text-body">
                {extractionStatus}
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {extractedImages.map((image) => (
                <div
                  key={image.id}
                  className="rounded-2xl overflow-hidden border border-mist"
                >
                  <div className="relative aspect-square">
                    <img
                      src={image.url}
                      alt={`Page ${image.page} Image`}
                      className="w-full h-full object-contain bg-sand"
                    />
                    <div className="absolute top-2 left-2 bg-cream/70 text-ink text-xs px-2 py-1 rounded-lg">
                      Page {image.page}
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex justify-between items-center">
                      <div className="text-sm truncate">{image.name}</div>
                      <button
                        onClick={() => downloadImage(image)}
                        className="p-1 hover:bg-cloud rounded-lg transition-colors duration-200"
                        title="Download Image"
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
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="text-xs text-muted mt-1">
                      {(image.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Document Statistics Section */}
        {summary && (
          <div className="mt-8 bg-sand p-6 sm:p-8 rounded-3xl border border-sand">
            <h3 className="text-xl font-medium mb-4">Document Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-sand bg-cream p-4 text-center">
                <div className="text-2xl font-medium text-ink">
                  {(uploadedFile.size / 1024 / 1024).toFixed(1)} MB
                </div>
                <div className="text-sm text-muted">File Size</div>
              </div>
              <div className="rounded-2xl border border-sand bg-cream p-4 text-center">
                <div className="text-2xl font-medium text-ink">
                  {summary.split(" ").length}
                </div>
                <div className="text-sm text-muted">Summary Words</div>
              </div>
              <div className="rounded-2xl border border-sand bg-cream p-4 text-center">
                <div className="text-2xl font-medium text-ink">
                  ~{Math.ceil(summary.split(" ").length / 200)}min
                </div>
                <div className="text-sm text-muted">Reading Time</div>
              </div>
              <div className="rounded-2xl border border-sand bg-cream p-4 text-center">
                <div className="text-2xl font-medium text-ink">
                  {extractedImages.length}
                </div>
                <div className="text-sm text-muted">Images Extracted</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MathChat Section - Remains the same */}
      <section className="w-full min-h-[60vh] flex items-center justify-center py-20 px-2 sm:px-8 bg-sand mt-16 rounded-3xl border border-sand">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="flex flex-col justify-center h-full px-2 md:px-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-full bg-accent p-3">
                  <svg
                    className="w-8 h-8 text-ink"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="text-2xl font-medium text-ink">
                  New Feature
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-medium mb-6 leading-tight">
                <span className="text-ink">Math</span>Chat
                <br />
                <span className="text-ink">AI Assistant</span>
              </h2>

              <p className="text-lg md:text-xl text-body mb-8 max-w-xl">
                Solve complex mathematical problems with step-by-step
                explanations. From algebra to calculus, get instant help with
                detailed reasoning and visual solutions powered by advanced AI.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-body">Algebra & Equations</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-stone rounded-full"></div>
                  <span className="text-body">Calculus Solutions</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-body">Geometry & Trigonometry</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-stone rounded-full"></div>
                  <span className="text-body">Statistics & Probability</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a href="/MathChat">
                  <button className="rounded-pill bg-accent px-8 py-4 text-lg font-medium text-ink hover:bg-accent-hover transition-all duration-300 transform hover:scale-105">
                    Try MathChat
                  </button>
                </a>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative flex justify-center items-center h-full px-2 md:px-8">
              <div className="bg-paper/80 backdrop-blur-md rounded-3xl p-8 border border-sand w-full max-w-md min-h-[420px] flex flex-col justify-between">
                {/* Mock Chat Interface */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="rounded-full bg-accent p-2 text-ink">
                    <svg
                      className="w-5 h-5 text-ink"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Math Assistant</div>
                    <div className="text-xs text-muted">
                      AI-powered solutions
                    </div>
                  </div>
                </div>

                {/* Sample Messages */}
                <div className="space-y-4">
                  <div className="bg-accent text-ink rounded-3xl p-4 ml-8">
                    <div className="text-sm">
                      Find the derivative of f(x) = x³ + 2x² - 5x + 1
                    </div>
                  </div>

                  <div className="bg-sand rounded-3xl p-4 mr-8">
                    <div className="text-sm text-body">
                      <div className="font-medium text-ink mb-2">Solution:</div>
                      Using the power rule:
                      <br />
                      • d/dx(x³) = 3x²
                      <br />
                      • d/dx(2x²) = 4x
                      <br />
                      • d/dx(-5x) = -5
                      <br />
                      • d/dx(1) = 0<br />
                      <br />
                      <span className="text-ink font-medium">
                        f'(x) = 3x² + 4x - 5
                      </span>
                    </div>
                  </div>
                </div>

                {/* Input Preview */}
                <div className="mt-6 flex gap-3">
                  <div className="flex-1 rounded-pill border border-sand bg-sand px-4 py-3 text-sm text-muted min-w-0">
                    Enter your math problem...
                  </div>
                  <div className="rounded-full bg-accent p-3 flex items-center justify-center text-ink">
                    <svg
                      className="w-5 h-5 text-ink"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-accent px-3 py-1 rounded-full text-sm font-medium text-ink animate-pulse">
                Live
              </div>
              <div className="absolute -bottom-4 -left-4 bg-accent px-4 py-2 rounded-full text-ink text-sm font-medium">
                ∑ ∫ √ ∞
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Summarization;
