// import React, { useState, useRef, useEffect } from "react";
// import { Send, Bot, User, Calculator } from "lucide-react";

// function MathChat() {
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       type: "bot",
//       content:
//         "Hello! I'm your Math Assistant. I can help you solve mathematical problems, equations, and provide step-by-step reasoning. What would you like to work on today?",
//       timestamp: new Date().toLocaleTimeString(),
//     },
//   ]);
//   const [inputText, setInputText] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef(null);
//   const textareaRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const adjustTextareaHeight = () => {
//     const textarea = textareaRef.current;
//     if (textarea) {
//       textarea.style.height = "auto";
//       textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
//     }
//   };

//   useEffect(() => {
//     adjustTextareaHeight();
//   }, [inputText]);

//   const callHuggingFaceAPI = async (prompt) => {
//     const response = await fetch("http://localhost:5000/api/reasoning", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ prompt }),
//     });

//     const data = await response.json();
//     return data.answer || "Sorry, I couldn't process your request.";
//   };

//   const handleSubmit = async () => {
//     if (!inputText.trim() || isLoading) return;

//     const userMessage = {
//       id: messages.length + 1,
//       type: "user",
//       content: inputText.trim(),
//       timestamp: new Date().toLocaleTimeString(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setInputText("");
//     setIsLoading(true);

//     try {
//       const response = await callHuggingFaceAPI(inputText.trim());

//       const botMessage = {
//         id: messages.length + 2,
//         type: "bot",
//         content: response,
//         timestamp: new Date().toLocaleTimeString(),
//       };

//       setMessages((prev) => [...prev, botMessage]);
//     } catch (error) {
//       const errorMessage = {
//         id: messages.length + 2,
//         type: "bot",
//         content:
//           "Sorry, I encountered an error while processing your request. Please try again.",
//         timestamp: new Date().toLocaleTimeString(),
//       };
//       setMessages((prev) => [...prev, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-cream text-ink flex flex-col">
//       {/* Header */}
//       <div className="border-b border-sand bg-cream/90 p-4 backdrop-blur-xl">
//         <div className="max-w-4xl mx-auto flex items-center gap-3">
//           <div className="rounded-full bg-accent p-2 text-ink">
//             <Calculator className="w-6 h-6" />
//           </div>
//           <div>
//             <h1 className="text-xl font-medium text-ink">
//               Math Assistant
//             </h1>
//             <p className="text-muted text-sm">
//               Solve mathematical problems with AI
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Chat Messages */}
//       <div className="flex-1 overflow-hidden">
//         <div className="max-w-4xl mx-auto h-full flex flex-col">
//           <div className="flex-1 overflow-y-auto p-4 space-y-4">
//             {messages.map((message) => (
//               <div
//                 key={message.id}
//                 className={`flex gap-3 ${
//                   message.type === "user" ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 {message.type === "bot" && (
//                   <div className="bg-accent text-ink p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
//                     <Bot className="w-4 h-4" />
//                   </div>
//                 )}

//                 <div
//                   className={`max-w-[80%] rounded-3xl p-4 ${
//                     message.type === "user"
//                       ? "bg-accent text-ink ml-auto"
//                       : "bg-sand border border-sand"
//                   }`}
//                 >
//                   <div className="whitespace-pre-wrap text-sm leading-relaxed">
//                     {message.content}
//                   </div>
//                   <div className="text-xs opacity-60 mt-2">
//                     {message.timestamp}
//                   </div>
//                 </div>

//                 {message.type === "user" && (
//                   <div className="bg-mint text-ink p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
//                     <User className="w-4 h-4" />
//                   </div>
//                 )}
//               </div>
//             ))}

//             {isLoading && (
//               <div className="flex gap-3 justify-start">
//                 <div className="bg-accent text-ink p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
//                   <Bot className="w-4 h-4" />
//                 </div>
//                 <div className="bg-sand border border-sand rounded-3xl p-4">
//                   <div className="flex gap-1">
//                     <div className="w-2 h-2 bg-stone rounded-full animate-bounce"></div>
//                     <div
//                       className="w-2 h-2 bg-stone rounded-full animate-bounce"
//                       style={{ animationDelay: "0.1s" }}
//                     ></div>
//                     <div
//                       className="w-2 h-2 bg-stone rounded-full animate-bounce"
//                       style={{ animationDelay: "0.2s" }}
//                     ></div>
//                   </div>
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>
//         </div>
//       </div>

