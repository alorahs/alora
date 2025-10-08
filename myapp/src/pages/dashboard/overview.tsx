import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/auth_provider";
import { proxyApiRequest } from "@/lib/apiProxy";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Calendar,
  Star,
  CreditCard,
  Bell,
  FileText,
  Award,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";

interface Booking {
  _id: string;
  service: string;
  professional: {
    _id: string;
    fullName: string;
  };
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  rating?: number;
  review?: string;
  createdAt: string;
}

interface Favorite {
  _id: string;
  professional: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    category: string;
    rating: number;
    profilePicture?: string;
    hourlyRate?: number;
  };
  createdAt: string;
}

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  read: boolean;
  createdAt: string;
}

interface FileItem {
  _id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  category: string;
  createdAt: string;
}

interface ProfessionalProfile {
  _id: string;
  category: string;
  bio: string;
  skills: string[];
  hourlyRate: number;
  averageRating: number;
  totalReviews: number;
  isVerified: boolean;
}

export default function DashboardOverview() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [professionalProfile, setProfessionalProfile] = useState<ProfessionalProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedBookings: 0,
    pendingBookings: 0,
    unreadNotifications: 0,
    totalFavorites: 0,
    uploadedFiles: 0,
  });
  const fetchData = useCallback(async () => {
    if (!user) {
      setBookings([]);
      setFavorites([]);
      setNotifications([]);
      setFiles([]);
      setProfessionalProfile(null);
      setStats({
        totalBookings: 0,
        completedBookings: 0,
        pendingBookings: 0,
        unreadNotifications: 0,
        totalFavorites: 0,
        uploadedFiles: 0,
      });
      return;
    }

    setLoading(true);
    try {
      const [
        bookingsResponse,
        favoritesResponse,
        notificationsResponse,
        filesResponse,
        professionalResponse,
      ] = await Promise.all([
        proxyApiRequest("/booking", {
          method: "GET",
          credentials: "include",
        }),
        proxyApiRequest("/favorite", {
          method: "GET",
          credentials: "include",
        }),
        proxyApiRequest("/notifications?limit=5", {
          method: "GET",
          credentials: "include",
        }),
        proxyApiRequest("/files?limit=5", {
          method: "GET",
          credentials: "include",
        }),
        user.role === "professional"
          ? proxyApiRequest(`/professional/${user._id}`, {
              method: "GET",
              credentials: "include",
            })
          : Promise.resolve(null),
      ]);

      const nextStats = {
        totalBookings: 0,
        completedBookings: 0,
        pendingBookings: 0,
        unreadNotifications: 0,
        totalFavorites: 0,
        uploadedFiles: 0,
      };

      if (bookingsResponse?.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData);
        nextStats.totalBookings = bookingsData.length;
        nextStats.completedBookings = bookingsData.filter(
          (b: Booking) => b.status === "completed"
        ).length;
        nextStats.pendingBookings = bookingsData.filter(
          (b: Booking) => b.status === "pending" || b.status === "confirmed"
        ).length;
      }

      if (favoritesResponse?.ok) {
        const favoritesData = await favoritesResponse.json();
        setFavorites(favoritesData);
        nextStats.totalFavorites = favoritesData.length;
      }

      if (notificationsResponse?.ok) {
        const notificationsData = await notificationsResponse.json();
        setNotifications(notificationsData);
        nextStats.unreadNotifications = notificationsData.filter(
          (n: Notification) => !n.read
        ).length;
      }

      if (filesResponse?.ok) {
        const filesData = await filesResponse.json();
        setFiles(filesData);
        nextStats.uploadedFiles = filesData.length;
      }

      if (professionalResponse?.ok) {
        const professionalData = await professionalResponse.json();
        setProfessionalProfile(professionalData);
      } else {
        setProfessionalProfile(null);
      }

      setStats(nextStats);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, user]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Completed
          </Badge>
        );
      case "confirmed":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Confirmed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "booking":
        return <Calendar className="h-4 w-4" />;
      case "review":
        return <Star className="h-4 w-4" />;
      case "payment":
        return <CreditCard className="h-4 w-4" />;
      case "info":
        return <Bell className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Please log in
          </h2>
          <p className="text-gray-600">
            You need to be logged in to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.fullName}
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your account today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Bookings
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.totalBookings}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Completed
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.completedBookings}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Pending
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.pendingBookings}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100">
                  <Bell className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Unread Notifications
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.unreadNotifications}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Professional Profile Card (for professionals) */}
            {user.role === "professional" && professionalProfile && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Professional Profile</span>
                    <Link to="/professional/dashboard">
                      <Button variant="outline" size="sm">
                        Manage Profile
                      </Button>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {professionalProfile.category}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {professionalProfile.bio}
                      </p>
                      <div className="mt-3 flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium text-gray-900">
                          {professionalProfile.averageRating.toFixed(1)}
                        </span>
                        <span className="mx-1 text-gray-400">•</span>
                        <span className="text-sm text-gray-600">
                          {professionalProfile.totalReviews} reviews
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          ₹{professionalProfile.hourlyRate}/hr
                        </span>
                        {professionalProfile.isVerified && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      No bookings yet
                    </h3>
                    <p className="text-gray-500">
                      You don't have any bookings at the moment.
                    </p>
                    <Button className="mt-4" asChild>
                      <Link to="/services">Book a Service</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.slice(0, 3).map((booking) => (
                      <div
                        key={booking._id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {booking.service}
                          </h3>
                          <p className="text-sm text-gray-600">
                            with {booking.professional.fullName}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(booking.date).toLocaleDateString()} at{" "}
                            {booking.time}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(booking.status)}
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/profile/booking/${booking._id}`}>
                              View
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Notifications */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                {notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      No notifications
                    </h3>
                    <p className="text-gray-500">
                      You're all caught up! Check back later for new notifications.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications.slice(0, 3).map((notification) => (
                      <div
                        key={notification._id}
                        className="flex items-start p-4 bg-gray-50 rounded-lg"
                      >
                        <div
                          className={`flex items-center justify-center h-8 w-8 rounded-full ${
                            notification.read
                              ? "bg-gray-200 text-gray-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="ml-3 flex-1">
                          <h3 className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatTimeAgo(notification.createdAt)}
                          </p>
                        </div>
                        {!notification.read && (
                          <Badge className="bg-blue-100 text-blue-800">
                            New
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline" asChild>
                  <Link to="/profile">
                    <User className="h-4 w-4 mr-2" />
                    Update Profile
                  </Link>
                </Button>
                <Button className="w-full" variant="outline" asChild>
                  <Link to="/profile#payment-methods">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payment Methods
                  </Link>
                </Button>
                <Button className="w-full" variant="outline" asChild>
                  <Link to="/notifications">
                    <Bell className="h-4 w-4 mr-2" />
                    View All Notifications
                  </Link>
                </Button>
                {user.role === "professional" && (
                  <Button className="w-full" variant="outline" asChild>
                    <Award className="h-4 w-4 mr-2" />
                    <Link to="/professional/dashboard">Professional Dashboard</Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* My Favorites */}
            <Card>
              <CardHeader>
                <CardTitle>My Favorites</CardTitle>
              </CardHeader>
              <CardContent>
                {favorites.length === 0 ? (
                  <div className="text-center py-4">
                    <Star className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      You haven't favorited any professionals yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {favorites.slice(0, 3).map((favorite) => (
                      <div
                        key={favorite._id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {favorite.professional.fullName}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {favorite.professional.category}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-xs font-medium text-gray-900">
                            {favorite.professional.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                    {favorites.length > 3 && (
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link to="/profile#favorites">View All ({favorites.length})</Link>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Files */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Files</CardTitle>
              </CardHeader>
              <CardContent>
                {files.length === 0 ? (
                  <div className="text-center py-4">
                    <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      You haven't uploaded any files yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {files.slice(0, 3).map((file) => (
                      <div key={file._id} className="flex items-center">
                        <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <div className="ml-2 flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.originalName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {file.category}
                          </p>
                        </div>
                      </div>
                    ))}
                    {files.length > 3 && (
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link to="/profile#files">View All ({files.length})</Link>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}