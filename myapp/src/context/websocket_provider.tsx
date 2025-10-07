import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./auth_provider";
import { useNotifications } from "./notification_context";
import { useToast } from "@/hooks/use-toast";
import { WebSocketContextType, NotificationPayload, UserStatusPayload } from "./websocket_context_types";
import { WebSocketContext } from "./websocket_context_instance";

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const { user } = useAuth();
  const { refreshNotifications } = useNotifications();
  const { toast } = useToast();

  useEffect(() => {
    // Only connect if user is authenticated
    if (!user) {
      // Disconnect if user logs out
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    // Get the auth token from cookies
    const getAuthToken = (): string | null => {
      const cookies = document.cookie.split("; ");
      const tokenCookie = cookies.find(cookie => cookie.startsWith("token="));
      return tokenCookie ? tokenCookie.split("=")[1] : null;
    };

    const token = getAuthToken();
    
    // If no token, don't connect
    if (!token) {
      console.warn("No auth token found, skipping WebSocket connection");
      return;
    }

    // Disconnect existing connection if any
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    // Connect to WebSocket server
    const API_URL = import.meta.env.VITE_API_URL || "http://192.168.29.162:5000";
    // Extract base URL (remove /api if present)
    const baseURL = API_URL.replace("/api", "");
    
    socketRef.current = io(baseURL, {
      auth: {
        token: token,
      },
      withCredentials: true,
    });

    // Connection events
    socketRef.current.on("connect", () => {
      console.log("WebSocket connected:", socketRef.current?.id);
      setIsConnected(true);
      
      // Register user with socket ID
      socketRef.current?.emit("register", user._id);
    });

    socketRef.current.on("disconnect", () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    });

    socketRef.current.on("connect_error", (error: Error) => {
      console.error("WebSocket connection error:", error);
      setIsConnected(false);
      toast({
        title: "Connection Error",
        description: "Failed to connect to real-time notifications",
        variant: "destructive",
      });
    });

    // Notification event
    socketRef.current.on("newNotification", (notification: NotificationPayload) => {
      console.log("New notification received:", notification);
      
      // Refresh notifications to get the new one
      refreshNotifications();
      
      // Show toast notification
      toast({
        title: notification.title,
        description: notification.message,
      });
    });

    // User status events
    socketRef.current.on("userOnline", (data: UserStatusPayload) => {
      console.log("User came online:", data.userId);
    });

    socketRef.current.on("userOffline", (data: UserStatusPayload) => {
      console.log("User went offline:", data.userId);
    });

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user, refreshNotifications, toast]);

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        socket: socketRef.current,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}