//       {/* Input Area */}
//       <div className="bg-sand border-t border-sand p-4">
//         <div className="max-w-4xl mx-auto">
//           <div className="flex gap-3 items-end">
//             <div className="flex-1 relative">
//               <textarea
//                 ref={textareaRef}
//                 value={inputText}
//                 onChange={(e) => setInputText(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 placeholder="Enter your math problem here... (e.g., 'Find the derivative of x³ + 2x² - 5x + 1')"
//                 className="w-full rounded-3xl bg-paper border border-mist px-5 py-3.5 pr-12 text-ink placeholder-muted resize-none focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent min-h-[50px] max-h-[120px]"
//                 rows="1"
//                 disabled={isLoading}
//               />
//             </div>
//             <button
//               type="button"
//               onClick={handleSubmit}
//               disabled={!inputText.trim() || isLoading}
//               className="bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-ink p-3 rounded-full transition-all duration-200 flex items-center justify-center min-w-[50px] h-[50px]"
//             >
//               <Send className="w-5 h-5" />
//             </button>
//           </div>

//           {/* Quick suggestions */}
//           <div className="mt-3 flex flex-wrap gap-2">
//             {[
//               "Solve quadratic equation",
//               "Find derivative",
//               "Calculate integral",
//               "Matrix operations",
//             ].map((suggestion) => (
//               <button
//                 key={suggestion}
//                 onClick={() => setInputText(suggestion)}
//                 className="px-3 py-1 text-xs bg-paper hover:bg-cloud border border-mist rounded-full text-body hover:text-ink transition-colors"
//                 disabled={isLoading}
//               >
//                 {suggestion}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default MathChat;

//new

// import React, { useState, useRef, useEffect } from "react";
// import { Send, Bot, User, Calculator } from "lucide-react";

// function MathChat() {
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       type: "bot",
//       content:
//         "Hello! I'm your Math Assistant. I can help you solve mathematical problems, equations, and provide step-by-step reasoning. What would you like to work on today?",
//       timestamp: new Date().toLocaleTimeString(),
//     },
//   ]);
//   const [inputText, setInputText] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef(null);
//   const textareaRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const adjustTextareaHeight = () => {
//     const textarea = textareaRef.current;
//     if (textarea) {
//       textarea.style.height = "auto";
//       textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
//     }
//   };

//   useEffect(() => {
//     adjustTextareaHeight();
//   }, [inputText]);

//   // ✅ Call backend with Cohere API
//   const callCohereAPI = async (prompt) => {
//     const response = await fetch("http://localhost:5000/api/reasoning", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ prompt }),
//     });

//     const data = await response.json();
//     return data.answer || "Sorry, I couldn't process your request.";
//   };

//   const handleSubmit = async () => {
//     if (!inputText.trim() || isLoading) return;

//     const userMessage = {
//       id: messages.length + 1,
//       type: "user",
//       content: inputText.trim(),
//       timestamp: new Date().toLocaleTimeString(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setInputText("");
//     setIsLoading(true);

//     try {
//       const response = await callCohereAPI(inputText.trim());

//       const botMessage = {
//         id: messages.length + 2,
//         type: "bot",
//         content: response,
//         timestamp: new Date().toLocaleTimeString(),
//       };

//       setMessages((prev) => [...prev, botMessage]);
//     } catch (error) {
//       const errorMessage = {
//         id: messages.length + 2,
//         type: "bot",
//         content:
//           "Sorry, I encountered an error while processing your request. Please try again.",
//         timestamp: new Date().toLocaleTimeString(),
//       };
//       setMessages((prev) => [...prev, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-cream text-ink flex flex-col">
//       {/* Header */}
//       <div className="border-b border-sand bg-cream/90 p-4 backdrop-blur-xl">
//         <div className="max-w-4xl mx-auto flex items-center gap-3">
//           <div className="rounded-full bg-accent p-2 text-ink">
//             <Calculator className="w-6 h-6" />
//           </div>
//           <div>
//             <h1 className="text-xl font-medium text-ink">
//               Math Assistant
//             </h1>
//             <p className="text-muted text-sm">
//               Solve mathematical problems with AI
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Chat Messages */}
//       <div className="flex-1 overflow-hidden">
//         <div className="max-w-4xl mx-auto h-full flex flex-col">
//           <div className="flex-1 overflow-y-auto p-4 space-y-4">
//             {messages.map((message) => (
//               <div
//                 key={message.id}
//                 className={`flex gap-3 ${
//                   message.type === "user" ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 {message.type === "bot" && (
//                   <div className="bg-accent text-ink p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
//                     <Bot className="w-4 h-4" />
//                   </div>
//                 )}

