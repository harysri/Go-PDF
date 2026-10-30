// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const cors = require("cors");
// const crypto = require("crypto");
// const nodemailer = require("nodemailer");

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // MongoDB Atlas Connection
// mongoose
//   .connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("Connected to MongoDB Atlas"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// // User Model (updated with reset password fields)
// const UserSchema = new mongoose.Schema({
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   phoneNumber: { type: String, required: true },
//   password: { type: String, required: true },
//   resetPasswordToken: String,
//   resetPasswordExpires: Date,
//   createdAt: { type: Date, default: Date.now },
// });

// const User = mongoose.model("User", UserSchema);

// // JWT Secret
// const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// // Nodemailer setup
// const transporter = nodemailer.createTransport({
//   service: "gmail", // or your email service
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // Verify email configuration
// transporter.verify((error, success) => {
//   if (error) {
//     console.log("Email configuration error:", error);
//   } else {
//     console.log("Email server is ready to send messages");
//   }
// });

// // Routes
// // Signup Route (existing)
// app.post("/api/signup", async (req, res) => {
//   try {
//     const {
//       firstName,
//       lastName,
//       email,
//       phoneNumber,
//       password,
//       confirmPassword,
//     } = req.body;

//     // Validation
//     if (
//       !firstName ||
//       !lastName ||
//       !email ||
//       !phoneNumber ||
//       !password ||
//       !confirmPassword
//     ) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     if (password !== confirmPassword) {
//       return res.status(400).json({ message: "Passwords do not match" });
//     }

//     if (password.length < 8) {
//       return res
//         .status(400)
//         .json({ message: "Password must be at least 8 characters" });
//     }

//     // Check if user exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already in use" });
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create new user
//     const newUser = new User({
//       firstName,
//       lastName,
//       email,
//       phoneNumber,
//       password: hashedPassword,
//     });

//     await newUser.save();

//     // Create token
//     const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
//       expiresIn: "1h",
//     });

//     res.status(201).json({
//       token,
//       user: {
//         id: newUser._id,
//         email: newUser.email,
//         firstName: newUser.firstName,
//       },
//     });
//   } catch (error) {
//     console.error("Signup error:", error);
//     res.status(500).json({ message: "Server error during signup" });
//   }

//   // ... existing signup code ...
// });

// // Login Route (existing)
// app.post("/api/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Validation
//     if (!email || !password) {
//       return res
//         .status(400)
//         .json({ message: "Email and password are required" });
//     }

//     // Find user
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // Check password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // Create token
//     const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

//     res.json({
//       token,
//       user: {
//         id: user._id,
//         email: user.email,
//         firstName: user.firstName,
//         lastName: user.lastName,
//       },
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ message: "Server error during login" });
//   }
//   // ... existing login code ...
// });

// // Forgot Password Route
// app.post("/api/forgot-password", async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({ message: "Email is required" });
//     }

//     const user = await User.findOne({ email });

//     // For security reasons, we don't want to reveal if an email exists or not
//     if (!user) {
//       return res.status(200).json({
//         message:
//           "If the email exists in our system, you will receive a password reset link",
//       });
//     }

//     // Generate reset token
//     const resetToken = crypto.randomBytes(20).toString("hex");

//     // Set token and expiration (1 hour)
//     user.resetPasswordToken = crypto
//       .createHash("sha256")
//       .update(resetToken)
//       .digest("hex");
//     user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

//     await user.save();

//     // Create reset URL
//     const resetUrl = `${
//       process.env.FRONTEND_URL || "http://localhost:3000"
//     }/reset-password/${resetToken}`;

//     // Professional Email Template with Dark Mode Support
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: user.email,
//       subject: "Password Reset Request - GoPDF",
//       html: `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <meta name="color-scheme" content="light dark">
//       <meta name="supported-color-schemes" content="light dark">
//       <title>Password Reset Request</title>
//       <style>
//         /* Base styles for both light and dark modes */
//         :root {
//           color-scheme: light dark;
//         }

