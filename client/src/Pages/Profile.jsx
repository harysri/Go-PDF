// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   User,
//   Mail,
//   Calendar,
//   Key,
//   Save,
//   ArrowLeft,
//   Eye,
//   EyeOff,
// } from "lucide-react";

// const ProfilePage = () => {
//   const navigate = useNavigate();

//   // Get user data from localStorage (in a real app, this would come from an API)
//   const [user, setUser] = useState(() => {
//     const userData = JSON.parse(localStorage.getItem("user")) || {};
//     return {
//       firstName: userData.firstName || "",
//       lastName: userData.lastName || "",
//       email: userData.email || "",
//       joinedDate: userData.joinedDate || new Date().toISOString().split("T")[0],
//     };
//   });

//   const [passwordData, setPasswordData] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   const [showPasswords, setShowPasswords] = useState({
//     current: false,
//     new: false,
//     confirm: false,
//   });

//   const [isEditing, setIsEditing] = useState(false);
//   const [isChangingPassword, setIsChangingPassword] = useState(false);
//   const [saveStatus, setSaveStatus] = useState("");
//   const [passwordStatus, setPasswordStatus] = useState("");

//   // Generate avatar initials and color (same logic as navbar)
//   const getAvatarInitials = (firstName, lastName) => {
//     let initials = "";
//     if (firstName && firstName.length > 0) {
//       initials += firstName[0].toUpperCase();
//     }
//     if (lastName && lastName.length > 0) {
//       initials += lastName[0].toUpperCase();
//     }
//     return initials || "👤";
//   };

//   const getUserAvatarColor = (email) => {
//     const hash = email
//       ? Array.from(email).reduce((acc, char) => acc + char.charCodeAt(0), 0)
//       : 0;
//     const colors = [
//       "bg-accent",
//       "bg-mist",
//       "bg-cloud",
//       "bg-paper",
//       "bg-stone",
//       "bg-sand",
//       "bg-accent-hover",
//       "bg-[#e6e6e6]",
//     ];
//     return colors[hash % colors.length];
//   };

//   const handleUserUpdate = (e) => {
//     const { name, value } = e.target;
//     setUser((prev) => ({ ...prev, [name]: value }));
//   };

//   const handlePasswordChange = (e) => {
//     const { name, value } = e.target;
//     setPasswordData((prev) => ({ ...prev, [name]: value }));
//   };

//   const togglePasswordVisibility = (field) => {
//     setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
//   };

//   const saveProfile = async () => {
//     try {
//       // Update localStorage (in a real app, this would be an API call)
//       localStorage.setItem("user", JSON.stringify(user));
//       setSaveStatus("Profile updated successfully!");
//       setIsEditing(false);

//       // Clear status after 3 seconds
//       setTimeout(() => setSaveStatus(""), 3000);
//     } catch (error) {
//       setSaveStatus("Error updating profile. Please try again.");
//       setTimeout(() => setSaveStatus(""), 3000);
//     }
//   };

//   const changePassword = async () => {
//     // Basic validation
//     if (
//       !passwordData.currentPassword ||
//       !passwordData.newPassword ||
//       !passwordData.confirmPassword
//     ) {
//       setPasswordStatus("Please fill in all password fields.");
//       setTimeout(() => setPasswordStatus(""), 3000);
//       return;
//     }

//     if (passwordData.newPassword !== passwordData.confirmPassword) {
//       setPasswordStatus("New passwords do not match.");
//       setTimeout(() => setPasswordStatus(""), 3000);
//       return;
//     }

//     if (passwordData.newPassword.length < 6) {
//       setPasswordStatus("New password must be at least 6 characters long.");
//       setTimeout(() => setPasswordStatus(""), 3000);
//       return;
//     }

//     // In a real app, you would validate the current password against the server
//     try {
//       // Simulate API call for password change
//       // await api.changePassword(passwordData);

//       setPasswordStatus("Password changed successfully!");
//       setPasswordData({
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//       });
//       setIsChangingPassword(false);
//       setTimeout(() => setPasswordStatus(""), 3000);
//     } catch (error) {
//       setPasswordStatus("Error changing password. Please try again.");
//       setTimeout(() => setPasswordStatus(""), 3000);
//     }
//   };

//   const initials = getAvatarInitials(user.firstName, user.lastName);
//   const avatarColor = getUserAvatarColor(user.email);

