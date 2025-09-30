import React, { createContext, useContext, useState, useEffect } from "react";
import { API_URL } from "./auth_provider";
import Loader from "@/components/loader";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string
  updatedAt: string
}

interface NotificationContextType {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        // First verify user authentication
        const responseUser = await fetch(`${API_URL}/auth/me`, { 
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          method: "GET",
        });
        
        if (!responseUser.ok) {
          // If user is not authenticated, don't proceed with notifications fetch
          setIsLoading(false);
          return;
        }

        // Fetch notifications
        const response = await fetch(`${API_URL}/notification`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();

          // Validate and process notifications data
          if (Array.isArray(data)) {
            // Convert createdAt strings to Date objects and ensure proper structure
            const notificationsWithDates = data.map((notification: any) => ({
              id: notification.id || '',
              title: notification.title || '',
              message: notification.message || '',
              type: notification.type && ['info', 'success', 'warning', 'error'].includes(notification.type) 
                ? notification.type 
                : 'info',
              read: Boolean(notification.read),
              createdAt: notification.createdAt || new Date().toISOString(),
              updatedAt: notification.updatedAt || new Date().toISOString(),
            }));
            setNotifications(notificationsWithDates);
          } else {
            console.warn('Unexpected notifications data format:', data);
            setNotifications([]);
          }
        } else {
          const errorText = await response.text();
          console.error('Failed to fetch notifications:', errorText);
          toast({
            title: "Failed to fetch notifications",
            description: "Please try again later",
            variant: "destructive"
          });
          setNotifications([]);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast({
          title: "Error",
          description: "Failed to load notifications",
          variant: "destructive"
        });
        setNotifications([]); // Ensure we have a clean state on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await fetch(`${API_URL}/notification/${id}/read`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );
    }
  };

  const markAllAsRead = async () => {
    try {
      // Update on backend
      await fetch(`${API_URL}/notification/read-all`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true }))
      );
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Fetch notifications when provider is mounted


  if (isLoading) {
    return React.createElement(Loader);
  }

  return React.createElement(
    NotificationContext.Provider,
    {
      value: {
        notifications,
        markAsRead,
        markAllAsRead,
        unreadCount,
      }
    }, children
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}