//         * {
//           margin: 0;
//           padding: 0;
//           box-sizing: border-box;
//         }

//         body {
//           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
//           line-height: 1.6;
//           background-color: #f8fafc;
//           margin: 0;
//           padding: 0;
//         }

//         /* Dark mode support */
//         @media (prefers-color-scheme: dark) {
//           body {
//             background-color: #0f172a !important;
//           }

//           .email-container {
//             background-color: #1e293b !important;
//             border: 1px solid #334155 !important;
//           }

//           .header-title {
//             color: #60a5fa !important;
//           }

//           .text-primary {
//             color: #f1f5f9 !important;
//           }

//           .text-secondary {
//             color: #cbd5e1 !important;
//           }

//           .text-muted {
//             color: #94a3b8 !important;
//           }

//           .divider {
//             border-color: #334155 !important;
//           }

//           .footer-link {
//             color: #60a5fa !important;
//           }
//         }

//         .email-wrapper {
//           background-color: #f8fafc;
//           padding: 40px 20px;
//           min-height: 100vh;
//         }

//         .email-container {
//           max-width: 600px;
//           margin: 0 auto;
//           background: #ffffff;
//           border-radius: 16px;
//           box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
//           overflow: hidden;
//           border: 1px solid #e2e8f0;
//         }

//         .header {
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           padding: 32px 32px 24px 32px;
//           text-align: center;
//           position: relative;
//         }

//         .header::before {
//           content: '';
//           position: absolute;
//           top: 0;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>') repeat;
//         }

//         .logo {
//           font-size: 32px;
//           margin-bottom: 8px;
//           position: relative;
//           z-index: 1;
//         }

//         .header-title {
//           color: #ffffff;
//           font-size: 28px;
//           font-weight: 700;
//           margin: 0;
//           position: relative;
//           z-index: 1;
//           text-shadow: 0 2px 4px rgba(0,0,0,0.1);
//         }

//         .header-subtitle {
//           color: rgba(255, 255, 255, 0.9);
//           font-size: 16px;
//           margin-top: 8px;
//           position: relative;
//           z-index: 1;
//         }

//         .content {
//           padding: 40px 32px;
//         }

//         .greeting {
//           font-size: 18px;
//           font-weight: 600;
//           color: #1a202c;
//           margin-bottom: 20px;
//         }

//         .text-primary {
//           color: #4a5568;
//           font-size: 16px;
//           line-height: 1.7;
//           margin-bottom: 16px;
//         }

//         .text-secondary {
//           color: #718096;
//           font-size: 15px;
//           line-height: 1.6;
//           margin-bottom: 16px;
//         }

//         .cta-container {
//           text-align: center;
//           margin: 40px 0;
//         }

//         .cta-button {
//           display: inline-block;
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           color: #ffffff !important;
//           padding: 16px 40px;
//           font-size: 16px;
//           font-weight: 600;
//           text-decoration: none;
//           border-radius: 12px;
//           box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
//           transition: all 0.3s ease;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//         }

//         .cta-button:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
//         }

//         .security-notice {
//           background: linear-gradient(135deg, #fef5e7 0%, #fdf2e9 100%);
//           border-left: 4px solid #f6ad55;
//           padding: 20px;
//           border-radius: 8px;
//           margin: 32px 0;
//         }

//         .security-notice-dark {
//           background: linear-gradient(135deg, #2d1b14 0%, #3c2415 100%);
//           border-left-color: #f6ad55;
//         }

//         .security-icon {
//           font-size: 20px;
//           margin-right: 8px;
//         }

//         .security-title {
//           font-weight: 600;
//           color: #c05621;
//           margin-bottom: 8px;
//           display: flex;
//           align-items: center;
//         }

//         .divider {
//           border: none;
//           border-top: 2px solid #e2e8f0;
//           margin: 32px 0;
//           background: linear-gradient(to right, transparent, #e2e8f0, transparent);
//           height: 1px;
//         }

