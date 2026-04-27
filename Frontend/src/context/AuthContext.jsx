import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const MOCK_USERS = {
  admin: { id: 1, name: "Sahil Dobaria", email: "admin@nexhire.com", role: "Admin", avatar: "SD" },
  hr: { id: 2, name: "Het Limbani", email: "hr@nexhire.com", role: "HR Recruiter", avatar: "HL" },
  vendor: { id: 3, name: "Rohan Upadhyay", email: "vendor@nexhire.com", role: "Vendor", avatar: "RU" },
  manager: { id: 4, name: "Priya Sharma", email: "manager@nexhire.com", role: "Hiring Manager", avatar: "PS" },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        // Normalize to include fields expected by UI components
        const normalizedUser = {
          ...parsedUser,
          name: parsedUser.name || parsedUser.full_name || "User",
          avatar: parsedUser.avatar || (parsedUser.full_name || "U")
            .split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 2),
        };
        setUser(normalizedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      }
    }

    // Mark initialization as complete regardless of outcome
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const key = email.split("@")[0];
    const matchedUser = MOCK_USERS[key];
    if (matchedUser && password === "nexhire123") {
      setUser(matchedUser);
      setIsAuthenticated(true);
      return { success: true, user: matchedUser };
    }
    return { success: false, message: "Invalid email or password" };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("demoUser");
    localStorage.removeItem("demoRole");
    localStorage.removeItem("email");
  };

  const setAuthFromAPI = (userData) => {
    // Normalize API user data to include fields expected by UI components
    const normalizedUser = {
      ...userData,
      name: userData.name || userData.full_name || "User",
      avatar: userData.avatar || (userData.full_name || "U")
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
    };
    setUser(normalizedUser);
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, setAuthFromAPI }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

export default AuthContext;
