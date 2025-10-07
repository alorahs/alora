import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/context/notification_context";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "@/context/websocket_context";
import { useEffect, useState } from "react";

export function NotificationDropdown() {
  const { notifications, markAsRead, markAllAsRead, unreadCount } =
    useNotifications();
  const { isConnected } = useWebSocket();
  const [newNotification, setNewNotification] = useState(false);
  const navigate = useNavigate();

  // Reset new notification indicator when dropdown is opened
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setNewNotification(false);
    }
  };

  // Set new notification indicator when notifications change
  useEffect(() => {
    if (notifications.length > 0 && !notifications[0].read) {
      setNewNotification(true);
    }
  }, [notifications]);

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-700";
      case "error":
        return "text-red-700";
      case "warning":
        return "text-yellow-700";
      default:
        return "text-blue-700";
    }
  };

  const handleNotificationClick = (id: string, url: string | null) => {
    // Mark as read only if id is valid
    if (id) {
      markAsRead(id);
    }

    // Navigate to the URL if it exists
    if (url) {
      navigate(url);
    }
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
              {unreadCount}
            </span>
          )}
          {newNotification && (
            <span className="absolute bottom-0 right-0 inline-flex items-center justify-center w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start p-4 ${
                  !notification.read ? "bg-gray-50" : ""
                }`}
                onClick={() =>
                  handleNotificationClick(notification.id, notification.url)
                }
              >
                <div className="flex w-full">
                  <div className="flex-shrink-0 mr-3">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium ${getColor(
                        notification.type
                      )}`}
                    >
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}