import React, { createContext, useContext, useState, useEffect } from "react";
import { API_URL, useAuth } from "./auth_provider";
import { Loader } from "@/components/shared";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  url: string | null;
  createdAt: string;
  updatedAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  refreshNotifications: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const refreshNotifications = async () => {
    // Only fetch notifications if user is authenticated
    if (!user) {
      setNotifications([]);
      return;
    }

    try {
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
            id: notification._id || notification.id || '', // Use _id from MongoDB
            title: notification.title || '',
            message: notification.message || '',
            type: notification.type && ['info', 'success', 'warning', 'error'].includes(notification.type) 
              ? notification.type 
              : 'info',
            read: Boolean(notification.read),
            url: notification.url || null,
            createdAt: notification.createdAt || new Date().toISOString(),
            updatedAt: notification.updatedAt || new Date().toISOString(),
          })).filter((notification) => notification.id); // Filter out notifications without IDs
          
          setNotifications(notificationsWithDates);
        } else {
          console.warn('Unexpected notifications data format:', data);
          setNotifications([]);
        }
      } else { 
        if (user) {
        const errorText = await response.text();
        console.error('Failed to fetch notifications:', errorText);
        toast({
          title: "Failed to fetch notifications",
          description: "Please try again later",
          variant: "destructive"
        });
        setNotifications([]);
      }}
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive"
      });
      setNotifications([]); // Ensure we have a clean state on error
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      // If no user, clear notifications and return
      if (!user) {
        setNotifications([]);
        setIsLoading(false);
        return;
      }

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

        await refreshNotifications();
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
  }, [user, toast]);

  const markAsRead = async (id: string) => {
    // Prevent calling API with empty ID
    if (!id) {
      console.warn('Attempted to mark notification as read with empty ID');
      return;
    }
    
    // Don't proceed if no user
    if (!user) {
      return;
    }
    
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
    // Only proceed if there are unread notifications and user exists
    if (unreadCount === 0 || !user) {
      return;
    }
    
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

  if (isLoading) {
    return React.createElement(Loader);
  }

  return React.createElement(
    NotificationContext.Provider,
    {
      value: {
        notifications,
        setNotifications,
        markAsRead,
        markAllAsRead,
        refreshNotifications,
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