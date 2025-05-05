/* src/components/FeedContent/ProfileContent.jsx */
import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext"; // Assuming this path is correct
import { toast } from "react-toastify"; // ToastContainer should be higher up
import { FaPen, FaTrashAlt, FaArrowLeft, FaArrowRight } from "react-icons/fa";

// Import the new consolidated profile styles
import '../styles/profile.scss'; // Make sure this path is correct

// Define the different screens/views within the profile component
const SCREENS = {
    AUTH: 'auth', // Login/Register form
    DETAILS: 'details', // Profile picture, main options (Profile, Orders, etc.)
    OPTIONS: 'options', // Personal Info, Address, Cards options
    PERSONAL_INFO: 'personalInfo', // Placeholder for Personal Info form
    ADDRESS: 'address', // Placeholder for Address form
    CARDS: 'cards', // Placeholder for Cards form
    WELCOME: 'welcome' // Optional: show a welcome message after registration
};

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dwk5eorvm/upload";
const CLOUDINARY_PRESET = "profile_images";

// Simple Placeholder Component for sub-screens
const Placeholder = ({ name }) => (
    <div className="tab-content">{name} content goes here.</div>
);

const ProfileContent = () => {
    const { user, login, register, logout, updateProfile, deleteAccount } = useUser();

    // State for managing the current screen/view
    const [currentScreen, setCurrentScreen] = useState(SCREENS.AUTH);
    // State for managing navigation history
    const [screenHistory, setScreenHistory] = useState([SCREENS.AUTH]);
    const [historyIndex, setHistoryIndex] = useState(0);

    // State for auth form (from Profile.jsx)
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [justRegistered, setJustRegistered] = useState(false);

    // State for profile details (from Profile2.jsx)
    const [profileImage, setProfileImage] = useState(user?.profileImage || "");

    // Effect to set initial screen based on user status
    useEffect(() => {
        if (user) {
            // If logged in, go to details screen unless just registered
            if (justRegistered) {
                setCurrentScreen(SCREENS.WELCOME); // Show welcome message
                setScreenHistory([SCREENS.AUTH, SCREENS.WELCOME]);
                setHistoryIndex(1);
                // Optional: automatically transition from welcome to details after delay
                const timer = setTimeout(() => {
                    navigateTo(SCREENS.DETAILS);
                    setJustRegistered(false); // Reset the flag after showing welcome
                }, 5000); // Show welcome for 5 seconds
                return () => clearTimeout(timer);

            } else {
                setCurrentScreen(SCREENS.DETAILS);
                setScreenHistory([SCREENS.DETAILS]); // Reset history when starting at details
                setHistoryIndex(0);
            }
        } else {
            // If not logged in, stay on auth screen
            setCurrentScreen(SCREENS.AUTH);
            setScreenHistory([SCREENS.AUTH]); // Reset history when starting at auth
            setHistoryIndex(0);
        }
    }, [user]); // Depend on user status

    // Update profile image state when user context updates
    useEffect(() => {
        if (user?.profileImage) {
            setProfileImage(user.profileImage);
        } else if (user) {
             // User logged in but no profile image
             setProfileImage(""); // Use default
        } else {
             // User logged out
             setProfileImage("");
        }
    }, [user?.profileImage, user]);


      // --- Internal Navigation Logic ---

      // Navigate to a specific screen, adding to history
      const navigateTo = (screen) => {
           // Prevent navigating to the same screen unless it's the first entry or intentional loop
           if (screenHistory[historyIndex] === screen && historyIndex === screenHistory.length - 1) {
               return;
           }
           const newHistory = screenHistory.slice(0, historyIndex + 1); // Cut off future history
           setScreenHistory([...newHistory, screen]);
           setHistoryIndex(newHistory.length); // Index is the last element's index
           setCurrentScreen(screen);
      };

      // Go back in history
      const goBack = () => {
           if (historyIndex > 0) {
               setHistoryIndex(historyIndex - 1);
               setCurrentScreen(screenHistory[historyIndex - 1]);
           }
      };

       // Go forward in history
       const goForward = () => {
           if (historyIndex < screenHistory.length - 1) {
               setHistoryIndex(historyIndex + 1);
               setCurrentScreen(screenHistory[historyIndex + 1]);
           }
      };


    // --- Auth Handlers ---
    const handleSubmitLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Pass role: "user" if your login function requires it
            await login({ email, password, role: "user" });
            toast.success("Login successful");
            // User effect will handle screen change to DETAILS
        } catch (error) {
            toast.error(error.message);
        }
        setIsLoading(false);
    };

    const handleSubmitRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }
        setIsLoading(true);
        try {
            // Pass role: "user" if your register function requires it
            await register({ name, email, password, role: "user" });
            setJustRegistered(true); // Signal that registration just occurred
            toast.success(`Welcome to the Haya family, ${name}!`);
            // User effect will handle screen change to WELCOME or DETAILS
        } catch (error) {
            toast.error(error.message);
        }
        setIsLoading(false);
    };

    // --- Profile Details Handlers ---
      const handleImageUpload = async (e) => {
         const file = e.target.files[0];
         if (!file) return;

         const formData = new FormData();
         formData.append("file", file);
         formData.append("upload_preset", CLOUDINARY_PRESET);

         try {
             const res = await fetch(CLOUDINARY_URL, {
                 method: "POST",
                 body: formData,
             });

             const responseBody = await res.json();
             if (!res.ok) throw new Error(responseBody.message || "Unknown error");

             const imageUrl = responseBody.secure_url;
             // Assuming updateProfile merges updates and triggers user context update
             await updateProfile({ profileImage: imageUrl });
             // Image state will be updated by the useEffect that watches user.profileImage
             toast.success("Profile picture updated!");
         } catch (error) {
             console.error("Image upload failed:", error); // Log the error
             toast.error("Failed to upload image");
         }
      };

      const handleDeleteProfileImage = async () => {
         if (!user) return; // Should not happen if delete button is visible

         if (window.confirm("Are you sure you want to delete your profile photo?")) {
             try {
                // Assuming updateProfile can handle setting profileImage to "" and might need userId
                await updateProfile({ profileImage: "", userId: user._id });
                // Image state will be updated by the useEffect that watches user.profileImage
                toast.success("Profile photo deleted.");
             } catch (error) {
                console.error("Delete image failed:", error); // Log the error
                toast.error("Failed to delete image: " + error.message);
             }
         }
      };

    const handleSignOut = async () => {
        try {
            await logout();
            toast.success("Signed out successfully");
            // User effect will handle screen change to AUTH
             // Reset state after logout
             setIsLogin(true);
             setEmail("");
             setPassword("");
             setConfirmPassword("");
             setName("");
             setJustRegistered(false);
             setProfileImage("");
        } catch (error) {
            console.error("Sign out failed:", error); // Log the error
            toast.error(error.message);
        }
    };

    const handleDeleteAccount = async () => {
        if (!user) return; // Should not happen

        if (window.confirm("Are you sure you want to delete your account? This action is irreversible!")) {
            try {
                 // Assuming deleteAccount function exists in your UserContext and takes user ID
                 await deleteAccount(user._id);
                 toast.success("Account deleted successfully");
                 // User effect will handle screen change to AUTH
                 // State will be reset by handleSignOut which is triggered by logout
            } catch (error) {
                 console.error("Delete account failed:", error); // Log the error
                 toast.error("Failed to delete account: " + error.message);
            }
        }
    };

    // --- Render Logic based on currentScreen state ---
    const renderContent = () => {
         // If user is NOT logged in, *always* show auth screen regardless of currentScreen state
         // This prevents logged-out users from seeing other screens by manipulating history
         if (!user) {
             return (
                 <>
                    {/* Toggle buttons are now direct children of profile-content-container */}
                    {/* Added inline style for font */}
                    <div className="toggle-buttons" style={{ fontFamily: "'Overpass Mono', sans-serif" }}>
                           <button
                                className={`toggle-button ${isLogin ? "active" : ""}`}
                                onClick={() => setIsLogin(true)}
                                disabled={isLoading} // Disable while loading
                           >
                                LOGIN
                           </button>
                           <button
                                className={`toggle-button ${!isLogin ? "active" : ""}`}
                                onClick={() => setIsLogin(false)}
                                 disabled={isLoading} // Disable while loading
                           >
                                REGISTER
                           </button>
                     </div>
                     {/* Inner box contains the forms */}
                     <div className="inner-box">
                         {isLogin ? (
                             <>
                                 <h2 className="form-heading">LOGIN TO YOUR ACCOUNT</h2>
                                 <form className="login-form" onSubmit={handleSubmitLogin}>
                                     <input type="email" placeholder="Email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
                                     <input type="password" placeholder="Password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
                                     <button type="submit" className="action-button" disabled={isLoading}>{isLoading ? "Logging in..." : "LOGIN"}</button>
                                 </form>
                             </>
                         ) : (
                             <>
                                 <h2 className="form-heading">CREATE A NEW ACCOUNT</h2>
                                 <form className="login-form" onSubmit={handleSubmitRegister}>
                                     <input type="text" placeholder="Full Name" className="input-field" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} />
                                     <input type="email" placeholder="Email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
                                     <input type="password" placeholder="Password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
                                     <input type="password" placeholder="Confirm Password" className="input-field" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={isLoading} />
                                     <button type="submit" className="action-button" disabled={isLoading}>{isLoading ? "Registering..." : "REGISTER"}</button>
                                 </form>
                             </>
                         )}
                     </div>
                 </>
             );
         }

         // If user IS logged in, render content based on currentScreen state
         switch (currentScreen) {
             case SCREENS.WELCOME:
                 return (
                      <div className="inner-box"> {/* Wrap content in inner-box */}
                           {/* Welcome message displayed when a new user registers */}
                           <div className="welcome-message">
                             <h2>Welcome to the Haya family, {user?.name}!</h2>
                             <p>We're so glad to have you join us.</p>
                             <p>Taking you to your profile...</p>
                           </div>
                      </div>
                 );
             case SCREENS.DETAILS:
                 return (
                      <div className="inner-box"> {/* Wrap content in inner-box */}
                         <h2 className="form-heading">PROFILE DETAILS</h2>

                         {/* Profile Image */}
                         <div className="profile-image-container">
                              <img
                                   src={profileImage || "/default-profile.png"} // Use profileImage state
                                   alt="Profile"
                                   className="profile-image"
                              />
                              <div className="profile-image-actions">
                                   <FaPen className="icon" onClick={() => document.getElementById("fileInput").click()} />
                                   {/* Only show delete if there is an image */}
                                   {profileImage && (
                                        <FaTrashAlt className="icon delete-icon" onClick={handleDeleteProfileImage} />
                                   )}
                                   <input type="file" id="fileInput" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
                              </div>
                         </div>

                         {/* User Info */}
                          <div className="profile-info">
                               <p>Name: {user?.name}</p>
                               <p>Email: {user?.email}</p>
                               {/* Add other profile info here if available on user object */}
                          </div>

                         {/* Main Profile Options */}
                         <div className="profile-options">
                              {/* Use navigateTo for internal navigation */}
                              <button className="account-options" onClick={() => navigateTo(SCREENS.OPTIONS)}>Profile Options</button>
                              {/* These buttons would navigate within the FeedSection or trigger other modals/sections */}
                              <button className="account-options">Orders</button>
                              <button className="account-options">Notifications</button>
                              <button className="account-options">Settings</button>
                         </div>

                         {/* Account Actions */}
                         <div className="account-actions">
                              <button className="account-action" onClick={handleSignOut}>Sign Out</button>
                              {/* Only allow deletion for regular users */}
                             {user?.role === 'user' && (
                                 <button className="account-action delete" onClick={handleDeleteAccount}>Delete Account</button>
                             )}
                         </div>
                      </div>
                 );

             case SCREENS.OPTIONS:
                 return (
                      <div className="inner-box"> {/* Wrap content in inner-box */}
                         <h2 className="form-heading">PROFILE OPTIONS</h2>
                         <div className="profile-options">
                              <button className="account-options" onClick={() => navigateTo(SCREENS.PERSONAL_INFO)}>Personal Info</button>
                              <button className="account-options" onClick={() => navigateTo(SCREENS.ADDRESS)}>Address</button>
                              <button className="account-options" onClick={() => navigateTo(SCREENS.CARDS)}>Cards</button>
                         </div>
                      </div>
                 );

             case SCREENS.PERSONAL_INFO:
                 return (
                      <div className="inner-box"> {/* Wrap content in inner-box */}
                         <h2 className="form-heading">PERSONAL INFORMATION</h2>
                         {/* Your actual Personal Info form/content goes here */}
                         <Placeholder name="Personal Info" />
                      </div>
                 );

              case SCREENS.ADDRESS:
                  return (
                       <div className="inner-box"> {/* Wrap content in inner-box */}
                          <h2 className="form-heading">ADDRESS</h2>
                           {/* Your actual Address form/content goes here */}
                          <Placeholder name="Address" />
                       </div>
                  );

              case SCREENS.CARDS:
                  return (
                       <div className="inner-box"> {/* Wrap content in inner-box */}
                          <h2 className="form-heading">CARDS</h2>
                           {/* Your actual Cards form/content goes here */}
                          <Placeholder name="Cards" />
                       </div>
                  );

             default:
                 // Should ideally not reach here, but a fallback is good
                 return (
                      <div className="inner-box">
                           <Placeholder name="Unknown Profile Screen" />
                            {/* Optional: add a button to go back home or sign out */}
                       </div>
                 );
         }
    };

    return (
        <div className="profile-content-container">
             {/* Navigation Arrows - only show when logged in and NOT on the initial auth/welcome screen */}
             {user && currentScreen !== SCREENS.AUTH && currentScreen !== SCREENS.WELCOME && (
                 <div className="profile-nav-arrows">
                      <button onClick={goBack} disabled={historyIndex === 0} className="nav-arrow left">
                           <FaArrowLeft /> Back
                      </button>
                      <button onClick={goForward} disabled={historyIndex === screenHistory.length - 1} className="nav-arrow right">
                           Forward <FaArrowRight />
                      </button>
                 </div>
             )}

             {/* Render the content directly inside profile-content-container */}
             {renderContent()}

             {/* ToastContainer should be at the application root */}
             {/* <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover /> */}
        </div>
    );
};

export default ProfileContent;