//                 <div
//                   className={`max-w-[80%] rounded-3xl p-4 ${
//                     message.type === "user"
//                       ? "bg-accent text-ink ml-auto"
//                       : "bg-sand border border-sand"
//                   }`}
//                 >
//                   <div className="whitespace-pre-wrap text-sm leading-relaxed">
//                     {message.content}
//                   </div>
//                   <div className="text-xs opacity-60 mt-2">
//                     {message.timestamp}
//                   </div>
//                 </div>

//                 {message.type === "user" && (
//                   <div className="bg-mint text-ink p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
//                     <User className="w-4 h-4" />
//                   </div>
//                 )}
//               </div>
//             ))}

//             {isLoading && (
//               <div className="flex gap-3 justify-start">
//                 <div className="bg-accent text-ink p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
//                   <Bot className="w-4 h-4" />
//                 </div>
//                 <div className="bg-sand border border-sand rounded-3xl p-4">
//                   <div className="flex gap-1">
//                     <div className="w-2 h-2 bg-stone rounded-full animate-bounce"></div>
//                     <div
//                       className="w-2 h-2 bg-stone rounded-full animate-bounce"
//                       style={{ animationDelay: "0.1s" }}
//                     ></div>
//                     <div
//                       className="w-2 h-2 bg-stone rounded-full animate-bounce"
//                       style={{ animationDelay: "0.2s" }}
//                     ></div>
//                   </div>
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>
//         </div>
//       </div>

//       {/* Input Area */}
//       <div className="bg-sand border-t border-sand p-4">
//         <div className="max-w-4xl mx-auto">
//           <div className="flex gap-3 items-end">
//             <div className="flex-1 relative">
//               <textarea
//                 ref={textareaRef}
//                 value={inputText}
//                 onChange={(e) => setInputText(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 placeholder="Enter your math problem here... (e.g., 'Find the derivative of x³ + 2x² - 5x + 1')"
//                 className="w-full rounded-3xl bg-paper border border-mist px-5 py-3.5 pr-12 text-ink placeholder-muted resize-none focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent min-h-[50px] max-h-[120px]"
//                 rows="1"
//                 disabled={isLoading}
//               />
//             </div>
//             <button
//               type="button"
//               onClick={handleSubmit}
//               disabled={!inputText.trim() || isLoading}
//               className="bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-ink p-3 rounded-full transition-all duration-200 flex items-center justify-center min-w-[50px] h-[50px]"
//             >
//               <Send className="w-5 h-5" />
//             </button>
//           </div>

//           {/* Quick suggestions */}
//           <div className="mt-3 flex flex-wrap gap-2">
//             {[
//               "Solve quadratic equation",
//               "Find derivative",
//               "Calculate integral",
//               "Matrix operations",
//             ].map((suggestion) => (
//               <button
//                 key={suggestion}
//                 onClick={() => setInputText(suggestion)}
//                 className="px-3 py-1 text-xs bg-paper hover:bg-cloud border border-mist rounded-full text-body hover:text-ink transition-colors"
//                 disabled={isLoading}
//               >
//                 {suggestion}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default MathChat;

//modified with text book readability responses for Api

// import React, { useState, useRef, useEffect } from "react";
// import { Send, Bot, User, Calculator, Mic } from "lucide-react";

// // --- Utility: Format LaTeX math to textbook style ---
// const formatMathResponse = (text) => {
//   if (!text) return "";

//   let formatted = text;

//   // Remove inline/display math markers
//   formatted = formatted.replace(/\$/g, "").replace(/\\\(|\\\)|\\\[|\\\]/g, "");

//   // Fractions \frac{a}{b} -> (a/b)
//   formatted = formatted.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1/$2)");