//   return (
//     <div className="min-h-screen bg-cream">
//       {/* Header */}
//       <div className="bg-sand border-b border-sand">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <button
//                 onClick={() => navigate("/summarize")}
//                 className="flex items-center text-muted hover:text-ink transition-colors"
//               >
//                 <ArrowLeft className="h-5 w-5 mr-2" />
//                 Back to Summarize
//               </button>
//             </div>
//             <h1 className="text-2xl font-medium text-ink">Profile Settings</h1>
//             <div></div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Profile Summary Card */}
//           <div className="lg:col-span-1">
//             <div className="bg-sand rounded-3xl border border-sand p-6 text-center">
//               <div
//                 className={`w-24 h-24 rounded-full ${avatarColor} flex items-center justify-center text-ink font-medium text-2xl mx-auto mb-4`}
//               >
//                 {initials}
//               </div>
//               <h2 className="text-xl font-medium text-ink mb-1">
//                 {user.firstName} {user.lastName}
//               </h2>
//               <p className="text-muted mb-2">@{user.username}</p>
//               <p className="text-sm text-muted">{user.email}</p>
//               <div className="mt-4 pt-4 border-t border-sand">
//                 <div className="flex items-center justify-center text-sm text-muted">
//                   <Calendar className="h-4 w-4 mr-2" />
//                   Member since{" "}
//                   {new Date(user.joinedDate).toLocaleDateString("en-US", {
//                     year: "numeric",
//                     month: "long",
//                   })}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Status Messages */}
//             {saveStatus && (
//               <div
//                 className={`p-4 rounded-xl ${
//                   saveStatus.includes("Error")
//                     ? "bg-error/10 border border-error/40 text-error"
//                     : "bg-mint/10 border border-mint/40 text-ink"
//                 }`}
//               >
//                 {saveStatus}
//               </div>
//             )}
//             {passwordStatus && (
//               <div
//                 className={`p-4 rounded-xl ${
//                   passwordStatus.includes("Error") ||
//                   passwordStatus.includes("do not match") ||
//                   passwordStatus.includes("Please fill") ||
//                   passwordStatus.includes("must be")
//                     ? "bg-error/10 border border-error/40 text-error"
//                     : "bg-mint/10 border border-mint/40 text-ink"
//                 }`}
//               >
//                 {passwordStatus}
//               </div>
//             )}

//             {/* Personal Information */}
//             <div className="bg-sand rounded-3xl border border-sand p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <div className="flex items-center">
//                   <User className="h-5 w-5 text-ink mr-2" />
//                   <h3 className="text-lg font-medium text-ink">
//                     Personal Information
//                   </h3>
//                 </div>
//                 <button
//                   onClick={() => setIsEditing(!isEditing)}
//                   className="rounded-pill px-5 py-2 bg-accent hover:bg-accent-hover text-ink transition-colors text-sm"
//                 >
//                   {isEditing ? "Cancel" : "Edit Profile"}
//                 </button>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-body mb-2">
//                     First Name
//                   </label>
//                   <input
//                     type="text"
//                     name="firstName"
//                     value={user.firstName}
//                     onChange={handleUserUpdate}
//                     disabled={!isEditing}
//                     className="w-full px-3 py-2 bg-paper border border-mist rounded-xl text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-body mb-2">
//                     Last Name
//                   </label>
//                   <input
//                     type="text"
//                     name="lastName"
//                     value={user.lastName}
//                     onChange={handleUserUpdate}
//                     disabled={!isEditing}
//                     className="w-full px-3 py-2 bg-paper border border-mist rounded-xl text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-body mb-2">
//                     <Mail className="h-4 w-4 inline mr-1" />
//                     Email
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={user.email}
//                     onChange={handleUserUpdate}
//                     disabled={!isEditing}
//                     className="w-full px-3 py-2 bg-paper border border-mist rounded-xl text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
//                   />
//                 </div>
//               </div>

//               {isEditing && (
//                 <div className="mt-6 flex justify-end">
//                   <button
//                     onClick={saveProfile}
//                     className="flex items-center rounded-pill px-6 py-2 bg-accent hover:bg-accent-hover text-ink transition-colors"
//                   >
//                     <Save className="h-4 w-4 mr-2" />
//                     Save Changes
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* Password Section */}
//             <div className="bg-sand rounded-3xl border border-sand p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <div className="flex items-center">
//                   <Key className="h-5 w-5 text-ink mr-2" />
//                   <h3 className="text-lg font-medium text-ink">Security</h3>
//                 </div>
//                 <button
//                   onClick={() => setIsChangingPassword(!isChangingPassword)}
//                   className="rounded-pill px-5 py-2 bg-accent hover:bg-accent-hover text-ink transition-colors text-sm"
//                 >
//                   {isChangingPassword ? "Cancel" : "Change Password"}
//                 </button>
//               </div>

