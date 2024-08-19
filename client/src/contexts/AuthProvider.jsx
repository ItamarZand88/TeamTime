import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Assuming you're using react-toastify for notifications
const apiUrl = import.meta.env.VITE_API_URL;

const endpointAut = `${apiUrl}/api/auth`;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token")); // Manage token state

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${endpointAut}/login`, {
        username,
        password,
      });
      const { user, token } = response.data;
      setUser(user);
      setIsAdmin(user.userType === "admin");
      setToken(token); // Update token state
      localStorage.setItem("token", token);
      return user;
    } catch (error) {
      localStorage.removeItem("token");
      setToken(null); // Clear token state on error
      const errMsg = error.response
        ? error.response.data.message
        : error.message;
      toast.error(`Login failed: ${errMsg}`);
      throw new Error(errMsg); // Re-throw with more specific error message
    }
  };

  const logout = async () => {
    try {
      await axios.get(`${endpointAut}/logout`);
      setUser(null);
      setIsAdmin(false);
      localStorage.removeItem("token");
      setToken(null); // Clear token state
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const register = async (
    username,
    password,
    name,
    position,
    email,
    userType
  ) => {
    try {
      const response = await axios.post(`${endpointAut}/register`, {
        username,
        password,
        name,
        position,
        email,
        userType,
      });
      const { user, token } = response.data;
      setUser(user);
      setIsAdmin(user.userType === "admin");
      setToken(token); // Update token state
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (!token) {
        return;
      }

      try {
        const response = await axios.get(`${endpointAut}/status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
        setIsAdmin(response.data.user.userType === "admin");
      } catch (error) {
        localStorage.removeItem("token");
        setToken(null); // Clear token state
      }
    };
    checkAuthStatus();
  }, [token]); // Add token to the dependency array to re-run effect when it changes

  return (
    <AuthContext.Provider
      value={{ user, isAdmin, login, logout, register, token }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