//   // Superscripts x^{2} -> x² (digits and variables)
//   formatted = formatted.replace(/\^\{([^}]+)\}/g, (_, content) => {
//     const superMap = {
//       0: "⁰",
//       1: "¹",
//       2: "²",
//       3: "³",
//       4: "⁴",
//       5: "⁵",
//       6: "⁶",
//       7: "⁷",
//       8: "⁸",
//       9: "⁹",
//       "+": "⁺",
//       "-": "⁻",
//       "=": "⁼",
//       "(": "⁽",
//       ")": "⁾",
//       n: "ⁿ",
//       i: "ⁱ",
//     };
//     return content
//       .split("")
//       .map((c) => superMap[c] || c)
//       .join("");
//   });
//   // simple superscript: x^2
//   formatted = formatted.replace(/\^([0-9])/g, (_, num) => {
//     const superMap = {
//       0: "⁰",
//       1: "¹",
//       2: "²",
//       3: "³",
//       4: "⁴",
//       5: "⁵",
//       6: "⁶",
//       7: "⁷",
//       8: "⁸",
//       9: "⁹",
//     };
//     return superMap[num] || num;
//   });

//   // Subscripts x_{1} -> x₁
//   formatted = formatted.replace(/_\{([^}]+)\}/g, (_, content) => {
//     const subMap = {
//       0: "₀",
//       1: "₁",
//       2: "₂",
//       3: "₃",
//       4: "₄",
//       5: "₅",
//       6: "₆",
//       7: "₇",
//       8: "₈",
//       9: "₉",
//       "+": "₊",
//       "-": "₋",
//       "=": "₌",
//       "(": "₍",
//       ")": "₎",
//       a: "ₐ",
//       e: "ₑ",
//       i: "ᵢ",
//       j: "ⱼ",
//       o: "ₒ",
//       r: "ᵣ",
//       u: "ᵤ",
//       v: "ᵥ",
//       x: "ₓ",
//     };
//     return content
//       .split("")
//       .map((c) => subMap[c] || c)
//       .join("");
//   });
//   // simple subscript: x_1
//   formatted = formatted.replace(/_([0-9])/g, (_, num) => {
//     const subMap = {
//       0: "₀",
//       1: "₁",
//       2: "₂",
//       3: "₃",
//       4: "₄",
//       5: "₅",
//       6: "₆",
//       7: "₇",
//       8: "₈",
//       9: "₉",
//     };
//     return subMap[num] || num;
//   });

//   // Roots
//   formatted = formatted.replace(/\\sqrt\{([^}]+)\}/g, "√($1)");
//   formatted = formatted.replace(/\\sqrt\[([0-9]+)\]\{([^}]+)\}/g, "($1√$2)"); // nth root

//   // Greek letters (common ones)
//   const greek = {
//     "\\alpha": "α",
//     "\\beta": "β",
//     "\\gamma": "γ",
//     "\\delta": "δ",
//     "\\epsilon": "ε",
//     "\\theta": "θ",
//     "\\lambda": "λ",
//     "\\pi": "π",
//     "\\rho": "ρ",
//     "\\sigma": "σ",
//     "\\tau": "τ",
//     "\\phi": "φ",
//     "\\chi": "χ",
//     "\\psi": "ψ",
//     "\\omega": "ω",
//     "\\Delta": "Δ",
//     "\\Pi": "Π",
//     "\\Sigma": "Σ",
//     "\\Phi": "Φ",
//     "\\Omega": "Ω",
//   };
//   Object.entries(greek).forEach(([k, v]) => {
//     formatted = formatted.replace(new RegExp(k, "g"), v);
//   });

//   // Common symbols
//   const symbols = {
//     "\\times": "×",
//     "\\div": "÷",
//     "\\pm": "±",
//     "\\leq": "≤",
//     "\\geq": "≥",
//     "\\neq": "≠",
//     "\\approx": "≈",
//     "\\equiv": "≡",
//     "\\cdot": "·",
//     "\\infty": "∞",
//     "\\nabla": "∇",
//     "\\rightarrow": "→",
//     "\\leftarrow": "←",
//     "\\leftrightarrow": "↔",
//     "\\Rightarrow": "⇒",
//     "\\Leftarrow": "⇐",
//     "\\Leftrightarrow": "⇔",
//     "\\sum": "∑",
//     "\\prod": "∏",
//     "\\int": "∫",
//     "\\oint": "∮",
//   };
//   Object.entries(symbols).forEach(([k, v]) => {
//     formatted = formatted.replace(new RegExp(k, "g"), v);
//   });
//   formatted = formatted.replace(/\\cdots/g, "…");

