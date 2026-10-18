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
//     <div className="min-h-screen bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold mb-4">
//             <span className="text-blue-400">PDF</span> Summarization
//           </h1>
//           <p className="text-xl text-gray-300 max-w-2xl mx-auto">
//             Upload your PDF document and get an intelligent, concise summary in
//             seconds
//           </p>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
//             <div className="flex items-center">
//               <svg
//                 className="w-5 h-5 mr-2 text-red-400"
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
//               <span className="text-red-300">{error}</span>
//             </div>
//           </div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Left Panel - Upload and Controls */}
//           <div className="space-y-6">
//             {/* Upload Area */}
//             <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
//               <h2 className="text-2xl font-semibold mb-4">Upload Document</h2>

//               <div
//                 className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
//                   dragActive
//                     ? "border-blue-400 bg-blue-400/10"
//                     : uploadedFile
//                     ? "border-green-400 bg-green-400/10"
//                     : "border-gray-600 hover:border-gray-500"
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
//                     <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mx-auto">
//                       <svg
//                         className="w-8 h-8 text-white"
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
//                       <p className="text-lg font-medium text-green-400">
//                         File Uploaded Successfully
//                       </p>
//                       <p className="text-gray-300">{uploadedFile.name}</p>
//                       <p className="text-sm text-gray-400">
//                         {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
//                       </p>
//                     </div>
//                     <button
//                       onClick={removeFile}
//                       className="text-red-400 hover:text-red-300 text-sm transition-colors duration-200"
//                     >
//                       Remove File
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
//                       <svg
//                         className="w-8 h-8 text-white"
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
//                       <p className="text-gray-400">or click to browse files</p>
//                       <p className="text-sm text-gray-500 mt-2">
//                         Maximum file size: 50MB
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Summarization Options */}
//             <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
//               <h3 className="text-xl font-semibold mb-4">
//                 Summarization Options
//               </h3>

//               <div className="space-y-4">
//                 {/* Summary Length */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">
//                     Summary Length
//                   </label>
//                   <div className="grid grid-cols-3 gap-2">
//                     {["short", "medium", "detailed"].map((length) => (
//                       <button
//                         key={length}
//                         onClick={() => setSummaryLength(length)}
//                         className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
//                           summaryLength === length
//                             ? "bg-blue-600 text-white"
//                             : "bg-gray-700 text-gray-300 hover:bg-gray-600"
//                         }`}
//                       >
//                         {length.charAt(0).toUpperCase() + length.slice(1)}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Summary Type */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">
//                     Summary Type
//                   </label>
//                   <select
//                     value={summaryType}
//                     onChange={(e) => setSummaryType(e.target.value)}
//                     className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
//               className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ${
//                 !uploadedFile || isProcessing
//                   ? "bg-gray-700 text-gray-400 cursor-not-allowed"
//                   : "bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105"
//               }`}
//             >
//               {isProcessing ? (
//                 <div className="flex items-center justify-center space-x-2">
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                   <span>Processing Document...</span>
//                 </div>
//               ) : (
//                 "Generate Summary"
//               )}
//             </button>
//           </div>

//           {/* Right Panel - Summary Output */}
//           <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-2xl font-semibold">Summary Output</h2>

//               {summary && (
//                 <div className="flex space-x-2">
//                   <button
//                     onClick={copySummary}
//                     className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200"
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
//                     className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
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
//                 <div className="bg-gray-700 p-4 rounded-lg">
//                   <div className="prose prose-invert max-w-none">
//                     <div className="text-gray-100 leading-relaxed whitespace-pre-line">
//                       {summary}
//                     </div>
//                   </div>

