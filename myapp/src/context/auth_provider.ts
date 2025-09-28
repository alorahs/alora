import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "../interfaces/user";
import Loader from "../components/loader";

interface LoginParams {
  email?: string;
  username?: string;
  phone?: string;
  password: string;
}

interface SignupParams {
  fullName: string;
  phone: string;
  username: string;
  email: string;
  password: string;
  role: string;
}

interface AuthContextType {
  user: User | null
  error: any | null
  setError: React.Dispatch<React.SetStateAction<any | null>>
  success: string | null
  login: (loginData: LoginParams) => Promise<boolean>
  signup: (userData: SignupParams) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}
export const API_URL = import.meta.env.VITE_API_URL && "http://192.168.29.162:5000/api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include", // <-- Correct value here
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}), // empty body
        });
        const json = await response.json();
        if (!response.ok || response.status === 400) {
          setError(json.errors || "Failed to refresh token");
        }
        setSuccess(json.msg || "Token refreshed");
        const res = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok || response.status === 400) {
          setError(json.errors || "Failed to refresh token");
        } else {
          const data = await res.json();
          const userData = data.user;
          setUser({ ...userData });
        }
      } catch (error) {
        setUser(null);
        setError({errors:[{msg: "Server error: " + (error as Error).message}]});
        setSuccess(null);
      } finally {
        setError(null);
        setSuccess(null);
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (loginData: LoginParams): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const { password, email, username, phone } = loginData;
      if (!username && !email && !phone) {
        setError("Please provide any one [username, email or phone] to login");
        return ({ "message": "Please provide any one [username, email or phone] to login" }) as unknown as boolean;
      }
      const resLogin = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        body: JSON.stringify({ email, username, phone, password }),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (resLogin.status == 400 || !resLogin.ok) {
        const errorData = await resLogin.json();
        setError(errorData.errors || "Login failed");
        return ({ "message": "Login failed", "errors": errorData.errors || [] }) as unknown as boolean;
      }
      setSuccess("Login successful");
      const res = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      const userData = data.user;
      setUser({ ...userData });
      return true;
    } catch (error) {
      setError({errors:[{msg: "Server error: " + (error as Error).message}]});
      return ({ "message": "Server error: " + (error as Error).message }) as unknown as boolean;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: SignupParams): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      console.log(userData);
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        body: JSON.stringify({
          email: userData.email,
          phone: userData.phone,
          username: userData.username,
          password: userData.password,
          fullName: userData.fullName,
          role: userData.role.toLowerCase(),
        }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.status == 400) {
        const errorData = await response.json();
        setError(errorData.errors);
        return ({ "message": "signup failed", "errors": errorData.errors }) as unknown as boolean;
      }
      if (!response.ok) {
        setError("Signup failed");
      }
      setSuccess("Signup successful! Please verify your email.");
      return true;
    } catch (error: any) {
      setError("Server error: " + error.message);
      return ({ "message": "Server error: " + error.message }) as unknown as boolean;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      setError("Server error: " + (error as Error).message);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return React.createElement(Loader);
  }

  return React.createElement(
    AuthContext.Provider,
    { value: { user, login, signup, logout, isLoading, error, success, setError } },
    children
  );
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}