//         .footer {
//           background: #f7fafc;
//           padding: 32px;
//           text-align: center;
//           border-top: 1px solid #e2e8f0;
//         }

//         .footer-link {
//           color: #667eea;
//           text-decoration: none;
//           word-break: break-all;
//           font-size: 14px;
//           line-height: 1.5;
//         }

//         .text-muted {
//           color: #a0aec0;
//           font-size: 13px;
//           line-height: 1.5;
//         }

//         .company-info {
//           margin-top: 24px;
//           padding-top: 20px;
//           border-top: 1px solid #e2e8f0;
//         }

//         .social-links {
//           margin: 16px 0;
//         }

//         .social-links a {
//           display: inline-block;
//           margin: 0 8px;
//           color: #718096;
//           font-size: 18px;
//           text-decoration: none;
//         }

//         /* Responsive design */
//         @media only screen and (max-width: 600px) {
//           .email-wrapper {
//             padding: 20px 10px;
//           }

//           .content {
//             padding: 24px 20px;
//           }

//           .header {
//             padding: 24px 20px 20px 20px;
//           }

//           .header-title {
//             font-size: 24px;
//           }

//           .cta-button {
//             padding: 14px 32px;
//             font-size: 15px;
//           }

//           .footer {
//             padding: 24px 20px;
//           }
//         }

//         /* Email client specific fixes */
//         @media screen and (-webkit-min-device-pixel-ratio: 0) {
//           .cta-button {
//             background: #667eea !important;
//           }
//         }
//       </style>
//     </head>
//     <body>
//       <div class="email-wrapper">
//         <div class="email-container">
//           <!-- Header Section -->
//           <div class="header">
//             <div class="logo">📄</div>
//             <h1 class="header-title">Password Reset</h1>
//             <p class="header-subtitle">Secure access to your GoPDF account</p>
//           </div>

//           <!-- Content Section -->
//           <div class="content">
//             <div class="greeting">
//               Hello ${user.firstName || "there"} 👋
//             </div>

//             <p class="text-primary">
//               We received a request to reset the password for your <strong>GoPDF</strong> account.
//               If you made this request, please click the button below to create a new password.
//             </p>

//             <p class="text-secondary">
//               This secure link will take you to a page where you can safely update your password.
//             </p>

//             <!-- Call to Action -->
//             <div class="cta-container">
//               <a href="${resetUrl}" class="cta-button">
//                 🔐 Reset My Password
//               </a>
//             </div>

//             <!-- Security Notice -->
//             <div class="security-notice">
//               <div class="security-title">
//                 <span class="security-icon">⚠️</span>
//                 Important Security Information
//               </div>
//               <p class="text-secondary" style="margin: 0; color: #c05621;">
//                 This link will expire in <strong>1 hour</strong> for your security.
//                 If you didn't request this reset, please ignore this email and your password will remain unchanged.
//               </p>
//             </div>

//             <p class="text-secondary">
//               For your security, we recommend using a strong, unique password that includes:
//             </p>
//             <ul class="text-secondary" style="margin: 0 0 16px 20px;">
//               <li>At least 8 characters</li>
//               <li>A mix of letters, numbers, and symbols</li>
//               <li>No personal information</li>
//             </ul>

//             <hr class="divider">

//             <!-- Troubleshooting -->
//             <p class="text-secondary" style="font-size: 14px;">
//               <strong>Having trouble with the button?</strong><br>
//               Copy and paste this link into your browser's address bar:
//             </p>
//           </div>

//           <!-- Footer Section -->
//           <div class="footer">
//             <p class="text-secondary" style="margin-bottom: 16px;">
//               <a href="${resetUrl}" class="footer-link">${resetUrl}</a>
//             </p>