//                   {/* Summary Stats */}
//                   <div className="mt-6 pt-4 border-t border-gray-600">
//                     <div className="flex justify-between text-sm text-gray-400">
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
//                 <div className="text-center text-gray-400">
//                   <div className="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
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
//           <div className="mt-8 bg-gray-800 p-6 rounded-xl border border-gray-700">
//             <h3 className="text-xl font-semibold mb-4">Document Statistics</h3>
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               <div className="bg-gray-700 p-4 rounded-lg text-center">
//                 <div className="text-2xl font-bold text-blue-400">
//                   {(uploadedFile.size / 1024 / 1024).toFixed(1)} MB
//                 </div>
//                 <div className="text-sm text-gray-400">File Size</div>
//               </div>
//               <div className="bg-gray-700 p-4 rounded-lg text-center">
//                 <div className="text-2xl font-bold text-green-400">
//                   {summary.split(" ").length}
//                 </div>
//                 <div className="text-sm text-gray-400">Summary Words</div>
//               </div>
//               <div className="bg-gray-700 p-4 rounded-lg text-center">
//                 <div className="text-2xl font-bold text-yellow-400">
//                   ~{Math.ceil(summary.split(" ").length / 200)}min
//                 </div>
//                 <div className="text-sm text-gray-400">Reading Time</div>
//               </div>
//               <div className="bg-gray-700 p-4 rounded-lg text-center">
//                 <div className="text-2xl font-bold text-purple-400">
//                   {summaryType.charAt(0).toUpperCase() + summaryType.slice(1)}
//                 </div>
//                 <div className="text-sm text-gray-400">Summary Type</div>
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
//     <div className="min-h-screen bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold mb-4">
//             <span className="text-blue-400">PDF</span> Summarization
//           </h1>
//           <p className="text-xl text-gray-300 max-w-2xl mx-auto">
//             Upload your PDF document and get an intelligent, concise summary in
//             seconds
//           </p>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
//             <div className="flex items-center">
//               <svg
//                 className="w-5 h-5 mr-2 text-red-400"
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
//               <span className="text-red-300">{error}</span>
//             </div>
//           </div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Left Panel - Upload and Controls */}
//           <div className="space-y-6">
//             {/* Upload Area */}
//             <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
//               <h2 className="text-2xl font-semibold mb-4">Upload Document</h2>

//               <div
//                 className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
//                   dragActive
//                     ? "border-blue-400 bg-blue-400/10"
//                     : uploadedFile
//                     ? "border-green-400 bg-green-400/10"
//                     : "border-gray-600 hover:border-gray-500"
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
//                     <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mx-auto">
//                       <svg
//                         className="w-8 h-8 text-white"
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
//                       <p className="text-lg font-medium text-green-400">
//                         File Uploaded Successfully
//                       </p>
//                       <p className="text-gray-300">{uploadedFile.name}</p>
//                       <p className="text-sm text-gray-400">
//                         {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
//                       </p>
//                     </div>
//                     <button
//                       onClick={removeFile}
//                       className="text-red-400 hover:text-red-300 text-sm transition-colors duration-200"
//                     >
//                       Remove File
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
//                       <svg
//                         className="w-8 h-8 text-white"
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
//                       <p className="text-gray-400">or click to browse files</p>
//                       <p className="text-sm text-gray-500 mt-2">
//                         Maximum file size: 50MB
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Summarization Options */}
//             <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
//               <h3 className="text-xl font-semibold mb-4">
//                 Summarization Options
//               </h3>

//               <div className="space-y-4">
//                 {/* Summary Length */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">
//                     Summary Length
//                   </label>
//                   <div className="grid grid-cols-3 gap-2">
//                     {["short", "medium", "detailed"].map((length) => (
//                       <button
//                         key={length}
//                         onClick={() => setSummaryLength(length)}
//                         className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
//                           summaryLength === length
//                             ? "bg-blue-600 text-white"
//                             : "bg-gray-700 text-gray-300 hover:bg-gray-600"
//                         }`}
//                       >
//                         {length.charAt(0).toUpperCase() + length.slice(1)}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Summary Type */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">
//                     Summary Type
//                   </label>
//                   <select
//                     value={summaryType}
//                     onChange={(e) => setSummaryType(e.target.value)}
//                     className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
//               className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ${
//                 !uploadedFile || isProcessing
//                   ? "bg-gray-700 text-gray-400 cursor-not-allowed"
//                   : "bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105"
//               }`}
//             >
//               {isProcessing ? (
//                 <div className="flex items-center justify-center space-x-2">
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                   <span>Processing Document...</span>
//                 </div>
//               ) : (
//                 "Generate Summary"
//               )}
//             </button>
//           </div>

//           {/* Right Panel - Summary Output */}
//           <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-2xl font-semibold">Summary Output</h2>