//               {isChangingPassword && (
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-body mb-2">
//                       Current Password
//                     </label>
//                     <div className="relative">
//                       <input
//                         type={showPasswords.current ? "text" : "password"}
//                         name="currentPassword"
//                         value={passwordData.currentPassword}
//                         onChange={handlePasswordChange}
//                         className="w-full px-3 py-2 pr-10 bg-paper border border-mist rounded-xl text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent"
//                         placeholder="Enter current password"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => togglePasswordVisibility("current")}
//                         className="absolute right-3 top-2.5 text-muted hover:text-ink"
//                       >
//                         {showPasswords.current ? (
//                           <EyeOff className="h-4 w-4" />
//                         ) : (
//                           <Eye className="h-4 w-4" />
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-body mb-2">
//                       New Password
//                     </label>
//                     <div className="relative">
//                       <input
//                         type={showPasswords.new ? "text" : "password"}
//                         name="newPassword"
//                         value={passwordData.newPassword}
//                         onChange={handlePasswordChange}
//                         className="w-full px-3 py-2 pr-10 bg-paper border border-mist rounded-xl text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent"
//                         placeholder="Enter new password"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => togglePasswordVisibility("new")}
//                         className="absolute right-3 top-2.5 text-muted hover:text-ink"
//                       >
//                         {showPasswords.new ? (
//                           <EyeOff className="h-4 w-4" />
//                         ) : (
//                           <Eye className="h-4 w-4" />
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-body mb-2">
//                       Confirm New Password
//                     </label>
//                     <div className="relative">
//                       <input
//                         type={showPasswords.confirm ? "text" : "password"}
//                         name="confirmPassword"
//                         value={passwordData.confirmPassword}
//                         onChange={handlePasswordChange}
//                         className="w-full px-3 py-2 pr-10 bg-paper border border-mist rounded-xl text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent"
//                         placeholder="Confirm new password"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => togglePasswordVisibility("confirm")}
//                         className="absolute right-3 top-2.5 text-muted hover:text-ink"
//                       >
//                         {showPasswords.confirm ? (
//                           <EyeOff className="h-4 w-4" />
//                         ) : (
//                           <Eye className="h-4 w-4" />
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                   <div className="flex justify-end pt-4">
//                     <button
//                       onClick={changePassword}
//                       className="flex items-center px-6 py-2 bg-accent hover:bg-accent-hover text-ink rounded-xl transition-colors"
//                     >
//                       <Key className="h-4 w-4 mr-2" />
//                       Update Password
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {!isChangingPassword && (
//                 <div className="text-muted text-sm">
//                   <p>Keep your account secure by using a strong password.</p>
//                   <p className="mt-1">
//                     Password requirements: At least 6 characters long.
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Calendar,
  Key,
  Save,
  ArrowLeft,
  Eye,
  EyeOff,
  Phone,
} from "lucide-react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    joinedDate: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/auth/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setSaveStatus("Error loading profile data");
      setTimeout(() => setSaveStatus(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const getAvatarInitials = (firstName, lastName) => {
    let initials = "";
    if (firstName && firstName.length > 0) {
      initials += firstName[0].toUpperCase();
    }
    if (lastName && lastName.length > 0) {
      initials += lastName[0].toUpperCase();
    }
    return initials || "👤";
  };

  const getUserAvatarColor = (email) => {
    const hash = email
      ? Array.from(email).reduce((acc, char) => acc + char.charCodeAt(0), 0)
      : 0;
    const colors = [
      "bg-accent",
      "bg-mist",
      "bg-cloud",
      "bg-paper",
      "bg-stone",
      "bg-sand",
      "bg-accent-hover",
      "bg-[#e6e6e6]",
    ];
    return colors[hash % colors.length];
  };

  const handleUserUpdate = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const saveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      // Update localStorage with new user data
      localStorage.setItem("user", JSON.stringify(data.user));
      setSaveStatus("Profile updated successfully!");
      setIsEditing(false);

      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      setSaveStatus(error.message);
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  const changePassword = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/auth/change-password",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(passwordData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      setPasswordStatus("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangingPassword(false);
      setTimeout(() => setPasswordStatus(""), 3000);
    } catch (error) {
      setPasswordStatus(error.message);
      setTimeout(() => setPasswordStatus(""), 3000);
    }
  };

  const initials = getAvatarInitials(user.firstName, user.lastName);
  const avatarColor = getUserAvatarColor(user.email);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-ink">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-sand border-b border-sand">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/summarize")}
                className="flex items-center text-muted hover:text-ink transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Summarize
              </button>
            </div>
            <h1 className="text-2xl font-medium text-ink">Profile Settings</h1>
            <div></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-sand rounded-3xl border border-sand p-6 text-center">
              <div
                className={`w-24 h-24 rounded-full ${avatarColor} flex items-center justify-center text-ink font-medium text-2xl mx-auto mb-4`}
              >
                {initials}
              </div>
              <h2 className="text-xl font-medium text-ink mb-1">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-muted mb-2">{user.email}</p>
              <div className="mt-4 pt-4 border-t border-sand">
                <div className="flex items-center justify-center text-sm text-muted">
                  <Calendar className="h-4 w-4 mr-2" />
                  Member since{" "}
                  {new Date(user.joinedDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Messages */}
            {saveStatus && (
              <div
                className={`p-4 rounded-xl ${
                  saveStatus.includes("Error") || saveStatus.includes("Failed")
                    ? "bg-error/10 border border-error/40 text-error"
                    : "bg-mint/10 border border-mint/40 text-ink"
                }`}
              >
                {saveStatus}
              </div>
            )}
            {passwordStatus && (
              <div
                className={`p-4 rounded-xl ${
                  passwordStatus.includes("Error") ||
                  passwordStatus.includes("Failed")
                    ? "bg-error/10 border border-error/40 text-error"
                    : "bg-mint/10 border border-mint/40 text-ink"
                }`}
              >
                {passwordStatus}
              </div>
            )}

            {/* Personal Information */}
            <div className="bg-sand rounded-3xl border border-sand p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-ink mr-2" />
                  <h3 className="text-lg font-medium text-ink">
                    Personal Information
                  </h3>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="rounded-pill px-5 py-2 bg-accent hover:bg-accent-hover text-ink transition-colors text-sm"
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-body mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={user.firstName}
                    onChange={handleUserUpdate}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-paper border border-mist rounded-xl text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-body mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={user.lastName}
                    onChange={handleUserUpdate}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-paper border border-mist rounded-xl text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-body mb-2">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleUserUpdate}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-paper border border-mist rounded-xl text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-body mb-2">
                    <Phone className="h-4 w-4 inline mr-1" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={user.phoneNumber}
                    onChange={handleUserUpdate}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-paper border border-mist rounded-xl text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={saveProfile}
                    className="flex items-center rounded-pill px-6 py-2 bg-accent hover:bg-accent-hover text-ink transition-colors"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {/* Password Section */}
            <div className="bg-sand rounded-3xl border border-sand p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Key className="h-5 w-5 text-ink mr-2" />
                  <h3 className="text-lg font-medium text-ink">Security</h3>
                </div>
                <button
                  onClick={() => setIsChangingPassword(!isChangingPassword)}
                  className="rounded-pill px-5 py-2 bg-accent hover:bg-accent-hover text-ink transition-colors text-sm"
                >
                  {isChangingPassword ? "Cancel" : "Change Password"}
                </button>
              </div>

              {isChangingPassword && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-body mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 pr-10 bg-paper border border-mist rounded-xl text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("current")}
                        className="absolute right-3 top-2.5 text-muted hover:text-ink"
                      >
                        {showPasswords.current ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-body mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 pr-10 bg-paper border border-mist rounded-xl text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("new")}
                        className="absolute right-3 top-2.5 text-muted hover:text-ink"
                      >
                        {showPasswords.new ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-body mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 pr-10 bg-paper border border-mist rounded-xl text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirm")}
                        className="absolute right-3 top-2.5 text-muted hover:text-ink"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <button
                      onClick={changePassword}
                      className="flex items-center px-6 py-2 bg-accent hover:bg-accent-hover text-ink rounded-xl transition-colors"
                    >
                      <Key className="h-4 w-4 mr-2" />
                      Update Password
                    </button>
                  </div>
                </div>
              )}

              {!isChangingPassword && (
                <div className="text-muted text-sm">
                  <p>Keep your account secure by using a strong password.</p>
                  <p className="mt-1">
                    Password requirements: At least 8 characters long.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
