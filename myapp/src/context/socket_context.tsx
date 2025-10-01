import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { API_URL } from "./auth_provider";
import { useAuth } from "./auth_provider";
import { useNotifications } from "./notification_context";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();
  const { setNotifications } = useNotifications();

  useEffect(() => {
    if (!user) return;

    // Create socket connection
    const newSocket = io(API_URL.replace("/api", ""), {
      transports: ["websocket"],
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      setIsConnected(true);

      // Register user with the server
      newSocket.emit("register", user._id);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    // Listen for new notifications
    newSocket.on("newNotification", (notification) => {
      console.log("New notification received:", notification);

      // Add the new notification to the notifications list
      setNotifications((prev) => {
        // Check if notification already exists to avoid duplicates
        const exists = prev.some((n) => n.id === notification._id);
        if (exists) return prev;

        // Convert the notification to the expected format
        const formattedNotification = {
          id: notification._id,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          read: notification.read,
          url: notification.url,
          createdAt: notification.createdAt,
          updatedAt: notification.updatedAt,
        };

        // Add to the beginning of the list (most recent first)
        return [formattedNotification, ...prev];
      });
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, [user, setNotifications]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}