//               {summary && (
//                 <div className="flex space-x-2">
//                   <button
//                     onClick={copySummary}
//                     className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200"
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
//                     className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
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
//                 <div className="bg-gray-700 p-4 rounded-lg">
//                   <div className="prose prose-invert max-w-none">
//                     <div className="text-gray-100 leading-relaxed whitespace-pre-line">
//                       {summary}
//                     </div>
//                   </div>

//                   {/* Summary Stats */}
//                   <div className="mt-6 pt-4 border-t border-gray-600">
//                     <div className="flex justify-between text-sm text-gray-400">
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
//                 <div className="text-center text-gray-400">
//                   <div className="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
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
//           <div className="mt-8 bg-gray-800 p-6 rounded-xl border border-gray-700">
//             <h3 className="text-xl font-semibold mb-4">Document Statistics</h3>
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               <div className="bg-gray-700 p-4 rounded-lg text-center">
//                 <div className="text-2xl font-bold text-blue-400">
//                   {(uploadedFile.size / 1024 / 1024).toFixed(1)} MB
//                 </div>
//                 <div className="text-sm text-gray-400">File Size</div>
//               </div>
//               <div className="bg-gray-700 p-4 rounded-lg text-center">
//                 <div className="text-2xl font-bold text-green-400">
//                   {summary.split(" ").length}
//                 </div>
//                 <div className="text-sm text-gray-400">Summary Words</div>
//               </div>
//               <div className="bg-gray-700 p-4 rounded-lg text-center">
//                 <div className="text-2xl font-bold text-yellow-400">
//                   ~{Math.ceil(summary.split(" ").length / 200)}min
//                 </div>
//                 <div className="text-sm text-gray-400">Reading Time</div>
//               </div>
//               <div className="bg-gray-700 p-4 rounded-lg text-center">
//                 <div className="text-2xl font-bold text-purple-400">
//                   {summaryType.charAt(0).toUpperCase() + summaryType.slice(1)}
//                 </div>
//                 <div className="text-sm text-gray-400">Summary Type</div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//       {/* MathChat Section - Full Width and Centered */}
//       <section className="w-full min-h-[60vh] flex items-center justify-center py-20 px-2 sm:px-8 bg-gradient-to-br from-purple-900 via-gray-800 to-blue-900 mt-16">
//         <div className="w-full max-w-6xl mx-auto">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
//             {/* Left Content */}
//             <div className="flex flex-col justify-center h-full px-2 md:px-8">
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="bg-gradient-to-r from-purple-500 to-blue-600 p-3 rounded-lg">
//                   <svg
//                     className="w-8 h-8 text-white"
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
//                 <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
//                   New Feature
//                 </span>
//               </div>

//               <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
//                 <span className="text-purple-400">Math</span>Chat
//                 <br />
//                 <span className="text-white">AI Assistant</span>
//               </h2>

//               <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl">
//                 Solve complex mathematical problems with step-by-step
//                 explanations. From algebra to calculus, get instant help with
//                 detailed reasoning and visual solutions powered by advanced AI.
//               </p>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
//                 <div className="flex items-center gap-3">
//                   <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
//                   <span className="text-gray-300">Algebra & Equations</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
//                   <span className="text-gray-300">Calculus Solutions</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
//                   <span className="text-gray-300">Geometry & Trigonometry</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
//                   <span className="text-gray-300">
//                     Statistics & Probability
//                   </span>
//                 </div>
//               </div>

//               <div className="flex flex-col sm:flex-row gap-4">
//                 <a href="/MathChat">
//                   <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105">
//                     Try MathChat
//                   </button>
//                 </a>
//               </div>
//             </div>

//             {/* Right Visual */}
//             <div className="relative flex justify-center items-center h-full px-2 md:px-8">
//               <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-8 border border-gray-700 w-full max-w-md min-h-[420px] flex flex-col justify-between shadow-2xl">
//                 {/* Mock Chat Interface */}
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="bg-gradient-to-r from-purple-500 to-blue-600 p-2 rounded-full">
//                     <svg
//                       className="w-5 h-5 text-white"
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                   </div>
//                   <div>
//                     <div className="text-sm font-semibold">Math Assistant</div>
//                     <div className="text-xs text-gray-400">
//                       AI-powered solutions
//                     </div>
//                   </div>
//                 </div>

//                 {/* Sample Messages */}
//                 <div className="space-y-4">
//                   <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-4 ml-8">
//                     <div className="text-sm">
//                       Find the derivative of f(x) = x³ + 2x² - 5x + 1
//                     </div>
//                   </div>

