"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface User {
  email: string;
  // Add other user properties as needed
}

interface AuthToken {
  token: string;
  expiry: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  getAuthToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<AuthToken | null>(null);

  // Check if user is already logged in on initial load
  useEffect(() => {
    const tokenData = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");

    if (tokenData && userData) {
      try {
        const parsedToken: AuthToken = JSON.parse(tokenData);

        // Check if token is still valid
        if (new Date(parsedToken.expiry) > new Date()) {
          setIsLoggedIn(true);
          setUser(JSON.parse(userData));
          setAuthToken(parsedToken);
        } else {
          // Token expired, clear storage
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
        }
      } catch (e) {
        // Invalid token data, clear storage
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Set up token expiration check
  useEffect(() => {
    if (authToken) {
      const expiryTime = new Date(authToken.expiry).getTime();
      const currentTime = new Date().getTime();
      const timeUntilExpiry = expiryTime - currentTime;

      if (timeUntilExpiry > 0) {
        const timer = setTimeout(() => {
          logout();
        }, timeUntilExpiry);

        return () => clearTimeout(timer);
      } else {
        // Token already expired
        logout();
      }
    }
  }, [authToken]);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(
        "https://n8n.srv926513.hstgr.cloud/webhook/auth",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Extract token and expiry from response
        const tokenData: AuthToken = {
          token: data.Token,
          expiry: data.Expiry,
        };

        const userData = { email };

        // Store token and user data in localStorage
        localStorage.setItem("authToken", JSON.stringify(tokenData));
        localStorage.setItem("user", JSON.stringify(userData));

        setIsLoggedIn(true);
        setUser(userData);
        setAuthToken(tokenData);

        return { success: true };
      } else {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.message || "Invalid credentials",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const logout = () => {
    // Clear auth data from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setUser(null);
    setAuthToken(null);
  };

  const getAuthToken = (): string | null => {
    if (authToken && new Date(authToken.expiry) > new Date()) {
      return authToken.token;
    }
    return null;
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, login, logout, getAuthToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