//   // Remove any remaining backslashes
//   formatted = formatted.replace(/\\/g, "");

//   return formatted.trim();
// };

// const formatTimestamp = (date) => {
//   let hours = date.getHours();
//   const minutes = date.getMinutes().toString().padStart(2, "0");
//   const ampm = hours >= 12 ? "PM" : "AM";
//   hours = hours % 12 || 12;
//   return `${hours}:${minutes} ${ampm}`;
// };

// function MathChat() {
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       type: "bot",
//       content:
//         "Hello! I'm your Math Assistant. I can help you solve mathematical problems, equations, and provide step-by-step reasoning. What would you like to work on today?",
//       timestamp: formatTimestamp(new Date()),
//     },
//   ]);
//   const [inputText, setInputText] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef(null);
//   const textareaRef = useRef(null);
//   const [isListening, setIsListening] = useState(false); // 🆕 mic state
//   const recognitionRef = useRef(null); // 🆕 keep recognition instance

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const adjustTextareaHeight = () => {
//     const textarea = textareaRef.current;
//     if (textarea) {
//       textarea.style.height = "auto";
//       textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
//     }
//   };

//   useEffect(() => {
//     adjustTextareaHeight();
//   }, [inputText]);

//   // --- 🆕 Setup Speech Recognition ---
//   useEffect(() => {
//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;

//     if (SpeechRecognition) {
//       const recognition = new SpeechRecognition();
//       recognition.continuous = true; // keep listening
//       recognition.interimResults = true; // show partial results
//       recognition.lang = "en-US";

//       recognition.onresult = (event) => {
//         let transcript = "";
//         for (let i = event.resultIndex; i < event.results.length; i++) {
//           transcript += event.results[i][0].transcript;
//         }
//         setInputText(transcript); // live update
//       };

//       recognition.onend = () => {
//         if (isListening) {
//           recognition.start(); // auto-restart
//         }
//       };

//       recognitionRef.current = recognition;
//     }
//   }, [isListening]);

//   const toggleMic = () => {
//     if (!recognitionRef.current) {
//       alert("Speech recognition is not supported in this browser.");
//       return;
//     }

//     if (isListening) {
//       recognitionRef.current.stop();
//       setIsListening(false);
//     } else {
//       recognitionRef.current.start();
//       setIsListening(true);
//     }
//   };

//   // --- Call backend API ---
//   const callCohereAPI = async (prompt) => {
//     const response = await fetch("http://localhost:5000/api/reasoning", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ prompt }),
//     });
//     const data = await response.json();

//     // Format math expressions
//     return formatMathResponse(
//       data.answer || "Sorry, I couldn't process your request."
//     );
//   };

//   const handleSubmit = async () => {
//     if (!inputText.trim() || isLoading) return;

//     const userMessage = {
//       id: messages.length + 1,
//       type: "user",
//       content: inputText.trim(),
//       timestamp: formatTimestamp(new Date()),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setInputText("");
//     setIsLoading(true);

//     try {
//       const response = await callCohereAPI(inputText.trim());
//       const botMessage = {
//         id: messages.length + 2,
//         type: "bot",
//         content: response,
//         timestamp: formatTimestamp(new Date()),
//       };

//       setMessages((prev) => [...prev, botMessage]);
//     } catch (error) {
//       const errorMessage = {
//         id: messages.length + 2,
//         type: "bot",
//         content:
//           "Sorry, I encountered an error while processing your request. Please try again.",
//         timestamp: formatTimestamp(new Date()),
//       };
//       setMessages((prev) => [...prev, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-cream text-ink flex flex-col">
//       {/* Header */}
//       <div className="border-b border-sand bg-cream/90 p-4 backdrop-blur-xl">
//         <div className="max-w-4xl mx-auto flex items-center gap-3">
//           <div className="rounded-full bg-accent p-2 text-ink">
//             <Calculator className="w-6 h-6" />
//           </div>
//           <div>
//             <h1 className="text-xl font-medium text-ink">
//               Math Assistant
//             </h1>
//             <p className="text-muted text-sm">
//               Solve mathematical problems with AI
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Chat Messages */}
//       <div className="flex-1 overflow-hidden">
//         <div className="max-w-4xl mx-auto h-full flex flex-col">
//           <div className="flex-1 overflow-y-auto p-4 space-y-4">
//             {messages.map((message) => (
//               <div
//                 key={message.id}
//                 className={`flex gap-3 ${
//                   message.type === "user" ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 {message.type === "bot" && (
//                   <div className="bg-accent text-ink p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
//                     <Bot className="w-4 h-4" />
//                   </div>
//                 )}