//                   <div className="bg-gray-800 rounded-2xl p-4 mr-8">
//                     <div className="text-sm text-gray-300">
//                       <div className="font-semibold text-white mb-2">
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
//                       <span className="text-purple-400 font-semibold">
//                         f'(x) = 3x² + 4x - 5
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Input Preview */}
//                 <div className="mt-6 flex gap-3">
//                   <div className="flex-1 bg-gray-700 rounded-xl px-4 py-3 text-sm text-gray-400 min-w-0">
//                     Enter your math problem...
//                   </div>
//                   <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-xl flex items-center justify-center">
//                     <svg
//                       className="w-5 h-5 text-white"
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
//               <div className="absolute -top-4 -right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse shadow-lg">
//                 Live
//               </div>
//               <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
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

import React, { useState, useEffect } from "react";
import { PDFDocument } from "pdf-lib";

const Summarization = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState("");
  const [summaryLength, setSummaryLength] = useState("medium");
  const [summaryType, setSummaryType] = useState("general");
  const [error, setError] = useState(null);

  // New states for translation
  const [translatedText, setTranslatedText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("eng_Latn");
  const [isTranslating, setIsTranslating] = useState(false);

  // New states for image extraction
  const [extractedImages, setExtractedImages] = useState([]);
  const [isExtractingImages, setIsExtractingImages] = useState(false);
  const [extractionStatus, setExtractionStatus] = useState("");

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
    } catch (err) {
      console.error("Summarization error:", err);
      setError(
        err.message || "An error occurred while summarizing the document"
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
                err
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
    setUploadedFile(null);
    setSummary("");
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

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-blue-400">PDF</span> Summarization & Tools
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Upload your PDF document to summarize, extract images, and translate
            content
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-red-400"
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
              <span className="text-red-300">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Upload and Controls */}
          <div className="space-y-6">
            {/* Upload Area */}
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4">Upload Document</h2>

              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                  dragActive
                    ? "border-blue-400 bg-blue-400/10"
                    : uploadedFile
                    ? "border-green-400 bg-green-400/10"
                    : "border-gray-600 hover:border-gray-500"
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
                    <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mx-auto">
                      <svg
                        className="w-8 h-8 text-white"
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
                      <p className="text-lg font-medium text-green-400">
                        File Uploaded Successfully
                      </p>
                      <p className="text-gray-300">{uploadedFile.name}</p>
                      <p className="text-sm text-gray-400">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={removeFile}
                      className="text-red-400 hover:text-red-300 text-sm transition-colors duration-200"
                    >
                      Remove File
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
                      <svg
                        className="w-8 h-8 text-white"
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
                      <p className="text-gray-400">or click to browse files</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Maximum file size: 50MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Summarization Options */}
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">
                Summarization Options
              </h3>

              <div className="space-y-4">
                {/* Summary Length */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Summary Length
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["short", "medium", "detailed"].map((length) => (
                      <button
                        key={length}
                        onClick={() => setSummaryLength(length)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          summaryLength === length
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        {length.charAt(0).toUpperCase() + length.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Summary Type
                  </label>
                  <select
                    value={summaryType}
                    onChange={(e) => setSummaryType(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ${
                  !uploadedFile || isProcessing
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105"
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                  !uploadedFile || isExtractingImages
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 text-white transform hover:scale-105"
                }`}
              >
                {isExtractingImages ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Summary Output</h2>

                {summary && (
                  <div className="flex space-x-2">
                    <button
                      onClick={copySummary}
                      className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200"
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
                      className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
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
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="prose prose-invert max-w-none">
                      <div className="text-gray-100 leading-relaxed whitespace-pre-line">
                        {summary}
                      </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="mt-4 pt-4 border-t border-gray-600">
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>Words: {summary.split(" ").length}</span>
                        <span>Characters: {summary.length}</span>
                        <span>
                          Reading Time: ~
                          {Math.ceil(summary.split(" ").length / 200)} min
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
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
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold">Translation</h2>
                  {translatedText && (
                    <div className="flex space-x-2">
                      <button
                        onClick={copyTranslation}
                        className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200"
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
                        className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200"
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
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Target Language
                    </label>
                    <select
                      value={targetLanguage}
                      onChange={(e) => setTargetLanguage(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                      !summary || isTranslating
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 text-white transform hover:scale-105"
                    }`}
                  >
                    {isTranslating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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

                  {translatedText && (
                    <div className="bg-gray-700 p-4 rounded-lg mt-4">
                      <div className="text-gray-100 leading-relaxed whitespace-pre-line">
                        {translatedText}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Extracted Images Section */}
        {extractedImages.length > 0 && (
          <div className="mt-8 bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-semibold">Extracted Images</h3>
                <p className="text-gray-400 mt-1">
                  {extractedImages.length} image(s) found in the PDF
                </p>
              </div>
              <button
                onClick={downloadAllImages}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
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
              <div className="mb-4 p-3 bg-gray-700 rounded-lg text-gray-300">
                {extractionStatus}
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {extractedImages.map((image) => (
                <div
                  key={image.id}
                  className="bg-gray-700 rounded-lg overflow-hidden border border-gray-600"
                >
                  <div className="relative aspect-square">
                    <img
                      src={image.url}
                      alt={`Page ${image.page} Image`}
                      className="w-full h-full object-contain bg-gray-800"
                    />
                    <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      Page {image.page}
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex justify-between items-center">
                      <div className="text-sm truncate">{image.name}</div>
                      <button
                        onClick={() => downloadImage(image)}
                        className="p-1 hover:bg-gray-600 rounded transition-colors duration-200"
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
                    <div className="text-xs text-gray-400 mt-1">
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
          <div className="mt-8 bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-xl font-semibold mb-4">Document Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {(uploadedFile.size / 1024 / 1024).toFixed(1)} MB
                </div>
                <div className="text-sm text-gray-400">File Size</div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-400">
                  {summary.split(" ").length}
                </div>
                <div className="text-sm text-gray-400">Summary Words</div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  ~{Math.ceil(summary.split(" ").length / 200)}min
                </div>
                <div className="text-sm text-gray-400">Reading Time</div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {extractedImages.length}
                </div>
                <div className="text-sm text-gray-400">Images Extracted</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MathChat Section - Remains the same */}
      <section className="w-full min-h-[60vh] flex items-center justify-center py-20 px-2 sm:px-8 bg-gradient-to-br from-purple-900 via-gray-800 to-blue-900 mt-16 rounded-3xl shadow-2xl border border-gray-700">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="flex flex-col justify-center h-full px-2 md:px-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-blue-600 p-3 rounded-lg">
                  <svg
                    className="w-8 h-8 text-white"
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
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  New Feature
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                <span className="text-purple-400">Math</span>Chat
                <br />
                <span className="text-white">AI Assistant</span>
              </h2>

              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl">
                Solve complex mathematical problems with step-by-step
                explanations. From algebra to calculus, get instant help with
                detailed reasoning and visual solutions powered by advanced AI.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-300">Algebra & Equations</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300">Calculus Solutions</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-300">Geometry & Trigonometry</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300">
                    Statistics & Probability
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a href="/MathChat">
                  <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105">
                    Try MathChat
                  </button>
                </a>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative flex justify-center items-center h-full px-2 md:px-8">
              <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-8 border border-gray-700 w-full max-w-md min-h-[420px] flex flex-col justify-between shadow-2xl">
                {/* Mock Chat Interface */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-600 p-2 rounded-full">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Math Assistant</div>
                    <div className="text-xs text-gray-400">
                      AI-powered solutions
                    </div>
                  </div>
                </div>

                {/* Sample Messages */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-4 ml-8">
                    <div className="text-sm">
                      Find the derivative of f(x) = x³ + 2x² - 5x + 1
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-2xl p-4 mr-8">
                    <div className="text-sm text-gray-300">
                      <div className="font-semibold text-white mb-2">
                        Solution:
                      </div>
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
                      <span className="text-purple-400 font-semibold">
                        f'(x) = 3x² + 4x - 5
                      </span>
                    </div>
                  </div>
                </div>

                {/* Input Preview */}
                <div className="mt-6 flex gap-3">
                  <div className="flex-1 bg-gray-700 rounded-xl px-4 py-3 text-sm text-gray-400 min-w-0">
                    Enter your math problem...
                  </div>
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
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
              <div className="absolute -top-4 -right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse shadow-lg">
                Live
              </div>
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
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
