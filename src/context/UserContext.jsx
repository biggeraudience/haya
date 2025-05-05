import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const BASE_URL = "http://localhost:5000/api";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Refresh token function (for regular users)
  const refreshToken = async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh-token`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        return true;
      } else {
        await logout();
        return false;
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      await logout();
      return false;
    }
  };

  const logout = async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setUser(null);
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const deleteAccount = async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/profile`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setUser(null);
        return true;
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    }
  };

  // Use /auth/profile consistently for fetching the user profile.
  const fetchUser = async () => {
    try {
      let res = await fetch(`${BASE_URL}/admin/profile`, {
        method: "GET",
        credentials: "include",
      });
      // If the admin endpoint fails, fallback to the regular profile endpoint.
      if (!res.ok) {
        res = await fetch(`${BASE_URL}/auth/profile`, {
          method: "GET",
          credentials: "include",
        });
      }
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  

  const refreshUser = async () => {
    await fetchUser();
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async ({ email, password, role }) => {
    let endpoint = "";
    if (role === "admin") {
      endpoint = `${BASE_URL}/admin/login`;
    } else if (role === "superadmin") {
      endpoint = `${BASE_URL}/superadmin/login`;
    } else {
      endpoint = `${BASE_URL}/auth/login`;
    }
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data); // Admin object is set here.
        // Optionally call fetchUser() if you need to refresh additional info.
        return data;
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };
  

  const register = async ({ name, email, password, role, inviteCode }) => {
    let endpoint = "";
    let body = { name, email, password };
    if (role === "user") {
      endpoint = `${BASE_URL}/auth/register`;
    } else if (role === "admin") {
      endpoint = `${BASE_URL}/admin/register`;
      body.inviteCode = inviteCode;
    } else if (role === "superadmin") {
      endpoint = `${BASE_URL}/superadmin/register`;
    } else {
      throw new Error("Invalid role for registration");
    }
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        return data;
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const updateProfile = async (updatedData) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedData),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        return data;
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Profile update failed");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        refreshToken,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserProvider;
