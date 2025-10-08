import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { proxyApiRequest } from "@/lib/apiProxy";
import { useToast } from "@/hooks/use-toast";
import { 
  Bell, 
  Check, 
  Archive, 
  Trash2, 
  Clock, 
  AlertCircle,
  CheckCircle,
  Info,
  XCircle,
  Star,
  Calendar,
  CreditCard,
  MessageSquare
} from "lucide-react";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  read: boolean;
  readAt?: string;
  archived: boolean;
  archivedAt?: string;
  url?: string;
  actionUrl?: string;
  actionText?: string;
  relatedEntity?: {
    type: string;
    id: string;
  };
  channels: string[];
  sentAt?: string;
  deliveryStatus: string;
  createdAt: string;
}

export default function NotificationsList() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "archived">("all");

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      let url = "/notifications";
      if (filter === "unread") {
        url += "?read=false";
      } else if (filter === "archived") {
        url += "?archived=true";
      }

      const response = await proxyApiRequest(url, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast({
        title: "Error",
        description: "Failed to fetch notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [filter, toast]);

  useEffect(() => {
    void fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await proxyApiRequest(
        `/notifications/${notificationId}/read`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      if (response.ok) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification._id === notificationId
              ? { ...notification, read: true, readAt: new Date().toISOString() }
              : notification
          )
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  };

  const markAsUnread = async (notificationId: string) => {
    try {
      const response = await proxyApiRequest(
        `/notifications/${notificationId}/unread`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      if (response.ok) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification._id === notificationId
              ? { ...notification, read: false, readAt: undefined }
              : notification
          )
        );
      }
    } catch (error) {
      console.error("Error marking notification as unread:", error);
      toast({
        title: "Error",
        description: "Failed to mark notification as unread",
        variant: "destructive",
      });
    }
  };

  const archiveNotification = async (notificationId: string) => {
    try {
      const response = await proxyApiRequest(
        `/notifications/${notificationId}/archive`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      if (response.ok) {
        if (filter === "archived") {
          setNotifications((prevNotifications) =>
            prevNotifications.map((notification) =>
              notification._id === notificationId
                ? { ...notification, archived: true, archivedAt: new Date().toISOString() }
                : notification
            )
          );
        } else {
          setNotifications((prevNotifications) =>
            prevNotifications.filter(
              (notification) => notification._id !== notificationId
            )
          );
        }
      }
    } catch (error) {
      console.error("Error archiving notification:", error);
      toast({
        title: "Error",
        description: "Failed to archive notification",
        variant: "destructive",
      });
    }
  };

  const unarchiveNotification = async (notificationId: string) => {
    try {
      const response = await proxyApiRequest(
        `/notifications/${notificationId}/unarchive`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      if (response.ok) {
        if (filter === "archived") {
          setNotifications((prevNotifications) =>
            prevNotifications.filter(
              (notification) => notification._id !== notificationId
            )
          );
        } else {
          setNotifications((prevNotifications) =>
            prevNotifications.map((notification) =>
              notification._id === notificationId
                ? { ...notification, archived: false, archivedAt: undefined }
                : notification
            )
          );
        }
      }
    } catch (error) {
      console.error("Error unarchiving notification:", error);
      toast({
        title: "Error",
        description: "Failed to unarchive notification",
        variant: "destructive",
      });
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await proxyApiRequest(
        `/notifications/${notificationId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        setNotifications((prevNotifications) =>
          prevNotifications.filter(
            (notification) => notification._id !== notificationId
          )
        );
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info className="h-4 w-4" />;
      case "success":
        return <CheckCircle className="h-4 w-4" />;
      case "warning":
        return <AlertCircle className="h-4 w-4" />;
      case "error":
        return <XCircle className="h-4 w-4" />;
      case "booking":
        return <Calendar className="h-4 w-4" />;
      case "review":
        return <Star className="h-4 w-4" />;
      case "payment":
        return <CreditCard className="h-4 w-4" />;
      case "message":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "info":
        return "bg-blue-100 text-blue-800";
      case "success":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "booking":
        return "bg-purple-100 text-purple-800";
      case "review":
        return "bg-orange-100 text-orange-800";
      case "payment":
        return "bg-teal-100 text-teal-800";
      case "message":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "low":
        return <Badge variant="secondary">Low</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium</Badge>;
      case "high":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">High</Badge>;
      case "urgent":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Urgent</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${diffInDays}d ago`;
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "unread") return !notification.read && !notification.archived;
    if (filter === "archived") return notification.archived;
    return !notification.archived;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
        <div className="flex space-x-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("unread")}
          >
            Unread
          </Button>
          <Button
            variant={filter === "archived" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("archived")}
          >
            Archived
          </Button>
        </div>
      </div>

      {filteredNotifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === "archived"
              ? "You don't have any archived notifications."
              : "You're all caught up! Check back later for new notifications."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification._id}
              className={`bg-white rounded-lg shadow p-4 border-l-4 ${
                notification.read
                  ? "border-gray-200"
                  : "border-blue-500 bg-blue-50"
              }`}
            >
              <div className="flex justify-between">
                <div className="flex items-start">
                  <div
                    className={`flex items-center justify-center h-8 w-8 rounded-full ${getTypeColor(
                      notification.type
                    )} flex-shrink-0`}
                  >
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="ml-3">
                    <div className="flex items-center">
                      <h4 className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    <div className="flex items-center mt-2 space-x-4">
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(notification.createdAt)}
                      </span>
                      {getPriorityBadge(notification.priority)}
                      {notification.deliveryStatus === "failed" && (
                        <Badge variant="destructive">Failed</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!notification.read ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(notification._id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsUnread(notification._id)}
                    >
                      <Bell className="h-4 w-4" />
                    </Button>
                  )}
                  {filter !== "archived" ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => archiveNotification(notification._id)}
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => unarchiveNotification(notification._id)}
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteNotification(notification._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {(notification.actionUrl || notification.url) && (
                <div className="mt-3 flex space-x-2">
                  {notification.actionUrl && notification.actionText && (
                    <Button size="sm" asChild>
                      <a href={notification.actionUrl}>{notification.actionText}</a>
                    </Button>
                  )}
                  {notification.url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={notification.url}>View Details</a>
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}