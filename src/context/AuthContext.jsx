import { createContext, useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import socket from "../utils/Socket";
// Create Context
export const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading,setLoading] = useState(false);
  const [loggedin,setLoggedin] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  // Check if user is already logged in (when app loads)
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/v1/user/getUser", { withCredentials: true })
      .then((res) => {
        setUser(res.data.user);
        socket.emit("join", res.data.user._id);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        setUser(null);
      })
      .finally(() => {
        setLoading(false); // Mark loading as false after request completes
      });
  }, [loggedin]);
  
  // Login function
  const login = async (email, password, rememberMe) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/user/login",
        { email, password, rememberMe },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setUser(response.data.user); // Store user in state
        return true;
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || error.message);
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post("http://localhost:5000/api/v1/user/logout", {}, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error.response?.data?.message || error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout ,loading,setLoading,setLoggedin,loggedin,notifications,setNotifications,showNotifications,setShowNotifications}}>
      {children}
    </AuthContext.Provider>
  );
};
