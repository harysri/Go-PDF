import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import ScrollToTop from "./Components/ScrollToTop";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Summarization from "./Pages/Summarization";
import ResetPassword from "./Pages/ResetPassword";
import MathChat from "./Pages/mathchat";
import ProfilePage from "./Pages/Profile";
import Toaster from "react-hot-toast";
function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="appearance-none">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Summarize" element={<Summarization />} />
          <Route path="/MathChat" element={<MathChat />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}
export default App;