//                 <div
//                   className={`max-w-[80%] rounded-3xl p-4 ${
//                     message.type === "user"
//                       ? "bg-accent text-ink ml-auto"
//                       : "bg-sand border border-sand"
//                   }`}
//                 >
//                   <div className="whitespace-pre-wrap text-sm leading-relaxed">
//                     {message.content}
//                   </div>
//                   <div className="text-xs opacity-60 mt-2">
//                     {message.timestamp}
//                   </div>
//                 </div>

//                 {message.type === "user" && (
//                   <div className="bg-mint text-ink p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
//                     <User className="w-4 h-4" />
//                   </div>
//                 )}
//               </div>
//             ))}

//             {isLoading && (
//               <div className="flex gap-3 justify-start">
//                 <div className="bg-accent text-ink p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
//                   <Bot className="w-4 h-4" />
//                 </div>
//                 <div className="bg-sand border border-sand rounded-3xl p-4">
//                   <div className="flex gap-1">
//                     <div className="w-2 h-2 bg-stone rounded-full animate-bounce"></div>
//                     <div
//                       className="w-2 h-2 bg-stone rounded-full animate-bounce"
//                       style={{ animationDelay: "0.1s" }}
//                     ></div>
//                     <div
//                       className="w-2 h-2 bg-stone rounded-full animate-bounce"
//                       style={{ animationDelay: "0.2s" }}
//                     ></div>
//                   </div>
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>
//         </div>
//       </div>

//       {/* Input Area */}
//       <div className="bg-sand border-t border-sand p-4">
//         <div className="max-w-4xl mx-auto">
//           <div className="flex gap-3 items-end">
//             <div className="flex-1 relative">
//               <textarea
//                 ref={textareaRef}
//                 value={inputText}
//                 onChange={(e) => setInputText(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 placeholder="Enter or speak your math problem..."
//                 className="w-full rounded-3xl bg-paper border border-mist px-5 py-3.5 pr-12 text-ink placeholder-muted resize-none focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent min-h-[50px] max-h-[120px]"
//                 rows="1"
//                 disabled={isLoading}
//                 style={{ paddingRight: "3rem" }} // extra space for mic
//               />
//               {/* 🆕 Microphone button - positioned inside textarea, right aligned */}
//               <button
//                 type="button"
//                 onClick={toggleMic}
//                 className={`absolute top-1/2 right-4 transform -translate-y-1/2 p-2 rounded-full ${
//                   isListening
//                     ? "bg-error text-ink"
//                     : "bg-paper text-ink"
//                 }`}
//                 style={{ zIndex: 2 }}
//                 tabIndex={-1}
//               >
//                 <Mic className="w-5 h-5" />
//               </button>
//             </div>
//             <button
//               type="button"
//               onClick={handleSubmit}
//               disabled={!inputText.trim() || isLoading}
//               className="bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-ink p-3 rounded-full transition-all duration-200 flex items-center justify-center min-w-[50px] h-[50px]"
//             >
//               <Send className="w-5 h-5" />
//             </button>
//           </div>

//           {/* Quick suggestions */}
//           <div className="mt-3 flex flex-wrap gap-2">
//             {[
//               "Solve quadratic equation",
//               "Find derivative",
//               "Calculate integral",
//               "Matrix operations",
//             ].map((suggestion) => (
//               <button
//                 key={suggestion}
//                 onClick={() => setInputText(suggestion)}
//                 className="px-3 py-1 text-xs bg-paper hover:bg-cloud border border-mist rounded-full text-body hover:text-ink transition-colors"
//                 disabled={isLoading}
//               >
//                 {suggestion}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default MathChat;

// new code with voice functionality

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, Calculator, Mic } from "lucide-react";
import FormatResponse from "../Components/FormatResponse";

const formatTimestamp = (date) => {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};

function MathChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content:
        "Hello! I'm your Math Assistant. I can help you solve mathematical problems, equations, and provide step-by-step reasoning. What would you like to work on today?",
      timestamp: formatTimestamp(new Date()),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputText]);

  // --- Setup Speech Recognition ---
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false; // Set to false to stop after each result
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript;
          } else {
            transcript += event.results[i][0].transcript;
          }
        }
        setInputText((prev) => prev + transcript);
      };

      recognition.onend = () => {
        // Clear the timeout when recognition ends naturally
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        // Only restart if we're still supposed to be listening
        if (isListening) {
          // Set a small delay before restarting to prevent immediate restart
          setTimeout(() => {
            if (isListening && recognitionRef.current) {
              recognitionRef.current.start();
            }
          }, 100);
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        if (event.error === "no-speech") {
          // If no speech was detected, just restart if still listening
          if (isListening) {
            setTimeout(() => {
              if (isListening && recognitionRef.current) {
                recognitionRef.current.start();
              }
            }, 100);
          }
        } else {
          // For other errors, stop listening
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
    }

    // Cleanup on component unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isListening]);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      // Stop listening
      recognitionRef.current.stop();
      setIsListening(false);

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    } else {
      // Start listening
      setIsListening(true);

      // Use a small delay to ensure state is updated before starting recognition
      setTimeout(() => {
        if (recognitionRef.current) {
          recognitionRef.current.start();

          // Set timeout to stop after 60 seconds
          timeoutRef.current = setTimeout(() => {
            if (isListening) {
              recognitionRef.current.stop();
              setIsListening(false);
            }
          }, 60000); // 60 seconds
        }
      }, 100);
    }
  };

  // --- Call backend API ---
  const callCohereAPI = async (prompt) => {
    const response = await fetch("http://localhost:5000/api/reasoning", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await response.json();

    // Raw markdown / LaTeX — rendered by <FormatResponse />
    return data.answer || "Sorry, I couldn't process your request.";
  };

  const handleSubmit = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: inputText.trim(),
      timestamp: formatTimestamp(new Date()),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await callCohereAPI(inputText.trim());
      const botMessage = {
        id: messages.length + 2,
        type: "bot",
        content: response,
        timestamp: formatTimestamp(new Date()),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: messages.length + 2,
        type: "bot",
        content:
          "Sorry, I encountered an error while processing your request. Please try again.",
        timestamp: formatTimestamp(new Date()),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-cream text-ink flex flex-col">
      {/* Header */}
      <div className="border-b border-sand bg-cream/90 p-4 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="rounded-full bg-accent p-2 text-ink">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-medium text-ink">
              Math Assistant
            </h1>
            <p className="text-muted text-sm">
              Solve mathematical problems with AI
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.type === "bot" && (
                  <div className="bg-accent text-ink p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-3xl p-4 ${
                    message.type === "user"
                      ? "bg-accent text-ink ml-auto"
                      : "bg-sand border border-sand"
                  }`}
                >
                  {message.type === "bot" ? (
                    <FormatResponse content={message.content} />
                  ) : (
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                  )}
                  <div className="text-xs opacity-60 mt-2">
                    {message.timestamp}
                  </div>
                </div>

              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="bg-accent text-ink p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-sand border border-sand rounded-3xl p-4">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-stone rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-stone rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-stone rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-sand border-t border-sand p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter or speak your math problem..."
                className="w-full rounded-3xl bg-paper border border-mist px-5 py-3.5 pr-12 text-ink placeholder-muted resize-none focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent min-h-[50px] max-h-[120px]"
                rows="1"
                disabled={isLoading}
                style={{ paddingRight: "3rem" }}
              />
              {/* Microphone button */}
              <button
                type="button"
                onClick={toggleMic}
                className={`absolute top-1/2 right-4 transform -translate-y-1/2 p-2 rounded-full ${
                  isListening
                    ? "bg-error text-ink animate-pulse"
                    : "bg-paper text-ink hover:bg-cloud"
                }`}
                style={{ zIndex: 2 }}
                tabIndex={-1}
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!inputText.trim() || isLoading}
              className="bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-ink p-3 rounded-full transition-all duration-200 flex items-center justify-center min-w-[50px] h-[50px]"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {/* Quick suggestions */}
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              "Solve quadratic equation",
              "Find derivative",
              "Calculate integral",
              "Matrix operations",
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInputText(suggestion)}
                className="px-3 py-1 text-xs bg-paper hover:bg-cloud border border-mist rounded-full text-body hover:text-ink transition-colors"
                disabled={isLoading}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MathChat;