//             <div class="social-links">
//               <a href="#" title="Twitter">🐦</a>
//               <a href="#" title="LinkedIn">💼</a>
//               <a href="#" title="Support">📧</a>
//             </div>

//             <div class="company-info">
//               <p class="text-muted">
//                 © ${new Date().getFullYear()} <strong>GoPDF</strong>. All rights reserved.
//               </p>
//               <p class="text-muted" style="margin-top: 8px;">
//                 This email was sent to ${user.email}. If you have questions,
//                 <a href="mailto:support@gopdf.com" style="color: #667eea;">contact our support team</a>.
//               </p>
//               <p class="text-muted" style="margin-top: 12px; font-size: 12px;">
//                 GoPDF Inc. | 123 Business Ave | Suite 100 | Your City, State 12345
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </body>
//     </html>
//   `,
//     };

//     // Send email
//     await transporter.sendMail(mailOptions);

//     res.status(200).json({
//       message:
//         "If the email exists in our system, you will receive a password reset link",
//     });
//   } catch (error) {
//     console.error("Forgot password error:", error);
//     res
//       .status(500)
//       .json({ message: "Server error during password reset request" });
//   }
// });

// // Reset Password Route
// app.post("/api/reset-password/:token", async (req, res) => {
//   try {
//     const { token } = req.params;
//     const { password, confirmPassword } = req.body;

//     if (!password || !confirmPassword) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     if (password !== confirmPassword) {
//       return res.status(400).json({ message: "Passwords do not match" });
//     }

//     if (password.length < 8) {
//       return res
//         .status(400)
//         .json({ message: "Password must be at least 8 characters" });
//     }

//     // Hash the token to compare with stored value
//     const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

//     // Find user with valid token that hasn't expired
//     const user = await User.findOne({
//       resetPasswordToken: hashedToken,
//       resetPasswordExpires: { $gt: Date.now() },
//     });

//     if (!user) {
//       return res
//         .status(400)
//         .json({ message: "Invalid or expired reset token" });
//     }

//     // Hash new password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Update user password and clear reset token fields
//     user.password = hashedPassword;
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;

//     await user.save();

//     res.status(200).json({ message: "Password reset successfully" });
//   } catch (error) {
//     console.error("Reset password error:", error);
//     res.status(500).json({ message: "Server error during password reset" });
//   }
// });

// // Verify Reset Token Route
// app.get("/api/verify-reset-token/:token", async (req, res) => {
//   try {
//     const { token } = req.params;

//     // Hash the token to compare with stored value
//     const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

//     // Find user with valid token that hasn't expired
//     const user = await User.findOne({
//       resetPasswordToken: hashedToken,
//       resetPasswordExpires: { $gt: Date.now() },
//     });

//     if (!user) {
//       return res
//         .status(400)
//         .json({ valid: false, message: "Invalid or expired reset token" });
//     }

//     res.status(200).json({ valid: true, message: "Token is valid" });
//   } catch (error) {
//     console.error("Verify token error:", error);
//     res.status(500).json({
//       valid: false,
//       message: "Server error during token verification",
//     });
//   }
// });

// // Protected route example (existing)
// app.get("/api/protected", authenticateToken, (req, res) => {
//   res.json({ message: "This is a protected route", user: req.user });
// });

// // Middleware to authenticate token (existing)
// function authenticateToken(req, res, next) {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];

//   if (!token) return res.sendStatus(401);

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// }

// // Add these routes after your existing routes

// // Middleware to authenticate and get user
// async function authenticateUser(req, res, next) {
//   try {
//     const authHeader = req.headers["authorization"];
//     const token = authHeader && authHeader.split(" ")[1];

//     if (!token) {
//       return res.status(401).json({ message: "Access token required" });
//     }

//     const decoded = jwt.verify(token, JWT_SECRET);
//     const user = await User.findById(decoded.id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     return res.status(403).json({ message: "Invalid or expired token" });
//   }
// }

