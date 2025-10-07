import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "../interfaces/user";
import { Loader } from "../components/shared";
// Import proxy function
import { proxyApiRequest } from "../lib/apiProxy";

// Define interfaces for error structures
interface ValidationError {
  msg: string;
  param?: string;
  location?: string;
}

interface ErrorData {
  errors?: ValidationError[];
  message?: string;
}

interface LoginParams {
  identifier: string;
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
  // Fix: Replace 'any' with specific error type
  error: ErrorData | null
  setError: React.Dispatch<React.SetStateAction<ErrorData | null>>
  success: string | null
  login: (loginData: LoginParams) => Promise<boolean>
  signup: (userData: SignupParams) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}
export const API_URL = import.meta.env.VITE_API_URL || "http://192.168.29.162:5000/api";
// API_KEY is no longer needed on the client side for proxied requests
// export const API_KEY = import.meta.env.VITE_API_KEY || "a587e4d8bb883a03b5ea14411c4e1e1d94589702";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthMeResponse {
  user?: User;
}

const buildErrorData = (payload: unknown, fallbackMsg: string): ErrorData => {
  if (payload && typeof payload === "object") {
    const maybeErrorData = payload as Partial<ErrorData>;

    if (Array.isArray(maybeErrorData.errors)) {
      return { errors: maybeErrorData.errors };
    }

    if (typeof maybeErrorData.message === "string") {
      return { message: maybeErrorData.message };
    }
  }

  return { errors: [{ msg: fallbackMsg }] };
};

const parseJsonSafe = async <T>(response: Response): Promise<T | null> => {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Fix: Replace 'any' with specific error type
  const [error, setError] = useState<ErrorData | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const refreshResponse = await proxyApiRequest("/auth/refresh", {
          method: "POST",
          credentials: "include",
          body: {},
        });
        const refreshPayload = await parseJsonSafe<ErrorData & { msg?: string }>(refreshResponse);

        if (!refreshResponse.ok) {
          setError(buildErrorData(refreshPayload, "Failed to refresh token"));
          setUser(null);
          return;
        }

        if (refreshPayload?.msg) {
          setSuccess(refreshPayload.msg);
        }

        const meResponse = await proxyApiRequest("/auth/me", {
          method: "GET",
          credentials: "include",
        });
        const mePayload = await parseJsonSafe<AuthMeResponse & ErrorData>(meResponse);

        if (!meResponse.ok) {
          setError(buildErrorData(mePayload, "Failed to fetch authenticated user"));
          setUser(null);
          return;
        }

        if (mePayload?.user) {
          setUser({ ...mePayload.user });
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
        setError({errors:[{msg: "Server error: " + (error as Error).message}]});
        setSuccess(null);
      } finally {
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
      const { identifier, password } = loginData;
      if (!identifier) {
        setError({message: "Please provide username, email or phone to login"});
        return false;
      }
      const resLogin = await proxyApiRequest("/auth/login", {
        method: "POST",
        body: { identifier, password },
        credentials: "include",
      });

      const loginPayload = await parseJsonSafe<ErrorData>(resLogin);

      if (resLogin.status === 400 || !resLogin.ok) {
        setError(buildErrorData(loginPayload, "Login failed"));
        return false;
      }
      setSuccess("Login successful");
      const meResponse = await proxyApiRequest("/auth/me", {
        method: "GET",
        credentials: "include",
      });
      const mePayload = await parseJsonSafe<AuthMeResponse & ErrorData>(meResponse);

      if (!meResponse.ok) {
        setUser(null);
        setError(buildErrorData(mePayload, "Failed to fetch authenticated user"));
        return false;
      }

      if (mePayload?.user) {
        setUser({ ...mePayload.user });
      } else {
        setUser(null);
      }
      return true;
    } catch (error) {
      setError({errors:[{msg: "Server error: " + (error as Error).message}]});
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: SignupParams): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await proxyApiRequest("/auth/register", {
        method: "POST",
        body: {
          email: userData.email,
          phone: userData.phone,
          username: userData.username,
          password: userData.password,
          fullName: userData.fullName,
          role: userData.role.toLowerCase(),
        },
        credentials: "include",
      });
      const signupPayload = await parseJsonSafe<ErrorData>(response);

      if (response.status === 400 || !response.ok) {
        setError(buildErrorData(signupPayload, "Signup failed"));
        return false;
      }
      setSuccess("Signup successful! Please verify your email.");
      return true;
    } catch (error) {
      setError({message: "Server error: " + (error as Error).message});
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const logoutResponse = await proxyApiRequest("/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!logoutResponse.ok) {
        const logoutPayload = await parseJsonSafe<ErrorData>(logoutResponse);
        setError(buildErrorData(logoutPayload, "Logout failed"));
      } else {
        setSuccess("Logged out successfully");
      }
    } catch (error) {
      setError({message: "Server error: " + (error as Error).message});
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