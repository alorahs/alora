import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import { proxyApiRequest } from "@/lib/apiProxy";

interface NotificationBadgeProps {
  onClick: () => void;
}

export default function NotificationBadge({ onClick }: NotificationBadgeProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUnreadCount();
    
    // Set up polling for notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await proxyApiRequest("/notifications/unread-count", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.count);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={onClick}
      className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
    >
      <Bell className="h-6 w-6" />
      {unreadCount > 0 && (
        <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center p-0">
          {unreadCount > 99 ? "99+" : unreadCount}
        </Badge>
      )}
    </button>
  );
}