// // Get user profile (protected)
// app.get("/api/profile", authenticateUser, async (req, res) => {
//   try {
//     res.json({
//       user: {
//         id: req.user._id,
//         firstName: req.user.firstName,
//         lastName: req.user.lastName,
//         email: req.user.email,
//         phoneNumber: req.user.phoneNumber,
//         joinedDate: req.user.createdAt,
//       },
//     });
//   } catch (error) {
//     console.error("Get profile error:", error);
//     res.status(500).json({ message: "Server error fetching profile" });
//   }
// });

// // Update user profile (protected)
// app.put("/api/profile", authenticateUser, async (req, res) => {
//   try {
//     const { firstName, lastName, email, phoneNumber } = req.body;

//     // Validation
//     if (!firstName || !lastName || !email || !phoneNumber) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // Check if email is already taken by another user
//     if (email !== req.user.email) {
//       const existingUser = await User.findOne({ email });
//       if (existingUser) {
//         return res.status(400).json({ message: "Email already in use" });
//       }
//     }

//     // Update user
//     req.user.firstName = firstName;
//     req.user.lastName = lastName;
//     req.user.email = email;
//     req.user.phoneNumber = phoneNumber;

//     await req.user.save();

//     res.json({
//       message: "Profile updated successfully",
//       user: {
//         id: req.user._id,
//         firstName: req.user.firstName,
//         lastName: req.user.lastName,
//         email: req.user.email,
//         phoneNumber: req.user.phoneNumber,
//         joinedDate: req.user.createdAt,
//       },
//     });
//   } catch (error) {
//     console.error("Update profile error:", error);
//     res.status(500).json({ message: "Server error updating profile" });
//   }
// });

// // Change password
// app.post("/api/change-password", authenticateUser, async (req, res) => {
//   try {
//     const { currentPassword, newPassword, confirmPassword } = req.body;

//     // Validation
//     if (!currentPassword || !newPassword || !confirmPassword) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     if (newPassword !== confirmPassword) {
//       return res.status(400).json({ message: "New passwords do not match" });
//     }

//     if (newPassword.length < 8) {
//       return res
//         .status(400)
//         .json({ message: "Password must be at least 8 characters" });
//     }

//     // Verify current password
//     const isMatch = await bcrypt.compare(currentPassword, req.user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Current password is incorrect" });
//     }

//     // Hash new password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(newPassword, salt);

//     // Update password
//     req.user.password = hashedPassword;
//     await req.user.save();

//     res.json({ message: "Password changed successfully" });
//   } catch (error) {
//     console.error("Change password error:", error);
//     res.status(500).json({ message: "Server error changing password" });
//   }
// });

// // Routes for reasoning and summarization

// const reasoningRoute = require("./Routes/reasoning");
// app.use("/api/reasoning", reasoningRoute);
// const summarizeRoute = require("./Routes/summarize");
// app.use("/api/summarize", summarizeRoute);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Atlas Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Import routes
const authRoutes = require("./Routes/auth");

// Use routes
app.use("/api/auth", authRoutes);

// Routes for reasoning and summarization (if they exist)
if (require("./Routes/reasoning")) {
  const reasoningRoute = require("./Routes/reasoning");
  app.use("/api/reasoning", reasoningRoute);
}

if (require("./Routes/summarize")) {
  const summarizeRoute = require("./Routes/summarize");
  app.use("/api/summarize", summarizeRoute);
}

if (require("./Routes/translation")) {
  const translationRoute = require("./Routes/translation");
  app.use("/api/translate", translationRoute);
}

// Ask-PDF: chunk -> embed (Ollama) -> Qdrant hybrid (dense + BM25, RRF)
//          -> Cohere rerank -> Gemini answer
const askPdfRoute = require("./Routes/askPdf");
app.use("/api/ask-pdf", askPdfRoute);

// Text-to-speech: Kokoro-82M, chunked, returns a single WAV file
const speechRoute = require("./Routes/speech");
app.use("/api/speech", speechRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
